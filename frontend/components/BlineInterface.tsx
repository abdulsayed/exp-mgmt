import React, { useState } from 'react';
import { Briefcase, User, Calendar, DollarSign, CheckCircle2, Clock } from 'lucide-react';

// Mock data for dropdowns
const MOCK_PROJECTS = [
  { id: 'PRJ-2024-001', name: 'Cloud Migration Initiative' },
  { id: 'PRJ-2024-002', name: 'Q3 Marketing Campaign' },
  { id: 'PRJ-2024-003', name: 'Enterprise Security Upgrade' },
];

const MOCK_BUDGET_LINES = [
  { id: 'BL-001', category: 'CONTRACTORS', project: 'PRJ-2024-001' },
  { id: 'BL-002', category: 'SOFTWARE', project: 'PRJ-2024-001' },
  { id: 'BL-003', category: 'TRAVEL', project: 'PRJ-2024-002' },
];

export const BlineInterface: React.FC = () => {
  const [projectId, setProjectId] = useState('');
  const [budgetId, setBudgetId] = useState('');
  const [resourceName, setResourceName] = useState('');
  const [periodType, setPeriodType] = useState('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredBudgetLines = MOCK_BUDGET_LINES.filter(bl => bl.project === projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(`Successfully allocated $${amount} to ${resourceName} for ${periodType.toLowerCase()} periods.`);
      
      // Reset form
      setResourceName('');
      setAmount('');
      setStartDate('');
      setEndDate('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Resource Allocation Entry</h1>
        <p className="text-gray-400 text-lg">Create weekly or monthly budget line allocations.</p>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-green-400 font-medium">{successMessage}</p>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 bg-gray-850">
          <h2 className="text-lg font-semibold text-gray-100">New Allocation Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project & Budget Line Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Project</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                </div>
                <select
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    setBudgetId(''); // Reset budget line when project changes
                  }}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-800 rounded-xl bg-gray-950 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="" disabled>Select a project...</option>
                  {MOCK_PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Budget Line Category</label>
              <div className="relative">
                <select
                  value={budgetId}
                  onChange={(e) => setBudgetId(e.target.value)}
                  disabled={!projectId}
                  className="block w-full px-4 py-2.5 border border-gray-800 rounded-xl bg-gray-950 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  <option value="" disabled>Select budget line...</option>
                  {filteredBudgetLines.map(bl => (
                    <option key={bl.id} value={bl.id}>{bl.category} ({bl.id})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resource Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Resource Name / Vendor</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="e.g., Jane Doe or Acme Corp"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl bg-gray-950 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Period & Amount Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Period Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <select
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-800 rounded-xl bg-gray-950 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none"
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Allocated Amount ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl bg-gray-950 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Period Start Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl bg-gray-950 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Period End Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl bg-gray-950 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 [color-scheme:dark]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Save Allocation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
