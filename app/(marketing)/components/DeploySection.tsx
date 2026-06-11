'use client';

import { useState } from 'react';

export function DeploySection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('docker-compose up -d');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Get Started in Minutes
          </span>
        </h2>
        <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-12">
          Deploy your own SketchToArt instance with one click
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          {/* Vercel deploy button */}
          <a
            href="https://vercel.com/new/clone?repository-url=https://github.com/ycbing/sketch-to-art"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:scale-[1.02]"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 76 65"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">
                Deploy to Vercel
              </div>
              <div className="text-xs text-white/40">One-click deploy</div>
            </div>
          </a>

          {/* Docker option */}
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="#2496ED"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.186.186 0 00-.185-.186H5.136a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.686 11.686 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.228 12.228 0 003.823-1.389c.98-.567 1.86-1.282 2.61-2.114 1.252-1.391 1.998-2.939 2.553-4.3h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z" />
            </svg>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">
                Docker
              </div>
              <div className="text-xs text-white/40">Self-hosted</div>
            </div>
          </div>
        </div>

        {/* Terminal-style code block */}
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="ml-2 text-xs text-white/30 font-mono">
                terminal
              </span>
            </div>

            {/* Code content */}
            <div className="flex items-center justify-between px-4 py-3">
              <code className="text-sm text-white/70 font-mono">
                <span className="text-white/30">$</span>{' '}
                <span className="text-green-400/70">
                  docker-compose up -d
                </span>
              </code>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.06] transition-colors"
              >
                {copied ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xs text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5 text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-white/40">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
