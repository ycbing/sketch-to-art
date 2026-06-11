'use client';

const examples = [
  {
    id: 1,
    sketch: 'Simple cat',
    result: 'Watercolor painting',
    style: 'Watercolor',
    sketchBg: '#1a1a2e',
    resultBg: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  {
    id: 2,
    sketch: 'Stick figure',
    result: 'Oil painting knight',
    style: 'Oil Painting',
    sketchBg: '#1a1a2e',
    resultBg: 'linear-gradient(135deg, #f093fb, #f5576c)',
  },
  {
    id: 3,
    sketch: 'City skyline',
    result: 'Cyberpunk city',
    style: 'Cyberpunk',
    sketchBg: '#1a1a2e',
    resultBg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  },
  {
    id: 4,
    sketch: 'Simple flower',
    result: 'Chinese ink painting',
    style: 'Chinese Ink',
    sketchBg: '#1a1a2e',
    resultBg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  },
  {
    id: 5,
    sketch: 'Castle sketch',
    result: 'Pixel art',
    style: 'Pixel Art',
    sketchBg: '#1a1a2e',
    resultBg: 'linear-gradient(135deg, #fa709a, #fee140)',
  },
];

export function Showcase() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              从草图到杰作
            </span>
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto">
            See how AI transforms simple sketches into stunning artworks across
            different styles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Style tag */}
              <div className="mb-4 inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                {item.style}
              </div>

              {/* Sketch → Result */}
              <div className="flex items-center gap-3">
                {/* Sketch placeholder */}
                <div
                  className="flex-1 aspect-[4/3] rounded-xl flex items-center justify-center text-white/20 text-sm"
                  style={{ background: item.sketchBg }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">✏️</div>
                    <span className="text-[11px]">{item.sketch}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 text-white/20 group-hover:text-white/50 transition-colors">
                  <svg
                    className="w-5 h-5"
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
                </div>

                {/* Result placeholder */}
                <div
                  className="flex-1 aspect-[4/3] rounded-xl flex items-center justify-center text-white/40 text-sm"
                  style={{ background: item.resultBg }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎨</div>
                    <span className="text-[11px]">{item.result}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Extra card for even grid */}
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 flex items-center justify-center border-dashed hover:border-white/20 transition-colors">
            <div className="text-center text-white/30">
              <div className="text-3xl mb-2">+</div>
              <p className="text-sm">更多风格即将上线</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
