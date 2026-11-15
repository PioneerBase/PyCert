import { KernelVariable } from '../types';

// Client-Side Python Execution Engine (Pyodide WebAssembly Shared Notebook Kernel + Resilient Fallback)

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL?: string }) => Promise<any>;
    pyodideInstance?: any;
  }
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  returnValue?: any;
  durationMs: number;
  engine: 'pyodide-wasm' | 'simulated-engine';
  isError: boolean;
}

export interface StepCheckConfig {
  stepNumber: number;
  validationSnippet: string;
  diagnosticExpr?: string;
  expectedExample?: string;
}

export interface NotebookCellResult {
  stdout: string;
  stderr: string;
  isError: boolean;
  durationMs: number;
  engine: 'pyodide-wasm' | 'simulated-engine';
  executionCount: number;
  variables: KernelVariable[];
  needsInput?: boolean;
  inputPrompt?: string;
  stepCheck?: {
    passed: boolean;
    message?: string;
  };
}

export type RuntimeStatus = 'uninitialized' | 'loading' | 'ready' | 'fallback';

const PYODIDE_VERSION = 'v0.26.4';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;
const PYODIDE_LOAD_TIMEOUT_MS = 25000;

let pyodideLoadingPromise: Promise<any | null> | null = null;
let notebookExecutionCount = 0;
let runtimeStatus: RuntimeStatus = 'uninitialized';

// Serialize all kernel mutations/executions so rapid re-runs and restarts never collide
let kernelQueue: Promise<unknown> = Promise.resolve();

function enqueueKernelTask<T>(task: () => Promise<T>): Promise<T> {
  const next = kernelQueue.then(task, task);
  kernelQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

// Stateful fallback storage if offline / CDN blocked
let simCellSources = new Map<string, string>();
let simExecutionVariables: KernelVariable[] = [];

export function getKernelRuntimeStatus(): RuntimeStatus {
  if (typeof window !== 'undefined' && window.pyodideInstance) {
    return 'ready';
  }
  return runtimeStatus;
}

function loadPyodideScriptWithTimeout(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (window.loadPyodide) {
      resolve();
      return;
    }

    // Remove any previously failed script element so retry works cleanly
    const stale = document.querySelector('script[data-pycert-pyodide="true"]');
    if (stale) {
      stale.remove();
    }

    const script = document.createElement('script');
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-pycert-pyodide', 'true');

    const timer = window.setTimeout(() => {
      script.remove();
      reject(new Error('Timed out loading Python WebAssembly runtime'));
    }, PYODIDE_LOAD_TIMEOUT_MS);

    script.onload = () => {
      window.clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timer);
      script.remove();
      reject(new Error('Failed to load Pyodide script'));
    };

    document.head.appendChild(script);
  });
}

async function initPyodideRuntime(): Promise<any | null> {
  if (typeof window === 'undefined') return null;
  if (window.pyodideInstance) {
    runtimeStatus = 'ready';
    return window.pyodideInstance;
  }

  if (!pyodideLoadingPromise) {
    runtimeStatus = 'loading';
    pyodideLoadingPromise = (async () => {
      try {
        await loadPyodideScriptWithTimeout();
        if (!window.loadPyodide) {
          throw new Error('loadPyodide unavailable after script load');
        }

        const pyodide = await Promise.race([
          window.loadPyodide({ indexURL: PYODIDE_INDEX_URL }),
          new Promise<never>((_, reject) =>
            window.setTimeout(
              () => reject(new Error('Timed out initializing Pyodide WASM')),
              PYODIDE_LOAD_TIMEOUT_MS
            )
          ),
        ]);

        // Ensure stdin never pops up window.prompt() inside iframes
        if (typeof pyodide.setStdin === 'function') {
          pyodide.setStdin({ stdin: () => null });
        }

        await pyodide.runPythonAsync(`_pycert_ns = {'__name__': '__main__'}`);
        window.pyodideInstance = pyodide;
        runtimeStatus = 'ready';
        return pyodide;
      } catch {
        // Clear cached promise so subsequent clicks or "Reload Kernel" retry cleanly
        pyodideLoadingPromise = null;
        runtimeStatus = 'fallback';
        return null;
      }
    })();
  }

  return pyodideLoadingPromise;
}

