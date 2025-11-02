import { BrowserRouter, Route, Routes } from "react-router-dom"
import CareerPortal from "./pages/Home.tsx"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* ✅ You must use JSX syntax here */}
          <Route path="/" element={<CareerPortal />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

