import './App.css'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import SignUp from './pages/Signup';
import Home from './pages/Home';
import Reviews from './pages/Reviews';
import RatingForm from './pages/RatingForm';
import { Router, Routes, Route } from 'react-router-dom';

// APP.JSX IS THE TOP MOST COMPONENT TO WRAP ALL OTHER COMPONENTS

function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        {/*ALL ROUTES TO PAGES BELONG HERE */}
        <Route path="/" element={<Home/>} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="dorm/:id" element={<Reviews />} />
        <Route path="dorm/:id/rate" element={<RatingForm />} />
      </Routes>{/* react only uses one parent element*/}
    </div>
  )
}

export default App
