import { useState, useEffect } from 'react';
import { FaUserShield, FaUsersCog, FaSignOutAlt, FaPlus, FaTrash, FaUserInjured, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = 'https://hospital-managment-system-tsa1.onrender.com/api';

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 relative md:fixed h-auto md:h-screen z-10 print:hidden shrink-0 flex flex-col md:block">
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
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors shrink-0 ${
            activeTab === 'overview' 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FaChartLine /> Overview & Stats
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors shrink-0 ${
            activeTab === 'staff' 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FaUsersCog /> Manage Doctors
        </button>
        <button 
          onClick={() => setActiveTab('patients')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors shrink-0 ${
            activeTab === 'patients' 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FaUserInjured /> Patient Directory
        </button>
      </nav>
    </div>
    
    <div className="mt-auto md:mt-0 md:absolute md:bottom-0 w-full p-4 border-t border-slate-200">
      <button className="flex items-center gap-3 px-4 py-3 w-full text-danger hover:bg-danger/10 rounded-lg font-medium transition-colors">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  </aside>
);

const HospitalAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ totalPatients: 0, todayTokens: 0, revenueToday: 0, weeklyTokensList: [], deptVisits: [], opPrice: 500 });
  const [searchQuery, setSearchQuery] = useState('');
  const [newStaff, setNewStaff] = useState({ name: '', email: '', department: '', floorNumber: '', roomNumber: '' });

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchStats();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reception/patients`);
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/dashboard-stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpPriceChange = async (newPrice) => {
    try {
      await axios.post(`${API_BASE}/admin/settings`, { key: 'op_price', value: newPrice });
      toast.success('OP Price updated successfully!');
      fetchStats();
    } catch (err) {
      toast.error('Failed to update OP Price');
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
              <input type="email" required value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="john@ramuhospital.com" />
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

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl overflow-x-auto">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Existing Doctors</h3>
        <table className="w-full text-left min-w-max">
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

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.patientId?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.phone?.includes(searchQuery)
  );

  const renderPatients = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Patient Directory</h1>
          <p className="text-slate-500">Search and view all registered patients.</p>
        </div>
        <div className="w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search by Name, ID, or Phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 p-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl overflow-x-auto">
        <h3 className="text-xl font-bold text-slate-900 mb-6">All Patients</h3>
        <table className="w-full text-left min-w-max">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Patient ID</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Phone</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Blood Group</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">No patients found.</td>
              </tr>
            ) : (
              filteredPatients.map(patient => (
                <tr key={patient._id} className="hover:bg-slate-100/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{patient.patientId}</td>
                  <td className="px-6 py-4 text-slate-700">{patient.name}</td>
                  <td className="px-6 py-4 text-slate-700">{patient.phone}</td>
                  <td className="px-6 py-4 text-slate-700">{patient.bloodGroup || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-700">{patient.address || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Hospital Overview</h1>
          <p className="text-slate-500">Real-time statistics and revenue.</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Patients</p>
          <p className="text-4xl md:text-5xl font-display font-bold text-primary">{stats.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Today's OP Visits</p>
          <p className="text-4xl md:text-5xl font-display font-bold text-secondary">{stats.todayTokens}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FaChartLine className="text-6xl text-success" />
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Today's Revenue (OP)</p>
          <p className="text-4xl md:text-5xl font-display font-bold text-success">₹{stats.revenueToday}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Department Visits</h3>
          <div className="space-y-4">
            {stats.deptVisits.length === 0 && <p className="text-slate-500 text-sm">No visits recorded yet.</p>}
            {stats.deptVisits.map((d, i) => (
              <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="font-medium text-slate-700">{d._id}</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{d.count} patients</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-4 text-slate-800">Hospital Settings</h3>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Outpatient (OP) Consultation Price (₹)</label>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  defaultValue={stats.opPrice}
                  id="opPriceInput"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. 500"
                />
                <button 
                  onClick={() => handleOpPriceChange(document.getElementById('opPriceInput').value)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all"
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">This price will automatically reflect in the Reception portal during token generation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen text-slate-700">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="md:ml-64 flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'staff' && renderStaff()}
          {activeTab === 'patients' && renderPatients()}
        </div>
      </main>
    </div>
  );
};

export default HospitalAdminDashboard;
