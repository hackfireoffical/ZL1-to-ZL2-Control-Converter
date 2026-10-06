/* ========== GLFW keycode → name (subset used by controls) ========== */
const GLFW = {
  32: "GLFW_KEY_SPACE", 39: "GLFW_KEY_APOSTROPHE", 44: "GLFW_KEY_COMMA",
  45: "GLFW_KEY_MINUS", 46: "GLFW_KEY_PERIOD", 47: "GLFW_KEY_SLASH",
  48: "GLFW_KEY_0", 49: "GLFW_KEY_1", 50: "GLFW_KEY_2", 51: "GLFW_KEY_3",
  52: "GLFW_KEY_4", 53: "GLFW_KEY_5", 54: "GLFW_KEY_6", 55: "GLFW_KEY_7",
  56: "GLFW_KEY_8", 57: "GLFW_KEY_9",
  59: "GLFW_KEY_SEMICOLON", 61: "GLFW_KEY_EQUAL",
  65: "GLFW_KEY_A", 66: "GLFW_KEY_B", 67: "GLFW_KEY_C", 68: "GLFW_KEY_D",
  69: "GLFW_KEY_E", 70: "GLFW_KEY_F", 71: "GLFW_KEY_G", 72: "GLFW_KEY_H",
  73: "GLFW_KEY_I", 74: "GLFW_KEY_J", 75: "GLFW_KEY_K", 76: "GLFW_KEY_L",
  77: "GLFW_KEY_M", 78: "GLFW_KEY_N", 79: "GLFW_KEY_O", 80: "GLFW_KEY_P",
  81: "GLFW_KEY_Q", 82: "GLFW_KEY_R", 83: "GLFW_KEY_S", 84: "GLFW_KEY_T",
  85: "GLFW_KEY_U", 86: "GLFW_KEY_V", 87: "GLFW_KEY_W", 88: "GLFW_KEY_X",
  89: "GLFW_KEY_Y", 90: "GLFW_KEY_Z",
  91: "GLFW_KEY_LEFT_BRACKET", 92: "GLFW_KEY_BACKSLASH", 93: "GLFW_KEY_RIGHT_BRACKET",
  96: "GLFW_KEY_GRAVE_ACCENT",
  256: "GLFW_KEY_ESCAPE", 257: "GLFW_KEY_ENTER", 258: "GLFW_KEY_TAB",
  259: "GLFW_KEY_BACKSPACE", 260: "GLFW_KEY_INSERT", 261: "GLFW_KEY_DELETE",
  262: "GLFW_KEY_RIGHT", 263: "GLFW_KEY_LEFT", 264: "GLFW_KEY_DOWN", 265: "GLFW_KEY_UP",
  266: "GLFW_KEY_PAGE_UP", 267: "GLFW_KEY_PAGE_DOWN", 268: "GLFW_KEY_HOME", 269: "GLFW_KEY_END",
  280: "GLFW_KEY_CAPS_LOCK", 281: "GLFW_KEY_SCROLL_LOCK", 282: "GLFW_KEY_NUM_LOCK",
  283: "GLFW_KEY_PRINT_SCREEN", 284: "GLFW_KEY_PAUSE",
  290: "GLFW_KEY_F1", 291: "GLFW_KEY_F2", 292: "GLFW_KEY_F3", 293: "GLFW_KEY_F4",
  294: "GLFW_KEY_F5", 295: "GLFW_KEY_F6", 296: "GLFW_KEY_F7", 297: "GLFW_KEY_F8",
  298: "GLFW_KEY_F9", 299: "GLFW_KEY_F10", 300: "GLFW_KEY_F11", 301: "GLFW_KEY_F12",
  340: "GLFW_KEY_LEFT_SHIFT", 341: "GLFW_KEY_LEFT_CONTROL", 342: "GLFW_KEY_LEFT_ALT",
  343: "GLFW_KEY_LEFT_SUPER", 344: "GLFW_KEY_RIGHT_SHIFT", 345: "GLFW_KEY_RIGHT_CONTROL",
  346: "GLFW_KEY_RIGHT_ALT", 347: "GLFW_KEY_RIGHT_SUPER", 348: "GLFW_KEY_MENU",
};

