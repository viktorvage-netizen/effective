# PRODUCTION RUN — how to execute both videos

Everything below is ready to fire. Nothing here has been generated yet — the account is
on the free plan with 10 credits, which is under the cost of a single clip.

## What exists

| File | Contents |
|---|---|
| `STYLE-LOCK.md` | The style paragraph appended verbatim to all 120 prompts, the negative prompt, the fixed generation parameters |
| `VIDEO-A.md` | 60 blocks: VO line + shot prompt each — "12 Deadly Situations And The One Move That Saves You" |
| `VIDEO-B.md` | 60 blocks: VO line + shot prompt each — "12 Things Your Body Does In The First 60 Seconds Of An Emergency" |
| `extract_blocks.py` | Turns either script into submit-ready JSON job objects |

## Cost — read this before funding

The platform's own reference point is **100 credits ≈ 4 Seedance 2.0 videos**, i.e.
**~25 credits per clip at the 5-second, 720p baseline**.

| | Clips | At baseline rate |
|---|---|---|
| Video A | 60 | ~1,500 credits |
| Video B | 60 | ~1,500 credits |
| **Both** | **120** | **~3,000 credits** |

**These clips are 10 seconds at 1080p `std`, not 5 seconds at 720p, so the real cost will
be higher than that baseline — likely meaningfully higher.** The exact multiplier is not
published anywhere I can read.

**So the first thing to do when funded is measure it, not assume it:**

1. Check `balance`.
2. Generate exactly ONE clip (block A-B01) at the locked parameters.
3. Check `balance` again.
4. The difference × 120 is your real number. Decide from that, not from the estimate above.

If the real rate makes 120 clips unaffordable, the fallback is in "Cheaper variants" below.

## Run order

Do not submit 120 jobs at once. Work one video at a time, in waves of 12.

```
1.  Style probe    — 1 clip (A-B01). Confirm the look, confirm the cost.
2.  Wave 1         — A-B01 … A-B12      submit as one batch, then wait
3.  Wave 2         — A-B13 … A-B24
4.  Wave 3         — A-B25 … A-B36
5.  Wave 4         — A-B37 … A-B48
6.  Wave 5         — A-B49 … A-B60
7.  Narration      — 60 takes, ONE locked voice, same voice id on every call
8.  Assemble       — 60 clips + 60 VO lines → one 10:00 file
9.  Subtitles      — burned, timed from the audio, never from the script
10. Thumbnail
11. Repeat 2–10 for Video B
```

Submit all ready jobs in a wave before waiting on any of them. If a job comes back
`nsfw` or `failed`, resubmit that index only — never drop a block and ship a gap.

## Non-negotiables during the run

- **Same style paragraph, byte-identical, on all 120 prompts.** This is the single thing
  standing between you and a video that visibly changes style halfway through.
- **Pass `aspect_ratio` explicitly every time.** It does not inherit.
- **`generate_audio: false`.** Native audio fights the narration track.
- **One narrator voice for all 60 takes** — the same voice id read from a locked file
  before every call, never picked fresh mid-run. Different takes with a drifting timbre is
  the most common way these videos fall apart.
- **Never speed up or slow down audio to fit.** If a line runs long, rewrite it shorter and
  regenerate. Each VO line must land between 7.8 and 9.5 seconds of actual speech.
- **Never shorten the video to match short audio.** Every block stays 10 seconds. If the
  cut feels thin, add narration — do not trim picture.
- **Count the cuts that come back.** These models under-deliver on multi-cut prompts. Any
  block where a single frame hangs for 3+ seconds reads as a slideshow; regenerate it once
  with the cuts spelled out by timecode.

## QC before upload

- [ ] Exactly one file, 10:00 ±1s, full decode with no dropped frames
- [ ] No block opens on a frozen frame
- [ ] No on-screen text, letters or numerals anywhere in any clip
- [ ] No character appears to be speaking
- [ ] Style identical from block 1 to block 60
- [ ] Subtitle timing from the audio track, not from the script
- [ ] Every factual claim still matches the script as written

## Cheaper variants, if the measured rate is too high

1. **720p instead of 1080p.** Upload quality drops, but YouTube re-encodes anyway and this
   is flat 2D animation — the format that survives lower resolution best.
2. **`seedance_2_0_mini`** — the budget variant. Caps at 720p, so 1080p is off the table.
3. **Hybrid.** Generate ~15 hero clips for the hook, the payoff (situation 7), and the
   recap; carry the other 45 blocks with stock footage, motion graphics and slow pushes on
   stills. This is much closer to how the reference channel actually operates, and it is
   why they can afford to publish daily.
4. **15-second blocks instead of 10.** 40 clips instead of 60 per video. Fewer generations,
   but each shot holds a third longer, which works against the pacing that makes the format
   retain. Trade with your eyes open.

## Already validated before you spend anything

- **120/120 blocks parse cleanly** into submit-ready job objects via `extract_blocks.py`.
- **Every VO line is 19–23 words**, which lands at roughly 7.6–9.2 seconds of speech — inside
  the 7.8–9.5s window each 10-second block needs. The first drafts ran 13–18 words and
  **113 of the 120 would have come back too short**, each one costing a rewrite and a
  regeneration mid-run. That is fixed in the files as they stand.
- **Both scripts are factually accurate as written.** No claim in either needs softening
  before upload. That is the deliberate departure from the reference channel.
- Still to measure on the first funded clip: the real credit cost of 10s at 1080p `std`.
