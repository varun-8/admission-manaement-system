import React, { useState } from 'react';
import { 
  UserCheck, 
  Phone, 
  BookOpen, 
  Search, 
  Plus, 
  MapPin, 
  AlertTriangle, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Trash2,
  Calendar,
  Clock,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Counseling Scheduled',
  'Campus Visit',
  'Application Submitted',
  'Enrolled',
  'Deferred',
  'Lost',
];

export default function LeadBoard({ leads, onSelectLead, onNewLeadClick, onStatusChange, onDeleteLead }) {
  const { isCounsellor } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [ageingFilter, setAgeingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [counsellorCategoryTab, setCounsellorCategoryTab] = useState('all'); // 'all', 'today', 'overdue', 'closed'

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.leadNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.preferredCourseName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSource = !sourceFilter || lead.source === sourceFilter;
    const matchesAgeing = !ageingFilter || lead.ageingCategory === ageingFilter;
    const matchesStatus = !statusFilter || lead.status === statusFilter;

    // Counsellor Category Tab Filter
    let matchesCategory = true;
    if (isCounsellor) {
      const followUp = lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate) : null;
      if (counsellorCategoryTab === 'today') {
        matchesCategory = followUp && followUp >= todayStart && followUp <= todayEnd && !['Enrolled', 'Lost'].includes(lead.status);
      } else if (counsellorCategoryTab === 'overdue') {
        matchesCategory = (lead.ageingCategory === 'Aged' || (followUp && followUp < todayStart)) && !['Enrolled', 'Lost'].includes(lead.status);
      } else if (counsellorCategoryTab === 'closed') {
        matchesCategory = ['Enrolled', 'Lost'].includes(lead.status);
      }
    }

    return matchesSearch && matchesSource && matchesAgeing && matchesStatus && matchesCategory;
  });

  // Counsellor Tab Counter Badges
  const todayCount = leads.filter((l) => {
    const f = l.nextFollowUpDate ? new Date(l.nextFollowUpDate) : null;
    return f && f >= todayStart && f <= todayEnd && !['Enrolled', 'Lost'].includes(l.status);
  }).length;

  const overdueCount = leads.filter((l) => {
    const f = l.nextFollowUpDate ? new Date(l.nextFollowUpDate) : null;
    return (l.ageingCategory === 'Aged' || (f && f < todayStart)) && !['Enrolled', 'Lost'].includes(l.status);
  }).length;

  const closedCount = leads.filter((l) => ['Enrolled', 'Lost'].includes(l.status)).length;

  return (
    <div className="space-y-4 font-sans">
      {/* Counsellor Workflow Category Tabs */}
      {isCounsellor && (
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCounsellorCategoryTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              counsellorCategoryTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All My Leads</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${counsellorCategoryTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setCounsellorCategoryTab('today')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              counsellorCategoryTab === 'today'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Today's Follow-ups</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${counsellorCategoryTab === 'today' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'}`}>
              {todayCount}
            </span>
          </button>

          <button
            onClick={() => setCounsellorCategoryTab('overdue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              counsellorCategoryTab === 'overdue'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Overdue & Aged</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${counsellorCategoryTab === 'overdue' ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-700'}`}>
              {overdueCount}
            </span>
          </button>

          <button
            onClick={() => setCounsellorCategoryTab('closed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              counsellorCategoryTab === 'closed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Closed & Enrolled</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${counsellorCategoryTab === 'closed' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
              {closedCount}
            </span>
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto flex-1">
          <div className="relative flex-1 min-w-[240px] max-w-md group">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
            <input
              type="text"
              placeholder="Search by candidate name, phone, ID, program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-slate-800 transition-all cursor-pointer"
          >
            <option value="">All Pipeline Stages</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-slate-800 transition-all cursor-pointer"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Phone Call">Phone Call</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Educational Fair">Educational Fair</option>
            <option value="Campaign">Campaign</option>
            <option value="Referral">Referral</option>
          </select>

          <select
            value={ageingFilter}
            onChange={(e) => setAgeingFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-slate-800 transition-all cursor-pointer"
          >
            <option value="">All Ageing Categories</option>
            <option value="Fresh">Fresh (&lt;24h)</option>
            <option value="Active">Active (1-7d)</option>
            <option value="Stale">Stale (8-30d)</option>
            <option value="Aged">Aged (&gt;30d)</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs font-bold text-slate-500">
            Showing <strong className="text-slate-900">{filteredLeads.length}</strong> records
          </span>

          <button
            onClick={onNewLeadClick}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" /> Ingest Lead
          </button>
        </div>
      </div>

      {/* Mobile Responsive Lead List & Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Mobile View: High-Accessibility Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium italic text-xs">
              No lead records found matching criteria.
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div key={lead._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      {lead.leadNumber}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">{lead.studentName}</h3>
                    {lead.city && (
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> {lead.city}
                      </div>
                    )}
                  </div>

                  {/* Stage Dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead._id, e.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-extrabold text-slate-800 bg-white focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Program:</span>
                    <span className="font-bold text-slate-800">{lead.preferredCourseName || lead.preferredCourse?.name || 'Unspecified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Channel:</span>
                    <span className="font-bold text-slate-700">{lead.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Counsellor:</span>
                    <span className="font-bold text-slate-700">{lead.assignedCounsellorName || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Highly Accessible Call Action Button */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4 stroke-[2.5]" /> Call Candidate ({lead.phone})
                  </a>

                  <button
                    onClick={() => onSelectLead(lead)}
                    className="p-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                    title="View Full Details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {onDeleteLead && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete lead record ${lead.studentName}?`)) {
                          onDeleteLead(lead._id);
                        }
                      }}
                      className="p-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Data Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="px-5 py-3.5">Lead ID</th>
                <th className="px-5 py-3.5">Candidate Name</th>
                <th className="px-5 py-3.5">Contact Number</th>
                <th className="px-5 py-3.5">Academic Program</th>
                <th className="px-5 py-3.5">Channel</th>
                <th className="px-5 py-3.5">Counsellor</th>
                <th className="px-5 py-3.5">Stage</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 font-medium italic">
                    No lead records found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {lead.leadNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-slate-900 text-sm">{lead.studentName}</div>
                      {lead.city && (
                        <div className="text-[11px] text-slate-500 font-normal flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" /> {lead.city}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {lead.phone}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {lead.preferredCourseName || lead.preferredCourse?.name || 'Unspecified'}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">
                      {lead.source}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">
                      {lead.assignedCounsellorName || 'Unassigned'}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => onStatusChange(lead._id, e.target.value)}
                        className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-slate-800 cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm transition-all"
                          title="Call Candidate"
                        >
                          <Phone className="w-3.5 h-3.5 stroke-[2.5]" /> Call
                        </a>
                        <button
                          onClick={() => onSelectLead(lead)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all"
                        >
                          Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteLead && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete lead record ${lead.studentName}?`)) {
                                onDeleteLead(lead._id);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Lead Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
