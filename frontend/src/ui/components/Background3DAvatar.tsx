import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const MinimalBust = () => {
    const groupRef = useRef<THREE.Group>(null);
    const targetRotation = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Map mouse to [-1, 1]
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;

            // Set Target rotatoin (x: pitch, y: yaw)
            targetRotation.current.y = x * 0.5;
            targetRotation.current.x = -y * 0.3;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(() => {
        if (groupRef.current) {
            // Smoothly lerp towards target
            groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
            groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={[0, -0.5, 0]} scale={0.7}>
            {/* Neck */}
            <mesh position={[0, -1.5, 0]}>
                <cylinderGeometry args={[0.5, 0.7, 1.5, 64]} />
                <meshStandardMaterial color="#2a2d36" roughness={0.3} metalness={0.2} />
            </mesh>

            {/* Head Base */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    roughness={0.15}
                    metalness={0.1}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                />
            </mesh>

            {/* Premium Visor */}
            <mesh position={[0, 0.2, 1.3]} rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[2.2, 0.8, 0.6]} />
                <meshPhysicalMaterial
                    color="#111111"
                    roughness={0.05}
                    metalness={0.9}
                    transmission={0.5}
                    thickness={0.5}
                />
            </mesh>

            {/* Glowing Tech Elements / Eyes */}
            <pointLight position={[-0.5, 0.2, 1.5]} intensity={0.5} color="#4EDEA3" distance={2} />
            <pointLight position={[0.5, 0.2, 1.5]} intensity={0.5} color="#4EDEA3" distance={2} />

            <mesh position={[-0.4, 0.2, 1.55]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#4EDEA3" />
            </mesh>
            <mesh position={[0.4, 0.2, 1.55]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#4EDEA3" />
            </mesh>
        </group>
    );
};

export const Background3DAvatar: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                <directionalLight position={[-10, 5, -5]} intensity={1} color="#4EDEA3" />
                <Environment preset="studio" />
                <MinimalBust />
            </Canvas>
        </div>
    );
};
