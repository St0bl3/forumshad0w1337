"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  CircuitBoard,
  Crosshair,
  Gamepad2,
  Globe2,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const navItems = ["Features", "Games", "Community", "FAQ"];

const features = [
  {
    icon: ShieldCheck,
    title: "Adaptive Combat Systems",
    text: "A polished gameplay network built around precision, competitive clarity and immersive HUD intelligence."
  },
  {
    icon: RadioTower,
    title: "Real-Time Operations",
    text: "Live events, seasonal operations and synchronized squads presented through cinematic control surfaces."
  },
  {
    icon: CircuitBoard,
    title: "Next-Gen Interface",
    text: "Glass layers, reactive borders, motion states and accessible contrast tuned for long sessions."
  },
  {
    icon: Globe2,
    title: "Global Arena Layer",
    text: "A connected universe of arenas, player identities, ranked events and premium social spaces."
  }
];

const games = [
  {
    title: "Neon Divide",
    genre: "Tactical extraction",
    copy: "A city-scale operation where squads cut through vertical combat zones, stealth corridors and high-risk vaults.",
    accent: "from-cyan/45 via-purple/20 to-transparent"
  },
  {
    title: "Zero Meridian",
    genre: "Arena warfare",
    copy: "Competitive maps built like broadcast stages: clean reads, explosive gadgets and instant spectator drama.",
    accent: "from-pink/45 via-purple/25 to-transparent"
  },
  {
    title: "Arc Protocol",
    genre: "Co-op frontier",
    copy: "A mysterious machine frontier with reactive missions, alliance contracts and procedural world incidents.",
    accent: "from-purple/45 via-cyan/20 to-transparent"
  }
];

const testimonials = [
  {
    quote: "It feels like a publisher reveal site, not a template. The pacing, lighting and interface language are absurdly premium.",
    name: "Mira Voss",
    role: "Creative Director"
  },
  {
    quote: "The page pulls you forward. Every section has motion, but nothing feels noisy or cheap.",
    name: "Kade Orion",
    role: "Esports Producer"
  },
  {
    quote: "The cards, glow and parallax sell a complete product universe. This is the kind of web presence players remember.",
    name: "Noah Vale",
    role: "Community Lead"
  }
];

const faqs = [
  {
    q: "Можно ли залить это на Vercel?",
    a: "Да. Это полноценное Next.js приложение. Достаточно импортировать репозиторий в Vercel, оставить стандартные настройки Next.js и нажать Deploy."
  },
  {
    q: "Тяжелые ли анимации?",
    a: "Основные эффекты сделаны через transform, opacity и легкую Three.js сцену. Это держит движение плавным и не перегружает интерфейс."
  },
  {
    q: "Можно подключить реальную игру или API?",
    a: "Да. Структура секций уже готова: витрина игр, статистика, события и community-блок легко подключаются к данным."
  }
];

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.035;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.045;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.024} color="#00F5FF" transparent opacity={0.68} sizeAttenuation />
    </points>
  );
}

function HeroScene() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.12;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.18;
  });

  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={3} color="#00F5FF" />
      <pointLight position={[-4, -2, 3]} intensity={2.2} color="#FF0088" />
      <ParticleField />
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.65, 1]} />
        <meshStandardMaterial color="#111827" emissive="#00F5FF" emissiveIntensity={0.28} metalness={0.72} roughness={0.18} wireframe />
      </mesh>
      <mesh rotation={[0.8, 0.1, 0.2]}>
        <torusGeometry args={[2.45, 0.012, 12, 160]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[1.45, 0.4, -0.2]}>
        <torusGeometry args={[2.95, 0.01, 12, 180]} />
        <meshBasicMaterial color="#FF0088" transparent opacity={0.5} />
      </mesh>
    </Canvas>
  );
}

