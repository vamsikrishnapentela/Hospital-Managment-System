import { FaStar } from 'react-icons/fa';

const Doctors = () => {
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
    },
    {
      id: 5,
      name: 'Dr. Anna Smith',
      specialty: 'Dermatologist',
      img: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: '4.7',
      exp: '8+ Years'
    },
    {
      id: 6,
      name: 'Dr. Robert Davis',
      specialty: 'General Surgery',
      img: 'https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: '4.8',
      exp: '18+ Years'
    }
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-5xl font-display font-bold text-slate-900 mb-6">Our Specialists</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Find the right doctor for your medical needs. Our team of highly qualified professionals is here to provide you with the best possible care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {doctors.map((doc, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-64 overflow-hidden relative bg-slate-100">
                <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
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
                    <button className="text-primary hover:text-primary/80 font-bold underline">Book Appointment</button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
