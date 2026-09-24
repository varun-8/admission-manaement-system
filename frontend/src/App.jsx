import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3, 
  Plus, 
  RefreshCw, 
  Layers,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sliders,
  PhoneCall
} from 'lucide-react';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import LeadBoard from './components/leads/LeadBoard';
import LeadModal from './components/leads/LeadModal';
import NewLeadModal from './components/leads/NewLeadModal';
import CounsellorView from './components/counsellors/CounsellorView';
import CourseView from './components/courses/CourseView';
import ReportView from './components/reports/ReportView';
import SettingsView from './components/settings/SettingsView';
import FollowUpView from './components/followups/FollowUpView';

export default function App() {
  const { user, loading: authLoading, logout, isSuperAdmin, isCounsellor } = useAuth();

  const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'counsellors', 'courses', 'reports'
  const [leads, setLeads] = useState([]);
  const [courses, setCourses] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    setDataLoading(true);
    try {
      const [leadsRes, coursesRes, counsellorsRes] = await Promise.all([
        api.getLeads(),
        api.getCourses(),
        api.getCounsellors(),
      ]);

      if (leadsRes.success) setLeads(leadsRes.data || []);
      if (coursesRes.success) setCourses(coursesRes.data || []);
      if (counsellorsRes.success) setCounsellors(counsellorsRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    const res = await api.updateLead(leadId, { status: newStatus });
    if (res.success) {
      loadAllData();
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      const res = await api.deleteLead(leadId);
      if (res.success) {
        loadAllData();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete lead');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span>Verifying Security Session...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col md:flex-row font-sans antialiased">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
            EM
          </div>
          <span className="font-extrabold text-sm text-slate-900">EDUMERGE</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Left Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Institution Header Logo */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex shrink-0 items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-slate-900 leading-tight flex items-center gap-1.5">
                <span>EDUMERGE</span> 
                <span className="text-blue-700 text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200/80">CRM</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-500">Workspace Portal</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pb-1">Navigation Menu</div>
            
            <button
              onClick={() => { setActiveTab('leads'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'leads'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-0.5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 shrink-0" />
                <span>Lead Pipelines</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                activeTab === 'leads' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('followups'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'followups'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-0.5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>Call Follow-ups</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                activeTab === 'followups' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 border border-amber-200/60'
              }`}>
                {leads.filter(l => l.nextFollowUpDate || l.status === 'Enrolled' || l.status === 'Lost').length}
              </span>
            </button>

            {!isCounsellor && (
              <button
                onClick={() => { setActiveTab('counsellors'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === 'counsellors'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-0.5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Counsellors</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === 'counsellors' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {counsellors.length}
                </span>
              </button>
            )}

            <button
              onClick={() => { setActiveTab('courses'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'courses'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-0.5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Programs</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                activeTab === 'courses' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {courses.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-0.5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>Reports & Stats</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-0.5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 shrink-0" />
                <span>Settings & Backup</span>
              </div>
            </button>
          </nav>
        </div>

        {/* User Footer Profile & Signout */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
            <div className="overflow-hidden pr-2">
              <div className="text-xs font-extrabold text-slate-900 truncate">{user.name || user.email}</div>
              <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                isSuperAdmin ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors border border-slate-200 shrink-0"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
        {dataLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-sm gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-blue-600" />
            <span className="font-bold text-slate-700">Updating Admission Workspace...</span>
          </div>
        ) : (
          <>
            {activeTab === 'leads' && (
              <LeadBoard
                leads={leads}
                onSelectLead={(lead) => setSelectedLead(lead)}
                onNewLeadClick={() => setShowNewLeadModal(true)}
                onStatusChange={handleStatusChange}
                onDeleteLead={handleDeleteLead}
              />
            )}

            {activeTab === 'followups' && (
              <FollowUpView
                leads={leads}
                onSelectLead={(lead) => setSelectedLead(lead)}
                onStatusChange={handleStatusChange}
              />
            )}

            {!isCounsellor && activeTab === 'counsellors' && <CounsellorView />}

            {activeTab === 'courses' && <CourseView courses={courses} onRefresh={loadAllData} />}

            {activeTab === 'reports' && <ReportView leads={leads} />}

            {activeTab === 'settings' && <SettingsView />}
          </>
        )}

        <footer className="border-t border-slate-200/80 pt-4 text-center text-xs text-slate-500 font-medium">
          Educational Institution Admission Lead Management System • Signed in as <strong className="text-slate-800">{user.email}</strong> ({user.role})
        </footer>
      </main>

      {/* Modals */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onRefresh={loadAllData}
          counsellors={counsellors}
        />
      )}

      {showNewLeadModal && (
        <NewLeadModal
          onClose={() => setShowNewLeadModal(false)}
          onCreated={loadAllData}
          courses={courses}
          counsellors={counsellors}
        />
      )}
    </div>
  );
}
