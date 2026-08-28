# Visual thesis: the serious mixtape

Self-Study Checkpoints borrows the physical language of a cassette-era study zine: a carefully labelled tape, a clipped review slip, black photocopy texture, and one loud fluorescent ink. It suits the product because a checkpoint is deliberately assembled, passed hand-to-hand, and inspectable—more like a mixtape with liner notes than a glossy proprietary credential. Decoration only appears where it explains this handoff metaphor.

## Palette

This is an explicitly light, ink-on-paper treatment; dark mode is not used because the paper object is part of the information model. The page background is painted explicitly.

- `paper` `#F2E9D8`: warm recycled stock and the main canvas.
- `paper-raised` `#FFF9EC`: forms and review slips.
- `ink` `#191815`: near-black photocopier ink, 14.9:1 on paper.
- `ink-muted` `#5B554B`: annotation text, 6.4:1 on paper.
- `signal` `#E76847`: vermilion correction pencil and primary action; white text is not used on it. Ink text gives more than 4.5:1.
- `signal-soft` `#F5C94A`: highlighter and selected tabs; ink gives 11.4:1.
- `success` `#27634B`, `warning` `#855600`, `danger` `#A22C25`: status inks, paired with words/icons rather than color alone.
- `night` `#292722`: cassette wells and footer surface; paper text gives 12.4:1.

Subtle fibre/noise is authored in CSS. It stays below 4% opacity so it never competes with form content.

## Type

- Display and labels: `Arial Narrow`, `Roboto Condensed`, `Franklin Gothic Condensed`, sans-serif. Uppercase is reserved for short tape labels and wayfinding, with tracking for legibility.
- Reading and form text: `Georgia`, `Iowan Old Style`, serif. Its editorial voice makes criteria and evidence feel like material meant to be read closely.
- Monospace values/checksums: `ui-monospace`, `SFMono-Regular`, `Consolas`, monospace with tabular numerals.

These are system stacks—zero font downloads, no CDN, and reliable performance. The scale is 14, 16, 20, 28, 44–68px using fluid `clamp()` only at the display end. Body text never drops below 16px.

## Spacing and layout

An 8px base rhythm: 4 for tiny optical corrections; 8 for label gaps; 16/24 within groups; 32/48 between sections; 64/96 for major beats. The desktop workspace is a 12-column editorial spread. The planning steps occupy a narrow “track list” rail while the active sheet occupies the rest. At 760px the rail becomes a horizontal, scrollable progress strip; at 390px all controls stack and secondary helper copy is shortened, but no task is removed. Reading measure tops out near 68 characters.

Cards are reserved for genuinely separate artifacts: problem prompts, rubric lines, evidence files, and the final packet. Main form sections use open paper and rules rather than a dashboard grid.

## Interaction grammar

- A four-step “track list” provides location: Scope, Problems, Review, Packet.
- Selection looks like a paper tab marked with a highlighter, not a generic filled pill.
- Buttons depress by 2px against an offset ink shadow, like a mechanical tape key.
- Adding an item introduces a perforated slip directly below its origin; removing one requires confirmation and offers an undo toast.
- Every save is local and immediate; the header shows “Saved on this device.” Offline mode is framed as normal (“Offline—your desk still works”).
- Focus is a 3px signal outline with a 3px paper gap. Touch targets are at least 44px.

## Motion

UI transitions last 180–240ms and use only opacity/transform. Sheets enter from the tab that selected them; completion changes briefly stamp into place. No animation loops and no decorative parallax. Under `prefers-reduced-motion: reduce`, transitions and smooth scrolling become instant while state, layering, and labels remain intact.

## Asset plan and provenance

- Hero: an original generated landscape collage of a transparent cassette/checkpoint kit, cropped as an object with useful negative space. It establishes the hand-built commitment metaphor; it is not a UI screenshot and does not imply automated grading.
- Interface icons (check, download, link, lock, tape): original inline SVG using a shared 2px hand-drawn line system.
- Paper grain, punched holes, tape stripes, and rubric marks: CSS only.

### Image prompt sheet

Use case: stylized-concept. Asset type: landing-page hero. Subject: one late-1980s transparent audio cassette repurposed as a serious self-study kit, its label area holding abstract graph-paper marks and geometric proof symbols without readable text; a sharpened red pencil, a small punched review card, and a loop of magnetic tape forming a restrained check mark. World/materials: tactile cut-paper editorial collage, off-register risograph ink, photocopy grain, cream recycled paper, transparent smoky cassette plastic, tiny brass details. Composition: landscape, cassette anchored to the right with quiet negative paper space to the left, slightly top-down, clean silhouette, no cropped key objects. Light: hard desk-lamp shadow, focused and studious rather than nostalgic-cute. Palette words: warm paper, near-black ink, vermilion correction pencil, mustard highlighter, deep green approval mark. Negative list: no people, no hands, no brands, no logos, no readable words, no watermark, no gradients, no neon vaporwave, no UI mockup, no classroom stock-photo aesthetic, no copyrighted characters.

Generation method: Azure AI Foundry factory image deployment via `/opt/fleet/lib/gen-image.sh`, generated 2026-08-28. Generated images are original to this product and disclosed in the footer. Candidate prompts are stored beside the source PNGs in `assets/src/`. The selected image is visually reviewed for text artifacts, anatomy, unintended symbols/brands, palette, and seams, then exported to responsive WebP/AVIF with the mobile source below 300 KB.
