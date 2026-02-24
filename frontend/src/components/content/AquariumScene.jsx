import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

/**
 * AquariumScene – Full-screen interactive 3D deep-ocean environment
 *
 * Features:
 *  - 600 translucent bubbles with buoyancy + wobble physics
 *  - 60 bioluminescent jellyfish orbs pulsing with light
 *  - 80 tiny plankton/dust motes drifting in currents
 *  - 3D seaweed strands swaying in procedural currents
 *  - Animated caustic light patterns on the ocean floor
 *  - Volumetric god-ray light shafts from above
 *  - Floating 3D glass icosahedron "gems" that rotate
 *  - Mouse/touch repulsion — particles flee from cursor
 *  - Depth parallax + gentle camera sway
 */

// --------------- particle shaders ---------------

const BUBBLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2  uMouse;
  uniform float uMouseRadius;
  uniform float uScroll;       // normalised scroll 0..1
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aWobble;
  attribute float aType;       // 0 = bubble, 1 = jellyfish, 2 = plankton
  varying float vAlpha;
  varying float vType;
  varying float vPulse;
  varying vec3  vColor;

  void main() {
    vType = aType;
    vec3 p = position;

    // buoyant rise
    float cycle = mod(uTime * aSpeed + aPhase, 40.0) - 20.0;
    p.y += cycle;

    // horizontal wobble
    p.x += sin(uTime * 0.4 * aWobble + aPhase) * 1.2;
    p.z += cos(uTime * 0.35 * aWobble + aPhase * 1.3) * 0.9;

    // plankton: erratic micro-movement
    if (aType > 1.5) {
      p.x += sin(uTime * 2.0 + aPhase * 10.0) * 0.3;
      p.y += cos(uTime * 1.8 + aPhase * 8.0) * 0.2;
      p.z += sin(uTime * 1.5 + aPhase * 12.0) * 0.25;
    }

    // mouse repulsion
    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
    vec4 clip  = projectionMatrix * mvPos;
    vec2 ndc   = clip.xy / clip.w;
    float dist = length(ndc - uMouse);
    if (dist < uMouseRadius) {
      float strength = 1.0 - dist / uMouseRadius;
      vec2  dir = normalize(ndc - uMouse + 0.001);
      p.x += dir.x * strength * 4.0;
      p.y += dir.y * strength * 4.0;
      mvPos = modelViewMatrix * vec4(p, 1.0);
    }

    // pulse for jellyfish
    float pulse = 0.0;
    if (aType > 0.5 && aType < 1.5) {
      pulse = 0.5 + 0.5 * sin(uTime * 1.5 + aPhase * 6.28);
    }
    vPulse = pulse;

    // size + depth
    float depth = -mvPos.z;
    float sz = aSize * uPixelRatio * (220.0 / depth);
    if (aType > 0.5 && aType < 1.5) sz *= (1.0 + pulse * 0.35);
    if (aType > 1.5) sz *= 0.6; // plankton smaller

    gl_PointSize = clamp(sz, 0.5, 180.0);
    gl_Position = projectionMatrix * mvPos;

    vAlpha = smoothstep(45.0, 10.0, depth) * smoothstep(0.0, 3.0, depth);

    if (aType < 0.5) {
      // bubble — white/cyan
      vColor = mix(vec3(0.75, 0.92, 1.0), vec3(1.0), 0.5 + 0.5 * sin(aPhase));
    } else if (aType < 1.5) {
      // jellyfish — bioluminescent
      float t = fract(aPhase * 3.0);
      vec3 c1 = vec3(0.15, 0.55, 1.0);
      vec3 c2 = vec3(0.55, 0.15, 0.95);
      vec3 c3 = vec3(0.05, 0.95, 0.65);
      vColor = t < 0.33 ? mix(c1, c2, t * 3.0)
             : t < 0.66 ? mix(c2, c3, (t - 0.33) * 3.0)
                        : mix(c3, c1, (t - 0.66) * 3.0);
    } else {
      // plankton — warm gold/green
      vColor = mix(vec3(0.8, 0.9, 0.5), vec3(0.5, 1.0, 0.8), fract(aPhase * 7.0));
    }
  }
