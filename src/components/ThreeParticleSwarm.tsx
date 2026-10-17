import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeParticleSwarmProps {
  className?: string;
}

type ShapeType = 'sphere' | 'cube' | 'torus' | 'helix' | 'galaxy' | 'heart';

export const ThreeParticleSwarm: React.FC<ThreeParticleSwarmProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const timeRef = useRef(0);
  const shapeRef = useRef<ShapeType>('sphere');
  const shapeTransitionRef = useRef(0);
  const nextShapeRef = useRef<ShapeType>('cube');

  // Shape morphing functions
  const getShapePosition = (
    i: number,
    count: number,
    shape: ShapeType,
    time: number,
    scale: number
  ): { x: number; y: number; z: number } => {
    const idx = i / count;
    const t = time * 0.5;
    
    switch (shape) {
      case 'sphere': {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const r = scale * (0.8 + Math.sin(t + idx * 10) * 0.1);
        return {
          x: r * Math.cos(theta) * Math.sin(phi),
          y: r * Math.sin(theta) * Math.sin(phi),
          z: r * Math.cos(phi)
        };
      }
      
      case 'cube': {
        const side = Math.cbrt(count);
        const xIdx = Math.floor(i % side);
        const yIdx = Math.floor((i / side) % side);
        const zIdx = Math.floor(i / (side * side));
        const wave = Math.sin(t + idx * 15) * 0.15;
        return {
          x: scale * ((xIdx / side - 0.5) * 2 + wave),
          y: scale * ((yIdx / side - 0.5) * 2 + wave),
          z: scale * ((zIdx / side - 0.5) * 2 + wave)
        };
      }
      
      case 'torus': {
        const u = (i / count) * Math.PI * 2;
        const v = ((i * 137.5) % (Math.PI * 2));
        const R = scale * 0.6;
        const r = scale * 0.25;
        const twist = Math.sin(t + u) * 0.1;
        return {
          x: (R + r * Math.cos(v)) * Math.cos(u + twist),
          y: (R + r * Math.cos(v)) * Math.sin(u + twist),
          z: r * Math.sin(v) + Math.sin(t * 2 + u) * 0.1
        };
      }
      
      case 'helix': {
        const turns = 3;
        const angle = (i / count) * Math.PI * 2 * turns;
        const radius = scale * (0.3 + (i / count) * 0.4);
        const y = scale * ((i / count - 0.5) * 1.5 + Math.sin(t + angle) * 0.1);
        return {
          x: radius * Math.cos(angle + t),
          y: y,
          z: radius * Math.sin(angle + t)
        };
      }
      
      case 'galaxy': {
        const angle = (i / count) * Math.PI * 4;
        const radius = scale * Math.sqrt(i / count) * 0.8;
        const spiral = angle + (i / count) * Math.PI * 6;
        const armOffset = Math.sin(i * 0.1) * 0.3;
        return {
          x: radius * Math.cos(spiral + armOffset) + Math.sin(t + angle) * 0.1,
          y: (i / count - 0.5) * scale * 0.3 + Math.cos(t + angle) * 0.1,
          z: radius * Math.sin(spiral + armOffset) + Math.cos(t + angle) * 0.1
        };
      }
      
      case 'heart': {
        const u = (i / count) * Math.PI * 2;
        const v = Math.acos(1 - 2 * (i / count));
        const heartScale = scale * 0.4;
        const pulse = 1 + Math.sin(t * 2) * 0.1;
        const x = heartScale * 16 * Math.sin(u) * Math.sin(u) * Math.sin(u) * pulse;
        const y = heartScale * (13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)) * pulse;
        const z = heartScale * Math.sin(v) * Math.cos(u) * 8 * pulse;
        return { x, y: y * 0.8, z };
      }
      
      default:
        return { x: 0, y: 0, z: 0 };
    }
  };

  // Particle update with shape morphing
  const updateParticle = (
    i: number,
    count: number,
    target: THREE.Vector3,
    color: THREE.Color,
    time: number,
    controls: { speed: number; chaos: number; scale: number }
  ) => {
    const t = time * controls.speed;
    const idx = i / count;
    
    // Get positions for current and next shape
    const currentPos = getShapePosition(i, count, shapeRef.current, time, controls.scale);
    const nextPos = getShapePosition(i, count, nextShapeRef.current, time, controls.scale);
    
    // Smooth transition between shapes
    const transition = shapeTransitionRef.current;
    const smoothTransition = transition * transition * (3 - 2 * transition); // Smoothstep
    
    const x = currentPos.x + (nextPos.x - currentPos.x) * smoothTransition;
    const y = currentPos.y + (nextPos.y - currentPos.y) * smoothTransition;
    const z = currentPos.z + (nextPos.z - currentPos.z) * smoothTransition;
    
    // Add subtle movement
    const noise = Math.sin(t + idx * 20) * controls.chaos * 0.5;
    target.set(
      x + noise * 0.1,
      y + noise * 0.1,
      z + noise * 0.1
    );
    
    // Dynamic color based on shape and position
    const hue = (idx + t * 0.03 + shapeTransitionRef.current * 0.2) % 1;
    const sat = 0.6 + Math.sin(t * 2 + idx * 10) * 0.2;
    const light = 0.45 + Math.cos(t + idx * 5) * 0.15;
    color.setHSL(hue, Math.max(0.4, Math.min(0.9, sat)), Math.max(0.3, Math.min(0.7, light)));
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 80;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const count = 20000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    const target = new THREE.Vector3();
    const color = new THREE.Color();

    // Shape rotation schedule
    const shapes: ShapeType[] = ['sphere', 'cube', 'torus', 'helix', 'galaxy', 'heart'];
    const shapeDuration = 8; // seconds per shape

    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;

      // Handle shape transitions
      const shapeCycle = (time % (shapes.length * shapeDuration));
      const currentShapeIndex = Math.floor(shapeCycle / shapeDuration);
      const nextShapeIndex = (currentShapeIndex + 1) % shapes.length;
      const shapeProgress = (shapeCycle % shapeDuration) / shapeDuration;
      
      // Update shape refs
      if (shapeRef.current !== shapes[currentShapeIndex]) {
        shapeRef.current = shapes[currentShapeIndex];
      }
      if (nextShapeRef.current !== shapes[nextShapeIndex]) {
        nextShapeRef.current = shapes[nextShapeIndex];
      }
      
      // Transition: hold for 70%, then morph over 30%
      if (shapeProgress < 0.7) {
        shapeTransitionRef.current = 0;
      } else {
        shapeTransitionRef.current = (shapeProgress - 0.7) / 0.3;
      }

      const speed = 0.8;
      const chaos = 0.3;
      const scale = 40;

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = geometry.attributes.color as THREE.BufferAttribute;

      for (let i = 0; i < count; i++) {
        updateParticle(i, count, target, color, time, { speed, chaos, scale });
        const idx3 = i * 3;
        posAttr.array[idx3] = target.x;
        posAttr.array[idx3 + 1] = target.y;
        posAttr.array[idx3 + 2] = target.z;
        colAttr.array[idx3] = color.r;
        colAttr.array[idx3 + 1] = color.g;
        colAttr.array[idx3 + 2] = color.b;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Smooth rotation
      particles.rotation.y = time * 0.08;
      particles.rotation.x = Math.sin(time * 0.04) * 0.15;
      particles.rotation.z = Math.cos(time * 0.03) * 0.1;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        container.removeChild(rendererRef.current.domElement);
      }
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default ThreeParticleSwarm;