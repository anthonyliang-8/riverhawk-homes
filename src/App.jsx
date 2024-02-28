import './App.css'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Home from './pages/Home';
import { Router, Routes, Route } from 'react-router-dom';

// APP.JSX IS THE TOP MOST COMPONENT TO WRAP ALL OTHER COMPONENTS

function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="login" element={<Login />} />
      </Routes>{/* react only uses one parent element*/}
    </div>
  )
}

export default App
