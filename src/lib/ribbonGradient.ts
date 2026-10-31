/*
  Ribbon gradient background, ported from ribbon-gradient.html.
  ----------------------------------------------------------------
  Look: three large soft colour fields drift over a light base colour. The picture is cut into
  diagonal ribbon bands; every band takes one colour, and slow sine waves bend the bands so they
  ripple. Band width, angle and waviness slowly "breathe", palettes crossfade every few seconds,
  and a fixed fine grain sits on top.

  Usage:
    const bg = mountRibbonGradient(element, { palettes: [...] });
    bg?.setPalettes([...]);   // swap colour sets
    bg?.destroy();            // remove

  The element needs position: relative (or absolute) and overflow: hidden, and its canvas child
  must be styled to fill it. The canvas is inserted as its first child.
  It draws only while on screen and the tab is visible; with reduced motion it draws one still frame.
*/

/** [base, colour 1, colour 2, colour 3] as hex strings. */
export type RibbonPalette = [string, string, string, string];

export type RibbonOptions = {
  palettes: RibbonPalette[];
  /** Overall motion speed (1 = default). */
  speed: number;
  /** How long each palette stays before fading, and the crossfade length, in seconds. */
  holdSeconds: number;
  fadeSeconds: number;
  /** Ribbon width range in CSS px. */
  bandMin: number;
  bandMax: number;
  /** Ribbon angle range in radians (~20° to ~70°). */
  angleMin: number;
  angleMax: number;
  /** Ripple range, 0..1. */
  waveMin: number;
  waveMax: number;
  /** Grain strength; 0 = no grain. */
  grain: number;
  /** Caps the canvas resolution for performance. */
  maxDpr: number;
};

export type RibbonGradient = {
  setPalettes: (palettes: RibbonPalette[]) => void;
  destroy: () => void;
};

const VERT = "attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }";

const FRAG = [
  "#ifdef GL_FRAGMENT_PRECISION_HIGH",
  "precision highp float;",
  "#else",
  "precision mediump float;",
  "#endif",
  "uniform vec2  u_res;", // canvas size in device px
  "uniform float u_time;", // motion time (seconds * speed)
  "uniform vec3  u_base;", // light base colour
  "uniform vec3  u_c1;",
  "uniform vec3  u_c2;",
  "uniform vec3  u_c3;",
  "uniform float u_band;", // ribbon width in device px
  "uniform float u_angle;", // ribbon direction in radians
  "uniform float u_wave;", // 0..1 how much the ribbons ripple
  "uniform float u_grain;", // grain strength

  // Small hash for static grain
  "float hash(vec2 p){",
  "  vec3 p3 = fract(vec3(p.xyx) * 0.1031);",
  "  p3 += dot(p3, p3.yzx + 33.33);",
  "  return fract((p3.x + p3.y) * p3.z);",
  "}",

  // Soft round colour field, 1.0 at the centre fading to 0.0
  "float blob(vec2 p, vec2 c, float r){",
  "  float d = length(p - c) / r;",
  "  return exp(-d * d * 2.0);",
  "}",

  // Smooth colour field. uv is 0..1 across the canvas.
  "vec3 field(vec2 uv){",
  "  float a = u_res.x / u_res.y;",
  "  vec2 p = vec2(uv.x * a, uv.y);",
  "  float t = u_time;",
  "  vec2 c1 = vec2((0.28 + 0.22 * sin(t * 0.21 + 0.4)) * a, 0.70 + 0.20 * cos(t * 0.17));",
  "  vec2 c2 = vec2((0.72 + 0.22 * cos(t * 0.19 + 1.7)) * a, 0.32 + 0.22 * sin(t * 0.23 + 0.9));",
  "  vec2 c3 = vec2((0.50 + 0.30 * sin(t * 0.13 + 2.6)) * a, 0.50 + 0.28 * cos(t * 0.29 + 2.1));",
  "  vec3 col = u_base;",
  "  col = mix(col, u_c1, blob(p, c1, 0.62));",
  "  col = mix(col, u_c2, blob(p, c2, 0.58));",
  "  col = mix(col, u_c3, 0.85 * blob(p, c3, 0.50));",
  "  return col;",
  "}",

  "void main(){",
  "  vec2 frag = gl_FragCoord.xy;",
  "  float m = min(u_res.x, u_res.y);",
  "  vec2 q = frag / m;",
  "  vec2 dir = vec2(cos(u_angle), sin(u_angle));",
  "  vec2 nrm = vec2(-dir.y, dir.x);",
  "  float along  = dot(q, dir);",
  "  float across = dot(q, nrm);",
  // ripple the ribbons
  "  across += u_wave * (0.05 * sin(along * 5.0 + u_time * 0.45)",
  "                    + 0.025 * sin(along * 11.0 - u_time * 0.30 + across * 3.0));",
  "  float bw  = u_band / m;",
  "  float k   = across / bw;",
  "  float idx = floor(k);",
  "  float f   = k - idx;",
  // Colour at the centre of this ribbon and of the nearest neighbour. Each ribbon samples the
  // colour field slightly shifted along its length, so neighbouring ribbons differ a little and
  // the steps become visible.
  "  float idxN = idx + (f < 0.5 ? -1.0 : 1.0);",
  "  float sh   = 0.08 * u_wave * sin(idx  * 0.5 + u_time * 0.4);",
  "  float shN  = 0.08 * u_wave * sin(idxN * 0.5 + u_time * 0.4);",
  "  vec2 pc = dir * (along + sh)  + nrm * ((idx  + 0.5) * bw);",
  "  vec2 pn = dir * (along + shN) + nrm * ((idxN + 0.5) * bw);",
  "  vec3 cc = field(pc * m / u_res);",
  "  vec3 cn = field(pn * m / u_res);",
  // soften the seam between ribbons (about 1.5 device px)
  "  float edgePx = min(f, 1.0 - f) * u_band;",
  "  vec3 col = mix(mix(cc, cn, 0.5), cc, smoothstep(0.0, 1.5, edgePx));",
  // fixed grain (does not move between frames)
  "  col *= 1.0 - u_grain * hash(floor(frag));",
  "  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);",
  "}",
].join("\n");

