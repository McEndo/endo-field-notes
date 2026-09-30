import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Archive from './components/Archive'
import Article from './components/Article'
import Footer from './components/Footer'
import RouteScroll from './components/RouteScroll'

const App = () => (
  <div className="min-h-screen bg-[#050505] text-white">
    <RouteScroll />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/writeups" element={<Archive type="writeup" />} />
      <Route path="/notes" element={<Archive type="note" />} />
      <Route path="/notes/:slug" element={<Article />} />
    </Routes>
    <Footer />
  </div>
)

export default App
