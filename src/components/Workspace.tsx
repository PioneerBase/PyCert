import React, { useState, useRef, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { MICRO_PROJECTS } from '../data/pcepCurriculum';
import { ProjectStep } from '../types';
import { executePythonCode, ExecutionResult } from '../services/pythonRunner';
import { BreadcrumbsDrawer } from './BreadcrumbsDrawer';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Copy,
  Check,
  AlertTriangle,
  Trash2,
  FlaskConical,
  FileCode,
  FileText,
  GitCommit,
  ArrowRight,
  ListChecks,
  BookOpen,
} from 'lucide-react';

interface StepTestStatus {
  stepNumber: number;
  name: string;
  assertionText: string;
  expectedExample?: string;
  passed: boolean | null;
  failureMessage?: string;
}

export const Workspace: React.FC = () => {
  const {
    currentProject,
    selectProject,
    currentCode,
    setCurrentCode,
    resetProjectCode,
    currentStepIndex,
    setCurrentStepIndex,
    markStepComplete,
    completedSteps,
    setActiveView,
    currentUser,
  } = useProgress();

  const [activeTab, setActiveTab] = useState<'source' | 'tests' | 'hints'>('source');
  const [outputTab, setOutputTab] = useState<'repl' | 'test'>('repl');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [checkingStepNum, setCheckingStepNum] = useState<number | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string>(
    '>>> Ready. Follow Step 1 -> Step 2 -> Step 3 on the left, then click "Check Step" or "Run Tests".\n'
  );
  const [executionMeta, setExecutionMeta] = useState<{
    engine: string;
    durationMs: number;
    isError: boolean;
  } | null>(null);
  const [isBreadcrumbsOpen, setIsBreadcrumbsOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [stepTestMap, setStepTestMap] = useState<Record<number, { passed: boolean; failureMessage?: string }>>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = currentProject.steps[currentStepIndex] || currentProject.steps[0];
  const fileName = currentProject.fileName || `${currentProject.id.replace(/-/g, '_')}.py`;
  const testFileName = currentProject.testFileName || `test_${fileName}`;

  // Reset test display state when switching projects
  useEffect(() => {
    setStepTestMap({});
    setActiveTab('source');
    setTerminalOutput(
      `>>> Loaded "${currentProject.title}" (${fileName}).\n>>> Start with Step 1 on the left: read the Worked Pattern, edit ${fileName}, then click "Check Step 1".\n`
    );
  }, [currentProject.id, currentProject.title, fileName]);

  // Auto-scroll only inside the terminal box without moving the main page viewport
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const codeLines = currentCode.split('\n');
  const gutterLineCount = Math.max(28, codeLines.length + 12);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      setCurrentCode(newValue);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      });
    } else if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
      // Preserve Python indentation naturally on Enter
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.slice(lineStart, start);
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      const extraIndent = currentLine.trimEnd().endsWith(':') ? '    ' : '';

      e.preventDefault();
      const insertion = '\n' + currentIndent + extraIndent;
      const newValue = value.substring(0, start) + insertion + value.substring(end);
      setCurrentCode(newValue);

      requestAnimationFrame(() => {
        const nextPos = start + insertion.length;
        textarea.selectionStart = textarea.selectionEnd = nextPos;
      });
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunTests();
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutputTab('repl');
    setTerminalOutput((prev) => prev + `\n$ python ${fileName}\n`);

    const result: ExecutionResult = await executePythonCode(currentCode);

    let output = '';
    if (result.stdout) {
      output += result.stdout + '\n';
    }
    if (result.stderr) {
      output += `\n[Error Traceback]:\n${result.stderr}\n`;
    }
    if (!result.stdout && !result.stderr) {
      output += '(Program finished with no printed output.)\n';
    }

    setTerminalOutput((prev) => prev + output);
    setExecutionMeta({
      engine: result.engine,
      durationMs: result.durationMs,
      isError: result.isError,
    });
    setIsRunning(false);
  };

  const buildStepCheckPython = (step: ProjectStep) => {
    const escapedSnippet = step.validationSnippet.replace(/\\/g, '\\\\');
    const actualExpr = step.diagnosticExpr || 'None';
    return `try:
    ${escapedSnippet.split('\n').join('\n    ')}
    print("__STEP_RESULT__:${step.stepNumber}:PASS")
except AssertionError:
    try:
        _got = repr(${actualExpr})
    except Exception as _inner:
        _got = f"<error: {_inner}>"
    print(f"__STEP_RESULT__:${step.stepNumber}:FAIL:Got {_got} (expected ${step.expectedExample ? step.expectedExample.replace(/"/g, "'") : 'matching output'})")
except Exception as _err:
    print(f"__STEP_RESULT__:${step.stepNumber}:FAIL:{type(_err).__name__}: {_err}")`;
  };

  const handleRunSingleStep = async (step: ProjectStep) => {
    setCheckingStepNum(step.stepNumber);
    setOutputTab('test');

    const testRunnerScript = `# __STEP_CHECK__
${currentCode}

${buildStepCheckPython(step)}
`;

    const execResult = await executePythonCode(testRunnerScript);
    const stdoutLines = (execResult.stdout || '').split('\n');
    const markerPrefix = `__STEP_RESULT__:${step.stepNumber}:`;
    const matchedLine = stdoutLines.find((line) => line.startsWith(markerPrefix));

    if (matchedLine && matchedLine.includes(':PASS')) {
      setStepTestMap((prev) => ({
        ...prev,
        [step.stepNumber]: { passed: true },
      }));
      markStepComplete(step.stepNumber);
      setTerminalOutput(
        (prev) =>
          prev +
          `\n$ check step_${step.stepNumber} (${fileName})\n[PASS] Step ${step.stepNumber}: ${step.title}\n`
      );
    } else {
      const msg =
        matchedLine && matchedLine.includes(':FAIL:')
          ? matchedLine.split(':FAIL:')[1]
          : execResult.isError && execResult.stderr
          ? execResult.stderr.split('\n').slice(-2).join(' ')
          : 'Output does not match expected check yet.';

      setStepTestMap((prev) => ({
        ...prev,
        [step.stepNumber]: { passed: false, failureMessage: msg },
      }));
      setTerminalOutput(
        (prev) =>
          prev +
          `\n$ check step_${step.stepNumber} (${fileName})\n[TRY AGAIN] Step ${step.stepNumber}: ${msg}\n`
      );
    }

    setExecutionMeta({
      engine: execResult.engine,
      durationMs: execResult.durationMs,
      isError: execResult.isError,
    });
    setCheckingStepNum(null);
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setOutputTab('test');

    // Build dynamic Python step-by-step test runner from currentProject.steps
    const stepChecksPython = currentProject.steps.map(buildStepCheckPython).join('\n\n');

    const testRunnerScript = `# __STEP_CHECK__
${currentCode}

${stepChecksPython}
`;

    const execResult = await executePythonCode(testRunnerScript);
    const stdoutLines = (execResult.stdout || '').split('\n');

    const newMap: Record<number, { passed: boolean; failureMessage?: string }> = {};
    let passedCount = 0;

    currentProject.steps.forEach((step) => {
      const markerPrefix = `__STEP_RESULT__:${step.stepNumber}:`;
      const matchedLine = stdoutLines.find((line) => line.startsWith(markerPrefix));

      if (matchedLine && matchedLine.includes(':PASS')) {
        newMap[step.stepNumber] = { passed: true };
        passedCount++;
        markStepComplete(step.stepNumber);
      } else if (matchedLine && matchedLine.includes(':FAIL:')) {
        const msg = matchedLine.split(':FAIL:')[1] || 'Check did not match expected output yet.';
        newMap[step.stepNumber] = { passed: false, failureMessage: msg };
      } else if (execResult.isError && execResult.stderr) {
        newMap[step.stepNumber] = {
          passed: false,
          failureMessage: execResult.stderr.split('\n').slice(-2).join(' '),
        };
      } else {
        newMap[step.stepNumber] = {
          passed: false,
          failureMessage: 'Function output does not match expected check yet.',
        };
      }
    });

    setStepTestMap(newMap);

    const handleName = currentUser.githubHandle || 'student';
    const reportLines = currentProject.steps.map((step) => {
      const status = newMap[step.stepNumber];
      const badge = status?.passed ? 'PASSED' : 'FAILED';
      const detail = !status?.passed && status?.failureMessage ? `\n   -> Hint: ${status.failureMessage}` : '';
      return `Step ${step.stepNumber}: ${step.title} ... ${badge}${detail}`;
    });

    const summaryFooter =
      passedCount === currentProject.steps.length
        ? `=== All ${passedCount}/${currentProject.steps.length} steps passed! Ready to Commit or move to the next lab. ===`
        : `=== ${passedCount}/${currentProject.steps.length} steps passed. Check the failed step(s) above or click "Need Hint". ===`;

    const formattedPytest = `
$ pytest -v ${testFileName} (user: ${handleName})
----------------------------------------------------------------------
${reportLines.join('\n')}
----------------------------------------------------------------------
${summaryFooter}
`;

    setTerminalOutput((prev) => prev + '\n' + formattedPytest);
    setExecutionMeta({
      engine: execResult.engine,
      durationMs: execResult.durationMs,
      isError: execResult.isError,
    });
    setIsRunningTests(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLoadSolution = () => {
    setCurrentCode(currentProject.solutionCode);
    setTerminalOutput((prev) => prev + `\n>>> Loaded reference solution for ${fileName}. Click "Run Tests" to verify!\n`);
  };

  const completedCount = completedSteps.length;
  const totalSteps = currentProject.steps.length;
  const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const testCards: StepTestStatus[] = currentProject.steps.map((step) => {
    const runState = stepTestMap[step.stepNumber];
    const isAlreadyCompleted = completedSteps.includes(step.stepNumber);
    return {
      stepNumber: step.stepNumber,
      name: `test_step_${step.stepNumber}`,
      assertionText: step.validationSnippet,
      expectedExample: step.expectedExample,
      passed: runState ? runState.passed : isAlreadyCompleted ? true : null,
      failureMessage: runState?.failureMessage,
    };
  });

  const testsPassedCount = testCards.filter((t) => t.passed === true).length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-5 animate-in fade-in duration-150">
      {/* Top Domain Lab Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] pb-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] font-bold text-[#2C3E50]/70 dark:text-[#BDC3C7] mr-1">
            Syllabus Labs:
          </span>
          {MICRO_PROJECTS.map((proj, idx) => {
            const isActive = proj.id === currentProject.id;
            return (
              <button
                key={proj.id}
                onClick={() => selectProject(proj.id)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'font-bold text-[#F5F5DC] bg-[#5A1827] shadow-xs'
                    : 'text-[#2C3E50]/80 dark:text-[#BDC3C7] bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50] hover:border-[#1E3A78]'
                }`}
              >
                Lab {idx + 1}: D{proj.sectionNumber} · {proj.title.split(':')[0].split('(')[0].trim()}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7] shrink-0">
          <span>{currentProject.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span>Est. {currentProject.estimatedMinutes} min</span>
        </div>
      </div>

      {/* Lab Header Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-[#1E3A78] dark:text-[#BDC3C7]">
            <span className="font-bold">
              Domain {currentProject.sectionNumber}: {currentProject.sectionName}
            </span>
            <span aria-hidden="true">·</span>
            <span>Objectives {currentProject.specificObjectives.join(', ')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
            {currentProject.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] max-w-3xl leading-relaxed">
            {currentProject.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="px-3 py-2 rounded-lg bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] text-xs font-mono font-semibold text-[#2C3E50] dark:text-[#F5F5DC] tabular-nums">
            Progress: <strong className="text-[#1E3A78] dark:text-amber-300">{progressPct}% ({completedCount}/{totalSteps})</strong>
          </div>

          <button
            onClick={() => setIsBreadcrumbsOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Need Hint</span>
          </button>

          <button
            onClick={resetProjectCode}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-[#2C3E50]/80 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Reset to Starter Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Code</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#243342] hover:bg-[#EBE9DF] dark:hover:bg-[#2C3E50] border border-[#BDC3C7] dark:border-[#2C3E50] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <FlaskConical className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
            <span>{isRunningTests ? 'Checking...' : 'Run Tests (Ctrl+Enter)'}</span>
          </button>

          <button
            onClick={() => setActiveView('portfolio')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Column IDE Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chronological Instructions & Automated Test Checks (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Chronological Step-by-Step Instructions Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#BDC3C7]/50 dark:border-[#2C3E50] pb-3">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
                <h2 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                  Chronological Lab Instructions
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#5D6D7E] dark:text-[#BDC3C7]">
                Follow Steps 1 → {totalSteps}
              </span>
            </div>

            <div className="space-y-3">
              {currentProject.steps.map((step, idx) => {
                const isSelected = idx === currentStepIndex;
                const isComplete = completedSteps.includes(step.stepNumber);
                const runState = stepTestMap[step.stepNumber];

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-[#1E3A78] dark:border-amber-400/70 bg-white dark:bg-[#1A2634] shadow-xs'
                        : isComplete
                        ? 'border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/15'
                        : 'border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-white/70 dark:bg-[#1A2634]/60 hover:border-[#1E3A78]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <span
                            className={`w-5 h-5 rounded-full text-[11px] font-mono font-bold flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#1E3A78] text-[#F5F5DC]'
                                : 'bg-[#EBE9DF] dark:bg-[#243342] text-[#2C3E50] dark:text-[#BDC3C7]'
                            }`}
                          >
                            {step.stepNumber}
                          </span>
                        )}
                        <h3 className="text-xs sm:text-sm font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                          {step.title}
                        </h3>
                      </div>

                      <span className="text-[10px] font-mono text-[#5D6D7E] dark:text-[#BDC3C7] shrink-0">
                        Obj {step.targetObjectiveId}
                      </span>
                    </div>

                    <p className="text-xs text-[#2C3E50]/90 dark:text-[#BDC3C7] leading-relaxed pl-7">
                      {step.taskInstruction}
                    </p>

                    {isSelected && step.patternCode && (
                      <div className="ml-7 p-3 rounded-lg bg-[#FAF9F5] dark:bg-[#141C24] border border-[#BDC3C7]/70 dark:border-[#2C3E50] space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1E3A78] dark:text-amber-300">
                          <BookOpen className="w-3.5 h-3.5 shrink-0" />
                          <span>{step.patternTitle || 'Worked Pattern Example'}</span>
                        </div>
                        <pre className="p-2.5 rounded-md bg-[#1E2936] text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                          <code>{step.patternCode}</code>
                        </pre>
                        {step.patternExplanation && (
                          <p className="text-[11px] text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
                            {step.patternExplanation}
                          </p>
                        )}
                      </div>
                    )}

                    {step.expectedExample && (
                      <div className="pl-7 text-[11px] font-mono text-[#1E3A78] dark:text-sky-300">
                        Target check: <code>{step.expectedExample}</code>
                      </div>
                    )}

                    {runState && !runState.passed && runState.failureMessage && (
                      <div className="ml-7 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-500/40 text-[11px] font-mono text-rose-700 dark:text-rose-300">
                        {runState.failureMessage}
                      </div>
                    )}

                    {isSelected && (
                      <div className="pl-7 pt-1 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={checkingStepNum === step.stepNumber}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRunSingleStep(step);
                            }}
                            className="px-3 py-1.5 rounded-md text-[11px] font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <FlaskConical className="w-3 h-3" />
                            <span>
                              {checkingStepNum === step.stepNumber
                                ? `Checking Step ${step.stepNumber}...`
                                : `Check Step ${step.stepNumber}`}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentStepIndex(idx);
                              setIsBreadcrumbsOpen(true);
                            }}
                            className="text-[11px] font-semibold text-[#5A1827] dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Hint</span>
                          </button>
                        </div>

                        {idx < currentProject.steps.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentStepIndex(idx + 1);
                            }}
                            className="text-[11px] font-semibold text-[#1E3A78] dark:text-[#BDC3C7] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Next: Step {idx + 2}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Concept Tip */}
            {currentProject.keyTip && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/80 dark:border-[#2C3E50] space-y-1 text-xs">
                <div className="font-bold text-[#1E3A78] dark:text-sky-300 text-[11px] font-mono">
                  Quick Tip
                </div>
                <p className="text-[#2C3E50]/85 dark:text-[#BDC3C7] leading-relaxed">
                  {currentProject.keyTip}
                </p>
              </div>
            )}

            {/* Common PCEP Exam Pitfall */}
            {currentProject.pitfallWarning && (
              <div className="p-3.5 rounded-xl bg-[#5A1827] text-[#F5F5DC] space-y-1.5 text-xs shadow-xs">
                <div className="flex items-center gap-2 font-bold font-mono text-[11px] text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Exam Watch-Out</span>
                </div>
                <p className="text-[11px] text-[#F5F5DC]/90 leading-relaxed">
                  {currentProject.pitfallWarning}
                </p>
              </div>
            )}
          </div>

          {/* Automated Test Matrix Card */}
          <div className="p-5 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
                <h3 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                  Automated Step Checks
                </h3>
              </div>

              <span className="text-[11px] font-mono font-semibold text-[#2C3E50] dark:text-[#BDC3C7] tabular-nums">
                {testsPassedCount} of {testCards.length} Passed
              </span>
            </div>

            <div className="space-y-2.5">
              {testCards.map((t) => (
                <div
                  key={t.stepNumber}
                  className={`p-3 rounded-xl border transition-all text-xs space-y-1 ${
                    t.passed === true
                      ? 'border-emerald-500/40 bg-white dark:bg-[#1A2634]'
                      : t.passed === false
                      ? 'border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20'
                      : 'border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-white dark:bg-[#1A2634]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {t.passed === true ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : t.passed === false ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-[#BDC3C7] dark:border-[#5D6D7E] text-[10px] font-mono flex items-center justify-center shrink-0">
                          {t.stepNumber}
                        </span>
                      )}
                      <span className="font-mono font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                        {t.name}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[10px] font-semibold ${
                        t.passed === true
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : t.passed === false
                          ? 'text-rose-700 dark:text-rose-400'
                          : 'text-[#5D6D7E] dark:text-[#BDC3C7]'
                      }`}
                    >
                      {t.passed === true ? 'PASSED' : t.passed === false ? 'TRY AGAIN' : 'NOT RUN'}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-[#2C3E50]/75 dark:text-[#BDC3C7] pl-6 overflow-x-auto">
                    <code>{t.assertionText}</code>
                  </div>

                  {t.passed === false && t.failureMessage && (
                    <div className="pt-1 pl-6 text-[11px] font-mono text-rose-700 dark:text-rose-400">
                      {t.failureMessage}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Full-Height Natural Code Editor & Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Editor Container */}
          <div className="rounded-2xl border border-[#2C3E50] bg-[#1E2936] shadow-sm overflow-hidden flex flex-col">
            {/* Multi-Tab Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#2C3E50] bg-[#141C24] text-xs gap-2 overflow-x-auto">
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setActiveTab('source')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                    activeTab === 'source'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold border border-[#2C3E50]'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>{fileName}</span>
                </button>

                <button
                  onClick={() => setActiveTab('tests')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                    activeTab === 'tests'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold border border-[#2C3E50]'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{testFileName}</span>
                </button>

                <button
                  onClick={() => setActiveTab('hints')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                    activeTab === 'hints'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold border border-[#2C3E50]'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>step_guide.md</span>
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleLoadSolution}
                  className="px-2.5 py-1 text-[11px] font-mono text-[#BDC3C7] hover:text-[#F5F5DC] rounded border border-[#2C3E50] hover:bg-[#1E2936] transition-colors cursor-pointer whitespace-nowrap"
                  title="Fill editor with working example solution"
                >
                  Show Example Solution
                </button>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 text-[#BDC3C7] hover:text-[#F5F5DC] rounded cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Code Content Area - Full 540px Explicit Scrollable IDE Viewport */}
            {activeTab === 'source' ? (
              <div className="flex h-[540px] bg-[#1E2936]">
                {/* Scroll-Synced Line Numbers Gutter */}
                <div
                  ref={gutterRef}
                  onClick={() => textareaRef.current?.focus()}
                  className="w-12 h-[540px] overflow-hidden py-4 pb-16 pl-2 pr-3 select-none text-right font-mono text-[13px] leading-6 text-[#BDC3C7]/45 border-r border-[#2C3E50] bg-[#18222D] shrink-0 tabular-nums cursor-text"
                >
                  {Array.from({ length: gutterLineCount }, (_, i) => (
                    <div key={i} className="h-6 leading-6">
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </div>
                  ))}
                </div>

                {/* Native Scrollable Code Textarea */}
                <textarea
                  ref={textareaRef}
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onScroll={(e) => {
                    if (gutterRef.current) {
                      gutterRef.current.scrollTop = e.currentTarget.scrollTop;
                    }
                  }}
                  wrap="off"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Python code editor"
                  className="flex-1 block w-full h-[540px] py-4 px-4 font-mono text-[13px] leading-6 text-[#F5F5DC] bg-[#1E2936] resize-none overflow-y-auto overflow-x-auto focus:outline-hidden whitespace-pre selection:bg-[#1E3A78]/70 selection:text-[#F5F5DC]"
                />
              </div>
            ) : activeTab === 'tests' ? (
              <div className="p-5 font-mono text-[13px] text-[#F5F5DC] bg-[#1E2936] h-[520px] overflow-y-auto leading-6">
                <pre className="whitespace-pre-wrap">{`# Automated checks run when you click "Run Tests"\n\n` +
                  currentProject.steps
                    .map(
                      (s) =>
                        `def test_step_${s.stepNumber}():\n    # ${s.title}\n    ${s.validationSnippet}`
                    )
                    .join('\n\n')}</pre>
              </div>
            ) : (
              <div className="p-5 font-mono text-xs text-[#F5F5DC] bg-[#1E2936] h-[520px] overflow-y-auto leading-relaxed space-y-4">
                <h4 className="font-bold text-sm text-amber-400">
                  # {currentProject.title} — Step-by-Step Guide
                </h4>
                {currentProject.steps.map((step) => (
                  <div key={step.stepNumber} className="p-3.5 rounded-lg bg-[#141C24] border border-[#2C3E50] space-y-1.5">
                    <div className="font-bold text-sky-300">
                      Step {step.stepNumber}: {step.title}
                    </div>
                    <p className="text-[#BDC3C7]">{step.taskInstruction}</p>
                    <pre className="pt-1 text-emerald-300 overflow-x-auto">{step.breadcrumbs.level2Syntax}</pre>
                  </div>
                ))}
              </div>
            )}

            {/* Editor Bottom Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[#2C3E50] bg-[#141C24] text-[11px] font-mono text-[#BDC3C7] tabular-nums">
              <div className="flex items-center gap-3">
                <span className="text-[#F5F5DC] font-semibold">Python 3.11</span>
                <span aria-hidden="true">·</span>
                <span>{codeLines.length} lines</span>
                <span aria-hidden="true">·</span>
                <span>Tab = 4 spaces</span>
              </div>
              <div className="text-emerald-400">
                Autosaved
              </div>
            </div>
          </div>

          {/* Bottom Output / Terminal Tabs */}
          <div className="rounded-2xl border border-[#2C3E50] bg-[#141C24] shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#2C3E50] bg-[#0E141B] text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOutputTab('repl')}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] cursor-pointer ${
                    outputTab === 'repl'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  Program Output
                </button>

                <button
                  onClick={() => setOutputTab('test')}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] flex items-center gap-1.5 cursor-pointer ${
                    outputTab === 'test'
                      ? 'bg-[#1E2936] text-[#F5F5DC] font-semibold'
                      : 'text-[#BDC3C7] hover:text-[#F5F5DC]'
                  }`}
                >
                  <span>Test Results</span>
                  <span className="text-[10px] text-[#BDC3C7]">
                    ({testsPassedCount}/{testCards.length})
                  </span>
                </button>

                {executionMeta && (
                  <span className="hidden sm:inline font-mono text-[10px] text-[#BDC3C7]/70 pl-2">
                    {executionMeta.durationMs}ms
                  </span>
                )}
              </div>

              <button
                onClick={() => setTerminalOutput('>>> Terminal cleared.\n')}
                className="p-1 text-[#BDC3C7] hover:text-[#F5F5DC] rounded cursor-pointer"
                title="Clear Terminal"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Terminal Body */}
            <div
              ref={terminalContainerRef}
              className="p-4 font-mono text-xs text-[#F5F5DC] min-h-[200px] max-h-[320px] overflow-y-auto leading-relaxed scrollbar-thin"
            >
              <pre className="whitespace-pre-wrap font-mono">
                <code>{terminalOutput}</code>
              </pre>
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
