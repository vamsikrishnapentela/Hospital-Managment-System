import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaUsers, FaStethoscope, FaPrint, FaTimes } from 'react-icons/fa';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// --- API Service for Reception ---
const API_BASE = 'http://localhost:5000/api';

const ReceptionDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'register' | 'records'
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [socket, setSocket] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    bloodGroup: '',
    phone: '',
    department: '',
    doctorId: ''
  });

  // Modal State for OP Card
  const [showOpCard, setShowOpCard] = useState(false);
  const [opCardData, setOpCardData] = useState(null);

  // Patient Records State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    fetchQueue();
    fetchDoctors();

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('queue-updated', () => {
      fetchQueue();
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (activeTab === 'records' && searchResults.length === 0) {
      handleSearchPatient();
    }
  }, [activeTab]);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reception/queue`);
      setQueue(res.data);
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reception/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.doctorId || !formData.dob) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // 1. Register Patient
      const patientRes = await axios.post(`${API_BASE}/reception/register-patient`, formData);
      const patientId = patientRes.data._id;

      // 2. Generate Token
      const tokenRes = await axios.post(`${API_BASE}/reception/generate-token`, {
        patientId,
        doctorId: formData.doctorId
      });

      const tokenData = tokenRes.data;
      const selectedDoc = doctors.find(d => d._id === formData.doctorId);

      toast.success('Registration successful! Token generated.');
      
      // Update Queue & Notify others
      fetchQueue();
      if (socket) {
        socket.emit('new-token-generated');
      }

      // Show OP Card
      setOpCardData({
        patient: patientRes.data,
        token: tokenData,
        doctor: selectedDoc,
        date: new Date().toLocaleString()
      });
      setShowOpCard(true);
      setActiveTab('queue'); // Switch back to queue

      // Reset form
      setFormData({
        name: '', dob: '', gender: 'Male', bloodGroup: '', phone: '', department: '', doctorId: ''
      });

    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Failed to register patient');
    }
  };

  const handleSearchPatient = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() && e) return;
    try {
      const res = await axios.get(`${API_BASE}/reception/patients?query=${searchQuery}`);
      setSearchResults(res.data);
      if (res.data.length === 0) toast.error('No patients found.');
    } catch (err) {
      toast.error('Failed to search patients');
    }
  };

  const handleViewHistory = async (patientId) => {
    try {
      const res = await axios.get(`${API_BASE}/reception/patient/${patientId}/history`);
      setSelectedHistory(res.data);
    } catch (err) {
      toast.error('Failed to fetch history');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex bg-surface min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-screen z-10 transition-colors print:hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <FaStethoscope />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-primary tracking-tight block leading-none">
                MediCore
              </span>
              <span className="text-xs text-slate-500 font-medium">Reception</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('queue')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'queue' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FaUsers /> Live Queue
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'register' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FaUserPlus /> New Registration
            </button>
            <button 
              onClick={() => { setActiveTab('records'); setSelectedHistory(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'records' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FaPrint /> Patient Records
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 print:p-0 print:ml-0 print:bg-white">
        
        {/* Only show header and content if not printing, or if printing but we have styles to hide them */}
        <div className="print:hidden">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-800">
                {activeTab === 'queue' ? 'Live Queue' : activeTab === 'register' ? 'New Patient Registration' : 'Patient Records & History'}
              </h1>
              <p className="text-slate-500">
                {activeTab === 'queue' ? 'Monitor waiting patients.' : activeTab === 'register' ? 'Register a new patient and assign a token.' : 'Search for a patient to view their complete hospital history.'}
              </p>
            </div>
          </header>

          {activeTab === 'queue' && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Token</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Patient</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Doctor</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {queue.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-slate-500">No active tokens in queue.</td>
                      </tr>
                    ) : (
                      queue.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-lg text-slate-800 bg-slate-100 px-3 py-1 rounded-md">{item.code}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-800">{item.patientRef?.name}</td>
                          <td className="px-6 py-4 text-slate-600">
                            Dr. {item.doctorRef?.userRef?.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.status === 'done' ? 'bg-slate-200 text-slate-600' :
                              item.status === 'called' ? 'bg-success/20 text-success' : 
                              item.status.includes('waiting') ? 'bg-warning/20 text-warning' : 
                              'bg-primary/20 text-primary'
                            }`}>
                              {item.status.replace(/-/g, ' ').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'register' && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Patient Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                  <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="10-digit number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                  <select name="department" required value={formData.department} onChange={(e) => {
                    setFormData({ ...formData, department: e.target.value, doctorId: '' });
                  }} className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option value="">Select a Department</option>
                    {[...new Set(doctors.map(d => d.specialization))].map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Assign Doctor *</label>
                  <select name="doctorId" required value={formData.doctorId} onChange={handleInputChange} disabled={!formData.department} className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50">
                    <option value="">Select a Doctor</option>
                    {doctors.filter(doc => doc.specialization === formData.department).map(doc => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.userRef?.name} - Room {doc.roomNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 mt-4">
                  <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/30">
                    Register & Generate Token
                  </button>
                </div>
              </form>
            </motion.section>
          )}

          {activeTab === 'records' && (
            <div className="flex gap-8">
              {/* Search Panel */}
              <div className="w-1/3">
                <form onSubmit={handleSearchPatient} className="mb-6 relative">
                  <input
                    type="text"
                    placeholder="Search by ID, Name or Phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 pr-12 text-slate-700 focus:outline-none focus:border-primary shadow-sm"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:bg-primary/90">
                    <FaPrint className="w-4 h-4" />
                  </button>
                </form>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-h-[400px]">
                  <h3 className="font-bold text-slate-700 mb-4">{searchQuery ? 'Search Results' : 'Recent Patients'}</h3>
                  <div className="space-y-3">
                    {searchResults.map(p => (
                      <div 
                        key={p._id} 
                        onClick={() => handleViewHistory(p._id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedHistory?.patient._id === p._id ? 'bg-primary/5 border-primary' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                      >
                        <h4 className="font-bold text-slate-800">{p.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">ID: {p.patientId}</p>
                        <p className="text-xs text-slate-500 mt-1">{p.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* History Panel */}
              <div className="w-2/3">
                {selectedHistory ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-200">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-slate-900">{selectedHistory.patient.name}</h2>
                        <div className="flex gap-4 text-sm text-slate-500 font-mono mt-2">
                          <span>ID: {selectedHistory.patient.patientId}</span>
                          <span>Phone: {selectedHistory.patient.phone}</span>
                          <span>Age/Gender: {new Date().getFullYear() - new Date(selectedHistory.patient.dob).getFullYear()} / {selectedHistory.patient.gender}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Prescriptions Section */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-primary pl-3">Prescriptions History</h3>
                        {selectedHistory.prescriptions.length === 0 ? <p className="text-sm text-slate-500 italic">No prescriptions found.</p> : (
                          <div className="space-y-4">
                            {selectedHistory.prescriptions.map(pres => (
                              <div key={pres._id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-bold text-slate-700">{new Date(pres.issuedAt).toLocaleDateString()}</span>
                                  <span className={`text-xs font-bold px-2 py-1 rounded ${pres.status === 'dispensed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{pres.status.toUpperCase()}</span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2"><span className="font-semibold">Dr.</span> {pres.doctorRef?.userRef?.name}</p>
                                <p className="text-sm text-slate-600 mb-3"><span className="font-semibold">Diagnosis:</span> {pres.diagnosis || 'N/A'}</p>
                                <ul className="list-disc pl-5 text-sm text-slate-700">
                                  {pres.medicines.map((m, i) => (
                                    <li key={i}>{m.name} - {m.dosage} ({m.frequency}) for {m.duration} days</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Lab Tests Section */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-accent pl-3">Lab Tests History</h3>
                        {selectedHistory.labTests.length === 0 ? <p className="text-sm text-slate-500 italic">No lab tests found.</p> : (
                          <div className="space-y-4">
                            {selectedHistory.labTests.map(test => (
                              <div key={test._id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-bold text-slate-800">{test.testType}</span>
                                  <span className={`text-xs font-bold px-2 py-1 rounded ${test.status === 'uploaded' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{test.status.toUpperCase()}</span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">Requested on: {new Date(test.requestedAt).toLocaleDateString()}</p>
                                {test.status === 'uploaded' && (
                                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
                                    {test.reportNotes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl h-full flex items-center justify-center min-h-[400px]">
                    <p className="text-slate-400">Select a patient from the list to view history.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* OP Card Printable Area & Modal */}
        <AnimatePresence>
          {showOpCard && opCardData && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm print:static print:bg-white print:block print:inset-auto"
            >
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative print:shadow-none print:p-0 print:max-w-none print:w-full"
              >
                {/* Print Styles */}
                <style>
                  {`
                    @media print {
                      body * { visibility: hidden; }
                      .print-area, .print-area * { visibility: visible; }
                      .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    }
                  `}
                </style>

                <button 
                  onClick={() => setShowOpCard(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 print:hidden"
                >
                  <FaTimes size={20} />
                </button>

                <div className="print-area">
                  <div className="text-center mb-6 border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-display font-bold text-slate-800">MediCore Hospital</h2>
                    <p className="text-sm text-slate-500">Outpatient Registration Card</p>
                  </div>

                  <div className="space-y-4 text-slate-700">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Token Number</p>
                        <p className="text-4xl font-mono font-bold text-primary">{opCardData.token.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Date & Time</p>
                        <p className="text-sm font-medium">{opCardData.date}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Patient Name</p>
                        <p className="font-semibold text-slate-800">{opCardData.patient.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Patient ID</p>
                        <p className="font-semibold text-slate-800">{opCardData.patient.patientId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Age / Gender</p>
                        <p className="font-semibold text-slate-800">
                          {new Date().getFullYear() - new Date(opCardData.patient.dob).getFullYear()} Yrs / {opCardData.patient.gender}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Phone</p>
                        <p className="font-semibold text-slate-800">{opCardData.patient.phone}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500 uppercase">Consulting Doctor</p>
                      <p className="font-bold text-lg text-slate-800">Dr. {opCardData.doctor?.userRef?.name}</p>
                      <p className="text-sm text-slate-600">{opCardData.doctor?.specialization}</p>
                      <p className="text-sm font-medium mt-1">Floor: {opCardData.doctor?.floorNumber} | Room: {opCardData.doctor?.roomNumber}</p>
                    </div>
                  </div>

                  <div className="mt-8 text-center print:hidden">
                    <button 
                      onClick={handlePrint}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
                    >
                      <FaPrint /> Print OP Card
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default ReceptionDashboard;
