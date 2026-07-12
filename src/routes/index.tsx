import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";

import heroInline from "@/assets/hero-inline.jpg";
import manifestoImg from "@/assets/manifesto.jpg";
import barber1 from "@/assets/barber-1.jpg";
import barber2 from "@/assets/barber-2.jpg";
import barber3 from "@/assets/barber-3.jpg";
import barber4 from "@/assets/barber-4.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import shopfront from "@/assets/shopfront.jpg";

export const Route = createFileRoute("/")({
  component: Klinga,
  head: () => ({
    meta: [
      { property: "og:image", content: shopfront },
      { name: "twitter:image", content: shopfront },
    ],
  }),
});

const BRAND = "KLINGA";
const YEAR = "2014";

const services = [
  { i: "01", name: "Klippning", note: "Formad efter dig, inte efter en mall.", price: "495 kr", img: gallery3 },
  { i: "02", name: "Skägg", note: "Linjer som håller till nästa besök.", price: "345 kr", img: gallery2 },
  { i: "03", name: "Klippning + skägg", note: "Hela intrycket, i ett.", price: "745 kr", img: gallery4 },
  { i: "04", name: "Traditionell rakning", note: "Varm handduk. Rakkniv. Tyst.", price: "445 kr", img: gallery5 },
];

const barbers = [
  { name: "Alvar Nyström", spec: "Fades & korta frisyrer", img: barber1, span: 5, mt: 0 },
  { name: "Petter Lund", spec: "Skägg & rakning", img: barber2, span: 4, mt: 12 },
  { name: "Ingrid Sahl", spec: "Klassiska klippningar", img: barber3, span: 3, mt: 6 },
  { name: "Gustav Ek", spec: "Långt hår & textur", img: barber4, span: 4, mt: 20 },
];

const gallery = [gallery1, gallery2, gallery3, gallery4, gallery5, shopfront];

