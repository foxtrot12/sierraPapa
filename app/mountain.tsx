"use client"
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const WebGLDotMover: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<THREE.Mesh>(new THREE.Mesh());
  const cameraRef = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera());

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create a dot (small sphere)
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const dot = new THREE.Mesh(geometry, material);
    dotRef.current = dot;
    scene.add(dot);

    camera.position.z = 5;

    // Movement state
    const movement = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    // Handle keyboard events
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp': movement.up = true; break;
        case 'ArrowDown': movement.down = true; break;
        case 'ArrowLeft': movement.left = true; break;
        case 'ArrowRight': movement.right = true; break;
        default: break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp': movement.up = false; break;
        case 'ArrowDown': movement.down = false; break;
        case 'ArrowLeft': movement.left = false; break;
        case 'ArrowRight': movement.right = false; break;
        default: break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Check if the dot is out of view
    const isDotOutOfView = () => {
      const dotPosition = new THREE.Vector3();
      dot.getWorldPosition(dotPosition);
      const frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
      
      return !frustum.containsPoint(dotPosition);
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update dot position based on movement
      if (movement.up) dot.position.y += 0.05;
      if (movement.down) dot.position.y -= 0.05;
      if (movement.left) dot.position.x -= 0.05;
      if (movement.right) dot.position.x += 0.05;

      // Adjust camera if dot is out of view
      if (isDotOutOfView()) {
        camera.position.x = dot.position.x;
        camera.position.y = dot.position.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default WebGLDotMover;
