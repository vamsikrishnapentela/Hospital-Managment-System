import { motion } from 'framer-motion';
import { 
  FaUserMd, FaUsers, FaHospitalAlt, FaRegCalendarCheck, FaPhoneAlt, FaVideo, 
  FaMapMarkerAlt, FaClock, FaHeartbeat, FaBone, FaBaby, FaAmbulance, 
  FaShieldAlt, FaStar, FaCheckCircle, FaStethoscope, FaCalendarCheck 
} from 'react-icons/fa';

const StatCard = ({ icon: Icon, number, label, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4"
  >
    <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-2xl">
      <Icon />
    </div>
    <div>
      <h4 className="text-3xl font-display font-bold text-slate-800">{number}</h4>
      <p className="text-slate-500 font-medium">{label}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Jenkins',
      specialty: 'Chief of Cardiology',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
      rating: '4.9',
      exp: '15+ Years'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Orthopedic Surgeon',
      img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
      rating: '4.8',
      exp: '12+ Years'
    },
    {
      id: 3,
      name: 'Dr. Emily Carter',
      specialty: 'Pediatric Specialist',
      img: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: '5.0',
      exp: '10+ Years'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Neurologist',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      rating: '4.9',
      exp: '20+ Years'
    }
  ];

  const services = [
    { icon: FaHeartbeat, title: 'Cardiology', desc: 'Advanced heart care, ECG, and surgical interventions.' },
    { icon: FaBone, title: 'Orthopedics', desc: 'Joint replacements, sports injuries, and spine care.' },
    { icon: FaBaby, title: 'Pediatrics', desc: 'Comprehensive care for infants, children, and teens.' },
    { icon: FaAmbulance, title: 'Emergency', desc: '24/7 trauma and emergency response unit.' },
  ];

  return (
    <div className="min-h-screen bg-surface font-body overflow-x-hidden pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface to-slate-100 py-20 lg:py-32">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-warning font-semibold mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-warning"></span>
                </span>
                24/7 Emergency Service
              </div>
              
              <h1 className="text-5xl lg:text-7xl leading-tight mb-6 text-slate-900 font-display font-bold">
                Your Health, <br />
                Our Priority.
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                Experience world-class healthcare with state-of-the-art facilities, expert doctors, and a commitment to your well-being.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/book-appointment">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-4 w-full sm:w-auto rounded-full font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                  >
                    <FaCalendarCheck /> Book Appointment
                  </motion.button>
                </a>
                <a href="/services">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-4 w-full sm:w-auto rounded-full font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-3"
                  >
                    Explore Services
                  </motion.button>
                </a>
              </div>
            </motion.div>
            
            {/* Right side Illustration/Image area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative bg-primary/5">
                <img 
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80" 
                  alt="Modern Hospital Facility" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4 hidden sm:flex"
              >
                <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center text-xl">
                  <FaHospitalAlt />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">Top Rated</div>
                  <div className="text-slate-500 text-sm font-medium">Hospital in City</div>
                </div>
              </motion.div>
            </motion.div>
            
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 relative z-20">
            <StatCard icon={FaUserMd} number="15+" label="Expert Doctors" delay={0.1} />
            <StatCard icon={FaUsers} number="10k+" label="Happy Patients" delay={0.2} />
            <StatCard icon={FaHospitalAlt} number="10+" label="Departments" delay={0.3} />
            <StatCard icon={FaRegCalendarCheck} number="15+" label="Years Experience" delay={0.4} />
          </div>
        </div>
      </section>

      {/* Quick Utility Section */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <FaMapMarkerAlt className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Find a Location</h3>
              <p className="text-slate-500 text-sm mb-3">Discover our clinics and hospitals near you.</p>
              <a href="/contact" className="text-primary font-bold text-sm hover:underline">View Map & Directions &rarr;</a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors border-x md:border-x-slate-100 border-transparent">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary shrink-0">
              <FaClock className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Visiting Hours</h3>
              <p className="text-slate-500 text-sm mb-3">General Ward: 10 AM - 8 PM<br/>ICU: Strict guidelines apply.</p>
              <a href="/contact" className="text-secondary font-bold text-sm hover:underline">Read Guidelines &rarr;</a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0">
              <FaStethoscope className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Patient Portal</h3>
              <p className="text-slate-500 text-sm mb-3">Access lab results, prescriptions, and billing.</p>
              <a href="https://hospital-managment-system-five.vercel.app/patient" className="text-accent font-bold text-sm hover:underline">Login Now &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Core Specialties</h2>
            <p className="text-slate-600 text-lg">We provide world-class medical treatments across a wide range of specialized departments.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 text-center group transition-all"
              >
                <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center text-primary text-4xl mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <service.icon />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-slate-500 mb-6">{service.desc}</p>
                <button className="text-primary font-bold hover:underline">Learn more &rarr;</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Directory Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Meet Our Specialists</h2>
              <p className="text-slate-600 text-lg">Highly qualified professionals dedicated to providing the best medical care.</p>
            </div>
            <button className="mt-6 md:mt-0 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-full font-bold transition-colors">
              View All Doctors
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doc, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 group"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <FaStar className="text-warning" /> {doc.rating}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-primary text-sm font-bold mb-1 uppercase tracking-wider">{doc.specialty}</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{doc.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{doc.exp}</span>
                    <a href={`/book-appointment?doctor=${encodeURIComponent(doc.name)}&dept=${encodeURIComponent(doc.specialty)}`}>
                      <button className="text-primary hover:text-primary/80 font-bold underline">Book</button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance & Compliance */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-display font-bold mb-4">We Accept Major Insurances</h2>
            <p className="text-slate-400 mb-8">We partner with top health insurance providers to ensure you get the care you need without financial stress. Verify your coverage easily through our portal.</p>
            <div className="flex flex-wrap gap-4 opacity-70 grayscale">
              {/* Placeholder logos for insurances */}
              <div className="text-2xl font-bold font-display px-4 py-2 border border-slate-700 rounded-lg">BlueCross</div>
              <div className="text-2xl font-bold font-display px-4 py-2 border border-slate-700 rounded-lg">Aetna</div>
              <div className="text-2xl font-bold font-display px-4 py-2 border border-slate-700 rounded-lg">Cigna</div>
              <div className="text-2xl font-bold font-display px-4 py-2 border border-slate-700 rounded-lg">Medicare</div>
            </div>
          </div>
          <div className="md:w-1/2 bg-slate-800 p-8 rounded-3xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaShieldAlt className="text-success" /> Commitment to Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your health data is protected. We employ end-to-end encryption (SSL) across all portals. We are fully HIPAA compliant, ensuring strict confidentiality and security for all patient records and telehealth consultations.
            </p>
            <button className="bg-primary/20 hover:bg-primary/30 text-primary px-6 py-2 rounded-full font-bold text-sm transition-colors border border-primary/30">
              Read Privacy Policy
            </button>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="bg-slate-50 border-t border-slate-100">
        <div className="w-full h-[400px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3833.4684538595093!2d80.1646101!3d16.09305!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a63b65bc0f6d5%3A0xcdf4ab1d3c90e8ce!2sRAMU%20HOSPITALS%2C%20CHILAKALURIPET!5e0!3m2!1sen!2sin!4v1779354923042!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6 text-white">
              <FaStethoscope className="text-primary text-2xl" />
              <span className="font-display font-bold text-2xl tracking-tight">Ramu Hospital</span>
            </div>
            <p className="text-sm mb-6">Delivering unparalleled healthcare services with compassion, innovation, and expertise.</p>
            <div className="text-sm">
              &copy; 2026 Ramu Hospital.<br/>All rights reserved.
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/doctors" className="hover:text-primary transition-colors">Find a Doctor</a></li>
              <li><a href="/book-appointment" className="hover:text-primary transition-colors">Book Appointment</a></li>
              <li><a href="https://hospital-managment-system-five.vercel.app/patient" className="hover:text-primary transition-colors">Patient Portal</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Emergency Services</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Departments</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/services" className="hover:text-primary transition-colors">Cardiology</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Neurology</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Orthopedics</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Pediatrics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-primary shrink-0" />
                <span>NRT Center, Opposite ITC, Pasumarru,<br/>Chilakaluripeta-522616, Andhra Pradesh</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary shrink-0" />
                <span>+91 9999999999</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
