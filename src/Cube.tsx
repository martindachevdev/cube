import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
export const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

interface CubeProps {
    rotation: { x: number; y: number; z: number };
    onFaceClick: (color: string) => void;
}

const Cube: React.FC<CubeProps> = ({ rotation, onFaceClick }) => {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Get the container's width and height
        const { clientWidth: width, clientHeight: height } = mount;

        // Set up scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);

        // Append the renderer to the container
        mount.appendChild(renderer.domElement);

        // Create the cube geometry and materials
        const geometry = new THREE.BoxGeometry();
        const materials = Array(6).fill(null).map((_el, i) => new THREE.MeshBasicMaterial({ color: colors[i] }));


        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);

        camera.position.z = 5;

        // Animation loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            cube.rotation.x = rotation.x;
            cube.rotation.y = rotation.y;
            cube.rotation.z = rotation.z;
            renderer.render(scene, camera);
        };
        animate();

        // Mouse click event to detect clicks on cube faces
        const onDocumentMouseDown = (event: MouseEvent) => {
            event.preventDefault();

            const rect = mount.getBoundingClientRect();
            const mouse = new THREE.Vector2(
                ((event.clientX - rect.left) / width) * 2 - 1,
                -((event.clientY - rect.top) / height) * 2 + 1
            );

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObject(cube);

            if (intersects.length > 0) {
                const clickedFaceIndex = intersects[0].face?.materialIndex ?? 0;
                const clickedColor = colors[clickedFaceIndex];
                onFaceClick(clickedColor);
            }
        };

        mount.addEventListener('mousedown', onDocumentMouseDown);

        // Handle window resize
        const onWindowResize = () => {
            const { clientWidth: newWidth, clientHeight: newHeight } = mount;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', onWindowResize);

        // Cleanup on component unmount
        return () => {
            cancelAnimationFrame(animationId);
            mount.removeEventListener('mousedown', onDocumentMouseDown);
            window.removeEventListener('resize', onWindowResize);
            if (mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, [rotation, onFaceClick]);

    return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default Cube;