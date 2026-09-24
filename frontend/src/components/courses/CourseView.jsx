import React, { useState } from 'react';
import { BookOpen, Users, DollarSign, Award, CheckCircle, Plus, X, Layers, Clock, GraduationCap, Trash2, Edit } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CourseView({ courses, onRefresh }) {
  const { isSuperAdmin } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleDeleteCourse = async (courseId, courseName) => {
    if (window.confirm(`Are you sure you want to remove ${courseName} from academic offerings?`)) {
      try {
        const res = await api.deleteCourse(courseId);
        if (res.success) {
          if (onRefresh) onRefresh();
        }
      } catch (err) {
        alert(err.message || 'Failed to delete course');
      }
    }
  };

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [annualFee, setAnnualFee] = useState('');
  const [durationYears, setDurationYears] = useState('4');
  const [totalSeats, setTotalSeats] = useState('60');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingCourse(null);
    setName('');
    setCode('');
    setDepartment('Engineering');
    setAnnualFee('');
    setDurationYears('4');
    setTotalSeats('60');
    setEligibilityCriteria('');
    setDescription('');
    setShowAddModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setName(course.name || '');
    setCode(course.code || '');
    setDepartment(course.department || 'Engineering');
    setAnnualFee(course.annualFee ? String(course.annualFee) : '');
    setDurationYears(course.durationYears ? String(course.durationYears) : '4');
    setTotalSeats(course.totalSeats ? String(course.totalSeats) : '60');
    setEligibilityCriteria(course.eligibilityCriteria || '');
    setDescription(course.description || '');
    setShowAddModal(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!name || !code || !annualFee) {
      setFormError('Please fill in required fields (Course Name, Code, Annual Fee)');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const payload = {
        name,
        code,
        department,
        annualFee: Number(annualFee),
        durationYears: Number(durationYears),
        totalSeats: Number(totalSeats),
        eligibilityCriteria,
        description,
      };

      let res;
      if (editingCourse) {
        res = await api.updateCourse(editingCourse._id, payload);
      } else {
        res = await api.createCourse(payload);
      }

      if (res.success) {
        setShowAddModal(false);
        if (onRefresh) onRefresh();
      } else {
        setFormError(res.message || 'Failed to save course');
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2.5 text-white">
            <BookOpen className="w-6 h-6 text-blue-400 shrink-0" /> 
            <span className="text-white tracking-tight">Academic Programs & Seat Matrix</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed">
            Manage degree program offerings, annual tuition fee structures, student seat availability, and eligibility criteria.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add New Program
          </button>
        )}
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const seatPercentage = Math.round(((course.seatsFilled || 0) / (course.totalSeats || 1)) * 100);
          return (
            <div key={course._id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md border border-blue-200/60 uppercase tracking-wider inline-block">
                    {course.code}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1.5 leading-snug group-hover:text-blue-600 transition-colors">
                    {course.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.durationYears} Yrs
                  </span>
                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={() => openEditModal(course)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
                        title="Edit Academic Program"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id, course.name)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                        title="Delete Academic Program"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                {course.description || 'Comprehensive academic program focused on core fundamentals and industry exposure.'}
              </p>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold text-slate-500">Department:</span>
                  <span className="font-extrabold text-slate-900">{course.department || 'General'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold text-slate-500">Annual Tuition Fee:</span>
                  <span className="font-extrabold text-emerald-700">₹{(course.annualFee || 0).toLocaleString('en-IN')} / yr</span>
                </div>
                <div className="text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
                  <span className="font-bold text-slate-700">Eligibility: </span>
                  {course.eligibilityCriteria || 'Pass 10+2 with relevant subjects'}
                </div>
              </div>

              {/* Seat Matrix Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-extrabold text-slate-800">
                  <span>Seat Occupancy ({course.seatsFilled || 0} / {course.totalSeats || 60})</span>
                  <span className={seatPercentage >= 80 ? 'text-rose-600' : 'text-blue-600'}>
                    {seatPercentage}% Filled
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      seatPercentage >= 80 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    }`}
                    style={{ width: `${Math.min(seatPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Superadmin Create/Edit Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{editingCourse ? 'Edit Academic Program' : 'Add Academic Program'}</h3>
                  <p className="text-xs text-slate-500">Configure course details, seats, and tuition</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveCourse} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="B.Tech Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CSE-101"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Management">Management</option>
                    <option value="Medical">Medical</option>
                    <option value="Arts & Science">Arts & Science</option>
                    <option value="Law">Law</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Annual Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={annualFee}
                    onChange={(e) => setAnnualFee(e.target.value)}
                    placeholder="120000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    value={durationYears}
                    onChange={(e) => setDurationYears(e.target.value)}
                    placeholder="4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Intake Capacity</label>
                  <input
                    type="number"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    placeholder="60"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={eligibilityCriteria}
                  onChange={(e) => setEligibilityCriteria(e.target.value)}
                  placeholder="e.g. 60% in PCM, JEE Main Score"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Program overview and key career outcomes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all disabled:opacity-70"
                >
                  {submitting ? 'Adding Program...' : 'Create Academic Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

