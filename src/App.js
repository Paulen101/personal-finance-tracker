import Dashboard from './pages/dashboard/dashboard';
import Navbar from "./components/Navbar/Navbar";
import {Routes, Route} from "react-router-dom";
import { AppContext } from "./AppContext";
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
