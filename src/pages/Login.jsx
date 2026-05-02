import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { StickyNote, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await login(email, password); navigate('/'); } 
    catch (err) { alert("Login failed! Try again."); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-50 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg mb-4"><StickyNote size={28} /></div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 font-medium">Your notes, stored in the cloud</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative"><span className="absolute left-4 top-4 text-slate-300"><Mail size={18}/></span>
          <input type="email" placeholder="Email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" onChange={e => setEmail(e.target.value)} required /></div>
          <div className="relative"><span className="absolute left-4 top-4 text-slate-300"><Lock size={18}/></span>
          <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" onChange={e => setPassword(e.target.value)} required /></div>
          <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">Sign In</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500 font-medium">New account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create now</Link></p>
      </div>
    </div>
  );
};
export default Login;