const DEFAULTS: RibbonOptions = {
  palettes: [
    ["#fef8ec", "#f6b653", "#73e2bd", "#fde57c"],
    ["#fafaf9", "#f39c2c", "#fcd54d", "#cbb9a6"],
    ["#edfcf6", "#3acda1", "#f9d38e", "#fde57c"],
  ],
  speed: 1,
  holdSeconds: 10,
  fadeSeconds: 4,
  bandMin: 28,
  bandMax: 64,
  angleMin: 0.35,
  angleMax: 1.2,
  waveMin: 0.4,
  waveMax: 1.0,
  grain: 0.06,
  maxDpr: 1.5,
};

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  let s = hex.replace("#", "");
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  const n = parseInt(s, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
function smooth(x: number): number {
  x = Math.min(Math.max(x, 0), 1);
  return x * x * (3 - 2 * x);
}
function mix3(a: Rgb, b: Rgb, k: number): Rgb {
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}
/** Maps s in -1..1 onto min..max. */
function range(min: number, max: number, s: number): number {
  return min + ((max - min) * (s + 1)) / 2;
}

export function mountRibbonGradient(el: HTMLElement, options: Partial<RibbonOptions> = {}): RibbonGradient | null {
  const o: RibbonOptions = { ...DEFAULTS, ...options };

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  el.insertBefore(canvas, el.firstChild);

  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) {
    el.style.background = o.palettes[0][0];
    return { setPalettes: () => {}, destroy: () => canvas.remove() };
  }

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[ribbon-gradient]", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = shader(gl.VERTEX_SHADER, VERT);
  const fs = shader(gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) {
    canvas.remove();
    return null;
  }
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[ribbon-gradient]", gl.getProgramInfoLog(prog));
    canvas.remove();
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one big triangle
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = Object.fromEntries(
    ["u_res", "u_time", "u_base", "u_c1", "u_c2", "u_c3", "u_band", "u_angle", "u_wave", "u_grain"].map((n) => [
      n,
      gl.getUniformLocation(prog, n),
    ]),
  );

  let pals = o.palettes.map((p) => p.map(hexToRgb));
  let clock = Math.random() * 60; // random start so pages don't all look the same
  let last = 0;
  let raf = 0;
  let onScreen = true;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const resize = () => {
    const d = Math.min(window.devicePixelRatio || 1, o.maxDpr);
    const w = Math.max(1, Math.round(el.clientWidth * d));
    const h = Math.max(1, Math.round(el.clientHeight * d));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    return d;
  };

  const draw = () => {
    const dpr = resize();

    // palette: hold, then crossfade to the next one
    const cycle = o.holdSeconds + o.fadeSeconds;
    const n = pals.length;
    const i = Math.floor(clock / cycle) % n;
    const inCycle = clock % cycle;
    const k = n > 1 ? smooth((inCycle - o.holdSeconds) / o.fadeSeconds) : 0;
    const a = pals[i];
    const b = pals[(i + 1) % n];

    // slow "breathing" of ribbon width, angle and ripple
    const s1 = 0.65 * Math.sin(clock * 0.11 + 0.3) + 0.35 * Math.sin(clock * 0.07 + 2.1);
    const s2 = 0.6 * Math.sin(clock * 0.06 + 1.2) + 0.4 * Math.sin(clock * 0.045 + 4.0);
    const s3 = 0.7 * Math.sin(clock * 0.09 + 3.3) + 0.3 * Math.sin(clock * 0.05 + 0.8);

    gl.uniform2f(U.u_res, canvas.width, canvas.height);
    gl.uniform1f(U.u_time, clock * o.speed);
    gl.uniform3fv(U.u_base, mix3(a[0], b[0], k));
    gl.uniform3fv(U.u_c1, mix3(a[1], b[1], k));
    gl.uniform3fv(U.u_c2, mix3(a[2], b[2], k));
    gl.uniform3fv(U.u_c3, mix3(a[3], b[3], k));
    gl.uniform1f(U.u_band, range(o.bandMin, o.bandMax, s1) * dpr);
    gl.uniform1f(U.u_angle, range(o.angleMin, o.angleMax, s2));
    gl.uniform1f(U.u_wave, range(o.waveMin, o.waveMax, s3));
    gl.uniform1f(U.u_grain, o.grain);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now: number) => {
    clock += Math.min(now - last, 100) / 1000;
    last = now;
    draw();
    raf = requestAnimationFrame(frame);
  };

  const update = () => {
    const run = onScreen && !document.hidden && !reduce.matches && !gl.isContextLost();
    if (run && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const onMotionChange = () => {
    update();
    if (!raf) draw();
  };

  const ro = new ResizeObserver(() => {
    if (!raf) draw();
  });
  ro.observe(el);
  const io = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting;
    update();
  });
  io.observe(el);
  document.addEventListener("visibilitychange", update);
  reduce.addEventListener("change", onMotionChange);

  draw(); // first frame right away (also the still frame for reduced motion)
  update();

  return {
    setPalettes: (p) => {
      pals = p.map((x) => x.map(hexToRgb));
      if (!raf) draw();
    },
    destroy: () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduce.removeEventListener("change", onMotionChange);
      // Release the GPU context straight away rather than waiting for garbage collection.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
}
