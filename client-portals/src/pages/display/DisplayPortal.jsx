import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const DisplayPortal = () => {
  const [nowCallingList, setNowCallingList] = useState([]);
  const [queue, setQueue] = useState([]);
  const [time, setTime] = useState(new Date());

  const playBell = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.5);
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.log('Audio not supported', e);
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reception/queue`);
      // Only show those waiting for doctor or recently called
      const displayTokens = res.data.filter(t => t.status === 'waiting-for-doctor');
      setQueue(displayTokens);

      setNowCallingList(prev => {
        return prev.filter(calling => {
          const currentInDb = res.data.find(t => t._id === calling._id);
          return currentInDb && currentInDb.status !== 'done';
        });
      });
    } catch (err) {
      console.error('Failed to fetch queue', err);
    }
  };

  useEffect(() => {
    fetchQueue();
    // Clock
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Socket
    const socket = io('http://localhost:5000');
    
    socket.on('call-token', (tokenData) => {
      setNowCallingList(prev => {
        if (prev.find(t => t._id === tokenData._id)) return prev;
        return [tokenData, ...prev].slice(0, 3);
      });
      
      // Play Bell
      playBell();
      
      // Text-to-speech announcement (delayed slightly so bell plays first)
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          const announcement = new SpeechSynthesisUtterance(
            `Token number ${tokenData.code}, patient ${tokenData.patientRef?.name}, please proceed to Room ${tokenData.roomNumber}`
          );
          announcement.rate = 0.9;
          window.speechSynthesis.speak(announcement);
        }
      }, 1000);

      fetchQueue(); // refresh queue
    });

    socket.on('queue-updated', () => {
      fetchQueue();
    });

    socket.on('new-token-generated', () => {
      fetchQueue();
    });

    return () => {
      clearInterval(timer);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen bg-slate-50 text-slate-900 overflow-hidden flex flex-col font-body">
      {/* Top Bar */}
      <header className="h-20 bg-white border-b border-slate-200 flex justify-between items-center px-10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M436 96h-68.5c-4.4-31-31-56-63.5-56h-160c-32.5 0-59.1 25-63.5 56H12c-6.6 0-12 5.4-12 12v32c0 6.6 5.4 12 12 12h32v256H12c-6.6 0-12 5.4-12 12v32c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12v-32c0-6.6-5.4-12-12-12h-32V152h32c6.6 0 12-5.4 12-12v-32c0-6.6-5.4-12-12-12z"></path></svg>
          </div>
          <span className="font-display font-bold text-3xl tracking-tight">MediCore Hospital</span>
        </div>
        <div className="text-4xl font-mono font-light tracking-wider text-slate-700">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Now Calling */}
        <div className="w-1/2 bg-slate-50 p-10 flex flex-col justify-center items-center relative border-r border-slate-200/50">
          <h2 className="text-3xl font-display text-slate-500 mb-12 tracking-widest uppercase">Now Calling</h2>
          
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute -inset-8 rounded-full border-4 border-success/30 animate-ping"></div>
            
            <AnimatePresence mode="popLayout">
              {nowCallingList.length > 0 ? (
                <div className="flex flex-col gap-6 relative z-10 w-[28rem]">
                  {nowCallingList.map((calling, idx) => (
                    <motion.div
                      key={calling.code}
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className={`bg-white border p-8 rounded-3xl flex flex-col items-center shadow-lg ${idx === 0 ? 'border-success shadow-success/20' : 'border-slate-200 opacity-80 scale-95'}`}
                    >
                      <span className={`${idx === 0 ? 'text-[6rem]' : 'text-[4rem]'} font-display font-bold text-success leading-none mb-4`}>
                        {calling.code}
                      </span>
                      <div className="text-center w-full space-y-2">
                        <p className="text-3xl font-bold text-slate-900 truncate">{calling.patientRef?.name}</p>
                        <p className="text-xl text-slate-500 truncate">Dr. {calling.doctorRef?.userRef?.name}</p>
                        <div className="flex justify-center gap-4 text-xl text-slate-700 font-mono bg-slate-50 py-3 px-4 rounded-xl border border-slate-200 mt-2">
                          <span>Floor {calling.floorNumber}</span>
                          <span className="text-slate-600">|</span>
                          <span className="text-accent">Room {calling.roomNumber}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-3xl text-slate-600 font-display">Waiting for next token...</div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel: Queue List */}
        <div className="w-1/2 bg-white p-10 flex flex-col">
          <h2 className="text-3xl font-display text-slate-500 mb-8 tracking-widest uppercase">Up Next</h2>
          
          <div className="flex-1 overflow-hidden overflow-y-auto">
            <div className="space-y-4">
              {queue.length === 0 ? (
                <div className="text-slate-500 text-xl text-center mt-10">No tokens in queue.</div>
              ) : (
                queue.map((q, idx) => (
                  <motion.div 
                    key={q._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-4xl font-display font-bold text-slate-700">{q.code}</span>
                      <div>
                        <p className="text-xl font-bold text-slate-900">{q.patientRef?.name}</p>
                        <p className="text-slate-500">Dr. {q.doctorRef?.userRef?.name}</p>
                      </div>
                    </div>
                    <div className="text-right font-mono bg-white px-4 py-2 rounded-lg border border-slate-200">
                      <div className="text-lg text-slate-700">Floor {q.floorNumber}</div>
                      <div className="text-lg text-accent">Room {q.roomNumber}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="h-16 bg-primary overflow-hidden flex items-center">
        <motion.div 
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="whitespace-nowrap text-xl font-bold text-slate-900 tracking-wide"
        >
          Welcome to MediCore Hospital — Please proceed to the indicated room when your token is called. Maintain silence in the waiting area.
        </motion.div>
      </div>
    </div>
  );
};

export default DisplayPortal;
