import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const publicLinks = [
  { to: '/members', label: 'Members' },
  { to: '/projects', label: 'Projects' },
  { to: '/apply', label: 'Apply' },
]

const memberLinks = [{ to: '/roles', label: 'Roles' }]

export default function App() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const allLinks = [...memberLinks, ...publicLinks]

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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
            {allLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors hover:text-brand-orange ${pathname === link.to ? 'text-brand-orange' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" className="bg-brand-orange text-navy font-semibold px-4 py-1.5 rounded-full hover:bg-white transition-colors">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
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

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-navy-light border-t border-white/10 px-4 pb-4 flex flex-col gap-1">
            {allLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 text-sm text-white/80 hover:text-brand-orange ${pathname === link.to ? 'text-brand-orange' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-brand-orange text-navy font-semibold px-4 py-2 rounded-full text-center mt-2"
            >
              Login
            </Link>
          </div>
        )}
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <Outlet />
      </main>
      <footer className="bg-navy text-white/50 text-sm text-center py-6 mt-16">
        The Builders Circle — LASU Epe Campus
      </footer>
    </div>
  )
}
