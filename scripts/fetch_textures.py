#!/usr/bin/env python3
"""Fetch the curated CC0 PBR texture set from Poly Haven into public/textures/.

All assets are CC0 (public domain) — see public/textures/CREDITS.md. Re-run to
refresh; downloads the 1K JPG of each map and names them by role.
"""
import json
import os
import sys
import urllib.request

API = "https://api.polyhaven.com/files/{}"
UA = "Mozilla/5.0 (X11; Linux x86_64) stuffy-frights-texture-fetch/1.0"


def _req(url):
    return urllib.request.Request(url, headers={"User-Agent": UA})

# role -> (polyhaven asset id, {our map name: polyhaven map key})
MANIFEST = {
    "woodfloor":    ("wood_floor_deck",      {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough", "ao": "AO"}),
    "plaster":      ("plastered_wall_02",    {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough", "ao": "AO"}),
    "ceiling":      ("painted_plaster_wall", {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough"}),
    "concretefloor":("concrete_floor_02",    {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough", "ao": "AO"}),
    "concretewall": ("concrete_wall_008",    {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough", "ao": "AO"}),
    "woodprop":     ("wood_planks",          {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough"}),
    "fabric":       ("caban",                {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough"}),
    "carpet":       ("dirty_carpet",         {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough"}),
    "metal":        ("metal_plate",          {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough"}),
    "tile":         ("floor_tiles_06",       {"albedo": "Diffuse", "normal": "nor_gl", "rough": "Rough"}),
}

RES = "1k"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "textures")


def fetch_json(url):
    with urllib.request.urlopen(_req(url), timeout=30) as r:
        return json.load(r)


def download(url, dest):
    with urllib.request.urlopen(_req(url), timeout=120) as r, open(dest, "wb") as f:
        f.write(r.read())


def pick_url(files, ph_key):
    node = files.get(ph_key)
    if not node:
        return None
    res = node.get(RES) or next(iter(node.values()))
    jpg = res.get("jpg") or res.get("png")
    return jpg.get("url") if jpg else None


def main():
    ok, fail = 0, 0
    for role, (asset, maps) in MANIFEST.items():
        try:
            files = fetch_json(API.format(asset))
        except Exception as e:
            print(f"FAIL  {role} ({asset}) — API: {e}")
            fail += len(maps)
            continue
        d = os.path.join(OUT, role)
        os.makedirs(d, exist_ok=True)
        for name, ph_key in maps.items():
            url = pick_url(files, ph_key)
            if not url:
                print(f"miss  {role}/{name} — no {ph_key} {RES}")
                fail += 1
                continue
            dest = os.path.join(d, f"{name}.jpg")
            try:
                download(url, dest)
                print(f"ok    {role}/{name}.jpg  ({os.path.getsize(dest)//1024} KB)  <- {asset}/{ph_key}")
                ok += 1
            except Exception as e:
                print(f"FAIL  {role}/{name} — download: {e}")
                fail += 1
    print(f"\n{ok} downloaded, {fail} failed")
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
