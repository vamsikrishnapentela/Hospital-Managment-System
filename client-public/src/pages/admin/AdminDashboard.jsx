import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaCalendarAlt, FaGlobe, FaSignOutAlt, FaHospital } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('https://hospital-managment-system-tsa1.onrender.com/api/appointments');
      const data = await res.json();
      setAppointments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`https://hospital-managment-system-tsa1.onrender.com/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const renderAppointments = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">Online Appointments</h1>
          <p className="text-slate-500">View and manage booking requests from the website.</p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
          Export to CSV
        </button>
      </header>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No appointments found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Patient Name</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Phone</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Doctor/Dept</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map(appt => (
                <tr key={appt._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{appt.patientName}</td>
                  <td className="px-6 py-4 text-slate-600">{appt.phone}</td>
                  <td className="px-6 py-4 text-slate-600">{appt.doctorName || 'Any'}<br/><span className="text-xs text-slate-400">{appt.department || 'General'}</span></td>
                  <td className="px-6 py-4 text-slate-600">{appt.date}<br/><span className="text-xs text-slate-400">{appt.timeSlot}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      appt.status === 'Confirmed' ? 'bg-success/20 text-success-dark' : 
                      appt.status === 'Cancelled' ? 'bg-danger/20 text-danger-dark' : 
                      'bg-warning/20 text-warning-dark'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {appt.status === 'Pending' && (
                      <>
                        <button onClick={() => updateStatus(appt._id, 'Confirmed')} className="text-success hover:underline text-sm font-bold mr-4">Approve</button>
                        <button onClick={() => updateStatus(appt._id, 'Cancelled')} className="text-danger hover:underline text-sm font-bold">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderCMS = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">Website CMS</h1>
        <p className="text-slate-500">Manage public website content like doctors, services, and contact info.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-2xl mb-6"><FaUserShield /></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Manage Doctors</h3>
          <p className="text-slate-500 text-sm mb-6">Add new doctors or edit existing profiles shown on the public site.</p>
          <button className="bg-slate-800 hover:bg-slate-700 text-white w-full py-3 rounded-xl font-bold transition-colors">Edit Doctors</button>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center text-2xl mb-6"><FaHospital /></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Manage Services</h3>
          <p className="text-slate-500 text-sm mb-6">Update the list of departments and specialties offered.</p>
          <button className="bg-slate-800 hover:bg-slate-700 text-white w-full py-3 rounded-xl font-bold transition-colors">Edit Services</button>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center text-2xl mb-6"><FaGlobe /></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Contact Details</h3>
          <p className="text-slate-500 text-sm mb-6">Update phone numbers, address, and Google Map links.</p>
          <button className="bg-slate-800 hover:bg-slate-700 text-white w-full py-3 rounded-xl font-bold transition-colors">Edit Contact Info</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-[calc(100vh-5rem)]">
        <div className="p-6">
          <h2 className="text-xl font-display font-bold text-slate-800">Website Admin</h2>
          <p className="text-slate-500 text-sm mb-6">Management Dashboard</p>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'appointments' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FaCalendarAlt /> Appointments
            </button>
            <button 
              onClick={() => setActiveTab('cms')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'cms' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FaGlobe /> Website CMS
            </button>
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-danger hover:bg-danger/10 rounded-lg font-medium transition-colors">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'cms' && renderCMS()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
