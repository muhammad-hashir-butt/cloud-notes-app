import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await signup(email, password); navigate('/'); } 
    catch (err) { alert("Signup error: " + err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-50 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg mb-4"><UserPlus size={28} /></div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Get Started</h2>
          <p className="text-sm text-slate-400 font-medium text-center">Create a free account and start writing</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password (Min 6 chars)" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">Create Account</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500 font-medium">Have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
};
export default Signup;
