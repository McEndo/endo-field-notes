import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Writeup from './components/Writeup'
import Footer from './components/Footer'
import RouteScroll from './components/RouteScroll'

const App = () => (
  <div className="min-h-screen bg-[#050505] text-white">
    <RouteScroll />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notes/:slug" element={<Writeup />} />
    </Routes>
    <Footer />
  </div>
)

export default App
