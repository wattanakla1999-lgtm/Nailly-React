import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Sun,
  Moon,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Terminal,
  Cpu,
  Package,
} from "lucide-react"
import reactLogo from "./assets/react.svg"
import viteLogo from "./assets/vite.svg"

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

function App() {
  const [count, setCount] = useState(0)
  const [isDark, setIsDark] = useState(false)

  // Sync dark mode class with HTML tag
  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300 font-sans">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-violet-500 animate-pulse" />
            <span className="bg-gradient-to-r bg-clip-text text-transparent from-neutral-900 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400 font-bold tracking-tight">
              Nailly Project
            </span>
          </div>

          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="rounded-full w-9 h-9"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 transition-all" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-neutral-700 transition-all" />
              )}
            </Button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <GithubIcon className="h-4 w-4" />
                GitHub
              </Button>
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <div className="flex justify-center gap-6 mb-4 items-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-75 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <img
                src={viteLogo}
                className="relative h-16 w-16 md:h-20 md:w-20 transition-transform duration-500 hover:rotate-12 cursor-pointer"
                alt="Vite logo"
              />
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <img
                src={reactLogo}
                className="relative h-16 w-16 md:h-20 md:w-20 animate-[spin_10s_linear_infinite] cursor-pointer"
                alt="React logo"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            React + TypeScript +{" "}
            <span className="bg-gradient-to-r bg-clip-text text-transparent from-sky-400 to-indigo-500">
              Vite
            </span>{" "}
            +{" "}
            <span className="bg-gradient-to-r bg-clip-text text-transparent from-teal-400 to-emerald-500">
              Tailwind
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
            โปรเจ็คเริ่มต้นของคุณได้รับการติดตั้งอย่างสมบูรณ์แบบด้วย{" "}
            <strong className="font-semibold text-neutral-900 dark:text-white">
              shadcn/ui
            </strong>{" "}
            และได้รับการปรับแต่งด้วยสไตล์สุดพรีเมียม
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 dark:shadow-none transition-all hover:scale-[1.02]"
              onClick={() => setCount((c) => c + 1)}
            >
              คลิกนับเลข: {count}
            </Button>
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2">
                เอกสารประกอบการใช้งาน <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 p-6 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Vite + React 19</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              สปีดการรันเซิร์ฟเวอร์และ HMR (Hot Module Replacement)
              ที่รวดเร็วที่สุดด้วยพลังของ Bundler ยุคใหม่และ React เวอร์ชันล่าสุด
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 p-6 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tailwind CSS v4</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              ดีไซน์สวยงามและรวดเร็วด้วยยูทิลิตี้คลาสแบบ CSS-first
              โดยไม่มีไฟล์คอมไพล์ส่วนเกิน คล่องตัวในทุกการปรับแต่งหน้าจอ
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 p-6 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-4">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">shadcn/ui</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              ชุดคอมโพเนนท์ระดับพรีเมียมที่ถูกคัดสรรมาให้คุณสามารถก็อปปี้และปรับแต่งโค้ดได้เองอย่างสมบูรณ์แบบ
              โดยรันบน Radix UI และ Base UI
            </p>
          </div>
        </section>

        {/* Showcasing components */}
        <section className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="h-6 w-6 text-indigo-500" />
            <div>
              <h2 className="text-2xl font-bold">shadcn/ui Component Preview</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                ทดสอบคอมโพเนนท์ปุ่มและสไตล์ต่าง ๆ ที่ติดตั้งไว้ในโปรเจ็ค
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wider">
                Button Variants
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link Style</Button>
              </div>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6">
              <h4 className="text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wider">
                Button Sizes
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small (xs)</Button>
                <Button size="sm">Small (sm)</Button>
                <Button size="default">Default Size</Button>
                <Button size="lg">Large (lg)</Button>
              </div>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl">
              <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400 leading-none">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white mb-1">
                    การติดตั้งระบบเส้นทางนำเข้าถูกต้องทั้งหมด
                  </p>
                  <p className="text-xs">
                    โค้ดทุกส่วนได้รับการตั้งค่า TypeScript path aliases และ
                    Tailwind v4 theme variables อย่างราบรื่น
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 py-8 transition-colors">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Nailly Front-End. Built with ❤️ and AI.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
