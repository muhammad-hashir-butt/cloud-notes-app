import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, query, onSnapshot, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Plus, Trash2, StickyNote, LogOut, Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'General' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    const q = query(collection(db, `users/${user.uid}/notes`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user.uid]);

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    await addDoc(collection(db, `users/${user.uid}/notes`), {
      ...newNote,
      createdAt: serverTimestamp()
    });
    setNewNote({ title: '', content: '', category: 'General' });
  };

  // Search aur Filter logic
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'All' || note.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100"><StickyNote size={20}/></div>
          <h1 className="text-xl font-bold text-slate-800">CloudNotes</h1>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-bold">Logout</button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Form */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-50">
            <h2 className="text-lg font-bold mb-6 text-slate-700 flex items-center gap-2">Create Note</h2>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <input type="text" placeholder="Title" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} required />
              <textarea placeholder="Write something..." className="w-full p-4 bg-slate-50 border-none rounded-2xl h-32 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} required />
              <select className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none text-sm font-bold text-slate-600" value={newNote.category} onChange={e => setNewNote({...newNote, category: e.target.value})}>
                <option>General</option>
                <option>Work</option>
                <option>Personal</option>
                <option>Idea</option>
              </select>
              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Save Note</button>
            </form>
          </div>
        </div>

        {/* Right: Notes List with Search & Filter */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <input type="text" placeholder="Search notes..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none font-bold text-slate-500 text-sm" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Idea">Idea</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotes.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">No notes found matching your search...</div>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-lg flex flex-col justify-between hover:shadow-indigo-50 transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{note.category}</span>
                      <button onClick={() => deleteDoc(doc(db, `users/${user.uid}/notes`, note.id))} className="text-slate-200 hover:text-rose-500"><Trash2 size={18}/></button>
                    </div>
                    <h3 className="font-bold text-xl text-slate-800 mb-2">{note.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{note.content}</p>
                  </div>
                  <p className="mt-4 text-[10px] text-slate-300 font-bold uppercase">{note.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
