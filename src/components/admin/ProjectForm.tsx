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
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 sm:p-10 shadow-xs">
      {isSaved ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary-fixed text-on-primary-fixed mx-auto flex items-center justify-center text-3xl shadow-xs">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Project Planned Successfully!</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
            Redirecting to public projects directory...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-space-xl">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
              Plan New Community Intervention
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Specify the scope, budget breakdown, target UN SDGs, and key stakeholders to reach across Edo State.
            </p>
          </div>

          {/* Section 1: Basic Info */}
          <div className="space-y-space-md">
            <h3 className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
              1. Project Overview & Scope
            </h3>

            <div>
              <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Free Pad Dispensary & Menstrual Hygiene Outreach"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <div>
                <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                  Target Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Oredo / Egor LGA, Benin City"
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                  Target Execution Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                  Current Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
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
              <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                Detailed Objectives & Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State the problem, intervention methodology, direct beneficiaries, and how this moves Edo State forward..."
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Section 2: UN SDGs Solved */}
          <div className="space-y-space-sm pt-space-md border-t border-surface-variant">
            <h3 className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
              2. SDG Goals Solved (Select All That Apply)
            </h3>
            <div className="flex flex-wrap gap-2 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isSelected ? 'border-transparent shadow-xs scale-102' : 'border-outline-variant/40 hover:bg-surface-container'
                    }`}
                  >
                    <span>Goal {sdg.number}: {sdg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Cost & Budget Breakdown */}
          <div className="space-y-space-md pt-space-md border-t border-surface-variant">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                  3. Cost & Itemized Budget
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Provide transparent line items for potential donors.</p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Total Calculated Cost:</span>
                <div className="font-headline-sm text-headline-sm font-extrabold text-primary">
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
                    className="flex-1 px-3 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                  <div className="relative w-44">
                    <span className="absolute left-3 top-2 text-outline text-sm">₦</span>
                    <input
                      type="number"
                      value={item.cost}
                      onChange={(e) => handleUpdateBudgetItem(index, 'cost', Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBudgetItem(index)}
                    className="p-2 text-outline hover:text-error rounded-lg hover:bg-error-container/30 transition-colors"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddBudgetItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Budget Line Item</span>
            </button>
          </div>

          {/* Section 4: Who to Reach Out To (Stakeholders) */}
          <div className="space-y-space-sm pt-space-md border-t border-surface-variant">
            <h3 className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
              4. Stakeholders & NGOs to Reach Out To
            </h3>
            <div className="flex flex-wrap gap-2">
              {stakeholders.map((sh, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold"
                >
                  <span>{sh}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStakeholder(idx)}
                    className="hover:text-error ml-1"
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
                className="flex-1 px-3 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddStakeholder}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-sm text-label-sm font-bold transition-colors"
              >
                Add Partner
              </button>
            </div>
          </div>

          {/* Section 5: File Attachments */}
          <div className="space-y-space-sm pt-space-md border-t border-surface-variant">
            <h3 className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
              5. Upload Project Proposals & Documents
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Attach project proposals, approval letters, or receipts (stored securely in Supabase Storage).
            </p>

            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, i) => (
                <div key={i} className="px-3 py-1.5 bg-surface-container rounded-lg font-label-sm text-label-sm font-medium text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">description</span>
                  <span>{file.name}</span>
                  <span className="text-outline">({file.size})</span>
                </div>
              ))}
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold cursor-pointer transition-colors border border-outline-variant">
              <span className="material-symbols-outlined text-[18px]">attach_file</span>
              <span>Choose File to Attach</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-surface-variant flex justify-end gap-3">
            <a
              href="/admin"
              className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>Publish Project Plan</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
