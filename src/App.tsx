import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Index from './pages'

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
