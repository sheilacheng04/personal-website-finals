import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

/**
 * AquariumScene – A full-screen, interactive 3D deep-ocean particle system
 * rendered with Three.js behind the content page.
 *
 * Features:
 *  - Hundreds of translucent bubbles that drift upward with buoyancy physics
 *  - Soft bioluminescent jellyfish-like orbs pulsing with light
 *  - Volumetric "god-ray" light shafts streaming from above
 *  - Mouse/touch interaction: particles flee from the cursor like startled fish
 *  - Depth-of-field blur via size attenuation for parallax feel
 *  - Colour palette matched to the existing deep-sea theme
 */

// --------------- shader chunks ---------------

const BUBBLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2  uMouse;        // normalised (-1..1)
  uniform float uMouseRadius;  // repel radius in world units
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aWobble;
  attribute float aType;       // 0 = bubble, 1 = jellyfish orb
  varying float vAlpha;
  varying float vType;
  varying float vPulse;
  varying vec3  vColor;

  void main() {
    vType = aType;

    // --- position animation ---
    vec3 p = position;

    // buoyant rise (loop via mod)
    float cycle = mod(uTime * aSpeed + aPhase, 40.0) - 20.0;   // -20..20 range
    p.y += cycle;

    // horizontal wobble
    p.x += sin(uTime * 0.4 * aWobble + aPhase) * 1.2;
    p.z += cos(uTime * 0.35 * aWobble + aPhase * 1.3) * 0.9;

    // --- mouse repulsion (soft sphere) ---
    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
    vec4 clip  = projectionMatrix * mvPos;
    vec2 ndc   = clip.xy / clip.w;            // -1..1
    float dist = length(ndc - uMouse);
    if (dist < uMouseRadius) {
      float strength = 1.0 - dist / uMouseRadius;
      vec2  dir = normalize(ndc - uMouse);
      p.x += dir.x * strength * 3.5;
      p.y += dir.y * strength * 3.5;
      // recalculate mvPos after displacement
      mvPos = modelViewMatrix * vec4(p, 1.0);
    }

    // --- pulse for jellyfish type ---
    float pulse = 0.0;
    if (aType > 0.5) {
      pulse = 0.5 + 0.5 * sin(uTime * 1.5 + aPhase * 6.28);
    }
    vPulse = pulse;

    // --- size + depth ---
    float depth = -mvPos.z;
    float sz = aSize * uPixelRatio * (200.0 / depth);
    if (aType > 0.5) sz *= (1.0 + pulse * 0.3);

    gl_PointSize = sz;
    gl_Position = projectionMatrix * mvPos;

    // alpha: fade at edges of view & distant particles
    vAlpha = smoothstep(40.0, 10.0, depth) * smoothstep(0.0, 3.0, depth);

    // colour tint per type
    if (aType < 0.5) {
      // bubble – white/cyan
      vColor = mix(vec3(0.75, 0.92, 1.0), vec3(1.0), 0.5 + 0.5 * sin(aPhase));
    } else {
      // jellyfish orb – bioluminescent palette
      float t = fract(aPhase * 3.0);
      vec3 c1 = vec3(0.2, 0.6, 1.0);
      vec3 c2 = vec3(0.5, 0.2, 0.9);
      vec3 c3 = vec3(0.1, 0.9, 0.7);
      vColor = t < 0.33 ? mix(c1, c2, t * 3.0)
             : t < 0.66 ? mix(c2, c3, (t - 0.33) * 3.0)
                        : mix(c3, c1, (t - 0.66) * 3.0);
    }
  }
`;

const BUBBLE_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying float vType;
  varying float vPulse;
  varying vec3  vColor;

  void main() {
    // soft circle
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float alpha = vAlpha;

    if (vType < 0.5) {
      // --- bubble look: transparent centre, bright rim ---
      float rim = smoothstep(0.25, 0.48, d);
      float inner = 1.0 - smoothstep(0.0, 0.35, d);
      float highlight = smoothstep(0.28, 0.15, length(uv - vec2(-0.15, 0.15)));
      alpha *= (rim * 0.8 + inner * 0.12 + highlight * 0.5);
      gl_FragColor = vec4(vColor, alpha * 0.65);
    } else {
      // --- jellyfish orb: soft glow ---
      float glow = exp(-d * d * 8.0);
      float outer = smoothstep(0.5, 0.3, d) * 0.3;
      alpha *= (glow + outer) * (0.6 + vPulse * 0.4);
      gl_FragColor = vec4(vColor * (0.8 + vPulse * 0.6), alpha * 0.7);
    }
  }
`;