export async function getPyodide(): Promise<any | null> {
  return initPyodideRuntime();
}

export function prewarmPyodide(): void {
  if (typeof window !== 'undefined' && !window.pyodideInstance && !pyodideLoadingPromise) {
    void initPyodideRuntime();
  }
}

/**
 * Reset the shared notebook kernel namespace & execution counter.
 * If Pyodide previously failed to load, retries initializing it.
 */
export async function resetNotebookKernel(): Promise<void> {
  await enqueueKernelTask(async () => {
    notebookExecutionCount = 0;
    simCellSources = new Map<string, string>();
    simExecutionVariables = [];

    if (typeof window === 'undefined') return;

    const pyodide = window.pyodideInstance || (await initPyodideRuntime());
    if (pyodide) {
      try {
        await pyodide.runPythonAsync(`_pycert_ns = {'__name__': '__main__'}`);
      } catch {
        // Ignore namespace reset error; reloadPythonRuntime handles full teardown
      }
    }
  });
}

/**
 * Fully reload / recover the Python runtime and reset all live kernel state.
 */
export async function reloadPythonRuntime(
  forceFullReload: boolean = false
): Promise<{ ready: boolean; engine: 'pyodide-wasm' | 'simulated-engine' }> {
  return enqueueKernelTask(async () => {
    notebookExecutionCount = 0;
    simCellSources = new Map<string, string>();
    simExecutionVariables = [];

    if (typeof window === 'undefined') {
      return { ready: false, engine: 'simulated-engine' };
    }

    if (forceFullReload) {
      window.pyodideInstance = undefined;
      pyodideLoadingPromise = null;
      runtimeStatus = 'uninitialized';
    }

    const pyodide = await initPyodideRuntime();
    if (pyodide) {
      try {
        await pyodide.runPythonAsync(`_pycert_ns = {'__name__': '__main__'}`);
        return { ready: true, engine: 'pyodide-wasm' };
      } catch {
        window.pyodideInstance = undefined;
        pyodideLoadingPromise = null;
        const retried = await initPyodideRuntime();
        if (retried) {
          return { ready: true, engine: 'pyodide-wasm' };
        }
      }
    }

    return { ready: false, engine: 'simulated-engine' };
  });
}

/**
 * Execute a single notebook cell inside the shared Python kernel,
 * optionally run its step validation inside the same namespace,
 * and return stdout, stderr, step check status, and live kernel variables.
 */
