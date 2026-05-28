"use client";

import React, { useState } from 'react';
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import axios from 'axios';
import toast from 'react-hot-toast';

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    appointmentDate: '',
    timeSlot: 'Morning (8:00 AM - 12:00 PM)',
    moveSize: 'Studio Apartment',
    movingFrom: '',
    movingTo: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/quotes/submit', {
        full_name: formData.fullName,
        email: formData.email,
        mobile: formData.phone,
        move_type: formData.moveSize,
        pickup_address: formData.movingFrom,
        dropoff_address: formData.movingTo,
        moving_date: formData.appointmentDate,
        comments: `Time slot: ${formData.timeSlot}\nNotes: ${formData.notes}`
      });
      
      toast.success('Appointment requested successfully!');
      
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        appointmentDate: '',
        timeSlot: 'Morning (8:00 AM - 12:00 PM)',
        moveSize: 'Studio Apartment',
        movingFrom: '',
        movingTo: '',
        notes: ''
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="bg-white min-h-screen py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-50/40 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">Online Scheduling</span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">Schedule Your Moving Date</h1>
            <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
            <p className="text-base text-gray-500 font-medium leading-relaxed">Secure your premium relocations crew. Choose your preferred day and time slot, and our logistics manager will verify availability within 15 minutes.</p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                  <input id="fullName" required placeholder="e.g. John Doe" className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800" type="text" value={formData.fullName} name="fullName" onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone Number</label>
                  <input id="phone" required placeholder="e.g. (306) 450-0708" className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800" type="tel" value={formData.phone} name="phone" onChange={handleChange} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                  <input id="email" required placeholder="e.g. john@example.com" className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800" type="email" value={formData.email} name="email" onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="appointmentDate" className="text-xs font-bold uppercase tracking-wider text-gray-400">Preferred Moving Date</label>
                  <input id="appointmentDate" required className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800" type="date" value={formData.appointmentDate} name="appointmentDate" onChange={handleChange} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="timeSlot" className="text-xs font-bold uppercase tracking-wider text-gray-400">Preferred Time Window</label>
                  <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock absolute left-4 h-4.5 w-4.5 text-gray-400 pointer-events-none">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <select id="timeSlot" name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 pl-12 pr-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800 appearance-none cursor-pointer">
                      <option>Morning (8:00 AM - 12:00 PM)</option>
                      <option>Afternoon (12:00 PM - 4:00 PM)</option>
                      <option>Evening (4:00 PM - 8:00 PM)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="moveSize" className="text-xs font-bold uppercase tracking-wider text-gray-400">Estimated Size of Move</label>
                  <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-box absolute left-4 h-4.5 w-4.5 text-gray-400 pointer-events-none">
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                      <path d="m3.3 7 8.7 5 8.7-5"></path>
                      <path d="M12 22V12"></path>
                    </svg>
                    <select id="moveSize" name="moveSize" value={formData.moveSize} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 pl-12 pr-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800 appearance-none cursor-pointer">
                      <option>Studio Apartment</option>
                      <option>1 Bedroom Home</option>
                      <option>2 Bedroom Home</option>
                      <option>3 Bedroom Home</option>
                      <option>4+ Bedroom Home</option>
                      <option>Office / Commercial Move</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="movingFrom" className="text-xs font-bold uppercase tracking-wider text-gray-400">Moving From</label>
                  <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin absolute left-4 h-4.5 w-4.5 text-gray-400 pointer-events-none">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <input id="movingFrom" required placeholder="e.g. Regina, SK" className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 pl-12 pr-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800" type="text" value={formData.movingFrom} name="movingFrom" onChange={handleChange} />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="movingTo" className="text-xs font-bold uppercase tracking-wider text-gray-400">Moving To</label>
                  <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin absolute left-4 h-4.5 w-4.5 text-gray-400 pointer-events-none">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <input id="movingTo" required placeholder="e.g. Calgary, AB" className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 pl-12 pr-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800" type="text" value={formData.movingTo} name="movingTo" onChange={handleChange} />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-gray-400">Special Notes / Inventory Items</label>
                <textarea id="notes" name="notes" placeholder="List any delicate cargo (e.g. piano, marble tables) or packing services needed..." rows={4} className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white text-sm py-3 px-4 rounded-xl focus:outline-none transition-all font-semibold text-gray-800 resize-none" value={formData.notes} onChange={handleChange}></textarea>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-red-600/20 active:translate-y-0 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer text-base">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send h-5 w-5 mr-2.5">
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                  <path d="m21.854 2.147-10.94 10.939"></path>
                </svg>
                <span>{loading ? 'Submitting...' : 'Confirm Moving Appointment'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
