"use client"
import { useEffect, useMemo, useState } from "react"
import { languages, type Language } from "@/lib/languages"

export default function Page() {
  // Order as provided
  const options = useMemo(() => languages, [])
  const [selected, setSelected] = useState<Language>(options[0])

  // Optional: remember selection for a better UX (no server involved)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("fogo-lang")
      if (saved) {
        const found = options.find((l) => l.slug === saved)
        if (found) setSelected(found)
      }
    } catch {}
  }, [options])

  useEffect(() => {
    try {
      window.localStorage.setItem("fogo-lang", selected.slug)
    } catch {}
  }, [selected])

  return (
    <main
      className="min-h-dvh grid place-items-start text-white"
      style={{
        background: "radial-gradient(1200px 800px at 80% 10%, #122034 0%, transparent 60%), #0a0f1a",
      }}
    >
      <section className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14 text-center">
        {/* Logo */}
        <div className="mb-6">
          <img src="/images/fogo-logo-white.png" alt="Fogo Chain Logo" className="h-16 sm:h-20 w-auto mx-auto" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">FogoChain Whitepaper</h1>
        <p className="mt-3 text-base text-[#91a4b7]">View the whitepaper in your preferred language.</p>

        {/* Language selector */}
        <div className="mt-6 rounded-2xl border border-[#1b2435] bg-[#0a0f1a] p-4 sm:p-5 shadow-[0_10px_22px_rgba(0,0,0,0.25)]">
          <div className="text-left">
            <label htmlFor="language" className="block text-sm font-medium text-[#c9d6e3]">
              Language
            </label>
          </div>

          <div className="relative mt-2">
            <select
              id="language"
              name="language"
              value={selected.slug}
              onChange={(e) => {
                const found = options.find((l) => l.slug === e.target.value)
                if (found) setSelected(found)
              }}
              className="w-full appearance-none rounded-xl border border-[#2a3441] bg-[#0a0f1a] px-3 py-3 pr-9 text-base text-white outline-none transition hover:border-[#ff6a00] focus:border-[#ff6a00] focus:ring-4 focus:ring-[rgba(255,106,0,0.15)] focus:bg-[#0f1522]"
              aria-label="Select whitepaper language"
            >
              {options.map((lang) => (
                <option key={lang.slug} value={lang.slug} className="bg-[#0a0f1a] text-white">
                  {lang.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-[#ff6a00]"
            >
              {"▾"}
            </span>
          </div>
        </div>

        {/* Static view-only content */}
        <article
          className="mt-8 rounded-2xl border border-[#1b2435] bg-[#0b1220] p-5 sm:p-6 text-left"
          dir={selected.dir ?? "ltr"}
        >
          <header className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{selected.heading}</h2>
            {selected.subheading ? <p className="mt-1 text-sm text-[#8fa2b6]">{selected.subheading}</p> : null}
          </header>

          {/* Format content with proper paragraph spacing */}
          <div className="prose prose-invert max-w-none">
            <div className="text-[#e6edf3] text-[15px] sm:text-base leading-relaxed space-y-4">
              {selected.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        </article>

        <p className="mt-6 text-xs text-[#7f93a8]">
          Designed & Developed by{" "}
          <a
            href="https://x.com/Oreganoflakess"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#a1b8d1]"
          >
            0regan0flakes
          </a>
          .
        </p>
      </section>
    </main>
  )
}
