import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { useAuth } from './lib/AuthContext'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/members', label: 'Members' },
  { to: '/projects', label: 'Projects' },
  { to: '/apply', label: 'Apply' },
]

const memberOnlyLinks = [
  { to: '/roles', label: 'Roles' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
]

export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const { session } = useAuth()

  async function handleLogout() {
    await supabase.auth.signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const linkClass = (to: string) =>
    `transition-colors hover:text-brand-orange ${pathname === to ? 'text-brand-orange' : ''}`
  const mobileLinkClass = (to: string) =>
    `py-2.5 text-sm text-white/80 hover:text-brand-orange ${pathname === to ? 'text-brand-orange' : ''}`

  return (
    <div className="min-h-screen bg-white text-navy">
      <header className="bg-navy sticky top-0 z-20">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0" onClick={() => setMenuOpen(false)}>
            <img src="/logo.jpg" alt="The Builders Circle" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover" />
            <span className="text-white font-display text-xs sm:text-sm tracking-wide leading-tight">
              THE BUILDERS<br />
              <span className="text-brand-orange">CIRCLE</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
            {publicLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                {link.label}
              </Link>
            ))}
            {session && memberOnlyLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                {link.label}
              </Link>
            ))}
            {session ? (
              <button onClick={handleLogout} className="text-white font-mono text-xs px-4 py-1.5 rounded border border-white/20 hover:border-brand-orange transition-colors">
                logout()
              </button>
            ) : (
              <Link to="/login" className="bg-brand-orange text-navy font-mono text-xs font-semibold px-4 py-1.5 rounded hover:bg-white transition-colors">
                login()
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white p-2 -mr-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            )}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden bg-navy-light border-t border-white/10 px-4 pb-4 flex flex-col gap-1">
            {publicLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={mobileLinkClass(link.to)}>
                {link.label}
              </Link>
            ))}
            {session && memberOnlyLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={mobileLinkClass(link.to)}>
                {link.label}
              </Link>
            ))}
            {session ? (
              <button
                onClick={handleLogout}
                className="text-white font-mono text-xs px-4 py-2 rounded border border-white/20 text-center mt-2"
              >
                logout()
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-brand-orange text-navy font-mono text-xs font-semibold px-4 py-2 rounded text-center mt-2"
              >
                login()
              </Link>
            )}
          </div>
        )}
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <Outlet />
      </main>
      <footer className="bg-navy text-white/60 pt-12 pb-6 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="The Builders Circle" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-white font-display text-sm leading-tight">THE BUILDERS<br /><span className="text-brand-orange">CIRCLE</span></p>
              </div>
            </div>
            <p className="text-sm mt-4 leading-relaxed">
              A community that builds engineers who think deeply, solve meaningful problems, and create
              opportunities for one another.
            </p>
          </div>

          <div>
            <p className="text-white font-semibold mb-4">Quick Links</p>
            <ul className="space-y-2.5 text-sm">
              {publicLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-brand-orange transition-colors">{link.label}</Link>
                </li>
              ))}
              {session ? (
                memberOnlyLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="hover:text-brand-orange transition-colors">{link.label}</Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/login" className="hover:text-brand-orange transition-colors">Member Login</Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold mb-4">Contact</p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" opacity="0"/><path d="M2 5h20v14H2z"/><path d="m2 5 10 8L22 5"/></svg>
                thebuilderscircle@lasu.edu.ng
              </li>
              <li>
                <Link to="/apply" className="hover:text-brand-orange transition-colors">Apply to join</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-white/40">
          <span>© 2026 THE BUILDERS CIRCLE · LASU EPE CAMPUS</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green inline-block" />
            SYSTEM_ONLINE
          </span>
        </div>
      </footer>
    </div>
  )
}