export async function executeNotebookCell(
  cellId: string,
  code: string,
  stepCheck?: StepCheckConfig,
  suppliedInputs: string[] = []
): Promise<NotebookCellResult> {
  return enqueueKernelTask(async () => {
    const startTime = performance.now();
    notebookExecutionCount += 1;
    const currentExecNum = notebookExecutionCount;

    try {
      const pyodide = await initPyodideRuntime();
      if (pyodide) {
        pyodide.globals.set('_pycert_cell_code', code);
        pyodide.globals.set('_pycert_has_check', Boolean(stepCheck));
        pyodide.globals.set('_pycert_val_code', stepCheck?.validationSnippet || '');
        pyodide.globals.set('_pycert_diag_expr', stepCheck?.diagnosticExpr || 'None');
        pyodide.globals.set(
          '_pycert_expected_str',
          stepCheck?.expectedExample || 'matching output'
        );
        pyodide.globals.set('_pycert_inputs_json', JSON.stringify(suppliedInputs));

        const driverResultJson = await pyodide.runPythonAsync(`
import builtins as _pycert_builtins
import contextlib as _pycert_ctx
import io as _pycert_io
import json as _pycert_json
import sys as _pycert_sys
import traceback as _pycert_tb
import types as _pycert_types

if '_pycert_ns' not in globals() or not isinstance(_pycert_ns, dict):
    _pycert_ns = {}
_pycert_ns['__name__'] = '__main__'

_supplied_list = _pycert_json.loads(_pycert_inputs_json) if _pycert_inputs_json else []
_input_idx = 0
_need_input_prompt = None

class _PyCertNeedInput(BaseException):
    pass

_stdout_io = _pycert_io.StringIO()
_stderr_io = _pycert_io.StringIO()

def _pycert_interactive_input(prompt=""):
    global _input_idx, _need_input_prompt
    prompt_str = "" if prompt is None else str(prompt)
    if _input_idx < len(_supplied_list):
        val = str(_supplied_list[_input_idx])
        _input_idx += 1
        _stdout_io.write(f"{prompt_str}{val}\\n")
        return val
    _need_input_prompt = prompt_str
    raise _PyCertNeedInput(prompt_str)

def _pycert_val_input(prompt=""):
    raise RuntimeError("Inside graded functions, use the function parameter directly instead of calling input().")

_prev_stdin = _pycert_sys.stdin
_prev_builtin_input = _pycert_builtins.input
_pycert_sys.stdin = _pycert_io.StringIO("\\n".join(str(x) for x in _supplied_list) + ("\\n" if _supplied_list else ""))
_pycert_builtins.input = _pycert_interactive_input

_cell_err = None
_check_passed = None
_check_msg = ""

try:
    _compiled = compile(_pycert_cell_code, '<notebook_cell>', 'exec')
    with _pycert_ctx.redirect_stdout(_stdout_io), _pycert_ctx.redirect_stderr(_stderr_io):
        exec(_compiled, _pycert_ns)
except _PyCertNeedInput:
    pass
except SystemExit as _exit_exc:
    if _exit_exc.code not in (None, 0):
        _cell_err = f"SystemExit: {_exit_exc.code}"
except BaseException as _exc:
    if _need_input_prompt is None:
        _tb_lines = _pycert_tb.format_exception(type(_exc), _exc, _exc.__traceback__)
        _clean_tb = []
        for _line in _tb_lines:
            if 'File "<string>"' in _line or 'File "<exec>"' in _line:
                continue
            _clean_tb.append(_line.replace('File "<notebook_cell>"', 'In cell'))
        _cell_err = "".join(_clean_tb).strip()
finally:
    _pycert_sys.stdin = _prev_stdin
    _pycert_builtins.input = _prev_builtin_input

if _need_input_prompt is None and _cell_err is None and _pycert_has_check and _pycert_val_code:
    _val_stdout = _pycert_io.StringIO()
    _val_stderr = _pycert_io.StringIO()
    _pycert_builtins.input = _pycert_val_input
    try:
        with _pycert_ctx.redirect_stdout(_val_stdout), _pycert_ctx.redirect_stderr(_val_stderr):
            exec(compile(_pycert_val_code, '<step_check>', 'exec'), _pycert_ns)
        _check_passed = True
        _check_msg = "Step check passed!"
    except AssertionError:
        _check_passed = False
        try:
            with _pycert_ctx.redirect_stdout(_val_stdout), _pycert_ctx.redirect_stderr(_val_stderr):
                _got_val = eval(_pycert_diag_expr, _pycert_ns)
            _got_repr = repr(_got_val)
        except Exception as _inner_exc:
            _got_repr = f"<{type(_inner_exc).__name__}: {_inner_exc}>"
        _check_msg = f"Got {_got_repr} (expected {_pycert_expected_str})"
    except Exception as _chk_exc:
        _check_passed = False
        _check_msg = f"{type(_chk_exc).__name__}: {_chk_exc}"
    finally:
        _pycert_builtins.input = _prev_builtin_input
elif _need_input_prompt is None and _cell_err is not None and _pycert_has_check:
    _check_passed = False
    _check_msg = "Fix the error in this cell above, then re-run."

_vars_out = []
for _k, _v in _pycert_ns.items():
    if _k.startswith('_') or _k == '__builtins__':
        continue
    _tname = type(_v).__name__
    if isinstance(_v, _pycert_types.FunctionType):
        _arg_names = list(_v.__code__.co_varnames[:_v.__code__.co_argcount])
        _val_preview = f"def {_k}({', '.join(_arg_names)})"
    elif isinstance(_v, _pycert_types.ModuleType):
        _val_preview = f"<module '{_v.__name__}'>"
    else:
        try:
            _raw_repr = repr(_v)
        except Exception:
            _raw_repr = "<object>"
        _val_preview = _raw_repr if len(_raw_repr) <= 72 else _raw_repr[:69] + "..."
    _vars_out.append({"name": _k, "typeName": _tname, "reprValue": _val_preview})

_vars_out.sort(key=lambda item: (1 if item["typeName"] in ("function", "module", "type") else 0, item["name"]))

_pycert_json.dumps({
    "needsInput": _need_input_prompt is not None,
    "inputPrompt": _need_input_prompt,
    "stdout": _stdout_io.getvalue().rstrip("\\n"),
    "stderrStream": _stderr_io.getvalue().rstrip("\\n"),
    "cellError": _cell_err,
    "checkPassed": _check_passed,
    "checkMsg": _check_msg,
    "variables": _vars_out[:24],
})
`);

        const parsed = JSON.parse(String(driverResultJson));
        const durationMs = Math.round(performance.now() - startTime);

        if (parsed.needsInput) {
          return {
            stdout: parsed.stdout || '',
            stderr: '',
            isError: false,
            durationMs,
            engine: 'pyodide-wasm',
            executionCount: currentExecNum,
            variables: parsed.variables || [],
            needsInput: true,
            inputPrompt: typeof parsed.inputPrompt === 'string' ? parsed.inputPrompt : '',
          };
        }

        const stderrCombined = [parsed.cellError, parsed.stderrStream]
          .filter(Boolean)
          .join('\n')
          .trim();
        const isError = Boolean(parsed.cellError) || Boolean(parsed.stderrStream?.includes('Error'));

        return {
          stdout: parsed.stdout || '',
          stderr: stderrCombined,
          isError,
          durationMs,
          engine: 'pyodide-wasm',
          executionCount: currentExecNum,
          variables: parsed.variables || [],
          stepCheck: stepCheck
            ? {
                passed: Boolean(parsed.checkPassed),
                message: parsed.checkMsg || undefined,
              }
            : undefined,
        };
      }
    } catch (wasmError: any) {
      const durationMs = Math.round(performance.now() - startTime);
      const rawMessage = wasmError?.message || String(wasmError);

      // If WASM itself threw an internal fatal exception, allow next Restart Kernel to recover cleanly
      if (rawMessage.includes('RuntimeError') || rawMessage.includes('Pyodide')) {
        window.pyodideInstance = undefined;
        pyodideLoadingPromise = null;
        runtimeStatus = 'uninitialized';
      }

      return {
        stdout: '',
        stderr: rawMessage,
        isError: true,
        durationMs,
        engine: 'pyodide-wasm',
        executionCount: currentExecNum,
        variables: [],
        stepCheck: stepCheck
          ? {
              passed: false,
              message: 'Execution error occurred in cell. Click Restart Kernel if runtime got stuck.',
            }
          : undefined,
      };
    }

    // Fallback stateful simulator if Pyodide CDN is unavailable or offline
    return simulateNotebookCell(cellId, code, currentExecNum, startTime, stepCheck, suppliedInputs);
  });
}

