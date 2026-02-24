/**
 * CausticsCanvas.jsx
 * ──────────────────────────────────────────────────────────
 * Task 4 — Underwater caustic light-ray effect.
 *
 * Uses a WebGL fragment shader that renders animated
 * caustic light patterns (the rippling light you see on
 * the bottom of a swimming pool).
 *
 * The shader is intentionally lightweight:
 *   • Single full-screen quad
 *   • No external textures
 *   • ~60 fps on integrated GPUs
 *
 * Props:
 *   opacity  — CSS opacity for the canvas layer  (default 0.18)
 *   speed    — animation speed multiplier         (default 1.0)
 *   color    — [r, g, b] base tint 0-1           (default [0.25, 0.6, 0.9])
 */
import { useEffect, useRef } from 'react';

/* ── GLSL Shaders ──────────────────────────────────────── */

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Caustic pattern – based on layered sine waves at different scales
const FRAGMENT_SHADER = `
  precision mediump float;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec3  u_color;

  // Simple pseudo-noise via sine mixing
  float caustic(vec2 uv, float t) {
    float a  = sin(uv.x * 3.0 + t * 0.7) * cos(uv.y * 4.0 - t * 0.5);
    float b  = sin(uv.x * 5.0 - t * 0.4) * cos(uv.y * 3.5 + t * 0.6);
    float c  = sin((uv.x + uv.y) * 4.5 + t * 0.3);
    float d  = cos((uv.x - uv.y) * 3.8 - t * 0.55);
    float e  = sin(uv.x * 7.0 + t * 0.2) * cos(uv.y * 6.5 - t * 0.35);
    return (a + b + c + d + e) * 0.2 + 0.5;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x *= u_resolution.x / u_resolution.y; // correct aspect ratio

    // Layer multiple caustic waves at different scales
    float c1 = caustic(uv * 2.0, u_time);
    float c2 = caustic(uv * 3.5, u_time * 1.3);
    float c3 = caustic(uv * 5.0 + 1.0, u_time * 0.8);

    float pattern = c1 * c2 * c3;
    pattern = smoothstep(0.12, 0.42, pattern); // sharpen caustic lines

    // Slight vignette to soften edges
    vec2 center = gl_FragCoord.xy / u_resolution - 0.5;
    float vignette = 1.0 - dot(center, center) * 1.2;

    vec3 col = u_color * pattern * vignette;

    gl_FragColor = vec4(col, pattern * 0.65);
  }
`;

/* ── Component ─────────────────────────────────────────── */

export default function CausticsCanvas({
  opacity = 0.18,
  speed = 1.0,
  color, // optional override; if not provided, reads from CSS theme
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Helper to read theme color from CSS variables
    const getThemeColor = () => {
      if (color) return color;
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--theme-light').trim();
      if (raw) {
        const parts = raw.split(',').map(Number);
        if (parts.length === 3) return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
      }
      return [0.25, 0.6, 0.9]; // fallback
    };

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) {
      console.warn('CausticsCanvas: WebGL not available');
      return;
    }

    /* ── compile shaders ── */
    function compile(type, src) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    /* ── full-screen quad ── */
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    /* ── uniform locations ── */
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uColor = gl.getUniformLocation(program, 'u_color');

    /* ── resize handler ── */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── render loop ── */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const start = performance.now();
    let lastFrame = 0;
    const TARGET_FPS = 30;
    const FRAME_MS = 1000 / TARGET_FPS;
    let lastThemeCheck = 0;
    let currentColor = getThemeColor();
    function render(now) {
      rafRef.current = requestAnimationFrame(render);
      if (now - lastFrame < FRAME_MS) return; // throttle to ~30fps
      lastFrame = now;

      // Periodically re-read theme color
      if (now - lastThemeCheck > 500) {
        lastThemeCheck = now;
        currentColor = getThemeColor();
      }

      const t = ((now - start) / 1000) * speed;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3fv(uColor, currentColor);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(posBuffer);
    };
  }, [speed, color]);

  return (
    <canvas
      ref={canvasRef}
      className="caustics-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
        mixBlendMode: 'screen',
        zIndex: 2,
        willChange: 'transform',
      }}
    />
  );
}
