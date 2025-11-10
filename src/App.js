import Dashboard from './pages/dashboard/dashboard';
import Navbar from "./components/Navbar/Navbar";
import {Routes, Route} from "react-router-dom";
import { AppProvider } from "./AppContext";
import './App.css';

function App() {
  return (
     <AppProvider> 
    <div className="App AppWrapper">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
     </AppProvider> 
  );
}

export default App;
