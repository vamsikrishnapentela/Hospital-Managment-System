import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaVial, FaUpload, FaSearch, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const API_BASE = 'https://hospital-managment-system-tsa1.onrender.com/api';

const Sidebar = () => (
  <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 relative md:fixed h-auto md:h-screen z-10 print:hidden shrink-0 flex flex-col md:block">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <FaVial />
        </div>
        <div>
          <span className="font-display font-bold text-xl text-primary tracking-tight block leading-none">
            Ramu Hospital
          </span>
          <span className="text-xs text-slate-500 font-medium">Lab Portal</span>
        </div>
      </div>

      <nav className="space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-colors">
          <FaUpload /> Pending Tests
        </button>
      </nav>
    </div>
  </aside>
);

const LabDashboard = () => {
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTest, setActiveTest] = useState(null);
  const [reportNotes, setReportNotes] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchTests();
    const newSocket = io('https://hospital-managment-system-tsa1.onrender.com');
    setSocket(newSocket);
    
    newSocket.on('queue-updated', () => {
      fetchTests();
    });

    return () => newSocket.disconnect();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/lab/pending`);
      setTests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectTest = (test) => {
    setActiveTest(test);
    setReportNotes('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!activeTest || !reportNotes.trim()) return;

    try {
      await axios.post(`${API_BASE}/lab/upload`, {
        testId: activeTest._id,
        reportNotes
      });
      toast.success('Test results uploaded successfully.');
      setActiveTest(null);
      fetchTests();
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload results');
    }
  };

  const filteredTests = tests.filter(t => 
    t.patientRef?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.testType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row bg-surface min-h-screen text-slate-700">
      <Sidebar />

      <main className="md:ml-64 flex-1 p-4 md:p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-800">Laboratory Station</h1>
            <p className="text-slate-500">Manage and upload patient test results.</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Patient or Test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <svg className="absolute left-3 top-3 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Pending Tests */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-h-[500px] overflow-y-auto">
            <h3 className="font-bold text-slate-700 mb-4 px-2">Lab Queue</h3>
            <div className="space-y-3">
              {filteredTests.length === 0 ? (
                <p className="text-slate-500 text-sm px-2 text-center mt-10">No lab tests found.</p>
              ) : (
                filteredTests.map(test => (
                  <motion.div
                    key={test._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleSelectTest(test)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                      activeTest?._id === test._id 
                      ? 'bg-primary/5 border-primary shadow-md shadow-primary/10' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {test.status === 'uploaded' && <div className="absolute top-0 right-0 bg-success text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">COMPLETED</div>}
                    <h4 className="font-bold text-slate-800">{test.patientRef?.name}</h4>
                    <p className="text-sm font-medium text-slate-600 mt-1">{test.testType}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      Req by: Dr. {test.doctorRef?.userRef?.name}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right - Upload Results */}
          <div className="lg:col-span-2">
            {activeTest ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
              >
                <div className="mb-8 pb-6 border-b border-slate-200">
                  <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Test: {activeTest.testType}</h2>
                  <div className="flex gap-4 text-sm text-slate-500 font-mono mt-1">
                    <span>Patient: {activeTest.patientRef?.name}</span>
                    <span>Requested by: Dr. {activeTest.doctorRef?.userRef?.name}</span>
                  </div>
                </div>

                {activeTest.status === 'uploaded' ? (
                  <div className="mt-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Test Results</label>
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[200px] text-slate-800 whitespace-pre-wrap">
                      {activeTest.reportNotes}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                      <p className="text-lg font-bold text-success mb-4">Results Submitted Successfully</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpload}>
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Enter Test Results / Notes</label>
                      <textarea 
                        value={reportNotes}
                        onChange={(e) => setReportNotes(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[200px] focus:outline-none focus:border-primary transition-colors"
                        placeholder="Enter the detailed results of the test here..."
                      ></textarea>
                    </div>
                    
                    <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="text-sm text-primary flex items-center gap-2">
                        <FaUpload /> File upload is currently disabled. Please enter text results above.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center gap-2">
                        <FaCheckCircle /> Submit Results
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl h-full min-h-[500px] flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <FaVial className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a pending test to upload results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LabDashboard;
