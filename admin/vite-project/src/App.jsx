
import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./component/Navbar/Navbar"
import Sidebar from "./component/Sidebar/Sidebar"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🎯 CRITICAL: Importing your page components so React knows what to render
import Add from "./pages/Add/Add"
import List from "./pages/List/List"
import Orders from "./pages/Orders/Orders"

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        {/* 🎯 All Route configurations MUST be wrapped cleanly inside <Routes> */}
        <Routes>
          <Route path="/" element={<Navigate to="/add" replace />} />
          <Route path="/add" element={<Add url="http://localhost:4000" />} />
          <Route path="/list" element={<List url="http://localhost:4000" />} />
          <Route path="/orders" element={<Orders url="http://localhost:4000" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;