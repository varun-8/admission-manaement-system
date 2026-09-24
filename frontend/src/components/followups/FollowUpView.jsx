import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  ChevronRight, 
  MapPin, 
  Search, 
  Filter, 
  MessageCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function FollowUpView({ leads, onSelectLead, onStatusChange }) {
  const [activeSubTab, setActiveSubTab] = useState('today'); // 'today', 'overdue', 'confirmed', 'lost'
  const [searchTerm, setSearchTerm] = useState('');

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  // Categorize leads cleanly mapping all pipeline data according to status
  const todayLeads = leads.filter((l) => {
    const f = l.nextFollowUpDate ? new Date(l.nextFollowUpDate) : null;
    return (f && f >= todayStart && f <= todayEnd) || l.status === 'Counseling Scheduled';
  });

  const overdueLeads = leads.filter((l) => {
    const f = l.nextFollowUpDate ? new Date(l.nextFollowUpDate) : null;
    return (l.ageingCategory === 'Aged' || (f && f < todayStart) || ['New', 'Contacted', 'Campus Visit', 'Application Submitted', 'Deferred'].includes(l.status)) && !['Enrolled', 'Lost'].includes(l.status) && !(f && f >= todayStart && f <= todayEnd);
  });

  const confirmedLeads = leads.filter((l) => l.status === 'Enrolled');
  const lostLeads = leads.filter((l) => l.status === 'Lost');

  const getActiveList = () => {
    switch (activeSubTab) {
      case 'today':
        return todayLeads;
      case 'overdue':
        return overdueLeads;
      case 'confirmed':
        return confirmedLeads;
      case 'lost':
        return lostLeads;
      case 'all':
        return leads;
      default:
        return todayLeads;
    }
  };

  const displayedLeads = getActiveList().filter((l) => {
    return (
      l.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone?.includes(searchTerm) ||
      l.leadNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.preferredCourseName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Follow Up Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2.5 text-white">
            <Calendar className="w-6 h-6 text-blue-400 shrink-0" /> 
            <span className="text-white tracking-tight">Counseling Follow-up Management Hub</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed font-medium">
            Track daily scheduled calls, resolve overdue candidate follow-ups, and manage confirmed vs lost student records.
          </p>
        </div>
      </div>

      {/* Category Section Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveSubTab('today')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
            activeSubTab === 'today'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider opacity-80">Due Today</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{todayLeads.length}</div>
          <div className="text-[11px] font-medium opacity-90">Calls scheduled for today</div>
        </button>

        <button
          onClick={() => setActiveSubTab('overdue')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
            activeSubTab === 'overdue'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider opacity-80">Overdue & Aged</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{overdueLeads.length}</div>
          <div className="text-[11px] font-medium opacity-90">Pending SLA follow-ups</div>
        </button>

        <button
          onClick={() => setActiveSubTab('confirmed')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
            activeSubTab === 'confirmed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider opacity-80">Confirmed Enrolled</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{confirmedLeads.length}</div>
          <div className="text-[11px] font-medium opacity-90">Fee paid & confirmed</div>
        </button>

        <button
          onClick={() => setActiveSubTab('lost')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
            activeSubTab === 'lost'
              ? 'bg-slate-800 text-white border-slate-800 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider opacity-80">Lost Inquiries</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{lostLeads.length}</div>
          <div className="text-[11px] font-medium opacity-90">Deferred / dropped leads</div>
        </button>

        <button
          onClick={() => setActiveSubTab('all')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
            activeSubTab === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider opacity-80">All Pipeline Leads</span>
            <Filter className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{leads.length}</div>
          <div className="text-[11px] font-medium opacity-90">Entire mapped leads pool</div>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates in this category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-800"
          />
        </div>
      </div>

      {/* Categorized Records List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="px-5 py-3.5">Lead ID</th>
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Program</th>
                <th className="px-5 py-3.5">Follow-up Date</th>
                <th className="px-5 py-3.5">Stage</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {displayedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium italic">
                    No follow-up leads in this category.
                  </td>
                </tr>
              ) : (
                displayedLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{lead.leadNumber}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-slate-900">{lead.studentName}</div>
                      {lead.city && <div className="text-[11px] text-slate-500">{lead.city}</div>}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{lead.phone}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {lead.preferredCourseName || lead.preferredCourse?.name || 'N/A'}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-blue-600">
                      {lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toLocaleDateString() : 'Unscheduled'}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => onStatusChange(lead._id, e.target.value)}
                        className="border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 bg-white"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Counseling Scheduled">Counseling Scheduled</option>
                        <option value="Campus Visit">Campus Visit</option>
                        <option value="Application Submitted">Application Submitted</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Deferred">Deferred</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call
                        </a>
                        <button
                          onClick={() => onSelectLead(lead)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
                        >
                          Log Note <ChevronRight className="w-3.5 h-3.5 inline" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
