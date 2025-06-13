import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
// import other pages like Home, Dashboard, etc. as needed

function App() {
  return (
    <Router>
      <Routes>
        {/* Add your existing routes below */}
        <Route path="/signup" element={<Signup />} />
        {/* Example: <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
