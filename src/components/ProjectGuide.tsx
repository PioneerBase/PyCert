import React, { useEffect, useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { CipherFlowDiagram } from './CipherFlowDiagram';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  GitBranch,
  HelpCircle,
  Maximize2,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
} from 'lucide-react';

interface GuideStage {
  stepNumber: number;
  title: string;
  formulaLabel: string;
  plainExplanation: string;
  whyItMatters: string;
  highlightedLines: number[];
  quizQuestion: string;
  quizOptions: string[];
  correctOptionIndex: number;
  quizExplanation: string;
}

const CIPHER_CODE_LINES = [
  'def caesar_cipher(text, shift):',
  '    result = []',
  '    for char in text:',
  '        if char.isupper():',
  '            base = ord("A")',
  '            index = ord(char) - base',
  '            shifted = (index + shift) % 26',
  '            result.append(chr(shifted + base))',
  '        elif char.islower():',
  '            base = ord("a")',
  '            index = ord(char) - base',
  '            shifted = (index + shift) % 26',
  '            result.append(chr(shifted + base))',
  '        else:',
  '            result.append(char)',
  '    return "".join(result)',
];

const GUIDE_STAGES: GuideStage[] = [
  {
    stepNumber: 1,
    title: 'Sort Uppercase, Lowercase, and Symbols',
    formulaLabel: 'char.isupper() · char.islower() · else',
    plainExplanation:
      'Before shifting a character, check what kind of character it is. Uppercase letters (A-Z), lowercase letters (a-z), and symbols/spaces each need their own branch so spaces and punctuation are never scrambled.',
    whyItMatters:
      'If you shifted a space (" ", code 32) by +3, it would turn into a "#" symbol! Checking .isupper() and .islower() protects spaces, numbers, and punctuation.',
    highlightedLines: [3, 4, 9, 14, 15],
    quizQuestion: 'What happens to "!" or " " inside caesar_cipher("Hi!", 3)?',
    quizOptions: [
      'It enters the else branch and stays unchanged',
      'It shifts 3 letters forward like "A"',
      'It raises a ValueError',
    ],
    correctOptionIndex: 0,
    quizExplanation:
      'Neither "!" nor " " is uppercase or lowercase, so Python runs the else branch and appends char as-is.',
  },
  {
    stepNumber: 2,
    title: 'Convert Letter to a 0-25 Alphabet Position',
    formulaLabel: 'index = ord(char) - base',
    plainExplanation:
      'ord() turns a character into its ASCII number: "A" is 65 and "Z" is 90. Subtracting base (65 for uppercase, 97 for lowercase) converts A-Z into clean 0-25 positions (A=0, B=1, ..., Z=25).',
    whyItMatters:
      'Doing wrap-around math directly on 65-90 is messy. Turning A-Z into 0-25 lets us treat the alphabet like a 26-hour clock.',
    highlightedLines: [5, 6, 10, 11],
    quizQuestion: 'Since ord("A") is 65 and ord("C") is 67, what is ord("C") - ord("A")?',
    quizOptions: ['0', '2', '3'],
    correctOptionIndex: 1,
    quizExplanation:
      '67 - 65 = 2, which matches C being at 0-based index 2 (A=0, B=1, C=2).',
  },
  {
    stepNumber: 3,
    title: 'Shift and Wrap Around with Modulo (% 26)',
    formulaLabel: 'shifted = (index + shift) % 26',
    plainExplanation:
      'Add the shift to the 0-25 index, then take % 26 (the remainder after dividing by 26). If index + shift goes past 25 (like Y=24 plus 3 = 27), 27 % 26 wraps smoothly back to 1 (B)!',
    whyItMatters:
      'Modulo (%) also handles negative shifts for decoding! In Python, (-1) % 26 evaluates to 25 (Z), so shifting backward from A wraps cleanly to Z.',
    highlightedLines: [7, 12],
    quizQuestion: 'If "Z" has index 25 and shift is 3, what does (25 + 3) % 26 equal?',
    quizOptions: ['28', '2', '26'],
    correctOptionIndex: 1,
    quizExplanation:
      '25 + 3 = 28. Dividing 28 by 26 gives 1 with a remainder of 2 (which is "C").',
  },
  {
    stepNumber: 4,
    title: 'Convert the New Position Back to a Letter',
    formulaLabel: 'chr(shifted + base)',
    plainExplanation:
      'Add base back (65 for uppercase or 97 for lowercase) to move from 0-25 back into real ASCII numbers, then call chr() to turn that number back into a single letter.',
    whyItMatters:
      'ord() goes letter -> number, and chr() is its exact opposite: number -> letter. For example, chr(2 + 65) is chr(67), which is "C".',
    highlightedLines: [8, 13],
    quizQuestion: 'If shifted is 1 and base is ord("A") = 65, what does chr(1 + 65) return?',
    quizOptions: ['"A"', '"B"', '"66"'],
    correctOptionIndex: 1,
    quizExplanation: '1 + 65 = 66, and ASCII code 66 is uppercase "B".',
  },
  {
    stepNumber: 5,
    title: 'Collect Characters in a List & Join Them',
    formulaLabel: 'result.append(...) + "".join(result)',
    plainExplanation:
      'Python strings cannot be modified in place (text[0] = "X" raises a TypeError). Instead, collect each finished character inside a list called result, then combine them at the end with "".join(result).',
    whyItMatters:
      'Building a list and joining once at the end is both PCEP-idiomatic and faster than repeatedly gluing strings together with +=.',
    highlightedLines: [2, 8, 13, 15, 16],
    quizQuestion: 'What does "".join(["M", "Z", "B", "M"]) return?',
    quizOptions: ['["MZBM"]', '"M Z B M"', '"MZBM"'],
    correctOptionIndex: 2,
    quizExplanation:
      'The separator before .join() is the empty string "", so all characters connect with no spaces between them.',
  },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function computeCipherCharTrace(char: string, shift: number) {
  const isUpper = char >= 'A' && char <= 'Z';
  const isLower = char >= 'a' && char <= 'z';

  if (!isUpper && !isLower) {
    return {
      inputChar: char,
      branch: 'else (symbol / space)',
      isLetter: false,
      isUpper: false,
      baseChar: '-',
      baseCode: null as number | null,
      charCode: char.charCodeAt(0),
      zeroIndex: null as number | null,
      rawShifted: null as number | null,
      wrappedIndex: null as number | null,
      outputCode: char.charCodeAt(0),
      outputChar: char,
    };
  }

  const baseChar = isUpper ? 'A' : 'a';
  const baseCode = baseChar.charCodeAt(0);
  const charCode = char.charCodeAt(0);
  const zeroIndex = charCode - baseCode;
  const rawShifted = zeroIndex + shift;
  const wrappedIndex = ((rawShifted % 26) + 26) % 26;
  const outputCode = wrappedIndex + baseCode;
  const outputChar = String.fromCharCode(outputCode);

  return {
    inputChar: char,
    branch: isUpper ? 'if char.isupper()' : 'elif char.islower()',
    isLetter: true,
    isUpper,
    baseChar,
    baseCode,
    charCode,
    zeroIndex,
    rawShifted,
    wrappedIndex,
    outputCode,
    outputChar,
  };
}

export const ProjectGuide: React.FC = () => {
  const { selectProject, setActiveView } = useProgress();

  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [sampleText, setSampleText] = useState<string>('PYTHON!');
  const [shift, setShift] = useState<number>(3);
  const [selectedCharIdx, setSelectedCharIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFlowDiagram, setShowFlowDiagram] = useState<boolean>(true);
  const [isFlowOverlayOpen, setIsFlowOverlayOpen] = useState<boolean>(false);
  const [flowStepIndex, setFlowStepIndex] = useState<number>(0);
  const [isFlowPlaying, setIsFlowPlaying] = useState<boolean>(false);

  const safeChars = sampleText.length > 0 ? sampleText.split('') : ['A'];
  const clampedCharIdx = Math.min(selectedCharIdx, safeChars.length - 1);
  const traces = safeChars.map((ch) => computeCipherCharTrace(ch, shift));
  const activeTrace = traces[clampedCharIdx];
  const fullOutput = traces.map((t) => t.outputChar).join('');
  const currentStage = GUIDE_STAGES[activeStageIdx];

  const getNextFlowStep = (current: number, isLetter: boolean): number => {
    if (!isLetter) {
      if (current === 0) return 1;
      if (current === 1) return 2;
      if (current >= 2 && current < 5) return 5;
      return 0;
    }
    return current >= 5 ? 0 : current + 1;
  };

  useEffect(() => {
    if (!isFlowPlaying) return;
    const timer = window.setInterval(() => {
      setFlowStepIndex((prev) => getNextFlowStep(prev, activeTrace.isLetter));
    }, 1150);
    return () => window.clearInterval(timer);
  }, [isFlowPlaying, activeTrace.isLetter]);

  useEffect(() => {
    if (!isFlowOverlayOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFlowOverlayOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlowOverlayOpen]);

  const handleStepForwardFlow = () => {
    setIsFlowPlaying(false);
    setFlowStepIndex((prev) => getNextFlowStep(prev, activeTrace.isLetter));
  };

  const handleResetFlow = () => {
    setIsFlowPlaying(false);
    setFlowStepIndex(0);
  };

  const handlePreset = (text: string, presetShift: number) => {
    setSampleText(text);
    setShift(presetShift);
    setSelectedCharIdx(0);
    setFlowStepIndex(0);
  };

  const handleOpenCipherInIde = () => {
    selectProject('proj-03b-caesar-cipher');
  };

  const stageAnswer = selectedAnswers[currentStage.stepNumber];
  const isQuizAnswered = stageAnswer !== undefined;
  const isQuizCorrect = stageAnswer === currentStage.correctOptionIndex;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-150">
      {/* Top Header & Navigation Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#BDC3C7]/70 dark:border-[#2C3E50] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1E3A78] dark:text-[#BDC3C7]">
            <span className="font-bold">Project Guide</span>
            <span aria-hidden="true">·</span>
            <span>CLI Cipher Interactive Walkthrough</span>
            <span aria-hidden="true">·</span>
            <span>PCEP Domain 3 (Strings & Lists)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight text-balance">
            How the CLI Caesar Cipher Works Under the Hood
          </h1>
          <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] max-w-3xl leading-relaxed">
            Walk through all 5 implementation steps interactively. Pick any character, adjust the shift slider, and inspect the exact Python values produced at every line before coding it in the IDE.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowFlowDiagram((prev) => !prev)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              showFlowDiagram
                ? 'bg-[#1E3A78] text-[#F5F5DC] border-[#1E3A78] hover:bg-[#162C5C]'
                : 'bg-[#FAF9F5] dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] border-[#BDC3C7] dark:border-[#2C3E50] hover:border-[#1E3A78]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>{showFlowDiagram ? 'Hide Flow Diagram' : 'Show Flow Diagram'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFlowOverlayOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Flow Overlay</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('workspace')}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to IDE</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCipherInIde}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Practice CLI Cipher in IDE</span>
          </button>
        </div>
      </div>

      {/* Collapsible Inline Interactive Flow Diagram */}
      {showFlowDiagram && (
        <CipherFlowDiagram
          activeTrace={activeTrace}
          traces={traces}
          fullOutput={fullOutput}
          sampleText={sampleText}
          onChangeSampleText={setSampleText}
          shift={shift}
          onChangeShift={setShift}
          clampedCharIdx={clampedCharIdx}
          totalChars={safeChars.length}
          onSelectCharIdx={(idx) => {
            setSelectedCharIdx(idx);
            setFlowStepIndex(0);
          }}
          flowStepIndex={flowStepIndex}
          onSetFlowStepIndex={(step) => {
            setIsFlowPlaying(false);
            setFlowStepIndex(step);
          }}
          isPlaying={isFlowPlaying}
          onTogglePlay={() => setIsFlowPlaying((p) => !p)}
          onStepForward={handleStepForwardFlow}
          onResetFlow={handleResetFlow}
          onJumpToGuideStage={(stageIdx) => setActiveStageIdx(stageIdx)}
          onOpenOverlay={() => setIsFlowOverlayOpen(true)}
        />
      )}

      {/* Stage Stepper Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {GUIDE_STAGES.map((stage, idx) => {
          const isActive = idx === activeStageIdx;
          const isStageSolved = selectedAnswers[stage.stepNumber] === stage.correctOptionIndex;
          return (
            <button
              key={stage.stepNumber}
              type="button"
              onClick={() => setActiveStageIdx(idx)}
              className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer space-y-1 ${
                isActive
                  ? 'bg-[#1E3A78] text-[#F5F5DC] border-[#1E3A78] shadow-xs'
                  : 'bg-[#FAF9F5] dark:bg-[#243342] text-[#2C3E50] dark:text-[#F5F5DC] border-[#BDC3C7]/80 dark:border-[#2C3E50] hover:border-[#1E3A78]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={isActive ? 'text-amber-300 font-bold' : 'text-[#5A1827] dark:text-amber-400 font-bold'}>
                  Step 0{stage.stepNumber}
                </span>
                {isStageSolved && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'}`} />
                )}
              </div>
              <div className="text-xs font-bold leading-snug line-clamp-2">
                {stage.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Sandbox Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone (7 cols): Interactive Visualizer + Live Letter Trace */}
        <div className="lg:col-span-7 space-y-5">
          {/* Interactive Controls & Live Input/Output */}
          <div className="p-5 sm:p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BDC3C7]/50 dark:border-[#2C3E50] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Live Character Tracer
                </h2>
                <p className="text-xs text-[#2C3E50]/75 dark:text-[#BDC3C7]">
                  Edit the message, drag the shift slider, or click any character tile to inspect its calculation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePreset('PYTHON!', 3)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] text-[#2C3E50] dark:text-[#F5F5DC] hover:border-[#1E3A78] cursor-pointer whitespace-nowrap"
                >
                  Encode "PYTHON!" (+3)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('ZEBRA', 3)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] text-[#2C3E50] dark:text-[#F5F5DC] hover:border-[#1E3A78] cursor-pointer whitespace-nowrap"
                >
                  Wrap "ZEBRA" (+3)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('SBWKRQ!', -3)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] text-[#2C3E50] dark:text-[#F5F5DC] hover:border-[#1E3A78] cursor-pointer whitespace-nowrap"
                >
                  Decode "SBWKRQ!" (-3)
                </button>
              </div>
            </div>

            {/* Text & Shift Slider Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="cipher-sample-input"
                  className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC]"
                >
                  Input Message (`text`)
                </label>
                <input
                  id="cipher-sample-input"
                  type="text"
                  maxLength={24}
                  value={sampleText}
                  onChange={(e) => {
                    setSampleText(e.target.value);
                    setSelectedCharIdx(0);
                  }}
                  placeholder="Type text to trace..."
                  className="w-full px-3.5 py-2 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] font-mono text-sm text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="cipher-shift-slider"
                    className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]"
                  >
                    Shift Offset (`shift`)
                  </label>
                  <span className="font-mono font-bold text-[#1E3A78] dark:text-amber-300 tabular-nums">
                    {shift >= 0 ? `+${shift}` : shift} {shift < 0 ? 'letters (Decode)' : shift > 0 ? 'letters (Encode)' : 'letters (No change)'}
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShift((s) => Math.max(-10, s - 1))}
                    className="px-2.5 py-1.5 rounded-md border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] font-mono text-xs font-bold hover:border-[#1E3A78] cursor-pointer"
                    aria-label="Decrease shift"
                  >
                    -1
                  </button>
                  <input
                    id="cipher-shift-slider"
                    type="range"
                    min={-10}
                    max={10}
                    step={1}
                    value={shift}
                    onChange={(e) => setShift(Number(e.target.value))}
                    className="flex-1 accent-[#5A1827] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setShift((s) => Math.min(10, s + 1))}
                    className="px-2.5 py-1.5 rounded-md border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] font-mono text-xs font-bold hover:border-[#1E3A78] cursor-pointer"
                    aria-label="Increase shift"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Character Tile Array */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Click a character to trace (`for char in text:`):
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={clampedCharIdx <= 0}
                    onClick={() => setSelectedCharIdx((i) => Math.max(0, i - 1))}
                    className="px-2 py-1 rounded border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] text-[11px] font-mono disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    disabled={clampedCharIdx >= safeChars.length - 1}
                    onClick={() => setSelectedCharIdx((i) => Math.min(safeChars.length - 1, i + 1))}
                    className="px-2 py-1 rounded border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] text-[11px] font-mono disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {traces.map((t, idx) => {
                  const isChosen = idx === clampedCharIdx;
                  return (
                    <button
                      key={`${idx}-${t.inputChar}`}
                      type="button"
                      onClick={() => setSelectedCharIdx(idx)}
                      className={`min-w-[56px] px-2.5 py-2 rounded-xl border font-mono text-center transition-colors cursor-pointer ${
                        isChosen
                          ? 'bg-[#5A1827] text-[#F5F5DC] border-[#5A1827] shadow-xs'
                          : 'bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] border-[#BDC3C7] dark:border-[#2C3E50] hover:border-[#1E3A78]'
                      }`}
                    >
                      <div className="text-sm font-bold">
                        {t.inputChar === ' ' ? '␣' : t.inputChar}
                      </div>
                      <div className={`text-[10px] ${isChosen ? 'text-amber-300' : 'text-[#5D6D7E] dark:text-[#BDC3C7]'}`}>
                        → {t.outputChar === ' ' ? '␣' : t.outputChar}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Arithmetic Trace for Selected Character */}
            <div className="p-4 rounded-xl bg-[#141C24] border border-[#2C3E50] text-[#F5F5DC] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2C3E50] pb-2.5 text-xs font-mono">
                <span>
                  Tracing character <strong className="text-amber-300">"{activeTrace.inputChar}"</strong> (index {clampedCharIdx})
                </span>
                <span className="text-sky-300">
                  Path: {activeTrace.branch}
                </span>
              </div>

              {activeTrace.isLetter ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 font-mono text-xs tabular-nums">
                  <div className="p-3 rounded-lg bg-[#1E2936] border border-[#2C3E50] space-y-1">
                    <div className="text-[10px] text-[#BDC3C7]">1. ASCII Code</div>
                    <div className="font-bold text-sky-300">
                      ord("{activeTrace.inputChar}") = {activeTrace.charCode}
                    </div>
                    <div className="text-[10px] text-[#BDC3C7]">
                      base "{activeTrace.baseChar}" = {activeTrace.baseCode}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1E2936] border border-[#2C3E50] space-y-1">
                    <div className="text-[10px] text-[#BDC3C7]">2. 0-25 Position</div>
                    <div className="font-bold text-amber-300">
                      {activeTrace.charCode} - {activeTrace.baseCode} = {activeTrace.zeroIndex}
                    </div>
                    <div className="text-[10px] text-[#BDC3C7]">
                      Letter #{(activeTrace.zeroIndex ?? 0) + 1} of 26
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1E2936] border border-[#2C3E50] space-y-1">
                    <div className="text-[10px] text-[#BDC3C7]">3. Shift & Wrap % 26</div>
                    <div className="font-bold text-emerald-300">
                      ({activeTrace.zeroIndex} {shift >= 0 ? `+ ${shift}` : `- ${Math.abs(shift)}`}) % 26 = {activeTrace.wrappedIndex}
                    </div>
                    <div className="text-[10px] text-[#BDC3C7]">
                      raw {activeTrace.rawShifted} wrapped to 0-25
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1E2936] border border-[#2C3E50] space-y-1">
                    <div className="text-[10px] text-[#BDC3C7]">4. Back to Letter</div>
                    <div className="font-bold text-[#F5F5DC]">
                      chr({activeTrace.wrappedIndex} + {activeTrace.baseCode}) = "{activeTrace.outputChar}"
                    </div>
                    <div className="text-[10px] text-[#BDC3C7]">
                      ASCII {activeTrace.outputCode}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#1E2936] border border-[#2C3E50] font-mono text-xs text-emerald-300">
                  "{activeTrace.inputChar}" is not A-Z or a-z, so it enters the <code className="text-amber-300">else:</code> block and appends <code className="text-[#F5F5DC]">"{activeTrace.outputChar}"</code> unchanged.
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono">
                <span className="text-[#BDC3C7]">
                  result list: <code className="text-sky-300">[{traces.map((t) => `"${t.outputChar}"`).join(', ')}]</code>
                </span>
                <span className="text-emerald-300 font-bold">
                  "".join(result) → "{fullOutput}"
                </span>
              </div>
            </div>

            {/* 26-Letter Alphabet Mapping Strip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                  26-Letter Wrap Map (Shift {shift >= 0 ? `+${shift}` : shift})
                </span>
                <span className="text-[11px] font-mono text-[#5D6D7E] dark:text-[#BDC3C7]">
                  Top: Input (0-25) · Bottom: Shifted Output
                </span>
              </div>

              <div className="overflow-x-auto pb-1">
                <div className="inline-grid grid-cols-26 gap-1 min-w-[680px]">
                  {ALPHABET.map((letter, idx) => {
                    const wrapped = (((idx + shift) % 26) + 26) % 26;
                    const mappedLetter = ALPHABET[wrapped];
                    const isInputActive = activeTrace.isLetter && activeTrace.zeroIndex === idx;
                    const isOutputActive = activeTrace.isLetter && activeTrace.wrappedIndex === idx;

                    return (
                      <div
                        key={letter}
                        className={`rounded-md border px-1 py-1.5 text-center font-mono text-[10px] tabular-nums ${
                          isInputActive
                            ? 'bg-[#5A1827] text-[#F5F5DC] border-[#5A1827] font-bold'
                            : isOutputActive
                            ? 'bg-[#1E3A78] text-[#F5F5DC] border-[#1E3A78] font-bold'
                            : 'bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#BDC3C7] border-[#BDC3C7]/60 dark:border-[#2C3E50]'
                        }`}
                      >
                        <div className="text-[9px] opacity-70">{idx}</div>
                        <div className="font-bold">{letter}</div>
                        <div className="text-[9px] opacity-75">↓</div>
                        <div className={isInputActive ? 'text-amber-300 font-bold' : 'text-emerald-700 dark:text-emerald-400 font-bold'}>
                          {mappedLetter}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone (5 cols): Active Step Explanation, Highlighted Code & Check-Your-Understanding */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Step Lesson Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] space-y-4">
            <div className="flex items-center justify-between border-b border-[#BDC3C7]/50 dark:border-[#2C3E50] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1E3A78] dark:text-amber-300" />
                <span className="text-xs font-mono font-bold text-[#1E3A78] dark:text-amber-300">
                  Step {currentStage.stepNumber} of {GUIDE_STAGES.length}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#5D6D7E] dark:text-[#BDC3C7]">
                {currentStage.formulaLabel}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-[#2C3E50] dark:text-[#F5F5DC]">
                {currentStage.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#2C3E50]/85 dark:text-[#BDC3C7] leading-relaxed">
                {currentStage.plainExplanation}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/80 dark:border-[#2C3E50] space-y-1 text-xs">
              <div className="font-bold text-[#5A1827] dark:text-amber-300 text-[11px] font-mono">
                Why Python Needs This
              </div>
              <p className="text-[#2C3E50]/85 dark:text-[#BDC3C7] leading-relaxed">
                {currentStage.whyItMatters}
              </p>
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                disabled={activeStageIdx === 0}
                onClick={() => setActiveStageIdx((i) => Math.max(0, i - 1))}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] disabled:opacity-40 hover:border-[#1E3A78] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>

              {activeStageIdx < GUIDE_STAGES.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStageIdx((i) => Math.min(GUIDE_STAGES.length - 1, i + 1))}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Step {activeStageIdx + 2}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenCipherInIde}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Build It in IDE</span>
                </button>
              )}
            </div>
          </div>

          {/* Highlighted Code Walkthrough */}
          <div className="rounded-2xl border border-[#2C3E50] bg-[#141C24] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2C3E50] bg-[#0E141B] text-xs font-mono">
              <span className="text-[#F5F5DC] font-semibold">caesar_cipher.py</span>
              <span className="text-amber-300 text-[11px]">
                Highlighting Step {currentStage.stepNumber} lines
              </span>
            </div>
            <div className="p-3 overflow-x-auto font-mono text-[12px] leading-6 tabular-nums">
              {CIPHER_CODE_LINES.map((line, i) => {
                const lineNum = i + 1;
                const isHighlighted = currentStage.highlightedLines.includes(lineNum);
                return (
                  <div
                    key={lineNum}
                    className={`flex items-start gap-3 px-2 rounded ${
                      isHighlighted
                        ? 'bg-[#1E3A78]/60 text-[#F5F5DC] font-semibold'
                        : 'text-[#BDC3C7]/75'
                    }`}
                  >
                    <span className="w-5 text-right select-none text-[#BDC3C7]/45 shrink-0">
                      {lineNum < 10 ? `0${lineNum}` : lineNum}
                    </span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Check-Your-Understanding Card */}
          <div className="p-5 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#5A1827] dark:text-amber-300" />
                <h4 className="font-bold text-xs sm:text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                  Step {currentStage.stepNumber} Quick Check
                </h4>
              </div>
              {isQuizAnswered && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedAnswers((prev) => {
                      const next = { ...prev };
                      delete next[currentStage.stepNumber];
                      return next;
                    })
                  }
                  className="text-[11px] font-mono text-[#5D6D7E] dark:text-[#BDC3C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <p className="text-xs font-medium text-[#2C3E50] dark:text-[#F5F5DC] leading-relaxed">
              {currentStage.quizQuestion}
            </p>

            <div className="space-y-2">
              {currentStage.quizOptions.map((opt, idx) => {
                const isPicked = stageAnswer === idx;
                const isRight = idx === currentStage.correctOptionIndex;
                let btnStyle =
                  'bg-white dark:bg-[#1A2634] border-[#BDC3C7] dark:border-[#2C3E50] text-[#2C3E50] dark:text-[#F5F5DC] hover:border-[#1E3A78]';

                if (isQuizAnswered) {
                  if (isRight) {
                    btnStyle =
                      'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold';
                  } else if (isPicked) {
                    btnStyle =
                      'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-800 dark:text-rose-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [currentStage.stepNumber]: idx,
                      }))
                    }
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isQuizAnswered && isRight && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {isQuizAnswered && isPicked && !isRight && (
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {isQuizAnswered && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  isQuizCorrect
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500/40 text-[#2C3E50] dark:text-amber-200'
                }`}
              >
                <strong>{isQuizCorrect ? 'Correct: ' : 'Tip: '}</strong>
                {currentStage.quizExplanation}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Focus Flow Diagram Modal Overlay */}
      {isFlowOverlayOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0E141B]/75 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="CLI Cipher Interactive Flow Diagram Overlay"
          onClick={() => setIsFlowOverlayOpen(false)}
        >
          <div
            className="w-full max-w-5xl my-auto rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#1A2634] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#BDC3C7] dark:border-[#2C3E50] bg-[#EBE9DF] dark:bg-[#141C24]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                <GitBranch className="w-4 h-4 text-[#5A1827] dark:text-amber-300" />
                <span>Full-Focus Algorithm Flow Overlay · Press Esc to Close</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFlowOverlayOpen(false)}
                aria-label="Close flow diagram overlay"
                className="p-1.5 rounded-lg text-[#2C3E50] dark:text-[#F5F5DC] hover:bg-white dark:hover:bg-[#243342] border border-transparent hover:border-[#BDC3C7] dark:hover:border-[#2C3E50] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <CipherFlowDiagram
                activeTrace={activeTrace}
                traces={traces}
                fullOutput={fullOutput}
                sampleText={sampleText}
                onChangeSampleText={setSampleText}
                shift={shift}
                onChangeShift={setShift}
                clampedCharIdx={clampedCharIdx}
                totalChars={safeChars.length}
                onSelectCharIdx={(idx) => {
                  setSelectedCharIdx(idx);
                  setFlowStepIndex(0);
                }}
                flowStepIndex={flowStepIndex}
                onSetFlowStepIndex={(step) => {
                  setIsFlowPlaying(false);
                  setFlowStepIndex(step);
                }}
                isPlaying={isFlowPlaying}
                onTogglePlay={() => setIsFlowPlaying((p) => !p)}
                onStepForward={handleStepForwardFlow}
                onResetFlow={handleResetFlow}
                onJumpToGuideStage={(stageIdx) => {
                  setActiveStageIdx(stageIdx);
                  setIsFlowOverlayOpen(false);
                }}
                isOverlayMode
                onCloseOverlay={() => setIsFlowOverlayOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
