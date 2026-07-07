import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

DIRECTORY = "/Users/work/Documents/Claude Code Projects/RV Plastic Surgery/site"
Handler = functools.partial(SimpleHTTPRequestHandler, directory=DIRECTORY)
ThreadingHTTPServer(("127.0.0.1", 4321), Handler).serve_forever()