const SPECIAL = {
  [-1]: { type: "launcher_event", key: "launcher.event.switch_keyboard", label: "Keyboard" },
  [-2]: { type: "launcher_event", key: "launcher.event.toggle_menu", label: "GUI" },
  [-3]: { type: "launcher_event", key: "launcher.event.mouse_primary", label: "PRI" },
  [-4]: { type: "launcher_event", key: "launcher.event.mouse_secondary", label: "SEC" },
  [-5]: { type: "launcher_event", key: "launcher.event.virtual_mouse", label: "Mouse" },
  [-6]: { type: "launcher_event", key: "launcher.event.mouse_middle", label: "MID" },
  [-7]: { type: "launcher_event", key: "launcher.event.scroll_up", label: "SCROLLUP" },
  [-8]: { type: "launcher_event", key: "launcher.event.scroll_down", label: "SCROLLDOWN" },
  [-9]: { type: "launcher_event", key: "launcher.event.menu", label: "MENU" },
};

function uid(len = 12) {
  const hex = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < len; i++) s += hex[(Math.random() * 16) | 0];
  return s;
}

function tstr(defaultVal) {
  return { default: String(defaultVal ?? ""), matchQueue: [] };
}

function argbToUint(c) {
  if (c == null) return 0x80000000;
  return (c >>> 0);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function evalDynamic(expr, refW, refH, btnW, btnH, margin) {
  if (expr == null || expr === "") return 0;
  let s = String(expr).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  const map = {
    screen_width: refW, screen_height: refH, width: btnW, height: btnH,
    margin: margin, top: 0, left: 0, right: refW - btnW, bottom: refH - btnH, preferred_scale: 1,
  };
  s = s.replace(/\$\{([a-zA-Z_]+)\}/g, (_, k) => (map[k] === undefined ? "0" : String(map[k])));
  if (!/^[\d\s+\-*/().]+$/.test(s)) { console.warn("Unparseable dynamic expr:", expr); return 0; }
  try {
    const v = Function('"use strict"; return (' + s + ');')();
    return typeof v === "number" && isFinite(v) ? v : 0;
  } catch { return 0; }
}

function visibilityFromBtn(btn) {
  const inGame = btn.displayInGame !== false;
  const inMenu = btn.displayInMenu !== false;
  if (inGame && inMenu) return "always";
  if (inGame && !inMenu) return "in_game";
  if (!inGame && inMenu) return "in_menu";
  return "always";
}

function keyEventsFromKeycodes(keycodes) {
  const events = [];
  if (!Array.isArray(keycodes)) return events;
  for (const kc of keycodes) {
    if (kc == null || kc === 0) continue;
    if (SPECIAL[kc]) { events.push({ type: SPECIAL[kc].type, key: SPECIAL[kc].key }); continue; }
    const name = GLFW[kc];
    if (name) events.push({ type: "key", key: name });
    else if (kc > 0) events.push({ type: "key", key: "GLFW_KEY_" + kc });
  }
  return events;
}

function makeStyleFromBtn(btn) {
  const id = uid(12);
  const bg = argbToUint(btn.bgColor != null ? btn.bgColor : 0x4D000000);
  const stroke = argbToUint(btn.strokeColor != null ? btn.strokeColor : 0xFFFFFFFF);
  const alpha = typeof btn.opacity === "number" ? clamp(btn.opacity, 0, 1) : 1;
  const radius = typeof btn.cornerRadius === "number" ? clamp(btn.cornerRadius, 0, 100) : 0;
  const borderW = typeof btn.strokeWidth === "number" ? btn.strokeWidth : 0;
  const radiusObj = { topStart: radius, topEnd: radius, bottomEnd: radius, bottomStart: radius };
  const styleBlock = {
    alpha, pressedAlpha: clamp(alpha * 0.85, 0, 1),
    backgroundColor: bg, pressedBackgroundColor: bg,
    contentColor: 0xFFFFFFFF, pressedContentColor: 0xFFFFFFFF,
    borderWidth: borderW, pressedBorderWidth: borderW,
    borderColor: stroke, pressedBorderColor: stroke,
    borderRadius: radiusObj, pressedBorderRadius: { ...radiusObj },
  };
  return {
    name: (btn.name || "style") + "_" + id.slice(0, 4),
    uuid: id, animateSwap: false, commonStyle: false,
    lightStyle: styleBlock,
    darkStyle: { ...styleBlock, borderRadius: { ...radiusObj }, pressedBorderRadius: { ...radiusObj } },
  };
}

function convertButton(btn, refW, refH, margin) {
  const wDp = typeof btn.width === "number" ? btn.width : 50;
  const hDp = typeof btn.height === "number" ? btn.height : 50;
  const density = 2.5;
  const wPx = wDp * density, hPx = hDp * density;
  const xPx = evalDynamic(btn.dynamicX, refW, refH, wPx, hPx, margin);
  const yPx = evalDynamic(btn.dynamicY, refW, refH, wPx, hPx, margin);
  const x = clamp(Math.round((xPx / Math.max(refW - wPx, 1)) * 10000), 0, 10000);
  const y = clamp(Math.round((yPx / Math.max(refH - hPx, 1)) * 10000), 0, 10000);
  const widthPercentage = clamp(Math.round((wPx / refH) * 10000), 100, 10000);
  const heightPercentage = clamp(Math.round((hPx / refH) * 10000), 100, 10000);
  const style = makeStyleFromBtn(btn);
  const events = keyEventsFromKeycodes(btn.keycodes);
  const normal = {
    text: tstr(btn.name || "Btn"), uuid: uid(18),
    position: { x, y },
    buttonSize: {
      type: "percentage", widthDp: wDp, heightDp: hDp,
      widthPercentage, heightPercentage,
      widthReference: "screen_height", heightReference: "screen_height",
    },
    buttonStyle: style.uuid, textAlignment: "center",
    textBold: false, textItalic: false, textUnderline: false,
    visibilityType: visibilityFromBtn(btn), clickEvents: events,
    isSwipple: !!btn.isSwipeable, isPenetrable: !!btn.passThruEnabled, isToggleable: !!btn.isToggle,
  };
  return { normal, style };
}

function convertJoystick(joy, refW, refH, margin) {
  const wDp = typeof joy.width === "number" ? joy.width : 100;
  const hDp = typeof joy.height === "number" ? joy.height : 100;
  const density = 2.5;
  const wPx = wDp * density, hPx = hDp * density;
  const xPx = evalDynamic(joy.dynamicX || joy.x, refW, refH, wPx, hPx, margin);
  const yPx = evalDynamic(joy.dynamicY || joy.y, refW, refH, wPx, hPx, margin);
  const x = clamp(Math.round((xPx / Math.max(refW - wPx, 1)) * 10000), 0, 10000);
  const y = clamp(Math.round((yPx / Math.max(refH - hPx, 1)) * 10000), 0, 10000);
  const sizePct = clamp(Math.round((Math.max(wPx, hPx) / refH) * 10000), 500, 5000);
  return {
    text: tstr(joy.name || "Joystick"), uuid: uid(18),
    position: { x, y },
    buttonSize: {
      type: "percentage", widthDp: wDp, heightDp: hDp,
      widthPercentage: sizePct, heightPercentage: sizePct,
      widthReference: "screen_height", heightReference: "screen_height",
    },
    buttonStyle: null, visibilityType: visibilityFromBtn(joy),
    deadzone: 0.1, triggerMode: "follow",
  };
}

function convertZl1ToZl2(src, options) {
  const refW = options.refWidth || 1920;
  const refH = options.refHeight || 1080;
  const margin = 4;
  const warnings = [];
  if (!src || typeof src !== "object") throw new Error("Input is not a JSON object.");
  if (src.editorVersion != null && src.layers) {
    throw new Error("This looks like a Zalith Launcher 2 layout already (has editorVersion). Nothing to convert.");
  }
  const buttons = Array.isArray(src.mControlDataList) ? src.mControlDataList
    : Array.isArray(src.controlDataList) ? src.controlDataList : null;
  if (!buttons) throw new Error('Not a ZL1/Pojav control file: missing "mControlDataList".');
  const drawers = Array.isArray(src.mDrawerDataList) ? src.mDrawerDataList : [];
  const joysticks = Array.isArray(src.mJoystickDataList) ? src.mJoystickDataList : [];
  if (drawers.length) {
    warnings.push("Drawer groups (" + drawers.length + ") are flattened into normal buttons; regroup in the ZL2 editor if needed.");
  }
  const styles = [], normalButtons = [], joystickButtons = [];
  for (const btn of buttons) {
    const r = convertButton(btn, refW, refH, margin);
    styles.push(r.style); normalButtons.push(r.normal);
  }
  for (const drawer of drawers) {
    const childList = drawer.buttonProperties || drawer.buttons || drawer.mControlDataList || [];
    if (Array.isArray(childList)) {
      for (const btn of childList) {
        const r = convertButton(btn, refW, refH, margin);
        styles.push(r.style); normalButtons.push(r.normal);
      }
    }
    if (drawer.name || drawer.keycodes) {
      const r = convertButton(drawer, refW, refH, margin);
      styles.push(r.style); normalButtons.push(r.normal);
    }
  }
  for (const joy of joysticks) {
    try { joystickButtons.push(convertJoystick(joy, refW, refH, margin)); }
    catch (e) { warnings.push("Skipped a joystick: " + e.message); }
  }
  const always = normalButtons.filter(b => b.visibilityType === "always");
  const inGame = normalButtons.filter(b => b.visibilityType === "in_game");
  const inMenu = normalButtons.filter(b => b.visibilityType === "in_menu");
  const stripVis = (list) => list.map(b => Object.assign({}, b, { visibilityType: "always" }));
  const layers = [];
  if (always.length || joystickButtons.length) {
    layers.push({ name: "main", uuid: uid(12), hide: false, hideWhenMouse: true, hideWhenGamepad: true,
      visibilityType: "always", normalButtons: stripVis(always), textBoxes: [], joystickButtons });
  }
  if (inGame.length) {
    layers.push({ name: "in_game", uuid: uid(12), hide: false, hideWhenMouse: true, hideWhenGamepad: true,
      visibilityType: "in_game", normalButtons: stripVis(inGame), textBoxes: [], joystickButtons: [] });
  }
  if (inMenu.length) {
    layers.push({ name: "in_menu", uuid: uid(12), hide: false, hideWhenMouse: true, hideWhenGamepad: true,
      visibilityType: "in_menu", normalButtons: stripVis(inMenu), textBoxes: [], joystickButtons: [] });
  }
  if (!layers.length) {
    layers.push({ name: "main", uuid: uid(12), hide: false, hideWhenMouse: true, hideWhenGamepad: true,
      visibilityType: "always", normalButtons: [], textBoxes: [], joystickButtons: [] });
  }
  const layout = {
    info: {
      name: tstr(options.name || "Converted from ZL1"),
      author: tstr(options.author || "ZL1→ZL2 Converter"),
      description: tstr("Converted from Zalith Launcher 1 / Pojav control format"),
      versionCode: 1, versionName: "1.0",
    },
    layers, styles, joystickStyles: [], editorVersion: 12,
  };
  return {
    layout,
    stats: { buttons: normalButtons.length, joysticks: joystickButtons.length, styles: styles.length, layers: layers.length, drawers: drawers.length },
    warnings,
  };
}

const $ = (id) => document.getElementById(id);
const inputEl = $("input");
const outputEl = $("output");
const statusEl = $("status");
const statsEl = $("stats");
let lastJson = null;

function setStatus(type, text) {
  statusEl.innerHTML = text ? '<div class="msg ' + type + '">' + escapeHtml(text) + '</div>' : "";
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
}

function doConvert() {
  setStatus("", "");
  statsEl.hidden = true;
  $("btnDownload").disabled = true;
  $("btnCopy").disabled = true;
  lastJson = null;
  outputEl.value = "";
  let src;
  try { src = JSON.parse(inputEl.value); }
  catch (e) { setStatus("err", "Invalid JSON: " + e.message); return; }
  const refWidth = parseInt($("refWidth").value, 10) || 1920;
  const refHeight = parseInt($("refHeight").value, 10) || 1080;
  try {
    const result = convertZl1ToZl2(src, {
      name: $("layoutName").value.trim() || "Converted from ZL1",
      author: $("layoutAuthor").value.trim() || "ZL1→ZL2 Converter",
      refWidth, refHeight,
    });
    lastJson = result.layout;
    outputEl.value = JSON.stringify(result.layout, null, 2);
    $("btnDownload").disabled = false;
    $("btnCopy").disabled = false;
    statsEl.hidden = false;
    statsEl.innerHTML =
      '<div class="stat">Buttons: <strong>' + result.stats.buttons + '</strong></div>' +
      '<div class="stat">Joysticks: <strong>' + result.stats.joysticks + '</strong></div>' +
      '<div class="stat">Styles: <strong>' + result.stats.styles + '</strong></div>' +
      '<div class="stat">Layers: <strong>' + result.stats.layers + '</strong></div>';
    if (result.warnings.length) setStatus("warn", "Converted with notes:\n• " + result.warnings.join("\n• "));
    else setStatus("ok", "Conversion OK. Download the JSON and import it in Zalith Launcher 2 → Control list.");
  } catch (e) {
    setStatus("err", e.message || String(e));
  }
}

$("btnConvert").addEventListener("click", doConvert);
$("btnDownload").addEventListener("click", () => {
  if (!lastJson) return;
  const name = ($("layoutName").value.trim() || "converted").replace(/[^\w\-]+/g, "_");
  const blob = new Blob([JSON.stringify(lastJson, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name + "_zl2.json";
  a.click();
  URL.revokeObjectURL(a.href);
});
$("btnCopy").addEventListener("click", async () => {
  if (!outputEl.value) return;
  try { await navigator.clipboard.writeText(outputEl.value); setStatus("ok", "Copied to clipboard."); }
  catch { outputEl.select(); setStatus("warn", "Select-all the output and copy manually."); }
});

const drop = $("dropzone");
const fileInput = $("fileInput");
drop.addEventListener("click", () => fileInput.click());
drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("dragover"); });
drop.addEventListener("dragleave", () => drop.classList.remove("dragover"));
drop.addEventListener("drop", (e) => {
  e.preventDefault(); drop.classList.remove("dragover");
  const f = e.dataTransfer.files[0];
  if (f) readFile(f);
});
fileInput.addEventListener("change", () => { if (fileInput.files[0]) readFile(fileInput.files[0]); });
function readFile(f) {
  const reader = new FileReader();
  reader.onload = () => {
    inputEl.value = reader.result;
    if (!$("layoutName").dataset.touched) {
      $("layoutName").value = f.name.replace(/\.json$/i, "") || "Converted from ZL1";
    }
    doConvert();
  };
  reader.readAsText(f);
}
$("layoutName").addEventListener("input", () => { $("layoutName").dataset.touched = "1"; });

$("btnSample").addEventListener("click", () => {
  inputEl.value = JSON.stringify({
    mControlDataList: [
      { name: "W", keycodes: [87,0,0,0], dynamicX: "${margin} * 2 + ${width}", dynamicY: "${bottom} - ${margin} * 3 - ${height} * 2", width: 50, height: 50, isToggle: false, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: true, passThruEnabled: false, displayInGame: true, displayInMenu: false },
      { name: "A", keycodes: [65,0,0,0], dynamicX: "${margin}", dynamicY: "${bottom} - ${margin} * 2 - ${height}", width: 50, height: 50, isToggle: false, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: true, passThruEnabled: false, displayInGame: true, displayInMenu: false },
      { name: "S", keycodes: [83,0,0,0], dynamicX: "${margin} * 2 + ${width}", dynamicY: "${bottom} - ${margin}", width: 50, height: 50, isToggle: false, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: true, passThruEnabled: false, displayInGame: true, displayInMenu: false },
      { name: "D", keycodes: [68,0,0,0], dynamicX: "${margin} * 3 + ${width} * 2", dynamicY: "${bottom} - ${margin} * 2 - ${height}", width: 50, height: 50, isToggle: false, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: true, passThruEnabled: false, displayInGame: true, displayInMenu: false },
      { name: "Jump", keycodes: [32,0,0,0], dynamicX: "${right} - ${margin}", dynamicY: "${bottom} - ${margin}", width: 50, height: 50, isToggle: false, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: false, passThruEnabled: false, displayInGame: true, displayInMenu: false },
      { name: "Shift", keycodes: [340,0,0,0], dynamicX: "${right} - ${margin}", dynamicY: "${bottom} - ${margin} * 2 - ${height}", width: 50, height: 50, isToggle: true, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: false, passThruEnabled: false, displayInGame: true, displayInMenu: false },
      { name: "Chat", keycodes: [84,0,0,0], dynamicX: "${margin} * 2 + ${width}", dynamicY: "${margin}", width: 80, height: 30, isToggle: false, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: false, passThruEnabled: false, displayInGame: true, displayInMenu: true },
      { name: "Keyboard", keycodes: [-1,0,0,0], dynamicX: "${margin} * 3 + ${width} * 2", dynamicY: "${margin}", width: 80, height: 30, isToggle: false, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: false, passThruEnabled: false, displayInGame: true, displayInMenu: true },
      { name: "PRI", keycodes: [-3,0,0,0], dynamicX: "${margin}", dynamicY: "${screen_height} - ${margin} * 3 - ${height} * 3", width: 50, height: 50, isToggle: false, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: false, passThruEnabled: false, displayInGame: true, displayInMenu: true },
      { name: "SEC", keycodes: [-4,0,0,0], dynamicX: "${margin} * 3 + ${width} * 2", dynamicY: "${screen_height} - ${margin} * 3 - ${height} * 3", width: 50, height: 50, isToggle: false, opacity: 1, bgColor: 1291845632, strokeColor: -1, strokeWidth: 0, cornerRadius: 0, isSwipeable: false, passThruEnabled: false, displayInGame: true, displayInMenu: true },
    ],
    mDrawerDataList: [], mJoystickDataList: [], scaledAt: 100, version: 8,
  }, null, 2);
  $("layoutName").value = "Sample WASD";
  doConvert();
});
