import Dashboard from './pages/dashboard/dashboard';
import Navbar from "./components/navbar/Navbar";
import {Routes, Route} from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="App AppWrapper">
      <Navbar/>

      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