/**
 * Single-script execution helper
 */
export async function executePythonCode(
  code: string,
  userInputs: string[] = []
): Promise<ExecutionResult> {
  return enqueueKernelTask(async () => {
    const startTime = performance.now();

    try {
      const pyodide = await initPyodideRuntime();
      if (pyodide) {
        pyodide.globals.set('_pycert_script_code', code);
        pyodide.globals.set('_pycert_script_stdin', userInputs.join('\n') + (userInputs.length ? '\n' : ''));

        const resJson = await pyodide.runPythonAsync(`
import contextlib as _pycert_ctx
import io as _pycert_io
import json as _pycert_json
import sys as _pycert_sys
import traceback as _pycert_tb

_out = _pycert_io.StringIO()
_err = _pycert_io.StringIO()
_prev_stdin = _pycert_sys.stdin
_pycert_sys.stdin = _pycert_io.StringIO(_pycert_script_stdin)
_script_ns = {'__name__': '__main__'}
_script_err = ""

try:
    _compiled = compile(_pycert_script_code, '<script>', 'exec')
    with _pycert_ctx.redirect_stdout(_out), _pycert_ctx.redirect_stderr(_err):
        exec(_compiled, _script_ns)
except SystemExit as _exit_exc:
    if _exit_exc.code not in (None, 0):
        _script_err = f"SystemExit: {_exit_exc.code}"
except BaseException as _exc:
    _script_err = "".join(_pycert_tb.format_exception(type(_exc), _exc, _exc.__traceback__)).strip()
finally:
    _pycert_sys.stdin = _prev_stdin

_pycert_json.dumps({
    "stdout": _out.getvalue().rstrip("\\n"),
    "stderr": (_script_err or _err.getvalue().rstrip("\\n")),
    "isError": bool(_script_err),
})
`);

        const parsed = JSON.parse(String(resJson));
        const durationMs = Math.round(performance.now() - startTime);
        return {
          stdout: parsed.stdout || '',
          stderr: parsed.stderr || '',
          durationMs,
          engine: 'pyodide-wasm',
          isError: Boolean(parsed.isError),
        };
      }
    } catch (wasmError: any) {
      const durationMs = Math.round(performance.now() - startTime);
      return {
        stdout: '',
        stderr: wasmError?.message || String(wasmError),
        durationMs,
        engine: 'pyodide-wasm',
        isError: true,
      };
    }

    const fallback = simulateNotebookCell('script', code, 1, startTime);
    return {
      stdout: fallback.stdout,
      stderr: fallback.stderr,
      durationMs: fallback.durationMs,
      engine: 'simulated-engine',
      isError: fallback.isError,
    };
  });
}