function MagneticButton({
  children,
  href,
  variant = "primary"
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <a
      href={href}
      className={`magnetic group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-xl px-6 text-sm font-black uppercase tracking-[0.16em] ${
        variant === "primary"
          ? "bg-cyan text-void shadow-neon"
          : "border border-white/15 bg-white/[0.055] text-white backdrop-blur-xl"
      }`}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        event.currentTarget.style.setProperty("--mx", `${x * 0.08}px`);
        event.currentTarget.style.setProperty("--my", `${y * 0.08}px`);
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.setProperty("--mx", "0px");
        event.currentTarget.style.setProperty("--my", "0px");
      }}
    >
      <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
      <span className="relative flex items-center gap-2">
        {children}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </span>
    </a>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 24 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 24 });

  return (
    <motion.div
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        rotateX.set(y * -8);
        rotateY.set(x * 8);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      className={`glass cyber-border rounded-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto mb-12 max-w-3xl text-center"
    >
      <p className="mb-3 text-xs font-black uppercase tracking-[0.34em] text-cyan">{eyebrow}</p>
      <h2 className="font-display text-4xl font-black tracking-tight text-white md:text-6xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">{text}</p>
    </motion.div>
  );
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const node = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!node.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node.current,
        { innerText: 0 },
        {
          innerText: value,
          duration: 2,
          ease: "power3.out",
          snap: { innerText: 1 },
          scrollTrigger: undefined,
          onUpdate() {
            if (node.current) node.current.textContent = `${Math.round(Number(node.current.textContent || 0))}${suffix}`;
          }
        }
      );
    });
    return () => ctx.revert();
  }, [value, suffix]);

  return <span ref={node}>0{suffix}</span>;
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lightX = useTransform(mouseX, [0, 1], ["18%", "82%"]);
  const lightY = useTransform(mouseY, [0, 1], ["18%", "72%"]);
  const background = useMotionTemplate`radial-gradient(circle at ${lightX} ${lightY}, rgba(0,245,255,0.16), transparent 28%), radial-gradient(circle at 78% 12%, rgba(255,0,136,0.16), transparent 28%), linear-gradient(135deg, #050816 0%, #0A0F1F 52%, #101828 100%)`;

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX / window.innerWidth);
      mouseY.set(event.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    gsap.fromTo(".aaa-nav", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-void">
      <motion.div className="pointer-events-none fixed inset-0 z-0" style={{ background }} />
      <div className="noise" />
      <div className="scanline" />

      <header className="fixed left-0 right-0 top-0 z-40">
        <nav className="aaa-nav mx-auto mt-4 flex w-[min(1180px,calc(100%-24px))] items-center justify-between rounded-2xl border border-white/10 bg-[#050816]/55 px-4 py-3 opacity-0 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <a href="#" className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-cyan/40 bg-cyan/10 shadow-neon">
              <Sparkles className="h-5 w-5 text-cyan" />
              <span className="absolute inset-0 rounded-xl bg-cyan/20 blur-xl" />
            </span>
            <span className="font-display text-lg font-black tracking-tight">AETHER</span>
          </a>
          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-1 md:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="rounded-lg px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white">
                {item}
              </a>
            ))}
          </div>
          <a href="#games" className="rounded-xl border border-cyan/35 bg-cyan/10 px-4 py-2 text-sm font-black text-cyan transition hover:bg-cyan hover:text-void hover:shadow-neon">
            Enter Network
          </a>
        </nav>
      </header>

      <section className="relative z-10 min-h-screen overflow-hidden px-4 pb-20 pt-32 md:pt-40">
        <div className="grid-floor" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan/10 blur-[140px]" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.03fr_0.97fr]">
          <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan backdrop-blur-xl">
              <Activity className="h-4 w-4" />
              Future Combat Network
            </div>
            <h1 className="text-glow font-display text-6xl font-black leading-[0.88] tracking-tight md:text-8xl xl:text-[8.7rem]">
              <span className="gradient-text">AETHER</span>
              <br />
              GAMES
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-300 md:text-xl">
              Официальная платформа игровой вселенной 2035 года: кинематографичные арены, живое community, премиальные события и интерфейс, который ощущается как технологичный продукт будущего.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <MagneticButton href="#games">Explore Games</MagneticButton>
              <MagneticButton href="#features" variant="ghost">View Systems</MagneticButton>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.1 }} className="relative h-[520px] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/50 backdrop-blur-xl">
            <HeroScene />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent,rgba(5,8,22,0.42)_58%,rgba(5,8,22,0.92)_100%)]" />
            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
              {["Latency 04ms", "Players 2.4M", "Season IX"].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-black/25 p-3 text-center text-xs font-black uppercase tracking-[0.14em] text-slate-200 backdrop-blur-xl">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="relative z-10 px-4 py-24">
        <SectionHeader eyebrow="Core Systems" title="Designed like a premium game universe" text="Every interface layer has a job: clarity, depth, atmosphere and motion that supports the player instead of distracting them." />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: index * 0.08 }}>
                <TiltCard className="group h-full p-6">
                  <div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl border border-cyan/35 bg-cyan/10 text-cyan shadow-neon">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-black text-white">{feature.title}</h3>
                  <p className="mt-4 leading-7 text-slate-300">{feature.text}</p>
                  <div className="mt-8 h-px w-full bg-gradient-to-r from-cyan/70 via-purple/30 to-transparent" />
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            ["12", "live arenas"],
            ["2.4M", "registered players"],
            ["98", "global events"]
          ].map(([value, label], index) => (
            <motion.div key={label} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="glass rounded-3xl p-8 text-center">
              <strong className="font-display text-5xl font-black text-white md:text-7xl">{value}</strong>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.28em] text-cyan">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="games" className="relative z-10 px-4 py-24">
        <SectionHeader eyebrow="Games Showcase" title="Three worlds. One connected arena layer." text="Large-format cards built around depth, composition and cinematic hover states." />
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {games.map((game, index) => (
            <motion.article key={game.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.72, delay: index * 0.1 }}>
              <TiltCard className="group relative min-h-[520px] overflow-hidden p-7">
                <div className={`absolute inset-0 bg-gradient-to-br ${game.accent} opacity-70 transition duration-500 group-hover:opacity-100`} />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)] opacity-0 transition duration-500 group-hover:translate-x-16 group-hover:opacity-100" />
                <div className="relative flex h-full min-h-[460px] flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-flex rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-cyan">{game.genre}</div>
                    <h3 className="font-display text-4xl font-black leading-none text-white">{game.title}</h3>
                    <p className="mt-5 leading-8 text-slate-200">{game.copy}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <Crosshair className="mb-4 h-5 w-5 text-cyan" />
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-300">ranked</span>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <Zap className="mb-4 h-5 w-5 text-pink" />
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-300">live ops</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="community" className="relative z-10 px-4 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-[2rem] p-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.34em] text-cyan">Community</p>
            <h2 className="font-display text-4xl font-black leading-tight md:text-6xl">The network feels alive before you even join.</h2>
            <p className="mt-6 leading-8 text-slate-300">Events, achievements and online squads are presented like a command center, with enough clarity for scanning and enough atmosphere for emotion.</p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              [Users, "46,820", "players online"],
              [Trophy, "128", "active tournaments"],
              [Gamepad2, "09", "featured missions"],
              [Sparkles, "24h", "season pulse"]
            ].map(([Icon, value, label], index) => {
              const LucideIcon = Icon as typeof Users;
              return (
                <motion.div key={String(label)} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="glass rounded-3xl p-7">
                  <LucideIcon className="mb-8 h-7 w-7 text-cyan" />
                  <strong className="font-display text-4xl font-black text-white">{value as string}</strong>
                  <p className="mt-2 text-sm font-black uppercase tracking-[0.22em] text-slate-400">{label as string}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-24">
        <SectionHeader eyebrow="Signals" title="Trusted by creators, players and operators" text="The visual language is built to communicate scale, confidence and a high-end product identity." />
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.figure key={item.name} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="glass rounded-3xl p-7">
              <blockquote className="text-lg leading-8 text-slate-200">“{item.quote}”</blockquote>
              <figcaption className="mt-8 border-t border-white/10 pt-5">
                <strong className="block text-white">{item.name}</strong>
                <span className="text-sm text-cyan">{item.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <section id="faq" className="relative z-10 px-4 py-24">
        <SectionHeader eyebrow="FAQ" title="Clean, expandable and production-ready" text="The site is already structured for Vercel deployment and future product integrations." />
        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.q} className="glass overflow-hidden rounded-2xl">
              <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-6 text-left font-display text-xl font-black text-white">
                {faq.q}
                <ChevronDown className={`h-5 w-5 text-cyan transition ${openFaq === index ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                    <p className="px-6 pb-6 leading-8 text-slate-300">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <strong className="font-display text-2xl font-black text-white">AETHER GAMES</strong>
            <p className="mt-2 text-sm text-slate-400">Official future combat network interface concept.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-400">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-cyan">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
