import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import ReportForm from "./Pages/ReportForm";
import ReportsOverview from './Pages/ReportsOverview';
import AdminPage from "./Pages/AdminPage";

//function App() {
  //return <div><ReportForm></ReportForm></div>//
//}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReportsOverview />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
