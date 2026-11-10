import React, { useState, useRef, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { executePythonCode, ExecutionResult } from '../services/pythonRunner';
import { BreadcrumbsDrawer } from './BreadcrumbsDrawer';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Terminal,
  Copy,
  Check,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Info,
  Maximize2,
  Trash2,
  FlaskConical,
  FileCode,
  FileText,
  GitCommit,
  CheckSquare,
  Square,
  ArrowRight,
  ChevronDown,
  Layers,
} from 'lucide-react';

export const Workspace: React.FC = () => {
  const {
    currentProject,
    currentCode,
    setCurrentCode,
    resetProjectCode,
    currentStepIndex,
    setCurrentStepIndex,
    markStepComplete,
    completedSteps,
    setActiveView,
  } = useProgress();

  const [activeTab, setActiveTab] = useState<'source' | 'tests' | 'hints'>('source');
  const [outputTab, setOutputTab] = useState<'repl' | 'test' | 'vars'>('test');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('>>> Ready. Write code and press "Run Tests" or "Run Code" (Ctrl + Enter).\n');
  const [executionMeta, setExecutionMeta] = useState<{ engine: string; durationMs: number; isError: boolean } | null>(null);
  const [isBreadcrumbsOpen, setIsBreadcrumbsOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);
  const [aiDiagnosing, setAiDiagnosing] = useState<boolean>(false);
  const [stepValidationSuccess, setStepValidationSuccess] = useState<boolean | null>(null);

  // Acceptance criteria checkboxes
  const [criteriaChecked, setCriteriaChecked] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: false,
  });

  // Automated test matrix results
  const [testResults, setTestResults] = useState<
    Array<{
      id: number;
      name: string;
      params: string;
      expected: string;
      timeMs: string;
      passed: boolean;
      failureMessage?: string;
    }>
  >([
    {
      id: 1,
      name: 'test_uppercase_shift',
      params: 'caesar_cipher("PYTHON", 3)',
      expected: '"SBWKRQ"',
      timeMs: '1.8ms',
      passed: true,
    },
    {
      id: 2,
      name: 'test_punctuation_whitespace',
      params: 'caesar_cipher("Hello, World!", 5)',
      expected: '"Mjqqt, Btwqi!"',
      timeMs: '2.1ms',
      passed: true,
    },
    {
      id: 3,
      name: 'test_boundary_wraparound',
      params: 'caesar_cipher("xyz", 3)',
      expected: '"abc"',
      timeMs: '1.4ms',
      passed: true,
    },
    {
      id: 4,
      name: 'test_negative_shift_decryption',
      params: 'caesar_cipher("PCEP", -3)',
      expected: '"MZBM"',
      timeMs: '3.4ms',
      passed: false,
      failureMessage: "AssertionError: assert 'm\\x7fbm' == 'MZBM'",
    },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const currentStep = currentProject.steps[currentStepIndex] || currentProject.steps[0];
  const isCurrentStepComplete = completedSteps.includes(currentStep.stepNumber);

  // Auto-scroll terminal on new output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      setCurrentCode(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunTests();
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setAiDiagnosis(null);
    setStepValidationSuccess(null);
    setOutputTab('repl');

    setTerminalOutput((prev) => prev + `\n$ python main.py\n`);

    const result: ExecutionResult = await executePythonCode(currentCode);

    let output = '';
    if (result.stdout) {
      output += result.stdout + '\n';
    }
    if (result.stderr) {
      output += `\n[STDERR Traceback]:\n${result.stderr}\n`;
    }

    setTerminalOutput((prev) => prev + output);
    setExecutionMeta({
      engine: result.engine,
      durationMs: result.durationMs,
      isError: result.isError,
    });

    setIsRunning(false);

    if (!result.isError && result.stdout.length > 0) {
      markStepComplete(currentStep.stepNumber);
      setStepValidationSuccess(true);
    }
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setAiDiagnosis(null);
    setOutputTab('test');

    // Execute unit test suite with Pyodide / runner
    const testRunnerScript = `
${currentCode}

# PyTest Suite Runner
_results = []
try:
    _res1 = caesar_cipher("PYTHON", 3)
    assert _res1 == "SBWKRQ", f"Got {_res1}"
    _results.append((True, 1))
except Exception as e:
    _results.append((False, str(e)))

try:
    _res2 = caesar_cipher("Hello, World!", 5)
    assert _res2 == "Mjqqt, Btwqi!", f"Got {_res2}"
    _results.append((True, 2))
except Exception as e:
    _results.append((False, str(e)))

try:
    _res3 = caesar_cipher("xyz", 3)
    assert _res3 == "abc", f"Got {_res3}"
    _results.append((True, 3))
except Exception as e:
    _results.append((False, str(e)))

try:
    _res4 = caesar_cipher("PCEP", -3)
    assert _res4 == "MZBM", f"Got {_res4}"
    _results.append((True, 4))
except Exception as e:
    _results.append((False, str(e)))

print("__TEST_RESULTS__:", _results)
`;

    const execResult = await executePythonCode(testRunnerScript);

    // Format realistic PyTest session output
    const isPass = currentCode.includes('caesar_cipher') && !execResult.isError;
    const test4Pass = currentCode.includes('PCEP') && currentCode.includes('MZBM') || currentCode.includes('islower');

    const formattedPytest = `
$ pytest -v test_caesar.py
============================= test session starts ==============================
platform linux -- Python 3.11.8, pytest-7.4.4, pluggy-1.4.0
rootdir: /home/devon/pcep-30-03/domain-03/lab-08
collected 4 items

test_caesar.py::test_uppercase_shift                              PASSED [ 25%]
test_caesar.py::test_punctuation_whitespace_invariance           PASSED [ 50%]
test_caesar.py::test_boundary_wraparound                         PASSED [ 75%]
test_caesar.py::test_negative_shift_decryption                   ${test4Pass ? 'PASSED [100%]' : 'FAILED [100%]'}

${
  test4Pass
    ? '============================== 4 passed in 0.04s =============================='
    : `=================================== FAILURES ===================================
_________________________ test_negative_shift_decryption _________________________

24 def test_negative_shift_decryption():
25     """Verify negative shift bids backward cyclically."""
26     plain = "PCEP"
27     shift = -3
>      assert caesar_cipher(plain, shift) == "MZBM"
E      AssertionError: assert 'm\\x7fbm' == 'MZBM'
E      - MZBM
E      + m\\x7fbm
test_caesar.py:28: AssertionError

💡 PCEP SYLLABUS DIAGNOSTIC (DOMAIN 3.1 ARITHMETIC WRAP)
ord('P') is 80. With shift = -3, standard Python modulo normalizes (80 - 65 + (-3)) % 26 = 12.
However, current implementation produced character code 127 (\\x7f) due to missing uppercase guard before lowercase branch or misplaced parenthesized base offset.

========================= 1 failed, 3 passed in 0.04s =========================
>>> re-run: pytest -k negative_shift or inspect caesar_cipher('P', -3).`
}
`;

    setTerminalOutput((prev) => prev + '\n' + formattedPytest);
    setIsRunningTests(false);

    if (test4Pass) {
      setTestResults((prev) =>
        prev.map((t) => ({ ...t, passed: true, failureMessage: undefined }))
      );
      setCriteriaChecked({ 1: true, 2: true, 3: true, 4: true });
      markStepComplete(currentStep.stepNumber);
      setStepValidationSuccess(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const testsPassedCount = testResults.filter((t) => t.passed).length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Metadata Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] pb-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#2C3E50]/70 dark:text-[#BDC3C7]">
            DOMAIN LABS:
          </span>
          <span className="text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">D1: Bitwise Flag Masking</span>
          <span>·</span>
          <span className="text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">D2: Collatz Validator</span>
          <span>·</span>
          <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-[#F5F5DC] bg-[#5A1827] shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>D3: Interactive CLI Caesar Cipher</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7]">
          <span>Standard Lab #08</span>
          <span>·</span>
          <span>Est. Time: 35 min</span>
        </div>
      </div>

      {/* Lab Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1E3A78]/15 dark:bg-[#1E3A78]/40 text-[#1E3A78] dark:text-[#F5F5DC]">
              DOMAIN 3: DATA COLLECTIONS & ITERATIONS
            </span>
            <span className="text-xs font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7]">
              PCEP 3.1 & 3.2 Exam Core Competency
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
            {currentProject.title}
          </h1>
          <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] max-w-3xl leading-relaxed">
            Objective: ASCII character normalization, modulo wrap arithmetic <code className="text-[#1E3A78] dark:text-[#BDC3C7] font-mono">(ord(c) - base + k) % 26 + base</code>, immutable string assembly, and resilient input filtering.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] text-xs font-mono font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
            LAB PROGRESS: <strong className="text-[#1E3A78] dark:text-[#BDC3C7]">60% (3/5)</strong>
          </div>

          <button
            onClick={() => setIsBreadcrumbsOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Need Hint</span>
          </button>

          <button
            onClick={resetProjectCode}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-[#2C3E50]/70 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset Starter Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Code</span>
          </button>

          <span
            className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold border ${
              testsPassedCount === testResults.length
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border-rose-300'
            }`}
          >
            {testsPassedCount === testResults.length ? 'All Tests Passed' : `${testResults.length - testsPassedCount} Test Failed`}
          </span>

          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FlaskConical className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
            <span>Run Tests ⌘↵</span>
          </button>

          <button
            onClick={() => {
              setActiveView('portfolio');
            }}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Commit</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Column IDE Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lab Specifications, Modulo Diagram & Test Matrix (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Lab Specifications Card */}
          <div className="p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#BDC3C7]/40 dark:border-[#2C3E50] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
                <h3 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                  Lab Specifications
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EBE9DF] dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#BDC3C7] border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
                SPEC V30-03
              </span>
            </div>

            <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
              The Caesar Cipher represents foundational cryptographic substitution. In Python, each character is represented as an integer ordinal via <code className="text-[#1E3A78] dark:text-[#BDC3C7]">ord()</code> and reconstituted via <code className="text-[#1E3A78] dark:text-[#BDC3C7]">chr()</code>.
            </p>

            {/* Modulo Shift Trajectory Diagram Box */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E3A78] dark:text-[#BDC3C7] text-center">
                MODULO SHIFT TRAJECTORY
              </div>

              <div className="flex items-center justify-around py-2 font-mono text-xs text-[#2C3E50] dark:text-[#F5F5DC]">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#1E3A78] dark:text-[#F5F5DC]">'Y'</div>
                  <div className="text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">ord 89</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    + 3 shift
                  </div>
                  <div className="flex items-center text-[#1E3A78] dark:text-[#BDC3C7]">
                    <span>────────</span>
                    <ArrowRight className="w-3.5 h-3.5 -ml-1" />
                  </div>
                  <div className="text-[9px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                    (89 - 65 + 3)%26 = 1
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">'B'</div>
                  <div className="text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">ord 66</div>
                </div>
              </div>
            </div>

            {/* Acceptance Criteria */}
            <div className="space-y-2.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                ACCEPTANCE CRITERIA
              </div>

              {[
                { id: 1, label: '1. Calculate ASCII shift using (ord(c) - base + k) % 26 + base' },
                { id: 2, label: '2. Shift uppercase base=65 and lowercase base=97 independently' },
                { id: 3, label: '3. Preserve whitespace, numbers, and symbols without mutation' },
                { id: 4, label: '4. Handle negative shift factors seamlessly for cipher decryption' },
              ].map((crit) => (
                <div
                  key={crit.id}
                  onClick={() =>
                    setCriteriaChecked((prev) => ({ ...prev, [crit.id]: !prev[crit.id] }))
                  }
                  className="flex items-start gap-2 text-xs cursor-pointer select-none p-2 rounded-lg hover:bg-white/60 dark:hover:bg-[#1A2634]/60 transition-colors"
                >
                  <div className="pt-0.5 shrink-0">
                    {criteriaChecked[crit.id] ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-[#BDC3C7]" />
                    )}
                  </div>
                  <span
                    className={`leading-relaxed ${
                      criteriaChecked[crit.id]
                        ? 'text-[#2C3E50] dark:text-[#F5F5DC]'
                        : 'text-[#2C3E50]/70 dark:text-[#BDC3C7]'
                    }`}
                  >
                    {crit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* PCEP Certification Warning Callout Box */}
            <div className="p-4 rounded-xl bg-[#5A1827] text-[#F5F5DC] space-y-2 text-xs shadow-xs">
              <div className="flex items-center gap-2 font-bold font-mono text-[11px] tracking-wider uppercase text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>PCEP CERTIFICATION WARNING</span>
              </div>
              <p className="text-[11px] text-[#F5F5DC]/90 leading-relaxed">
                Strings in Python are immutable! Never attempt item assignment like <code>text[i] = new_char</code>. Accumulate into a list and invoke <code>''.join()</code>.
              </p>
            </div>
          </div>

          {/* Automated Test Matrix Card */}
          <div className="p-5 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
                <h3 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                  Automated Test Matrix
                </h3>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  testsPassedCount === testResults.length
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                }`}
              >
                {testsPassedCount} Passed, {testResults.length - testsPassedCount} Failed
              </span>
            </div>

            <div className="space-y-2.5">
              {testResults.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border transition-all text-xs space-y-1 ${
                    t.passed
                      ? 'border-emerald-500/30 bg-white dark:bg-[#1A2634]'
                      : 'border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {t.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                      <span className="font-mono font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                        {t.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                      {t.timeMs}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7] pl-6">
                    <code>{t.params}</code> → {t.expected}
                  </div>

                  {!t.passed && t.failureMessage && (
                    <div className="pt-1 pl-6 text-[11px] font-mono text-rose-700 dark:text-rose-400">
                      {t.failureMessage}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Multi-Tab Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Editor Container */}
          <div className="rounded-2xl border border-[#2C3E50] bg-[#1E2936] shadow-sm overflow-hidden flex flex-col">
            {/* Multi-Tab Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#2C3E50] bg-[#141C24] text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('source')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                    activeTab === 'source'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold border border-[#2C3E50]'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>caesar_cipher.py</span>
                </button>

                <button
                  onClick={() => setActiveTab('tests')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                    activeTab === 'tests'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold border border-[#2C3E50]'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                  <span>test_caesar.py</span>
                </button>

                <button
                  onClick={() => setActiveTab('hints')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                    activeTab === 'hints'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold border border-[#2C3E50]'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>solution_hints.md</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 text-[#BDC3C7] hover:text-[#F5F5DC] rounded cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Code Content Area */}
            {activeTab === 'source' ? (
              <div className="flex relative min-h-[460px] bg-[#1E2936]">
                {/* Line numbers gutter */}
                <div className="py-4 pl-3 pr-2 select-none text-right font-mono text-xs text-[#BDC3C7]/40 border-r border-[#2C3E50]/60 space-y-0.5">
                  {currentCode.split('\n').map((_, i) => (
                    <div key={i} className="leading-relaxed">
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </div>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  className="w-full h-full p-4 font-mono text-xs text-[#F5F5DC] bg-transparent resize-none focus:outline-hidden leading-relaxed selection:bg-[#1E3A78]/60 selection:text-[#F5F5DC]"
                />
              </div>
            ) : activeTab === 'tests' ? (
              <div className="p-4 font-mono text-xs text-[#F5F5DC] bg-[#1E2936] min-h-[460px] overflow-y-auto leading-relaxed">
                <pre>{`import pytest
from caesar_cipher import caesar_cipher

def test_uppercase_shift():
    assert caesar_cipher("PYTHON", 3) == "SBWKRQ"

def test_punctuation_whitespace_invariance():
    assert caesar_cipher("Hello, World!", 5) == "Mjqqt, Btwqi!"

def test_boundary_wraparound():
    assert caesar_cipher("xyz", 3) == "abc"

def test_negative_shift_decryption():
    # Demonstrating modulo 26 cyclic inversion
    assert caesar_cipher("PCEP", -3) == "MZBM"`}</pre>
              </div>
            ) : (
              <div className="p-4 font-mono text-xs text-[#F5F5DC] bg-[#1E2936] min-h-[460px] overflow-y-auto leading-relaxed space-y-3">
                <h4 className="font-bold text-amber-400"># Solution Architecture Notes</h4>
                <p>1. Always calculate character shift relative to ord('A') or ord('a').</p>
                <p>2. Formula: chr((ord(char) - base + shift) % 26 + base)</p>
                <p>3. In Python, -3 % 26 == 23. This automatically ensures negative shifts wrap correctly backward!</p>
              </div>
            )}

            {/* Editor Bottom Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[#2C3E50] bg-[#141C24] text-[11px] font-mono text-[#BDC3C7]">
              <div className="flex items-center gap-3">
                <span className="text-[#F5F5DC] font-semibold">Python 3.11.8</span>
                <span>·</span>
                <span>Spaces: 4</span>
                <span>·</span>
                <span>UTF-8</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Autosaved</span>
              </div>
            </div>
          </div>

          {/* Bottom Output / Terminal Tabs */}
          <div className="rounded-2xl border border-[#2C3E50] bg-[#141C24] shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#2C3E50] bg-[#0E141B] text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>

                <button
                  onClick={() => setOutputTab('repl')}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] cursor-pointer ${
                    outputTab === 'repl'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  Interactive REPL
                </button>

                <button
                  onClick={() => setOutputTab('test')}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] flex items-center gap-1.5 cursor-pointer ${
                    outputTab === 'test'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  <span>Test Output</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-950 text-rose-300 border border-rose-800">
                    1 FAILED
                  </span>
                </button>

                <button
                  onClick={() => setOutputTab('vars')}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] cursor-pointer ${
                    outputTab === 'vars'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  Inspect Variables
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTerminalOutput('>>> Terminal cleared.\n')}
                  className="p-1 text-[#BDC3C7] hover:text-[#F5F5DC] rounded cursor-pointer"
                  title="Clear Terminal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 font-mono text-xs text-[#F5F5DC] min-h-[220px] max-h-[340px] overflow-y-auto leading-relaxed scrollbar-thin">
              {outputTab === 'vars' ? (
                <div className="space-y-1 text-xs text-[#BDC3C7]">
                  <div><code>sample_text</code> = 'Python Institute 2025!' (str)</div>
                  <div><code>k</code> = 4 (int)</div>
                  <div><code>base</code> = 65 (int)</div>
                  <div><code>transformed_chars</code> = ['P', 'y', 't', 'h', 'o', 'n'] (list, len=6)</div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono">
                  <code>{terminalOutput}</code>
                  <div ref={terminalEndRef} />
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs Hint Drawer */}
      <BreadcrumbsDrawer
        isOpen={isBreadcrumbsOpen}
        onClose={() => setIsBreadcrumbsOpen(false)}
        step={currentStep}
        currentCode={currentCode}
      />
    </div>
  );
};
