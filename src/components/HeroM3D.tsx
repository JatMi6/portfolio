"use client";

/**
 * HeroM3D — 3D letter "M" hero element
 *
 * Dependencies (add if not already installed):
 *   npm install @react-three/fiber @react-three/drei @react-three/postprocessing three
 *   npm install --save-dev @types/three
 *
 * Font: downloads automatically from threejs.org CDN.
 * For production, copy helvetiker_bold.typeface.json into /public/fonts/
 * and change FONT_URL to "/fonts/helvetiker_bold.typeface.json"
 *
 * Usage (drop into your portfolio hero section):
 *   <HeroM3D className="absolute right-[-10%] sm:right-[-5%] top-[10%]
 *                        w-[70vw] sm:w-[55vw] h-[70vw] sm:h-[55vw]" />
 */

import React, {
    useRef,
    useCallback,
    Suspense,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT_URL =
    "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

/** How strongly mouse position maps to rotation (radians) */
const ROTATION_STRENGTH = 0.32;

/** Lerp factor — lower = smoother/lazier follow */
const LERP_ACTIVE = 0.055;
const LERP_IDLE = 0.04;

/** Idle float: amplitude (units) and speed (rad/s) */
const FLOAT_AMP = 0.07;
const FLOAT_SPEED = 0.65;

// ─── Types ────────────────────────────────────────────────────────────────────

interface MouseState {
    /** Normalised X in [-1, 1] relative to canvas */
    x: number;
    /** Normalised Y in [-1, 1] relative to canvas */
    y: number;
    /** Whether the cursor is currently inside the canvas */
    active: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * The animated 3D letter M.
 * Reads mouse state from a ref to avoid React re-renders every frame.
 */
function AnimatedM({
                       mouseRef,
                   }: {
    mouseRef: React.MutableRefObject<MouseState>;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const rot = useRef({ x: 0, y: 0 });
    const time = useRef(0);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        time.current += delta;

        // ── Target rotation (inverted: mouse right → tilt left) ──────────────
        const targetX = mouseRef.current.active
            ? mouseRef.current.y * ROTATION_STRENGTH
            : 0;
        const targetY = mouseRef.current.active
            ? -mouseRef.current.x * ROTATION_STRENGTH
            : 0;

        // ── Lerp toward target ───────────────────────────────────────────────
        const speed = mouseRef.current.active ? LERP_ACTIVE : LERP_IDLE;
        rot.current.x += (targetX - rot.current.x) * speed;
        rot.current.y += (targetY - rot.current.y) * speed;

        groupRef.current.rotation.x = rot.current.x;
        groupRef.current.rotation.y = rot.current.y;

        // ── Idle float ────────────────────────────────────────────────────────
        groupRef.current.position.y =
            Math.sin(time.current * FLOAT_SPEED) * FLOAT_AMP;
    });

    return (
        <Center>
            <group ref={groupRef}>
                {/* ── Main letter body ─────────────────────────────────────────── */}
                <Text3D
                    font={FONT_URL}
                    size={1.75}
                    height={0.38}
                    curveSegments={20}
                    bevelEnabled
                    bevelThickness={0.035}
                    bevelSize={0.025}
                    bevelOffset={0}
                    bevelSegments={10}
                >
                    M
                    <meshStandardMaterial
                        color="#0c0c10"
                        roughness={0.18}
                        metalness={0.95}
                        envMapIntensity={1.2}
                        // Very faint emissive so bloom picks up the surface edges
                        emissive="#00ff88"
                        emissiveIntensity={0.06}
                    />
                </Text3D>

                {/*
         * ── Neon outline pass ──────────────────────────────────────────
         * A hair-larger clone rendered as wireframe/emissive to act as
         * the glowing shell. Bloom amplifies this into a neon halo.
         */}
                <Text3D
                    font={FONT_URL}
                    size={1.75}
                    height={0.38}
                    curveSegments={20}
                    bevelEnabled
                    bevelThickness={0.035}
                    bevelSize={0.025}
                    bevelOffset={0}
                    bevelSegments={10}
                    scale={[1.008, 1.008, 1.008]}
                >
                    M
                    <meshBasicMaterial
                        color="#00ff88"
                        wireframe
                        transparent
                        opacity={0.18}
                        depthWrite={false}
                    />
                </Text3D>
            </group>
        </Center>
    );
}

/**
 * The full Three.js scene: lights + letter + post-processing.
 */
function Scene({
                   mouseRef,
               }: {
    mouseRef: React.MutableRefObject<MouseState>;
}) {
    return (
        <>
            {/* ── Lighting ─────────────────────────────────────────────────────── */}

            {/* Soft fill — keeps the dark face barely visible */}
            <ambientLight intensity={0.08} color="#ffffff" />

            {/* Key light — white, slightly top-right */}
            <directionalLight
                position={[4, 6, 5]}
                intensity={0.7}
                color="#ffffff"
            />

            {/* Rim / back light — cold blue, separates letter from void */}
            <directionalLight
                position={[-4, -3, -3]}
                intensity={0.4}
                color="#2255ff"
            />

            {/* Neon green fill — this is what blooms */}
            <pointLight position={[0, 1.5, 3.5]} intensity={1.2} color="#00ff88" distance={5} decay={3}/>
            <pointLight position={[0, -2, 2]} intensity={0.6} color="#00ff88" distance={3} decay={3}/>

            {/* ── Letter ───────────────────────────────────────────────────────── */}
            <Suspense fallback={null}>
                <AnimatedM mouseRef={mouseRef} />
            </Suspense>

            {/* ── Post-processing ──────────────────────────────────────────────── */}
            <EffectComposer>
                <Bloom
                    intensity={1.2}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.85}
                    mipmapBlur
                    radius={0.75}
                />
            </EffectComposer>
        </>
    );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface HeroM3DProps {
    /** Tailwind / CSS class for sizing/positioning (default: w-full h-full) */
    className?: string;
}

export default function HeroM3D({ className }: HeroM3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef<MouseState>({ x: 0, y: 0, active: false });

    /** Update normalised mouse coords relative to the canvas */
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            mouseRef.current.x =
                ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y =
                -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        },
        []
    );

    return (
        <div
            ref={containerRef}
            className={className ?? "w-full h-full"}
            // pointer-events-auto so mouse events reach the canvas
            style={{ pointerEvents: "auto" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => {
                mouseRef.current.active = true;
            }}
            onMouseLeave={() => {
                mouseRef.current.active = false;
            }}
        >
            <Canvas
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [0, 0, 5.5], fov: 46 }}
                dpr={[1, 2]}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ background: "transparent" }}
            >
                <Scene mouseRef={mouseRef} />
            </Canvas>
        </div>
    );
}