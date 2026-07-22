import './App.css';
import { defaultConfig } from './config/defaultConfig';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>wikiWeb</h1>
        <p>Local-first prototype shell for a visual mathematics knowledge graph.</p>
      </header>
      <main>
        <section>
          <h2>Prototype state</h2>
          <pre>{JSON.stringify(defaultConfig, null, 2)}</pre>
        </section>
      </main>
    </div>
  );
}

export default App;
