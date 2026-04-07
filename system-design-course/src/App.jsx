import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChapterPage from './pages/ChapterPage'
import BlueprintGrid from './components/Layout/BlueprintGrid'
import GlowBar from './components/Layout/GlowBar'

export default function App() {
  return (
    <BrowserRouter basename="/system-design-course">
      <BlueprintGrid />
      <GlowBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapter/:slug" element={<ChapterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
