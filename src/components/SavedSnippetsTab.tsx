import React, { useState, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { NotebookCell, SavedSnippet } from '../types';
import {
  Bookmark,
  Plus,
  Search,
  Copy,
  Check,
  Pencil,
  Trash2,
  CornerDownRight,
  Code2,
  X,
  Save,
} from 'lucide-react';

interface SavedSnippetsTabProps {
  cells: NotebookCell[];
  onInsertIntoCell: (cellId: string, snippetCode: string) => void;
  onSwitchToNotebook: () => void;
}

const SNIPPET_TAGS = [
  'Domain 1',
  'Domain 2',
  'Domain 3',
  'Domain 4',
  'Domain 5',
  'Worked Pattern',
  'General Python',
];

export const SavedSnippetsTab: React.FC<SavedSnippetsTabProps> = ({
  cells,
  onInsertIntoCell,
  onSwitchToNotebook,
}) => {
  const {
    savedSnippets,
    addSavedSnippet,
    updateSavedSnippet,
    deleteSavedSnippet,
    currentProject,
  } = useProgress();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [targetCellMap, setTargetCellMap] = useState<Record<string, string>>({});

  // Create new snippet state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTag, setNewTag] = useState<string>(`Domain ${currentProject.sectionNumber}`);
  const [newNote, setNewNote] = useState<string>('');
  const [newCode, setNewCode] = useState<string>('');

  // Edit existing snippet state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editTag, setEditTag] = useState<string>('General Python');
  const [editNote, setEditNote] = useState<string>('');
  const [editCode, setEditCode] = useState<string>('');

  const availableTags = useMemo(() => {
    const used = new Set(savedSnippets.map((s) => s.tag));
    return ['All', ...SNIPPET_TAGS.filter((t) => used.has(t))];
  }, [savedSnippets]);

  const filteredSnippets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return savedSnippets.filter((snip) => {
      const matchesTag = selectedTagFilter === 'All' || snip.tag === selectedTagFilter;
      if (!matchesTag) return false;
      if (!q) return true;
      return (
        snip.title.toLowerCase().includes(q) ||
        snip.code.toLowerCase().includes(q) ||
        (snip.note || '').toLowerCase().includes(q) ||
        (snip.sourceProjectTitle || '').toLowerCase().includes(q) ||
        snip.tag.toLowerCase().includes(q)
      );
    });
  }, [savedSnippets, searchQuery, selectedTagFilter]);

  const handleCopy = (snippet: SavedSnippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;
    addSavedSnippet({
      title: newTitle.trim(),
      code: newCode,
      note: newNote.trim() || undefined,
      tag: newTag,
      sourceProjectTitle: currentProject.title,
    });
    setNewTitle('');
    setNewNote('');
    setNewCode('');
    setIsCreating(false);
  };

  const startEditing = (snip: SavedSnippet) => {
    setEditingId(snip.id);
    setEditTitle(snip.title);
    setEditTag(snip.tag);
    setEditNote(snip.note || '');
    setEditCode(snip.code);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim() || !editCode.trim()) return;
    updateSavedSnippet(id, {
      title: editTitle.trim(),
      tag: editTag,
      note: editNote.trim() || undefined,
      code: editCode,
    });
    setEditingId(null);
  };

  const defaultInsertCellId =
    cells.find((c) => c.kind === 'step')?.id || cells[0]?.id || 'main';

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#1E3A78] dark:text-amber-300">
            <Bookmark className="w-3.5 h-3.5" />
            <span>CODE REFERENCE LIBRARY · {savedSnippets.length} SAVED</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
            Saved Snippets
          </h2>
          <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] max-w-2xl">
            Bookmark useful Python blocks from any notebook cell or worked pattern and insert them directly into your active lab whenever you need a reference.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setNewTag(`Domain ${currentProject.sectionNumber}`);
              setIsCreating((prev) => !prev);
            }}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            {isCreating ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isCreating ? 'Cancel' : 'New Snippet'}</span>
          </button>

          <button
            type="button"
            onClick={onSwitchToNotebook}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Back to Notebook</span>
          </button>
        </div>
      </div>

      {/* Create New Snippet Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 sm:p-5 rounded-2xl border border-[#1E3A78]/50 bg-[#FAF9F5] dark:bg-[#1A2634] space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#1E3A78] dark:text-amber-300">
              Add Custom Code Snippet
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                Snippet Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Safe int() conversion with try/except"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                Category / Domain
              </label>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
              >
                {SNIPPET_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
              Python Code
            </label>
            <textarea
              required
              rows={5}
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              spellCheck={false}
              placeholder="Paste or write a Python snippet you want to keep handy..."
              className="w-full p-3 font-mono text-xs rounded-lg border border-[#2C3E50] bg-[#1E2936] text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
              Study Note (Optional)
            </label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="When to use this pattern or PCEP exam gotcha to remember..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#BDC3C7] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Snippet</span>
            </button>
          </div>
        </form>
      )}

      {/* Search & Tag Filter Bar */}
      {savedSnippets.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7]/70 dark:border-[#2C3E50]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[#2C3E50]/50 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved snippets by title, code, or note..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTagFilter(tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                  selectedTagFilter === tag
                    ? 'bg-[#1E3A78] text-[#F5F5DC]'
                    : 'bg-white dark:bg-[#141C24] text-[#2C3E50]/80 dark:text-[#BDC3C7] border border-[#BDC3C7]/60 dark:border-[#2C3E50] hover:border-[#1E3A78]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Snippets List or Empty State */}
      {savedSnippets.length === 0 ? (
        <div className="p-8 sm:p-10 rounded-2xl border border-dashed border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#1A2634] text-center space-y-3">
          <div className="w-11 h-11 rounded-xl bg-[#1E3A78]/10 dark:bg-amber-400/10 text-[#1E3A78] dark:text-amber-300 flex items-center justify-center mx-auto">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
            No Saved Snippets Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#2C3E50]/75 dark:text-[#BDC3C7] max-w-lg mx-auto leading-relaxed">
            In any notebook cell, highlight specific lines (or leave nothing selected to capture the whole cell) and click <strong>Save Snippet</strong> in the cell toolbar. You can also bookmark worked patterns or add your own custom snippets here.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Snippet</span>
            </button>
            <button
              type="button"
              onClick={onSwitchToNotebook}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#141C24] border border-[#BDC3C7] dark:border-[#2C3E50] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Go to Notebook Cells</span>
            </button>
          </div>
        </div>
      ) : filteredSnippets.length === 0 ? (
        <div className="p-8 rounded-2xl border border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#1A2634] text-center space-y-2">
          <p className="text-sm font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
            No snippets match your current filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTagFilter('All');
            }}
            className="text-xs font-semibold text-[#1E3A78] dark:text-amber-300 hover:underline cursor-pointer"
          >
            Clear search and filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSnippets.map((snip) => {
            const isEditing = editingId === snip.id;
            const selectedInsertCellId = targetCellMap[snip.id] || defaultInsertCellId;
            const lineCount = snip.code.split('\n').length;

            return (
              <article
                key={snip.id}
                className="rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#1A2634] overflow-hidden flex flex-col shadow-xs"
              >
                {isEditing ? (
                  <div className="p-4 space-y-3 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="sm:col-span-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC]"
                      />
                      <select
                        value={editTag}
                        onChange={(e) => setEditTag(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC]"
                      >
                        {SNIPPET_TAGS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      rows={5}
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      spellCheck={false}
                      className="w-full p-3 font-mono text-xs rounded-lg border border-[#2C3E50] bg-[#1E2936] text-[#F5F5DC]"
                    />
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Optional note..."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#BDC3C7] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(snip.id)}
                        className="px-3.5 py-1 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Card Header */}
                    <div className="px-4 py-3 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#1E3A78] text-[#F5F5DC]">
                            {snip.tag}
                          </span>
                          <span className="font-mono text-[10px] text-[#5D6D7E] dark:text-[#BDC3C7] tabular-nums">
                            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
                          </span>
                          <span className="font-mono text-[10px] text-[#5D6D7E] dark:text-[#BDC3C7]">
                            · {new Date(snip.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#2C3E50] dark:text-[#F5F5DC] truncate">
                          {snip.title}
                        </h3>
                        {snip.sourceProjectTitle && (
                          <p className="text-[11px] font-mono text-[#2C3E50]/65 dark:text-[#BDC3C7] truncate">
                            From: {snip.sourceProjectTitle}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditing(snip)}
                          className="p-1.5 rounded-lg text-[#2C3E50]/70 dark:text-[#BDC3C7] hover:text-[#1E3A78] dark:hover:text-[#F5F5DC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                          title="Edit snippet"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSavedSnippet(snip.id)}
                          className="p-1.5 rounded-lg text-[#2C3E50]/70 dark:text-[#BDC3C7] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete snippet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Optional Note */}
                    {snip.note && (
                      <div className="px-4 py-2 bg-white/70 dark:bg-[#141C24]/60 border-b border-[#BDC3C7]/40 dark:border-[#2C3E50] text-xs text-[#2C3E50]/85 dark:text-[#BDC3C7]">
                        {snip.note}
                      </div>
                    )}

                    {/* Code Block */}
                    <div className="bg-[#1E2936] p-3.5 overflow-x-auto flex-1">
                      <pre className="font-mono text-xs leading-relaxed text-[#F5F5DC]">
                        <code>{snip.code}</code>
                      </pre>
                    </div>

                    {/* Card Footer: Copy & Insert into Active Lab Cell */}
                    <div className="px-4 py-2.5 bg-[#141C24] border-t border-[#2C3E50] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleCopy(snip)}
                        className="px-2.5 py-1 rounded text-[#F5F5DC] bg-[#1E2936] hover:bg-[#2C3E50] border border-[#2C3E50] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedId === snip.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {cells.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <select
                            value={selectedInsertCellId}
                            onChange={(e) =>
                              setTargetCellMap((prev) => ({
                                ...prev,
                                [snip.id]: e.target.value,
                              }))
                            }
                            aria-label="Target notebook cell for insertion"
                            className="px-2 py-1 rounded text-[11px] font-mono bg-[#1E2936] text-[#F5F5DC] border border-[#2C3E50] max-w-[165px] truncate focus:outline-hidden"
                          >
                            {cells.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.title}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => onInsertIntoCell(selectedInsertCellId, snip.code)}
                            className="px-2.5 py-1 rounded text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#6B1D2F] transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                            title="Append this snippet into the selected cell in the active notebook"
                          >
                            <CornerDownRight className="w-3.5 h-3.5" />
                            <span>Insert</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
