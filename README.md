# ZL1 → ZL2 Control Converter

Browser-based tool to convert **Zalith Launcher 1 / Pojav / FCL** control JSON (`mControlDataList`) into **Zalith Launcher 2** control layouts (`editorVersion` + layers).

## Live site

After enabling GitHub Pages (Settings → Pages → Source: **Deploy from a branch** → Branch **main** / root):

**https://hackfireoffical.github.io/ZL1-to-ZL2-Control-Converter/**

## How to use

1. Open the site (or open `index.html` locally).
2. Drop / paste a ZL1 control `.json` file.
3. Click **Convert** → **Download ZL2 JSON**.
4. In Zalith Launcher 2: **Settings → Control list** → import the file.
5. Optionally tweak positions in the ZL2 editor (dynamic expressions are approximated on a reference resolution).

## What is converted

| ZL1 | ZL2 |
|-----|-----|
| Buttons (`mControlDataList`) | `normalButtons` + styles |
| Keycodes / special buttons | `clickEvents` (`key` / `launcher_event`) |
| `displayInGame` / `displayInMenu` | Layers `always` / `in_game` / `in_menu` |
| Joysticks (`mJoystickDataList`) | `joystickButtons` (basic) |
| Drawers | Flattened into buttons |

## Local

```bash
# just open index.html in a browser, or:
npx serve .
```

## License

Community tool. Formats based on [ZalithLauncher2](https://github.com/ZalithLauncher/ZalithLauncher2) LayerController and Pojav `ControlData`. Not affiliated with MovTery / official Zalith.
