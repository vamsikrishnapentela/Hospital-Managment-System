import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPills, FaCheckCircle, FaPrint, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const API_BASE = 'https://hospital-managment-system-tsa1.onrender.com/api';

const Sidebar = () => (
  <aside className="w-64 bg-white border-r border-slate-200 fixed h-screen z-10 print:hidden">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <FaPills />
        </div>
        <div>
          <span className="font-display font-bold text-xl text-primary tracking-tight block leading-none">
            MediCore
          </span>
          <span className="text-xs text-slate-500 font-medium">Pharmacy</span>
        </div>
      </div>
    </div>
  </aside>
);

const PharmacyDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrescription, setActivePrescription] = useState(null);
  const [totalCost, setTotalCost] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
    const newSocket = io('https://hospital-managment-system-tsa1.onrender.com');
    setSocket(newSocket);
    
    newSocket.on('queue-updated', () => {
      fetchPrescriptions();
    });

    return () => newSocket.disconnect();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pharmacy/pending`);
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (p) => {
    setActivePrescription(p);
    setTotalCost('');
  };

  const handleDispense = async (e) => {
    e.preventDefault();
    if (!activePrescription || !totalCost) return;

    try {
      await axios.post(`${API_BASE}/pharmacy/dispense`, {
        prescriptionId: activePrescription._id
      });
      toast.success('Prescription marked as dispensed.');
      setShowInvoice(true); // show invoice to print
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      toast.error('Failed to dispense');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const closeInvoice = () => {
    setShowInvoice(false);
    setActivePrescription(null);
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    p.patientRef?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.patientRef?.patientId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-surface min-h-screen text-slate-700">
      <Sidebar />

      <main className="ml-64 flex-1 p-8 print:p-0 print:ml-0 print:bg-white">
        <div className="print:hidden">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-800">Pharmacy Station</h1>
              <p className="text-slate-500">Manage prescriptions, generate invoices, and dispense medication.</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Patient Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <svg className="absolute left-3 top-3 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-6 h-[700px]">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex-1 overflow-y-auto">
                <h3 className="font-bold text-slate-700 mb-4 px-2">Pending Prescriptions</h3>
                <div className="space-y-3">
                  {filteredPrescriptions.filter(p => p.status !== 'dispensed').length === 0 ? (
                    <p className="text-slate-500 text-sm px-2 text-center mt-10">No pending prescriptions.</p>
                  ) : (
                    filteredPrescriptions.filter(p => p.status !== 'dispensed').map(p => (
                      <motion.div
                        key={p._id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSelect(p)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                          activePrescription?._id === p._id 
                          ? 'bg-primary/5 border-primary shadow-md shadow-primary/10' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <h4 className="font-bold text-slate-800">{p.patientRef?.name}</h4>
                        <p className="text-sm font-medium text-slate-600 mt-1">{p.medicines.length} Medicines</p>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          Dr. {p.doctorRef?.userRef?.name}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex-1 overflow-y-auto">
                <h3 className="font-bold text-slate-700 mb-4 px-2">Dispensed</h3>
                <div className="space-y-3 opacity-80">
                  {filteredPrescriptions.filter(p => p.status === 'dispensed').length === 0 ? (
                    <p className="text-slate-500 text-sm px-2 text-center mt-6">No dispensed prescriptions.</p>
                  ) : (
                    filteredPrescriptions.filter(p => p.status === 'dispensed').map(p => (
                      <motion.div
                        key={p._id}
                        onClick={() => handleSelect(p)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                          activePrescription?._id === p._id 
                          ? 'bg-primary/5 border-primary shadow-sm' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="absolute top-0 right-0 bg-success text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">DISPENSED</div>
                        <h4 className="font-bold text-slate-800">{p.patientRef?.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          Dr. {p.doctorRef?.userRef?.name}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right - View & Invoice */}
            <div className="lg:col-span-2">
              {activePrescription && !showInvoice ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
                >
                  <div className="mb-8 pb-6 border-b border-slate-200">
                    <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Patient: {activePrescription.patientRef?.name}</h2>
                    <div className="flex gap-4 text-sm text-slate-500 font-mono mt-1">
                      <span>Doctor: Dr. {activePrescription.doctorRef?.userRef?.name}</span>
                      <span>Date: {new Date(activePrescription.issuedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Prescribed Medicines</h3>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 text-sm font-bold text-slate-600">Medicine</th>
                            <th className="px-4 py-3 text-sm font-bold text-slate-600">Dosage</th>
                            <th className="px-4 py-3 text-sm font-bold text-slate-600">Frequency</th>
                            <th className="px-4 py-3 text-sm font-bold text-slate-600">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {activePrescription.medicines.map((med, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">{med.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{med.dosage}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{med.frequency}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{med.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {activePrescription.diagnosis && (
                       <div className="mt-4 text-sm text-slate-600">
                         <strong>Diagnosis/Notes: </strong> {activePrescription.diagnosis}
                       </div>
                    )}
                  </div>

                  {activePrescription.status === 'dispensed' ? (
                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                      <p className="text-lg font-bold text-success mb-4">Prescription Dispensed</p>
                      <button onClick={() => setShowInvoice(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold transition-all">View / Print Invoice Again</button>
                    </div>
                  ) : (
                    <form onSubmit={handleDispense} className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-end gap-6 mt-6">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Total Invoice Amount ($)</label>
                        <input 
                          type="number" 
                          value={totalCost}
                          onChange={(e) => setTotalCost(e.target.value)}
                          required
                          min="0"
                          step="0.01"
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary transition-colors text-lg font-bold"
                          placeholder="e.g. 45.00"
                        />
                      </div>
                      <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/30 h-[52px]">
                        Dispense & Generate Invoice
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : !showInvoice ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl h-full min-h-[500px] flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <FaPills className="text-6xl mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a prescription to dispense</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Invoice Modal for Printing */}
        <AnimatePresence>
          {showInvoice && activePrescription && (
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
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative print:shadow-none print:p-0 print:max-w-none print:w-full"
              >
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
                  onClick={closeInvoice}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 print:hidden"
                >
                  <FaTimes size={20} />
                </button>

                <div className="print-area">
                  <div className="text-center mb-8 border-b border-slate-200 pb-6">
                    <h2 className="text-3xl font-display font-bold text-slate-800">MediCore Pharmacy</h2>
                    <p className="text-slate-500 mt-1">Official Medical Invoice</p>
                    <p className="text-sm text-slate-400 mt-2">Date: {new Date().toLocaleString()}</p>
                  </div>

                  <div className="flex justify-between mb-8 text-sm">
                    <div>
                      <p className="text-slate-500 uppercase tracking-wider text-xs mb-1">Patient Details</p>
                      <p className="font-bold text-slate-800 text-lg">{activePrescription.patientRef?.name}</p>
                      <p className="text-slate-600">ID: {activePrescription.patientRef?.patientId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 uppercase tracking-wider text-xs mb-1">Prescribed By</p>
                      <p className="font-bold text-slate-800 text-lg">Dr. {activePrescription.doctorRef?.userRef?.name}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-800">
                          <th className="py-2 text-sm font-bold text-slate-800">Item / Medicine</th>
                          <th className="py-2 text-sm font-bold text-slate-800">Dosage</th>
                          <th className="py-2 text-sm font-bold text-slate-800 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {activePrescription.medicines.map((med, idx) => (
                          <tr key={idx}>
                            <td className="py-3 text-sm font-medium text-slate-800">{med.name}</td>
                            <td className="py-3 text-sm text-slate-600">{med.dosage}</td>
                            <td className="py-3 text-sm text-slate-600 text-right">-</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-800">
                          <td colSpan="2" className="py-4 text-right font-bold text-slate-800">Total Amount:</td>
                          <td className="py-4 text-right font-bold text-2xl text-primary">${parseFloat(totalCost).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="text-center text-sm text-slate-500 mt-12 border-t border-slate-200 pt-6">
                    <p>Thank you for choosing MediCore Hospital.</p>
                    <p>Get well soon!</p>
                  </div>

                  <div className="mt-8 text-center print:hidden">
                    <button 
                      onClick={handlePrint}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
                    >
                      <FaPrint /> Print Invoice
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

export default PharmacyDashboard;