function Klinga() {
  const [loaded, setLoaded] = useState(false);
  const scope = useRef<HTMLDivElement>(null);

  // Lenis + ScrollTrigger + prefers-reduced-motion
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let raf = 0;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => {
        lenis!.raf(time * 1000);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      gsap.ticker.lagSmoothing(0);
    }
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);

  // Preloader
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = document.getElementById("preloader");
    const mark = document.getElementById("preloader-mark");
    if (!el) return;
    if (reduce) {
      el.style.display = "none";
      setLoaded(true);
      return;
    }
    const tl = gsap.timeline({ onComplete: () => setLoaded(true) });
    tl.set(mark, { clipPath: "inset(0 100% 0 0)" })
      .to(mark, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out" }, 0.1)
      .to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.25")
      .set(el, { display: "none" });
  }, []);

  // Entrance + scroll animations
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroDelay = reduce ? 0 : 1.4;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
          gsap.set(el, { opacity: 1 });
        });
        gsap.set(".mask-line > *", { y: 0 });
        gsap.set(".clip-reveal", { clipPath: "inset(0)" });
        return;
      }

      // Ensure mask children start below and reveal from there
      gsap.set(".mask-line > *", { yPercent: 110 });

      // Hero headline lines
      gsap.to(".hero-line > *", {
        yPercent: 0,
        duration: 0.95,
        ease: "power4.out",
        stagger: 0.09,
        delay: heroDelay,
      });
      // Hero inline image
      gsap.fromTo(
        ".hero-inline",
        { width: 0 },
        { width: "var(--inline-w, 8.5em)", duration: 1.1, ease: "power3.inOut", delay: 0.5 },
      );
      gsap.fromTo(
        ".hero-inline img",
        { scale: 1.25 },
        { scale: 1, duration: 1.4, ease: "power3.out", delay: 0.5 },
      );
      gsap.fromTo(".hero-meta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, delay: 1.1, ease: "power3.out" });
      gsap.fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.9, ease: "power3.out" });

      // Generic mask line reveals on scroll (skip hero which is already animating)
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((container) => {
        const lines = container.querySelectorAll<HTMLElement>(".mask-line > *");
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.95,
            ease: "power4.out",
            stagger: 0.08,
            scrollTrigger: { trigger: container, start: "top 82%" },
          },
        );
      });

      // Clip reveals for images
      gsap.utils.toArray<HTMLElement>(".clip-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.15,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
        const img = el.querySelector("img");
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.18 },
            {
              scale: 1,
              duration: 1.4,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%" },
            },
          );
        }
      });

      // Manifesto: word-by-word opacity scrub
      const manifesto = document.getElementById("manifesto-text");
      if (manifesto) {
        const split = new SplitType(manifesto, { types: "words" });
        gsap.set(split.words, { opacity: 0.15 });
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.03,
          ease: "none",
          scrollTrigger: {
            trigger: manifesto,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.8,
          },
        });
      }

      // Manifesto parallax portrait
      const mp = document.getElementById("manifesto-portrait");
      if (mp) {
        gsap.to(mp, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: mp.parentElement!, start: "top bottom", end: "bottom top", scrub: 0.5 },
        });
      }

      // Nav backdrop
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        toggleClass: { className: "nav-scrolled", targets: "#nav" },
      });

      // Gallery horizontal scrub (desktop only)
      if (window.matchMedia("(min-width: 900px)").matches) {
        const track = document.getElementById("gallery-track");
        const pin = document.getElementById("gallery-pin");
        if (track && pin) {
          const distance = () => track.scrollWidth - window.innerWidth + 200;
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          gsap.to("#gallery-word", {
            xPercent: -30,
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: true,
            },
          });
        }
      }

      // Sticky mobile CTA
      const stickyBar = document.getElementById("sticky-cta");
      if (stickyBar) {
        gsap.set(stickyBar, { yPercent: 120, opacity: 0 });
        ScrollTrigger.create({
          start: "40% top",
          end: 99999,
          onEnter: () => gsap.to(stickyBar, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" }),
          onLeaveBack: () => gsap.to(stickyBar, { yPercent: 120, opacity: 0, duration: 0.4, ease: "power3.in" }),
        });
      }
    }, scope);

    // Refresh after fonts load
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [loaded]);

  // Service row cursor-follow image
  const cursorImgRef = useRef<HTMLDivElement>(null);
  const cursorImgSrc = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!loaded) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !window.matchMedia("(hover: hover)").matches) return;
    const el = cursorImgRef.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [loaded]);

  const showCursorImg = (src: string) => {
    if (!cursorImgRef.current || !cursorImgSrc.current) return;
    cursorImgSrc.current.src = src;
    gsap.to(cursorImgRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
  };
  const hideCursorImg = () => {
    if (!cursorImgRef.current) return;
    gsap.to(cursorImgRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power3.in" });
  };

  return (
    <div ref={scope} className="relative min-h-screen bg-[var(--ink)] text-[var(--bone)] overflow-x-clip">
      {/* Grain */}
      <svg className="grain" aria-hidden>
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.88  0 0 0 0 0.82  0 0 0 1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>

      {/* Preloader */}
      <div id="preloader" className="preloader">
        <div id="preloader-mark" className="t-h1" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>
          {BRAND}
        </div>
      </div>

      {/* Cursor-follow floating image */}
      <div
        ref={cursorImgRef}
        className="pointer-events-none fixed left-0 top-0 z-40 -translate-x-1/2 -translate-y-1/2 opacity-0 hidden md:block"
        style={{ width: "18rem", height: "12rem" }}
      >
        <img
          ref={cursorImgSrc}
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: "grayscale(0.2) contrast(1.05)" }}
        />
      </div>

      {/* NAV */}
      <nav
        id="nav"
        className="fixed inset-x-0 top-0 z-30 transition-colors duration-300 [&.nav-scrolled]:backdrop-blur-md [&.nav-scrolled]:bg-[color-mix(in_srgb,var(--ink)_78%,transparent)]"
      >
        <div className="mx-auto flex max-w-[110rem] items-center justify-between px-[clamp(1rem,4vw,3rem)] py-5">
          <a href="#top" className="font-[var(--font-display)] text-[1.125rem] tracking-tight" style={{ fontVariationSettings: '"opsz" 144' }}>
            {BRAND}
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#tjanster" className="t-mono link-brass">Tjänster</a>
            <a href="#boka" className="t-mono link-brass">Boka</a>
            <a href="#boka" className="pill-outline">Boka tid</a>
          </div>
          <a href="#boka" className="pill-outline md:hidden!">Boka</a>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="relative min-h-[100svh] flex flex-col justify-between px-[clamp(1rem,4vw,3rem)] pt-[clamp(6rem,14vh,10rem)] pb-8">
        <div className="max-w-[95rem]">
          <h1 className="t-display" aria-label="Frisyren som är din. Ingen annans.">
            <span className="hero-line mask-line"><span>FRISYREN</span></span>
            <span className="hero-line mask-line">
              <span>
                SOM ÄR{" "}
                <span
                  className="hero-inline inline-block align-middle overflow-hidden rounded-[2px] mx-[0.15em]"
                  style={{
                    height: "0.82em",
                    verticalAlign: "-0.05em",
                    ["--inline-w" as string]: "clamp(4rem, 11vw, 9rem)",
                    width: 0,
                  }}
                  aria-hidden
                >
                  <img
                    src={heroInline}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ minWidth: "clamp(4rem, 11vw, 9rem)" }}
                  />
                </span>{" "}
                DIN.
              </span>
            </span>
            <span className="hero-line mask-line"><span>INGEN ANNANS.</span></span>
          </h1>
          <p className="hero-sub t-body-lg mt-8 max-w-[36rem]">
            Skräddarsydd klippning. Du ser skarp ut. Du känner det innan du hunnit ut genom dörren.
          </p>
        </div>

        <div>
          <div className="h-px w-full" style={{ background: "var(--brass)", opacity: 0.65 }} />
          <div className="hero-meta mt-4 flex items-center justify-between t-mono text-[var(--bone-dim)]">
            <span>Stockholm — Sedan {YEAR}</span>
            <span>Tis–Lör 10–19</span>
          </div>
        </div>
      </header>

      {/* MANIFESTO — bone inverted section */}
      <section
        className="on-bone relative"
        style={{ background: "var(--bone)", paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
      >
        <div className="mx-auto max-w-[110rem] px-[clamp(1rem,4vw,3rem)] grid grid-cols-12 gap-6 items-start relative">
          <div className="col-span-12 md:col-span-8">
            <div data-reveal>
              <span className="t-eyebrow mask-line"><span>Vårt enda löfte</span></span>
            </div>
            <p id="manifesto-text" className="t-h2 mt-8 max-w-[36ch]">
              En bra klippning bestäms innan saxen rör ditt hår. Vi läser växtriktning, huvudform och hur du faktiskt stylar det en tisdagsmorgon. Sen klipper vi för det.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:-mr-[6vw] mt-8 md:mt-16">
            <div id="manifesto-portrait" className="clip-reveal overflow-hidden">
              <img
                src={manifestoImg}
                alt="Barberare läser kundens hår före klippning"
                loading="lazy"
                width={800}
                height={1000}
                className="w-full h-auto"
                style={{ filter: "grayscale(1) contrast(1.05)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="tjanster" className="px-[clamp(1rem,4vw,3rem)]" style={{ paddingTop: "var(--space-7)", paddingBottom: "var(--space-7)" }}>
        <div className="mx-auto max-w-[110rem]">
          <div data-reveal className="mb-16 md:mb-24 grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-4">
              <span className="t-eyebrow mask-line"><span>Tjänster</span></span>
            </div>
            <h2 className="col-span-12 md:col-span-8 t-h2">
              <span className="mask-line"><span>Fyra saker. Alla gjorda ordentligt.</span></span>
            </h2>
          </div>

          <ul className="border-t border-[var(--hairline)]">
            {services.map((s) => (
              <li
                key={s.i}
                className="svc-row border-b border-[var(--hairline)]"
                onMouseEnter={() => showCursorImg(s.img)}
                onMouseLeave={hideCursorImg}
              >
                <div className="grid grid-cols-12 items-baseline gap-4 py-8 md:py-10">
                  <span className="svc-index t-mono col-span-2 md:col-span-1 text-[var(--bone-dim)]">{s.i}</span>
                  <div className="svc-shift col-span-10 md:col-span-6">
                    <h3 className="t-h3">{s.name}</h3>
                    <p className="t-caption mt-2">{s.note}</p>
                  </div>
                  <span className="hidden md:block col-span-2 t-mono text-[var(--bone-dim)]">Ca 45 min</span>
                  <span className="col-span-12 md:col-span-3 t-mono text-right text-[var(--bone)]" style={{ fontSize: "0.9rem" }}>
                    {s.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BARBERS */}
      <section className="px-[clamp(1rem,4vw,3rem)]" style={{ paddingTop: "var(--space-7)", paddingBottom: "var(--space-7)" }}>
        <div className="mx-auto max-w-[110rem]">
          <div data-reveal className="mb-16 md:mb-24 grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-4">
              <span className="t-eyebrow mask-line"><span>Barberarna</span></span>
            </div>
            <h2 className="col-span-12 md:col-span-8 t-h2">
              <span className="mask-line"><span>Fyra stolar.</span></span>
              <span className="mask-line"><span>Fyra sätt att läsa ett huvud.</span></span>
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-8">
            {barbers.map((b, i) => (
              <figure
                key={b.name}
                className={`col-span-6 md:col-span-${b.span} group`}
                style={{ marginTop: `${b.mt * 0.25}rem` }}
              >
                <div className="clip-reveal overflow-hidden">
                  <img
                    src={b.img}
                    alt={b.name}
                    loading="lazy"
                    className="w-full h-auto transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    style={{ filter: "grayscale(0.85) contrast(1.05)", clipPath: "inset(0)" }}
                  />
                </div>
                <figcaption className="mt-5 flex items-baseline justify-between gap-4">
                  <span className="t-h4">{b.name}</span>
                  <span className="t-mono text-[var(--bone-dim)] text-right">{b.spec}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — pinned horizontal on desktop, swipe on mobile */}
      <section aria-label="Hantverk" className="relative">
        {/* Desktop pinned */}
        <div id="gallery-pin" className="hidden md:block relative h-[100svh] overflow-hidden">
          <div
            id="gallery-word"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-nowrap"
            style={{ opacity: 0.06 }}
            aria-hidden
          >
            <span className="t-display" style={{ fontSize: "38vw", lineHeight: 1 }}>HANTVERK · HANTVERK</span>
          </div>
          <div id="gallery-track" className="absolute inset-y-0 left-0 flex items-center gap-8 pl-[8vw] pr-[8vw] will-change-transform">
            {gallery.map((src, i) => {
              const heights = ["58vh", "72vh", "48vh", "66vh", "54vh", "70vh"];
              const offsets = [0, -40, 30, -20, 10, -30];
              return (
                <div
                  key={i}
                  className="relative shrink-0 overflow-hidden"
                  style={{
                    height: heights[i % heights.length],
                    aspectRatio: i % 2 === 0 ? "4 / 5" : "16 / 10",
                    transform: `translateY(${offsets[i % offsets.length]}px)`,
                  }}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ filter: "grayscale(0.3) contrast(1.05)" }} />
                </div>
              );
            })}
            <div className="shrink-0 w-[10vw]" />
          </div>
        </div>

        {/* Mobile swipe */}
        <div className="md:hidden py-[var(--space-6)]">
          <div className="px-[clamp(1rem,4vw,3rem)] mb-6">
            <span className="t-eyebrow">Hantverk</span>
          </div>
          <div className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory px-[clamp(1rem,4vw,3rem)]">
            {gallery.map((src, i) => (
              <div key={i} className="snap-center shrink-0 w-[78vw] h-[70vh] overflow-hidden">
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ filter: "grayscale(0.3) contrast(1.05)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section
        className="px-[clamp(1rem,4vw,3rem)]"
        style={{ background: "var(--ink-soft)", paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
      >
        <div className="mx-auto max-w-[80rem]">
          <div data-reveal>
            <span className="t-eyebrow mask-line"><span>Google · 4,9 av 383 recensioner</span></span>
          </div>
          <blockquote data-reveal className="mt-10">
            <p className="t-h3 max-w-[42ch]">
              <span className="mask-line"><span>„Första stället som frågade hur jag stylar</span></span>
              <span className="mask-line"><span>håret på morgonen innan de klippte.</span></span>
              <span className="mask-line"><span>Det märks varje dag efteråt."</span></span>
            </p>
            <footer className="mt-8 t-mono text-[var(--bone-dim)]">— Erik L.</footer>
          </blockquote>
        </div>
      </section>

      {/* BOOKING + LOCATION */}
      <section id="boka" className="px-[clamp(1rem,4vw,3rem)]" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-7)" }}>
        <div className="mx-auto max-w-[110rem] grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-7">
            <div data-reveal>
              <span className="t-eyebrow mask-line"><span>Boka</span></span>
            </div>
            <h2 data-reveal className="t-h1 mt-8">
              <span className="mask-line"><span>Stolen står</span></span>
              <span className="mask-line"><span>redo.</span></span>
            </h2>
            <p className="t-body-lg mt-8 max-w-[34rem]">
              Boka online. Kom som du är, gå därifrån som din bästa version.
            </p>
            <div className="mt-10">
              <a href="#" className="pill-solid">Boka tid</a>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 md:-ml-[6vw] mt-10 md:mt-0">
            <div className="clip-reveal overflow-hidden">
              <img
                src={shopfront}
                alt="Klingas skyltfönster i Stockholm"
                loading="lazy"
                width={1200}
                height={1400}
                className="w-full h-auto"
                style={{ filter: "grayscale(0.15) contrast(1.05)" }}
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[110rem] mt-24 md:mt-32 grid grid-cols-12 gap-0 border-t border-[var(--hairline)]">
          {[
            { l: "Adress", v: "Roslagsgatan 21\n113 55 Stockholm" },
            { l: "Öppettider", v: "Tis–Fre 10–19\nLör 10–17" },
            { l: "Telefon", v: "08 — 121 41 21" },
          ].map((c) => (
            <div key={c.l} className="col-span-12 md:col-span-4 border-b md:border-b-0 md:border-r last:border-r-0 border-[var(--hairline)] py-8 md:py-10 md:pr-8 md:pl-8 first:md:pl-0">
              <div className="t-mono text-[var(--bone-dim)]">{c.l}</div>
              <div className="mt-4 t-h5 whitespace-pre-line" style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
                {c.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden">
        <div className="px-[clamp(1rem,4vw,3rem)] pt-[var(--space-6)]">
          <div className="mx-auto max-w-[110rem] flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-[var(--hairline)]">
            <div className="flex gap-8">
              <a href="#tjanster" className="t-mono link-brass">Tjänster</a>
              <a href="#boka" className="t-mono link-brass">Boka</a>
              <a href="mailto:hej@klinga.se" className="t-mono link-brass">Kontakt</a>
              <a href="#" className="t-mono link-brass">Instagram</a>
            </div>
            <div className="t-mono text-[var(--bone-dim)]">© {BRAND} · {YEAR}–{new Date().getFullYear()}</div>
          </div>
        </div>
        <div
          aria-hidden
          className="relative overflow-hidden"
          style={{ height: "clamp(8rem, 22vw, 22rem)" }}
        >
          <div
            className="absolute left-0 right-0 t-display leading-none text-center"
            style={{
              fontSize: "clamp(8rem, 28vw, 26rem)",
              bottom: "-0.22em",
              letterSpacing: "-0.03em",
              color: "var(--bone)",
            }}
          >
            {BRAND}
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div id="sticky-cta" className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
        <a href="#boka" className="pill-solid w-full">Boka tid</a>
      </div>
    </div>
  );
}
