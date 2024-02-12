import './App.css'
import Navbar from './components/Navbar'

// APP.JSX IS THE TOP MOST COMPONENT TO WRAP ALL OTHER COMPONENTS

function App() {

  return (
    <div> {/* react only uses one parent element*/}
      <Navbar/>
    </div>
  )
}

export default App
