import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  PenTool, 
  Calendar as CalendarIcon, 
  BarChart2, 
  Settings, 
  Lock, 
  Edit3, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Download, 
  Check,
  Feather,
  Search,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Type,
  Palette,
  Smile,
  Highlighter,
  RotateCcw
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { MOTIVATIONAL_QUOTES, MOODS, WEATHERS, INITIAL_ENTRIES } from './constants';
import Particles from './Particles';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('today');
  
  // Toggle class on body to let Cursors-4U animated pencil take over on Write tab
  useEffect(() => {
    if (activeTab === 'write') {
      document.body.classList.add('write-mode-active');
    } else {
      document.body.classList.remove('write-mode-active');
    }
  }, [activeTab]);

  // Storage State
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('gunluk_entries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ENTRIES;
  });

  // UI States
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedEntryDetail, setSelectedEntryDetail] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Writing / Editing
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formMood, setFormMood] = useState(MOODS[0]); // 🖤 Melankolik
  const [formWeather, setFormWeather] = useState(WEATHERS[1].emoji); // 🌧️
  const [formIsPrivate, setFormIsPrivate] = useState(true);

  // Editor Formatting Tools State
  const editorRef = useRef(null);
  const [fontPx, setFontPx] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Mileast');
  const [textColor, setTextColor] = useState('#E2E8F0');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showPxDropdown, setShowPxDropdown] = useState(false);

  const FONT_OPTIONS = [
    { label: 'Mileast (Gotik)', value: 'Mileast' },
    { label: 'Georgia (Klasik)', value: 'Georgia, serif' },
    { label: 'Courier (Daktilo)', value: "'Courier New', monospace" },
    { label: 'Sans-Serif (Sade)', value: 'sans-serif' }
  ];

  const PX_OPTIONS = [
    { label: '14 px', value: '14px' },
    { label: '16 px (Normal)', value: '16px' },
    { label: '18 px', value: '18px' },
    { label: '20 px', value: '20px' },
    { label: '24 px (Büyük)', value: '24px' }
  ];

  const EMOJI_LIST = ['🖤', '🥀', '🌧️', '🕯️', '☕', '✨', '🌙', '💀', '🔮', '⚔️', '💔', '📜', '🔥', '🍷', '🩸', '🕸️', '🗡️', '⛓️'];

  // Mood-specific unique effects generator
  const handleMoodSelect = (mood, event) => {
    setFormMood(mood);

    let originX = 0.5;
    let originY = 0.5;
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = (rect.top + rect.height / 2) / window.innerHeight;
    }

    const emoji = mood.emoji;
    const label = mood.label.toLowerCase();

    if (emoji === '🖤' || label.includes('melankolik')) {
      const scalar = 2;
      const heart = confetti.shapeFromText({ text: '🖤', scalar });
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { x: originX, y: originY },
        shapes: [heart],
        gravity: 1.4,
        scalar
      });
    } else if (emoji === '🥀' || label.includes('solgun')) {
      const scalar = 2;
      const petal = confetti.shapeFromText({ text: '🥀', scalar });
      confetti({
        particleCount: 25,
        spread: 80,
        origin: { x: originX, y: originY },
        shapes: [petal],
        gravity: 0.9,
        drift: 0.15,
        scalar
      });
    } else if (emoji === '🌧️' || label.includes('kederli')) {
      const scalar = 2.2;
      const drop = confetti.shapeFromText({ text: '💧', scalar });
      confetti({
        particleCount: 40,
        spread: 30,
        origin: { x: originX, y: 0.1 },
        shapes: [drop],
        gravity: 2.8,
        drift: -0.1,
        scalar
      });
    } else if (emoji === '🕯️' || label.includes('karanlık')) {
      confetti({
        particleCount: 35,
        spread: 100,
        origin: { x: originX, y: originY },
        colors: ['#F97316', '#EF4444', '#F59E0B'],
        gravity: -0.4,
        drift: 0.05,
        ticks: 120
      });
    } else if (emoji === '☕' || label.includes('sakin')) {
      const scalar = 1.8;
      const steam = confetti.shapeFromText({ text: '💨', scalar });
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { x: originX, y: originY },
        shapes: [steam],
        gravity: -0.6,
        drift: 0.02,
        scalar
      });
    } else if (emoji === '🌙' || label.includes('derin')) {
      const scalar = 2;
      const moon = confetti.shapeFromText({ text: '🌙', scalar });
      const star = confetti.shapeFromText({ text: '⭐', scalar });
      confetti({
        particleCount: 25,
        spread: 90,
        origin: { x: originX, y: originY },
        shapes: [moon, star],
        gravity: 0.7,
        scalar
      });
    } else if (emoji === '✨' || label.includes('umutlu')) {
      confetti({
        particleCount: 45,
        spread: 120,
        origin: { x: originX, y: originY },
        colors: ['#FBBF24', '#F59E0B', '#FDE047', '#FFFFFF'],
        gravity: 0.8,
        ticks: 180
      });
    } else if (emoji === '🔥' || label.includes('coşkulu')) {
      const scalar = 2.2;
      const fire = confetti.shapeFromText({ text: '🔥', scalar });
      confetti({
        particleCount: 35,
        spread: 100,
        origin: { x: originX, y: originY },
        shapes: [fire],
        colors: ['#EF4444', '#DC2626'],
        gravity: 1.0,
        scalar
      });
    } else {
      confetti({
        particleCount: 25,
        spread: 70,
        origin: { x: originX, y: originY },
        colors: ['#A855F7', '#E2E8F0']
      });
    }
  };

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('gunluk_entries', JSON.stringify(entries));
  }, [entries]);

  // Sync editor innerHTML when editing or resetting
  useEffect(() => {
    if (editorRef.current && activeTab === 'write') {
      if (editorRef.current.innerHTML !== formContent) {
        editorRef.current.innerHTML = formContent;
      }
    }
  }, [formContent, activeTab]);

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Rotating quote
  const dailyQuote = useMemo(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }, []);

  // Live Word & Char Count
  const liveStats = useMemo(() => {
    const plainText = formContent.replace(/<[^>]*>/g, ' ').trim();
    const words = plainText ? plainText.split(/\s+/).length : 0;
    const chars = formContent.replace(/<[^>]*>/g, '').length;
    return { words, chars };
  }, [formContent]);

  // Exec Command formatting helper
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setFormContent(editorRef.current.innerHTML);
    }
  };

  const insertEmoji = (emoji) => {
    executeCommand('insertText', emoji);
    setShowEmojiPicker(false);
  };

  // Reset form
  const resetForm = () => {
    setEditingEntry(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    setFormTitle('');
    setFormContent('');
    setFormMood(MOODS[0]);
    setFormWeather(WEATHERS[1].emoji);
    setFormIsPrivate(true);
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  // Start editing existing entry
  const handleStartEdit = (entry) => {
    setEditingEntry(entry);
    setFormDate(entry.date);
    setFormTime(entry.time);
    setFormTitle(entry.title || '');
    setFormContent(entry.content || '');
    const m = MOODS.find(m => m.emoji === entry.mood) || MOODS[0];
    setFormMood(m);
    setFormWeather(entry.weather || WEATHERS[1].emoji);
    setFormIsPrivate(entry.isPrivate !== undefined ? entry.isPrivate : true);
    setSelectedEntryDetail(null);
    setActiveTab('write');
  };

  // Save Entry
  const handleSaveEntry = (e) => {
    e.preventDefault();
    const plainText = formContent.replace(/<[^>]*>/g, '').trim();
    if (!plainText) {
      showToast('Lütfen günlük içeriğini doldurun');
      return;
    }

    const newEntry = {
      id: editingEntry ? editingEntry.id : crypto.randomUUID(),
      date: formDate,
      time: formTime,
      title: formTitle.trim() || 'Adsız Anı',
      content: formContent,
      mood: formMood.emoji,
      moodLabel: formMood.label,
      weather: formWeather,
      isPrivate: formIsPrivate,
      wordCount: liveStats.words,
      createdAt: editingEntry ? editingEntry.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingEntry) {
      setEntries(prev => prev.map(item => item.id === editingEntry.id ? newEntry : item));
      showToast('Günlük güncellendi');
    } else {
      setEntries(prev => [newEntry, ...prev]);
      showToast('Anı kaydedildi');
    }

    resetForm();
    setActiveTab('today');
  };

  // Delete entry handling
  const confirmDeleteEntry = (entry) => {
    setEntryToDelete(entry);
    setShowDeleteModal(true);
  };

  const executeDelete = () => {
    if (!entryToDelete) return;
    setEntries(prev => prev.filter(item => item.id !== entryToDelete.id));
    if (selectedEntryDetail?.id === entryToDelete.id) {
      setSelectedEntryDetail(null);
    }
    setShowDeleteModal(false);
    setEntryToDelete(null);
    showToast('Anı silindi');
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
    
    const moodCounts = {};
    entries.forEach(e => {
      moodCounts[e.moodLabel] = (moodCounts[e.moodLabel] || 0) + 1;
    });
    const moodData = Object.keys(moodCounts).map(label => ({
      name: label,
      value: moodCounts[label],
      color: label.includes('Hüzünlü') ? '#E11D48' : label.includes('Melankolik') ? '#9333EA' : label.includes('Gizemli') ? '#A855F7' : '#52525B'
    }));

    return { totalEntries, totalWords, moodData };
  }, [entries]);

  // Export options
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gunluk_yedek_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('JSON indirildi');
  };

  const handleExportTXT = () => {
    let txtContent = "=== GÜNLÜK ANILARI ===\n\n";
    entries.forEach(e => {
      const plainText = e.content.replace(/<[^>]*>/g, '\n');
      txtContent += ` Tarih: ${e.date} ${e.time}\n Başlık: ${e.title}\n Ruh Hali: ${e.mood} (${e.moodLabel})\n İçerik:\n${plainText}\n\n-----------------------------------\n\n`;
    });
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(txtContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gunluk_anilar_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('TXT indirildi');
  };

  // Calendar View State
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(new Date());
  
  const calendarDays = useMemo(() => {
    const year = calendarSelectedDate.getFullYear();
    const month = calendarSelectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startingDay = firstDay.getDay() - 1;
    if (startingDay === -1) startingDay = 6;

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEntries = entries.filter(e => e.date === dateStr);
      days.push({ day: d, dateStr, entries: dayEntries });
    }
    return days;
  }, [calendarSelectedDate, entries]);

  const monthName = useMemo(() => {
    return calendarSelectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  }, [calendarSelectedDate]);

  const [filterDateStr, setFilterDateStr] = useState(null);

  const filteredEntries = useMemo(() => {
    let list = entries;
    if (filterDateStr) {
      list = list.filter(e => e.date === filterDateStr);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q));
    }
    return list;
  }, [entries, filterDateStr, searchQuery]);

  return (
    <div className="min-h-screen bg-black text-[#E2E8F0] font-serif antialiased flex flex-col xl:flex-row relative">
      
      {/* ReactBits Particles */}
      <Particles 
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleColors={['#ffffff']}
        moveParticlesOnHover={true}
        particleHoverFactor={1.5}
        alphaParticles={true}
        particleBaseSize={80}
        sizeRandomness={1}
        cameraDistance={20}
        disableRotation={false}
        pixelRatio={1}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-[#18181B] text-slate-200 border border-[#27272A] px-4 py-2 rounded-lg text-sm font-serif shadow-xl flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#121215] rounded-xl p-6 max-w-md w-full border border-[#27272A] text-center shadow-2xl">
            <h3 className="text-lg font-bold mb-2 text-slate-100 gothic-title">Anıyı Sil?</h3>
            <p className="text-sm text-slate-400 mb-6 font-serif">Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-lg bg-[#18181B] text-slate-300 font-serif border border-[#27272A] hover:bg-[#27272A]"
              >
                İptal
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 py-2 rounded-lg bg-red-950/80 text-red-200 font-serif border border-red-900/50 hover:bg-red-900"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full xl:w-64 bg-transparent border-b xl:border-b-0 xl:border-r border-[#27272A] p-6 flex flex-col justify-between shrink-0 z-10">
        <div>
          {/* Quick Write Button */}
          <button 
            onClick={() => { resetForm(); setActiveTab('write'); }}
            className="w-full mb-6 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-slate-100 py-2.5 px-4 rounded-lg font-bold text-sm gothic-title flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <Feather size={16} />
            <span>Yeni Anı Yaz</span>
          </button>

          {/* Nav Links */}
          <nav className="space-y-1">
            {[
              { id: 'today', label: 'Ana Sayfa', icon: BookOpen },
              { id: 'write', label: 'Yaz', icon: PenTool },
              { id: 'history', label: 'Geçmiş & Takvim', icon: CalendarIcon },
              { id: 'stats', label: 'İstatistikler', icon: BarChart2 },
              { id: 'settings', label: 'Ayarlar', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'write' && activeTab !== 'write') resetForm();
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left text-sm font-serif ${
                    isActive 
                      ? 'bg-[#18181B] text-slate-100 font-bold border border-[#27272A]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#141417]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-slate-200' : 'text-slate-500'} />
                  <span className="gothic-title">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 xl:p-8 max-w-6xl mx-auto w-full overflow-y-auto z-10">
        
        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-[#27272A]">
          <h2 className="text-xl font-bold tracking-wider gothic-title text-slate-100">
            {activeTab === 'today' && 'Günlük'}
            {activeTab === 'write' && (editingEntry ? 'Anıyı Düzenle' : 'Yeni Anı')}
            {activeTab === 'history' && 'Geçmiş & Takvim'}
            {activeTab === 'stats' && 'İstatistikler'}
            {activeTab === 'settings' && 'Ayarlar'}
          </h2>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input 
              type="text" 
              placeholder="Ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#121215] border border-[#27272A] rounded-lg pl-9 pr-4 py-1.5 text-sm font-serif text-slate-200 focus:outline-none focus:border-[#52525B]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X size={14} />
              </button>
            )}
          </div>
        </header>

        {/* TAB 1: ANA SAYFA */}
        {activeTab === 'today' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="gothic-card p-6 rounded-xl lg:col-span-2 space-y-2">
                <p className="text-xs text-slate-400 font-serif">
                  {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h3 className="text-lg font-bold gothic-title text-slate-200 leading-relaxed">"{dailyQuote}"</h3>
              </div>

              <div className="gothic-card p-6 rounded-xl flex items-center justify-around">
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-serif">Toplam Anı</span>
                  <h4 className="text-xl font-bold text-slate-200 gothic-title">{stats.totalEntries}</h4>
                </div>
                <div className="w-px h-8 bg-[#27272A]"></div>
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-serif">Kelime</span>
                  <h4 className="text-xl font-bold text-slate-200 gothic-title">{stats.totalWords}</h4>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base gothic-title text-slate-200">Son Anılar</h3>
                <button onClick={() => setActiveTab('history')} className="text-xs font-semibold text-slate-400 gothic-title hover:underline">Tümü →</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entries.slice(0, 4).map(entry => (
                  <div 
                    key={entry.id}
                    onClick={() => setSelectedEntryDetail(entry)}
                    className="gothic-card gothic-card-hover p-5 rounded-xl cursor-pointer space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-slate-400 font-serif border-b border-[#27272A]/50 pb-2">
                        <span className="flex items-center gap-1.5">{entry.date} • {entry.time}</span>
                        <span className="flex items-center gap-1 bg-[#18181B] px-2 py-0.5 rounded-md border border-[#27272A]">{entry.mood} {entry.moodLabel.split(' / ')[0]}</span>
                      </div>
                      <h4 className="font-bold text-base text-slate-100 gothic-title flex items-center gap-2 pt-1">
                        {entry.title}
                        {entry.isPrivate && <Lock size={13} className="text-slate-400 shrink-0" />}
                      </h4>
                      <div 
                        className="text-slate-300 text-sm font-serif line-clamp-3 leading-relaxed entry-preview-content"
                        dangerouslySetInnerHTML={{ __html: entry.content }}
                      />
                    </div>
                    <div className="pt-2 text-xs text-slate-500 font-serif flex justify-between border-t border-[#27272A]/30">
                      <span>{entry.wordCount} Kelime</span>
                      <span className="text-purple-400/80 hover:underline">Oku / Düzenle →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NATURAL HANDCRAFTED WRITING EDITOR */}
        {activeTab === 'write' && (
          <form onSubmit={handleSaveEntry} className="space-y-5 animate-fadeIn max-w-3xl mx-auto">
            
            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="gothic-card p-4 rounded-xl">
                <label className="block text-xs font-semibold text-slate-400 mb-1 gothic-title">Tarih</label>
                <input 
                  type="date" 
                  value={formDate} 
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full bg-[#18181B] text-slate-200 rounded-lg px-3 py-1.5 text-sm font-serif border border-[#27272A] focus:outline-none"
                />
              </div>
              <div className="gothic-card p-4 rounded-xl">
                <label className="block text-xs font-semibold text-slate-400 mb-1 gothic-title">Saat</label>
                <input 
                  type="text" 
                  value={formTime} 
                  onChange={e => setFormTime(e.target.value)}
                  className="w-full bg-[#18181B] text-slate-200 rounded-lg px-3 py-1.5 text-sm font-serif border border-[#27272A] focus:outline-none"
                />
              </div>
            </div>

            {/* ANIMATED MOOD SELECTOR WITH UNIQUE MOOD EFFECTS */}
            <div className="gothic-card p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-400 gothic-title">Ruh Hali</label>
                <span className="text-xs font-serif text-slate-300 font-semibold">{formMood.emoji} {formMood.label}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOODS.map((m, idx) => {
                  const isSelected = formMood.emoji === m.emoji;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => handleMoodSelect(m, e)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all ${
                        isSelected 
                          ? 'bg-[#18181B] border-[#52525B] text-slate-100 font-bold animate-mood-pop' 
                          : 'bg-transparent border-transparent text-slate-400 hover:bg-[#18181B] hover:text-slate-200'
                      }`}
                    >
                      <span className="text-lg shrink-0">{m.emoji}</span>
                      <span className="text-xs font-serif truncate">{m.label.split(' / ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HANDCRAFTED EDITOR CONTAINER */}
            <div className="gothic-card rounded-xl overflow-hidden border border-[#27272A]">
              
              {/* Title Input */}
              <div className="p-4 border-b border-[#27272A]">
                <input 
                  type="text" 
                  placeholder="Anı Başlığı..." 
                  value={formTitle} 
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full text-xl font-bold focus:outline-none placeholder-slate-600 bg-transparent gothic-title text-slate-100"
                />
              </div>

              {/* Natural Functional Toolbar */}
              <div className="flex flex-wrap items-center gap-2 p-2.5 bg-[#18181B] border-b border-[#27272A] text-xs font-serif text-slate-300">
                
                {/* Custom Elegant Font Family Dropdown */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => { setShowFontDropdown(!showFontDropdown); setShowPxDropdown(false); }}
                    className="flex items-center gap-1.5 bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none transition-colors"
                  >
                    <Type size={13} className="text-slate-400" />
                    <span>{FONT_OPTIONS.find(f => f.value === fontFamily)?.label || 'Font'}</span>
                    <ChevronDown size={12} className="text-slate-500 ml-1" />
                  </button>

                  {showFontDropdown && (
                    <div className="absolute top-8 left-0 z-30 bg-[#18181B] border border-[#27272A] p-1 rounded-lg shadow-xl w-44 space-y-0.5">
                      {FONT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setFontFamily(opt.value);
                            if (editorRef.current) editorRef.current.style.fontFamily = opt.value;
                            setShowFontDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                            fontFamily === opt.value ? 'bg-[#27272A] text-slate-100 font-bold' : 'text-slate-300 hover:bg-[#27272A]/50'
                          }`}
                        >
                          <span style={{ fontFamily: opt.value }}>{opt.label}</span>
                          {fontFamily === opt.value && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Elegant PX Punto Size Dropdown */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => { setShowPxDropdown(!showPxDropdown); setShowFontDropdown(false); }}
                    className="flex items-center gap-1.5 bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none transition-colors"
                  >
                    <span>{PX_OPTIONS.find(p => p.value === fontPx)?.label || fontPx}</span>
                    <ChevronDown size={12} className="text-slate-500 ml-0.5" />
                  </button>

                  {showPxDropdown && (
                    <div className="absolute top-8 left-0 z-30 bg-[#18181B] border border-[#27272A] p-1 rounded-lg shadow-xl w-36 space-y-0.5">
                      {PX_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setFontPx(opt.value);
                            if (editorRef.current) editorRef.current.style.fontSize = opt.value;
                            setShowPxDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                            fontPx === opt.value ? 'bg-[#27272A] text-slate-100 font-bold' : 'text-slate-300 hover:bg-[#27272A]/50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {fontPx === opt.value && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-4 bg-[#27272A] mx-1"></div>

                {/* Text Styling */}
                <button type="button" title="Kalın" onClick={() => executeCommand('bold')} className="p-1.5 rounded hover:bg-[#27272A]"><Bold size={14} /></button>
                <button type="button" title="İtalik" onClick={() => executeCommand('italic')} className="p-1.5 rounded hover:bg-[#27272A]"><Italic size={14} /></button>
                <button type="button" title="Altı Çizili" onClick={() => executeCommand('underline')} className="p-1.5 rounded hover:bg-[#27272A]"><Underline size={14} /></button>
                <button type="button" title="Üstü Çizili" onClick={() => executeCommand('strikeThrough')} className="p-1.5 rounded hover:bg-[#27272A]"><Strikethrough size={14} /></button>

                <div className="w-px h-4 bg-[#27272A] mx-1"></div>

                {/* Alignment */}
                <button type="button" title="Sola Hizala" onClick={() => executeCommand('justifyLeft')} className="p-1.5 rounded hover:bg-[#27272A]"><AlignLeft size={14} /></button>
                <button type="button" title="Ortala" onClick={() => executeCommand('justifyCenter')} className="p-1.5 rounded hover:bg-[#27272A]"><AlignCenter size={14} /></button>
                <button type="button" title="Sağa Hizala" onClick={() => executeCommand('justifyRight')} className="p-1.5 rounded hover:bg-[#27272A]"><AlignRight size={14} /></button>

                <div className="w-px h-4 bg-[#27272A] mx-1"></div>

                {/* Lists */}
                <button type="button" title="Liste" onClick={() => executeCommand('insertUnorderedList')} className="p-1.5 rounded hover:bg-[#27272A]"><List size={14} /></button>
                <button type="button" title="Alıntı" onClick={() => executeCommand('formatBlock', '<blockquote>')} className="p-1.5 rounded hover:bg-[#27272A]"><Quote size={14} /></button>

                <div className="w-px h-4 bg-[#27272A] mx-1"></div>

                {/* Colors */}
                <div className="flex items-center gap-1">
                  {['#E2E8F0', '#A855F7', '#E11D48', '#38BDF8'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setTextColor(c); executeCommand('foreColor', c); }}
                      className="w-4 h-4 rounded-full border border-[#27272A]"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="w-px h-4 bg-[#27272A] mx-1"></div>

                {/* Emoji Dropdown */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 rounded hover:bg-[#27272A] text-slate-300 flex items-center gap-1"
                    title="Emoji Ekle"
                  >
                    <Smile size={14} />
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute top-8 left-0 z-30 bg-[#18181B] border border-[#27272A] p-2 rounded-lg shadow-xl grid grid-cols-4 gap-1 w-36">
                      {EMOJI_LIST.map((emo, i) => (
                        <button key={i} type="button" onClick={() => insertEmoji(emo)} className="text-lg p-1 hover:bg-[#27272A] rounded text-center">
                          {emo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CANVAS / EDITOR BODY */}
              <div 
                ref={editorRef}
                contentEditable
                onInput={() => { if (editorRef.current) setFormContent(editorRef.current.innerHTML); }}
                style={{ fontSize: fontPx, fontFamily: fontFamily, color: textColor }}
                className="w-full min-h-[260px] p-4 bg-[#18181B] focus:outline-none leading-relaxed text-slate-200 overflow-y-auto"
                placeholder="Düşüncelerini buraya yaz..."
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-slate-100 py-3 rounded-xl font-bold text-base gothic-title transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} />
              <span>{editingEntry ? 'Kaydet' : 'Kaydet ✓'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: GEÇMİŞ & TAKVİM */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="gothic-card p-5 rounded-xl h-fit">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm capitalize gothic-title text-slate-200">{monthName}</h3>
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      const prev = new Date(calendarSelectedDate);
                      prev.setMonth(prev.getMonth() - 1);
                      setCalendarSelectedDate(prev);
                    }}
                    className="p-1 rounded hover:bg-[#18181B] text-slate-400 border border-[#27272A]"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      const next = new Date(calendarSelectedDate);
                      next.setMonth(next.getMonth() + 1);
                      setCalendarSelectedDate(next);
                    }}
                    className="p-1 rounded hover:bg-[#18181B] text-slate-400 border border-[#27272A]"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 mb-2 gothic-title">
                <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-serif">
                {calendarDays.map((item, idx) => {
                  if (!item) return <div key={idx} className="h-8"></div>;
                  const hasEntries = item.entries.length > 0;
                  const isSelectedFilter = filterDateStr === item.dateStr;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (filterDateStr === item.dateStr) {
                          setFilterDateStr(null);
                        } else {
                          setFilterDateStr(item.dateStr);
                        }
                      }}
                      className={`h-8 rounded flex items-center justify-center relative border transition-colors ${
                        isSelectedFilter 
                          ? 'bg-[#27272A] border-[#52525B] text-slate-100 font-bold' 
                          : hasEntries 
                          ? 'bg-[#18181B] border-[#3F3F46] text-slate-200 font-bold' 
                          : 'border-transparent hover:bg-[#18181B] text-slate-400'
                      }`}
                    >
                      <span>{item.day}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-bold text-base gothic-title text-slate-200">Anılar ({filteredEntries.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEntries.map(entry => (
                  <div 
                    key={entry.id}
                    onClick={() => setSelectedEntryDetail(entry)}
                    className="gothic-card gothic-card-hover p-4 rounded-xl cursor-pointer space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs text-slate-400 font-serif border-b border-[#27272A]/50 pb-1.5">
                      <span>{entry.date} • {entry.time}</span>
                      <span>{entry.mood} {entry.moodLabel.split(' / ')[0]}</span>
                    </div>
                    <h4 className="font-bold text-base text-slate-100 gothic-title">{entry.title}</h4>
                    <div 
                      className="text-slate-300 text-sm font-serif line-clamp-3 leading-relaxed entry-preview-content"
                      dangerouslySetInnerHTML={{ __html: entry.content }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: İSTATİSTİKLER */}
        {activeTab === 'stats' && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <div className="gothic-card p-6 rounded-xl space-y-4">
              <h3 className="font-bold text-sm gothic-title text-slate-200 text-center">Ruh Halleri Dağılımı</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.moodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {stats.moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', color: '#E2E8F0' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AYARLAR */}
        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto space-y-4 animate-fadeIn">
            <div className="gothic-card p-5 rounded-xl space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider gothic-title">Veri Aktarımı</h4>
              <div className="flex gap-3">
                <button 
                  onClick={handleExportJSON}
                  className="flex-1 bg-[#18181B] border border-[#27272A] hover:border-[#52525B] p-3 rounded-lg text-xs font-serif text-slate-300 flex items-center justify-center gap-2"
                >
                  <Download size={15} /> JSON İndir
                </button>
                <button 
                  onClick={handleExportTXT}
                  className="flex-1 bg-[#18181B] border border-[#27272A] hover:border-[#52525B] p-3 rounded-lg text-xs font-serif text-slate-300 flex items-center justify-center gap-2"
                >
                  <Download size={15} /> TXT İndir
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* RICH FULL-PAGE STYLE ENTRY DETAIL MODAL */}
      {selectedEntryDetail && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-[#121215] w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#27272A]">
            
            {/* Modal Header */}
            <div className="bg-[#0A0A0C] px-6 py-4 border-b border-[#27272A] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedEntryDetail.mood}</span>
                <div>
                  <span className="text-xs text-slate-400 font-serif block">{selectedEntryDetail.date} • {selectedEntryDetail.time}</span>
                  <span className="text-xs font-bold text-purple-400 gothic-title">{selectedEntryDetail.moodLabel}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleStartEdit(selectedEntryDetail)} 
                  className="p-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-slate-300 border border-[#27272A] transition-colors"
                  title="Düzenle"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => confirmDeleteEntry(selectedEntryDetail)} 
                  className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-900/40 transition-colors"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setSelectedEntryDetail(null)} 
                  className="p-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-slate-400 border border-[#27272A] transition-colors"
                  title="Kapat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Content - Styled like full page reading canvas with scrollbar hidden */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-4 flex-1">
              <h2 className="text-2xl md:text-3xl font-bold gothic-title text-slate-100 border-b border-[#27272A]/60 pb-3">
                {selectedEntryDetail.title}
              </h2>
              <div 
                className="text-base font-serif text-slate-200 leading-relaxed space-y-3 entry-preview-content"
                dangerouslySetInnerHTML={{ __html: selectedEntryDetail.content }}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#0A0A0C] border-t border-[#27272A] text-xs font-serif text-slate-500 flex justify-between shrink-0">
              <span>Kelime Sayısı: {selectedEntryDetail.wordCount}</span>
              <span>Son Güncelleme: {selectedEntryDetail.date}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
