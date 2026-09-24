import React, { useState, useEffect } from 'react';
import { Users, Award, Shield, CheckCircle, BarChart3, Mail, Phone, RefreshCw, Plus, X, Lock, UserPlus, Trash2, Edit } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CounsellorView() {
  const { isSuperAdmin } = useAuth();
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const handleDeleteCounsellor = async (counsellorId, counsellorName) => {
    if (window.confirm(`Are you sure you want to deactivate ${counsellorName}'s account?`)) {
      try {
        const res = await api.deleteCounsellor(counsellorId);
        if (res.success) {
          fetchPerformance();
        }
      } catch (err) {
        alert(err.message || 'Failed to delete counsellor account');
      }
    }
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setSpecialization('Engineering');
    setRole('counsellor');
    setShowAddModal(true);
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setName(staff.name || '');
    setEmail(staff.email || '');
    setPassword('');
    setPhone(staff.phone || '');
    setSpecialization(staff.specialization || 'Engineering');
    setRole(staff.role || 'counsellor');
    setShowAddModal(true);
  };

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('Engineering');
  const [role, setRole] = useState('counsellor');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    setLoading(true);
    const res = await api.getCounsellorPerformance();
    if (res.success) {
      setPerformance(res.data || []);
    }
    setLoading(false);
  };

  const handleCreateCounsellor = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setFormError('Please fill in all required fields (Name, Email, Password)');
      return;
    }

    setSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      const res = await api.registerUser({
        name,
        email,
        password,
        phone,
        specialization,
        role,
      });

      if (res.success) {
        setFormSuccess('Counsellor account successfully created!');
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        fetchPerformance();
        setTimeout(() => {
          setShowAddModal(false);
          setFormSuccess('');
        }, 1500);
      } else {
        setFormError(res.message || 'Failed to create counsellor account');
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while creating account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2.5 text-white">
            <Users className="w-6 h-6 text-indigo-400 shrink-0" />
            <span className="text-white tracking-tight">Admission Counsellor Roster & Performance</span>
          </h2>
          <p className="text-xs text-indigo-200 mt-1.5 max-w-xl leading-relaxed">
            Monitor active lead distribution, routing specialization, capacity limits, and counseling conversion rates across team members.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              <UserPlus className="w-4 h-4" /> Add New Counsellor
            </button>
          )}

          <button
            onClick={fetchPerformance}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Roster
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-sm text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" /> Loading team performance metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performance.map((staff, idx) => (
            <div key={staff._id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 relative overflow-hidden transition-all hover:shadow-md">
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                  <Award className="w-3.5 h-3.5" /> Top Performer
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm border border-indigo-200 shrink-0">
                    {staff.name ? staff.name.split(' ').map((n) => n[0]).join('') : 'C'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{staff.name}</h3>
                    <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                      {staff.specialization || 'General'}
                    </span>
                  </div>
                </div>
                {isSuperAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(staff)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors"
                      title="Edit Counsellor Account"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCounsellor(staff._id, staff.name)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                      title="Deactivate Counsellor Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
                <p className="flex items-center gap-2 truncate"><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {staff.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {staff.phone || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Assigned</div>
                  <div className="text-base font-extrabold text-blue-600">{staff.totalAssigned || 0}</div>
                </div>
                <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                  <div className="text-[11px] text-amber-700 font-medium">Active</div>
                  <div className="text-base font-extrabold text-amber-700">{staff.activeLeads || 0}</div>
                </div>
                <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
                  <div className="text-[11px] text-emerald-700 font-medium">Enrolled</div>
                  <div className="text-base font-extrabold text-emerald-700">{staff.enrolledCount || 0}</div>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">Conversion Rate</span>
                  <span className="text-indigo-600">{staff.conversionRate || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((staff.conversionRate || 0) * 3, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Superadmin Add Counsellor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Add New Counsellor</h3>
                  <p className="text-xs text-slate-500">Manage user credentials & system access</p>
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

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleCreateCounsellor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@institution.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Medical">Medical</option>
                    <option value="Management">Management</option>
                    <option value="Arts & Design">Arts & Design</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="counsellor">Counsellor</option>
                  <option value="admin">Admin / Manager</option>
                  <option value="superadmin">Superadmin</option>
                </select>
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all disabled:opacity-70"
                >
                  {submitting ? 'Creating Account...' : 'Create Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

