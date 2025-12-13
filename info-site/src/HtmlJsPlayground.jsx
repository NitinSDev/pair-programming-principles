import { useState } from 'react'

function HtmlJsPlayground() {
  const [html, setHtml] = useState('<h1>Hello, world!</h1>')
  const [js, setJs] = useState('console.log("Hello from JavaScript!")')
  const [srcDoc, setSrcDoc] = useState('')

  const runCode = () => {
    const fullDoc = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Playground</title>
  </head>
  <body>
    ${html}
    <script>
      try {
        ${js}
      } catch (e) {
        document.body.innerHTML += '<pre style="color:red;white-space:pre-wrap;">' + e.toString() + '</pre>'
      }
    <\/script>
  </body>
</html>`

    setSrcDoc(fullDoc)
  }

  return (
    <div className="playground">
      <div className="playground-editors">
        <div className="playground-panel">
          <h2>HTML</h2>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="playground-textarea"
          />
        </div>
        <div className="playground-panel">
          <h2>JavaScript</h2>
          <textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            className="playground-textarea"
          />
        </div>
      </div>
      <button className="playground-run-button" onClick={runCode}>
        Run
      </button>
      <div className="playground-output">
        <h2>Result</h2>
        <iframe
          title="HTML & JS Playground"
          className="playground-iframe"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={srcDoc}
        />
      </div>
    </div>
  )
}

export default HtmlJsPlayground




