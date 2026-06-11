import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1033] via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl animate-pulse" />
        <div className="absolute top-32 right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/10 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-20 left-[5%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-purple-600/15 to-pink-500/10 blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-48 md:pb-36">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8">
            <span className="animate-pulse">✨</span>
            AI-Powered Art Generation
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Transform Your Sketches
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              into Stunning Art
            </span>
            <br />
            with AI
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Draw a simple sketch on the canvas, choose an art style, and let AI
            turn it into a masterpiece. No design skills needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="group relative inline-flex items-center gap-2 px-8 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]"
            >
              Try It Now
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <a
              href="https://github.com/ycbing/sketch-to-art"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 h-12 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium text-base hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <span>⭐</span>
              Star on GitHub
            </a>
          </div>

          <p className="text-xs text-white/30 mt-6">
            Free to use · Open Source · No account required
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
