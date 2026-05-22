import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-5xl font-display font-bold text-slate-900 mb-6">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            We're here to help. Reach out to us for appointments, inquiries, or emergency assistance. Our team is available 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 text-xl">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Emergency 24/7</p>
                    <p className="text-lg font-bold text-slate-900">+91 9999999999</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 text-xl">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Email Us</p>
                    <p className="text-lg font-bold text-slate-900">contact@ramuhospital.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 text-xl">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Location</p>
                    <p className="text-lg font-bold text-slate-900 leading-tight">NRT Center, Opposite ITC, Pasumarru,<br/>Chilakaluripeta-522616, Andhra Pradesh</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 text-xl">
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Visiting Hours</p>
                    <p className="text-lg font-bold text-slate-900 leading-tight">General: 10AM - 8PM<br/>ICU: 4PM - 6PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea rows="5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <button type="button" className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-primary/30 w-full md:w-auto">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="mt-12 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 h-[400px]">
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

      </div>
    </div>
  );
};

export default Contact;
