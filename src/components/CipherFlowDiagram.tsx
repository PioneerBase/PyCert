import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  GitBranch,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface CipherCharTrace {
  inputChar: string;
  branch: string;
  isLetter: boolean;
  isUpper: boolean;
  baseChar: string;
  baseCode: number | null;
  charCode: number;
  zeroIndex: number | null;
  rawShifted: number | null;
  wrappedIndex: number | null;
  outputCode: number;
  outputChar: string;
}

interface CipherFlowDiagramProps {
  activeTrace: CipherCharTrace;
  traces: CipherCharTrace[];
  fullOutput: string;
  sampleText: string;
  onChangeSampleText: (nextText: string) => void;
  shift: number;
  onChangeShift: (nextShift: number) => void;
  clampedCharIdx: number;
  totalChars: number;
  onSelectCharIdx: (idx: number) => void;
  flowStepIndex: number;
  onSetFlowStepIndex: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onResetFlow: () => void;
  onJumpToGuideStage: (stageIdx: number) => void;
  isOverlayMode?: boolean;
  onOpenOverlay?: () => void;
  onCloseOverlay?: () => void;
}

const FLOW_STEP_DESCRIPTIONS = [
  'Read the current character from text inside the for loop.',
  'Check whether char is uppercase (A-Z), lowercase (a-z), or another symbol.',
  'Convert the letter from ASCII (65-90 or 97-122) down to a 0-25 alphabet index.',
  'Add the shift offset and apply % 26 so Z wraps smoothly back to A.',
  'Add base back and call chr() to turn the wrapped index into a letter.',
  'Append the finished character to result and join all characters into the output string.',
];

