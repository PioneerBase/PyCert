import { KernelVariable } from '../types';

// Client-Side Python Execution Engine (Pyodide WebAssembly Shared Notebook Kernel + Stateful Simulator Fallback)

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
  stepCheck?: {
    passed: boolean;
    message?: string;
  };
}

let pyodideLoadingPromise: Promise<any> | null = null;
let notebookExecutionCount = 0;

// Stateful fallback storage for offline / warming-up browser execution
let simCellSources = new Map<string, string>();
let simExecutionVariables: KernelVariable[] = [];

export async function getPyodide(): Promise<any | null> {
  if (typeof window === 'undefined') return null;
  if (window.pyodideInstance) return window.pyodideInstance;

  if (!pyodideLoadingPromise) {
    pyodideLoadingPromise = new Promise(async (resolve) => {
      try {
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          script.async = true;
          document.head.appendChild(script);

          await new Promise<void>((res, rej) => {
            script.onload = () => res();
            script.onerror = () => rej(new Error('Failed to load Pyodide script'));
          });
        }

        if (window.loadPyodide) {
          const pyodide = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
          });
          window.pyodideInstance = pyodide;
          resolve(pyodide);
        } else {
          resolve(null);
        }
      } catch (err) {
        console.warn('Pyodide CDN load error or offline, fallback simulator active:', err);
        resolve(null);
      }
    });
  }

  return pyodideLoadingPromise;
}

/**
 * Reset the shared Jupyter notebook kernel namespace & execution counter
 */
export async function resetNotebookKernel(): Promise<void> {
  notebookExecutionCount = 0;
  simCellSources = new Map<string, string>();
  simExecutionVariables = [];

  if (typeof window !== 'undefined' && window.pyodideInstance) {
    try {
      await window.pyodideInstance.runPythonAsync(`
_pycert_ns = {}
`);
    } catch (err) {
      console.warn('Could not clear Pyodide notebook namespace:', err);
    }
  }
}

/**
 * Execute a single notebook cell inside the shared Python kernel,
 * optionally run its step validation inside the same namespace,
 * and return stdout, stderr, step check status, and live kernel variables.
 */
