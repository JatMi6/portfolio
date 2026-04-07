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
        <main className="bg-[#030303] min-h-screen text-zinc-400 font-sans selection:bg-zinc-200 selection:text-black overflow-x-hidden">

            {/* ─── HERO ──────────────────────────────────────────────────────── */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20 overflow-hidden bg-black"
            >
                {/* Brutalist grid background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(to right, #00ff00 1px, transparent 1px),
                            linear-gradient(to bottom, #00ff00 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }} />
                </div>
                
                {/* Glitch effect overlays */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                
                {/* Terminal-style accent boxes */}
                <div className="absolute top-10 left-10 border border-green-500 px-3 py-1 font-mono text-xs text-green-500 animate-pulse">
                    $ ./init.sh
                </div>
                <div className="absolute bottom-10 right-10 border border-red-500 px-3 py-1 font-mono text-xs text-red-500">
                    STATUS: ONLINE
                </div>

                {/* Cursor spotlight (stays within hero bounds) */}
                <CursorSpotlight containerRef={heroRef as React.RefObject<HTMLElement>} />

                {/* 3D sphere (right side) */}
                <div className="absolute right-[-5%] top-[10%] w-[55vw] h-[55vw] pointer-events-none">
                    <Hero3D />
                </div>

                <motion.div
                    initial="initial"
                    animate="whileInView"
                    variants={staggerContainer}
                    className="max-w-6xl z-10"
                >
                    <motion.div variants={fadeUp} className="mb-8 flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-green-500 animate-pulse" />
                        <span className="text-sm font-mono uppercase tracking-widest text-green-500 font-bold">
                            {heroData.subtitle}
                        </span>
                        <div className="h-[2px] w-12 bg-green-500 animate-pulse" />
                    </motion.div>

                    {/* Brutalist terminal heading */}
                    <motion.div variants={fadeUp}>
                        <div className="font-mono text-[clamp(3rem,10vw,10rem)] font-black leading-none mb-8">
                            <div className="text-red-500 animate-pulse" style={{ textShadow: '0 0 10px #ff0000' }}>BREAK</div>
                            <div className="text-green-500" style={{ textShadow: '0 0 10px #00ff00' }}>BUILD</div>
                            <div className="text-blue-500" style={{ textShadow: '0 0 10px #0000ff' }}>DEPLOY</div>
                        </div>
                    </motion.div>

                    <motion.p
                        variants={fadeUp}
                        className="text-lg md:text-xl font-mono text-green-400 max-w-3xl mb-12 leading-relaxed border-l-4 border-green-500 pl-6"
                        style={{ textShadow: '0 0 5px #00ff00' }}
                    >
                        {heroData.description}
                    </motion.p>

                    {/* Brutalist CTA */}
                    <motion.div variants={fadeUp}>
                        <MagneticButton
                            href={heroData.cta.href}
                            className="group pointer-events-auto inline-flex items-center gap-4 border-2 border-green-500 bg-black text-green-500 px-8 py-4 font-mono font-bold tracking-widest transition-all duration-300 hover:bg-green-500 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] active:scale-[0.98]"
                        >
                            {heroData.cta.text}
                            <ArrowRight
                                size={18}
                                className="transform transition-transform group-hover:translate-x-1"
                            />
                        </MagneticButton>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── ECOSYSTEM BAR ───────────────────────────────────────────────{/* SYSTEM_STACK BAR */}
            <section className="border-y-2 border-green-500 bg-black terminal-grid">
                <div className="px-6 md:px-20 py-8 flex flex-wrap items-center justify-between gap-8 scanlines">
                    <div className="flex items-center gap-3">
                        <span className="text-red-500 font-mono text-sm">$</span>
                        <span className="text-green-500 font-mono text-sm font-bold">SYSTEM.STACK</span>
                        <span className="text-green-500 font-mono text-sm animate-pulse">_</span>
                    </div>
                    {skillsData.map((tech, i) => {
                        const iconMap: Record<string, React.ReactNode> = {
                            Layout: <Layout size={16} className="text-green-500" />,
                            Code2: <Code2 size={16} className="text-green-500" />,
                            Zap: <Zap size={16} className="text-green-500" />,
                            Database: <Database size={16} className="text-green-500" />,
                            Terminal: <Terminal size={16} className="text-green-500" />,
                        };
                        return (
                            <div key={i} className="flex items-center gap-2 border border-green-500 px-3 py-1 font-mono text-xs text-green-500 transition-all duration-300 hover:bg-green-500 hover:text-black hover:shadow-[0_0_15px_rgba(0,255,0,0.5)]">
                                {iconMap[tech.icon]}
                                <span className="font-bold">{tech.name}</span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── ABOUT ───────────────────────────────────────────────────────{/* SYSTEM.INFO */}
            <section className="py-48 px-6 md:px-20 max-w-7xl mx-auto terminal-grid">
                <motion.div
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="flex flex-col md:flex-row justify-between items-start gap-16"
                >
                    <motion.div variants={fadeUp} className="flex flex-col gap-6 md:w-1/3">
                        <div className="border-2 border-green-500 bg-black px-5 py-3 font-mono">
                            <div className="flex items-center gap-3">
                                <span className="text-red-500">$</span>
                                <span className="text-green-500">status</span>
                                <span className="text-green-500 animate-pulse">_</span>
                            </div>
                            <div className="mt-2 text-green-500 text-sm">
                                {aboutData.availability.status} // {aboutData.availability.period}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="md:w-2/3">
                        <div className="font-mono text-2xl md:text-4xl leading-tight text-green-400 mb-6">
                            <div className="text-red-500 glitch">&gt; {aboutData.heading}</div>
                            <div className="text-blue-500 italic">{aboutData.headingItalic}</div>
                        </div>
                        <div className="font-mono text-lg text-green-300 border-l-4 border-green-500 pl-6 scanlines">
                            {aboutData.description}
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── WORK ────────────────────────────────────────────────────────            {/* DEPLOY.LOG */}
            <section id="work" className="py-48 px-6 md:px-20 bg-black border-t-2 border-green-500 terminal-grid">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-red-500 font-mono text-sm">$</span>
                                <span className="text-green-500 font-mono text-sm">ls -la /deployments/</span>
                                <span className="text-green-500 font-mono text-sm animate-pulse">_</span>
                            </div>
                            <div className="font-mono text-3xl md:text-5xl text-green-400 glitch">
                                &gt; DEPLOYED<br/>SYSTEMS
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projectsData.map((project) => (
                            <a key={project.id} href={project.link} target="_blank" rel="noopener noreferrer" className="block group">
                                <motion.div
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={fadeUp}
                                    className="relative cursor-pointer block h-[500px] overflow-hidden border-2 border-green-500 bg-black transition-all duration-700 hover:border-red-500 hover:shadow-[0_0_30px_rgba(255,0,0,0.3)] group-hover:-translate-y-2"
                                >
                                    {/* Terminal header */}
                                    <div className="absolute top-0 left-0 right-0 h-8 bg-black border-b-2 border-green-500 flex items-center gap-2 px-3 z-20">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="flex-1 text-center font-mono text-xs text-green-500">{project.title}.exe</span>
                                    </div>
                                    
                                    <img src={project.image} alt={project.title} className="absolute inset-8 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700 z-0" />
                                    <div className="absolute bottom-4 left-4 right-4 p-6 border border-green-500 bg-black/80 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="border border-green-500 text-green-500 text-xs px-3 py-1 font-mono uppercase tracking-wider">{project.tag}</span>
                                            <div className="w-8 h-8 border border-green-500 bg-black flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out">
                                                <ArrowRight size={14} className="text-green-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl text-green-400 mb-2 font-mono font-bold">{project.title}</h3>
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                                                <p className="overflow-hidden text-green-300 text-sm font-mono leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{project.result}</p>
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
            <section className="py-48 px-6 md:px-20 max-w-7xl mx-auto terminal-grid overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-red-500 font-mono text-sm">$</span>
                    <span className="text-green-500 font-mono text-sm">cat protocol.txt</span>
                    <span className="text-green-500 font-mono text-sm animate-pulse">_</span>
                </div>
                <div className="font-mono text-3xl md:text-5xl text-green-400 glitch mb-32">
                    &gt; EXECUTION<br/>PROTOCOL
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute top-[30px] left-0 w-full h-1 bg-green-500"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative z-10">
                        {processData.map((step, i) => (
                            <motion.div key={i} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="flex flex-col gap-8 group">
                                <div className="w-16 h-16 border-2 border-green-500 bg-black flex items-center justify-center text-sm font-bold text-green-500 font-mono transition-all duration-500 group-hover:border-red-500 group-hover:bg-red-500 group-hover:text-black group-hover:scale-110 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                                    {step.num}
                                </div>
                                <div>
                                    <h4 className="text-2xl text-green-400 mb-3 font-mono font-bold">{step.title}</h4>
                                    <p className="text-green-300 leading-relaxed pr-8 font-mono text-sm border-l-4 border-green-500 pl-4">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ────────────────────────────────────────────────{/* SYSTEM.LOGS */}
            <section className="py-48 px-6 md:px-20 bg-black border-y-2 border-green-500 terminal-grid relative overflow-hidden">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 relative z-10">
                    {testimonialsData.map((quote) => (
                        <motion.div key={quote.id} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="flex flex-col gap-6 border-2 border-green-500 bg-black p-8 transition-all hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-red-500 font-mono text-sm">$</span>
                                <span className="text-green-500 font-mono text-sm">cat feedback.log</span>
                                <span className="text-green-500 font-mono text-sm animate-pulse">_</span>
                            </div>
                            <div className="text-green-400 font-mono text-2xl mb-4">&gt;&gt;&gt;</div>
                            <p className="text-lg md:text-xl text-green-300 font-mono leading-relaxed">"{quote.text}"</p>
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-green-500">
                                <div className="w-12 h-12 border-2 border-green-500 bg-black flex items-center justify-center">
                                    <CheckCircle2 size={20} className="text-green-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-mono font-bold text-green-400 uppercase tracking-wider">{quote.author}</span>
                                    <span className="text-xs font-mono text-green-500 uppercase tracking-wider mt-1">{quote.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── CONTACT ─────────────────────────────────────────────────────{/* CONNECTION.PORT */}
            <section className="py-48 px-6 md:px-20 text-center relative overflow-hidden terminal-grid">
                <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto flex flex-col items-center gap-10">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-red-500 font-mono text-sm">$</span>
                        <span className="text-green-500 font-mono text-sm">nc -l 8080</span>
                        <span className="text-green-500 font-mono text-sm animate-pulse">_</span>
                    </div>
                    <div className="font-mono text-[clamp(3rem,8vw,8rem)] font-black text-green-400 glitch leading-none">
                        {contactData.heading.split("\n").map((line, i) => (
                            <span key={i}>{line}{i !== contactData.heading.split("\n").length - 1 && <br />}</span>
                        ))}
                    </div>
                    <p className="text-xl md:text-2xl text-green-300 font-mono mb-6 max-w-2xl leading-relaxed border-l-4 border-green-500 pl-6">{contactData.description}</p>
                    <MagneticButton
                        href={`mailto:${siteConfig.email}`}
                        className="group relative overflow-hidden border-2 border-green-500 bg-black text-green-500 px-12 py-6 font-mono font-bold text-lg transition-all hover:bg-green-500 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] active:scale-[0.98]"
                    >
                        <span className="relative flex items-center gap-3">
                            {contactData.buttonText} <ArrowRight size={20} className="transform transition-transform group-hover:translate-x-1" />
                        </span>
                    </MagneticButton>
                    <div className="flex items-center gap-3 mt-8">
                        <div className="w-3 h-3 bg-green-500 animate-pulse"></div>
                        <p className="text-sm text-green-400 font-mono font-bold uppercase tracking-wider">{contactData.availability}</p>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}