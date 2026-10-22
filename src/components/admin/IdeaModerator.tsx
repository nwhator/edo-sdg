import React, { useState, useEffect } from 'react';
import type { Idea, CrawledNgo } from '../../types/database';
import { SDG_METADATA } from '../../types/database';
import { EDO_NGO_REGISTRY } from '../../data/edoNgoDirectory';
import { updateIdeaClient, deleteIdeaClient } from '../../lib/supabase';

interface IdeaModeratorProps {
  initialIdeas: Idea[];
}

const CATEGORIES = [
  'Women Health & Hygiene',
  'Sanitation & Environment',
  'Good Health',
  'Quality Education',
  'Zero Hunger',
  'Community Advocacy',
  'Skills Acquisition & Youth',
  'Partnerships & Outreach',
  'Clean Energy',
];

export const IdeaModerator: React.FC<IdeaModeratorProps> = ({ initialIdeas }) => {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedNgoForPitch, setSelectedNgoForPitch] = useState<CrawledNgo | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Edit State
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState(CATEGORIES[0]);
  const [editLocation, setEditLocation] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editStatus, setEditStatus] = useState<Idea['status']>('submitted');
  const [editUpvotes, setEditUpvotes] = useState(0);
  const [editSdgs, setEditSdgs] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deletingIdea, setDeletingIdea] = useState<Idea | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with Local Storage on Mount (Custom ideas, edited ideas, and deleted ideas)
  useEffect(() => {
    try {
      const deletedIds = new Set(JSON.parse(localStorage.getItem('edo_sdg_deleted_idea_ids') || '[]'));
      const editedMap = JSON.parse(localStorage.getItem('edo_sdg_edited_ideas') || '{}');
      const customIdeas = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');

      setIdeas((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newOnes = customIdeas.filter((s: Idea) => !existingIds.has(s.id));
        let combined = [...newOnes, ...prev];

        // Filter out deleted
        combined = combined.filter((i) => !deletedIds.has(i.id));

        // Apply edits
        combined = combined.map((i) => (editedMap[i.id] ? { ...i, ...editedMap[i.id] } : i));

        return combined;
      });
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, []);

  const updateStatus = async (id: string, newStatus: Idea['status']) => {
    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );

    // Save in Supabase
    await updateIdeaClient(id, { status: newStatus });

    // Save in LocalStorage
    try {
      const editedMap = JSON.parse(localStorage.getItem('edo_sdg_edited_ideas') || '{}');
      editedMap[id] = { ...(editedMap[id] || {}), status: newStatus };
      localStorage.setItem('edo_sdg_edited_ideas', JSON.stringify(editedMap));

      const customList = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');
      const updatedCustom = customList.map((i: Idea) => (i.id === id ? { ...i, status: newStatus } : i));
      localStorage.setItem('edo_sdg_custom_ideas', JSON.stringify(updatedCustom));
    } catch {
      // ignore
    }

    showToast(`Status updated to "${newStatus.replace(/_/g, ' ')}"`);
  };

  const handleStartEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setEditTitle(idea.title);
    setEditDescription(idea.description);
    setEditCategory(idea.category || CATEGORIES[0]);
    setEditLocation(idea.suggested_location || '');
    setEditAuthor(idea.author_alias || '');
    setEditStatus(idea.status);
    setEditUpvotes(idea.upvotes_count || 0);
    setEditSdgs(idea.target_sdgs || [3]);
  };

  const handleToggleSdg = (sdgNum: number) => {
    setEditSdgs((prev) =>
      prev.includes(sdgNum) ? prev.filter((n) => n !== sdgNum) : [...prev, sdgNum].sort((a, b) => a - b)
    );
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdea) return;
    if (!editTitle.trim() || !editDescription.trim()) {
      showToast('Title and Description are required.');
      return;
    }

    setIsSaving(true);
    const updated: Idea = {
      ...editingIdea,
      title: editTitle.trim(),
      description: editDescription.trim(),
      category: editCategory,
      suggested_location: editLocation.trim() || 'Egor LGA, Benin City',
      author_alias: editAuthor.trim() || 'Anonymous Corper',
      status: editStatus,
      upvotes_count: Math.max(0, Number(editUpvotes) || 0),
      target_sdgs: editSdgs.length > 0 ? editSdgs : [3],
    };

    try {
      // Supabase update
      await updateIdeaClient(updated.id, {
        title: updated.title,
        description: updated.description,
        category: updated.category,
        suggested_location: updated.suggested_location,
        author_alias: updated.author_alias,
        status: updated.status,
        upvotes_count: updated.upvotes_count,
        target_sdgs: updated.target_sdgs,
      });

      // Local storage persistence
      const editedMap = JSON.parse(localStorage.getItem('edo_sdg_edited_ideas') || '{}');
      editedMap[updated.id] = updated;
      localStorage.setItem('edo_sdg_edited_ideas', JSON.stringify(editedMap));

      const customList = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');
      const updatedCustom = customList.map((i: Idea) => (i.id === updated.id ? updated : i));
      localStorage.setItem('edo_sdg_custom_ideas', JSON.stringify(updatedCustom));

      // Update state
      setIdeas((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      setEditingIdea(null);
      showToast('Proposal updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update proposal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingIdea) return;
    setIsDeleting(true);
    const targetId = deletingIdea.id;

    try {
      // 1. Supabase delete
      await deleteIdeaClient(targetId);

      // 2. Local storage persistence
      const deletedIds = JSON.parse(localStorage.getItem('edo_sdg_deleted_idea_ids') || '[]');
      if (!deletedIds.includes(targetId)) {
        deletedIds.push(targetId);
        localStorage.setItem('edo_sdg_deleted_idea_ids', JSON.stringify(deletedIds));
      }

      const customList = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');
      const filteredCustom = customList.filter((i: Idea) => i.id !== targetId);
      localStorage.setItem('edo_sdg_custom_ideas', JSON.stringify(filteredCustom));

      const editedMap = JSON.parse(localStorage.getItem('edo_sdg_edited_ideas') || '{}');
      delete editedMap[targetId];
      localStorage.setItem('edo_sdg_edited_ideas', JSON.stringify(editedMap));

      // 3. State update
      setIdeas((prev) => prev.filter((i) => i.id !== targetId));
      setDeletingIdea(null);
      showToast('Proposal permanently deleted.');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete proposal.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getMatchedNgos = (idea: Idea): CrawledNgo[] => {
    return EDO_NGO_REGISTRY.filter((ngo) => {
      const sharesSdg = idea.target_sdgs?.some((g) => ngo.sdg_goals.includes(g));
      const sharesCategory =
        (idea.category.toLowerCase().includes('health') && ngo.category.includes('Health')) ||
        (idea.category.toLowerCase().includes('hygiene') && ngo.category.includes('Pads')) ||
        (idea.category.toLowerCase().includes('sanitation') && ngo.category.includes('Sanitation')) ||
        (idea.category.toLowerCase().includes('education') && ngo.sdg_goals.includes(4));
      return sharesSdg || sharesCategory;
    }).slice(0, 3);
  };

  const generateLetterContent = (ngo: CrawledNgo, idea?: Idea) => {
    return `NATIONAL YOUTH SERVICE CORPS
EGOR LOCAL GOVERNMENT AREA • SUSTAINABLE DEVELOPMENT GOALS (SDGs) CDS GROUP
Egor NYSC Secretariat, Benin City, Edo State
Ref: NYSC/ED/EGOR/SDG/${new Date().getFullYear()}/${ngo.id.substring(0, 6).toUpperCase()}
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

To: The Managing Director / CSR Coordinator,
${ngo.name},
${ngo.address}.

REQUISITION FOR STRATEGIC CSR SPONSORSHIP: ${idea ? idea.title.toUpperCase() : 'COMMUNITY DEVELOPMENT INITIATIVE'} (EGOR LGA)

Dear Sir/Madam,

The National Youth Service Corps (NYSC) Egor Local Government Area Sustainable Development Goals (SDGs) Community Development Service (CDS) Group presents this community partnership proposal to ${ngo.name}.

Following grassroots crowdsourcing across Egor LGA, corps members and community members prioritized the following intervention:
"${idea?.description || 'Grassroots sustainable development initiative mapped to local community needs.'}"

KEY PROJECT TARGETS (EGOR LOCAL GOVERNMENT AREA):
1. Target SDGs: [${ngo.sdg_goals.map(g => `Goal ${g}`).join(', ')}].
2. Direct community beneficiaries located at ${idea?.suggested_location || 'Egor LGA'}.
3. Deployment of qualified, serving NYSC corps members with zero administrative overhead.

Designated Official Account Details (NYSC Audited):
Bank Name: First Bank of Nigeria
Account Name: NYSC Edo State SDG CDS Special Projects
Account Number: 2048992011

We request an opportunity to present a 5-minute executive briefing at your convenience.

Yours in National Service,

____________________________                  ____________________________
Corps Member Augusta                          Mrs. A. Osagie
President, NYSC SDGs CDS Group                Schedule Officer / LGI Egor Secretariat
Egor LGA Chapter                              NYSC Edo State Secretariat`;
  };

  const handleCopyPitch = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  // Filter ideas by search & status
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.author_alias && idea.author_alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
      idea.suggested_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black/90 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/20 animate-fadeIn">
          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Executive Moderation & Management</span>
          </div>
          <h2 className="font-headline-sm text-xl sm:text-2xl text-on-surface font-extrabold tracking-tight">
            Idea Moderation, Editing & Deletion
          </h2>
          <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Audit peer vote counts, edit proposal contents, delete inappropriate pitches, and match with vetted Edo State NGOs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/admin/radar"
            className="px-3.5 py-1.5 rounded-xl bg-secondary-fixed/60 text-on-secondary-fixed font-label-sm text-xs font-bold hover:bg-secondary-fixed transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">radar</span>
            <span>Edo NGO Radar</span>
          </a>
          <div className="px-3 py-1.5 rounded-xl bg-surface-container text-primary font-label-sm text-xs font-bold">
            {ideas.length} Proposals
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-low p-3.5 rounded-2xl border border-surface-container">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, category, or corper alias..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Filter:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">All Statuses ({ideas.length})</option>
            <option value="submitted">Submitted (In Voting)</option>
            <option value="under_review">Under Review</option>
            <option value="approved_for_planning">Approved for Planning</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Ideas List */}
      {filteredIdeas.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-surface-container-low border border-dashed border-outline-variant/40 space-y-2">
          <span className="material-symbols-outlined text-[36px] text-on-surface-variant">
            inbox
          </span>
          <p className="text-sm font-bold text-on-surface">No proposals match your filter.</p>
          <p className="text-xs text-on-surface-variant">
            Try adjusting your search query or status filter.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-surface-variant">
          {filteredIdeas.map((idea) => {
            const matchedNgos = getMatchedNgos(idea);

            return (
              <div key={idea.id} className="py-5 space-y-3.5 first:pt-0 last:pb-0">
                {/* Top Row: Category, Votes, Status, and Edit/Delete Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-label-sm text-xs font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
                      {idea.category}
                    </span>
                    <span className="font-label-sm text-xs font-bold text-secondary bg-secondary-fixed/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      <span>{idea.upvotes_count || 0} Votes</span>
                    </span>
                    <span className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                      ID: {idea.id.substring(0, 10)}
                    </span>
                  </div>

                  {/* Actions Bar: Status Selector, Edit Button, Delete Button */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Status:</span>
                      <select
                        value={idea.status}
                        onChange={(e) => updateStatus(idea.id, e.target.value as any)}
                        className="px-2.5 py-1 rounded-lg border border-outline-variant font-label-sm text-xs font-semibold bg-surface-container-lowest text-on-surface focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="submitted">Submitted (In Voting)</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved_for_planning">Approved for Planning</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(idea)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs font-bold transition-all cursor-pointer border border-outline-variant/30"
                      title="Edit this idea proposal"
                    >
                      <span className="material-symbols-outlined text-[15px] text-primary">edit</span>
                      <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeletingIdea(idea)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-error-container/30 hover:bg-error-container text-on-error-container font-label-sm text-xs font-bold transition-all cursor-pointer border border-error-container"
                      title="Delete this idea proposal"
                    >
                      <span className="material-symbols-outlined text-[15px] text-error">delete</span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Proposal Title & Description */}
                <div>
                  <h3 className="font-title-md text-base sm:text-lg font-extrabold text-on-surface">
                    {idea.title}
                  </h3>
                  <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed text-justify">
                    {idea.description}
                  </p>
                </div>

                {/* Matched Edo NGOs Badge & Quick Action */}
                {matchedNgos.length > 0 && (
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-primary flex items-center gap-1 shrink-0">
                        <span className="material-symbols-outlined text-[16px]">handshake</span>
                        <span>Matched Edo Partners:</span>
                      </span>
                      {matchedNgos.map((ngo) => (
                        <button
                          key={ngo.id}
                          type="button"
                          onClick={() => setSelectedNgoForPitch(ngo)}
                          className="px-2 py-0.5 rounded-md bg-surface-container hover:bg-primary hover:text-on-primary font-medium text-[11px] text-on-surface transition-colors cursor-pointer"
                          title={`Click to draft letter to ${ngo.name}`}
                        >
                          {ngo.name} ↗
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-outline italic shrink-0">
                      Click partner name to draft pitch
                    </span>
                  </div>
                )}

                {/* Metadata Footer: Location, Author, Target SDGs */}
                <div className="flex flex-wrap items-center justify-between font-label-sm text-xs text-on-surface-variant gap-2 pt-1 border-t border-surface-container-low">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                      <span>{idea.suggested_location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-outline">person</span>
                      <span>{idea.author_alias || 'Anonymous Corper'}</span>
                    </span>
                  </div>

                  {/* Target SDGs Badges */}
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-outline uppercase">SDGs:</span>
                    {idea.target_sdgs?.map((g) => (
                      <span
                        key={g}
                        style={{ backgroundColor: SDG_METADATA[g]?.color || '#004b24' }}
                        className="w-5 h-5 rounded-md text-white text-[10px] font-bold flex items-center justify-center shadow-2xs"
                        title={`SDG ${g}: ${SDG_METADATA[g]?.name || ''}`}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT IDEA MODAL */}
      {/* ========================================================================= */}
      {editingIdea && (
        <div
          onClick={() => setEditingIdea(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest max-w-2xl w-full rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-surface-container-low border-b border-surface-container flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">edit_note</span>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-on-surface leading-tight">
                    Edit Community Proposal
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Update idea narrative, category, location, or moderation status
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingIdea(null)}
                className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                  Proposal Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs sm:text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="E.g., Borehole Rehabilitation at Evbuotubu Market"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                  Detailed Description <span className="text-error">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs sm:text-sm text-on-surface leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Detail the community challenge, proposed action, and expected beneficiaries..."
                />
              </div>

              {/* 2-Column: Category & Suggested Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                    Suggested Location
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="E.g., Uwelu Market Axis, Egor LGA"
                  />
                </div>
              </div>

              {/* 3-Column: Author Alias, Upvotes, and Moderation Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                    Author Alias
                  </label>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Anonymous Corper"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                    Upvotes Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editUpvotes}
                    onChange={(e) => setEditUpvotes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                    Moderation Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  >
                    <option value="submitted">Submitted (In Voting)</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved_for_planning">Approved for Planning</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Target SDGs Multi-Select */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                  Target SDGs (Click to Toggle)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(SDG_METADATA).map(([numStr, meta]) => {
                    const num = parseInt(numStr);
                    const isSelected = editSdgs.includes(num);

                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleToggleSdg(num)}
                        style={{
                          backgroundColor: isSelected ? meta.color : undefined,
                          borderColor: meta.color,
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'text-white shadow-xs ring-1 ring-white/50'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        <span>Goal {num}</span>
                        {isSelected && <span className="material-symbols-outlined text-[13px]">check</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingIdea(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Saving Changes...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deletingIdea && (
        <div
          onClick={() => setDeletingIdea(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest max-w-md w-full rounded-3xl shadow-2xl border border-error/30 overflow-hidden space-y-4 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-error/15 text-error flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[26px]">delete_forever</span>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-on-surface leading-snug">
                  Delete Proposal?
                </h3>
                <p className="text-xs text-on-surface-variant">
                  This action permanently removes the idea.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
              <p className="text-xs font-bold text-on-surface line-clamp-1">
                "{deletingIdea.title}"
              </p>
              <p className="text-[11px] text-on-surface-variant line-clamp-2">
                {deletingIdea.description}
              </p>
            </div>

            <p className="text-xs text-error font-medium leading-relaxed">
              ⚠️ Warning: Once deleted, this proposal will be erased from community ideation lists and executive review.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingIdea(null)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-error hover:bg-error/90 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PITCH LETTER MODAL */}
      {/* ========================================================================= */}
      {selectedNgoForPitch && (
        <div
          onClick={() => setSelectedNgoForPitch(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest max-w-3xl w-full rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="p-5 sm:p-6 bg-surface-container-low border-b border-surface-container flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">drafts</span>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-on-surface leading-tight">
                    Pitch Letter: {selectedNgoForPitch.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Auto-generated from approved community proposal
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedNgoForPitch(null)}
                className="p-2 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto font-mono text-xs text-on-surface bg-surface-container-lowest leading-relaxed whitespace-pre-wrap select-all">
              {generateLetterContent(selectedNgoForPitch)}
            </div>

            <div className="p-4 sm:p-6 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleCopyPitch(generateLetterContent(selectedNgoForPitch))}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer ${
                  copiedPitch ? 'bg-tertiary text-white' : 'bg-primary hover:bg-primary-container text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedPitch ? 'check_circle' : 'content_copy'}
                </span>
                <span>{copiedPitch ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
