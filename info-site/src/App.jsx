import { useState, useEffect, useRef } from 'react'
import './App.css'
import HtmlJsPlayground from './HtmlJsPlayground.jsx'

const pages = {
  home: 'home',
  uses: 'uses',
  gettingStarted: 'gettingStarted',
  dosAndDonts: 'dosAndDonts',
  whatsNext: 'whatsNext',
  playground: 'playground',
  more1: 'more1',
  more2: 'more2',
  more3: 'more3',
  more4: 'more4',
  more5: 'more5',
  about: 'about',
  references: 'references',
}

function App() {
  const [currentPage, setCurrentPage] = useState(pages.home)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const guideRef = useRef(null)
  const toolsRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guideRef.current && !guideRef.current.contains(event.target)) {
        setIsGuideOpen(false)
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsMoreOpen(false)
      }
    }

    if (isGuideOpen || isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isGuideOpen, isMoreOpen])

  const renderPage = () => {
    switch (currentPage) {
      case pages.playground:
        return (
          <section className="page">
            <h1>HTML &amp; JavaScript Playground</h1>
            <p>
              Experiment with basic HTML and JavaScript. Edit the code in the editors below, then
              click <strong>Run</strong> to see the result.
            </p>
            <HtmlJsPlayground />
          </section>
        )
      case pages.more1:
      case pages.more2:
      case pages.more3:
      case pages.more4:
      case pages.more5:
        return (
          <section className="page">
            <h1>Placeholder Page</h1>
            <p>
              This is a placeholder for an additional tab. Replace the content here once you know
              what this section should contain.
            </p>
          </section>
        )
      case pages.uses:
        return (
          <section className="page">
            <h1>Uses</h1>
            <p>
              What are the best use cases for AI programming tools?
            </p>
            <h2>Tier 1 Uses (Tasks devs should almost always use AI assistance for)</h2>
            <ul>
              <li>Prototyping a concept</li>
              <li>Pre-visualization</li>
              <li>
                <button className="inline-link" onClick={() => {
                  document.getElementById('basic-frontend-tasks')?.scrollIntoView({ behavior: 'smooth' })
                }}>Basic frontend tasks*</button>
              </li>
              <li>Boilerplating</li>
              <li>
                <button className="inline-link" onClick={() => {
                  document.getElementById('debugging')?.scrollIntoView({ behavior: 'smooth' })
                }}>Debugging (even its own code)*</button>
              </li>
              <li>Understanding Code</li>
            </ul>
            <h2>Tier 2 Uses (Use AI with caution and awareness)</h2>
            <ul>
              <li>Complex Refactoring (Can break logic)</li>
              <li>Backend Subsystems</li>
              <li>Generating Test Cases (Often doesn't consider edge cases)</li>
              <li>API calls and manipulation (Security concerns and hallucinated calls)</li>
              <li>
                <button className="inline-link" onClick={() => {
                  document.getElementById('security-scanning')?.scrollIntoView({ behavior: 'smooth' })
                }}>Security Scanning and Vulnerability Checks*</button>
              </li>
            </ul>
            <h2>Tier 3 Uses (Stay away from using AI for these tasks)</h2>
            <ul>
              <li>Project-wide backend architecture</li>
              <li>
                <button className="inline-link" onClick={() => {
                  document.getElementById('security-central-code')?.scrollIntoView({ behavior: 'smooth' })
                }}>Security-central code (Authentication, Encryption, etc.)*</button>
              </li>
              <li>Business-Critical Requirements and Logic</li>
              <li>Generation of entire features/modules</li>
              <li>Working with packages (Often hallucinates imports or includes insecure/deprecated dependencies)</li>
              <li>Production-ready code</li>
            </ul>
            <div id="basic-frontend-tasks" className="use-detail-section">
              <h3>Basic frontend tasks</h3>
              <p>
                According to professionals in the field, alongside academic studies, AI tools are largely successful when creating the frontend of an application or product. Here's how you can put together some basic UI and functionality together in a matter of minutes.
              </p>
              <ol>
                <li>
                  <strong>Brainstorm &amp; plan:</strong> Figure out how you want your layout to look. Jot down or sketch some ideas. Pull up references and images. Use websites like Figma.com to quickly lay out some ideas and create references yourself. Approach this step however you deem fit, but keep in mind, the more references you have, the closer the UI will be to your own vision.
                </li>
                <li>
                  <strong>Supply your references and ideas:</strong> Now that you have everything planned out, share it with your agent! Supply your Al of choice with images and detailed verbal descriptions on elements; the more specific, the better. Then, it's as simple as letting it write the frontend code for you, and voila, you have UI. Prompt it to add simple UX and functionality, like simple buttons, hyperlinks, or navigation. Make sure the product stays in your vision, and don't lose track of where its going.
                </li>
              </ol>
            </div>
            <div id="debugging" className="use-detail-section">
              <h3>Debugging (even its own code)</h3>
              <p>
                Facing an error? Whether it's throwing messages in your terminal, crashing your application, or is simply a logical issue, ask your agent to look into it.
              </p>
              <ul>
                <li>
                  Different tools can do this in different ways. If your agent is integrated into your IDE, whether it's through an extension or built-in integration, give your agent context access. This is either in its settings or the prompt window itself (sometimes this feature is locked behind subscriptions, so be careful). If your agent is able to do this, then it can look through any specified files in your code base and check for errors itself. Better yet, many assistants, including Cursor, the tool used to make this page, can even check the context around highlighted lines of code.
                </li>
                <li>
                  Once you've given it the appropriate code context, supply the agent with as detailed of an error message/problem statement as possible. Describe exactly what's happening in your program, and what errors are thrown, alongside the intended functionality. The agent is great at solving errors and catching minor semantics in your code. However, make sure to understand the error and solution. Your code is worthless if you can't understand and manage it yourself.
                </li>
                <li>
                  Don't be afraid to call out your AI. It isn't perfect, and it makes mistakes. However, according to several studies, it also has decent success rates with fixing its own code. Follow the same process as above, and even supply the agent with some of the extra context and explanations that it gave to you in the chat, especially if you notice an error in its logic right off the bat.
                </li>
              </ul>
            </div>
            <div id="security-scanning" className="use-detail-section">
              <h3>Security Scanning and Vulnerability Checks</h3>
            </div>
            <div id="security-central-code" className="use-detail-section">
              <h3>Security-central code (Authentication, Encryption, etc.)</h3>
            </div>
          </section>
        )
      case pages.gettingStarted:
        return (
          <section className="page">
            <h1>Getting Started</h1>
            <p>
              Use this page to help visitors get oriented quickly. Add a short checklist, first steps,
              or links to the most important sections of your site.
            </p>
          </section>
        )
      case pages.dosAndDonts:
        return (
          <section className="page">
            <h1>Dos &amp; Don'ts</h1>
            <p>
              This page will contain best practices and common pitfalls when using AI coding tools.
            </p>
          </section>
        )
      case pages.whatsNext:
        return (
          <section className="page">
            <h1>What's Next?</h1>
            <p>
              This page will discuss future developments and next steps for AI programming tools.
            </p>
          </section>
        )
      case pages.about:
        return (
          <section className="page">
            <h1>About</h1>
            <p>
              Describe who you are, your background, and the purpose of this site. You can add a short
              bio, your goals, or any context that helps visitors understand what they’re looking at.
            </p>
          </section>
        )
      case pages.references:
        return (
          <section className="page">
            <h1>References</h1>
            <p>
              List helpful resources, links, or citations here. This could include articles, books,
              documentation pages, or any sources you want visitors to explore.
            </p>
          </section>
        )
      case pages.home:
      default:
        return (
          <section className="page">
            <h1>Welcome to Dev × AI</h1>
            <p>
              AI Programming has become the biggest topic in software development and programming in the past year, and you've probably heard of it in some form, whether it's referred to as peer programming, agentic programming, or even vibe coding. However, not all of the buzz around its emergence is positive. Whether you're for AI or against it, one thing's for certain: It's efficient, and it's becoming the most important tool for any developer to understand and master. Don't believe me?
            </p>
            <ul>
              <li>According to <a href="#" target="_blank" rel="noopener noreferrer">various sources</a>, over 75% of professional developers use AI coding assistants in their workflows</li>
              <li>This is a graph of the amount of test cases passed by Al coding tools for logical and intensive programming problems, taken from over a year ago. The development of these have only rapidly progressed since then.</li>
              <li>Companies like Oracle are integrating Al tools into their development workflows, and even incentivizing their usage.</li>
              <li>TODO: Build more evidence here (replace old graph)</li>
            </ul>
            <p>
              If you're here, you're probably considering using these tools for yourself. Becoming an expert on these tools isn't the easiest. However, using these tools isn't just about productivity, it's about comfort. In the next page, we'll discuss several <button className="inline-link" onClick={() => setCurrentPage(pages.uses)}><b>use cases</b></button>, where you can pick and choose which methods you like best!
            </p>
          </section>
        )
    }
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="logo-text">Dev &#215; AI - The Guide to Programming Aith AI</div>
        <nav className="nav-bar">
          <button
            className={currentPage === pages.home ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage(pages.home)}
          >
            Home
          </button>
          <div className="nav-more" ref={guideRef}>
            <button
              className={
                currentPage === pages.uses ||
                currentPage === pages.gettingStarted ||
                currentPage === pages.dosAndDonts ||
                currentPage === pages.whatsNext
                  ? 'nav-link nav-link-more active'
                  : 'nav-link nav-link-more'
              }
              onClick={() => setIsGuideOpen((open) => !open)}
            >
              Guide ▾
            </button>
            {isGuideOpen && (
              <div className="nav-more-menu">
                <button
                  className={currentPage === pages.uses ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.uses)
                    setIsGuideOpen(false)
                  }}
                >
                  Uses
                </button>
                <button
                  className={currentPage === pages.gettingStarted ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.gettingStarted)
                    setIsGuideOpen(false)
                  }}
                >
                  Getting Started
                </button>
                <button
                  className={currentPage === pages.dosAndDonts ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.dosAndDonts)
                    setIsGuideOpen(false)
                  }}
                >
                  Dos &amp; Don'ts
                </button>
                <button
                  className={currentPage === pages.whatsNext ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.whatsNext)
                    setIsGuideOpen(false)
                  }}
                >
                  What's Next?
                </button>
              </div>
            )}
          </div>
          <div className="nav-more" ref={toolsRef}>
            <button
              className={
                currentPage === pages.playground ||
                currentPage === pages.more2 ||
                currentPage === pages.more3 ||
                currentPage === pages.more4 ||
                currentPage === pages.more5
                  ? 'nav-link nav-link-more active'
                  : 'nav-link nav-link-more'
              }
              onClick={() => setIsMoreOpen((open) => !open)}
            >
              Tools ▾
            </button>
            {isMoreOpen && (
              <div className="nav-more-menu">
                <button
                  className={currentPage === pages.playground ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.playground)
                    setIsMoreOpen(false)
                  }}
                >
                  HTML &amp; JS Playground
                </button>
                <button
                  className={currentPage === pages.more2 ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.more2)
                    setIsMoreOpen(false)
                  }}
                >
                  Placeholder 2
                </button>
                <button
                  className={currentPage === pages.more3 ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.more3)
                    setIsMoreOpen(false)
                  }}
                >
                  Placeholder 3
                </button>
                <button
                  className={currentPage === pages.more4 ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.more4)
                    setIsMoreOpen(false)
                  }}
                >
                  Placeholder 4
                </button>
                <button
                  className={currentPage === pages.more5 ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.more5)
                    setIsMoreOpen(false)
                  }}
                >
                  Placeholder 5
                </button>
              </div>
            )}
          </div>
          <button
            className={currentPage === pages.about ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage(pages.about)}
          >
            About
          </button>
          <button
            className={currentPage === pages.references ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage(pages.references)}
          >
            References
          </button>
        </nav>
      </header>

      <main className="site-main">{renderPage()}</main>

      <footer className="site-footer">
        <small>© {new Date().getFullYear()} Dev x AI. All rights reserved.</small>
      </footer>
    </div>
  )
}

export default App
