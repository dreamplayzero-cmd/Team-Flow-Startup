import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const AbstractBust = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        // Track mouse position and convert to target rotations
        const mouseX = (state.mouse.x * Math.PI) / 3;
        const mouseY = (state.mouse.y * Math.PI) / 4;

        if (groupRef.current) {
            // Smoothly look at the mouse position
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.1);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.1);
        }
    });

    return (
        <group ref={groupRef} position={[0, -0.2, 0]}>
            {/* Neck */}
            <mesh position={[0, -1.2, 0]}>
                <cylinderGeometry args={[0.4, 0.6, 1, 32]} />
                <meshStandardMaterial color="#f8f9fa" roughness={0.7} />
            </mesh>

            {/* Head Base */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[1.2, 64, 64]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
            </mesh>

            {/* Stylized Visor / Glasses */}
            <mesh position={[0, 0.2, 1.05]} rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[1.8, 0.6, 0.4]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
            </mesh>

            {/* Glowing Eyes inside visor */}
            <mesh position={[-0.4, 0.2, 1.26]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="#4EDEA3" />
            </mesh>
            <mesh position={[0.4, 0.2, 1.26]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="#4EDEA3" />
            </mesh>

            {/* Ear Pieces for tech feel */}
            <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
                <meshStandardMaterial color="#e9ecef" roughness={0.5} />
            </mesh>
            <mesh position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
                <meshStandardMaterial color="#e9ecef" roughness={0.5} />
            </mesh>
        </group>
    );
};

export const InteractiveAvatar: React.FC = () => {
    return (
        <div className="w-full h-80 relative cursor-crosshair rounded-[2.5rem] bg-gradient-to-b from-[#faf8ff] to-[#f0f4f8] overflow-hidden border border-stitch-outline-variant/20 shadow-sm mb-12">
            <div className="absolute inset-x-0 top-6 text-center z-10 pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stitch-primary/50 bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                    AI 페르소나 아바타
                </span>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(78,222,163,0.3)_0%,transparent_70%)]"></div>

            <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#4EDEA3" />
                <Environment preset="city" />
                <AbstractBust />
            </Canvas>
        </div>
    );
};
