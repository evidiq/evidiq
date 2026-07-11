"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A slowly rotating "trust network": agent nodes on a sphere, connected by
 * edges, orbiting a glowing verification core. Auto-rotates + subtle mouse
 * parallax. Pure three.js (no R3F) for zero version friction.
 */
export default function Hero3D() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let w = el.clientWidth;
    let h = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const group = new THREE.Group();
    scene.add(group);

    // Fibonacci-sphere agent nodes
    const N = 150;
    const R = 2.5;
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * 2.399963229;
      nodes.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(R));
    }

    const pointsGeo = new THREE.BufferGeometry().setFromPoints(nodes);
    const points = new THREE.Points(
      pointsGeo,
      new THREE.PointsMaterial({ color: 0xc4b5fd, size: 0.055, transparent: true, opacity: 0.95 }),
    );
    group.add(points);

    // Edges between nearby nodes
    const edgeVerts: number[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 1.15) {
          edgeVerts.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgeVerts, 3));
    const edges = new THREE.LineSegments(
      edgeGeo,
      new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.22 }),
    );
    group.add(edges);

    // Verification core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.95, 1),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.9 }),
    );
    group.add(core);
    const coreGlow = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.62, 0),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.55 }),
    );
    group.add(coreGlow);

    let mx = 0;
    let my = 0;
    let cmx = 0;
    let cmy = 0;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);

    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      cmx += (mx - cmx) * 0.04;
      cmy += (my - cmy) * 0.04;
      group.rotation.y = t * 0.12 + cmx * 0.6;
      group.rotation.x = Math.sin(t * 0.2) * 0.1 + cmy * 0.4;
      core.rotation.y = -t * 0.3;
      core.rotation.x = t * 0.2;
      coreGlow.rotation.y = t * 0.4;
      coreGlow.scale.setScalar(1 + Math.sin(t * 1.6) * 0.05);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      pointsGeo.dispose();
      edgeGeo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mount} className="absolute inset-0" aria-hidden />;
}
