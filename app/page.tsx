"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { motion, Variants, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Quote, CheckCircle2, Database, Code2, Layout, Zap, Terminal } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";

import {
  heroData,
  aboutData,
  skillsData,
  projectsData,
  processData,
  testimonialsData,
  contactData,
} from "@/src/data/portfolio";
import { siteConfig } from "@/src/data/config";

const ease = [0.25, 1, 0.5, 1] as [number, number, number, number];

const fadeUp: Variants = {
    initial: { opacity: 0, y: 40, filter: "blur(8px)" },
    whileInView: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1.2, ease }
    },
};

const staggerContainer: Variants = {
    initial: { opacity: 0 },
    whileInView: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

// (scramble removed)

// ─── Magnetic Button ─────────────────────────────────────────────────────────
function MagneticButton({ children, href, className }: {
    children: React.ReactNode;
    href: string;
    className: string;
}) {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 15 });
    const springY = useSpring(y, { stiffness: 200, damping: 15 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const dist = Math.sqrt(distX ** 2 + distY ** 2);
        const RADIUS = 120;
        if (dist < RADIUS) {
            const strength = (1 - dist / RADIUS) * 0.5;
            x.set(distX * strength);
            y.set(distY * strength);
        }
    }, [x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.a
            ref={ref}
            href={href}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
        >
            {children}
        </motion.a>
    );
}

// ─── Word-by-word reveal heading ─────────────────────────────────────────────
const wordVariant: Variants = {
    initial: { opacity: 0, y: 60, filter: "blur(12px)" },
    animate: (i: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 * i },
    }),
};

function RevealHeading({ text }: { text: string }) {
    // Split into lines, then words, track global word index for stagger delay
    const lines = text.split("\n");
    let globalIdx = 0;

    return (
        <h1 className="text-[clamp(3.5rem,8vw,8rem)] font-semibold leading-[0.92] tracking-tighter mb-8 select-none">
            {lines.map((line, li) => {
                const words = line.split(" ");
                return (
                    <span key={li} className="block overflow-hidden">
                        {words.map((word, wi) => {
                            const idx = globalIdx++;
                            return (
                                <span key={wi} className="inline-block overflow-hidden mr-[0.22em] last:mr-0">
                                    <motion.span
                                        className="inline-block text-transparent bg-clip-text"
                                        style={{
                                            backgroundImage: "linear-gradient(160deg, #ffffff 30%, #52525b 100%)",
                                        }}
                                        custom={idx}
                                        initial="initial"
                                        animate="animate"
                                        variants={wordVariant}
                                    >
                                        {word}
                                    </motion.span>
                                </span>
                            );
                        })}
                    </span>
                );
            })}
        </h1>
    );
}

// ─── Spotlight / Cursor Glow ──────────────────────────────────────────────────
function CursorSpotlight({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
    const mouseX = useMotionValue(-400);
    const mouseY = useMotionValue(-400);
    const springX = useSpring(mouseX, { stiffness: 80, damping: 18 });
    const springY = useSpring(mouseY, { stiffness: 80, damping: 18 });
    const [isInside, setIsInside] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        };
        const onEnter = () => setIsInside(true);
        const onLeave = () => setIsInside(false);
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        return () => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, [containerRef, mouseX, mouseY]);

    return (
        <>
            {/* Primary glow */}
            <motion.div
                className="pointer-events-none absolute z-[1]"
                style={{
                    left: springX,
                    top: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, rgba(16,185,129,0.04) 40%, transparent 70%)",
                    opacity: isInside ? 1 : 0,
                    transition: "opacity 0.4s ease",
                }}
            />
            {/* Sharp inner dot */}
            <motion.div
                className="pointer-events-none absolute z-[2]"
                style={{
                    left: springX,
                    top: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "rgba(129,140,248,0.9)",
                    boxShadow: "0 0 20px 4px rgba(129,140,248,0.5)",
                    opacity: isInside ? 1 : 0,
                    transition: "opacity 0.3s ease",
                }}
            />
            {/* Dot grid that gets revealed */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(79,70,229,0.4) 1px, transparent 1px)",
                    backgroundSize: "36px 36px",
                    maskImage: isInside ? undefined : undefined,
                }}
            />
        </>
    );
}