`;

const BUBBLE_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying float vType;
  varying float vPulse;
  varying vec3  vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float alpha = vAlpha;

    if (vType < 0.5) {
      // bubble: glass rim + specular highlight
      float rim = smoothstep(0.22, 0.48, d);
      float inner = 1.0 - smoothstep(0.0, 0.32, d);
      float highlight = smoothstep(0.28, 0.12, length(uv - vec2(-0.15, 0.15)));
      float highlight2 = smoothstep(0.35, 0.25, length(uv - vec2(0.1, -0.2))) * 0.3;
      alpha *= (rim * 0.85 + inner * 0.1 + highlight * 0.55 + highlight2);
      gl_FragColor = vec4(vColor, alpha * 0.6);
    } else if (vType < 1.5) {
      // jellyfish: soft pulsing glow
      float glow = exp(-d * d * 7.0);
      float outer = smoothstep(0.5, 0.28, d) * 0.35;
      float ring = smoothstep(0.38, 0.34, d) * smoothstep(0.28, 0.34, d) * 0.4;
      alpha *= (glow + outer + ring) * (0.55 + vPulse * 0.45);
      gl_FragColor = vec4(vColor * (0.75 + vPulse * 0.65), alpha * 0.75);
    } else {
      // plankton: tiny soft dot
      float glow = exp(-d * d * 12.0);
      alpha *= glow * 0.7;
      gl_FragColor = vec4(vColor, alpha * 0.5);
    }
  }
`;

// --------------- god-ray shaders ---------------

const RAY_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RAY_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uRayColor;
  varying vec2 vUv;

  void main() {
    float rays = 0.0;
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float angle = 0.12 * fi - 0.35;
      float freq = 1.6 + fi * 0.55;
      float x = vUv.x + vUv.y * angle + sin(uTime * 0.1 + fi * 1.2) * 0.1;
      float ray = pow(max(0.0, sin(x * freq * 3.14159)), 20.0);
      ray *= smoothstep(1.0, 0.0, vUv.y);
      ray *= (0.4 + 0.6 * sin(uTime * 0.25 + fi * 1.8));
      rays += ray * 0.09;
    }
    gl_FragColor = vec4(uRayColor, rays);
  }
`;

// --------------- caustic floor shader ---------------

const CAUSTIC_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCausticColor;
  varying vec2 vUv;

  // Simple caustic pattern using overlapping sine waves
  float caustic(vec2 p, float t) {
    float c = 0.0;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float scale = 3.0 + fi * 1.5;
      float speed = 0.3 + fi * 0.15;
      vec2 offset = vec2(sin(t * speed + fi), cos(t * speed * 0.7 + fi * 2.0)) * 0.3;
      c += sin(p.x * scale + offset.x + t * 0.2) * sin(p.y * scale + offset.y + t * 0.15);
    }
    return c * 0.25 + 0.5;
  }

  void main() {
    float c = caustic(vUv * 8.0, uTime);
    float pattern = pow(c, 3.0) * 0.6;
    // Fade at edges
    float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x)
                   * smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    float alpha = pattern * edgeFade * 0.35;
    gl_FragColor = vec4(uCausticColor, alpha);
  }
`;

// --------------- seaweed strand shader ---------------

const SEAWEED_VERTEX = /* glsl */ `
  uniform float uTime;
  attribute float aStrandId;
  attribute float aVertexProgress; // 0 at base, 1 at tip
  varying float vProgress;
  varying float vStrand;

  void main() {
    vProgress = aVertexProgress;
    vStrand = aStrandId;
    vec3 p = position;
    // Wave displacement increases toward tip
    float wave = sin(uTime * 0.8 + aStrandId * 2.5 + aVertexProgress * 3.0) * aVertexProgress * 1.2;
    float wave2 = sin(uTime * 0.5 + aStrandId * 4.0 + aVertexProgress * 2.0) * aVertexProgress * 0.5;
    p.x += wave + wave2;
    p.z += cos(uTime * 0.6 + aStrandId * 3.0) * aVertexProgress * 0.4;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const SEAWEED_FRAGMENT = /* glsl */ `
  varying float vProgress;
  varying float vStrand;

  void main() {
    // Gradient from dark base to bright tip
    vec3 baseColor = vec3(0.02, 0.15, 0.08);
    vec3 tipColor = vec3(0.1, 0.5, 0.3);
    vec3 color = mix(baseColor, tipColor, vProgress);
    // Slight glow at tip
    float glow = smoothstep(0.6, 1.0, vProgress) * 0.4;
    color += vec3(0.05, 0.3, 0.15) * glow;
    float alpha = mix(0.6, 0.2, vProgress);
    gl_FragColor = vec4(color, alpha);
  }
