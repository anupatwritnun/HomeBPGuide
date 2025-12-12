import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BPGuidePage from './pages/BPGuidePage'
import KnowledgePage from './pages/KnowledgePage'
import './index.css'

function App() {
  return (
    <Router>
      <Analytics />
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guide" element={<BPGuidePage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
