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

  /* ---- REVIEWS ------------------------------------------------------------ */
  function stars(n) {
    n = Math.round(n || 5);
    return new Array(Math.max(0, Math.min(5, n)) + 1).join('★');
  }

  function renderReviews() {
    var track = document.getElementById('revTrack');
    if (!track) return;
    var groq =
      '*[_type=="review" && defined(quote)]|order(order asc, _createdAt asc){' +
      'quote,author,rating,source,procedure}';
    query(groq).then(function (reviews) {
      if (!reviews || !reviews.length) return; // keep static fallback
      track.innerHTML = reviews.map(function (r) {
        var cite = [r.author || 'Verified patient', r.source].filter(Boolean).join(' · ');
        return '<blockquote class="review">' +
          '<div class="rev-stars" aria-hidden="true">' + stars(r.rating) + '</div>' +
          '<p class="rev-text">' + esc(r.quote) + '</p>' +
          '<cite>' + esc(cite) + '</cite>' +
          '</blockquote>';
      }).join('');
      if (window.setupReviews) window.setupReviews();
    }).catch(function (e) { console.warn(e); });
  }

  /* ---- BEFORE & AFTER ----------------------------------------------------- */
  function baCardHTML(c) {
    var before = imageUrl({ url: c.beforeUrl }, { width: 900, quality: 82 });
    var after = imageUrl({ url: c.afterUrl }, { width: 900, quality: 82 });
    return '<figure class="ba-card">' +
      '<div class="ba-slider" style="--pos:50%">' +
        '<img class="ba-img ba-after" src="' + esc(after) + '" alt="' + esc(c.caption + ', after') + '" />' +
        '<img class="ba-img ba-before" src="' + esc(before) + '" alt="' + esc(c.caption + ', before') + '" />' +
        '<span class="ba-tagline ba-tag-before">Before</span>' +
        '<span class="ba-tagline ba-tag-after">After</span>' +
        '<button class="ba-handle" aria-label="Drag to compare before and after"><span class="ba-grip">‹ ›</span></button>' +
      '</div>' +
      '<figcaption>' + esc(c.caption) + '</figcaption>' +
    '</figure>';
  }

  function renderBeforeAfter() {
    var panels = document.querySelector('.ba-panels');
    if (!panels) return;
    var groq =
      '*[_type=="beforeAfterCase" && defined(afterImage) && defined(beforeImage)]|order(order asc, _createdAt asc){' +
      'caption,category,"beforeUrl":beforeImage.asset->url,"afterUrl":afterImage.asset->url}';
    query(groq).then(function (cases) {
      if (!cases || !cases.length) return; // keep static fallback
      var byCat = { breast: [], body: [], face: [] };
      cases.forEach(function (c) {
        var key = (c.category || 'Breast').toLowerCase();
        if (!byCat[key]) byCat[key] = [];
        byCat[key].push(c);
      });
      Object.keys(byCat).forEach(function (key) {
        var panel = panels.querySelector('.ba-panel[data-panel="' + key + '"]');
        if (!panel) return;
        var list = byCat[key];
        if (!list.length) return; // leave the static "being prepared" note
        var oneClass = list.length === 1 ? ' ba-grid-one' : '';
        panel.innerHTML = '<div class="ba-grid' + oneClass + '">' + list.map(baCardHTML).join('') + '</div>';
      });
      if (window.bindBASliders) window.bindBASliders();
    }).catch(function (e) { console.warn(e); });
  }

  /* ---- SITE SETTINGS (global) --------------------------------------------- */
  function telHref(phone) {
    var digits = String(phone).replace(/[^\d+]/g, '');
    if (digits.charAt(0) === '0') digits = '+44' + digits.slice(1);
    return 'tel:' + digits;
  }

  function renderSiteSettings() {
    var groq = '*[_type=="siteSettings"][0]{phone,email,gmcNumber,surgeonName,credentials,' +
      'reviewScore,reviewCount,reviewSource,locations}';
    query(groq).then(function (s) {
      if (!s) return;

      // Header + footer phone
      if (s.phone) {
        var href = telHref(s.phone);
        document.querySelectorAll('.header-phone').forEach(function (el) {
          el.textContent = s.phone; el.setAttribute('href', href);
        });
        document.querySelectorAll('.header-phone-icon').forEach(function (el) {
          el.setAttribute('href', href);
          el.setAttribute('aria-label', 'Call ' + s.phone);
        });
      }

      // Footer contact block: first <p> = phone, second = email
      var contactP = document.querySelectorAll('.foot-contact p');
      if (contactP[0] && s.phone) contactP[0].textContent = s.phone;
      if (contactP[1] && s.email) contactP[1].textContent = s.email;

      // Footer GMC / credentials line
      if (s.gmcNumber) {
        var bottom = document.querySelectorAll('.foot-bottom p');
        if (bottom[0]) {
          bottom[0].innerHTML = '© <span id="year">' + new Date().getFullYear() +
            '</span> RV Plastic Surgery · Leonie Grace Limited · GMC ' + esc(s.gmcNumber);
        }
      }

      // Footer locations
      if (s.locations && s.locations.length) {
        var locWrap = document.querySelector('.foot-locations');
        if (locWrap) {
          locWrap.innerHTML = '<h5>Locations</h5>' + s.locations.map(function (l) {
            var addr = [l.address].filter(Boolean).join('');
            return '<p><strong>' + esc(l.name || '') + '</strong>' +
              (addr ? '<br>' + esc(addr) : '') + '</p>';
          }).join('');
        }
      }

      // Homepage review rating
      if (s.reviewScore || s.reviewCount) {
        var meta = document.querySelector('.rating-meta');
        if (meta) {
          var p = meta.querySelector('p');
          if (p) {
            var score = s.reviewScore || '5.0';
            var count = s.reviewCount != null ? s.reviewCount : '';
            p.innerHTML = '<strong>' + esc(score) + '</strong>' +
              (count !== '' ? ' · ' + esc(count) + ' verified reviews' : ' · verified reviews');
          }
        }
      }
    }).catch(function (e) { console.warn(e); });
  }

  /* ---- PROCEDURE (Breast Lift) -------------------------------------------- */
  var GLANCE_ICONS = {
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
    briefcase: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V8"/><path d="M3 13h18"/>',
    home: '<path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/>',
    droplet: '<path d="M12 3.5c3 3.2 5.5 6.1 5.5 9.3A5.5 5.5 0 0 1 6.5 12.8C6.5 9.6 9 6.7 12 3.5z"/>',
    walk: '<circle cx="13" cy="4.6" r="1.5"/><path d="M11.5 8.5l-1.5 4 2.2 1.8V20"/><path d="M10 12.5l-3 1.8"/><path d="M12.2 14.3l2.8 2.2"/>',
    activity: '<path d="M3 12h4l2.5 7 4-14 2.5 7H21"/>',
    heart: '<path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 6a4.4 4.4 0 0 1 8.5 2.9C20.5 15 12 20.5 12 20.5Z"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.4l2.4 2.4 4.6-5.2"/>',
    navigation: '<path d="M12 3l7.5 17-7.5-3.7L4.5 20 12 3Z"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z"/>',
    chat: '<path d="M20 4H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4v4l4-4h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>',
    clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4.5V4A1.5 1.5 0 0 1 10.5 2.5h3A1.5 1.5 0 0 1 15 4v.5"/><path d="M9 11h6M9 15h4"/>'
  };
  function glanceSvg(icon) {
    var inner = GLANCE_ICONS[icon] || GLANCE_ICONS.check;
    return '<svg class="gi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  // small DOM helpers — only touch the node when the CMS actually has a value
  function setText(id, val) { var el = document.getElementById(id); if (el && val) el.textContent = val; }
  function setList(id, arr, mapFn) {
    if (!arr || !arr.length) return;
    var el = document.getElementById(id); if (el) el.innerHTML = arr.map(mapFn).join('');
  }
  function setImg(id, url, opts) {
    if (!url) return;
    var el = document.getElementById(id); if (el) el.setAttribute('src', imageUrl({ url: url }, opts || { width: 1200, quality: 82 }));
  }
  function setPortable(id, blocks) {
    if (!blocks || !blocks.length) return;
    var el = document.getElementById(id); if (el) el.innerHTML = renderPortableText(blocks);
  }

  function renderProcedure() {
    var tag = document.querySelector('script[data-procedure]');
    if (!tag) return;
    var slug = tag.getAttribute('data-procedure');
    if (!slug) return;

    var groq =
      '*[_type=="procedure" && slug.current==$slug][0]{' +
      'title,heroPromise,benefits,' +
      'overviewHeading,overviewBody[]{...,_type=="image"=>{"assetUrl":asset->url,alt}},"overviewImg":overviewImage.asset->url,' +
      'atAGlance[]{icon,label,value},' +
      'candidatesIntro,candidates,candidatesOutro,"candImg":candidatesImage.asset->url,' +
      'techniquesIntro,"techImg":techniquesImage.asset->url,techniques[]{name,tier,description},' +
      'procedureHeading,procedureBody[]{...,_type=="image"=>{"assetUrl":asset->url,alt}},"procImg":procedureImage.asset->url,' +
      'recovery[]{stage,description},' +
      'risksIntro,risks[]{title,description},' +
      'surgeonQuote,costFrom,costIntro,costIncludes,' +
      'faqs[]{question,answer},hiddenSections,seoTitle,seoDescription}';

    query(groq, { slug: slug }).then(function (p) {
      if (!p) return; // no procedure doc yet — keep static page

      // Hide any sections the editor has switched off (and their sub-nav links)
      if (p.hiddenSections && p.hiddenSections.length) {
        p.hiddenSections.forEach(function (id) {
          var sec = document.getElementById(id);
          if (sec && sec.tagName === 'SECTION') sec.style.display = 'none';
          var link = document.querySelector('.proc-subnav a[href="#' + id + '"]');
          if (link) link.style.display = 'none';
        });
      }

      // SEO
      if (p.seoTitle) document.title = p.seoTitle;
      if (p.seoDescription) {
        var md = document.querySelector('meta[name="description"]');
        if (md) md.setAttribute('content', p.seoDescription);
      }

      // Hero
      setText('p-title', p.title);
      setText('p-hero-sub', p.heroPromise);
      setList('p-benefits', p.benefits, function (b) { return '<li>' + esc(b) + '</li>'; });

      // Overview
      setText('p-overview-h', p.overviewHeading);
      setPortable('p-overview-body', p.overviewBody);
      setImg('p-overview-img', p.overviewImg, { width: 900, quality: 82 });

      // At a glance
      setList('p-glance', p.atAGlance, function (g) {
        return '<div class="glance-item">' + glanceSvg(g.icon) +
          '<div><h4>' + esc(g.label) + '</h4><p>' + esc(g.value) + '</p></div></div>';
      });

      // Candidates
      setText('p-cand-intro', p.candidatesIntro);
      setList('p-candidates', p.candidates, function (c) { return '<li>' + esc(c) + '</li>'; });
      setText('p-cand-outro', p.candidatesOutro);
      setImg('p-cand-img', p.candImg, { width: 900, quality: 82 });

      // Techniques
      setText('p-tech-intro', p.techniquesIntro);
      setImg('p-tech-img', p.techImg, { width: 900, quality: 88 });
      setList('p-techniques', p.techniques, function (t) {
        var head = esc(t.name) + (t.tier ? ' · ' + esc(t.tier) : '');
        return '<li><strong>' + head + '</strong>' + (t.description ? '<span>' + esc(t.description) + '</span>' : '') + '</li>';
      });

      // The procedure
      setText('p-proc-h', p.procedureHeading);
      setPortable('p-proc-body', p.procedureBody);
      setImg('p-proc-img', p.procImg, { width: 1600, quality: 78 });

      // Recovery
      setList('p-recovery', p.recovery, function (r) {
        return '<li><h4>' + esc(r.stage) + '</h4><p>' + esc(r.description) + '</p></li>';
      });

      // Risks
      setText('p-risks-intro', p.risksIntro);
      setList('p-risks', p.risks, function (r) {
        return '<li><strong>' + esc(r.title) + '</strong>' + esc(r.description) + '</li>';
      });

      // Surgeon quote (wrapped in <em> to match the static styling)
      if (p.surgeonQuote) {
        var sq = document.getElementById('p-surgeon-quote');
        if (sq) sq.innerHTML = '<em>“' + esc(p.surgeonQuote) + '”</em>';
      }

      // Cost
      setText('p-cost-figure', p.costFrom);
      setText('p-cost-intro', p.costIntro);
      setList('p-cost-incl', p.costIncludes, function (c) { return '<li>' + esc(c) + '</li>'; });

      // FAQs
      setList('p-faqs', p.faqs, function (f) {
        return '<details class="faq-item"><summary>' + esc(f.question) + '</summary><p>' + esc(f.answer) + '</p></details>';
      });

      revealNew();
    }).catch(function (e) { console.warn(e); });
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
    renderSiteSettings();
    renderReviews();
    renderBeforeAfter();
    renderBlogListing();
    renderBlogDetail();
    renderProcedure();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // expose for other pages / debugging
  window.RVSanity = { query: query, imageUrl: imageUrl, renderPortableText: renderPortableText, formatDate: formatDate };
})();