function stripPythonComments(source: string): string {
  return source
    .split('\n')
    .map((line) => {
      let inSingle = false;
      let inDouble = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        const prev = i > 0 ? line[i - 1] : '';
        if (ch === "'" && !inDouble && prev !== '\\') inSingle = !inSingle;
        else if (ch === '"' && !inSingle && prev !== '\\') inDouble = !inDouble;
        else if (ch === '#' && !inSingle && !inDouble) {
          return line.slice(0, i).trimEnd();
        }
      }
      return line;
    })
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

function extractSimVariables(allCode: string): KernelVariable[] {
  const vars: KernelVariable[] = [];
  const seen = new Set<string>();

  const fnMatches = allCode.matchAll(/^\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\):/gm);
  for (const m of fnMatches) {
    const name = m[1];
    if (!seen.has(name)) {
      seen.add(name);
      vars.push({ name, typeName: 'function', reprValue: `def ${name}(${m[2]})` });
    }
  }

  const importMatches = allCode.matchAll(/^\s*import\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm);
  for (const m of importMatches) {
    const name = m[1];
    if (!seen.has(name)) {
      seen.add(name);
      vars.push({ name, typeName: 'module', reprValue: `<module '${name}'>` });
    }
  }

  const assignMatches = allCode.matchAll(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/gm);
  for (const m of assignMatches) {
    const name = m[1];
    const rhs = m[2].trim();
    if (seen.has(name) || name.startsWith('_')) continue;
    seen.add(name);
    let typeName = 'object';
    if (/^-?\d+$/.test(rhs)) typeName = 'int';
    else if (/^-?\d+\.\d+$/.test(rhs)) typeName = 'float';
    else if (rhs.startsWith('[') || rhs.startsWith('list(')) typeName = 'list';
    else if (rhs.startsWith('{') && rhs.includes(':')) typeName = 'dict';
    else if (rhs.startsWith('set(')) typeName = 'set';
    else if (rhs.startsWith('"') || rhs.startsWith("'") || rhs.startsWith('f"')) typeName = 'str';
    const preview = rhs.length > 56 ? rhs.slice(0, 53) + '...' : rhs;
    vars.push({ name, typeName, reprValue: preview });
  }

  vars.sort((a, b) => {
    const aIsCall = a.typeName === 'function' || a.typeName === 'module' ? 1 : 0;
    const bIsCall = b.typeName === 'function' || b.typeName === 'module' ? 1 : 0;
    return aIsCall !== bIsCall ? aIsCall - bIsCall : a.name.localeCompare(b.name);
  });

  return vars.slice(0, 24);
}