export async function executeNotebookCell(
  cellId: string,
  code: string,
  stepCheck?: StepCheckConfig
): Promise<NotebookCellResult> {
  const startTime = performance.now();
  notebookExecutionCount += 1;
  const currentExecNum = notebookExecutionCount;

  try {
    const pyodide = await getPyodide();
    if (pyodide) {
      const stdoutBuffer: string[] = [];
      const stderrBuffer: string[] = [];

      pyodide.setStdout({
        batched: (text: string) => {
          stdoutBuffer.push(text);
        },
      });

      pyodide.setStderr({
        batched: (text: string) => {
          stderrBuffer.push(text);
        },
      });

      pyodide.globals.set('_pycert_cell_code', code);
      pyodide.globals.set('_pycert_has_check', Boolean(stepCheck));
      pyodide.globals.set('_pycert_val_code', stepCheck?.validationSnippet || '');
      pyodide.globals.set('_pycert_diag_expr', stepCheck?.diagnosticExpr || 'None');
      pyodide.globals.set(
        '_pycert_expected_str',
        stepCheck?.expectedExample || 'matching output'
      );

      const driverResultJson = await pyodide.runPythonAsync(`
import json as _pycert_json
import types as _pycert_types
import traceback as _pycert_tb

if '_pycert_ns' not in globals() or not isinstance(_pycert_ns, dict):
    _pycert_ns = {}

_cell_err = None
_check_passed = None
_check_msg = ""

try:
    _compiled = compile(_pycert_cell_code, '<notebook_cell>', 'exec')
    exec(_compiled, _pycert_ns)
except Exception as _exc:
    _tb_lines = _pycert_tb.format_exception(type(_exc), _exc, _exc.__traceback__)
    # Filter internal wrapper frame so students see clean line numbers inside their cell
    _clean_tb = []
    for _line in _tb_lines:
        if 'File "<string>"' in _line:
            continue
        _clean_tb.append(_line.replace('File "<notebook_cell>"', 'In cell'))
    _cell_err = "".join(_clean_tb).strip()

if _cell_err is None and _pycert_has_check and _pycert_val_code:
    try:
        exec(compile(_pycert_val_code, '<step_check>', 'exec'), _pycert_ns)
        _check_passed = True
        _check_msg = "Step check passed!"
    except AssertionError:
        _check_passed = False
        try:
            _got_val = eval(_pycert_diag_expr, _pycert_ns)
            _got_repr = repr(_got_val)
        except Exception as _inner_exc:
            _got_repr = f"<{type(_inner_exc).__name__}: {_inner_exc}>"
        _check_msg = f"Got {_got_repr} (expected {_pycert_expected_str})"
    except Exception as _chk_exc:
        _check_passed = False
        _check_msg = f"{type(_chk_exc).__name__}: {_chk_exc}"
elif _cell_err is not None and _pycert_has_check:
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

# Sort variables first, functions/modules after, preserving alphabetical order within groups
_vars_out.sort(key=lambda item: (1 if item["typeName"] in ("function", "module", "type") else 0, item["name"]))

_pycert_json.dumps({
    "cellError": _cell_err,
    "checkPassed": _check_passed,
    "checkMsg": _check_msg,
    "variables": _vars_out[:24],
})
`);

      const parsed = JSON.parse(String(driverResultJson));
      const durationMs = Math.round(performance.now() - startTime);

      const stderrCombined = [parsed.cellError, ...stderrBuffer].filter(Boolean).join('\n').trim();
      const isError = Boolean(parsed.cellError) || stderrBuffer.some((s) => s.includes('Error'));

      return {
        stdout: stdoutBuffer.join('\n'),
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
    return {
      stdout: '',
      stderr: wasmError?.message || String(wasmError),
      isError: true,
      durationMs,
      engine: 'pyodide-wasm',
      executionCount: currentExecNum,
      variables: [],
      stepCheck: stepCheck
        ? {
            passed: false,
            message: 'Execution error occurred in cell.',
          }
        : undefined,
    };
  }

  // Fallback stateful simulator if Pyodide CDN is unavailable or offline
  return simulateNotebookCell(cellId, code, currentExecNum, startTime, stepCheck);
}

/**
 * Legacy single-script execution helper (preserved for compatibility)
 */
export async function executePythonCode(
  code: string,
  userInputs: string[] = []
): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    const pyodide = await getPyodide();
    if (pyodide) {
      const stdoutBuffer: string[] = [];
      const stderrBuffer: string[] = [];

      pyodide.setStdout({
        batched: (text: string) => {
          stdoutBuffer.push(text);
        },
      });

      pyodide.setStderr({
        batched: (text: string) => {
          stderrBuffer.push(text);
        },
      });

      let inputIdx = 0;
      pyodide.setStdin({
        stdin: () => {
          if (inputIdx < userInputs.length) {
            return userInputs[inputIdx++];
          }
          return '';
        },
      });

      const ret = await pyodide.runPythonAsync(code);
      const durationMs = Math.round(performance.now() - startTime);

      return {
        stdout: stdoutBuffer.join('\n'),
        stderr: stderrBuffer.join('\n'),
        returnValue: ret,
        durationMs,
        engine: 'pyodide-wasm',
        isError: stderrBuffer.length > 0 && stderrBuffer.some((s) => s.includes('Error')),
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
}

function extractSimVariables(allCode: string): KernelVariable[] {
  const vars: KernelVariable[] = [];
  const seen = new Set<string>();

  // Extract defined functions
  const fnMatches = allCode.matchAll(/^\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\):/gm);
  for (const m of fnMatches) {
    const name = m[1];
    if (!seen.has(name)) {
      seen.add(name);
      vars.push({ name, typeName: 'function', reprValue: `def ${name}(${m[2]})` });
    }
  }

  // Extract imports
  const importMatches = allCode.matchAll(/^\s*import\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm);
  for (const m of importMatches) {
    const name = m[1];
    if (!seen.has(name)) {
      seen.add(name);
      vars.push({ name, typeName: 'module', reprValue: `<module '${name}'>` });
    }
  }

  // Extract top-level simple assignments
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
  stepCheck?: StepCheckConfig
): NotebookCellResult {
  simCellSources.set(cellId, code);
  const combinedCode = Array.from(simCellSources.values()).join('\n\n');
  simExecutionVariables = extractSimVariables(combinedCode);

  const stdoutLines: string[] = [];
  let checkPassed = true;
  let checkMsg = 'Step check passed!';

  // Evaluate simple print lines for visual feedback
  const printMatches = code.matchAll(/print\(([^)]+)\)/g);
  for (const pm of printMatches) {
    stdoutLines.push(pm[1].replace(/["']/g, ''));
  }

  const extractFnBody = (fnName: string): string => {
    const regex = new RegExp(
      `def\\s+${fnName}\\s*\\([^)]*\\):([\\s\\S]*?)(?=\\ndef\\s+|\\n[a-zA-Z_]+\\s*=|\\nprint\\(|$)`
    );
    const matches = Array.from(combinedCode.matchAll(new RegExp(regex.source, 'g')));
    return matches.length > 0 ? matches[matches.length - 1][1] : '';
  };

  if (stepCheck) {
    const sn = stepCheck.stepNumber;
    if (combinedCode.includes('def celsius_to_fahrenheit')) {
      if (sn === 1) {
        const b1 = extractFnBody('celsius_to_fahrenheit');
        checkPassed = b1.includes('9') && b1.includes('5') && b1.includes('32') && !b1.includes('fahrenheit = 0.0');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got 0.0 — replace 0.0 with (float(celsius) * 9 / 5) + 32';
      } else if (sn === 2) {
        const b2 = extractFnBody('trip_fuel_stops');
        checkPassed = b2.includes('//') && b2.includes('%') && !b2.includes('full_stops = 0');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got (0, 0) — use // for full_stops and % for leftover_miles';
      } else if (sn === 3) {
        const b3 = extractFnBody('format_trip_banner');
        checkPassed = b3.includes('temp_f') && b3.includes('stops') && b3.includes('extra') && !b3.includes('return ""');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got "" — format temp_f, stops, and extra into the banner string';
      }
    } else if (combinedCode.includes('def get_medal')) {
      if (sn === 1) {
        const b1 = extractFnBody('get_medal');
        checkPassed = b1.includes('Gold') && b1.includes('Silver') && b1.includes('Bronze') && b1.includes('if');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got "" — add if/elif/else for Gold (90+), Silver (70+), Bronze';
      } else if (sn === 2) {
        const b2 = extractFnBody('launch_countdown');
        checkPassed = b2.includes('range') && b2.includes('-1') && !b2.includes('return []');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got [] — return list(range(start_num, 0, -1))';
      } else if (sn === 3) {
        const b3 = extractFnBody('filter_scores');
        checkPassed = b3.includes('break') && b3.includes('continue') && b3.includes('append');
        checkMsg = checkPassed ? 'Step check passed!' : 'Missing break / continue / append inside filter_scores loop';
      }
    } else if (combinedCode.includes('def get_top_items')) {
      if (sn === 1) {
        const b1 = extractFnBody('get_top_items');
        checkPassed = b1.includes('[:') && !b1.includes('return []');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got [] — use list slicing item_codes[:count]';
      } else if (sn === 2) {
        const b2 = extractFnBody('get_unique_categories');
        checkPassed = b2.includes('.add(') && b2.includes('for');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got empty set() — loop through tags and call categories.add(tag)';
      } else if (sn === 3) {
        const b3 = extractFnBody('format_price_label');
        checkPassed = b3.includes('.upper()') && b3.includes('.2f') && !b3.includes('return ""');
        checkMsg = checkPassed ? 'Step check passed!' : 'Got "" — format name with .upper() and price with :.2f';
      }
    } else if (combinedCode.includes('def average_score')) {
      if (sn === 1) {
        const b1 = extractFnBody('average_score');
        checkPassed = b1.includes('sum(') && b1.includes('len(') && !b1.includes('return 0.0\n');
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
    } else if (combinedCode.includes('def parse_gradebook')) {
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
    } else if (combinedCode.includes('def caesar_cipher')) {
      const fnBody = extractFnBody('caesar_cipher');
      if (sn === 1) {
        checkPassed = fnBody.includes('chr(') && fnBody.includes('ord(') && fnBody.includes('% 26');
        checkMsg = checkPassed ? 'Step check passed!' : 'Replace char with chr((ord(char) - base + shift) % 26 + base)';
      } else if (sn === 2) {
        checkPassed = (fnBody.match(/% 26/g) || []).length >= 2;
        checkMsg = checkPassed ? 'Step check passed!' : 'Update elif char.islower() with chr((ord(char) - base + shift) % 26 + base)';
      } else if (sn === 3) {
        const b3 = extractFnBody('decode_cipher');
        checkPassed = b3.includes('caesar_cipher(') && b3.includes('-shift');
        checkMsg = checkPassed ? 'Step check passed!' : 'Return caesar_cipher(text, -shift) inside decode_cipher';
      }
    } else if (combinedCode.includes('def format_24h') || combinedCode.includes('def decimal_to_binary') || combinedCode.includes('def calculate') || combinedCode.includes('def add_task') || combinedCode.includes('def comfort_tier') || combinedCode.includes('def create_player') || combinedCode.includes('def solar_hour_angle') || combinedCode.includes('def create_post') || combinedCode.includes('def add_to_cart') || combinedCode.includes('def compute_vibe_score')) {
      checkPassed = !code.includes('# TODO') && !code.includes('return ""\n') && !code.includes('return {}\n') && !code.includes('return 0.0\n');
      checkMsg = checkPassed ? 'Step check passed!' : 'Replace the # TODO placeholder with your implementation and re-run.';
    }
  }

  return {
    stdout: stdoutLines.join('\n') || 'Cell evaluated (offline simulator mode).',
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
