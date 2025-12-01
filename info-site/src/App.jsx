import { useState } from 'react'
import './App.css'

const pages = {
  home: 'home',
  about: 'about',
  services: 'services',
  contact: 'contact',
}

function App() {
  const [currentPage, setCurrentPage] = useState(pages.home)

  const renderPage = () => {
    switch (currentPage) {
      case pages.about:
        return (
          <section className="page">
            <h1>About Us</h1>
            <p>
              This is a boilerplate informational website built with React. Use this page to describe
              who you are, your mission, and any background information visitors should know.
            </p>
          </section>
        )
      case pages.services:
        return (
          <section className="page">
            <h1>Services</h1>
            <p>
              List your services, products, or offerings here. You can replace this text with bullet
              points, feature descriptions, or links to more detailed pages.
            </p>
          </section>
        )
      case pages.contact:
        return (
          <section className="page">
            <h1>Contact</h1>
            <p>
              Provide your contact details, email address, or a simple contact form. You can also
              link to your social media or other channels.
            </p>
          </section>
        )
      case pages.home:
      default:
        return (
          <section className="page">
            <h1>Welcome to Your Info Site</h1>
            <p>
              This is the home page of your informational website. Use this space for a brief
              introduction and a clear statement about what visitors can find here.
            </p>
          </section>
        )
    }
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="logo-text">My Info Site</div>
        <nav className="nav-bar">
          <button
            className={currentPage === pages.home ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage(pages.home)}
          >
            Home
          </button>
          <button
            className={currentPage === pages.about ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage(pages.about)}
          >
            About
          </button>
          <button
            className={currentPage === pages.services ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage(pages.services)}
          >
            Services
          </button>
          <button
            className={currentPage === pages.contact ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage(pages.contact)}
          >
            Contact
          </button>
        </nav>
      </header>

      <main className="site-main">{renderPage()}</main>

      <footer className="site-footer">
        <small>© {new Date().getFullYear()} My Info Site. All rights reserved.</small>
      </footer>
    </div>
  )
}

export default App
