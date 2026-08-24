"""Converts the procedure prose fields from plain strings to portable text.

  SANITY_AUTH_TOKEN=... python3 scripts/migrate-procedure-richtext.py --dry-run
  SANITY_AUTH_TOKEN=... python3 scripts/migrate-procedure-richtext.py

Those fields were given link support, which changes their type. Existing values
are plain strings, and Sanity Studio flags a string sitting in a rich text field
as an invalid value, so every procedure has to be migrated rather than only the
one being rewritten.

Idempotent: a field already holding blocks is left alone.
"""
import hashlib, json, os, subprocess, sys

PROJECT, DATASET = 'xtpxp7mw', 'production'
TOKEN = os.environ['SANITY_AUTH_TOKEN']
API = f'https://{PROJECT}.api.sanity.io/v2024-01-01'

TOP = ['heroPromise', 'conditionsIntro', 'benefitsIntro', 'candidatesIntro', 'candidatesOutro',
       'techniquesIntro', 'journeyIntro', 'recoveryIntro', 'risksIntro', 'whyIntro',
       'costIntro', 'costLead', 'ctaBody']
ARRAYS = {'techniques': 'description', 'journey': 'description',
          'recovery': 'description', 'faqs': 'answer'}


def curl(args):
    r = subprocess.run(['curl', '-sS', '-m', '120'] + args, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[:300])
    return json.loads(r.stdout)


def key(*parts):
    return hashlib.sha1('|'.join(parts).encode()).hexdigest()[:12]


def blocks(text, seed):
    """One block per paragraph, keys derived from the text so re-runs match."""
    out = []
    for i, para in enumerate(p.strip() for p in text.split('\n\n')):
        if not para:
            continue
        out.append({
            '_type': 'block', '_key': key(seed, str(i)), 'style': 'normal', 'markDefs': [],
            'children': [{'_type': 'span', '_key': key(seed, str(i), 's'), 'text': para, 'marks': []}],
        })
    return out


fields = ', '.join(TOP + list(ARRAYS))
docs = curl(['-G', f'{API}/data/query/{DATASET}', '--data-urlencode',
             f'query=*[_type=="procedure"]{{_id, {fields}}}',
             '-H', f'Authorization: Bearer {TOKEN}'])['result']

mutations, touched = [], 0
for d in docs:
    sets = {}
    for f in TOP:
        v = d.get(f)
        if isinstance(v, str) and v.strip():
            sets[f] = blocks(v, f'{d["_id"]}.{f}')
    for arr, sub in ARRAYS.items():
        items = d.get(arr)
        if not isinstance(items, list):
            continue
        if any(isinstance(it.get(sub), str) for it in items if isinstance(it, dict)):
            new = []
            for i, it in enumerate(items):
                it = dict(it)
                if isinstance(it.get(sub), str) and it[sub].strip():
                    it[sub] = blocks(it[sub], f'{d["_id"]}.{arr}.{i}')
                new.append(it)
            sets[arr] = new
    if sets:
        touched += 1
        mutations.append({'patch': {'id': d['_id'], 'set': sets}})
        print(f'{d["_id"][:44]:46s} {len(sets)} field(s)')

if not mutations:
    print('nothing to migrate')
    sys.exit(0)

if '--dry-run' in sys.argv:
    print(f'\n--dry-run: {touched} document(s) would change')
    sys.exit(0)

for b in range(0, len(mutations), 5):
    res = curl(['-X', 'POST', f'{API}/data/mutate/{DATASET}',
                '-H', f'Authorization: Bearer {TOKEN}',
                '-H', 'Content-Type: application/json',
                '-d', json.dumps({'mutations': mutations[b:b + 5]})])
    if 'error' in res:
        print('MUTATION ERROR:', json.dumps(res)[:400]); sys.exit(1)
print(f'\nmigrated {touched} procedure(s)')