function simulateNotebookCell(
  cellId: string,
  code: string,
  executionCount: number,
  startTime: number,
  stepCheck?: StepCheckConfig,
  suppliedInputs: string[] = []
): NotebookCellResult {
  simCellSources.set(cellId, code);
  const combinedCode = Array.from(simCellSources.values()).join('\n\n');
  const strippedCombined = stripPythonComments(combinedCode);
  const strippedCell = stripPythonComments(code);
  simExecutionVariables = extractSimVariables(strippedCombined);

  const inputMatches = Array.from(strippedCell.matchAll(/input\(\s*(?:(["'])(.*?)\1)?\s*\)/g));
  if (inputMatches.length > suppliedInputs.length) {
    const nextPrompt = inputMatches[suppliedInputs.length]?.[2] ?? '';
    return {
      stdout: '',
      stderr: '',
      isError: false,
      durationMs: Math.round(performance.now() - startTime),
      engine: 'simulated-engine',
      executionCount,
      variables: simExecutionVariables,
      needsInput: true,
      inputPrompt: nextPrompt,
    };
  }

  const stdoutLines: string[] = [];
  let checkPassed = true;
  let checkMsg = 'Step check passed!';

  const printMatches = strippedCell.matchAll(/print\(([^)]+)\)/g);
  for (const pm of printMatches) {
    stdoutLines.push(pm[1].replace(/["']/g, ''));
  }

  const extractFnBody = (fnName: string): string => {
    const lines = strippedCombined.split('\n');
    let startIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (new RegExp(`^\\s*def\\s+${fnName}\\s*\\(`).test(lines[i])) {
        startIdx = i;
      }
    }
    if (startIdx < 0) return '';
    const baseIndent = (lines[startIdx].match(/^(\s*)/)?.[1] || '').length;
    const bodyLines: string[] = [];
    for (let i = startIdx + 1; i < lines.length; i++) {
      const indent = (lines[i].match(/^(\s*)/)?.[1] || '').length;
      if (lines[i].trim() && indent <= baseIndent) break;
      bodyLines.push(lines[i]);
    }
    return bodyLines.join('\n');
  };

  if (stepCheck) {
    const sn = stepCheck.stepNumber;
    if (
      strippedCombined.includes('def celsius_to_fahrenheit') ||
      strippedCombined.includes('def trip_fuel_stops') ||
      strippedCombined.includes('def format_trip_banner')
    ) {
      if (sn === 1) {
        const b1 = extractFnBody('celsius_to_fahrenheit');
        const hasFormula =
          (b1.includes('9') && b1.includes('5') && b1.includes('32')) ||
          (b1.includes('1.8') && b1.includes('32'));
        checkPassed = hasFormula && !b1.includes('fahrenheit = 0.0');
        checkMsg = checkPassed
          ? 'Step check passed!'
          : 'Got 0.0 — replace 0.0 with (float(celsius) * 9 / 5) + 32';
      } else if (sn === 2) {
        const b2 = extractFnBody('trip_fuel_stops');
        const hasOps = (b2.includes('//') && b2.includes('%')) || b2.includes('divmod(');
        checkPassed = hasOps && !b2.includes('full_stops = 0');
        checkMsg = checkPassed
          ? 'Step check passed!'
          : 'Got (0, 0) — use // for full_stops and % for leftover_miles';
      } else if (sn === 3) {
        const b3 = extractFnBody('format_trip_banner');
        checkPassed =
          b3.length > 0 &&
          !b3.includes('banner = ""') &&
          !b3.trim().endsWith('return ""') &&
          (b3.includes('F') || b3.includes('stops')) &&
          b3.includes('{');
        checkMsg = checkPassed
          ? 'Step check passed!'
          : 'Got "" — format temp_f, stops, and extra into the banner string';
      }
    } else if (strippedCombined.includes('def get_medal')) {
      if (sn === 1) {
        const b1 = extractFnBody('get_medal');
        checkPassed = b1.includes('Gold') && b1.includes('Silver') && b1.includes('Bronze') && b1.includes('if');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got "" — add if/elif/else for Gold (90+), Silver (70+), Bronze';
      } else if (sn === 2) {
        const b2 = extractFnBody('launch_countdown');
        checkPassed =
          (b2.includes('range') && b2.includes('-1')) ||
          (b2.includes('while') && b2.includes('-= 1'));
        checkMsg = checkPassed ? 'Step check passed!' : 'Got [] — return list(range(start_num, 0, -1))';
      } else if (sn === 3) {
        const b3 = extractFnBody('filter_scores');
        checkPassed = b3.includes('break') && b3.includes('continue') && b3.includes('append');
        checkMsg = checkPassed ? 'Step check passed!' : 'Missing break / continue / append inside filter_scores loop';
      }
    } else if (strippedCombined.includes('def get_top_items')) {
      if (sn === 1) {
        const b1 = extractFnBody('get_top_items');
        checkPassed = b1.includes('[:') || (b1.includes('for') && b1.includes('range'));
        checkMsg = checkPassed ? 'Step check passed!' : 'Got [] — use list slicing item_codes[:count]';
      } else if (sn === 2) {
        const b2 = extractFnBody('get_unique_categories');
        checkPassed = b2.includes('.add(') || b2.includes('.update(') || b2.includes('{');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got empty set() — loop through tags and call categories.add(tag)';
      } else if (sn === 3) {
        const b3 = extractFnBody('format_price_label');
        checkPassed = b3.includes('.upper()') && b3.includes('.2f') && !b3.trim().endsWith('return ""');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got "" — format name with .upper() and price with :.2f';
      }
    } else if (strippedCombined.includes('def average_score')) {
      if (sn === 1) {
        const b1 = extractFnBody('average_score');
        checkPassed = (b1.includes('sum(') || b1.includes('for ')) && b1.includes('len(') && !b1.includes('return 0.0\nreturn');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got 0.0 — compute (sum(scores) / len(scores)) + bonus';
      } else if (sn === 2) {
        const b2 = extractFnBody('safe_divide');
        checkPassed = b2.includes('try:') && b2.includes('ZeroDivisionError');
        checkMsg = checkPassed ? 'Step check passed!' : 'Missing try: / except ZeroDivisionError: block';
      } else if (sn === 3) {
        const b3 = extractFnBody('safe_divide');
        checkPassed = b3.includes('ValueError') && b3.includes('TypeError');
        checkMsg = checkPassed ? 'Step check passed!' : 'Missing except (ValueError, TypeError): block';
      }
    } else if (strippedCombined.includes('def parse_gradebook')) {
      if (sn === 1) {
        const b1 = extractFnBody('parse_gradebook');
        checkPassed = b1.includes('split(') && b1.includes('float(') && b1.includes('append(');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got [] — split CSV lines, cast scores with float(), and append (name, avg)';
      } else if (sn === 2) {
        const b2 = extractFnBody('summarize_scores');
        checkPassed = b2.includes('math.ceil') && b2.includes('math.floor');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got 0s — use math.ceil(max(averages)) and math.floor(min(averages))';
      } else if (sn === 3) {
        const b3 = extractFnBody('pick_raffle_winner');
        checkPassed = b3.includes('random.seed') && b3.includes('random.choice');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got "" — call random.seed(42) and return random.choice(names)';
      }
    } else {
      // Check uncommented statements only so leaving # TODO comments doesn't fail valid student code
      const nonCommentLines = strippedCell.split('\n').map((l) => l.trim());
      const stubOnlyReturns = new Set([
        'pass',
        'return ""',
        "return ''",
        'return {}',
        'return 0.0',
        'return 0',
        'return []',
        'return False',
        'return None',
      ]);
      const fnStubs = nonCommentLines.filter((l) => stubOnlyReturns.has(l));
      const defCount = nonCommentLines.filter((l) => l.startsWith('def ')).length;
      const hasOnlyStubs =
        nonCommentLines.length === 0 ||
        (defCount > 0 && fnStubs.length >= defCount && nonCommentLines.length <= defCount * 3);
      checkPassed = !hasOnlyStubs;
      checkMsg = checkPassed
        ? 'Step check passed!'
        : 'Replace the placeholder stub with your implementation and re-run.';
    }
  }

  return {
    stdout: stdoutLines.join('\n'),
    stderr: '',
    isError: false,
    durationMs: Math.round(performance.now() - startTime),
    engine: 'simulated-engine',
    executionCount,
    variables: simExecutionVariables,
    stepCheck: stepCheck
      ? {
          passed: checkPassed,
          message: checkMsg,
        }
      : undefined,
  };
}
