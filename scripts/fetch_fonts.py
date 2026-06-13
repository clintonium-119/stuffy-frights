#!/usr/bin/env python3
"""Fetch the bundled display/accent fonts (Google Fonts) into public/fonts/.

All fonts are freely redistributable (SIL Open Font License 1.1, except Special
Elite which is Apache License 2.0) — see public/fonts/CREDITS.md. Re-run to
refresh; downloads the latin-subset woff2 of each family and names it by role.

Google Fonts' css2 endpoint returns woff2 URLs only when queried with a modern
browser User-Agent; we parse the `/* latin */` @font-face block and grab its url.
"""
import os
import re
import sys
import urllib.request

CSS2 = "https://fonts.googleapis.com/css2?family={}&display=swap"
# A modern UA is required or css2 serves legacy TTF instead of woff2.
UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0 Safari/537.36 stuffy-frights-font-fetch/1.0"
)

# role/out-name -> Google Fonts family query string
MANIFEST = {
    "title": "Creepster",        # creepy display face for the game title (OFL)
    "easy": "Patrick+Hand",      # soft childlike hand — Tuck-In (OFL)
    "medium": "Special+Elite",   # eerie typewriter — Lights Out (Apache 2.0)
    "hard": "Eater",             # jagged/melting horror — Night Terror (OFL)
    "nightmare": "Nosifer",      # dripping blood — Stuffy FrightMare (OFL)
}

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "fonts")


def _req(url):
    return urllib.request.Request(url, headers={"User-Agent": UA})


def fetch_css(family):
    with urllib.request.urlopen(_req(CSS2.format(family)), timeout=30) as r:
        return r.read().decode("utf-8")


def latin_woff2(css):
    """Pick the woff2 URL from the `/* latin */` block, else the last woff2."""
    blocks = re.split(r"/\*\s*([\w-]+)\s*\*/", css)
    # re.split with a capture group yields [pre, name, body, name, body, ...]
    chosen = None
    last = None
    it = iter(blocks[1:])
    for name, body in zip(it, it):
        m = re.search(r"url\(([^)]+\.woff2)\)", body)
        if not m:
            continue
        last = m.group(1)
        if name.strip() == "latin":
            chosen = m.group(1)
    return chosen or last


def download(url, dest):
    with urllib.request.urlopen(_req(url), timeout=120) as r, open(dest, "wb") as f:
        f.write(r.read())


def main():
    os.makedirs(OUT, exist_ok=True)
    ok, fail = 0, 0
    for role, family in MANIFEST.items():
        try:
            css = fetch_css(family)
            url = latin_woff2(css)
            if not url:
                print(f"  ! {role} ({family}): no woff2 url in css", file=sys.stderr)
                fail += 1
                continue
            dest = os.path.join(OUT, f"{role}.woff2")
            download(url, dest)
            size = os.path.getsize(dest)
            print(f"  ok {role:9s} <- {family:14s} {size:>7d} bytes")
            ok += 1
        except Exception as e:  # noqa: BLE001 — report and continue
            print(f"  ! {role} ({family}): {e}", file=sys.stderr)
            fail += 1
    print(f"done: {ok} ok, {fail} failed -> {os.path.normpath(OUT)}")
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
