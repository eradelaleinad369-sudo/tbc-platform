import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import Roles from './pages/Roles'
import Members from './pages/Members'
import Projects from './pages/Projects'
import Apply from './pages/Apply'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RequireAuth from './components/RequireAuth'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="members" element={<Members />} />
          <Route path="projects" element={<Projects />} />
          <Route path="apply" element={<Apply />} />
          <Route path="login" element={<Login />} />

          <Route element={<RequireAuth />}>
            <Route path="roles" element={<Roles />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
