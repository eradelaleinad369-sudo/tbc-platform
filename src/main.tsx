import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import Roles from './pages/Roles'
import Members from './pages/Members'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Apply from './pages/Apply'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import RequireAuth from './components/RequireAuth'
import RequireActiveMember from './components/RequireActiveMember'
import RequireAdmin from './components/RequireAdmin'
import { AuthProvider } from './lib/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="members" element={<Members />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="apply" element={<Apply />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />

            <Route element={<RequireAuth />}>
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route element={<RequireActiveMember />}>
              <Route path="roles" element={<Roles />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<RequireAdmin />}>
              <Route path="tbc-admin" element={<Admin />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
