import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import CircuitBackground from '../components/CircuitBackground'
import RevealOnScroll from '../components/RevealOnScroll'
import AnimatedCounter from '../components/AnimatedCounter'

export default function Home() {
  const [counts, setCounts] = useState({ members: 0, projects: 0, roles: 10 })
  const [debugError, setDebugError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('members').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
    ]).then(([m, p]) => {
      if (m.error) console.error('members count error:', m.error)
      if (p.error) console.error('projects count error:', p.error)
      const errs = [m.error?.message, p.error?.message].filter(Boolean)
      if (errs.length) setDebugError(errs.join(' | '))
      setCounts({ members: m.count ?? 0, projects: p.count ?? 0, roles: 10 })
    })
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 py-16 sm:py-24 bg-navy rounded-b-3xl overflow-hidden blueprint-frame">
        <CircuitBackground />
        <div className="relative max-w-2xl mx-auto md:mx-0 md:ml-8">
          <p className="text-brand-green font-mono text-sm tracking-widest uppercase mb-3">
            <span className="text-white/30">$</span> location --coords 6.5833N,3.9333E
            <span className="animate-blink">_</span>
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white leading-tight max-w-xl">
            A community that builds engineers who think deeply.
          </h1>
          <p className="text-white/60 mt-5 leading-relaxed max-w-lg">
            We're not here to talk about building. We build — consistently, even when it's small, even when it's
            messy. Systems thinking, hands-on projects, and the discipline to ship.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link
              to="/apply"
              className="bg-brand-orange text-navy font-mono font-semibold text-sm px-5 py-3 rounded hover:bg-white transition-colors"
            >
              &gt; apply_to_join()
            </Link>
            <Link
              to="/projects"
              className="text-white font-mono text-sm px-5 py-3 rounded border border-white/20 hover:border-brand-orange transition-colors"
            >
              view --projects
            </Link>
          </div>
        </div>
      </section>

      {debugError && (
        <p className="text-red-600 text-xs font-mono mt-3 break-words">stats_error: {debugError}</p>
      )}

      {/* Live stats — labeled like instrument readouts */}
      <section className="grid grid-cols-3 gap-px bg-slate-200 -mt-8 relative z-10 max-w-lg mx-auto border border-slate-200 rounded-lg overflow-hidden">
        {[
          { label: 'ACTIVE_MEMBERS', value: counts.members },
          { label: 'PROJECTS_SHIPPED', value: counts.projects },
          { label: 'LEADERSHIP_ROLES', value: counts.roles },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 text-center">
            <p className="font-display text-2xl md:text-3xl text-navy">
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="text-[9px] text-slate-400 mt-1 leading-tight font-mono tracking-wide">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Quick links */}
      <section className="grid sm:grid-cols-3 gap-5 mt-16">
        {[
          { to: '/roles', title: '01 · Roles', desc: 'Who leads what, and why each role exists.', delay: 0 },
          { to: '/members', title: '02 · Members', desc: 'The people building with us.', delay: 100 },
          { to: '/projects', title: '03 · Projects', desc: "What we've actually shipped.", delay: 200 },
        ].map((item) => (
          <RevealOnScroll key={item.to} delay={item.delay}>
            <Link to={item.to} className="lift-card block border border-slate-200 rounded-lg p-6 h-full">
              <p className="text-brand-orange font-mono text-xs tracking-widest mb-2">{item.title}</p>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </Link>
          </RevealOnScroll>
        ))}
      </section>
    </div>
  )
}
