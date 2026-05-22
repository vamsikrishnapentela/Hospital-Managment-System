import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaSearch, FaClipboardCheck, FaSignOutAlt, FaUserMd } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';

const Sidebar = () => (
  <aside className="w-64 bg-white border-r border-slate-200 fixed h-screen z-10 transition-colors">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <FaHeartbeat />
        </div>
        <div>
          <span className="font-display font-bold text-xl text-primary tracking-tight block leading-none">
            MediCore
          </span>
          <span className="text-xs text-slate-500 font-medium">Nurse Portal</span>
        </div>
      </div>

      <nav className="space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-colors">
          <FaClipboardCheck /> Vitals Update
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

const NurseDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingPatients, setPendingPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [socket, setSocket] = useState(null);

  const [vitals, setVitals] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    weight: '',
    height: '',
    notes: ''
  });

  const fetchPending = async () => {
    try {
      const res = await axios.get(`${API_BASE}/nurse/pending`);
      setPendingPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    newSocket.on('new-token-generated', () => {
      fetchPending();
    });

    return () => newSocket.disconnect();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await axios.get(`${API_BASE}/nurse/search?query=${searchQuery}`);
      setSearchResults(res.data);
      if (res.data.length === 0) {
        toast.error('No patients found waiting for nurse matching that query.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to search patients');
    }
  };

  const handleSelectPatient = (token) => {
    setActivePatient(token);
    setVitals({
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      weight: '',
      height: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  const handleSubmitVitals = async (e) => {
    e.preventDefault();
    if (!activePatient) return;

    try {
      await axios.post(`${API_BASE}/nurse/vitals`, {
        tokenId: activePatient._id,
        vitals
      });
      
      toast.success('Vitals updated successfully. Patient moved to Doctor queue.');
      
      if (socket) {
        socket.emit('queue-updated');
      }

      setActivePatient(null);
      setSearchResults(searchResults.filter(t => t._id !== activePatient._id));
      setSearchQuery('');
      fetchPending();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update vitals');
    }
  };

  return (
    <div className="flex bg-surface min-h-screen text-slate-700">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-800">Nurse Station</h1>
          <p className="text-slate-500">Update patient vitals before they meet the doctor.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Search & List */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search by Name or Token No."
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <button type="submit" className="hidden">Search</button>
            </form>

            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-h-[300px]">
                <h3 className="font-bold text-slate-700 mb-4 px-2">Pending Patients</h3>
                <div className="space-y-3">
                  {(searchQuery ? searchResults : pendingPatients).filter(t => t.status === 'waiting-for-nurse').length === 0 ? (
                    <p className="text-slate-500 text-sm px-2 text-center mt-10">No patients waiting for nurse.</p>
                  ) : (
                    (searchQuery ? searchResults : pendingPatients).filter(t => t.status === 'waiting-for-nurse').map(token => (
                      <motion.div
                        key={token._id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSelectPatient(token)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          activePatient?._id === token._id 
                          ? 'bg-primary/5 border-primary shadow-md shadow-primary/10' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">#{token.code}</span>
                            <h4 className="font-bold text-slate-800 mt-2">{token.patientRef?.name}</h4>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          <FaUserMd /> Dr. {token.doctorRef?.userRef?.name}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-h-[250px]">
                <h3 className="font-bold text-slate-700 mb-4 px-2">Completed Vitals</h3>
                <div className="space-y-3 opacity-70">
                  {(searchQuery ? searchResults : pendingPatients).filter(t => t.status !== 'waiting-for-nurse').length === 0 ? (
                    <p className="text-slate-500 text-sm px-2 text-center mt-6">No completed patients yet.</p>
                  ) : (
                    (searchQuery ? searchResults : pendingPatients).filter(t => t.status !== 'waiting-for-nurse').map(token => (
                      <motion.div
                        key={token._id}
                        onClick={() => handleSelectPatient(token)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          activePatient?._id === token._id 
                          ? 'bg-primary/5 border-primary shadow-sm' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">#{token.code}</span>
                            <h4 className="font-bold text-slate-800">{token.patientRef?.name}</h4>
                          </div>
                          <span className="bg-success text-white text-[10px] font-bold px-2 py-1 rounded">COMPLETED</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Vitals Form */}
          <div className="lg:col-span-2">
            {activePatient ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-400">
                    {activePatient.patientRef?.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-slate-800">{activePatient.patientRef?.name}</h2>
                    <div className="flex gap-4 text-sm text-slate-500 font-mono mt-1">
                      <span>Token: #{activePatient.code}</span>
                      <span>Gender: {activePatient.patientRef?.gender}</span>
                      <span>DOB: {new Date(activePatient.patientRef?.dob).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitVitals}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Temperature (°F)</label>
                      <input type="text" name="temperature" value={vitals.temperature} onChange={handleInputChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="98.6" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blood Pressure</label>
                      <input type="text" name="bloodPressure" value={vitals.bloodPressure} onChange={handleInputChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="120/80" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Heart Rate (BPM)</label>
                      <input type="text" name="heartRate" value={vitals.heartRate} onChange={handleInputChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="72" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Weight (kg)</label>
                      <input type="text" name="weight" value={vitals.weight} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="70" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Height (cm)</label>
                      <input type="text" name="height" value={vitals.height} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="175" />
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Additional Notes / Symptoms</label>
                    <textarea name="notes" value={vitals.notes} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-colors" rows="3" placeholder="Any notes from preliminary check..."></textarea>
                  </div>

                  <div className="flex justify-end gap-4">
                    {activePatient.status === 'waiting-for-nurse' ? (
                      <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center gap-2">
                        <FaClipboardCheck /> Save & Send to Doctor
                      </button>
                    ) : (
                      <div className="text-center pt-4">
                        <p className="text-success font-bold">Vitals updated successfully.</p>
                      </div>
                    )}
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl h-full min-h-[500px] flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <FaHeartbeat className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a patient to update vitals</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default NurseDashboard;
