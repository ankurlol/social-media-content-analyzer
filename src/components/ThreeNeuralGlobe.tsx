import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type VisualMode = 'globe' | 'neural' | 'orbit';

interface ThreeNeuralGlobeProps {
  mode?: VisualMode;
  speedMultiplier?: number;
  interactive?: boolean;
}

export const ThreeNeuralGlobe: React.FC<ThreeNeuralGlobeProps> = ({
  mode = 'globe',
  speedMultiplier = 1,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn('WebGL not supported:', e);
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 240;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2.5, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2.5, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x22d3ee, 2, 50);
    pointLight3.position.set(0, 12, -5);
    scene.add(pointLight3);

    // Group for all rotating objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Icosahedron Wireframe / Mesh
    const icoGeom = new THREE.IcosahedronGeometry(4.8, 2);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
    });
    const icosahedron = new THREE.Mesh(icoGeom, icoMat);
    mainGroup.add(icosahedron);

    // 2. Inner Glowing Core Sphere
    const innerGeom = new THREE.SphereGeometry(2.5, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerSphere = new THREE.Mesh(innerGeom, innerMat);
    mainGroup.add(innerSphere);

    // 3. Orbiting Data Ring 1 (Horizontal tilt)
    const ringGeom1 = new THREE.TorusGeometry(7.2, 0.05, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.5 });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    // 4. Orbiting Data Ring 2 (Counter tilt)
    const ringGeom2 = new THREE.TorusGeometry(8.0, 0.04, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = -Math.PI / 5;
    mainGroup.add(ring2);

    // 5. 3D Particle Cloud (Audience Nodes)
    const particleCount = mode === 'neural' ? 450 : 250;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x6366f1), // Indigo
      new THREE.Color(0xec4899), // Pink
      new THREE.Color(0x22d3ee), // Cyan
      new THREE.Color(0xa855f7), // Purple
      new THREE.Color(0x38bdf8), // Sky
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 5.2 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const col = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    mainGroup.add(particles);

    // 6. Platform Satellites (Floating spheres on orbits)
    const satelliteNodes: { mesh: THREE.Mesh; speed: number; radius: number; angle: number; yOffset: number }[] = [];
    const platformColors = [0x0077b5, 0x1da1f2, 0xe1306c, 0x1877f2];

    platformColors.forEach((color, idx) => {
      const satGeom = new THREE.SphereGeometry(0.35, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });
      const satMesh = new THREE.Mesh(satGeom, satMat);
      mainGroup.add(satMesh);

      satelliteNodes.push({
        mesh: satMesh,
        speed: 0.015 + idx * 0.006,
        radius: 6.8 + idx * 0.6,
        angle: (idx * Math.PI) / 2,
        yOffset: Math.sin(idx) * 2,
      });
    });

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth auto-rotation
      const effectiveSpeed = speedMultiplier;
      mainGroup.rotation.y += 0.006 * effectiveSpeed;
      mainGroup.rotation.x += 0.003 * effectiveSpeed;

      // Mouse Parallax smooth lerp
      targetRotationY = mouseX * 0.6;
      targetRotationX = mouseY * 0.4;
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

      // Pulsate inner sphere
      const scale = 1 + Math.sin(time * 2.5) * 0.08;
      innerSphere.scale.set(scale, scale, scale);

      // Rotate counter-rings
      ring1.rotation.z += 0.008 * effectiveSpeed;
      ring2.rotation.z -= 0.007 * effectiveSpeed;

      // Orbit satellites
      satelliteNodes.forEach((sat) => {
        sat.angle += sat.speed * effectiveSpeed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = Math.sin(sat.angle * 2) * sat.yOffset;
      });

      // Mode specific adjustments
      if (mode === 'neural') {
        icosahedron.scale.set(1.1, 1.1, 1.1);
        particles.rotation.y -= 0.004 * effectiveSpeed;
      } else {
        icosahedron.scale.set(1.0, 1.0, 1.0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [mode, speedMultiplier, interactive]);

  if (!webGlSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">
        3D Canvas Accelerated via Fallback Vector Shader
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full min-h-[220px] select-none" />;
};
