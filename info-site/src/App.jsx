import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './App.css'
import HtmlJsPlayground from './HtmlJsPlayground.jsx'
import PromptMaestro from './PromptMaestro.jsx'
import devLogo from './assets/Dev.png'

const pages = {
  home: 'home',
  uses: 'uses',
  gettingStarted: 'gettingStarted',
  dosAndDonts: 'dosAndDonts',
  whatsNext: 'whatsNext',
  playground: 'playground',
  maestro: 'maestro',
  more3: 'more3',
  more4: 'more4',
  more5: 'more5',
  about: 'about',
  references: 'references',
}

const aiUsageGrowth = [
  { year: 2023, value: 70 },
  { year: 2024, value: 76 },
  { year: 2025, value: 84 },
]

function AiUsageGrowthChart() {
  const width = 520
  const height = 220
  const pad = { top: 18, right: 18, bottom: 34, left: 42 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const values = aiUsageGrowth.map((d) => d.value)
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const yMin = Math.max(0, Math.floor((minV - 5) / 5) * 5)
  const yMax = Math.min(100, Math.ceil((maxV + 5) / 5) * 5)

  const xAt = (i) => (aiUsageGrowth.length === 1 ? innerW / 2 : (i / (aiUsageGrowth.length - 1)) * innerW)
  const yAt = (v) => {
    const t = (v - yMin) / (yMax - yMin || 1)
    return innerH - t * innerH
  }

  const points = aiUsageGrowth.map((d, i) => {
    const x = pad.left + xAt(i)
    const y = pad.top + yAt(d.value)
    return { ...d, x, y }
  })

  const polyline = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

  const yTicks = [yMin, yMin + (yMax - yMin) / 2, yMax].map((v) => Math.round(v))
  const gridLines = yTicks.map((v) => ({
    v,
    y: pad.top + yAt(v),
  }))

  return (
    <figure className="landing-chart" aria-label="AI tool usage growth chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="AI tools usage or planned usage over time">
        <defs>
          <linearGradient id="aiLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.85)" />
            <stop offset="100%" stopColor="rgba(125, 211, 252, 0.95)" />
          </linearGradient>
          <linearGradient id="aiArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.22)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0.00)" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.65 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridLines.map((g) => (
          <g key={g.v}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={g.y}
              y2={g.y}
              stroke="rgba(42, 42, 42, 0.9)"
              strokeWidth="1"
            />
            <text x={pad.left - 10} y={g.y + 4} textAnchor="end" fontSize="11" fill="rgba(156, 163, 175, 0.95)">
              {g.v}%
            </text>
          </g>
        ))}

        <path
          d={[
            `M ${points[0].x} ${pad.top + innerH}`,
            `L ${points.map((p) => `${p.x} ${p.y}`).join(' L ')}`,
            `L ${points[points.length - 1].x} ${pad.top + innerH}`,
            'Z',
          ].join(' ')}
          fill="url(#aiArea)"
        />

        <polyline points={polyline} fill="none" stroke="url(#aiLine)" strokeWidth="3" filter="url(#softGlow)" />

        {points.map((p) => (
          <g key={p.year}>
            <circle cx={p.x} cy={p.y} r="5.5" fill="#0a0a0a" stroke="rgba(125, 211, 252, 0.95)" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="12" fill="#e5e7eb" fontWeight="700">
              {p.value}%
            </text>
            <text x={p.x} y={height - 12} textAnchor="middle" fontSize="11" fill="rgba(156, 163, 175, 0.95)">
              {p.year}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState(pages.home)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openUsesTier, setOpenUsesTier] = useState('tier1')
  const guideRef = useRef(null)
  const toolsRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const mobileMenuToggleRef = useRef(null)
  const navBarRef = useRef(null)
  const navItemRefs = useRef({})
  const [navHighlight, setNavHighlight] = useState({ opacity: 0, x: 0, y: 0, w: 0, h: 0 })
  const landingHeroRef = useRef(null)
  const landingHeroRafRef = useRef(null)

  const LANDING_GLOW_REST_X = 18
  const LANDING_GLOW_REST_Y = -8

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuToggleRef.current && mobileMenuToggleRef.current.contains(event.target)) {
        return
      }
      if (guideRef.current && !guideRef.current.contains(event.target)) {
        setIsGuideOpen(false)
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsMoreOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isGuideOpen || isMoreOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isGuideOpen, isMoreOpen, isMobileMenuOpen])

  useEffect(() => {
    const el = landingHeroRef.current
    if (!el) return

    el.style.setProperty('--glow-x', `${LANDING_GLOW_REST_X}%`)
    el.style.setProperty('--glow-y', `${LANDING_GLOW_REST_Y}%`)

    return () => {
      if (landingHeroRafRef.current) {
        cancelAnimationFrame(landingHeroRafRef.current)
        landingHeroRafRef.current = null
      }
    }
  }, [])

  const getActiveNavKey = () => {
    if (
      currentPage === pages.uses ||
      currentPage === pages.gettingStarted ||
      currentPage === pages.dosAndDonts ||
      currentPage === pages.whatsNext
    ) {
      return 'guide'
    }
    if (
      currentPage === pages.playground ||
      currentPage === pages.maestro ||
      currentPage === pages.more3 ||
      currentPage === pages.more4 ||
      currentPage === pages.more5
    ) {
      return 'tools'
    }
    if (currentPage === pages.about) return 'about'
    if (currentPage === pages.references) return 'references'
    return 'home'
  }

  const updateNavHighlight = () => {
    const navEl = navBarRef.current
    if (!navEl) return

    const key = getActiveNavKey()
    const activeEl = navItemRefs.current?.[key]
    if (!activeEl) return

    const navRect = navEl.getBoundingClientRect()
    const itemRect = activeEl.getBoundingClientRect()

    setNavHighlight({
      opacity: 1,
      x: itemRect.left - navRect.left,
      y: itemRect.top - navRect.top,
      w: itemRect.width,
      h: itemRect.height,
    })
  }

  useLayoutEffect(() => {
    updateNavHighlight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isGuideOpen, isMoreOpen, isMobileMenuOpen])

  useEffect(() => {
    const handleResize = () => updateNavHighlight()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const handleLandingHeroMouseMove = (event) => {
    const el = landingHeroRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const rawX = ((event.clientX - rect.left) / rect.width) * 100
    const rawY = ((event.clientY - rect.top) / rect.height) * 100

    const x = Math.max(-10, Math.min(110, rawX))
    const y = Math.max(-20, Math.min(120, rawY))

    if (landingHeroRafRef.current) cancelAnimationFrame(landingHeroRafRef.current)
    landingHeroRafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--glow-x', `${x.toFixed(2)}%`)
      el.style.setProperty('--glow-y', `${y.toFixed(2)}%`)
    })
  }

  const scrollToUsesId = (tierKey, id) => {
    setOpenUsesTier(tierKey)
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

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
      case pages.maestro:
        return (
          <section className="page">
            <h1>Prompt Maestro</h1>
            <p>
              Give the Maestro some coding prompts and let it give you feedback! Learn how to make your prompts clearer, more concise, and more effective.
            </p>
            <PromptMaestro />
          </section>
        )
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
          <section className="page uses-page">
            <div className="uses-hero">
              <div className="uses-hero-inner">
                <h1>Uses</h1>
                <p>What are the best use cases for AI programming tools?</p>
              </div>
            </div>

            <div className="uses-accordion" aria-label="AI tool uses by tier">
              <div className={openUsesTier === 'tier1' ? 'uses-tier open' : 'uses-tier'}>
                <button
                  type="button"
                  className="uses-tier-header"
                  aria-expanded={openUsesTier === 'tier1'}
                  onClick={() => setOpenUsesTier((t) => (t === 'tier1' ? '' : 'tier1'))}
                >
                  <div className="uses-tier-title">Tier 1 Uses (Almost always use AI assistance for these tasks)</div>
                  <div className="uses-tier-chevron" aria-hidden="true">
                    ▾
                  </div>
                </button>
                <div className="uses-tier-body">
                  <ul>
                    <li>Prototyping a concept</li>
                    <li>Pre-visualization</li>
                    <li>
                      <button
                        className="inline-link"
                        onClick={() => {
                          scrollToUsesId('tier1', 'basic-frontend-tasks')
                        }}
                      >
                        Basic frontend tasks*
                      </button>
                    </li>
                    <li>Boilerplating</li>
                    <li>
                      <button
                        className="inline-link"
                        onClick={() => {
                          scrollToUsesId('tier1', 'debugging')
                        }}
                      >
                        Debugging (even its own code)*
                      </button>
                    </li>
                    <li>Understanding Code</li>
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
                        <strong>Supply your references and ideas:</strong> Now that you have everything planned out, share it with your tool! Supply your AI of choice with images and detailed verbal descriptions on elements; the more specific, the better. Then, it's as simple as letting it write the frontend code for you, and voila, you have UI. Prompt it to add simple UX and functionality, like simple buttons, hyperlinks, or navigation. Make sure the product stays in your vision, and don't lose track of where its going.
                      </li>
                    </ol>
                  </div>
                  <div id="debugging" className="use-detail-section">
                    <h3>Debugging (even its own code)</h3>
                    <p>
                      Facing an error? Whether it's throwing messages in your terminal, crashing your application, or is simply a logical issue, ask your tool to look into it.
                    </p>
                    <ul>
                      <li>
                        Different tools can do this in different ways. If your tool is integrated into your IDE, whether it's through an extension or built-in integration, give it context access. This is either in its settings or the prompt window itself (sometimes this feature is locked behind subscriptions, so be careful). If your AI tool is able to do this, then it can look through any specified files in your code base and check for errors itself. Better yet, many assistants, including Cursor, the tool used to make this page, can even check the context around highlighted lines of code.
                      </li>
                      <li>
                        Once you've given it the appropriate code context, supply the tool with as detailed of an error message/problem statement as possible. Describe exactly what's happening in your program, and what errors are thrown, alongside the intended functionality. The tool is great at solving errors and catching minor semantics in your code. However, make sure to understand the error and solution. Your code is worthless if you can't understand and manage it yourself.
                      </li>
                      <li>
                        Don't be afraid to call out your AI. It isn't perfect, and it makes mistakes. However, according to several studies, it also has decent success rates with fixing its own code. Follow the same process as above, and even supply the tool with some of the extra context and explanations that it gave to you in the chat, especially if you notice an error in its logic right off the bat.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={openUsesTier === 'tier2' ? 'uses-tier open' : 'uses-tier'}>
                <button
                  type="button"
                  className="uses-tier-header"
                  aria-expanded={openUsesTier === 'tier2'}
                  onClick={() => setOpenUsesTier((t) => (t === 'tier2' ? '' : 'tier2'))}
                >
                  <div className="uses-tier-title">Tier 2 Uses (Use AI with caution and awareness)</div>
                  <div className="uses-tier-chevron" aria-hidden="true">
                    ▾
                  </div>
                </button>
                <div className="uses-tier-body">
                  <ul>
                    <li>Complex Refactoring (Can break logic)</li>
                    <li>Backend Subsystems</li>
                    <li>Generating Test Cases (Often doesn't consider edge cases)</li>
                    <li>API calls and manipulation (Security concerns and hallucinated calls)</li>
                    <li>
                      <button
                        className="inline-link"
                        onClick={() => {
                          scrollToUsesId('tier2', 'security-scanning')
                        }}
                      >
                        Security Scanning and Vulnerability Checks*
                      </button>
                    </li>
                  </ul>
                  <div id="security-scanning" className="use-detail-section">
                    <h3>Security Scanning and Vulnerability Checks</h3>
                    <p>
                      A pattern you'll notice with AI tools is that they're great at catching things you might miss in your code. A great way to use this is by scanning your projects for security vulnerabilities. LLMs can find several security vulnerabilities in your code, and can even propose fixes for them. However, you should still run your project through real security scanners to make sure you're not missing anything.
                    </p>
                  </div>
                </div>
              </div>

              <div className={openUsesTier === 'tier3' ? 'uses-tier open' : 'uses-tier'}>
                <button
                  type="button"
                  className="uses-tier-header"
                  aria-expanded={openUsesTier === 'tier3'}
                  onClick={() => setOpenUsesTier((t) => (t === 'tier3' ? '' : 'tier3'))}
                >
                  <div className="uses-tier-title">Tier 3 Uses (Stay away from using AI for these tasks)</div>
                  <div className="uses-tier-chevron" aria-hidden="true">
                    ▾
                  </div>
                </button>
                <div className="uses-tier-body">
                  <ul>
                    <li>Project-wide backend architecture</li>
                    <li>
                      <button
                        className="inline-link"
                        onClick={() => {
                          scrollToUsesId('tier3', 'security-central-code')
                        }}
                      >
                        Security-central code (Authentication, Encryption, etc.)*
                      </button>
                    </li>
                    <li>Business-Critical Requirements and Logic</li>
                    <li>Generation of entire features/modules</li>
                    <li>Working with packages (Often hallucinates imports or includes insecure/deprecated dependencies)</li>
                    <li>Production-ready code</li>
                  </ul>
                  <div id="security-central-code" className="use-detail-section">
                    <h3>Security-central code (Authentication, Encryption, etc.)</h3>
                    <p>
                      Using AI for your security-central backend can lead to heavy risks down the line. 
                    </p>
                    <ul>
                      <li>
                        The most common flaw in AI generated code is the use of <b>insufficiently random values</b>, which makes it easier for attackers to guess and brute force their way in.
                      </li>
                      <li>
                        LLMs also generate code vulnerable to several different types of attacks, including Code Injection, SQL Injection, and more.
                      </li>
                      <li>
                        AI tools can also hallucinate code and authentication, leading it to even the simplest of errors, like hard coded passwords.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      case pages.gettingStarted:
        return (
          <section className="page">
            <h1>Getting Started</h1>
            <p>
              There are a ton of ways to integrate AI tools into your Workspace/IDE. There are three "levels" of integration, and your choice between them is completely up to you.
            </p>
            
            <h2>Level 1: Chat app/browser tab</h2>
            <p>
              Many LLMs and GenAI tools are available for developers, and many of them reside in their own web domains or applications.
            </p>
            <ul>
              <li>Some examples of these are <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">chatgpt.com</a>, <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">claude.ai</a>, <a href="https://replit.com" target="_blank" rel="noopener noreferrer">repl.it</a>*, <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">gemini.google.com</a>, etc.</li>
              <li>*<a href="https://replit.com" target="_blank" rel="noopener noreferrer">Replit</a> is also a web-based IDE on its own, but its chatbot is reliable for programming questions and understanding.</li>
              <li>Usually best for quick and simple tasks where you can copy and paste code snippets from the browser into the IDE.</li>
            </ul>

            <h2>Level 2: IDE Plugins/Extensions</h2>
            <p>
              Most modern development environments have built-in or installable tools that implement popular AI tools like <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer">GitHub Copilot</a>, <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude Haiku</a>, <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">Gemini</a>, and more. These extensions often let you choose what models to use as well, with some being free and some being subscription-based.
            </p>
            <ul>
              <li>Let you code in a familiar IDE while having a sidebar for AI assistance, and integrate seamlessly with development.</li>
              <li><a href="https://visualstudio.microsoft.com" target="_blank" rel="noopener noreferrer">Microsoft's Visual Studio</a> is one of the most modular and customizable development platforms for integrating AI tools.</li>
            </ul>

            <h2>Level 3: Dedicated Development Application</h2>
            <p>
              Some high-power AI programming tools/agents provide their own IDEs for users to program in with complete integration.
            </p>
            <ul>
              <li>The leading example of this is <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer">Cursor</a>, which is a fork of VS Code with deeply embedded AI functionality.</li>
              <li><a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude code</a>'s desktop environment, <a href="https://www.cognition-labs.com/devin" target="_blank" rel="noopener noreferrer">Devin</a>, and <a href="https://windsurf.ai" target="_blank" rel="noopener noreferrer">Windsurf by Codeium</a> are also examples of AI integration at this level.</li>
            </ul>
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
              My name is Nitin Sathish, and I created Dev X AI because I noticed one problem holding countless developers back: the fear of AI. The computer science industry is shrinking in many ways, and people are quick to blame it on AI. What they fail to realize is that while AI can be a huge risk to developers who don't know how to use it, it can also be an invaluable tool to those who can balance it and master it. This webpage serves as a tool to get more developers acquainted with the benefits AI programming provides, and how they can use it safely and securely.
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
          <section className="page landing">
            <div
              className="landing-hero"
              role="region"
              aria-label="Dev × AI landing hero"
              ref={landingHeroRef}
              onMouseMove={handleLandingHeroMouseMove}
            >
              <div className="landing-hero-inner">
                <div className="landing-hero-copy">
                  <div className="landing-eyebrow">Dev × AI</div>
                  <h1>Program with AI—confidently.</h1>
                  <p className="landing-lead">
                    Learn how to use AI tools safely, securely, and efficiently in your development workflow.
                  </p>

                  <div className="landing-cta-row">
                    <button
                      type="button"
                      className="landing-button landing-button-primary"
                      onClick={() => setCurrentPage(pages.gettingStarted)}
                    >
                      Get started
                    </button>
                    <button
                      type="button"
                      className="landing-button landing-button-secondary"
                      onClick={() => setCurrentPage(pages.uses)}
                    >
                      Explore use cases
                    </button>
                  </div>

                  <div className="landing-chip-row" aria-label="Quick actions">
                    <button
                      type="button"
                      className="landing-chip"
                      onClick={() => setCurrentPage(pages.playground)}
                    >
                      Try the Playground
                    </button>
                    <button
                      type="button"
                      className="landing-chip"
                      onClick={() => setCurrentPage(pages.maestro)}
                    >
                      Prompt Maestro
                    </button>
                    <button
                      type="button"
                      className="landing-chip"
                      onClick={() =>
                        document.getElementById('landing-whats-inside')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }
                    >
                      What’s inside
                    </button>
                  </div>
                </div>

                <div className="landing-hero-visual" aria-label="Landing preview area">
                  <div className="landing-metric-grid" aria-label="Highlights">
                    <div className="landing-metric-card">
                      <div className="landing-metric-value">84%</div>
                      <div className="landing-metric-sub">
                        of developers are using / planning to use AI tools in their development process.{' '}
                      </div>
                      <a
                          href="https://survey.stackoverflow.co/2025/ai/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Source
                        </a>
                    </div>
                    <div className="landing-metric-card">
                      <div className="landing-metric-value">80%</div>
                      <div className="landing-metric-sub">of developers report that AI increases their productivity.</div>
                      <a
                        href="https://cloud.google.com/resources/content/2025-dora-ai-assisted-software-development-report"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source
                      </a>
                    </div>
                  </div>

                  <div className="landing-slot" data-slot="graph" aria-label="Graph slot placeholder">
                    <div className="landing-slot-title">AI usage growth (2023–2025)</div>
                    <div className="landing-slot-body landing-slot-body-chart">
                      <AiUsageGrowthChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="landing-section" id="landing-whats-inside">
              <h2>What you’ll build confidence in</h2>
              <div className="landing-feature-grid">
                <article className="landing-card">
                  <h3>When to use AI (and when not to)</h3>
                  <p>
                    Explore use cases for AI tools in development, with organized tiers for high-signal tasks vs. risky areas.
                  </p>
                  <button
                    type="button"
                    className="landing-text-link"
                    onClick={() => setCurrentPage(pages.uses)}
                  >
                    Go to Uses →
                  </button>
                </article>
                <article className="landing-card">
                  <h3>Dos &amp; Don’ts (best practices)</h3>
                  <p>
                    Learn what to do (and what not to do) when using AI tools in your development workflow.
                  </p>
                  <button
                    type="button"
                    className="landing-text-link"
                    onClick={() => setCurrentPage(pages.dosAndDonts)}
                  >
                    Go to Dos &amp; Don’ts →
                  </button>
                </article>
                <article className="landing-card">
                  <h3>Prompt Maestro (refine your prompts)</h3>
                  <p>
                    Paste a prompt before you feed it to the AI tool of your choice and get structured feedback on its effectiveness and clarity.
                  </p>
                  <button
                    type="button"
                    className="landing-text-link"
                    onClick={() => setCurrentPage(pages.maestro)}
                  >
                    Open Prompt Maestro →
                  </button>
                </article>
              </div>
            </div>
          </section>
        )
    }
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="logo-container">
          <img src={devLogo} alt="Dev × AI Logo" className="logo-image" />
          <div className="logo-text">Dev &#215; AI - The Guide to Programming With AI</div>
        </div>
        <button 
          className="mobile-menu-toggle"
          ref={mobileMenuToggleRef}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span className={isMobileMenuOpen ? 'hamburger open' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        <nav
          className={`nav-bar ${isMobileMenuOpen ? 'mobile-open' : ''}`}
          ref={(el) => {
            mobileMenuRef.current = el
            navBarRef.current = el
          }}
        >
          <span
            className="nav-highlight"
            aria-hidden="true"
            style={{
              opacity: navHighlight.opacity,
              transform: `translate(${navHighlight.x}px, ${navHighlight.y}px)`,
              width: `${navHighlight.w}px`,
              height: `${navHighlight.h}px`,
            }}
          />
          <button
            className={currentPage === pages.home ? 'nav-link active' : 'nav-link'}
            ref={(el) => {
              if (el) navItemRefs.current.home = el
            }}
            onClick={() => {
              setCurrentPage(pages.home)
              setIsMobileMenuOpen(false)
            }}
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
              ref={(el) => {
                if (el) navItemRefs.current.guide = el
              }}
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
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Uses
                </button>
                <button
                  className={currentPage === pages.gettingStarted ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.gettingStarted)
                    setIsGuideOpen(false)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Getting Started
                </button>
                <button
                  className={currentPage === pages.dosAndDonts ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.dosAndDonts)
                    setIsGuideOpen(false)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Dos &amp; Don'ts
                </button>
                <button
                  className={currentPage === pages.whatsNext ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.whatsNext)
                    setIsGuideOpen(false)
                    setIsMobileMenuOpen(false)
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
                currentPage === pages.maestro ||
                currentPage === pages.more3 ||
                currentPage === pages.more4 ||
                currentPage === pages.more5
                  ? 'nav-link nav-link-more active'
                  : 'nav-link nav-link-more'
              }
              ref={(el) => {
                if (el) navItemRefs.current.tools = el
              }}
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
                    setIsMobileMenuOpen(false)
                  }}
                >
                  HTML &amp; JS Playground
                </button>
                <button
                  className={currentPage === pages.maestro ? 'nav-more-item active' : 'nav-more-item'}
                  onClick={() => {
                    setCurrentPage(pages.maestro)
                    setIsMoreOpen(false)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Prompt Maestro
                </button>
                {/* <button
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
                </button> */}
              </div>
            )}
          </div>
          <button
            className={currentPage === pages.about ? 'nav-link active' : 'nav-link'}
            ref={(el) => {
              if (el) navItemRefs.current.about = el
            }}
            onClick={() => {
              setCurrentPage(pages.about)
              setIsMobileMenuOpen(false)
            }}
          >
            About
          </button>
          <button
            className={currentPage === pages.references ? 'nav-link active' : 'nav-link'}
            ref={(el) => {
              if (el) navItemRefs.current.references = el
            }}
            onClick={() => {
              setCurrentPage(pages.references)
              setIsMobileMenuOpen(false)
            }}
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
