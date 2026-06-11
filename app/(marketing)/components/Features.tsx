const features = [
  {
    icon: '🎨',
    title: '12 Art Styles',
    description:
      'Watercolor, oil painting, cyberpunk, Chinese ink, pixel art, and more — find the perfect style for your vision.',
  },
  {
    icon: '✏️',
    title: 'Free Canvas',
    description:
      "Draw freely with tldraw's professional drawing tools. Pens, shapes, erasers — everything you need.",
  },
  {
    icon: '🚀',
    title: 'Instant Generation',
    description:
      'Powered by AI, get results in seconds. No waiting, no rendering — just instant art.',
  },
  {
    icon: '📦',
    title: 'Batch Creation',
    description:
      'Generate multiple variations at once. Compare and pick the one that resonates most.',
  },
  {
    icon: '💾',
    title: 'Export & Share',
    description:
      'Download your artwork in high resolution or share it directly with the world.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description:
      'Your sketches never leave your browser. Create with confidence and peace of mind.',
  },
];

export function Features() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              SketchToArt
            </span>
            ?
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto">
            Everything you need to transform your ideas into visual art
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
