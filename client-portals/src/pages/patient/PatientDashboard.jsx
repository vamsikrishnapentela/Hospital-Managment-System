import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCalendarCheck, FaFilePrescription, FaNotesMedical, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => (
  <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 relative md:fixed h-auto md:h-screen z-10 print:hidden shrink-0 flex flex-col md:block">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <FaUser />
        </div>
        <div>
          <span className="font-display font-bold text-xl text-slate-900 tracking-tight block leading-none">
            Ramu Hospital
          </span>
          <span className="text-xs text-slate-500 font-medium">Patient Portal</span>
        </div>
      </div>

      <div className="mb-8 px-4 py-3 bg-slate-100 rounded-xl border border-slate-300 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-900">
          JD
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">John Doe</div>
          <div className="text-xs text-slate-500">ID: P-2026-0042</div>
        </div>
      </div>

      <nav className="space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/20 text-primary rounded-lg font-medium transition-colors border border-primary/30">
          <FaCalendarCheck /> Appointments
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium transition-colors">
          <FaFilePrescription /> Prescriptions
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium transition-colors">
          <FaNotesMedical /> Test Reports
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

const PatientDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen text-slate-700">
      <Sidebar />

      <main className="md:ml-64 flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">My Appointments</h1>
              <p className="text-slate-500">Manage your upcoming visits and booking history.</p>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              <FaCalendarCheck /> Book New Appointment
            </button>
          </header>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl mb-8">
            <h2 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning animate-pulse inline-block"></span> Upcoming
            </h2>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-white border border-slate-200 p-4 rounded-xl text-center min-w-[100px]">
                  <div className="text-sm font-bold text-primary uppercase">May</div>
                  <div className="text-3xl font-display font-bold text-slate-900">25</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Consultation with Dr. Smith</h3>
                  <p className="text-slate-500">Cardiology Department</p>
                  <p className="text-sm text-slate-500 mt-2 font-mono">10:30 AM • Floor 2, Room 204</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-700 text-slate-900 rounded-lg font-medium transition-colors">
                  Reschedule
                </button>
                <button className="px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg font-medium transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm overflow-x-auto">
            <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Past Visits</h2>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left min-w-max">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Date</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Doctor</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Diagnosis</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr className="hover:bg-slate-100/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-700">April 10, 2026</td>
                    <td className="px-6 py-4 font-bold text-slate-900">Dr. Adams</td>
                    <td className="px-6 py-4 text-slate-500">Migraine</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline text-sm font-bold flex items-center gap-2 justify-end">
                        <FaFilePrescription /> View Prescription
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;




