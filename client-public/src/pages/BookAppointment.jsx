import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaClock, FaCheckCircle } from 'react-icons/fa';

const doctorsList = [
  { name: 'Dr. Sarah Jenkins', specialty: 'Chief of Cardiology' },
  { name: 'Dr. Michael Chen', specialty: 'Orthopedic Surgeon' },
  { name: 'Dr. Emily Carter', specialty: 'Pediatric Specialist' },
  { name: 'Dr. James Wilson', specialty: 'Neurologist' },
  { name: 'Dr. Anna Smith', specialty: 'Dermatologist' },
  { name: 'Dr. Robert Davis', specialty: 'General Surgery' }
];

const BookAppointment = () => {
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    department: '',
    doctorName: '',
    date: '',
    timeSlot: '',
    symptoms: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const doctor = params.get('doctor');
    const dept = params.get('dept');
    
    if (doctor || dept) {
      setFormData(prev => ({
        ...prev,
        doctorName: doctor || '',
        department: dept || ''
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'doctorName' && value) {
      const selectedDoc = doctorsList.find(d => d.name === value);
      if (selectedDoc) {
        setFormData(prev => ({ ...prev, doctorName: value, department: selectedDoc.specialty }));
        return;
      }
    }
    
    if (name === 'department' && value) {
      // If department is changed and current doctor doesn't match new department, clear doctor
      const currentDoc = doctorsList.find(d => d.name === formData.doctorName);
      if (currentDoc && currentDoc.specialty !== value) {
        setFormData(prev => ({ ...prev, department: value, doctorName: '' }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          patientName: '',
          phone: '',
          department: '',
          doctorName: '',
          date: '',
          timeSlot: '',
          symptoms: ''
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to submit appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Book an Appointment</h1>
          <p className="text-slate-600 text-lg">Schedule your visit with our expert doctors.</p>
        </div>

        {submitted ? (
          <div className="bg-success/10 border border-success/30 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <FaCheckCircle />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Sent Successfully!</h2>
            <p className="text-slate-600 mb-8">Our front desk will contact you shortly to confirm your appointment time.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-primary/30"
            >
              Book Another
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="bg-slate-900 p-8 text-white md:col-span-1">
                <h3 className="text-xl font-bold mb-6">Why Choose Us?</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0 text-primary">
                      <FaUserMd />
                    </div>
                    <div>
                      <p className="font-bold mb-1">Top Specialists</p>
                      <p className="text-slate-400 text-sm">Highly trained medical experts.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0 text-primary">
                      <FaClock />
                    </div>
                    <div>
                      <p className="font-bold mb-1">24/7 Availability</p>
                      <p className="text-slate-400 text-sm">Round the clock care and emergency.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0 text-primary">
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <p className="font-bold mb-1">Flexible Timings</p>
                      <p className="text-slate-400 text-sm">Choose slots that fit your schedule.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-8 md:p-12 md:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Patient Name *</label>
                      <input name="patientName" value={formData.patientName} onChange={handleChange} required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="+91 9999999999" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Department (Optional)</label>
                      <select name="department" value={formData.department} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none">
                        <option value="">Any Department</option>
                        {[...new Set(doctorsList.map(d => d.specialty))].map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Doctor Name (Optional)</label>
                      <select name="doctorName" value={formData.doctorName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none">
                        <option value="">Any Doctor</option>
                        {doctorsList
                          .filter(doc => !formData.department || doc.specialty === formData.department)
                          .map(doc => (
                            <option key={doc.name} value={doc.name}>{doc.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date *</label>
                      <input name="date" value={formData.date} onChange={handleChange} required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Available Time Slot *</label>
                      <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none">
                        <option value="">Select Time</option>
                        <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                        <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                        <option value="11:30 AM">11:30 AM - 12:30 PM</option>
                        <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                        <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                        <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Any previous medical history / Symptoms?</label>
                    <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none" placeholder="Briefly describe your symptoms..."></textarea>
                  </div>

                  <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-primary/30 w-full">
                    Submit Appointment Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
