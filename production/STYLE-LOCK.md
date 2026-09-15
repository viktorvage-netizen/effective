# STYLE LOCK — append verbatim to every Seedance 2.0 clip prompt

Style drift is the thing that kills a 60-clip video. The fix is a byte-identical style
paragraph on every single call. Do not paraphrase it, do not "improve" it per shot.

## STYLE_BLOCK (paste unchanged at the end of every shot prompt)

> flat 2D vector animation, bold clean black outlines of even weight, limited flat
> color palette of warm coral, deep teal, mustard yellow, off-white and charcoal, no
> gradients except subtle paper grain, simple geometric character construction with
> rounded shapes and no facial detail beyond eyes and brows, confident graphic shapes,
> clean negative space, smooth snappy 2D motion with slight squash and stretch,
> consistent line weight across all elements, flat illustrated backgrounds with minimal
> detail, non-photorealistic, illustrated, no live-action, no 3D render, no text or
> letters or numbers anywhere in frame

## NEGATIVE (pass wherever the model accepts it; otherwise it is already covered above)

> photorealistic, live action, 3D render, CGI, gradients, lens flare, film grain,
> text, captions, watermarks, logos, numbers, letters, extra fingers, distorted faces,
> talking mouths, lip movement

## Non-negotiables baked into every prompt

1. **No on-screen text.** Every number and figure is carried by the voiceover and the
   burned subtitles. Generative models cannot spell reliably — do not give them the chance.
2. **Characters never talk.** No lip-sync, no mouthed speech. They emote and gesture only;
   the narrator is external. Write "the figure reacts with gesture only, does not speak"
   into any prompt with a person in it.
3. **Motion from frame 1.** No clip may open on a held still that "starts playing" a beat
   later. Every prompt states the motion that is already underway as the clip opens.
4. **Vary size and angle on every cut.** Rotate WIDE / MEDIUM / CLOSE-UP / overhead /
   low angle / macro. Never reopen two consecutive blocks on the same establishing wide.
   Never use over-the-shoulder on an object-only or diagram shot — it makes the model
   invent a person who isn't in the scene.
5. **Max ~20 seconds (2 blocks) per location** before moving. Rotate settings.

## Generation parameters (identical on every call)

```
model:          seedance_2_0
resolution:     "1080p"
mode:           "std"          # 1080p requires std; fast is 480p/720p only
duration:       10
aspect_ratio:   "16:9"
generate_audio: false          # narration is added in post; native audio would fight it
bitrate_mode:   "high"
genre:          "auto"
```

`aspect_ratio` does not inherit — pass it explicitly on every single call.