`;

// --------------- theme helper ---------------

function getThemeColors() {
  const style = getComputedStyle(document.documentElement);
  const parse = (v) => v.split(',').map(Number);
  const light = parse(style.getPropertyValue('--theme-light').trim() || '100,180,220');
  const medium = parse(style.getPropertyValue('--theme-medium').trim() || '58,138,184');
  const dark = parse(style.getPropertyValue('--theme-dark').trim() || '0,60,120');
  const veryDark = parse(style.getPropertyValue('--theme-very-dark').trim() || '5,18,45');
  const veryLight = parse(style.getPropertyValue('--theme-very-light').trim() || '120,200,255');
  const hue = parseFloat(style.getPropertyValue('--theme-hue').trim() || '200');
  return { light, medium, dark, veryDark, veryLight, hue };
}

// --------------- helpers ---------------

function createSeaweedStrands(scene) {
  const STRAND_COUNT = 18;
  const SEGMENTS = 12;
  const disposables = [];

  for (let s = 0; s < STRAND_COUNT; s++) {
    const verts = [];
    const indices = [];
    const strandIds = [];
    const progresses = [];
    const baseX = (Math.random() - 0.5) * 50;
    const baseZ = -8 - Math.random() * 10;
    const baseY = -14;
    const height = 4 + Math.random() * 6;
    const width = 0.15 + Math.random() * 0.15;

    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const y = baseY + t * height;
      // Two vertices per row (left/right)
      const w = width * (1 - t * 0.7);
      verts.push(baseX - w, y, baseZ);
      verts.push(baseX + w, y, baseZ);
      strandIds.push(s, s);
      progresses.push(t, t);
      if (i < SEGMENTS) {
        const row = i * 2;
        indices.push(row, row + 1, row + 2);
        indices.push(row + 1, row + 3, row + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('aStrandId', new THREE.Float32BufferAttribute(strandIds, 1));
    geo.setAttribute('aVertexProgress', new THREE.Float32BufferAttribute(progresses, 1));
    geo.setIndex(indices);

    const mat = new THREE.ShaderMaterial({
      vertexShader: SEAWEED_VERTEX,
      fragmentShader: SEAWEED_FRAGMENT,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    disposables.push({ geo, mat, mesh });
  }
  return disposables;
}

function createFloatingGems(scene) {
  const GEM_COUNT = 8;
  const gems = [];

  for (let i = 0; i < GEM_COUNT; i++) {
    const geo = new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.5, 0);
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.7, 0.6),
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      thickness: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 15 - 3
    );
    mesh.userData.phase = Math.random() * Math.PI * 2;
    mesh.userData.speed = 0.3 + Math.random() * 0.4;
    mesh.userData.axis = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    scene.add(mesh);
    gems.push({ geo, mat, mesh });
  }
  return gems;
}

// --------------- component ---------------

export default function AquariumScene() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  const onPointerMove = useCallback((e) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- renderer ---
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- scene & camera ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020e24, 0.018);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.z = 22;

    // --- lighting for glass gems ---
    const ambientLight = new THREE.AmbientLight(0x1a3a5c, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x88ccff, 0.8);
    dirLight.position.set(5, 15, 10);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x4488ff, 1.2, 50);
    pointLight.position.set(-8, 10, 5);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0x8844ff, 0.6, 40);
    pointLight2.position.set(10, -5, 8);
    scene.add(pointLight2);

    // --- particles ---
    const BUBBLE_COUNT = 600;
    const JELLY_COUNT = 60;
    const PLANKTON_COUNT = 80;
    const TOTAL = BUBBLE_COUNT + JELLY_COUNT + PLANKTON_COUNT;

    const positions = new Float32Array(TOTAL * 3);
    const sizes = new Float32Array(TOTAL);
    const speeds = new Float32Array(TOTAL);
    const phases = new Float32Array(TOTAL);
    const wobbles = new Float32Array(TOTAL);
    const types = new Float32Array(TOTAL);

    for (let i = 0; i < TOTAL; i++) {
      const isBubble = i < BUBBLE_COUNT;
      const isJelly = i >= BUBBLE_COUNT && i < BUBBLE_COUNT + JELLY_COUNT;
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;
      if (isBubble) {
        sizes[i] = Math.random() * 1.8 + 0.3;
        speeds[i] = Math.random() * 0.35 + 0.12;
        types[i] = 0.0;
      } else if (isJelly) {
        sizes[i] = Math.random() * 3.5 + 1.8;
        speeds[i] = Math.random() * 0.1 + 0.04;
        types[i] = 1.0;
      } else {
        sizes[i] = Math.random() * 0.6 + 0.15;
        speeds[i] = Math.random() * 0.08 + 0.02;
        types[i] = 2.0;
      }
      phases[i] = Math.random() * 40;
      wobbles[i] = Math.random() * 1.5 + 0.5;
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
        uMouseRadius: { value: 0.28 },
        uScroll: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // --- god-ray plane ---
    const rayGeo = new THREE.PlaneGeometry(70, 50);
    const rayMat = new THREE.ShaderMaterial({
      vertexShader: RAY_VERTEX,
      fragmentShader: RAY_FRAGMENT,
      uniforms: { uTime: { value: 0 }, uRayColor: { value: new THREE.Vector3(0.3, 0.65, 0.95) } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const rayMesh = new THREE.Mesh(rayGeo, rayMat);
    rayMesh.position.z = -16;
    scene.add(rayMesh);

    // --- caustic floor ---
    const causticGeo = new THREE.PlaneGeometry(60, 30);
    const causticMat = new THREE.ShaderMaterial({
      vertexShader: RAY_VERTEX,
      fragmentShader: CAUSTIC_FRAGMENT,
      uniforms: { uTime: { value: 0 }, uCausticColor: { value: new THREE.Vector3(0.3, 0.7, 1.0) } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const causticMesh = new THREE.Mesh(causticGeo, causticMat);
    causticMesh.position.set(0, -15, -10);
    causticMesh.rotation.x = -Math.PI * 0.35;
    scene.add(causticMesh);

    // --- seaweed ---
    const seaweedParts = createSeaweedStrands(scene);

    // --- floating glass gems ---
    const gems = createFloatingGems(scene);

    // --- ambient fog ring ---
    const fogGeo = new THREE.RingGeometry(14, 35, 64);
    const fogMat = new THREE.MeshBasicMaterial({
      color: 0x081a30,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const fogMesh = new THREE.Mesh(fogGeo, fogMat);
    fogMesh.position.z = -18;
    scene.add(fogMesh);

    // --- animation loop ---
    const clock = new THREE.Clock();
    let lastThemeCheck = 0;
    let cachedHue = -1;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // update theme colors every ~0.5s
      if (t - lastThemeCheck > 0.5) {
        lastThemeCheck = t;
        const tc = getThemeColors();
        if (tc.hue !== cachedHue) {
          cachedHue = tc.hue;
          const toF = (rgb) => [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
          const l = toF(tc.light);
          const m = toF(tc.medium);
          const d = toF(tc.dark);
          const vd = toF(tc.veryDark);
          // fog
          scene.fog.color.setRGB(vd[0], vd[1], vd[2]);
          // lights
          ambientLight.color.setRGB(d[0] * 0.7, d[1] * 0.7, d[2] * 0.7);
          dirLight.color.setRGB(l[0], l[1], l[2]);
          pointLight.color.setRGB(m[0], m[1], m[2]);
          // god-ray color
          rayMat.uniforms.uRayColor.value.set(l[0], l[1], l[2]);
          // caustic color
          causticMat.uniforms.uCausticColor.value.set(l[0], l[1], l[2]);
          // fog ring
          fogMat.color.setRGB(vd[0], vd[1], vd[2]);
          // gems: shift hue
          gems.forEach(({ mat: gm }) => {
            const gemHue = (tc.hue / 360) + Math.random() * 0.05;
            gm.color.setHSL(gemHue, 0.7, 0.6);
          });
        }
      }

      // uniforms
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      rayMat.uniforms.uTime.value = t;
      causticMat.uniforms.uTime.value = t;

      // seaweed
      seaweedParts.forEach(({ mat: m }) => { m.uniforms.uTime.value = t; });

      // gems: rotate + bob
      gems.forEach(({ mesh }) => {
        const { phase, speed, axis } = mesh.userData;
        mesh.rotation.x += 0.003 * speed;
        mesh.rotation.y += 0.005 * speed;
        mesh.position.y += Math.sin(t * speed + phase) * 0.003;
        mesh.position.x += Math.cos(t * speed * 0.5 + phase) * 0.002;
      });

      // point lights drift
      pointLight.position.x = Math.sin(t * 0.15) * 12;
      pointLight.position.y = 8 + Math.cos(t * 0.1) * 4;
      pointLight2.position.x = Math.cos(t * 0.12) * 10;
      pointLight2.position.y = -3 + Math.sin(t * 0.08) * 5;

      // gentle camera sway
      camera.position.x = Math.sin(t * 0.07) * 1.0;
      camera.position.y = Math.cos(t * 0.05) * 0.6;
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
      geo.dispose(); mat.dispose();
      rayGeo.dispose(); rayMat.dispose();
      causticGeo.dispose(); causticMat.dispose();
      fogGeo.dispose(); fogMat.dispose();
      seaweedParts.forEach(({ geo: g, mat: m, mesh }) => { g.dispose(); m.dispose(); scene.remove(mesh); });
      gems.forEach(({ geo: g, mat: m, mesh }) => { g.dispose(); m.dispose(); scene.remove(mesh); });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onPointerMove]);

  return <div ref={mountRef} className="aquarium-scene-canvas" />;
}
