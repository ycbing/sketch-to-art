const steps = [
  {
    step: 1,
    icon: '✏️',
    title: '绘制草图',
    description: '在画布上自由创作，简单或复杂——任何草图都可以。',
  },
  {
    step: 2,
    icon: '🎨',
    title: '选择风格',
    description: '从 12 种精心设计的艺术风格中选择，匹配你的创意灵感。',
  },
  {
    step: 3,
    icon: '✨',
    title: 'AI 魔法',
    description: '点击生成，看着你的草图变成精美艺术品。',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              使用方法
            </span>
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto">
            只需三步，从灵感到艺术品
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {steps.map((item, i) => (
            <div key={item.step} className="relative text-center">
              {/* Connector line (between steps) */}
              {i < 2 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-white/10" />
              )}

              {/* Step number circle */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] mb-6 group-hover:scale-105 transition-transform duration-300">
                <span className="text-3xl">{item.icon}</span>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/25">
                  {item.step}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-[260px] mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
