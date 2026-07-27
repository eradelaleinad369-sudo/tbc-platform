import { Link, Outlet, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/roles', label: 'Roles' },
  { to: '/members', label: 'Members' },
  { to: '/projects', label: 'Projects' },
  { to: '/apply', label: 'Apply' },
]

export default function App() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-white text-navy">
      <header className="bg-navy sticky top-0 z-10">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="The Builders Circle" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-white font-display text-sm tracking-wide leading-tight">
              THE BUILDERS<br />
              <span className="text-brand-orange">CIRCLE</span>
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-white/80">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors hover:text-brand-orange ${pathname === link.to ? 'text-brand-orange' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="bg-brand-orange text-navy font-semibold px-4 py-1.5 rounded-full hover:bg-white transition-colors"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <Outlet />
      </main>
      <footer className="bg-navy text-white/50 text-sm text-center py-6 mt-16">
        The Builders Circle — LASU Epe Campus
      </footer>
    </div>
  )
}
