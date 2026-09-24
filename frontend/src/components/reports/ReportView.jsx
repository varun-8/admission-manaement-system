import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart as PieIcon, Download, Layers, ShieldCheck, AlertCircle, RefreshCw, Award, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';

const FUNNEL_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#F59E0B', '#14B8A6', '#10B981'];
const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'];

export default function ReportView({ leads }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalyticsSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Error fetching analytics summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportPDFReport = (programFilter = null) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    
    const titleText = programFilter 
      ? `Program Admission Report: ${programFilter.name} (${programFilter.code})`
      : 'EDUMERGE CRM - Executive Admission Lead Report';

    doc.text(titleText, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 27);

    const filteredLeads = programFilter 
      ? leads.filter((l) => (l.preferredCourseName === programFilter.name || l.preferredCourse?._id === programFilter.courseId))
      : leads;

    if (summary?.kpi && !programFilter) {
      doc.text(`Total Leads: ${summary.kpi.totalLeads} | Active: ${summary.kpi.activeLeads} | Enrolled: ${summary.kpi.enrolledLeads} | Conversion: ${summary.kpi.conversionRate}%`, 14, 34);
    } else if (programFilter) {
      const totalP = filteredLeads.length;
      const enrolledP = filteredLeads.filter(l => l.status === 'Enrolled').length;
      doc.text(`Program Total Inquiries: ${totalP} | Confirmed Enrolled: ${enrolledP} | Total Seats: ${programFilter.totalSeats}`, 14, 34);
    }

    const tableRows = filteredLeads.map((l) => [
      l.leadNumber,
      l.studentName,
      l.phone,
      l.preferredCourseName || 'N/A',
      l.source,
      l.status,
      l.assignedCounsellorName || 'Unassigned',
      l.ageingCategory,
    ]);

    doc.autoTable({
      startY: 42,
      head: [['Lead ID', 'Student', 'Phone', 'Course', 'Source', 'Status', 'Counsellor', 'Ageing']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    });

    const fileName = programFilter 
      ? `${programFilter.code}_Admission_Report_2026.pdf`
      : 'ADMI_LINK_Executive_Report_2026.pdf';

    doc.save(fileName);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-sm gap-3">
        <RefreshCw className="w-7 h-7 animate-spin text-blue-600" />
        <span className="font-bold text-slate-700">Loading Analytics & Visual Charts...</span>
      </div>
    );
  }

  const { kpi, funnel, sourceBreakdown, ageingBreakdown, courseDemand } = summary || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2.5 !text-white" style={{ color: '#FFFFFF' }}>
            <BarChart3 className="w-6 h-6 text-indigo-400 shrink-0" />
            <span style={{ color: '#FFFFFF' }}>Executive Admission Analytics & Graphical Reports</span>
          </h2>
          <p className="text-xs text-indigo-200 mt-1.5 max-w-xl leading-relaxed font-medium">
            Real-time stage conversion funnels, channel ROI efficiency, program demand meters, and lead health SLA monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSummary}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm"
            title="Refresh Analytics Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={exportPDFReport}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" /> Export PDF Report
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Inquiries</div>
          <div className="text-2xl font-black text-slate-900">{kpi?.totalLeads || 0}</div>
          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" /> Intake total
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Active Leads</div>
          <div className="text-2xl font-black text-blue-600">{kpi?.activeLeads || 0}</div>
          <div className="text-[11px] font-bold text-blue-600">In counseling</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Confirmed Seats</div>
          <div className="text-2xl font-black text-emerald-600">{kpi?.enrolledLeads || 0}</div>
          <div className="text-[11px] font-bold text-emerald-600">Enrolled & Fee Paid</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Conversion Rate</div>
          <div className="text-2xl font-black text-indigo-600">{kpi?.conversionRate || 0}%</div>
          <div className="text-[11px] font-bold text-indigo-600">Inquiry to Enrollment</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">SLA Breaches</div>
          <div className="text-2xl font-black text-rose-600">{kpi?.slaBreachedLeads || 0}</div>
          <div className="text-[11px] font-bold text-rose-600">&gt;24h uncontacted</div>
        </div>
      </div>

      {/* Graphical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Modern Animated Funnel Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Admission Stage Conversion Funnel
            </h3>
            <span className="text-xs font-bold text-slate-400">Interactive Bar Graph</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#FFF', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{ fill: 'rgba(241, 245, 249, 0.8)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={1000}>
                  {funnel?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Modern Animated Source Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" /> Acquisition Channel Distribution
            </h3>
            <span className="text-xs font-bold text-slate-400">Share %</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceBreakdown?.filter(s => s.total > 0) || [{ source: 'Direct Inquiries', total: 1 }]}
                  dataKey="total"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  animationDuration={1200}
                >
                  {sourceBreakdown?.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#FFF', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ageing & Course Demand Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Source Efficiency Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Acquisition Channel Efficiency & ROI
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-900 text-white font-extrabold uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Channel</th>
                  <th className="py-2.5 px-3 text-center">Total Inquiries</th>
                  <th className="py-2.5 px-3 text-center">Enrolled</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Conversion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sourceBreakdown?.map((src) => (
                  <tr key={src.source} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-extrabold text-slate-900">{src.source}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">{src.total}</td>
                    <td className="py-3 px-3 text-center font-black text-emerald-600">{src.enrolled}</td>
                    <td className="py-3 px-3 text-right font-black text-indigo-600">{src.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Program Demand & Booking Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-600" /> Program Demand & Seat Booking Metrics
          </h3>
          <div className="space-y-3.5">
            {courseDemand?.map((c) => {
              const fillPct = Math.round(((c.seatsFilled || 0) / (c.totalSeats || 1)) * 100);
              return (
                <div key={c.code} className="space-y-1 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900">{c.code} - {c.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium ml-2">({c.leadsCount} inquiries)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right font-extrabold text-emerald-700">
                        {c.seatsFilled} / {c.totalSeats} Seats ({fillPct}%)
                      </div>
                      <button
                        onClick={() => exportPDFReport(c)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="Download PDF Report for this Program"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(fillPct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


