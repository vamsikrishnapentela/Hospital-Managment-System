import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserInjured, FaClipboardList, FaFileMedical, FaVial, FaStethoscope, FaSignOutAlt } from 'react-icons/fa';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = 'https://hospital-managment-system-tsa1.onrender.com/api';

const DoctorDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const [queue, setQueue] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'labs'
  const [labReports, setLabReports] = useState([]);

  // Form states
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '1-0-1', duration: '' }]);
  const [labTests, setLabTests] = useState([]);
  
  const commonLabTests = [
    'Complete Blood Count (CBC)', 'Basic Metabolic Panel (BMP)', 'Comprehensive Metabolic Panel (CMP)',
    'Lipid Panel', 'Liver Panel', 'Urinalysis', 'Hemoglobin A1C', 'Thyroid Stimulating Hormone (TSH)',
    'Vitamin D', 'Iron Panel', 'X-Ray (Chest)', 'MRI (Brain)', 'ECG/EKG'
  ];

  useEffect(() => {
    fetchDoctors();
    const newSocket = io('https://hospital-managment-system-tsa1.onrender.com');
    setSocket(newSocket);

    newSocket.on('queue-updated', () => {
      if (selectedDoctor) {
        fetchQueue(selectedDoctor._id);
      }
    });

    return () => newSocket.disconnect();
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedDoctor) {
      fetchQueue(selectedDoctor._id);
      fetchLabReports(selectedDoctor._id);
    }
  }, [selectedDoctor]);

  const fetchLabReports = async (docId) => {
    try {
      const res = await axios.get(`${API_BASE}/doctor/labs/${docId}`);
      setLabReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };



  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/doctor/list`);
      setDoctors(res.data);
      if (res.data.length > 0) {
        // Do not auto-select. Let user choose from grid.
        // setSelectedDoctor(res.data[0]); 
      }
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    }
  };

  const fetchQueue = async (doctorId) => {
    try {
      const res = await axios.get(`${API_BASE}/doctor/queue/${doctorId}`);
      setQueue(res.data);
    } catch (err) {
      console.error('Failed to fetch queue', err);
    }
  };

  const handleCallPatient = async () => {
    if (!activePatient) return;
    try {
      const res = await axios.post(`${API_BASE}/doctor/call-token`, { tokenId: activePatient._id });
      toast.success(`Called token ${res.data.code}`);
      
      // Emit to socket for TV display
      if (socket) {
        socket.emit('call-token', res.data); // sending token data to TV
      }
      
      fetchQueue(selectedDoctor._id);
    } catch (err) {
      console.error(err);
      toast.error('Failed to call patient');
    }
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '1-0-1', duration: '' }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleToggleLabTest = (test) => {
    if (labTests.includes(test)) {
      setLabTests(labTests.filter(t => t !== test));
    } else {
      setLabTests([...labTests, test]);
    }
  };

  const handleCompleteConsultation = async () => {
    if (!activePatient) return;
    try {
      // Filter out empty medicines
      const validMedicines = medicines.filter(m => m.name.trim() !== '');

      await axios.post(`${API_BASE}/doctor/complete-consultation`, {
        tokenId: activePatient._id,
        diagnosis,
        medicines: validMedicines,
        labTests
      });

      toast.success('Consultation completed successfully');
      
      if (socket) {
        socket.emit('queue-updated'); // Notify pharmacy/lab/reception
      }

      // Reset
      setActivePatient(null);
      setDiagnosis('');
      setMedicines([{ name: '', dosage: '', frequency: '1-0-1', duration: '' }]);
      setLabTests([]);
      fetchQueue(selectedDoctor._id);

    } catch (err) {
      console.error(err);
      toast.error('Failed to save consultation');
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen text-slate-700">
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 relative md:fixed h-auto md:h-screen z-10 print:hidden shrink-0 flex flex-col md:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <FaStethoscope />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-slate-900 tracking-tight block leading-none">
                Ramu Hospital
              </span>
              <span className="text-xs text-slate-500 font-medium">Doctor Portal</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Active Doctor</label>
            {selectedDoctor ? (
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-slate-800">Dr. {selectedDoctor.userRef?.name}</div>
                  <div className="text-xs text-slate-500">{selectedDoctor.specialization}</div>
                </div>
                <button onClick={() => setSelectedDoctor(null)} className="text-xs text-primary hover:underline">Change</button>
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">Please select a doctor from the main panel.</div>
            )}
          </div>

          {selectedDoctor && (
            <nav className="space-y-2 mt-4">
              <button 
                onClick={() => setActiveTab('queue')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'queue' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <FaUserInjured /> My Queue
              </button>
              <button 
                onClick={() => setActiveTab('labs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'labs' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <FaVial /> Lab Reports
              </button>
            </nav>
          )}
        </div>
      </aside>

      {selectedDoctor ? (
        activeTab === 'queue' ? (
      <main className="md:ml-64 flex-1 p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Left Column - Queue */}
        <div className="w-1/3 flex flex-col gap-6">
          <h1 className="text-2xl font-display font-bold text-slate-900">Today's Queue</h1>

          <div className="flex flex-col gap-4">
            {queue.length === 0 ? (
              <div className="text-center p-6 bg-white rounded-2xl border border-slate-200 text-slate-500">
                No patients in queue.
              </div>
            ) : (
              queue.map((token) => (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  key={token._id}
                  onClick={() => setActivePatient(token)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${activePatient?._id === token._id
                    ? 'bg-slate-100 border-primary shadow-lg shadow-primary/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">#{token.code}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{token.patientRef?.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-xs font-medium">
                    <span className={`px-2 py-1 rounded border ${
                      token.status === 'done' ? 'bg-slate-200 text-slate-500 border-slate-300' :
                      token.status === 'called' ? 'bg-success/20 text-success border-success/30' :
                      token.status === 'waiting-for-doctor' ? 'bg-warning/20 text-warning border-warning/30' :
                      'bg-primary/20 text-primary border-primary/30'
                    }`}>
                      {token.status.replace(/-/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Active Consultation */}
        <div className="w-2/3">
          {activePatient ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{activePatient.patientRef?.name}</h2>
                  <div className="flex gap-4 text-sm text-slate-500 font-mono">
                    <span>Token: #{activePatient.code}</span>
                    <span>Gender: {activePatient.patientRef?.gender}</span>
                    <span>Phone: {activePatient.patientRef?.phone}</span>
                  </div>
                </div>
                {activePatient.status !== 'done' && (
                  <button 
                    onClick={handleCallPatient}
                    className="bg-success hover:bg-success/90 text-white shadow-lg shadow-success/30 px-6 py-2 rounded-lg font-bold transition-all"
                  >
                    Call Patient on TV
                  </button>
                )}
              </div>

              {/* Vitals */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Vitals (From Nurse)</h3>
                <div className="flex gap-4">
                  <div className="bg-slate-100 p-4 rounded-xl flex-1 border border-slate-300">
                    <div className="text-xs text-slate-500 mb-1">Temperature</div>
                    <div className="text-xl font-bold text-slate-900">{activePatient.vitals?.temperature || 'N/A'}</div>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-xl flex-1 border border-slate-300">
                    <div className="text-xs text-slate-500 mb-1">Blood Pressure</div>
                    <div className="text-xl font-bold text-slate-900">{activePatient.vitals?.bloodPressure || 'N/A'}</div>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-xl flex-1 border border-slate-300">
                    <div className="text-xs text-slate-500 mb-1">Heart Rate</div>
                    <div className="text-xl font-bold text-slate-900">{activePatient.vitals?.heartRate || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Prescription Form */}
              <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <FaFileMedical className="text-primary text-xl" />
                  <h3 className="text-lg font-bold text-slate-900">Write Prescription & Labs</h3>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">Diagnosis / Notes</label>
                    <textarea 
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-primary transition-colors" 
                      rows="3" 
                      placeholder="Enter diagnosis..."
                    ></textarea>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Medicines</label>
                      <button type="button" onClick={handleAddMedicine} className="text-xs text-primary font-bold hover:underline">+ Add Medicine</button>
                    </div>

                    {medicines.map((med, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input type="text" placeholder="Medicine Name" value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} className="flex-2 bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-primary" />
                        <input type="text" placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-primary" />
                        <select value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)} className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-primary">
                          <option value="1-0-1">1-0-1</option>
                          <option value="1-1-1">1-1-1</option>
                          <option value="0-0-1">0-0-1</option>
                          <option value="1-0-0">1-0-0</option>
                        </select>
                        <input type="text" placeholder="Days" value={med.duration} onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)} className="w-20 bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-primary" />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-2">Request Lab Tests</label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {commonLabTests.map(test => (
                        <label key={test} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${labTests.includes(test) ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={labTests.includes(test)} 
                            onChange={() => handleToggleLabTest(test)} 
                          />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${labTests.includes(test) ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                            {labTests.includes(test) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span className="text-xs">{test}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                    <div>
                      {activePatient.status === 'done' && (
                        <p className="text-sm font-bold text-success">Consultation already marked done.</p>
                      )}
                    </div>
                    <button 
                      onClick={handleCompleteConsultation}
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all"
                    >
                      {activePatient.status === 'done' ? 'Add More Prescriptions/Labs & Update' : 'Complete Consultation & Save'}
                    </button>
                  </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl">
              <div className="text-center text-slate-500">
                <FaUserInjured className="text-5xl mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a patient from the queue to start consultation</p>
              </div>
            </div>
          )}
        </div>
      </main>
        ) : (
      <main className="md:ml-64 flex-1 p-4 md:p-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-full">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Patient Lab Reports</h2>
          {labReports.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No lab reports requested or available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {labReports.map(report => (
                <div key={report._id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
                  {report.status === 'uploaded' && <span className="absolute top-0 right-0 bg-success text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">RESULTS UPLOADED</span>}
                  {report.status === 'pending' && <span className="absolute top-0 right-0 bg-warning text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">PENDING LAB</span>}
                  
                  <h3 className="font-bold text-lg text-slate-800">{report.patientRef?.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{report.testType}</p>
                  
                  <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl min-h-[100px] whitespace-pre-wrap text-sm text-slate-700">
                    {report.status === 'uploaded' ? report.reportNotes : 'Waiting for laboratory to upload results...'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
        )
      ) : (
      <main className="md:ml-64 flex-1 p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-800">Doctor Portal</h1>
          <p className="text-slate-500">Select a doctor to view their queue and manage consultations.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map(doc => (
            <motion.div
              key={doc._id}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                setSelectedDoctor(doc);
                setActivePatient(null);
              }}
              className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-lg hover:border-primary transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-600">
                  {doc.userRef?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Dr. {doc.userRef?.name}</h3>
                  <p className="text-sm font-medium text-primary">{doc.specialization}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
                <span>Floor {doc.floorNumber}</span>
                <span>Room {doc.roomNumber}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      )}
    </div>
  );
};

export default DoctorDashboard;
