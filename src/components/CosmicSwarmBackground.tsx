import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CosmicSwarmBackgroundProps {
  isDark?: boolean;
  className?: string;
}

export const CosmicSwarmBackground: React.FC<CosmicSwarmBackgroundProps> = ({
  isDark = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  const uniformsRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Theme-aware background
    const bgColor = isDark ? 0x03040a : 0xf8fafc;
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 38;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const count = 20000;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count;
      const y = 1 - 2 * u;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = i * golden;
      const k = i * 3;

      positions[k] = Math.cos(a) * r;
      positions[k + 1] = y;
      positions[k + 2] = Math.sin(a) * r;
      seeds[i] = i / count;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute('aDirection', new THREE.BufferAttribute(positions, 3));

    const uniforms = {
      uTime: { value: 0 },
      uScale: { value: 34 },
            uSpeed: { value: 1.8 },
            uWave: { value: 2.25 },
            uGlow: { value: 6.2 },
            uHue: { value: 1.85 },
      uMode: { value: 0 },
      uMouse: { value: new THREE.Vector2(5, 5) },
      uAspect: { value: width / height },
      uIsDark: { value: isDark ? 1.0 : 0.0 },
    };
    uniformsRef.current = uniforms;

    const vertexShader = `
      attribute float aSeed;
      attribute vec3 aDirection;

      uniform float uTime;
      uniform float uScale;
      uniform float uSpeed;
      uniform float uWave;
      uniform float uMode; // now driven by time for live morphing
      uniform vec2 uMouse;
      uniform float uAspect;
      uniform float uIsDark;

      varying float vSeed;
      varying float vEnergy;

      void main() {
        float t = uTime * uSpeed;
        float s = aSeed;
        float a = s * 6.2831853 * 125.0;
        float y = aDirection.y;
        float r = sqrt(max(0.0, 1.0 - y * y));

        float wave = sin(a * 0.035 + t * 1.4 + y * 8.0);
        float pulse = sin(t * 1.1 + s * 30.0);
        float spiral = a + t * 0.35 + sin(t + s * 18.0) * 0.45;

        float radius = uScale * (
          0.80
          + 0.13 * sin(t * 0.8 + s * 12.0)
          + uWave * 0.09 * wave
        );

        vec3 p;

        if (uMode < 0.5) {
          p = vec3(
            cos(spiral) * r * radius,
            y * radius + uWave * 3.0 * sin(t + s * 25.0),
            sin(spiral) * r * radius
          );
        } else if (uMode < 1.5) {
          float breathe = radius * (0.8 + 0.2 * sin(t * 0.7));
          p = vec3(cos(a + t * .2) * r * breathe,
                   y * breathe,
                   sin(a + t * .2) * r * breathe);
          p += aDirection * uWave * wave * 3.0;
        } else if (uMode < 2.5) {
          float theta = s * 6.2831853 * 70.0 + t * .3;
          float minor = 5.0 + uWave * 2.0 * sin(t * 2.0 + s * 80.0);
          float major = uScale * .65;
          p = vec3(
            (major + minor * cos(a * 30.0 + t)) * cos(theta),
            minor * sin(a * 30.0 + t),
            (major + minor * cos(a * 30.0 + t)) * sin(theta)
          );
        } else if (uMode < 3.5) {
          p = aDirection * radius;
          p.x += uWave * 6.0 * sin(y * 8.0 + t + s * 12.0);
          p.y += uWave * 5.0 * sin(p.x * .12 - t * 1.3);
          p.z += uWave * 6.0 * cos(p.x * .1 + p.y * .1 + t);
          float twist = t * .22;
          float xx = p.x * cos(twist) - p.z * sin(twist);
          float zz = p.x * sin(twist) + p.z * cos(twist);
          p.x = xx;
          p.z = zz;
        } else {
          float q = a + t * .15;
          p = vec3(
            sin(q * 2.0 + t) * radius * .7,
            cos(q * 3.0 - t * .7) * radius * .7,
            sin(q * 4.0 + t * .5) * radius * .7
          );
          p += aDirection * uWave * wave * 5.0;
        }

        vec4 viewPosition = viewMatrix * vec4(p, 1.0);
        vec4 clip = projectionMatrix * viewPosition;

        vec2 mouseDelta = clip.xy / max(abs(clip.w), 0.001) - uMouse;
        mouseDelta.x *= uAspect;
        float distanceToMouse = length(mouseDelta);
        float influence = exp(-distanceToMouse * distanceToMouse * 90.0);

        vec3 viewOffset = vec3(
          mouseDelta.x * influence * 8.0,
          mouseDelta.y * influence * 8.0,
          influence * 2.0
        );
        viewPosition.xyz += viewOffset;
        clip = projectionMatrix * viewPosition;

        gl_Position = clip;
        gl_PointSize = clamp(
                          (1.1 + 1.6 * (0.5 + 0.5 * pulse)) * uGlow * 52.0 /
                          max(-viewPosition.z, 1.0), 2.2, 6.5
        );

        vSeed = s;
        vEnergy = 0.5 + 0.5 * sin(t * 2.0 + s * 75.0 + y * 8.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform float uHue;
      uniform float uIsDark;
      varying float vSeed;
      varying float vEnergy;

      vec3 palette(float h, float isDark) {
        if (isDark > 0.5) {
          vec3 c = vec3(0.5);
          vec3 a = vec3(0.5);
          vec3 b = vec3(1.0);
          vec3 d = vec3(0.0, 0.33, 0.67);
          return a + b * cos(6.2831853 * (c * h + d));
        } else {
          // Brighter palette for light theme
          vec3 c = vec3(0.5);
          vec3 a = vec3(0.6);
          vec3 b = vec3(0.9);
          vec3 d = vec3(0.0, 0.25, 0.5);
          return a + b * cos(6.2831853 * (c * h + d));
        }
      }

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;

        float core = smoothstep(0.20, 0.0, d);
        float halo = exp(-d * 15.0) * 0.5;

        float hue = fract(
          0.53 + vSeed * 0.32 +
          uTime * 0.025 * uHue +
          vEnergy * 0.09
        );

        vec3 col = palette(hue, uIsDark);
        float intensity = (core + halo) * (.55 + vEnergy * .8);

        // Boost visibility in light mode
        if (uIsDark < 0.5) {
          intensity *= 1.35;
        }

        gl_FragColor = vec4(col * intensity, intensity);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = material;

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Background stars
    const starCount = 900;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 500;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 350;
      starPos[i * 3 + 2] = -40 - Math.random() * 250;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

    const starColor = isDark ? 0x669dcc : 0x64748b;
    const starMat = new THREE.PointsMaterial({
      color: starColor,
      size: 0.65,
      transparent: true,
      opacity: isDark ? 0.6 : 0.35,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    starsRef.current = stars;

    // === LIVE BLACKHOLE (made from same particles, same colors, rotating) ===
    const bhCount = 1200;
    const bhPositions = new Float32Array(bhCount * 3);
    const bhSeeds = new Float32Array(bhCount);

    for (let i = 0; i < bhCount; i++) {
      // Very dense spherical distribution near center (blackhole)
      const radius = Math.pow(Math.random(), 0.65) * 9.5;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.cos(theta) * 0.6;
      const z = radius * Math.sin(theta) * Math.sin(phi);

      bhPositions[i * 3] = x;
      bhPositions[i * 3 + 1] = y;
      bhPositions[i * 3 + 2] = z;
      bhSeeds[i] = i / bhCount;
    }

    const bhGeometry = new THREE.BufferGeometry();
    bhGeometry.setAttribute('aSeed', new THREE.BufferAttribute(bhSeeds, 1));
    bhGeometry.setAttribute('aDirection', new THREE.BufferAttribute(bhPositions, 3));

    // Reuse the same shader material for consistent color & glow
    const bhMaterial = material.clone();
    const blackHoleParticles = new THREE.Points(bhGeometry, bhMaterial);
    scene.add(blackHoleParticles);

    // Store for rotation animation
    (scene as any).blackHoleParticles = blackHoleParticles;

    let elapsed = 0;
    let previous = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      elapsed += dt;

      uniforms.uTime.value = elapsed;

      // Live morphing between all 5 shapes automatically
      // Live continuous shape morphing between all 5 shapes (very fluid)
            const morphSpeed = 0.28;
            uniforms.uMode.value = ((elapsed * morphSpeed) % 5) + Math.sin(elapsed * 0.9) * 0.12;

      particles.rotation.y = elapsed * 0.035;
      particles.rotation.x = Math.sin(elapsed * 0.16) * 0.08;
      if (starsRef.current) {
        starsRef.current.rotation.y = elapsed * 0.003;
      }

      // === LIVE BLACKHOLE ANIMATION (same particles, same colors, rotating) ===
      const bhParticles = (scene as any).blackHoleParticles;
      if (bhParticles) {
        bhParticles.rotation.y = elapsed * 1.35;
        bhParticles.rotation.x = Math.sin(elapsed * 0.45) * 0.18;
        bhParticles.rotation.z = elapsed * 0.65;
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
      if (uniformsRef.current) {
        uniformsRef.current.uAspect.value = w / h;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
      }
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
      if (starsRef.current) {
        starsRef.current.geometry.dispose();
        (starsRef.current.material as THREE.Material).dispose();
      }
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        zIndex: 0,
              opacity: isDark ? 1.0 : 0.92,
      }}
      aria-hidden="true"
    />
  );
};

export default CosmicSwarmBackground;