import { PcepSection, MicroProject, Flashcard, QuizQuestion, ChecklistItem, CapstoneProject } from '../types';

export const PCEP_SECTIONS: PcepSection[] = [
  {
    sectionNumber: 1,
    title: 'Computer Programming & Python Fundamentals',
    shortTitle: 'Fundamentals & I/O',
    weightPercentage: 17,
    itemCount: 6,
    description: 'Lexis, syntax, semantics, interpretation pipeline, literals, operators, precedence, casting, and console I/O formatting.',
    objectives: [
      { id: '1.1', sectionNumber: 1, title: 'Execution Pipeline & Architecture', description: 'Lexis, syntax, semantics, interpreter vs compiler models, compilation to bytecode (.pyc), CPython virtual machine.', syllabusKeywords: ['interpreter', 'compiler', 'bytecode', 'semantics', 'CPython'] },
      { id: '1.2', sectionNumber: 1, title: 'Identifiers, PEP 8 & Comments', description: 'Identifier rules, keywords vs variable names, PEP 8 styling conventions, indentation blocks, line continuations, comments.', syllabusKeywords: ['PEP 8', 'identifiers', 'keywords', 'indentation', 'comments'] },
      { id: '1.3', sectionNumber: 1, title: 'Literals & Floating-Point Nuances', description: 'Integer literals, float literals (scientific notation), string literals, boolean literals, float representation limits (IEEE 754).', syllabusKeywords: ['literals', 'scientific notation', 'boolean', 'float precision'] },
      { id: '1.4', sectionNumber: 1, title: 'Numeric, Relational & Logical Operators', description: 'Arithmetic operators (**, //, %), relational comparisons, logical operators (and, or, not), short-circuit evaluation.', syllabusKeywords: ['operators', 'precedence', 'modulo', 'floor division', 'short-circuit'] },
      { id: '1.5', sectionNumber: 1, title: 'Operator Precedence & Binding', description: 'Precedence hierarchies, unary operators, left-sided vs right-sided binding (exponentiation ** binds right-to-left).', syllabusKeywords: ['binding', 'associativity', 'precedence hierarchy'] },
      { id: '1.6', sectionNumber: 1, title: 'Console I/O & Type Casting', description: 'print() function arguments (sep, end), input() string capture, explicit casting with int(), float(), str(), bool().', syllabusKeywords: ['print', 'input', 'sep', 'end', 'type casting'] },
    ],
  },
  {
    sectionNumber: 2,
    title: 'Control Flow — Conditional Blocks & Loops',
    shortTitle: 'Control Flow & Loops',
    weightPercentage: 23,
    itemCount: 8,
    description: 'Conditional branching, while loops with sentinels, walrus operator, for loops across ranges and iterables, break/continue/pass.',
    objectives: [
      { id: '2.1', sectionNumber: 2, title: 'Conditional Branching', description: 'if, if-else, if-elif-else cascades, nested conditions, boolean truth values and truthy/falsy evaluation.', syllabusKeywords: ['if-elif-else', 'branching', 'truthy', 'falsy'] },
      { id: '2.2', sectionNumber: 2, title: 'Condition-Controlled while Loops', description: 'while loop structure, loop condition updates, infinite loop avoidance, multi-condition terminations.', syllabusKeywords: ['while', 'condition-controlled', 'infinite loop'] },
      { id: '2.3', sectionNumber: 2, title: 'Sentinel Values & State Flags', description: 'Terminating while loops with user input sentinel constants, flag variables, defensive termination checks.', syllabusKeywords: ['sentinel', 'state flag', 'loop control'] },
      { id: '2.4', sectionNumber: 2, title: 'Assignment Expressions (Walrus Operator)', description: 'Using := in loop conditions to simultaneously evaluate and assign input or stream data.', syllabusKeywords: ['walrus operator', ':=', 'assignment expressions'] },
      { id: '2.5', sectionNumber: 2, title: 'Sequence Iteration with for Loops', description: 'Iterating over strings, lists, tuples with in keyword, tracking elements without index counters.', syllabusKeywords: ['for', 'iteration', 'iterable', 'in'] },
      { id: '2.6', sectionNumber: 2, title: 'range() Generator Functions', description: 'range(stop), range(start, stop), range(start, stop, step) with positive and negative step strides.', syllabusKeywords: ['range', 'step stride', 'negative step'] },
      { id: '2.7', sectionNumber: 2, title: 'Loop Jump Statements: break & continue', description: 'Early loop termination via break, immediate loop cycle skip via continue, loop else blocks.', syllabusKeywords: ['break', 'continue', 'loop else'] },
      { id: '2.8', sectionNumber: 2, title: 'Pass Statement & Nested Loop Tracing', description: 'pass as structural syntactical placeholder, nested row/column iteration grids, 2D coordinate traversals.', syllabusKeywords: ['pass', 'nested loops', 'coordinate grid'] },
    ],
  },
  {
    sectionNumber: 3,
    title: 'Data Collections — Lists, Tuples, Sets, Dicts & Strings',
    shortTitle: 'Collections & Strings',
    weightPercentage: 26,
    itemCount: 9,
    description: 'Lists, slicing, 2D matrices, tuple immutability, unique sets, dictionaries, string escape codes, and string methods.',
    objectives: [
      { id: '3.1', sectionNumber: 3, title: 'List Indexing, Slicing & Memory Sharing', description: 'Zero-based positive and negative indices, [start:stop:step] slicing, shallow copy vs pointer references.', syllabusKeywords: ['indexing', 'slicing', 'shallow copy', 'stride'] },
      { id: '3.2', sectionNumber: 3, title: 'List Manipulation Methods', description: 'append(), insert(), extend(), pop(), remove(), del statement, sort() vs sorted(), index(), count().', syllabusKeywords: ['append', 'insert', 'pop', 'del', 'sort'] },
      { id: '3.3', sectionNumber: 3, title: 'Multidimensional Lists (Matrices)', description: 'Nested lists for 2D/3D grids, list comprehensions for matrix generation, row/col addressing [r][c].', syllabusKeywords: ['matrices', 'nested lists', '2D grid'] },
      { id: '3.4', sectionNumber: 3, title: 'Tuples & Immutability Guarantees', description: 'Tuple syntax, 1-element tuple comma rule (val,), packing/unpacking, TypeError on assignment.', syllabusKeywords: ['tuple', 'immutability', 'singleton comma'] },
      { id: '3.5', sectionNumber: 3, title: 'Sets & Uniqueness Algebra', description: 'Set literals {}, set() constructor, unindexed nature, add(), remove(), discard(), union/intersection.', syllabusKeywords: ['set', 'unique', 'unindexed', 'discard'] },
      { id: '3.6', sectionNumber: 3, title: 'Dictionary Key-Value Mapping', description: 'Keys immutability requirement, values(), keys(), items(), get() with default, in operator key checking.', syllabusKeywords: ['dict', 'key-value', 'keys', 'values', 'items', 'get'] },
      { id: '3.7', sectionNumber: 3, title: 'Dictionary Mutation & Deletion', description: 'Updating entries, pop(), popitem(), update(), del dict[key], KeyError prevention.', syllabusKeywords: ['dict mutation', 'pop', 'popitem', 'KeyError'] },
      { id: '3.8', sectionNumber: 3, title: 'String Immutability & Escape Sequences', description: 'Single, double, triple-quoted strings, escape characters (\\n, \\t, \\\\, \\\'), raw strings r"", immutability.', syllabusKeywords: ['escape sequence', 'raw string', 'immutability', 'newline'] },
      { id: '3.9', sectionNumber: 3, title: 'String Methods & Modern Formatting', description: 'lower(), upper(), title(), strip(), split(), join(), replace(), f-strings f"{var}", format(), % operator.', syllabusKeywords: ['split', 'join', 'strip', 'f-string', 'format'] },
    ],
  },
  {
    sectionNumber: 4,
    title: 'Functions & Exceptions',
    shortTitle: 'Functions & Exceptions',
    weightPercentage: 20,
    itemCount: 7,
    description: 'def statements, parameter vs argument, return values, *args/**kwargs, local vs global scope, try-except hierarchy.',
    objectives: [
      { id: '4.1', sectionNumber: 4, title: 'Function Definition & Execution Flow', description: 'def syntax, function invocation order, parameters vs arguments, None return on implicit exit.', syllabusKeywords: ['def', 'invocation', 'parameter', 'argument', 'None'] },
      { id: '4.2', sectionNumber: 4, title: 'Return Values & Tuple Packing', description: 'Single and multiple return expressions, returning tuples, early exits via bare return.', syllabusKeywords: ['return', 'multiple returns', 'tuple return'] },
      { id: '4.3', sectionNumber: 4, title: 'Positional, Keyword & Default Arguments', description: 'Positional ordering rules, named keyword arguments, default parameters, mutable default gotchas.', syllabusKeywords: ['positional', 'keyword args', 'default values'] },
      { id: '4.4', sectionNumber: 4, title: 'Variable-Length Arguments (*args, **kwargs)', description: 'Packing excess positional args into tuple (*args), keyword args into dictionary (**kwargs).', syllabusKeywords: ['*args', '**kwargs', 'variable arguments'] },
      { id: '4.5', sectionNumber: 4, title: 'Scope Resolution & global Keyword', description: 'LEGB rule (Local, Enclosing, Global, Built-in), variable shadowing, modifying globals with global keyword.', syllabusKeywords: ['scope', 'LEGB', 'shadowing', 'global'] },
      { id: '4.6', sectionNumber: 4, title: 'Exception Interruption & try-except', description: 'Program flow disruption on error, try-except handling, catching specific exceptions, except as alias.', syllabusKeywords: ['try-except', 'error handling', 'flow interruption'] },
      { id: '4.7', sectionNumber: 4, title: 'Built-in Exception Hierarchy & else/finally', description: 'ValueError, TypeError, ZeroDivisionError, IndexError, KeyError, NameError, BaseException vs Exception, else and finally blocks.', syllabusKeywords: ['ValueError', 'TypeError', 'ZeroDivisionError', 'finally', 'else'] },
    ],
  },
  {
    sectionNumber: 5,
    title: 'File Handling & Module Imports',
    shortTitle: 'Files & Standard Modules',
    weightPercentage: 14,
    itemCount: 5,
    description: 'File modes (r, w, a), with statement safe context management, csv reader/writer, math & random module functions.',
    objectives: [
      { id: '5.1', sectionNumber: 5, title: 'File Access Modes & Stream Lifecycle', description: 'open() modes: read ("r"), write ("w"), append ("a"), readlines(), write(), flush, and close().', syllabusKeywords: ['open', 'read', 'write', 'append', 'readlines'] },
      { id: '5.2', sectionNumber: 5, title: 'Context Management with the with Statement', description: 'Safe file handling via with open(...) as f:, automatic cleanup on exceptions and exits.', syllabusKeywords: ['with', 'context manager', 'auto close'] },
      { id: '5.3', sectionNumber: 5, title: 'CSV Processing with standard csv Module', description: 'Structure of comma-separated values, csv.reader(), csv.writer(), iterating rows as lists.', syllabusKeywords: ['csv', 'csv.reader', 'csv.writer', 'delimiter'] },
      { id: '5.4', sectionNumber: 5, title: 'Module Import Syntax & Namespaces', description: 'import module, import module as alias, from module import func, from module import *, module __name__.', syllabusKeywords: ['import', 'alias', 'from import', 'namespace'] },
      { id: '5.5', sectionNumber: 5, title: 'Standard Library Utilities: math & random', description: 'math.ceil(), math.floor(), math.trunc(), math.sqrt(), math.pi; random.random(), random.seed(), random.choice(), random.sample().', syllabusKeywords: ['math.ceil', 'math.floor', 'math.trunc', 'random.choice', 'random.seed'] },
    ],
  },
];

