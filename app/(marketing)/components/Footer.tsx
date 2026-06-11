export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            SketchToArt © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4 text-sm text-white/30">
            <a
              href="https://github.com/ycbing/sketch-to-art"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              GitHub
            </a>
            <span className="text-white/10">|</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
