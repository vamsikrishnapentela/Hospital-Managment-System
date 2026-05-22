import { useState, useEffect } from 'react';
import { FaUserShield, FaUsersCog, FaSignOutAlt, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = 'https://hospital-managment-system-tsa1.onrender.com/api';

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-64 bg-white border-r border-slate-200 fixed h-screen z-10">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <FaUserShield />
        </div>
        <div>
          <span className="font-display font-bold text-xl text-slate-900 tracking-tight block leading-none">
            Ramu Hospital
          </span>
          <span className="text-xs text-slate-500 font-medium">Admin Dashboard</span>
        </div>
      </div>

      <nav className="space-y-2">
        <button 
          onClick={() => setActiveTab('staff')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'staff' 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FaUsersCog /> Manage Doctors
        </button>
      </nav>
    </div>
    
    <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
      <button className="flex items-center gap-3 px-4 py-3 w-full text-danger hover:bg-danger/10 rounded-lg font-medium transition-colors">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  </aside>
);

const HospitalAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const [showAddForm, setShowAddForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', department: '', floorNumber: '', roomNumber: '' });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/doctor/${id}`);
      toast.success('Doctor deleted successfully!');
      fetchDoctors();
    } catch (err) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/admin/doctor`, newStaff);
      toast.success('Doctor added successfully!');
      setShowAddForm(false);
      setNewStaff({ name: '', email: '', department: '', floorNumber: '', roomNumber: '' });
      fetchDoctors();
    } catch (err) {
      toast.error('Failed to add doctor');
    }
  };

  const renderStaff = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Doctor Management</h1>
          <p className="text-slate-500">Add new doctors to the hospital system.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
        >
          {showAddForm ? 'Close Form' : <><FaPlus /> Add New Doctor</>}
        </button>
      </header>

      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Doctor / Department</h3>
          <form onSubmit={handleAddStaff} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Doctor Name</label>
              <input type="text" required value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input type="email" required value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="john@medicore.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Department / Specialty</label>
              <input type="text" required value={newStaff.department} onChange={(e) => setNewStaff({...newStaff, department: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="e.g. Cardiology" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Floor</label>
                <input type="number" required value={newStaff.floorNumber} onChange={(e) => setNewStaff({...newStaff, floorNumber: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="1" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Room</label>
                <input type="text" required value={newStaff.roomNumber} onChange={(e) => setNewStaff({...newStaff, roomNumber: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="101A" />
              </div>
            </div>
            <div className="col-span-2 mt-4 text-right">
              <button type="submit" className="bg-success text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-success/20">Save Doctor</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Existing Doctors</h3>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Doctor Name</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Email</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Department</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Location</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">No doctors added yet.</td>
              </tr>
            ) : (
              doctors.map(doc => (
                <tr key={doc._id} className="hover:bg-slate-100/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">Dr. {doc.userRef?.name}</td>
                  <td className="px-6 py-4 text-slate-700">{doc.userRef?.email}</td>
                  <td className="px-6 py-4 text-slate-700">{doc.specialization}</td>
                  <td className="px-6 py-4 text-slate-700">Flr {doc.floorNumber}, Rm {doc.roomNumber}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteDoctor(doc._id)} className="text-danger hover:underline text-sm font-bold flex items-center justify-end gap-2 ml-auto">
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-700">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'staff' && renderStaff()}
        </div>
      </main>
    </div>
  );
};

export default HospitalAdminDashboard;
