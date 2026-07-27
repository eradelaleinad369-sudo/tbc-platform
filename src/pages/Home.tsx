import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="text-center py-10">
        <img src="/logo.jpg" alt="The Builders Circle" className="h-24 w-24 rounded-full object-cover mx-auto mb-6" />
        <p className="text-brand-green font-semibold text-sm tracking-wide uppercase mb-3">LASU Epe Campus</p>
        <h1 className="font-display text-3xl md:text-5xl text-navy leading-tight max-w-2xl mx-auto">
          A community that builds engineers who think deeply.
        </h1>
        <p className="text-slate-500 mt-5 max-w-xl mx-auto leading-relaxed">
          We're not here to talk about building. We build — consistently, even when it's small, even when it's messy.
          The Builders Circle exists to create engineers who solve meaningful problems and create opportunities for one another.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to="/apply" className="bg-navy text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-orange transition-colors">
            Apply to join
          </Link>
          <Link to="/roles" className="text-navy font-semibold px-6 py-3 rounded-full border border-slate-300 hover:border-brand-orange transition-colors">
            See our roles
          </Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-5 mt-16">
        <Link to="/roles" className="border border-slate-200 rounded-xl p-6 hover:border-brand-orange/50 transition-colors">
          <p className="text-brand-orange font-display text-lg mb-1">Roles</p>
          <p className="text-sm text-slate-500">Who leads what, and why each role exists.</p>
        </Link>
        <Link to="/members" className="border border-slate-200 rounded-xl p-6 hover:border-brand-orange/50 transition-colors">
          <p className="text-brand-orange font-display text-lg mb-1">Members</p>
          <p className="text-sm text-slate-500">The people building with us.</p>
        </Link>
        <Link to="/projects" className="border border-slate-200 rounded-xl p-6 hover:border-brand-orange/50 transition-colors">
          <p className="text-brand-orange font-display text-lg mb-1">Projects</p>
          <p className="text-sm text-slate-500">What we've actually shipped.</p>
        </Link>
      </section>
    </div>
  )
}
