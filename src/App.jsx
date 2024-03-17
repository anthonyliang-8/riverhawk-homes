import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Reviews from "./pages/Reviews";
import RatingForm from "./pages/RatingForm";
import ProfilePage from "./pages/ProfilePage";
import { Router, Routes, Route } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";

// APP.JSX IS THE TOP MOST COMPONENT TO WRAP ALL OTHER COMPONENTS

function App() {
  return (
    <Flex minH="100vh" direction="column">
      <Navbar />
      <Routes>
        {/*ALL ROUTES TO PAGES BELONG HERE */}
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="dorm/:id" element={<Reviews />} />
        <Route path="dorm/:id/rate" element={<RatingForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {/* react only uses one parent element*/}
      <Footer />
    </Flex>
  );
}

export default App;
