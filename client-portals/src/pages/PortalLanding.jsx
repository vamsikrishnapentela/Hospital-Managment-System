import { Link } from 'react-router-dom';
import { FaUserMd, FaUserNurse, FaProcedures, FaVial, FaPills, FaTv, FaUserShield } from 'react-icons/fa';

const PortalLanding = () => {
  const portals = [
    { title: 'Patient Portal', path: '/patient', icon: FaProcedures, color: 'text-primary', bg: 'bg-primary/10', desc: 'Access reports, prescriptions & appointments.' },
    { title: 'Doctor Dashboard', path: '/doctor', icon: FaUserMd, color: 'text-secondary', bg: 'bg-secondary/10', desc: 'Manage patients, schedule & consultations.' },
    { title: 'Reception/Front Desk', path: '/reception', icon: FaUserShield, color: 'text-accent', bg: 'bg-accent/10', desc: 'Manage queues, billing & admissions.' },
    { title: 'Nurse Station', path: '/nurse', icon: FaUserNurse, color: 'text-pink-500', bg: 'bg-pink-500/10', desc: 'Vitals tracking & ward management.' },
    { title: 'Laboratory', path: '/lab', icon: FaVial, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Update test results and manage samples.' },
    { title: 'Pharmacy', path: '/pharmacy', icon: FaPills, color: 'text-green-500', bg: 'bg-green-500/10', desc: 'Manage inventory & dispense medicines.' },
    { title: 'Hospital Admin', path: '/admin', icon: FaUserShield, color: 'text-slate-700', bg: 'bg-slate-700/10', desc: 'System overview, staff & reports.' },
    { title: 'TV Display', path: '/display', icon: FaTv, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Live waiting queue for waiting areas.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Select Portal System</h1>
          <p className="text-lg text-slate-600 mb-6">Choose the appropriate dashboard for your role.</p>
          <Link to="/how-it-works">
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/30 transition-all">
              See How It Works
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal, idx) => (
            <Link 
              to={portal.path} 
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-200/50 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 transition-all group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${portal.bg} ${portal.color} group-hover:scale-110 transition-transform`}>
                <portal.icon />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{portal.title}</h3>
              <p className="text-sm text-slate-500">{portal.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalLanding;




