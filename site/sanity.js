/* ==========================================================================
   Sanity content layer for RV Plastic Surgery
   --------------------------------------------------------------------------
   The site is static HTML. This file progressively enhances the pages:
   when the Sanity dataset has content, it renders it in place of the
   hand-written placeholders. If Sanity is unreachable or empty, the
   existing static markup is left untouched, so nothing ever breaks.
   ========================================================================== */
(function () {
  'use strict';

  var PROJECT_ID = 'xtpxp7mw';
  var DATASET = 'production';
  var API_VERSION = '2024-01-01';

  var API_BASE =
    'https://' + PROJECT_ID + '.apicdn.sanity.io/v' + API_VERSION +
    '/data/query/' + DATASET;

  /* ---- core fetch --------------------------------------------------------- */
  function query(groq, params) {
    var url = API_BASE + '?query=' + encodeURIComponent(groq);
    if (params) {
      Object.keys(params).forEach(function (k) {
        url += '&$' + k + '=' + encodeURIComponent(JSON.stringify(params[k]));
      });
    }
    return fetch(url, { headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('Sanity ' + r.status);
        return r.json();
      })
      .then(function (json) { return json.result; });
  }

  /* ---- image url builder -------------------------------------------------- */
  // Accepts either a resolved asset url, or an image object with asset->url.
  function imageUrl(source, opts) {
    if (!source) return '';
    var url = typeof source === 'string' ? source : (source.url || '');
    if (!url) return '';
    opts = opts || {};
    var q = [];
    if (opts.width) q.push('w=' + opts.width);
    if (opts.height) q.push('h=' + opts.height);
    if (opts.width || opts.height) { q.push('fit=crop'); q.push('auto=format'); }
    else q.push('auto=format');
    if (opts.quality) q.push('q=' + opts.quality);
    return url + (url.indexOf('?') === -1 ? '?' : '&') + q.join('&');
  }

  /* ---- helpers ------------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function readingTime(blocks) {
    if (!blocks || !blocks.length) return '';
    var words = 0;
    blocks.forEach(function (b) {
      if (b._type === 'block' && b.children) {
        b.children.forEach(function (c) {
          if (c.text) words += c.text.split(/\s+/).filter(Boolean).length;
        });
      }
    });
    if (!words) return '';
    return Math.max(1, Math.round(words / 200)) + ' min read';
  }

  function getQueryParam(name) {
    var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }

  /* ---- portable text -> html --------------------------------------------- */
  function renderMarks(child, block) {
    var text = esc(child.text || '');
    if (child.text === '') return '<br>';
    var marks = child.marks || [];
    var defs = (block.markDefs || []);
    // wrap decorators
    marks.forEach(function (m) {
      var def = defs.filter(function (d) { return d._key === m; })[0];
      if (def && def._type === 'link') {
        text = '<a href="' + esc(def.href) + '" rel="noopener"'
             + (/^https?:/.test(def.href || '') ? ' target="_blank"' : '') + '>' + text + '</a>';
      } else if (m === 'strong') text = '<strong>' + text + '</strong>';
      else if (m === 'em') text = '<em>' + text + '</em>';
      else if (m === 'underline') text = '<u>' + text + '</u>';
      else if (m === 'strike-through') text = '<s>' + text + '</s>';
      else if (m === 'code') text = '<code>' + text + '</code>';
    });
    return text;
  }

  function renderBlock(block) {
    if (block._type === 'image') {
      var src = imageUrl({ url: block.assetUrl }, { width: 1400, quality: 82 });
      if (!src) return '';
      return '<figure class="prose-img"><img src="' + esc(src) + '" alt="'
           + esc(block.alt || '') + '" loading="lazy"></figure>';
    }
    if (block._type !== 'block') return '';
    var inner = (block.children || []).map(function (c) { return renderMarks(c, block); }).join('');
    var style = block.style || 'normal';
    if (style === 'blockquote') return '<blockquote>' + inner + '</blockquote>';
    if (/^h[1-6]$/.test(style)) return '<' + style + '>' + inner + '</' + style + '>';
    return '<p>' + inner + '</p>';
  }

  // Group consecutive list items into <ul>/<ol>
  function renderPortableText(blocks) {
    if (!blocks || !blocks.length) return '';
    var html = '';
    var listType = null, listItems = [];
    function flush() {
      if (!listType) return;
      var tag = listType === 'number' ? 'ol' : 'ul';
      html += '<' + tag + '>' + listItems.join('') + '</' + tag + '>';
      listType = null; listItems = [];
    }
    blocks.forEach(function (b) {
      if (b._type === 'block' && b.listItem) {
        if (listType && listType !== b.listItem) flush();
        listType = b.listItem;
        var inner = (b.children || []).map(function (c) { return renderMarks(c, b); }).join('');
        listItems.push('<li>' + inner + '</li>');
      } else {
        flush();
        html += renderBlock(b);
      }
    });
    flush();
    return html;
  }

  /* ---- BLOG LISTING ------------------------------------------------------- */
  function renderBlogListing() {
    var featureEl = document.querySelector('.blog-feature');
    var gridEl = document.querySelector('.blog-grid');
    if (!featureEl && !gridEl) return;

    var groq =
      '*[_type=="blogPost" && defined(publishedAt)]|order(featured desc, publishedAt desc){' +
      '_id,title,"slug":slug.current,excerpt,publishedAt,featured,' +
      '"coverUrl":coverImage.asset->url,"coverAlt":coverImage.alt,' +
      '"plain":pt::text(body)}';

    query(groq).then(function (posts) {
      if (!posts || !posts.length) return; // keep static fallback
      posts.forEach(function (p) {
        var w = p.plain ? p.plain.split(/\s+/).filter(Boolean).length : 0;
        p._read = w ? Math.max(1, Math.round(w / 200)) + ' min read' : '';
      });

      var featured = posts.filter(function (p) { return p.featured; })[0] || posts[0];

      if (featureEl && featured) {
        featureEl.innerHTML = blogFeatureHTML(featured);
      }

      if (gridEl) {
        var rest = posts.filter(function (p) { return p._id !== featured._id; });
        if (!rest.length && !featureEl) rest = posts;
        gridEl.innerHTML = rest.map(blogCardHTML).join('');
      }

      revealNew();
    }).catch(function (e) { /* silent: static fallback stays */ console.warn(e); });
  }

  function blogFeatureHTML(p) {
    var img = p.coverUrl ? imageUrl({ url: p.coverUrl }, { width: 900, quality: 82 })
                         : 'images/web/blog-choosing.png';
    var meta = [formatDate(p.publishedAt), p._read].filter(Boolean).join(' · ');
    return '' +
      '<a class="bf-link" href="blog-post.html?slug=' + encodeURIComponent(p.slug || '') + '">' +
      '<img src="' + esc(img) + '" alt="' + esc(p.coverAlt || p.title) + '" />' +
      '<div class="bf-body">' +
        '<span class="post-cat">Editor’s Pick</span>' +
        '<h2 class="display">' + esc(p.title) + '</h2>' +
        (p.excerpt ? '<p class="body">' + esc(p.excerpt) + '</p>' : '') +
        (meta ? '<p class="post-meta">' + esc(meta) + '</p>' : '') +
      '</div></a>';
  }

  function blogCardHTML(p) {
    var img = p.coverUrl ? imageUrl({ url: p.coverUrl }, { width: 600, quality: 80 })
                         : 'images/web/blog-consultation.png';
    var meta = [formatDate(p.publishedAt), p._read].filter(Boolean).join(' · ');
    return '' +
      '<article class="post-card reveal">' +
      '<a class="post-link" href="blog-post.html?slug=' + encodeURIComponent(p.slug || '') + '">' +
        '<div class="post-img"><img src="' + esc(img) + '" alt="' + esc(p.coverAlt || p.title) + '" loading="lazy" /></div>' +
        '<div class="post-body">' +
          '<span class="post-cat">Journal</span>' +
          '<h3>' + esc(p.title) + '</h3>' +
          (p.excerpt ? '<p class="post-excerpt">' + esc(p.excerpt) + '</p>' : '<p class="post-excerpt"></p>') +
          (meta ? '<p class="post-meta">' + esc(meta) + '</p>' : '') +
        '</div>' +
      '</a></article>';
  }

  /* ---- BLOG DETAIL -------------------------------------------------------- */
  function renderBlogDetail() {
    var root = document.getElementById('blogPost');
    if (!root) return;
    var slug = getQueryParam('slug');
    if (!slug) { root.innerHTML = notFoundHTML(); return; }

    var groq =
      '*[_type=="blogPost" && slug.current==$slug][0]{' +
      'title,excerpt,publishedAt,' +
      '"coverUrl":coverImage.asset->url,"coverAlt":coverImage.alt,' +
      'body[]{...,_type=="image"=>{"assetUrl":asset->url,alt}}}';

    query(groq, { slug: slug }).then(function (p) {
      if (!p) { root.innerHTML = notFoundHTML(); return; }
      document.title = p.title + ' | RV Plastic Surgery';
      var meta = [formatDate(p.publishedAt), readingTime(p.body)].filter(Boolean).join(' · ');
      var hero = p.coverUrl
        ? '<div class="bp-cover"><img src="' + esc(imageUrl({ url: p.coverUrl }, { width: 1600, quality: 82 })) +
          '" alt="' + esc(p.coverAlt || p.title) + '" /></div>'
        : '';
      root.innerHTML =
        '<div class="bp-head reveal">' +
          '<a class="bp-back" href="blog.html">← The Journal</a>' +
          '<h1 class="display">' + esc(p.title) + '</h1>' +
          (meta ? '<p class="bp-meta">' + esc(meta) + '</p>' : '') +
        '</div>' +
        hero +
        '<article class="bp-body prose reveal">' + renderPortableText(p.body) + '</article>';
      revealNew();
    }).catch(function () { root.innerHTML = notFoundHTML(); });
  }

  function notFoundHTML() {
    return '<div class="bp-head reveal" style="text-align:center">' +
      '<h1 class="display">Article not found</h1>' +
      '<p class="bp-meta">This piece may have moved. Return to <a href="blog.html">the Journal</a>.</p>' +
      '</div>';
  }

  /* ---- REVEAL ------------------------------------------------------------- */
  function revealNew() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          setTimeout(function () { e.target.classList.add('in'); }, (i % 4) * 90);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
  }

  /* ---- boot --------------------------------------------------------------- */
  function boot() {
    renderBlogListing();
    renderBlogDetail();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // expose for other pages / debugging
  window.RVSanity = { query: query, imageUrl: imageUrl, renderPortableText: renderPortableText, formatDate: formatDate };
})();
