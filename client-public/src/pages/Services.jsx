import { FaHeartbeat, FaBone, FaBaby, FaAmbulance, FaBrain, FaTooth, FaEye, FaLungs } from 'react-icons/fa';

const Services = () => {
  const services = [
    { icon: FaHeartbeat, title: 'Cardiology', desc: 'Advanced heart care, ECG, and surgical interventions.' },
    { icon: FaBone, title: 'Orthopedics', desc: 'Joint replacements, sports injuries, and spine care.' },
    { icon: FaBaby, title: 'Pediatrics', desc: 'Comprehensive care for infants, children, and teens.' },
    { icon: FaAmbulance, title: 'Emergency', desc: '24/7 trauma and emergency response unit.' },
    { icon: FaBrain, title: 'Neurology', desc: 'Treatment for disorders of the brain, spinal cord, and nerves.' },
    { icon: FaTooth, title: 'Dentistry', desc: 'Complete dental care from check-ups to oral surgery.' },
    { icon: FaEye, title: 'Ophthalmology', desc: 'Vision care, cataract surgery, and eye health.' },
    { icon: FaLungs, title: 'Pulmonology', desc: 'Expert care for respiratory and lung conditions.' },
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-display font-bold text-slate-900 mb-6">Our Services & Specialties</h1>
          <p className="text-lg text-slate-600">
            We provide world-class medical treatments across a wide range of specialized departments, equipped with the latest technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 text-center hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center text-primary text-4xl mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <service.icon />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
              <p className="text-slate-500 mb-6">{service.desc}</p>
              <button className="text-primary font-bold hover:underline">Learn more &rarr;</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
