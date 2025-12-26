import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavLink = ({ to, children }) => {
  const { pathname, hash } = useLocation()
  const path = (hash || '#/').replace('#', '')
  const active = path === to || (to !== '/' && path.startsWith(to))
  return (
    <Link
      to={`#${to}`.replace('##', '#')}
      className={`lm360-navlink ${active ? 'active' : ''}`}
    >
      {children}
    </Link>
  )
}

export default function Layout({ children }) {
  return (
    <div className="lm360-app">
      <header className="lm360-header">
        <div className="lm360-brand">
          <span className="lm360-logo">💘</span>
          <span>LoveMatch360</span>
        </div>
        <nav className="lm360-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/match">Match</NavLink>
          <NavLink to="/chat">Chat</NavLink>
          <NavLink to="/premium">Premium</NavLink>
          <NavLink to="/profilo">Profilo</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
        <div className="lm360-actions">
          <Link to="#/signup" className="btn ghost">Crea Profilo</Link>
          <Link to="#/login" className="btn solid">Accedi</Link>
        </div>
      </header>
      <main className="lm360-main">{children}</main>
      <footer className="lm360-footer">
        <span>© {new Date().getFullYear()} LoveMatch360</span>
        <div className="lm360-footer-links">
          <a href="#/privacy">Privacy</a>
          <a href="#/terms">Termini</a>
          <a href="#/cookies">Cookie</a>
        </div>
      </footer>
    </div>
  )
}
