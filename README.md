# Token Swapper · gra.UI.ty

A Figma plugin for the Newton School product design team. Select a flow and it finds every colour, text style, spacing and corner radius that isn't on **gra.UI.ty**, then links it to the published library in a click.

**[⬇ Download the plugin (.zip)](docs/token-swapper-grauity.zip)** · **[Full guide](https://claude.ai/artifact/8Z1yxB7HzQrApCMEoPj8DC)** (ask Aarushi for access if it doesn't open)

---

## Install (once, about 2 minutes)

1. **Download and unzip** [`token-swapper-grauity.zip`](docs/token-swapper-grauity.zip). Move the **Token Swapper** folder somewhere permanent, like `Documents/Figma plugins`. Figma runs the plugin from this folder.
2. **Open the Figma desktop app.** Development plugins don't run in the browser.
3. **Import it:** in any design file, go to **Menu › Plugins › Development › Import plugin from manifest…** and pick `manifest.json` inside the folder.
4. **Run it:** **Plugins › Development › Design Token Swapper (gra.UI.ty)**.

> **Updating:** download the new zip and replace the three files in the same folder. Figma uses the new version the next time you run it, so you don't need to import it again.

## Use it

1. **Select a frame** (a screen or the whole flow). It scans every nested layer.
2. **Read the overview.** The tiles count what was found for Color, Text, Radius, Spacing and Padding. Click one to filter.
3. **Review the rows.** Each reads **old → new**: the old token (or raw value) and the gra.UI.ty token it becomes. Tick the ones you want, or pick another token.
4. **Apply** links every ticked row to the library. The swap icon on a row replaces just that one, straight away.

When nothing's left, you'll see **Good to go**, so send it to dev.

## What the sections mean

| Section | Meaning |
|---|---|
| **Ready to apply** | Exact match. Ticked by default. |
| **Resolved via context** | Several tokens fit, so it picked one using a clue (theme-aware over static, component name, other copies, closest line height, or a difference too small to see). Hover ⓘ to see which. |
| **Needs your pick** | Several tokens fit and nothing decides it. Choose one. |
| **Check before replacing** | The nearest token looks visibly different (ΔE over 5). Most severe first; hover ⚠ for how likely it is to stand out. |
| **No matching token** | A close token is suggested. This includes off-scale spacing and radius, and text styles that don't match. |
| **Inside components** | Found inside component instances. Fixes become overrides on that copy. |
| **Left alone** | Plain hex in illustrations and logos, colours with opacity, negative spacing, and anything you ignored. Old tokens are still flagged inside artwork. |

## Tips

- **×N similar:** repeated elements with the same problem are one row. Fix it once; click the badge to split them out.
- **Right-click a row** to *Ignore this layer* (or everything in its group), or *Check this anyway* on something left alone. Saved in the file for everyone.
- **Invert mode** (settings) is for dark screens. One screen only ever gets one token family.
- **All-caps text** is only matched to uppercase styles, like the overlines.
- Your ticks and picks survive a Replace or Apply.

## Troubleshooting

- **A spacing fix inside a component failed:** Figma doesn't allow some layout overrides on component copies. Fix it in the main component.
- **Stuck on "Applying…":** open **Plugins › Development › Show/Hide console** and send the error over.

Questions, bugs or ideas? Message Aarushi in **#core-design**.

---

### For maintainers

The plugin is `manifest.json`, `code.js` and `ui.html`. After changing them, run `./package.sh` to rebuild `docs/token-swapper-grauity.zip`, then commit both. The guide is `docs/index.html`; the shared copy lives at the private link above. If the repo ever goes public (or on a paid GitHub plan), it can also be served with **GitHub Pages** (Settings › Pages › Deploy from branch › `/docs`).