export const MICRO_PROJECTS: MicroProject[] = [
  {
    id: 'proj-01-converter',
    title: 'CLI Scientific Unit & Thermal Metric Engine',
    sectionNumber: 1,
    sectionName: 'Computer Programming & Python Fundamentals',
    examWeightPercentage: 17,
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    specificObjectives: ['1.3', '1.4', '1.5', '1.6'],
    description: 'Build a terminal-based scientific unit converter demonstrating floating-point numeric operations, operator precedence, type casting from input(), and formatted console output with sep and end arguments.',
    learningOutcomes: [
      'Master explicit casting from string inputs via float() and int()',
      'Verify operator precedence with exponentiation (**) and floor division (//)',
      'Control console layout precisely using print(..., sep=" | ", end="\\n")',
      'Avoid floating-point rounding pitfalls using round() and format strings',
    ],
    starterCode: `# CLI Scientific Unit & Thermal Metric Engine
# PCEP-30-03 Section 01: Fundamentals, Operators & Console I/O

def convert_temperature(celsius_val):
    # Step 1: Calculate Fahrenheit using exact operator precedence: (C * 9/5) + 32
    # Ensure float precision
    fahrenheit = 0.0 # TODO: Implement calculation
    return fahrenheit

def calculate_energy(mass_kg, velocity_ms):
    # Step 2: Kinetic energy formula: 0.5 * m * v^2
    # Use the exponentiation operator (**)
    energy_joules = 0.0 # TODO: Implement calculation
    return energy_joules

def run_conversion_suite():
    print("=== PyCert Thermal & Physics Suite ===", sep="---")
    
    # Test values
    c_temp = 25.0
    f_temp = convert_temperature(c_temp)
    
    # Print with custom sep and end
    print("Celsius:", c_temp, "=> Fahrenheit:", f_temp, sep=" ")
    
    m = 12.5
    v = 4.0
    ke = calculate_energy(m, v)
    print("Kinetic Energy:", ke, "Joules", sep=": ", end="\\n[Done]\\n")

if __name__ == "__main__":
    run_conversion_suite()
`,
    solutionCode: `# Solution: CLI Scientific Unit & Thermal Metric Engine
def convert_temperature(celsius_val):
    # Operators: * has higher precedence than +, but parentheses guarantee clarity
    return (float(celsius_val) * 9 / 5) + 32

def calculate_energy(mass_kg, velocity_ms):
    # Exponentiation ** has higher precedence than multiplication *
    return 0.5 * float(mass_kg) * (float(velocity_ms) ** 2)

def run_conversion_suite():
    print("=== PyCert Thermal & Physics Suite ===")
    c_temp = 25.0
    f_temp = convert_temperature(c_temp)
    print("Celsius:", c_temp, "=> Fahrenheit:", f_temp, sep=" ")
    
    m = 12.5
    v = 4.0
    ke = calculate_energy(m, v)
    print("Kinetic Energy:", ke, "Joules", sep=": ", end="\\n[Done]\\n")

if __name__ == "__main__":
    run_conversion_suite()
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Thermal Conversion with Proper Operator Precedence',
        taskInstruction: 'Implement convert_temperature(celsius_val) using the formula: (celsius * 9/5) + 32. Cast celsius_val to float to guarantee precision.',
        targetObjectiveId: '1.4',
        breadcrumbs: {
          level1Concept: 'Multiplication (*) and division (/) share equal precedence and bind left-to-right, while addition (+) has lower precedence. Parentheses explicitly group the thermal scaling factor before adding 32.',
          level2Syntax: 'fahrenheit = (float(celsius_val) * 9 / 5) + 32',
          level3Scaffold: 'def convert_temperature(celsius_val):\n    c = float(celsius_val)\n    # Compute scaled value then add constant 32\n    return (c * 9 / 5) + 32',
        },
        validationSnippet: 'assert abs(convert_temperature(25.0) - 77.0) < 0.001',
      },
      {
        stepNumber: 2,
        title: 'Kinetic Energy with Exponentiation Operator (**)',
        taskInstruction: 'Implement calculate_energy(mass_kg, velocity_ms) with 0.5 * mass * (velocity ** 2). Note that ** has higher precedence than *.',
        targetObjectiveId: '1.5',
        breadcrumbs: {
          level1Concept: 'Exponentiation (**) evaluates before multiplication (*). 0.5 * m * v ** 2 calculates v**2 first, then multiplies by 0.5 and m.',
          level2Syntax: 'energy = 0.5 * float(mass_kg) * (float(velocity_ms) ** 2)',
          level3Scaffold: 'def calculate_energy(mass_kg, velocity_ms):\n    # Apply 1/2 * m * v^2\n    return 0.5 * float(mass_kg) * (float(velocity_ms) ** 2)',
        },
        validationSnippet: 'assert calculate_energy(12.5, 4.0) == 100.0',
      },
      {
        stepNumber: 3,
        title: 'Formatted Console Output with sep and end Parameters',
        taskInstruction: 'In run_conversion_suite(), test that print() displays the energy using sep=": " and end="\\n[Done]\\n".',
        targetObjectiveId: '1.6',
        breadcrumbs: {
          level1Concept: 'The print() function takes keyword arguments: sep controls the delimiter string placed between multiple arguments (default is " "), and end controls the terminator string printed after all arguments (default is "\\n").',
          level2Syntax: 'print("Kinetic Energy", ke, "Joules", sep=": ", end="\\n[Done]\\n")',
          level3Scaffold: 'print("Kinetic Energy", ke, "Joules", sep="___", end="___")',
        },
        validationSnippet: 'run_conversion_suite()',
      },
    ],
  },
  {
    id: 'proj-02-sentinel-loops',
    title: 'Sensor Stream Sentinel & Walrus Analyzer',
    sectionNumber: 2,
    sectionName: 'Control Flow — Conditional Blocks & Loops',
    examWeightPercentage: 23,
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    specificObjectives: ['2.2', '2.3', '2.4', '2.6', '2.7'],
    description: 'Process an IoT sensor telemetry stream using while loops with sentinel constants, the assignment expression (walrus operator :=), range() strides with negative steps, and loop jump controls (break and continue).',
    learningOutcomes: [
      'Control while loops with sentinel values like -999 or "QUIT"',
      'Utilize the Python 3.8+ walrus operator (:=) inside conditional expressions',
      'Generate inverted countdowns with range(start, stop, negative_step)',
      'Filter anomaly spikes with continue and abort safely on critical alarms with break',
    ],
    starterCode: `# Sensor Stream Sentinel & Walrus Analyzer
# PCEP-30-03 Section 02: Loops, Sentinels, Walrus & Control

SENTINEL_SHUTDOWN = -999.0
MAX_ALERT_TEMP = 85.0
MIN_VALID_TEMP = -20.0

def process_sensor_stream(telemetry_readings):
    valid_readings = []
    
    # Step 1: Iterate through readings. Skip invalid readings with continue (< MIN_VALID_TEMP)
    # If reading equals SENTINEL_SHUTDOWN, abort the loop with break.
    for reading in telemetry_readings:
        # TODO: Implement sentinel check and validation skip
        pass

    return valid_readings

def countdown_diagnostic(start_seconds):
    # Step 2: Use range() with negative step to create countdown list [start, ..., 1]
    # e.g., countdown_diagnostic(5) => [5, 4, 3, 2, 1]
    countdown = []
    # TODO: Fill using range(start, 0, -1)
    return countdown

# Test driver
sample_stream = [22.4, 23.1, -45.0, 31.0, 89.2, -999.0, 24.5]
result = process_sensor_stream(sample_stream)
print("Filtered telemetry:", result)
print("Diagnostic countdown:", countdown_diagnostic(5))
`,
    solutionCode: `# Solution: Sensor Stream Sentinel & Walrus Analyzer
SENTINEL_SHUTDOWN = -999.0
MAX_ALERT_TEMP = 85.0
MIN_VALID_TEMP = -20.0

def process_sensor_stream(telemetry_readings):
    valid_readings = []
    for reading in telemetry_readings:
        if reading == SENTINEL_SHUTDOWN:
            break
        if reading < MIN_VALID_TEMP:
            continue
        valid_readings.append(reading)
    return valid_readings

def countdown_diagnostic(start_seconds):
    return list(range(start_seconds, 0, -1))

sample_stream = [22.4, 23.1, -45.0, 31.0, 89.2, -999.0, 24.5]
result = process_sensor_stream(sample_stream)
print("Filtered telemetry:", result)
print("Diagnostic countdown:", countdown_diagnostic(5))
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Sentinel Check with break & Noise Filtering with continue',
        taskInstruction: 'Iterate through telemetry_readings. If reading == SENTINEL_SHUTDOWN, break immediately. If reading < MIN_VALID_TEMP, skip using continue. Otherwise, append to valid_readings.',
        targetObjectiveId: '2.7',
        breadcrumbs: {
          level1Concept: 'break terminates loop execution entirely, while continue skips the remainder of the current loop iteration and moves to the next sequence item.',
          level2Syntax: 'if reading == SENTINEL_SHUTDOWN:\n    break\nif reading < MIN_VALID_TEMP:\n    continue',
          level3Scaffold: 'for reading in telemetry_readings:\n    if reading == SENTINEL_SHUTDOWN:\n        break\n    if reading < MIN_VALID_TEMP:\n        continue\n    valid_readings.append(reading)',
        },
        validationSnippet: 'assert process_sensor_stream([20.0, -50.0, 25.0, -999.0, 30.0]) == [20.0, 25.0]',
      },
      {
        stepNumber: 2,
        title: 'Negative Step Stride with range()',
        taskInstruction: 'Implement countdown_diagnostic(start_seconds) by calling range(start_seconds, 0, -1) and converting to a list.',
        targetObjectiveId: '2.6',
        breadcrumbs: {
          level1Concept: 'range(start, stop, step) excludes the stop value. To count down from 5 to 1 inclusive, start is 5, stop is 0, and step is -1.',
          level2Syntax: 'countdown = list(range(start_seconds, 0, -1))',
          level3Scaffold: 'def countdown_diagnostic(start_seconds):\n    return list(range(start_seconds, 0, -1))',
        },
        validationSnippet: 'assert countdown_diagnostic(5) == [5, 4, 3, 2, 1]',
      },
    ],
  },
  {
    id: 'proj-03-caesar-cipher',
    title: 'Interactive CLI Caesar Cipher',
    sectionNumber: 3,
    sectionName: 'Data Collections — Lists, Tuples, Sets, Dicts & Strings',
    examWeightPercentage: 26,
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    specificObjectives: ['3.1', '3.2', '3.8', '3.9'],
    description: 'Construct a terminal cryptographic cipher applying ord(), chr(), modulo 26 shift arithmetic, and string immutability best practices.',
    learningOutcomes: [
      'Perform character-level ASCII mapping with ord() and chr()',
      'Compute cyclic alphabetic wrapping via (ord(c) - base + shift) % 26 + base',
      'Preserve string immutability by accumulating chars into a list and calling "".join()',
      'Handle uppercase (base 65) and lowercase (base 97) letters while keeping whitespace and symbols untouched',
    ],
    starterCode: `"""
PCEP-30-03 Domain 3 Lab: Caesar Cipher CLI Engine
Demonstrating ord(), chr(), modulo 26 shifts, and string immutability.
"""

def caesar_cipher(plaintext: str, shift: int) -> str:
    # Accumulated character list to adhere to string immutability
    transformed_chars = []

    for char in plaintext:
        if char.isupper():
            base = ord('A')  # 65
            # Shift uppercase character
            new_char = chr((ord(char) - base + shift) % 26 + base)
            transformed_chars.append(new_char)
        elif char.islower():
            base = ord('a')  # 97
            # Shift lowercase character
            new_char = chr((ord(char) - base + shift) % 26 + base)
            transformed_chars.append(new_char)
        else:
            # Preserves punctuation, whitespace, and numerical digits untouched
            transformed_chars.append(char)

    return "".join(transformed_chars)

if __name__ == "__main__":
    sample_text = "Python Institute 2025!"
    k = 4
    encoded = caesar_cipher(sample_text, k)
    print(f"Ciphertext: {encoded}")
`,
    solutionCode: `"""
PCEP-30-03 Domain 3 Lab: Caesar Cipher CLI Engine
Demonstrating ord(), chr(), modulo 26 shifts, and string immutability.
"""

def caesar_cipher(plaintext: str, shift: int) -> str:
    transformed_chars = []
    for char in plaintext:
        if char.isupper():
            base = ord('A')
            new_char = chr((ord(char) - base + shift) % 26 + base)
            transformed_chars.append(new_char)
        elif char.islower():
            base = ord('a')
            new_char = chr((ord(char) - base + shift) % 26 + base)
            transformed_chars.append(new_char)
        else:
            transformed_chars.append(char)
    return "".join(transformed_chars)

if __name__ == "__main__":
    sample_text = "Python Institute 2025!"
    k = 4
    encoded = caesar_cipher(sample_text, k)
    print(f"Ciphertext: {encoded}")
`,
    steps: [
      {
        stepNumber: 1,
        title: 'ASCII Normalization and Uppercase Shifting',
        taskInstruction: 'Implement uppercase shift using base = ord("A") (65) and formula chr((ord(char) - base + shift) % 26 + base).',
        targetObjectiveId: '3.8',
        breadcrumbs: {
          level1Concept: 'Characters in Python cannot be mutated in place. ord("A") gives 65; subtracting 65 yields 0-25 relative index, modulo 26 wraps cyclically, and chr() converts back.',
          level2Syntax: 'new_char = chr((ord(char) - 65 + shift) % 26 + 65)',
          level3Scaffold: 'if char.isupper():\\n    base = ord("A")\\n    transformed_chars.append(chr((ord(char) - base + shift) % 26 + base))',
        },
        validationSnippet: 'assert caesar_cipher("PYTHON", 3) == "SBWKRQ"',
      },
      {
        stepNumber: 2,
        title: 'Lowercase Shifting & Whitespace/Punctuation Invariance',
        taskInstruction: 'Handle lowercase characters (base = 97) and preserve punctuation, spaces, and digits untouched in the else block.',
        targetObjectiveId: '3.9',
        breadcrumbs: {
          level1Concept: 'islower() checks if a character is lowercase. Non-alphabetic characters should be appended directly without modification.',
          level2Syntax: 'elif char.islower():\\n    base = ord("a")\\n    transformed_chars.append(chr((ord(char) - base + shift) % 26 + base))\\nelse:\\n    transformed_chars.append(char)',
          level3Scaffold: 'elif char.islower():\\n    base = ord("a")\\n    transformed_chars.append(chr((ord(char) - base + shift) % 26 + base))\\nelse:\\n    transformed_chars.append(char)',
        },
        validationSnippet: 'assert caesar_cipher("Hello, World!", 5) == "Mjqqt, Btwqi!"',
      },
      {
        stepNumber: 3,
        title: 'Negative Shift Decryption and Boundary Wraparound',
        taskInstruction: 'Verify that negative shift values (e.g., -3 for decrypting) wrap properly around the alphabet using Python\'s modulo operator.',
        targetObjectiveId: '3.1',
        breadcrumbs: {
          level1Concept: 'Python modulo (%) on negative integers preserves mathematical congruence: (-3) % 26 equals 23, correctly shifting backwards.',
          level2Syntax: 'caesar_cipher("PCEP", -3)',
          level3Scaffold: 'assert caesar_cipher("xyz", 3) == "abc"\\nassert caesar_cipher("PCEP", -3) == "MZBM"',
        },
        validationSnippet: 'assert caesar_cipher("PCEP", -3) == "MZBM"',
      },
    ],
  },
  {
    id: 'proj-03-collections-strings',
    title: 'Inventory Hash Table & String Normalizer',
    sectionNumber: 3,
    sectionName: 'Data Collections — Lists, Tuples, Sets, Dicts & Strings',
    examWeightPercentage: 26,
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    specificObjectives: ['3.1', '3.4', '3.5', '3.6', '3.9'],
    description: 'Construct a warehouse inventory tracking engine utilizing dictionary lookups, unique category sets, immutable SKU tuples, list slicing, and string transformations with f-strings.',
    learningOutcomes: [
      'Extract sub-arrays with list slicing [start:stop:step] and avoid mutating originals',
      'Enforce record integrity using immutable tuples (sku, serial)',
      'Deduplicate category tags with set operations (add, set())',
      'Safely query and mutate dictionary keys using dict.get() and dict.items()',
      'Format currency and string reports using Python 3 f-strings with precision specifiers',
    ],
    starterCode: `# Inventory Hash Table & String Normalizer
# PCEP-30-03 Section 03: Lists, Tuples, Sets, Dicts & Strings

# Master catalog: sku -> {name, price, categories}
catalog = {
    "SKU-101": {"name": "mechanical keyboard", "price": 129.99, "tags": ["hardware", "usb", "peripherals"]},
    "SKU-102": {"name": "ultra-wide monitor", "price": 499.50, "tags": ["hardware", "display", "peripherals"]},
    "SKU-103": {"name": "ergonomic mouse", "price": 79.95, "tags": ["hardware", "usb"]},
}

def get_unique_categories(inventory):
    # Step 1: Collect unique tags across all items using a set
    categories = set()
    # TODO: Loop through inventory.values() and add tags to set
    return categories

def format_price_report(sku, inventory):
    # Step 2: Use f-string to format output: "[SKU-101] MECHANICAL KEYBOARD: $129.99"
    # Title/Upper case the name and format price to 2 decimal places (.2f)
    item = inventory.get(sku)
    if not item:
        return "Not found"
    # TODO: Return formatted f-string
    return ""

def slice_top_items(skus_list, count):
    # Step 3: Return a slice of the first 'count' elements using [:count]
    return []

# Test driver
print("Categories:", get_unique_categories(catalog))
print(format_price_report("SKU-101", catalog))
`,
    solutionCode: `# Solution: Inventory Hash Table & String Normalizer
catalog = {
    "SKU-101": {"name": "mechanical keyboard", "price": 129.99, "tags": ["hardware", "usb", "peripherals"]},
    "SKU-102": {"name": "ultra-wide monitor", "price": 499.50, "tags": ["hardware", "display", "peripherals"]},
    "SKU-103": {"name": "ergonomic mouse", "price": 79.95, "tags": ["hardware", "usb"]},
}

def get_unique_categories(inventory):
    categories = set()
    for item in inventory.values():
        for tag in item.get("tags", []):
            categories.add(tag)
    return categories

def format_price_report(sku, inventory):
    item = inventory.get(sku)
    if not item:
        return "Not found"
    clean_name = item["name"].upper()
    price = item["price"]
    return f"[{sku}] {clean_name}: $" + f"{price:.2f}"

def slice_top_items(skus_list, count):
    return skus_list[:count]

print("Categories:", get_unique_categories(catalog))
print(format_price_report("SKU-101", catalog))
print("Top 2 items:", slice_top_items(["SKU-101", "SKU-102", "SKU-103"], 2))
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Deduplicating Tags with Sets',
        taskInstruction: 'Iterate over inventory.values(), access item["tags"], and add each tag to a set via categories.add(tag) to guarantee uniqueness.',
        targetObjectiveId: '3.5',
        breadcrumbs: {
          level1Concept: 'Sets store only unique, hashable elements. Adding an existing item to a set is an idempotent operation with O(1) average lookup time.',
          level2Syntax: 'for item in inventory.values():\n    for tag in item.get("tags", []):\n        categories.add(tag)',
          level3Scaffold: 'for item in inventory.values():\n    # Iterate through tags list and add to set\n    for t in item.get("tags", []):\n        categories.add(t)',
        },
        validationSnippet: 'assert "peripherals" in get_unique_categories(catalog)',
      },
      {
        stepNumber: 2,
        title: 'String Method .upper() and f-string Precision Formatting',
        taskInstruction: 'Implement format_price_report(sku, inventory) returning f"[{sku}] {clean_name}: $" + f"{price:.2f}" where clean_name is item["name"].upper().',
        targetObjectiveId: '3.9',
        breadcrumbs: {
          level1Concept: 'f-strings support expression evaluation within curly braces {}. The :.2f format specifier forces floating-point values to render exactly two decimal places.',
          level2Syntax: 'return f"[{sku}] {item[\'name\'].upper()}: $" + f"{item[\'price\']:.2f}"',
          level3Scaffold: 'name_upper = item["name"].upper()\nprice = item["price"]\nreturn f"[{sku}] {name_upper}: $" + f"{price:.2f}"',
        },
        validationSnippet: 'assert format_price_report("SKU-101", catalog) == "[SKU-101] MECHANICAL KEYBOARD: $129.99"',
      },
      {
        stepNumber: 3,
        title: 'List Slicing Sytnax',
        taskInstruction: 'Implement slice_top_items(skus_list, count) using Python slice notation [:count].',
        targetObjectiveId: '3.1',
        breadcrumbs: {
          level1Concept: 'Slicing skus[:count] returns a new shallow copy of elements from index 0 up to, but not including, index count.',
          level2Syntax: 'return skus_list[:count]',
          level3Scaffold: 'def slice_top_items(skus_list, count):\n    return skus_list[:count]',
        },
        validationSnippet: 'assert slice_top_items(["A", "B", "C"], 2) == ["A", "B"]',
      },
    ],
  },
  {
    id: 'proj-04-functions-exceptions',
    title: 'Safe Financial Math Pipeline & Exception Sentinel',
    sectionNumber: 4,
    sectionName: 'Functions & Exceptions',
    examWeightPercentage: 20,
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    specificObjectives: ['4.1', '4.3', '4.4', '4.5', '4.6', '4.7'],
    description: 'Construct a bulletproof financial computation pipeline handling variable arguments (*args), positional vs keyword arguments, namespace scoping, and defensive try-except blocks for ZeroDivisionError and ValueError.',
    learningOutcomes: [
      'Aggregate multiple values with variable argument packing (*args)',
      'Distinguish positional arguments from keyword arguments with default values',
      'Manage variable namespaces and prevent accidental global mutability',
      'Catch specific exceptions (ZeroDivisionError, ValueError) without masking bugs',
      'Execute cleanup logic using the finally block',
    ],
    starterCode: `# Safe Financial Math Pipeline & Exception Sentinel
# PCEP-30-03 Section 04: Functions & Exception Handling

TRANSACTION_FEE_RATE = 0.02 # 2% global fee

def calculate_portfolio_total(*values, fee_rate=TRANSACTION_FEE_RATE):
    # Step 1: Sum all *values (tuple) and apply fee: total * (1 - fee_rate)
    # Default argument fee_rate should be respected if not passed
    total = sum(values)
    net_total = total * (1.0 - fee_rate)
    return round(net_total, 2)

def safe_ratio_calculator(numerator, denominator):
    # Step 2: Implement try-except handling:
    # - Return float(numerator) / float(denominator)
    # - Catch ZeroDivisionError: return "ERROR: ZeroDivision"
    # - Catch (ValueError, TypeError): return "ERROR: InvalidType"
    # - Catch generic Exception: return "ERROR: Unknown"
    # TODO: Implement try-except block
    return None

# Test driver
print("Portfolio Net:", calculate_portfolio_total(100.0, 250.0, 50.0))
print("Ratio 100/4:", safe_ratio_calculator(100, 4))
print("Ratio 100/0:", safe_ratio_calculator(100, 0))
print("Ratio 100/'abc':", safe_ratio_calculator(100, "abc"))
`,
    solutionCode: `# Solution: Safe Financial Math Pipeline & Exception Sentinel
TRANSACTION_FEE_RATE = 0.02

def calculate_portfolio_total(*values, fee_rate=TRANSACTION_FEE_RATE):
    total = sum(values)
    net_total = total * (1.0 - fee_rate)
    return round(net_total, 2)

def safe_ratio_calculator(numerator, denominator):
    try:
        n = float(numerator)
        d = float(denominator)
        return n / d
    except ZeroDivisionError:
        return "ERROR: ZeroDivision"
    except (ValueError, TypeError):
        return "ERROR: InvalidType"
    except Exception:
        return "ERROR: Unknown"

print("Portfolio Net:", calculate_portfolio_total(100.0, 250.0, 50.0))
print("Ratio 100/4:", safe_ratio_calculator(100, 4))
print("Ratio 100/0:", safe_ratio_calculator(100, 0))
print("Ratio 100/'abc':", safe_ratio_calculator(100, "abc"))
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Variable Arguments (*args) and Keyword Defaults',
        taskInstruction: 'Implement calculate_portfolio_total(*values, fee_rate=TRANSACTION_FEE_RATE). Pack values into a tuple, compute total net of fee, and return rounded to 2 decimal places.',
        targetObjectiveId: '4.4',
        breadcrumbs: {
          level1Concept: '*values collects any number of positional arguments into an immutable tuple. Keyword arguments following *args can only be passed by keyword name.',
          level2Syntax: 'def calculate_portfolio_total(*values, fee_rate=0.02):\n    return round(sum(values) * (1 - fee_rate), 2)',
          level3Scaffold: 'def calculate_portfolio_total(*values, fee_rate=TRANSACTION_FEE_RATE):\n    gross = sum(values)\n    return round(gross * (1.0 - fee_rate), 2)',
        },
        validationSnippet: 'assert calculate_portfolio_total(100.0, 200.0) == 294.0',
      },
      {
        stepNumber: 2,
        title: 'Targeted Exception Handling Hierarchy',
        taskInstruction: 'In safe_ratio_calculator(), wrap float conversions and division in a try block. Catch ZeroDivisionError specifically, followed by (ValueError, TypeError), returning designated error strings.',
        targetObjectiveId: '4.7',
        breadcrumbs: {
          level1Concept: 'Python evaluates except blocks top-to-bottom. Specific exceptions (ZeroDivisionError) must be caught before more general ones (Exception). Tuples group multiple exception types in a single except clause.',
          level2Syntax: 'try:\n    return float(num) / float(den)\nexcept ZeroDivisionError:\n    return "ERROR: ZeroDivision"\nexcept (ValueError, TypeError):\n    return "ERROR: InvalidType"',
          level3Scaffold: 'try:\n    return float(numerator) / float(denominator)\nexcept ZeroDivisionError:\n    return "ERROR: ZeroDivision"\nexcept (ValueError, TypeError):\n    return "ERROR: InvalidType"',
        },
        validationSnippet: 'assert safe_ratio_calculator(10, 0) == "ERROR: ZeroDivision"',
      },
    ],
  },
  {
    id: 'proj-05-files-modules',
    title: 'CSV Gradebook Audit & Standard Math Analyzer',
    sectionNumber: 5,
    sectionName: 'File Handling & Module Imports',
    examWeightPercentage: 14,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['5.2', '5.3', '5.4', '5.5'],
    description: 'Process a simulated student academic gradebook using context-managed CSV parsing (with open as), standard math functions (ceil, floor, trunc), and random module sampling for statistical diagnostics.',
    learningOutcomes: [
      'Employ the with statement context manager to prevent resource leaks',
      'Parse delimited CSV records and calculate composite scores',
      'Distinguish math.floor() from math.trunc() for negative real numbers',
      'Utilize random.choice() and random.sample() without modifying source datasets',
    ],
    starterCode: `# CSV Gradebook Audit & Standard Math Analyzer
# PCEP-30-03 Section 05: Files, Context Managers & Standard Library

import math
import random

# Simulated in-memory CSV file data: Name, Score1, Score2
csv_raw_records = """Alice,88,94
Bob,72,81
Charlie,95,99
Diana,61,68
Evan,84,87"""

def parse_gradebook(raw_data):
    # Step 1: Parse string lines as CSV records. Calculate average score for each student.
    # Return list of tuples: (name, avg_score)
    records = []
    lines = raw_data.strip().split("\\n")
    for line in lines:
        parts = line.split(",")
        name = parts[0]
        s1 = float(parts[1])
        s2 = float(parts[2])
        avg = (s1 + s2) / 2.0
        records.append((name, avg))
    return records

def compute_grade_metrics(records):
    # Step 2: Use math.ceil() on maximum average, and math.floor() on minimum average
    # Return dict: {"max_ceil": math.ceil(max_avg), "min_floor": math.floor(min_avg)}
    averages = [r[1] for r in records]
    max_val = max(averages)
    min_val = min(averages)
    return {
        "max_ceil": math.ceil(max_val),
        "min_floor": math.floor(min_val),
    }

# Test driver
parsed = parse_gradebook(csv_raw_records)
print("Parsed gradebook:", parsed)
print("Metrics:", compute_grade_metrics(parsed))
`,
    solutionCode: `# Solution: CSV Gradebook Audit & Standard Math Analyzer
import math
import random

csv_raw_records = """Alice,88,94
Bob,72,81
Charlie,95,99
Diana,61,68
Evan,84,87"""

def parse_gradebook(raw_data):
    records = []
    lines = raw_data.strip().split("\\n")
    for line in lines:
        parts = line.split(",")
        name = parts[0]
        s1 = float(parts[1])
        s2 = float(parts[2])
        avg = (s1 + s2) / 2.0
        records.append((name, avg))
    return records

def compute_grade_metrics(records):
    averages = [r[1] for r in records]
    return {
        "max_ceil": math.ceil(max(averages)),
        "min_floor": math.floor(min(averages)),
    }

parsed = parse_gradebook(csv_raw_records)
print("Parsed gradebook:", parsed)
print("Metrics:", compute_grade_metrics(parsed))
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Delimited Record Processing',
        taskInstruction: 'Parse raw_data by splitting on newlines and commas, converting numeric items to float, and computing average per student.',
        targetObjectiveId: '5.3',
        breadcrumbs: {
          level1Concept: 'CSV data is structured as delimiter-separated strings. Splitting by newline yields rows, and splitting each row by comma yields field tokens.',
          level2Syntax: 'for line in raw_data.strip().split("\\n"):\n    tokens = line.split(",")',
          level3Scaffold: 'records = []\nfor line in raw_data.strip().split("\\n"):\n    tokens = line.split(",")\n    name, s1, s2 = tokens[0], float(tokens[1]), float(tokens[2])\n    records.append((name, (s1 + s2) / 2))',
        },
        validationSnippet: 'assert parse_gradebook(csv_raw_records)[0] == ("Alice", 91.0)',
      },
      {
        stepNumber: 2,
        title: 'Standard Library math.ceil() and math.floor()',
        taskInstruction: 'Implement compute_grade_metrics(records) returning {"max_ceil": math.ceil(max_avg), "min_floor": math.floor(min_avg)}.',
        targetObjectiveId: '5.5',
        breadcrumbs: {
          level1Concept: 'math.ceil(x) rounds upward to the smallest integer >= x. math.floor(x) rounds downward to the largest integer <= x.',
          level2Syntax: 'return {"max_ceil": math.ceil(max(averages)), "min_floor": math.floor(min(averages))}',
          level3Scaffold: 'averages = [r[1] for r in records]\nreturn {\n    "max_ceil": math.ceil(max(averages)),\n    "min_floor": math.floor(min(averages))\n}',
        },
        validationSnippet: 'assert compute_grade_metrics(parse_gradebook(csv_raw_records))["max_ceil"] == 97',
      },
    ],
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    pcepSection: 1,
    pcepObjective: '1.4',
    category: 'Operators & Precedence',
    frontPrompt: 'What is the exact evaluation of -2 ** 4 and (-2) ** 4 in Python?',
    codeSnippet: 'print(-2 ** 4)\nprint((-2) ** 4)',
    backAnswer: '-2 ** 4 outputs -16, while (-2) ** 4 outputs 16.',
    syntaxGotcha: 'The exponentiation operator (**) has higher precedence than the unary minus (-). Thus -2 ** 4 is parsed as -(2 ** 4) = -16.',
    boxLevel: 1,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    timesReviewed: 0,
    timesCorrect: 0,
  },
  {
    id: 'fc-2',
    pcepSection: 1,
    pcepObjective: '1.4',
    category: 'Arithmetic Operators',
    frontPrompt: 'What does integer floor division // evaluate to with negative numbers: -7 // 2?',
    codeSnippet: 'val = -7 // 2\nprint(val)',
    backAnswer: '-4 (NOT -3)',
    syntaxGotcha: 'Floor division in Python rounds down to the nearest lower integer (towards negative infinity). Since -3.5 rounded down is -4, the result is -4.',
    boxLevel: 1,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    timesReviewed: 0,
    timesCorrect: 0,
  },
  {
    id: 'fc-3',
    pcepSection: 2,
    pcepObjective: '2.6',
    category: 'Range Generator',
    frontPrompt: 'What sequence does range(5, 1, -1) produce when converted to a list?',
    codeSnippet: 'seq = list(range(5, 1, -1))\nprint(seq)',
    backAnswer: '[5, 4, 3, 2]',
    syntaxGotcha: 'The stop parameter (1) is always strictly exclusive! The iteration halts before reaching 1.',
    boxLevel: 1,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    timesReviewed: 0,
    timesCorrect: 0,
  },
  {
    id: 'fc-4',
    pcepSection: 2,
    pcepObjective: '2.7',
    category: 'Loop Else Clause',
    frontPrompt: 'When does the else block of a while or for loop execute?',
    codeSnippet: 'for i in range(3):\n    if i == 5:\n        break\nelse:\n    print("Finished")',
    backAnswer: 'The else block executes only if the loop terminates normally without encountering a break statement.',
    syntaxGotcha: 'If break is triggered, the else block is completely bypassed.',
    boxLevel: 2,
    intervalDays: 3,
    nextReviewDate: new Date().toISOString().split('T')[0],
    timesReviewed: 1,
    timesCorrect: 1,
  },
  {
    id: 'fc-5',
    pcepSection: 3,
    pcepObjective: '3.4',
    category: 'Tuples',
    frontPrompt: 'How do you create a 1-element tuple containing the integer 42?',
    codeSnippet: 't1 = (42)\nt2 = (42,)\nprint(type(t1), type(t2))',
    backAnswer: '(42,) with a trailing comma. (42) without a comma is merely an integer wrapped in grouping parentheses.',
    syntaxGotcha: 'A comma creates a tuple, not the parentheses alone.',
    boxLevel: 2,
    intervalDays: 3,
    nextReviewDate: new Date().toISOString().split('T')[0],
    timesReviewed: 1,
    timesCorrect: 1,
  },
  {
    id: 'fc-6',
    pcepSection: 3,
    pcepObjective: '3.1',
    category: 'List Slicing',
    frontPrompt: 'What is the result of nums = [10, 20, 30, 40, 50]; print(nums[1:4:2])?',
    codeSnippet: 'nums = [10, 20, 30, 40, 50]\nprint(nums[1:4:2])',
    backAnswer: '[20, 40]',
    syntaxGotcha: 'Index 1 is 20, step 2 skips 30 and takes index 3 which is 40. Index 4 (50) is excluded by stop.',
    boxLevel: 1,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    timesReviewed: 0,
    timesCorrect: 0,
  },
  {
    id: 'fc-7',
    pcepSection: 4,
    pcepObjective: '4.5',
    category: 'Variable Scope',
    frontPrompt: 'What error occurs if you read a global variable and then assign it inside a function without the global keyword?',
    codeSnippet: 'x = 10\ndef test():\n    print(x)\n    x = 20\ntest()',
    backAnswer: 'UnboundLocalError: cannot access local variable "x" where it is not associated with a value.',
    syntaxGotcha: 'Python marks a variable as local to a function scope at compile time if an assignment exists anywhere inside that function.',
    boxLevel: 1,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    timesReviewed: 0,
    timesCorrect: 0,
  },
  {
    id: 'fc-8',
    pcepSection: 5,
    pcepObjective: '5.5',
    category: 'Standard Math Library',
    frontPrompt: 'What is the key difference between math.floor(-3.2) and math.trunc(-3.2)?',
    codeSnippet: 'import math\nprint(math.floor(-3.2))\nprint(math.trunc(-3.2))',
    backAnswer: 'math.floor(-3.2) is -4, while math.trunc(-3.2) is -3.',
    syntaxGotcha: 'floor rounds down towards negative infinity. trunc truncates the fractional portion directly towards zero.',
    boxLevel: 2,
    intervalDays: 3,
    nextReviewDate: new Date().toISOString().split('T')[0],
    timesReviewed: 1,
    timesCorrect: 1,
  },
];

export const PRACTICE_EXAM_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    pcepSection: 1,
    pcepObjective: '1.4',
    question: 'What is the output of the following Python snippet?',
    codeSnippet: 'x = 2 ** 3 ** 2\nprint(x)',
    options: ['64', '512', '36', 'SyntaxError'],
    correctIndex: 1,
    explanation: 'The exponentiation operator (**) binds from right to left (right-associative). Therefore, 2 ** 3 ** 2 is evaluated as 2 ** (3 ** 2) = 2 ** 9 = 512.',
  },
  {
    id: 'q-2',
    pcepSection: 1,
    pcepObjective: '1.6',
    question: 'What is the output of the following print statement?',
    codeSnippet: 'print("A", "B", "C", sep="#", end="*")\nprint("D")',
    options: ['A#B#C*D', 'A B C\\n#*D', 'A#B#C\\n*D', 'A#B#C*\\nD'],
    correctIndex: 0,
    explanation: 'sep="#" places "#" between "A", "B", and "C". end="*" prevents a newline and places "*" immediately at the end. The subsequent print("D") follows right on the same line.',
  },
  {
    id: 'q-3',
    pcepSection: 2,
    pcepObjective: '2.1',
    question: 'Which of the following values evaluates to False in a boolean context in Python?',
    codeSnippet: '',
    options: ['"False"', '[-1]', '()', '{"key": False}'],
    correctIndex: 2,
    explanation: 'An empty tuple () is falsy. Non-empty strings (including "False") and non-empty collections (even containing False or -1) evaluate to True.',
  },
  {
    id: 'q-4',
    pcepSection: 2,
    pcepObjective: '2.6',
    question: 'What will be printed by this code?',
    codeSnippet: 'total = 0\nfor i in range(1, 10, 3):\n    total += i\nprint(total)',
    options: ['12', '22', '15', '18'],
    correctIndex: 0,
    explanation: 'range(1, 10, 3) yields 1, 4, 7. 1 + 4 + 7 = 12 (10 is excluded by stop).',
  },
  {
    id: 'q-5',
    pcepSection: 3,
    pcepObjective: '3.1',
    question: 'What does the slice operation produce?',
    codeSnippet: 'word = "PYTHON"\nprint(word[::-2])',
    options: ['"NHY"', '"OTP"', '"NTP"', '"NOT"'],
    correctIndex: 0,
    explanation: 'A negative step stride [::-2] starts from the end of the string and steps backwards by 2: index -1 is "N", index -3 is "H", index -5 is "Y". The output is "NHY".',
  },
  {
    id: 'q-6',
    pcepSection: 3,
    pcepObjective: '3.6',
    question: 'What will happen when executing this code?',
    codeSnippet: 'data = {1: "one", 2: "two"}\nprint(data.get(3, "missing"))',
    options: ['Raises KeyError: 3', 'Prints None', 'Prints "missing"', 'Raises TypeError'],
    correctIndex: 2,
    explanation: 'The dictionary .get(key, default) method safely retrieves the value, returning the second argument ("missing") when the key is absent, avoiding a KeyError.',
  },
  {
    id: 'q-7',
    pcepSection: 4,
    pcepObjective: '4.3',
    question: 'What is the output of the following function call?',
    codeSnippet: 'def add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\nprint(add_item("apple"))\nprint(add_item("banana"))',
    options: [
      '[\'apple\'] then [\'banana\']',
      '[\'apple\'] then [\'apple\', \'banana\']',
      '[\'banana\'] then [\'apple\', \'banana\']',
      'Raises ValueError',
    ],
    correctIndex: 1,
    explanation: 'Default argument expressions in Python are evaluated once at function definition time. The list [] persists across subsequent invocations.',
  },
  {
    id: 'q-8',
    pcepSection: 4,
    pcepObjective: '4.7',
    question: 'Which block in a try-except structure is guaranteed to execute regardless of whether an exception occurred?',
    codeSnippet: '',
    options: ['else', 'finally', 'except Exception', 'catch'],
    correctIndex: 1,
    explanation: 'The finally block always runs upon leaving the try-except statement, even if an uncaught exception or return occurs.',
  },
  {
    id: 'q-9',
    pcepSection: 5,
    pcepObjective: '5.2',
    question: 'What is the primary benefit of using the with open(...) statement in Python?',
    codeSnippet: 'with open("data.txt", "r") as f:\n    content = f.read()',
    options: [
      'It speeds up read operations by 50%',
      'It automatically closes the file even if exceptions occur inside the block',
      'It automatically parses CSV data',
      'It encrypts file access',
    ],
    correctIndex: 1,
    explanation: 'The with statement acts as a context manager that guarantees the file descriptor is closed properly upon block exit, even if an unhandled exception interrupts execution.',
  },
  {
    id: 'q-10',
    pcepSection: 5,
    pcepObjective: '5.5',
    question: 'What is the return value of math.floor(4.9) and math.ceil(4.1)?',
    codeSnippet: 'import math\nprint(math.floor(4.9), math.ceil(4.1))',
    options: ['4 and 4', '5 and 5', '4 and 5', '5 and 4'],
    correctIndex: 2,
    explanation: 'math.floor(4.9) returns 4 (largest integer <= 4.9). math.ceil(4.1) returns 5 (smallest integer >= 4.1).',
  },
];

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: '1',
    label: 'Initialize clean Git repository with .gitignore',
    sublines: ['Ensure standard Python rules to exclude virtualenvs (__pycache__, .env, .venv, *.pyc)'],
    category: 'Repository Setup',
    checked: false,
  },
  {
    id: '2',
    label: 'Establish semantic commit message history',
    sublines: ['Use clear commit messages like feat: or fix: instead of single giant commits'],
    category: 'Repository Setup',
    checked: false,
  },
  {
    id: '3',
    label: 'Draft comprehensive README.md file',
    sublines: ['Include project title, concept overview, and PCEP domains demonstrated'],
    category: 'Documentation (README)',
    checked: false,
  },
  {
    id: '4',
    label: 'Add local installation & usage instructions',
    sublines: ['Document clear step-by-step terminal commands to clone and run'],
    category: 'Documentation (README)',
    checked: false,
  },
  {
    id: '5',
    label: 'Verify zero API keys or secrets in code',
    sublines: ['Use environment variables (.env) for any API keys or tokens'],
    category: 'Deployment & Security',
    checked: false,
  },
  {
    id: '6',
    label: 'Deploy app or host working live demo',
    sublines: ['Link working Streamlit Cloud / Render URL or terminal GIF demo'],
    category: 'Deployment & Security',
    checked: false,
  },
  {
    id: '7',
    label: 'Set repository visibility to Public',
    sublines: ['Add descriptive repository tags (python, pcep, rag, api) for discoverability'],
    category: 'Showcase & Resume',
    checked: false,
  },
  {
    id: '8',
    label: 'Add repository URL to resume portfolio section',
    sublines: ['Link under technical projects on your resume and LinkedIn'],
    category: 'Showcase & Resume',
    checked: false,
  },
];

export const CAPSTONE_PROJECTS: CapstoneProject[] = [
  {
    id: 'cap-01-pycalc-cli',
    title: 'PyCalc-CLI: Robust Expression Evaluator',
    subtitle: 'Precedence & Exceptions Engine',
    domain: 'PCEP Domain 1 & 4 (Precedence & Exceptions)',
    status: 'synced',
    statusLabel: 'LIVE REPO',
    commitsCount: 12,
    description: 'Full-featured command-line calculator engineered to showcase bitwise shifts, arithmetic precedence according to Python specifications, and defensive handling of ZeroDivisionError and ValueError cascades.',
    coveragePercent: 98.4,
    unitTestsPassing: '18/18',
    tags: ['try...except', 'argparse', 'PyTest Suite', 'v1.0.0 Tagged'],
    codePreviewSnippet: `def safe_evaluate(expr: str) -> float:
    try:
        tokens = tokenize(expr)
        return shunting_yard(tokens)
    except (ZeroDivisionError, ValueError) as err:
        logger.error(f"Fault: {err}")
        raise PCEPComputationError(err)`,
    githubRepoUrl: 'https://github.com/devonvance/pycalc-cli-pcep',
    syllabusGoal: 'Precedence Parsing & Exception Cascades',
    cornerCasesCount: 18,
  },
  {
    id: 'cap-02-collection-crafter',
    title: 'CollectionCrafter: Nested Inventory & Slicing Engine',
    subtitle: 'Lists, Tuples, Dictionaries, Slices',
    domain: 'PCEP Domain 3 (Lists, Tuples, Dictionaries, Slices)',
    status: 'ready',
    statusLabel: 'READY TO PUSH',
    commitsCount: 8,
    description: 'Demonstrates rigorous collection operations: deep copies vs shallow pointer references, negative step multi-dimensional list slicing ([::-1]), tuple key immutability in hashing maps, and nested dictionary transformations.',
    coveragePercent: 100,
    unitTestsPassing: '14/14',
    tags: ['List Comprehensions', 'Tuple Unpacking', 'JSON Serialization'],
    codePreviewSnippet: `def deep_clone_and_slice(matrix: list[list[int]], step: int = -1):
    cloned = [row[:] for row in matrix]
    return [row[::step] for row in cloned[::-1]]`,
    githubRepoUrl: 'https://github.com/devonvance/collection-crafter',
    syllabusGoal: 'Sequence In-Place Mutation',
    cornerCasesCount: 14,
  },
  {
    id: 'cap-03-flowmaster',
    title: 'FlowMaster: Prime Sieve & Collatz Explorer',
    subtitle: 'Loops, Branching, break/continue/else',
    domain: 'PCEP Domain 2 (Loops, Branching, break/continue/else)',
    status: 'ready',
    statusLabel: 'READY TO PUBLISH',
    commitsCount: 6,
    description: 'Interactive mathematical engine examining loop execution logic. Implements sieve heuristics utilizing for...else blocks (triggering loop post-exhaustion vs break execution) and while...else constructs.',
    coveragePercent: 94.2,
    unitTestsPassing: '10/10',
    tags: ['for...else', 'Range Stepping', 'Collatz Conjecture'],
    codePreviewSnippet: `def verify_prime_with_loop_else(n: int) -> bool:
    if n <= 1: return False
    for divisor in range(2, int(n ** 0.5) + 1):
        if n % divisor == 0:
            break
    else:
        return True
    return False`,
    githubRepoUrl: 'https://github.com/devonvance/flowmaster-sieve',
    syllabusGoal: 'Loop-Else Flow Exhaustion',
    cornerCasesCount: 10,
  },
  {
    id: 'cap-04-custom-exception',
    title: 'CustomException Logger & Error Dispatcher',
    subtitle: 'Class Inheritance from BaseException',
    domain: 'PCEP Domain 4 (Class Inheritance from BaseException)',
    status: 'draft',
    statusLabel: 'DRAFTING CODE',
    commitsCount: 3,
    description: 'Builds custom hierarchical exceptions inheriting from Python standard exception classes, parsing traceback stacks and dispatching structured logs without crashing daemon processes.',
    coveragePercent: 45.0,
    unitTestsPassing: '4/8',
    tags: ['Custom Exceptions', 'Traceback Stack', 'Logging Handler'],
    codePreviewSnippet: `class PCEPValidationError(ValueError):
    """Raised when syllabus token parsing encounters malformed AST."""
    def __init__(self, token, line_no):
        super().__init__(f"Invalid token '{token}' at line {line_no}")
        self.token = token`,
    githubRepoUrl: 'https://github.com/devonvance/custom-exception-logger',
    syllabusGoal: 'Custom Exception Hierarchies',
    cornerCasesCount: 8,
  },
  {
    id: 'cap-05-file-stream-audit',
    title: 'FileStreamAudit: Safe CSV & Telemetry Digest Pipeline',
    subtitle: 'Context Managers, CSV & Standard Modules',
    domain: 'PCEP Domain 5 (File Handling, CSV & Standard Modules)',
    status: 'synced',
    statusLabel: 'LIVE REPO',
    commitsCount: 9,
    description: 'Automated batch telemetry pipeline utilizing context managers (with open) for deterministic file handle cleanup, parsing structured CSV datasets with csv.reader, computing statistics with math, and generating pseudorandom audit batches with random.',
    coveragePercent: 96.5,
    unitTestsPassing: '12/12',
    tags: ['csv.reader', 'with open()', 'math.ceil', 'random.sample', 'v1.0.0 Tagged'],
    codePreviewSnippet: `def parse_and_audit_telemetry(csv_filepath: str) -> dict:
    with open(csv_filepath, mode='r', encoding='utf-8') as stream:
        reader = csv.reader(stream)
        headers = next(reader)
        samples = [row for row in reader if row]
    return {"records": len(samples), "checksum": math.trunc(math.sqrt(len(samples)))}`,
    githubRepoUrl: 'https://github.com/devonvance/filestream-audit-pipeline',
    syllabusGoal: 'Deterministic File Cleanup & CSV Serialization',
    cornerCasesCount: 12,
  },
];


