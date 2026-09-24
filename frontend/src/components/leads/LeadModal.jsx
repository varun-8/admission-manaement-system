import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  UserCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import { api } from '../../services/api';

export default function LeadModal({ lead, onClose, onRefresh, counsellors }) {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  // New follow-up form state
  const [type, setType] = useState('Phone Call');
  const [outcome, setOutcome] = useState('Connected - Interested');
  const [notes, setNotes] = useState('');
  const [nextDate, setNextDate] = useState('');

  // Reassign state
  const [selectedCounsellor, setSelectedCounsellor] = useState(lead.assignedCounsellor?._id || '');

  useEffect(() => {
    fetchLeadDetails();
  }, [lead._id]);

  const fetchLeadDetails = async () => {
    setLoading(true);
    const res = await api.getLeadById(lead._id);
    if (res.success) {
      setFollowUps(res.data.followUps || []);
    }
    setLoading(false);
  };

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const res = await api.createFollowUp({
      leadId: lead._id,
      type,
      outcome,
      notes,
      scheduledFollowUpDate: nextDate || null,
    });

    if (res.success) {
      setNotes('');
      setNextDate('');
      fetchLeadDetails();
      onRefresh();
    }
  };

  const handleAssignChange = async (counsellorId) => {
    setSelectedCounsellor(counsellorId);
    const res = await api.assignLead(lead._id, counsellorId);
    if (res.success) {
      onRefresh();
    }
  };

  const handleWhatsAppTrigger = () => {
    const message = `Hello ${lead.studentName}, Greetings from our Admission Office! Regarding your inquiry for ${lead.preferredCourseName || 'our courses'}, please find our course details and brochure. Let us know when you would like to schedule a campus counseling visit!`;
    const url = `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800" style={{ backgroundColor: '#0F172A' }}>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-blue-600/40 border border-blue-400/40 text-blue-200 text-xs font-black px-3 py-1 rounded-lg shadow-sm" style={{ color: '#BFDBFE' }}>
                {lead.leadNumber}
              </span>
              <span className="bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-3 py-1 rounded-lg" style={{ color: '#6EE7B7' }}>
                {lead.status}
              </span>
            </div>
            <h2 className="text-2xl font-black mt-2.5 tracking-tight flex items-center gap-2" style={{ color: '#FFFFFF' }}>
              <span style={{ color: '#FFFFFF' }}>{lead.studentName}</span>
            </h2>
            {lead.parentName && <p className="text-xs font-medium mt-1" style={{ color: '#CBD5E1' }}>Parent / Guardian: {lead.parentName}</p>}
          </div>

          <button onClick={onClose} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 shadow-sm" style={{ color: '#CBD5E1' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
              <h4 className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider">Contact Profile</h4>
              <p className="flex items-center gap-2 text-sm text-slate-800 font-bold">
                <Phone className="w-4 h-4 text-emerald-600" /> {lead.phone}
              </p>
              {lead.email && (
                <p className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Mail className="w-4 h-4 text-blue-600" /> {lead.email}
                </p>
              )}
              {lead.city && (
                <p className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" /> {lead.city}, {lead.state}
                </p>
              )}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="w-1/2 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Student
                </a>
                <button
                  onClick={handleWhatsAppTrigger}
                  className="w-1/2 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-md shadow-blue-600/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <h4 className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider">Academic Preference</h4>
              <p className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" /> {lead.preferredCourseName || lead.preferredCourse?.name || 'Unspecified'}
              </p>
              <p className="text-xs text-slate-600 font-medium">Qualification: {lead.previousQualification || 'N/A'}</p>
              {lead.academicPercentage && (
                <p className="text-xs text-slate-600 font-medium">Percentage: {lead.academicPercentage}%</p>
              )}
              {lead.entranceExamScore && (
                <p className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 p-2 rounded-xl">
                  Score: {lead.entranceExamScore}
                </p>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <h4 className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider">Assignment & Source</h4>
              <p className="text-xs text-slate-600 font-medium">Source: <span className="font-extrabold text-slate-900">{lead.source}</span></p>
              
              <div className="pt-1">
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Counsellor Assigned:</label>
                <select
                  value={selectedCounsellor}
                  onChange={(e) => handleAssignChange(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-2 text-xs bg-white font-bold text-slate-800 focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="">-- Unassigned --</option>
                  {counsellors.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] text-slate-400 font-medium pt-1">
                Routing Mode: {lead.assignmentType || 'Auto'}
              </div>
            </div>
          </div>

          {/* Counseling Follow-up Log Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" /> Log Counseling Call & Follow-up Note
            </h3>

            <form onSubmit={handleAddFollowUp} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Interaction Mode</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white font-semibold focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="Campus Counseling">Campus Counseling</option>
                    <option value="WhatsApp Message">WhatsApp Message</option>
                    <option value="Email">Email</option>
                    <option value="Document Submission">Document Submission</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Call Outcome</label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white font-semibold focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Connected - Interested">Connected - Interested</option>
                    <option value="Connected - Thinking">Connected - Thinking</option>
                    <option value="Connected - Not Interested">Connected - Not Interested</option>
                    <option value="Busy / No Answer">Busy / No Answer</option>
                    <option value="Scheduled Campus Visit">Scheduled Campus Visit</option>
                    <option value="Fee Paid">Fee Paid</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white font-semibold focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Counseling Notes / Discussion Points</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter details of conversation with student or parent..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-blue-600/20 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
                >
                  Save Log & Update Lead
                </button>
              </div>
            </form>
          </div>

          {/* Follow-up Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Interaction & Counseling Log History ({followUps.length})
            </h3>

            {loading ? (
              <div className="text-center py-4 text-xs text-slate-500 font-medium">Loading notes history...</div>
            ) : followUps.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400 italic">No counseling notes logged yet.</div>
            ) : (
              <div className="space-y-3">
                {followUps.map((item) => (
                  <div key={item._id} className="border-l-2 border-indigo-600 pl-3.5 py-1 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">{item.type} — <span className="text-indigo-600">{item.outcome}</span></span>
                      <span className="text-slate-400 text-[11px] font-medium">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">{item.notes}</p>
                    <div className="text-[10.5px] text-slate-400 font-semibold flex items-center gap-3 pt-0.5">
                      <span>Logged by: {item.counsellorName}</span>
                      {item.scheduledFollowUpDate && (
                        <span className="font-bold text-amber-600">Next Task: {new Date(item.scheduledFollowUpDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

