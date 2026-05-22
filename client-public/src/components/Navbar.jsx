import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStethoscope, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            
            <a href="https://hospital-managment-system-five.vercel.app" className="text-slate-600 hover:text-primary font-medium transition-colors">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 focus:outline-none">
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              <Link to="/doctors" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-primary transition-colors">Doctors</Link>
              <Link to="/services" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-primary transition-colors">Services</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-primary transition-colors">Contact</Link>
              <a href="https://hospital-managment-system-five.vercel.app" className="text-slate-600 font-medium hover:text-primary transition-colors">Portals</a>
              <div id="google_translate_element_mobile" className="py-2"></div>
              <Link to="/book-appointment" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-secondary text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all">
                  Book Appointment
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
