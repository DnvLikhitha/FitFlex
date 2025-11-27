import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <h1 style={{ color: 'red', fontSize: '32px' }}>Test - App is Working!</h1>
        <p>If you see this, React is rendering correctly.</p>
        <Routes>
          <Route path="/" element={<div>Dashboard Test</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