// --------------- god-ray plane shaders ---------------

const RAY_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RAY_FRAGMENT = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    // several angled light shafts
    float rays = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float angle = 0.15 * fi - 0.3;
      float freq = 1.8 + fi * 0.6;
      float x = vUv.x + vUv.y * angle + sin(uTime * 0.12 + fi) * 0.08;
      float ray = pow(max(0.0, sin(x * freq * 3.14159)), 16.0);
      ray *= smoothstep(1.0, 0.0, vUv.y); // fade toward bottom
      ray *= (0.5 + 0.5 * sin(uTime * 0.3 + fi * 2.0)); // flicker
      rays += ray * 0.12;
    }
    gl_FragColor = vec4(vec3(0.35, 0.7, 0.95), rays);
  }
`;

// --------------- component ---------------

export default function AquariumScene() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  const onPointerMove = useCallback((e) => {
    // normalise to -1..1
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- renderer ---
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(renderer.domElement);

    // --- scene & camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 20;

    // --- particles ---
    const BUBBLE_COUNT = 400;
    const JELLY_COUNT = 40;
    const TOTAL = BUBBLE_COUNT + JELLY_COUNT;

    const positions = new Float32Array(TOTAL * 3);
    const sizes = new Float32Array(TOTAL);
    const speeds = new Float32Array(TOTAL);
    const phases = new Float32Array(TOTAL);
    const wobbles = new Float32Array(TOTAL);
    const types = new Float32Array(TOTAL);

    for (let i = 0; i < TOTAL; i++) {
      const isBubble = i < BUBBLE_COUNT;
      positions[i * 3] = (Math.random() - 0.5) * 40;      // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;  // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;  // z
      sizes[i] = isBubble
        ? Math.random() * 1.5 + 0.3
        : Math.random() * 3.0 + 1.5;
      speeds[i] = isBubble
        ? Math.random() * 0.3 + 0.15
        : Math.random() * 0.1 + 0.05;
      phases[i] = Math.random() * 40;
      wobbles[i] = Math.random() * 1.5 + 0.5;
      types[i] = isBubble ? 0.0 : 1.0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aWobble', new THREE.BufferAttribute(wobbles, 1));
    geo.setAttribute('aType', new THREE.BufferAttribute(types, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: BUBBLE_VERTEX,
      fragmentShader: BUBBLE_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseRadius: { value: 0.25 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // --- god-ray plane (full-screen quad behind particles) ---
    const rayGeo = new THREE.PlaneGeometry(60, 40);
    const rayMat = new THREE.ShaderMaterial({
      vertexShader: RAY_VERTEX,
      fragmentShader: RAY_FRAGMENT,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const rayMesh = new THREE.Mesh(rayGeo, rayMat);
    rayMesh.position.z = -14;
    scene.add(rayMesh);

    // --- subtle ambient fog-like gradient ring (adds depth) ---
    const fogGeo = new THREE.RingGeometry(12, 30, 64);
    const fogMat = new THREE.MeshBasicMaterial({
      color: 0x0a1e3a,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const fogMesh = new THREE.Mesh(fogGeo, fogMat);
    fogMesh.position.z = -15;
    scene.add(fogMesh);

    // --- animation loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      rayMat.uniforms.uTime.value = t;

      // gentle camera sway
      camera.position.x = Math.sin(t * 0.08) * 0.8;
      camera.position.y = Math.cos(t * 0.06) * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- resize handler ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove);

    // --- cleanup ---
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      geo.dispose();
      mat.dispose();
      rayGeo.dispose();
      rayMat.dispose();
      fogGeo.dispose();
      fogMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onPointerMove]);

  return <div ref={mountRef} className="aquarium-scene-canvas" />;
}
