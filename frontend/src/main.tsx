import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { url } from 'inspector'
// import { FlickeringGridd } from './components/FlickerGrid.tsx'

createRoot(document.getElementById('root')!).render(

    <StrictMode>
        <Router>
            <Routes>
                {/* <FlickeringGridd /> */}
                <Route path="/*" element={<App />} />
            </Routes>
        </Router>
    </StrictMode>,
)
