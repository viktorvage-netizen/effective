#!/usr/bin/env python3
"""Turn VIDEO-A.md / VIDEO-B.md into submit-ready Seedance 2.0 job objects.

    python3 extract_blocks.py VIDEO-A.md            > video-a-jobs.json
    python3 extract_blocks.py VIDEO-A.md --from 13 --to 24 > wave2.json

Each job carries the shot prompt with the locked style block already appended, plus the
fixed generation parameters. The VO line rides along so narration can be batched from the
same file.
"""
import argparse
import json
import pathlib
import re
import sys

STYLE_BLOCK = (
    "flat 2D vector animation, bold clean black outlines of even weight, limited flat "
    "color palette of warm coral, deep teal, mustard yellow, off-white and charcoal, no "
    "gradients except subtle paper grain, simple geometric character construction with "
    "rounded shapes and no facial detail beyond eyes and brows, confident graphic shapes, "
    "clean negative space, smooth snappy 2D motion with slight squash and stretch, "
    "consistent line weight across all elements, flat illustrated backgrounds with minimal "
    "detail, non-photorealistic, illustrated, no live-action, no 3D render, no text or "
    "letters or numbers anywhere in frame"
)

PARAMS = {
    "resolution": "1080p",
    "mode": "std",
    "duration": 10,
    "aspect_ratio": "16:9",
    "generate_audio": False,
    "bitrate_mode": "high",
    "genre": "auto",
}

BLOCK_RE = re.compile(
    r"^\*\*(B\d{2}) · (\d+:\d{2})\*\* — VO: \"(.+?)\"\s*\nSHOT: (.+?)(?=\n\n|\Z)",
    re.MULTILINE | re.DOTALL,
)


def parse(path):
    text = pathlib.Path(path).read_text(encoding="utf-8")
    blocks = []
    for block_id, timecode, vo, shot in BLOCK_RE.findall(text):
        blocks.append(
            {
                "id": block_id,
                "timecode": timecode,
                "vo": vo.strip(),
                "shot": " ".join(shot.split()),
            }
        )
    return blocks


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--from", dest="start", type=int, default=1)
    ap.add_argument("--to", dest="end", type=int, default=60)
    args = ap.parse_args()

    blocks = parse(args.script)
    if len(blocks) != 60:
        print(f"warning: parsed {len(blocks)} blocks, expected 60", file=sys.stderr)

    jobs = []
    for b in blocks:
        n = int(b["id"][1:])
        if not args.start <= n <= args.end:
            continue
        jobs.append(
            {
                "index": n,
                "block": b["id"],
                "timecode": b["timecode"],
                "model": "seedance_2_0",
                "prompt": f"{b['shot']} {STYLE_BLOCK}",
                "vo": b["vo"],
                **PARAMS,
            }
        )

    json.dump(jobs, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
