import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PortalLanding from './pages/PortalLanding';
import ReceptionDashboard from './pages/reception/ReceptionDashboard';
import DisplayPortal from './pages/display/DisplayPortal';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import LabDashboard from './pages/lab/LabDashboard';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import NurseDashboard from './pages/nurse/NurseDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import HospitalAdminDashboard from './pages/admin/HospitalAdminDashboard';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface  text-slate-800  transition-colors duration-300">
        <Routes>
          <Route path="/" element={<PortalLanding />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/display" element={<DisplayPortal />} />
          
          <Route path="/reception/*" element={<ReceptionDashboard />} />
          <Route path="/doctor/*" element={<DoctorDashboard />} />
          <Route path="/lab/*" element={<LabDashboard />} />
          <Route path="/pharmacy/*" element={<PharmacyDashboard />} />
          <Route path="/nurse/*" element={<NurseDashboard />} />
          <Route path="/patient/*" element={<PatientDashboard />} />
          <Route path="/admin/*" element={<HospitalAdminDashboard />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;