// ─── 3D Komponenta ─────────────────────────────────────────────────────────────
const Hero3D = () => (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-auto mix-blend-screen">
        <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[1, 2, 3]} intensity={1.5} color="#4f46e5" />
            <directionalLight position={[-1, -2, -3]} intensity={0.5} color="#10b981" />
            <Sphere args={[1, 100, 100]} scale={1.4}>
                <MeshDistortMaterial
                    color="#0a1930"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.1}
                    metalness={0.8}
                />
            </Sphere>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
        </Canvas>
    </div>
);

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function Portfolio() {
    const heroRef = useRef<HTMLElement>(null);

    return (
        <main className="bg-black min-h-screen text-green-500 font-mono selection:bg-green-500 selection:text-black overflow-x-hidden">

            {/* HERO */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-20 pt-16 sm:pt-20 overflow-hidden bg-black"
            >
                {/* Brutalist grid background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(to right, #00ff00 1px, transparent 1px),
                            linear-gradient(to bottom, #00ff00 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px'
                    }} />
                </div>
                
                {/* Glitch effect overlays */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                
                {/* Terminal-style accent boxes */}
                <div className="absolute top-4 sm:top-10 left-4 sm:left-10 border border-green-500 px-2 sm:px-3 py-1 font-mono text-xs text-green-500 animate-pulse">
                    $ ./init.sh
                </div>
                <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 border border-red-500 px-2 sm:px-3 py-1 font-mono text-xs text-red-500">
                    STATUS: ONLINE
                </div>

                {/* Cursor spotlight (stays within hero bounds) */}
                <CursorSpotlight containerRef={heroRef as React.RefObject<HTMLElement>} />

                {/* 3D sphere (right side) */}
                <div className="absolute right-[-10%] sm:right-[-5%] top-[10%] w-[70vw] sm:w-[55vw] h-[70vw] sm:h-[55vw] pointer-events-none">
                    <Hero3D />
                </div>

                <motion.div
                    initial="initial"
                    animate="whileInView"
                    variants={staggerContainer}
                    className="max-w-6xl z-10"
                >
                    <motion.div variants={fadeUp} className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-4">
                        <div className="h-[1px] sm:h-[2px] w-8 sm:w-12 bg-green-500 animate-pulse" />
                        <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-green-500 font-bold">
                            {heroData.subtitle}
                        </span>
                        <div className="h-[1px] sm:h-[2px] w-8 sm:w-12 bg-green-500 animate-pulse" />
                    </motion.div>

                    {/* Brutalist terminal heading */}
                    <motion.div variants={fadeUp}>
                        <div className="font-mono text-[clamp(2rem,12vw,6rem)] sm:text-[clamp(3rem,10vw,10rem)] font-black leading-none mb-6 sm:mb-8">
                            <div className="text-red-500 animate-pulse" style={{ textShadow: '0 0 10px #ff0000' }}>BREAK</div>
                            <div className="text-green-500" style={{ textShadow: '0 0 10px #00ff00' }}>BUILD</div>
                            <div className="text-blue-500" style={{ textShadow: '0 0 10px #0000ff' }}>DEPLOY</div>
                        </div>
                    </motion.div>

                    <motion.p
                        variants={fadeUp}
                        className="text-sm sm:text-lg md:text-xl font-mono text-green-400 max-w-3xl mb-8 sm:mb-12 leading-relaxed border-l-4 border-green-500 pl-4 sm:pl-6"
                        style={{ textShadow: '0 0 5px #00ff00' }}
                    >
                        {heroData.description}
                    </motion.p>

                    {/* Brutalist CTA */}
                    <motion.div variants={fadeUp}>
                        <MagneticButton
                            href={heroData.cta.href}
                            className="group pointer-events-auto inline-flex items-center gap-3 sm:gap-4 border-2 border-green-500 bg-black text-green-500 px-6 sm:px-8 py-3 sm:py-4 font-mono font-bold tracking-widest text-sm sm:text-base transition-all duration-300 hover:bg-green-500 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] active:scale-[0.98]"
                        >
                            {heroData.cta.text}
                            <ArrowRight
                                size={14}
                                className="transform transition-transform group-hover:translate-x-1"
                            />
                        </MagneticButton>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── ECOSYSTEM BAR ───────────────────────────────────────────────{/* SYSTEM_STACK BAR */}
            <section className="border-y-2 border-green-500 bg-black terminal-grid">
                <div className="px-4 sm:px-6 md:px-20 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 scanlines">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-red-500 font-mono text-xs sm:text-sm">$</span>
                        <span className="text-green-500 font-mono text-xs sm:text-sm font-bold">SYSTEM.STACK</span>
                        <span className="text-green-500 font-mono text-xs sm:text-sm animate-pulse">_</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                        {skillsData.map((tech, i) => {
                            const iconMap: Record<string, React.ReactNode> = {
                                Layout: <Layout size={14} className="text-green-500" />,
                                Code2: <Code2 size={14} className="text-green-500" />,
                                Zap: <Zap size={14} className="text-green-500" />,
                                Database: <Database size={14} className="text-green-500" />,
                                Terminal: <Terminal size={14} className="text-green-500" />,
                            };
                            return (
                                <div key={i} className="flex items-center gap-1 sm:gap-2 border border-green-500 px-2 sm:px-3 py-1 font-mono text-xs text-green-500 transition-all duration-300 hover:bg-green-500 hover:text-black hover:shadow-[0_0_15px_rgba(0,255,0,0.5)]">
                                    {iconMap[tech.icon]}
                                    <span className="font-bold hidden sm:inline">{tech.name}</span>
                                    <span className="font-bold sm:hidden">{tech.name.slice(0, 3)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── ABOUT ───────────────────────────────────────────────────────{/* SYSTEM.INFO */}
            <section className="py-24 sm:py-32 md:py-48 px-4 sm:px-6 md:px-20 max-w-7xl mx-auto terminal-grid">
                <motion.div
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16"
                >
                    <motion.div variants={fadeUp} className="flex flex-col gap-6 lg:w-1/3">
                        <div className="border-2 border-green-500 bg-black px-4 sm:px-5 py-3 font-mono">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-red-500 text-sm">$</span>
                                <span className="text-green-500 text-sm">status</span>
                                <span className="text-green-500 text-sm animate-pulse">_</span>
                            </div>
                            <div className="mt-2 text-green-500 text-xs sm:text-sm">
                                {aboutData.availability.status} // {aboutData.availability.period}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="lg:w-2/3">
                        <div className="font-mono text-xl sm:text-2xl lg:text-4xl leading-tight text-green-400 mb-6">
                            <div className="text-red-500 glitch">&gt; {aboutData.heading}</div>
                            <div className="text-blue-500 italic text-lg sm:text-xl lg:text-2xl">{aboutData.headingItalic}</div>
                        </div>
                        <div className="font-mono text-sm sm:text-base lg:text-lg text-green-300 border-l-4 border-green-500 pl-4 sm:pl-6 scanlines">
                            {aboutData.description}
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── WORK ────────────────────────────────────────────────────────            {/* DEPLOY.LOG */}
            <section id="work" className="py-24 sm:py-32 md:py-48 px-4 sm:px-6 md:px-20 bg-black border-t-2 border-green-500 terminal-grid">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 sm:mb-20 md:mb-24 flex flex-col lg:flex-row justify-between items-end gap-8">
                        <div className="w-full lg:w-auto">
                            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                                <span className="text-red-500 font-mono text-xs sm:text-sm">$</span>
                                <span className="text-green-500 font-mono text-xs sm:text-sm">ls -la /deployments/</span>
                                <span className="text-green-500 font-mono text-xs sm:text-sm animate-pulse">_</span>
                            </div>
                            <div className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-green-400 glitch leading-tight">
                                &gt; DEPLOYED<br/>SYSTEMS
                            </div>
                            <div className="mt-4 text-green-500 font-mono text-sm opacity-70">
                                <span className="text-red-500">[</span> {projectsData.length} active deployments <span className="text-red-500">]</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {projectsData.map((project) => (
                            <a key={project.id} href={project.link} target="_blank" rel="noopener noreferrer" className="block group">
                                <motion.div
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={fadeUp}
                                    className="relative cursor-pointer block h-80 sm:h-96 lg:h-112 overflow-hidden border-2 border-green-500 bg-black transition-all duration-700 hover:border-red-500 hover:shadow-[0_0_30px_rgba(255,0,0,0.3)] group-hover:-translate-y-2"
                                >
                                    {/* Terminal header */}
                                    <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 bg-black border-b-2 border-green-500 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 z-20">
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                                        <span className="flex-1 text-center font-mono text-xs text-green-500 truncate">{project.title}.exe</span>
                                    </div>
                                    
                                    <img src={project.image} alt={project.title} className="absolute inset-6 sm:inset-8 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700 z-0" />
                                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-4 sm:p-6 border border-green-500 bg-black/80 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                                            <span className="border border-green-500 text-green-500 text-xs px-2 sm:px-3 py-1 font-mono uppercase tracking-wider whitespace-nowrap">{project.tag}</span>
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 border border-green-500 bg-black flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out flex-shrink-0">
                                                <ArrowRight size={12} className="text-green-500 sm:block hidden" />
                                                <ArrowRight size={10} className="text-green-500 block sm:hidden" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl text-green-400 mb-2 font-mono font-bold leading-tight">{project.title}</h3>
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                                                <p className="overflow-hidden text-green-300 text-xs sm:text-sm font-mono leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{project.result}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PROCESS ─────────────────────────────────────────────────────{/* EXECUTION.PROTOCOL */}
            <section className="py-24 sm:py-32 md:py-48 px-4 sm:px-6 md:px-20 max-w-7xl mx-auto terminal-grid overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-4 mb-6">
                    <span className="text-red-500 font-mono text-xs sm:text-sm">$</span>
                    <span className="text-green-500 font-mono text-xs sm:text-sm">cat protocol.txt</span>
                    <span className="text-green-500 font-mono text-xs sm:text-sm animate-pulse">_</span>
                </div>
                <div className="font-mono text-2xl sm:text-3xl md:text-5xl text-green-400 glitch mb-20 sm:mb-24 md:mb-32">
                    &gt; EXECUTION<br/>PROTOCOL
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute top-[30px] left-0 w-full h-1 bg-green-500"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 relative z-10">
                        {processData.map((step, i) => (
                            <motion.div key={i} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="flex flex-col gap-6 sm:gap-8 group">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-green-500 bg-black flex items-center justify-center text-xs sm:text-sm font-bold text-green-500 font-mono transition-all duration-500 group-hover:border-red-500 group-hover:bg-red-500 group-hover:text-black group-hover:scale-110 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                                    {step.num}
                                </div>
                                <div>
                                    <h4 className="text-lg sm:text-xl lg:text-2xl text-green-400 mb-3 font-mono font-bold">{step.title}</h4>
                                    <p className="text-green-300 leading-relaxed pr-4 sm:pr-8 font-mono text-xs sm:text-sm border-l-4 border-green-500 pl-3 sm:pl-4">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ──────────────────────────────────────────────── {/* SYSTEM.LOGS */}
            <section className="py-24 sm:py-32 md:py-48 px-4 sm:px-6 md:px-20 bg-black border-y-2 border-green-500 terminal-grid relative overflow-hidden">
                <div className="max-w-6xl mx-auto grid sm:grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 relative z-10">
                    {testimonialsData.map((quote) => (
                        <motion.div key={quote.id} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="flex flex-col gap-4 sm:gap-6 border-2 border-green-500 bg-black p-6 sm:p-8 transition-all hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                            <div className="flex items-center gap-2 sm:gap-4 mb-4">
                                <span className="text-red-500 font-mono text-xs sm:text-sm">$</span>
                                <span className="text-green-500 font-mono text-xs sm:text-sm">cat feedback.log</span>
                                <span className="text-green-500 font-mono text-xs sm:text-sm animate-pulse">_</span>
                            </div>
                            <div className="text-green-400 font-mono text-xl sm:text-2xl mb-4">&gt;&gt;&gt;</div>
                            <p className="text-base sm:text-lg text-green-300 font-mono leading-relaxed">"{quote.text}"</p>
                            <div className="flex items-center gap-3 sm:gap-4 mt-auto pt-4 sm:pt-6 border-t border-green-500">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-green-500 bg-black flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-green-500 sm:block hidden" />
                                    <CheckCircle2 size={14} className="text-green-500 block sm:hidden" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs sm:text-sm font-mono font-bold text-green-400 uppercase tracking-wider">{quote.author}</span>
                                    <span className="text-xs font-mono text-green-500 uppercase tracking-wider mt-1">{quote.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── CONTACT ───────────────────────────────────────────────────── {/* CONNECTION.PORT */}
            <section className="py-24 sm:py-32 md:py-48 px-4 sm:px-6 md:px-20 text-center relative overflow-hidden terminal-grid">
                <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto flex flex-col items-center gap-8 sm:gap-10">
                    <div className="flex items-center gap-2 sm:gap-4 mb-6">
                        <span className="text-red-500 font-mono text-xs sm:text-sm">$</span>
                        <span className="text-green-500 font-mono text-xs sm:text-sm">nc -l 8080</span>
                        <span className="text-green-500 font-mono text-xs sm:text-sm animate-pulse">_</span>
                    </div>
                    <div className="font-mono text-[clamp(2rem,10vw,6rem)] sm:text-[clamp(3rem,8vw,8rem)] font-black text-green-400 glitch leading-none">
                        {contactData.heading.split("\n").map((line, i) => (
                            <span key={i}>{line}{i !== contactData.heading.split("\n").length - 1 && <br />}</span>
                        ))}
                    </div>
                    <p className="text-base sm:text-lg md:text-xl text-green-300 font-mono mb-6 sm:mb-8 max-w-2xl leading-relaxed border-l-4 border-green-500 pl-4 sm:pl-6">{contactData.description}</p>
                    <MagneticButton
                        href={`mailto:${siteConfig.email}`}
                        className="group relative overflow-hidden border-2 border-green-500 bg-black text-green-500 px-8 sm:px-12 py-3 sm:py-6 font-mono font-bold text-sm sm:text-lg transition-all hover:bg-green-500 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] active:scale-[0.98]"
                    >
                        <span className="relative flex items-center gap-2 sm:gap-3">
                            {contactData.buttonText} <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-1" />
                        </span>
                    </MagneticButton>
                    <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 animate-pulse"></div>
                        <p className="text-xs sm:text-sm text-green-400 font-mono font-bold uppercase tracking-wider">{contactData.availability}</p>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}