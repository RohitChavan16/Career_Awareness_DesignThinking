import { BrowserRouter, Route, Routes } from "react-router-dom"
import CareerPortal from "./pages/Home.tsx"
import Teams from "./pages/Teams.tsx"
import Exams from "./pages/Exams.tsx"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* ✅ You must use JSX syntax here */}
          <Route path="/" element={<CareerPortal />} />
           <Route path="/teams" element={<Teams />} />
           <Route path="/exams" element={<Exams />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

