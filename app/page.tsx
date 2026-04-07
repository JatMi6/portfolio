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
                className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20 overflow-hidden"
            >
                {/* Background radial — top left indigo */}
                <div className="absolute top-[-15%] left-[-8%] w-[65vw] h-[65vw] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(79,70,229,0.18) 0%, rgba(99,102,241,0.06) 40%, transparent 65%)", filter: "blur(80px)" }} />
                {/* Emerald accent — bottom right */}
                <div className="absolute bottom-[-10%] right-[10%] w-[45vw] h-[45vw] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)", filter: "blur(100px)" }} />
                {/* Purple mid accent */}
                <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />

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
                    <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-indigo-900" />
                        <span className="text-xs uppercase tracking-[0.25em] font-medium text-indigo-400/80">
                            {heroData.subtitle}
                        </span>
                    </motion.div>

                    {/* Clean word-by-word reveal heading */}
                    <motion.div variants={fadeUp}>
                        <RevealHeading text={heroData.mainHeading} />
                    </motion.div>

                    <motion.p
                        variants={fadeUp}
                        className="text-lg md:text-2xl text-zinc-400 font-light max-w-2xl mb-12 leading-relaxed tracking-tight"
                    >
                        {heroData.description}
                    </motion.p>

                    {/* Magnetic CTA */}
                    <motion.div variants={fadeUp}>
                        <MagneticButton
                            href={heroData.cta.href}
                            className="group pointer-events-auto inline-flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-medium tracking-wide transition-all duration-300 hover:bg-indigo-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {heroData.cta.text}
                            <ArrowRight
                                size={18}
                                className="text-black transform transition-transform group-hover:translate-x-1"
                            />
                        </MagneticButton>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── ECOSYSTEM BAR ─────────────────────────────────────────────── */}
            <section className="border-y border-white/[0.02] bg-[#020510]/50 backdrop-blur-md">
                <div className="px-6 md:px-20 py-8 flex flex-wrap items-center justify-between gap-8">
                    <span className="text-xs uppercase tracking-widest font-semibold text-zinc-600 hidden md:block">Ecosystem</span>
                    {skillsData.map((tech, i) => {
                        const iconMap: Record<string, React.ReactNode> = {
                            Layout: <Layout size={18} />,
                            Code2: <Code2 size={18} />,
                            Zap: <Zap size={18} />,
                            Database: <Database size={18} />,
                            Terminal: <Terminal size={18} />,
                        };
                        return (
                            <div key={i} className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500 opacity-60 transition-opacity duration-300 hover:opacity-100 hover:text-indigo-400 cursor-default">
                                {iconMap[tech.icon]}
                                <span>{tech.name}</span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── ABOUT ─────────────────────────────────────────────────────── */}
            <section className="py-48 px-6 md:px-20 max-w-7xl mx-auto">
                <motion.div
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="flex flex-col md:flex-row justify-between items-start gap-16"
                >
                    <motion.div variants={fadeUp} className="flex flex-col gap-6 md:w-1/3">
                        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 w-fit px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all hover:bg-white/[0.04]">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            </span>
                            <span className="text-xs uppercase tracking-[0.15em] font-medium text-zinc-300">
                                {aboutData.availability.status} — {aboutData.availability.period}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="md:w-2/3">
                        <p className="text-3xl md:text-5xl leading-[1.3] tracking-tight text-zinc-200 font-light">
                            {aboutData.heading}{" "}
                            <span className="text-indigo-400/80 italic font-medium">{aboutData.headingItalic}</span>
                            <br /><br />
                            <span className="text-xl md:text-2xl text-zinc-500 leading-relaxed block">
                                {aboutData.description}
                            </span>
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── WORK ──────────────────────────────────────────────────────── */}
            <section id="work" className="py-48 px-6 md:px-20 bg-gradient-to-b from-transparent to-[#050b1a] border-t border-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <p className="text-xs uppercase tracking-widest font-semibold text-indigo-500/80 mb-6 flex items-center gap-4">
                                <span className="w-8 h-[1px] bg-indigo-900"></span>
                                04 selected projects
                            </p>
                            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
                                Work that earned <br /> its keep.
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {projectsData.map((project) => (
                            <a key={project.id} href={project.link} target="_blank" rel="noopener noreferrer" className="block group perspective-1000">
                                <motion.div
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={fadeUp}
                                    className="relative cursor-pointer block h-[550px] rounded-[2rem] overflow-hidden bg-[#030712] border border-white/5 transition-all duration-700 hover:border-indigo-500/30 hover:shadow-[0_0_40px_rgba(79,70,229,0.15)] group-hover:-translate-y-2"
                                >
                                    <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020510] via-[#020510]/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700 z-0" />
                                    <div className="absolute bottom-6 left-6 right-6 p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-4 py-1.5 rounded-full uppercase tracking-wider font-semibold">{project.tag}</span>
                                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out">
                                                <ArrowRight size={18} className="-rotate-45" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl text-zinc-100 mb-2 font-semibold tracking-tight">{project.title}</h3>
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                                                <p className="overflow-hidden text-zinc-400 text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{project.result}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PROCESS ───────────────────────────────────────────────────── */}
            <section className="py-48 px-6 md:px-20 max-w-7xl mx-auto overflow-hidden">
                <p className="text-xs uppercase tracking-widest font-semibold text-indigo-500/80 mb-6 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-indigo-900"></span>
                    Working together
                </p>
                <h2 className="text-5xl md:text-7xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tighter mb-32">
                    No surprises. <br /> No disappearing acts.
                </h2>
                <div className="relative">
                    <div className="hidden md:block absolute top-[30px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative z-10">
                        {processData.map((step, i) => (
                            <motion.div key={i} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="flex flex-col gap-8 group">
                                <div className="w-16 h-16 rounded-full bg-[#0a1128] border border-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400 transition-all duration-500 group-hover:border-indigo-400 group-hover:bg-indigo-500/10 group-hover:scale-110 shadow-[0_0_30px_rgba(79,70,229,0)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.15)]">{step.num}</div>
                                <div>
                                    <h4 className="text-2xl text-zinc-100 mb-3 font-semibold tracking-tight">{step.title}</h4>
                                    <p className="text-zinc-500 leading-relaxed pr-8">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ──────────────────────────────────────────────── */}
            <section className="py-48 px-6 md:px-20 bg-gradient-to-b from-[#050b1a] to-[#020510] border-y border-white/[0.02] relative overflow-hidden">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 relative z-10">
                    {testimonialsData.map((quote) => (
                        <motion.div key={quote.id} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="flex flex-col gap-10 bg-white/[0.01] p-10 md:p-14 rounded-[2rem] border border-white/5 transition-all hover:bg-white/[0.02] hover:border-white/10">
                            <Quote className="text-indigo-900" size={48} strokeWidth={2} />
                            <p className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed tracking-wide">"{quote.text}"</p>
                            <div className="flex items-center gap-5 mt-auto pt-6">
                                <div className="w-12 h-12 rounded-full bg-[#0a1128] flex items-center justify-center border border-indigo-500/20">
                                    <CheckCircle2 size={20} className="text-indigo-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm uppercase tracking-widest font-semibold text-zinc-200">{quote.author}</span>
                                    <span className="text-xs uppercase tracking-widest font-medium text-zinc-600 mt-1.5">{quote.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── CONTACT ───────────────────────────────────────────────────── */}
            <section className="py-48 px-6 md:px-20 text-center relative overflow-hidden">
                <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto flex flex-col items-center gap-10">
                    <h2 className="text-[clamp(3rem,8vw,8rem)] font-semibold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tighter leading-none">
                        {contactData.heading.split("\n").map((line, i) => (
                            <span key={i}>{line}{i !== contactData.heading.split("\n").length - 1 && <br />}</span>
                        ))}
                    </h2>
                    <p className="text-xl md:text-2xl text-zinc-400 font-light mb-6 max-w-2xl leading-relaxed">{contactData.description}</p>
                    <MagneticButton
                        href={`mailto:${siteConfig.email}`}
                        className="group relative overflow-hidden bg-white text-black px-12 py-6 rounded-full font-semibold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                        <span className="relative flex items-center gap-3">
                            {contactData.buttonText} <ArrowRight size={20} className="transform transition-transform group-hover:translate-x-1" />
                        </span>
                    </MagneticButton>
                    <div className="flex items-center gap-3 mt-8 opacity-80">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">{contactData.availability}</p>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}