export const CipherFlowDiagram: React.FC<CipherFlowDiagramProps> = ({
  activeTrace,
  traces,
  fullOutput,
  sampleText,
  onChangeSampleText,
  shift,
  onChangeShift,
  clampedCharIdx,
  totalChars,
  onSelectCharIdx,
  flowStepIndex,
  onSetFlowStepIndex,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onResetFlow,
  onJumpToGuideStage,
  isOverlayMode = false,
  onOpenOverlay,
  onCloseOverlay,
}) => {
  const displayInputChar = activeTrace.inputChar === ' ' ? '␣ (space)' : `"${activeTrace.inputChar}"`;
  const displayOutputChar = activeTrace.outputChar === ' ' ? '␣ (space)' : `"${activeTrace.outputChar}"`;

  const isNodeActive = (nodeIdx: number) => flowStepIndex === nodeIdx;

  const nodeCardClass = (nodeIdx: number, enabled = true) => {
    if (!enabled) {
      return 'p-3.5 rounded-xl border border-dashed border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-[#EBE9DF]/45 dark:bg-[#141C24]/55 text-[#5D6D7E] dark:text-[#BDC3C7]/60 opacity-75 transition-colors cursor-pointer text-left';
    }
    if (isNodeActive(nodeIdx)) {
      return 'p-3.5 rounded-xl border-2 border-[#5A1827] dark:border-amber-400 bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] shadow-sm ring-2 ring-[#5A1827]/20 dark:ring-amber-400/20 transition-colors cursor-pointer text-left';
    }
    return 'p-3.5 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] hover:border-[#1E3A78] transition-colors cursor-pointer text-left';
  };

  return (
    <div
      className={`rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] ${
        isOverlayMode ? 'p-5 sm:p-6 space-y-5' : 'p-5 sm:p-6 space-y-4'
      }`}
    >
      {/* Diagram Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#5A1827] dark:text-amber-300" />
            <h2 className="text-base sm:text-lg font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
              CLI Cipher Logic Flow Diagram
            </h2>
          </div>
          <p className="text-xs text-[#2C3E50]/75 dark:text-[#BDC3C7]">
            Click any flow node to jump to its lesson step, or press Play Flow to watch{' '}
            <code className="font-mono font-bold text-[#5A1827] dark:text-amber-300">{displayInputChar}</code>{' '}
            travel from input to output.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isPlaying
                ? 'bg-[#1E3A78] text-[#F5F5DC] hover:bg-[#162C5C]'
                : 'bg-[#5A1827] text-[#F5F5DC] hover:bg-[#48121E]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Flow' : 'Play Flow'}</span>
          </button>

          <button
            type="button"
            onClick={onStepForward}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] border border-[#BDC3C7] dark:border-[#2C3E50] hover:border-[#1E3A78] flex items-center gap-1.5 cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Step Node</span>
          </button>

          <button
            type="button"
            onClick={onResetFlow}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] border border-[#BDC3C7] dark:border-[#2C3E50] hover:border-[#1E3A78] flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {!isOverlayMode && onOpenOverlay && (
            <button
              type="button"
              onClick={onOpenOverlay}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1E3A78] text-[#F5F5DC] hover:bg-[#162C5C] flex items-center gap-1.5 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Overlay</span>
            </button>
          )}

          {isOverlayMode && onCloseOverlay && (
            <button
              type="button"
              onClick={onCloseOverlay}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] border border-[#BDC3C7] dark:border-[#2C3E50] hover:border-[#5A1827] flex items-center gap-1.5 cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Close Overlay</span>
            </button>
          )}
        </div>
      </div>

      {/* Overlay-only Inline Input / Shift Controls so user can test freely inside the modal */}
      {isOverlayMode && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/80 dark:border-[#2C3E50]">
          <div className="space-y-1">
            <label htmlFor="overlay-sample-text" className="block text-[11px] font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
              Input Message (text)
            </label>
            <input
              id="overlay-sample-text"
              type="text"
              maxLength={24}
              value={sampleText}
              onChange={(e) => {
                onChangeSampleText(e.target.value);
                onSelectCharIdx(0);
              }}
              className="w-full px-3 py-1.5 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#141C24] font-mono text-xs text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <label htmlFor="overlay-shift-slider" className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                Shift Offset
              </label>
              <span className="font-mono font-bold text-[#1E3A78] dark:text-amber-300 tabular-nums">
                {shift >= 0 ? `+${shift}` : shift}
              </span>
            </div>
            <input
              id="overlay-shift-slider"
              type="range"
              min={-10}
              max={10}
              step={1}
              value={shift}
              onChange={(e) => onChangeShift(Number(e.target.value))}
              className="w-full accent-[#5A1827] cursor-pointer mt-1.5"
            />
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
              Selected Character ({clampedCharIdx + 1} of {totalChars})
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {traces.map((t, idx) => (
                <button
                  key={`ov-${idx}-${t.inputChar}`}
                  type="button"
                  onClick={() => onSelectCharIdx(idx)}
                  className={`px-2 py-1 rounded border font-mono text-xs cursor-pointer shrink-0 ${
                    idx === clampedCharIdx
                      ? 'bg-[#5A1827] text-[#F5F5DC] border-[#5A1827] font-bold'
                      : 'bg-[#FAF9F5] dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] border-[#BDC3C7] dark:border-[#2C3E50]'
                  }`}
                >
                  {t.inputChar === ' ' ? '␣' : t.inputChar}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Node Narrative + Char Step Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#141C24] border border-[#2C3E50] text-xs font-mono text-[#F5F5DC]">
        <div className="flex items-center gap-2">
          <span className="text-amber-300 font-bold shrink-0">
            Stage {flowStepIndex + 1}/6:
          </span>
          <span className="text-[#F5F5DC]">{FLOW_STEP_DESCRIPTIONS[flowStepIndex]}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={clampedCharIdx <= 0}
            onClick={() => onSelectCharIdx(Math.max(0, clampedCharIdx - 1))}
            className="px-2 py-1 rounded border border-[#2C3E50] bg-[#1E2936] text-[#F5F5DC] disabled:opacity-40 cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>Prev Char</span>
          </button>
          <button
            type="button"
            disabled={clampedCharIdx >= totalChars - 1}
            onClick={() => onSelectCharIdx(Math.min(totalChars - 1, clampedCharIdx + 1))}
            className="px-2 py-1 rounded border border-[#2C3E50] bg-[#1E2936] text-[#F5F5DC] disabled:opacity-40 cursor-pointer flex items-center gap-1"
          >
            <span>Next Char</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Flowchart Topology */}
      <div className="space-y-2.5">
        {/* Top Row: Node 0 (Input) -> Node 1 (Branch Check) */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-2.5 items-stretch">
          {/* Node 0: Input Char */}
          <button
            type="button"
            onClick={() => {
              onSetFlowStepIndex(0);
              onJumpToGuideStage(0);
            }}
            className={`md:col-span-4 ${nodeCardClass(0)}`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="font-bold text-[#1E3A78] dark:text-amber-300">1. INPUT LOOP</span>
              {isNodeActive(0) && (
                <span className="font-bold text-[#5A1827] dark:text-amber-300">ACTIVE NODE</span>
              )}
            </div>
            <div className="font-mono text-xs font-bold">for char in text:</div>
            <div className="mt-1.5 text-xs font-mono text-[#5D6D7E] dark:text-[#BDC3C7]">
              Current char[{clampedCharIdx}] ={' '}
              <strong className="text-[#5A1827] dark:text-amber-300">{displayInputChar}</strong>
            </div>
          </button>

          <div className="hidden md:flex md:col-span-1 items-center justify-center text-[#1E3A78] dark:text-amber-300">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="flex md:hidden items-center justify-center text-[#1E3A78] dark:text-amber-300">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Node 1: Branch Decision */}
          <button
            type="button"
            onClick={() => {
              onSetFlowStepIndex(1);
              onJumpToGuideStage(0);
            }}
            className={`md:col-span-6 ${nodeCardClass(1)}`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="font-bold text-[#1E3A78] dark:text-amber-300">2. CHARACTER TYPE CHECK</span>
              {isNodeActive(1) && (
                <span className="font-bold text-[#5A1827] dark:text-amber-300">ACTIVE NODE</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px] mt-1">
              <div
                className={`px-2 py-1 rounded border text-center ${
                  activeTrace.isLetter && activeTrace.isUpper
                    ? 'bg-[#1E3A78] text-[#F5F5DC] border-[#1E3A78] font-bold'
                    : 'bg-[#FAF9F5] dark:bg-[#141C24] border-[#BDC3C7]/70 dark:border-[#2C3E50] text-[#5D6D7E] dark:text-[#BDC3C7]'
                }`}
              >
                isupper() {activeTrace.isLetter && activeTrace.isUpper ? '✓' : '·'}
              </div>
              <div
                className={`px-2 py-1 rounded border text-center ${
                  activeTrace.isLetter && !activeTrace.isUpper
                    ? 'bg-[#1E3A78] text-[#F5F5DC] border-[#1E3A78] font-bold'
                    : 'bg-[#FAF9F5] dark:bg-[#141C24] border-[#BDC3C7]/70 dark:border-[#2C3E50] text-[#5D6D7E] dark:text-[#BDC3C7]'
                }`}
              >
                islower() {activeTrace.isLetter && !activeTrace.isUpper ? '✓' : '·'}
              </div>
              <div
                className={`px-2 py-1 rounded border text-center ${
                  !activeTrace.isLetter
                    ? 'bg-[#5A1827] text-[#F5F5DC] border-[#5A1827] font-bold'
                    : 'bg-[#FAF9F5] dark:bg-[#141C24] border-[#BDC3C7]/70 dark:border-[#2C3E50] text-[#5D6D7E] dark:text-[#BDC3C7]'
                }`}
              >
                else {!activeTrace.isLetter ? '✓' : '·'}
              </div>
            </div>
            <div className="mt-1.5 text-[11px] font-mono text-[#5D6D7E] dark:text-[#BDC3C7]">
              Taken branch: <strong className="text-[#2C3E50] dark:text-[#F5F5DC]">{activeTrace.branch}</strong>
            </div>
          </button>
        </div>

        {/* Connector Label */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-[11px] font-mono text-center">
          <div className="lg:col-span-9 flex items-center justify-center gap-1.5 text-[#1E3A78] dark:text-sky-300 font-semibold">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>
              {activeTrace.isLetter
                ? `Letter Path ACTIVE (base = ord("${activeTrace.baseChar}") = ${activeTrace.baseCode})`
                : 'Letter Path BYPASSED (not A-Z / a-z)'}
            </span>
          </div>
          <div className="lg:col-span-3 flex items-center justify-center gap-1.5 text-[#5A1827] dark:text-amber-300 font-semibold">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>{!activeTrace.isLetter ? 'Symbol Bypass ACTIVE' : 'Symbol Bypass (Skipped)'}</span>
          </div>
        </div>

        {/* Branch Split Row: Letter Transform Pipeline (9 cols) vs Symbol Bypass (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* Letter Transform Pipeline */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-11 gap-2 items-stretch">
            {/* Node 2: ASCII -> 0-25 Index */}
            <button
              type="button"
              onClick={() => {
                onSetFlowStepIndex(2);
                onJumpToGuideStage(1);
              }}
              className={`md:col-span-3 ${nodeCardClass(2, activeTrace.isLetter)}`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="font-bold text-[#1E3A78] dark:text-sky-300">3. 0-25 INDEX</span>
                {activeTrace.isLetter && isNodeActive(2) && (
                  <span className="font-bold text-[#5A1827] dark:text-amber-300">ACTIVE</span>
                )}
              </div>
              <div className="font-mono text-xs font-bold">ord(char) - base</div>
              <div className="mt-1.5 font-mono text-xs tabular-nums">
                {activeTrace.isLetter
                  ? `${activeTrace.charCode} - ${activeTrace.baseCode} = ${activeTrace.zeroIndex}`
                  : 'Skipped for symbol'}
              </div>
            </button>

            <div className="hidden md:flex md:col-span-1 items-center justify-center text-[#1E3A78] dark:text-sky-300">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Node 3: Shift & Wrap % 26 */}
            <button
              type="button"
              onClick={() => {
                onSetFlowStepIndex(3);
                onJumpToGuideStage(2);
              }}
              className={`md:col-span-3 ${nodeCardClass(3, activeTrace.isLetter)}`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="font-bold text-[#1E3A78] dark:text-emerald-300">4. SHIFT & % 26</span>
                {activeTrace.isLetter && isNodeActive(3) && (
                  <span className="font-bold text-[#5A1827] dark:text-amber-300">ACTIVE</span>
                )}
              </div>
              <div className="font-mono text-xs font-bold">(index + shift) % 26</div>
              <div className="mt-1.5 font-mono text-xs tabular-nums">
                {activeTrace.isLetter
                  ? `(${activeTrace.zeroIndex} ${shift >= 0 ? `+ ${shift}` : `- ${Math.abs(shift)}`}) % 26 = ${activeTrace.wrappedIndex}`
                  : 'Skipped for symbol'}
              </div>
            </button>

            <div className="hidden md:flex md:col-span-1 items-center justify-center text-[#1E3A78] dark:text-sky-300">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Node 4: chr() Back to Letter */}
            <button
              type="button"
              onClick={() => {
                onSetFlowStepIndex(4);
                onJumpToGuideStage(3);
              }}
              className={`md:col-span-3 ${nodeCardClass(4, activeTrace.isLetter)}`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="font-bold text-[#1E3A78] dark:text-amber-300">5. CHR() LETTER</span>
                {activeTrace.isLetter && isNodeActive(4) && (
                  <span className="font-bold text-[#5A1827] dark:text-amber-300">ACTIVE</span>
                )}
              </div>
              <div className="font-mono text-xs font-bold">chr(shifted + base)</div>
              <div className="mt-1.5 font-mono text-xs tabular-nums">
                {activeTrace.isLetter
                  ? `chr(${activeTrace.wrappedIndex} + ${activeTrace.baseCode}) = "${activeTrace.outputChar}"`
                  : 'Skipped for symbol'}
              </div>
            </button>
          </div>

          {/* Right Branch: Symbol Bypass */}
          <button
            type="button"
            onClick={() => {
              onSetFlowStepIndex(2);
              onJumpToGuideStage(0);
            }}
            className={`lg:col-span-3 ${nodeCardClass(2, !activeTrace.isLetter)}`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="font-bold text-[#5A1827] dark:text-amber-300">ELSE BYPASS</span>
              {!activeTrace.isLetter && isNodeActive(2) && (
                <span className="font-bold text-[#5A1827] dark:text-amber-300">ACTIVE</span>
              )}
            </div>
            <div className="font-mono text-xs font-bold">Keep char as-is</div>
            <div className="mt-1.5 font-mono text-xs">
              {!activeTrace.isLetter
                ? `${displayInputChar} → ${displayOutputChar} (no shift)`
                : `Unused for letter ${displayInputChar}`}
            </div>
          </button>
        </div>

        {/* Converging Arrow */}
        <div className="flex items-center justify-center text-[#1E3A78] dark:text-emerald-300">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Node 5: Append & Join Output */}
        <button
          type="button"
          onClick={() => {
            onSetFlowStepIndex(5);
            onJumpToGuideStage(4);
          }}
          className={`w-full ${nodeCardClass(5)}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  6. APPEND & JOIN OUTPUT
                </span>
                {isNodeActive(5) && (
                  <span className="font-bold text-[#5A1827] dark:text-amber-300">ACTIVE NODE</span>
                )}
              </div>
              <div className="font-mono text-xs font-bold">
                result.append({displayOutputChar}) → return "".join(result)
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-lg bg-[#141C24] border border-[#2C3E50] font-mono text-xs text-emerald-300 font-bold shrink-0">
              Output: "{fullOutput}"
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
