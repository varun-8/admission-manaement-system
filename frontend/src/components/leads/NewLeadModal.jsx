import React, { useState } from 'react';
import { X, UserPlus, BookOpen, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function NewLeadModal({ onClose, onCreated, courses, counsellors }) {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    city: '',
    state: 'Tamil Nadu',
    previousQualification: '12th CBSE',
    academicPercentage: '',
    entranceExamScore: '',
    preferredCourse: courses[0]?._id || '',
    source: 'Website',
    campaignName: '',
    fairLocation: '',
    assignedCounsellor: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.phone) {
      setErrorMsg('Please fill in student name and mobile number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const selectedCourseObj = courses.find((c) => c._id === formData.preferredCourse);
    const payload = {
      ...formData,
      academicPercentage: formData.academicPercentage ? Number(formData.academicPercentage) : undefined,
      preferredCourseName: selectedCourseObj ? selectedCourseObj.name : '',
    };

    try {
      const res = await api.createLead(payload);
      if (res.success) {
        onCreated();
        onClose();
      } else {
        setErrorMsg(res.message || 'Failed to create lead entry');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while creating lead');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800" style={{ backgroundColor: '#0F172A' }}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/30 text-blue-300 rounded-xl border border-blue-500/30">
              <UserPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight" style={{ color: '#FFFFFF' }}>
                <span style={{ color: '#FFFFFF' }}>Ingest Admission Lead</span>
              </h2>
              <p className="text-xs font-medium" style={{ color: '#CBD5E1' }}>Enter candidate details for counseling routing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700" style={{ color: '#CBD5E1' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="e.g. Suresh Sharma"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@example.com"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          {/* Location & Source */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Chennai"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Lead Source *</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600/20 outline-none"
              >
                <option value="Website">Website Form</option>
                <option value="Walk-in">Walk-in Desk</option>
                <option value="Phone Call">Phone Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Educational Fair">Educational Fair</option>
                <option value="Campaign">Digital Campaign</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Program *</label>
              <select
                value={formData.preferredCourse}
                onChange={(e) => setFormData({ ...formData, preferredCourse: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600/20 outline-none"
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Qualifying Exam</label>
              <select
                value={formData.previousQualification}
                onChange={(e) => setFormData({ ...formData, previousQualification: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600/20 outline-none"
              >
                <option value="12th CBSE">12th CBSE</option>
                <option value="12th State Board">12th State Board</option>
                <option value="12th ISC">12th ISC</option>
                <option value="UG Degree">UG Degree</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Percentage / CGPA *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.academicPercentage}
                onChange={(e) => setFormData({ ...formData, academicPercentage: e.target.value })}
                placeholder="e.g. 85.5"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Assign Counsellor</label>
              <select
                value={formData.assignedCounsellor}
                onChange={(e) => setFormData({ ...formData, assignedCounsellor: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600/20 outline-none"
              >
                <option value="">Auto Round-Robin / Specialization</option>
                {counsellors.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Initial Counseling Note / Inquiry</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Student inquired about hostel facilities and scholarship eligibility..."
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-blue-600/20 outline-none resize-none"
            ></textarea>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition-all disabled:opacity-70"
            >
              {submitting ? 'Ingesting Lead...' : 'Save Lead & Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

