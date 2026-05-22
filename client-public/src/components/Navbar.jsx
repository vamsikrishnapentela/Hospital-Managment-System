import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStethoscope } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-surface/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <FaStethoscope className="text-xl" />
            </div>
            <span className="font-display font-bold text-2xl text-primary tracking-tight">
              Ramu <span className="text-secondary">Hospital</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/doctors" className="text-slate-600 hover:text-primary font-medium transition-colors">Doctors</Link>
            <Link to="/services" className="text-slate-600 hover:text-primary font-medium transition-colors">Services</Link>
            <Link to="/contact" className="text-slate-600 hover:text-primary font-medium transition-colors">Contact</Link>
            
            <a href="http://localhost:5174" className="text-slate-600 hover:text-primary font-medium transition-colors">
              Portals
            </a>

            <div id="google_translate_element" className="mt-2"></div>
            <Link to="/book-appointment">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-secondary/30 transition-all"
              >
                Book Appointment
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
