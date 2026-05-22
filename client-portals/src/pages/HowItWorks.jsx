import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUserNurse, FaTv, FaUserMd, FaVial, FaPills, FaHome, FaPlay } from 'react-icons/fa';

const HowItWorks = () => {
  const [playKey, setPlayKey] = useState(0);
  const steps = [
    { icon: FaUserPlus, title: 'Reception', desc: 'Patient registers & gets token', color: 'bg-blue-500', x: 150, y: 150 },
    { icon: FaUserNurse, title: 'Nurse Station', desc: 'Vitals are recorded', color: 'bg-pink-500', x: 500, y: 150 },
    { icon: FaTv, title: 'Waiting Area', desc: 'Live TV queue calls patient', color: 'bg-orange-500', x: 850, y: 150 },
    { icon: FaUserMd, title: 'Doctor', desc: 'Consultation & Prescription', color: 'bg-primary', x: 850, y: 350 },
    { icon: FaVial, title: 'Laboratory', desc: 'Tests & results uploaded', color: 'bg-purple-500', x: 500, y: 350 },
    { icon: FaPills, title: 'Pharmacy', desc: 'Medicines dispensed', color: 'bg-success', x: 150, y: 350 }
  ];

  // SVG Path for the S-Curve connecting the points
  const pathD = "M 150 150 L 850 150 C 1000 150, 1000 350, 850 350 L 150 350";

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-body overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Patient Journey</h1>
            <p className="text-lg text-slate-600">A clear visualization of the flow through Ramu Hospital.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/">
              <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-primary text-slate-700 px-6 py-3 rounded-xl font-bold transition-all shadow-sm">
                <FaHome /> Back to Portals
              </button>
            </Link>
            <button 
              onClick={() => setPlayKey(prev => prev + 1)}
              className="hidden lg:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/30"
            >
              <FaPlay /> Replay Animation
            </button>
          </div>
        </div>

        {/* Desktop SVG Roadmap */}
        <div key={playKey} className="hidden lg:block relative w-full max-w-5xl mx-auto mt-10">
          <svg viewBox="0 0 1000 500" className="w-full h-auto drop-shadow-xl">
            {/* Background Path */}
            <path d={pathD} fill="none" stroke="#e2e8f0" strokeWidth="24" strokeLinecap="round" />
            
            {/* Animated Path (Fill) */}
            <motion.path 
              d={pathD} 
              fill="none" 
              stroke="#2563eb" 
              strokeWidth="24" 
              strokeLinecap="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0, 0.205, 0.205, 0.41, 0.41, 0.59, 0.59, 0.795, 0.795, 1, 1] }}
              transition={{ 
                duration: 20, 
                times: [0, 0.10, 0.18, 0.28, 0.36, 0.46, 0.54, 0.64, 0.72, 0.82, 0.90, 1],
                ease: "easeInOut",
                repeat: 0
              }}
              className="drop-shadow-lg opacity-30"
            />

            {/* Animated Patient Dot */}
            <motion.circle
              r="20"
              fill="#2563eb"
              className="drop-shadow-2xl"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: ["0%", "0%", "20.5%", "20.5%", "41%", "41%", "59%", "59%", "79.5%", "79.5%", "100%", "100%"] }}
              style={{ offsetPath: `path('${pathD}')` }}
              transition={{ 
                duration: 20, 
                times: [0, 0.10, 0.18, 0.28, 0.36, 0.46, 0.54, 0.64, 0.72, 0.82, 0.90, 1],
                ease: "easeInOut",
                repeat: 0
              }}
            />

            {/* Nodes */}
            {steps.map((step, idx) => (
              <g key={idx}>
                {/* Node Circle */}
                <motion.circle 
                  cx={step.x} 
                  cy={step.y} 
                  r="40" 
                  fill="white" 
                  stroke="#2563eb" 
                  strokeWidth="6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.8, type: 'spring' }}
                />
                
                {/* Logo inside circle using foreignObject */}
                <foreignObject x={step.x - 24} y={step.y - 24} width="48" height="48">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.8, type: 'spring' }}
                    className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white text-xl shadow-inner`}
                  >
                    <step.icon />
                  </motion.div>
                </foreignObject>

                {/* Text Group */}
                <motion.g
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx * 0.8) + 0.3 }}
                >
                  <text 
                    x={step.x} 
                    y={idx < 3 ? step.y - 65 : step.y + 75} 
                    textAnchor="middle" 
                    className="text-2xl font-display font-bold fill-slate-800"
                  >
                    {step.title}
                  </text>
                  <text 
                    x={step.x} 
                    y={idx < 3 ? step.y - 45 : step.y + 95} 
                    textAnchor="middle" 
                    className="text-lg fill-slate-500"
                  >
                    {step.desc}
                  </text>
                </motion.g>
              </g>
            ))}
          </svg>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden mt-12 relative pl-8">
          <div className="absolute left-12 top-0 bottom-0 w-1.5 bg-slate-200 rounded-full"></div>
          
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-16 pr-4"
              >
                <div className={`absolute left-0 top-0 w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-white text-2xl shadow-xl z-10 ring-4 ring-white`}>
                  <step.icon />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-2">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{idx + 1}. {step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;
