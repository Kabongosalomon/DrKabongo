import Link from 'next/link'

interface YouTubeChannelCardProps {
  handle: string
  url: string
  label: string
  description: string
  accentColor: string
  subscribeLabel: string
}

export default function YouTubeChannelCard({
  handle,
  url,
  label,
  description,
  accentColor,
  subscribeLabel,
}: YouTubeChannelCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-hover block bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-colors"
    >
      {/* Channel icon */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
      >
        <svg
          className="w-6 h-6"
          style={{ color: accentColor }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>

      {/* Label badge */}
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full mb-2 inline-block"
        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
      >
        {label}
      </span>

      {/* Handle */}
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-light transition-colors">
        {handle}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed mb-4">{description}</p>

      {/* Subscribe CTA */}
      <div
        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all group-hover:opacity-100"
        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
        {subscribeLabel}
      </div>
    </a>
  )
}
