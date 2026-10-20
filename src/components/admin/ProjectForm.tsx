import React, { useState } from 'react';
import type { Project, BudgetItem } from '../../types/database';
import { SDG_METADATA } from '../../types/database';

export const ProjectForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Benin City, Edo State');
  const [targetDate, setTargetDate] = useState('2026-12-15');
  const [status, setStatus] = useState<Project['status']>('planning');
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([3, 5]);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80');

  // Budget items
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { item: 'Sanitary Pads / Materials Procurement', cost: 200000 },
    { item: 'Logistics & Community Transportation', cost: 35000 },
    { item: 'Advocacy Flyers & Sensitization Banners', cost: 25000 },
  ]);

  // Stakeholders
  const [stakeholders, setStakeholders] = useState<string[]>([
    "Girls' Power Initiative (GPI) Benin",
    'Edo State SDGs Office',
    'Edo State Waste Management Board',
  ]);
  const [newStakeholder, setNewStakeholder] = useState('');

  // Attached files
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([
    { name: 'Official_Project_Proposal_Draft.pdf', size: '1.2 MB' },
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const totalCost = budgetItems.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);

  const toggleSDG = (num: number) => {
    setSelectedSDGs((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const handleAddBudgetItem = () => {
    setBudgetItems([...budgetItems, { item: 'New Budget Item', cost: 10000 }]);
  };

  const handleRemoveBudgetItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  };

  const handleUpdateBudgetItem = (index: number, field: keyof BudgetItem, value: any) => {
    const updated = [...budgetItems];
    updated[index] = { ...updated[index], [field]: value };
    setBudgetItems(updated);
  };

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStakeholder.trim()) {
      setStakeholders([...stakeholders, newStakeholder.trim()]);
      setNewStakeholder('');
    }
  };

  const handleRemoveStakeholder = (index: number) => {
    setStakeholders(stakeholders.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setAttachedFiles([...attachedFiles, { name: file.name, size: sizeStr }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newProject: Project = {
      id: 'proj-' + Date.now(),
      title: title.trim(),
      summary: summary.trim() || title.trim(),
      description: description.trim(),
      sdg_goals: selectedSDGs,
      estimated_cost: totalCost,
      budget_breakdown: budgetItems,
      stakeholders_to_reach: stakeholders,
      target_location: location,
      status,
      target_date: targetDate,
      cover_image: coverImage,
      created_at: new Date().toISOString(),
      attachments: attachedFiles.map((f, i) => ({
        id: 'att-' + i,
        project_id: 'proj-' + Date.now(),
        file_name: f.name,
        file_url: '#',
        file_size: f.size,
        file_type: 'DOCUMENT',
        created_at: new Date().toISOString(),
      })),
    };

    // Save locally
    const existing = JSON.parse(localStorage.getItem('edo_sdg_custom_projects') || '[]');
    existing.unshift(newProject);
    localStorage.setItem('edo_sdg_custom_projects', JSON.stringify(existing));

    setIsSaved(true);
    setTimeout(() => {
      window.location.href = '/projects';
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
      {isSaved ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-100 text-nysc-green mx-auto flex items-center justify-center text-3xl shadow-sm">
            ✓
          </div>
          <h3 className="text-2xl font-black text-slate-900">Project Planned Successfully!</h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Redirecting to public projects directory...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Plan New Community Intervention
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Specify the scope, budget breakdown, target UN SDGs, and key stakeholders to reach.
            </p>
          </div>

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nysc-green-dark">
              1. Project Overview & Scope
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Free Pad Dispensary & Menstrual Hygiene Outreach"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Oredo / Egor LGA, Benin City"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Execution Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-nysc-green focus:outline-hidden"
                >
                  <option value="concept">Concept Stage</option>
                  <option value="planning">In Active Planning</option>
                  <option value="fundraising">Fundraising & Seeking Sponsors</option>
                  <option value="in_progress">Execution In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Objectives & Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State the problem, intervention methodology, direct beneficiaries, and how this moves Edo State forward..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Section 2: UN SDGs Solved */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nysc-green-dark">
              2. SDG Goals Solved (Select All That Apply)
            </h3>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              {Object.values(SDG_METADATA).map((sdg) => {
                const isSelected = selectedSDGs.includes(sdg.number);
                return (
                  <button
                    key={sdg.number}
                    type="button"
                    onClick={() => toggleSDG(sdg.number)}
                    style={{
                      backgroundColor: isSelected ? sdg.color : '#ffffff',
                      color: isSelected ? '#ffffff' : '#334155',
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected ? 'border-transparent shadow-xs scale-102' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Goal {sdg.number}: {sdg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Cost & Budget Breakdown */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-nysc-green-dark">
                  3. Cost & Itemized Budget
                </h3>
                <p className="text-xs text-slate-500">Provide transparent line items for potential donors.</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Total Calculated Cost:</span>
                <div className="text-2xl font-black text-nysc-green-dark">
                  ₦{totalCost.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {budgetItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleUpdateBudgetItem(index, 'item', e.target.value)}
                    placeholder="Expense item description"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden"
                  />
                  <div className="relative w-44">
                    <span className="absolute left-3 top-2 text-slate-400 text-sm">₦</span>
                    <input
                      type="number"
                      value={item.cost}
                      onChange={(e) => handleUpdateBudgetItem(index, 'cost', Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBudgetItem(index)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddBudgetItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <span>+ Add Budget Line Item</span>
            </button>
          </div>

          {/* Section 4: Who to Reach Out To (Stakeholders) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nysc-green-dark">
              4. Stakeholders & NGOs to Reach Out To
            </h3>
            <div className="flex flex-wrap gap-2">
              {stakeholders.map((sh, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-green-50 text-nysc-green-dark text-xs font-bold border border-green-200"
                >
                  <span>{sh}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStakeholder(idx)}
                    className="hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newStakeholder}
                onChange={(e) => setNewStakeholder(e.target.value)}
                placeholder="e.g. Rotary Club of Benin, Ministry of Health"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-nysc-green focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddStakeholder}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors"
              >
                Add Partner
              </button>
            </div>
          </div>

          {/* Section 5: File Attachments */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nysc-green-dark">
              5. Upload Project Proposals & Documents
            </h3>
            <p className="text-xs text-slate-500">
              Attach project proposals, approval letters, or receipts (stored securely in Supabase Storage).
            </p>

            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, i) => (
                <div key={i} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-2">
                  <span>📄 {file.name}</span>
                  <span className="text-slate-400">({file.size})</span>
                </div>
              ))}
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors border border-slate-300">
              <span>📎 Choose File to Attach</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
            <a
              href="/admin"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-nysc-green text-white text-sm font-bold shadow-md shadow-nysc-green/30 hover:bg-nysc-green-dark transition-all"
            >
              Publish Project Plan
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
