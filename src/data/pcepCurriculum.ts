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
    title: 'Road Trip & Weather Converter',
    sectionNumber: 1,
    sectionName: 'Computer Programming & Python Fundamentals',
    examWeightPercentage: 17,
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    specificObjectives: ['1.3', '1.4', '1.5', '1.6'],
    fileName: 'road_trip_math.py',
    testFileName: 'test_road_trip_math.py',
    keyTip: 'Parentheses () always run first, then ** (exponents), then *, /, //, %, and finally + and -.',
    pitfallWarning: 'Remember: input() always returns a string (str). Always convert text numbers with float() or int() before doing math, and remember / gives a float while // gives whole-number floor division.',
    description: 'Build a beginner-friendly Python calculator that converts Celsius to Fahrenheit, calculates road-trip fuel stops with floor division (//) and remainder (%), and prints clean output with sep and end.',
    learningOutcomes: [
      'Convert values safely using float() and int()',
      'Use floor division (//), remainder (%), and exponents (**)',
      'Follow Python operator precedence rules accurately',
      'Format print() output with sep and end arguments',
    ],
    starterCode: `# Lab 01: Road Trip & Weather Converter (PCEP Domain 1)
# Follow Step 1 -> Step 2 -> Step 3 in order from top to bottom!

# STEP 1: Convert Celsius to Fahrenheit
# Formula: (celsius * 9 / 5) + 32
def celsius_to_fahrenheit(celsius):
    # TODO (Step 1): Convert celsius to float() and return Fahrenheit
    fahrenheit = 0.0
    return fahrenheit


# STEP 2: Calculate full fuel stops and leftover miles
# Hint: Use // for whole stops and % for leftover miles
def trip_fuel_stops(total_miles, miles_per_tank):
    # TODO (Step 2): Replace the 0s with // and % math
    full_stops = 0
    leftover_miles = 0
    return (full_stops, leftover_miles)


# STEP 3: Print a neat summary using sep=" | " and end="\\n[Done]\\n"
def show_summary():
    temp_f = celsius_to_fahrenheit(25)
    stops, extra = trip_fuel_stops(650, 300)
    # TODO (Step 3): Update sep and end in the print() call below
    print("Temp (F):", temp_f, "Stops:", stops, "Extra miles:", extra)


if __name__ == "__main__":
    show_summary()
`,
    solutionCode: `# Solution: Road Trip & Weather Converter (PCEP Domain 1)

def celsius_to_fahrenheit(celsius):
    return (float(celsius) * 9 / 5) + 32

def trip_fuel_stops(total_miles, miles_per_tank):
    full_stops = int(total_miles) // int(miles_per_tank)
    leftover_miles = int(total_miles) % int(miles_per_tank)
    return (full_stops, leftover_miles)

def show_summary():
    temp_f = celsius_to_fahrenheit(25)
    stops, extra = trip_fuel_stops(650, 300)
    print("Temp (F):", temp_f, "Stops:", stops, "Extra miles:", extra, sep=" | ", end="\\n[Done]\\n")

if __name__ == "__main__":
    show_summary()
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Convert Celsius to Fahrenheit',
        taskInstruction: 'Inside celsius_to_fahrenheit(celsius), convert celsius to float(celsius) and return (float(celsius) * 9 / 5) + 32.',
        targetObjectiveId: '1.5',
        expectedExample: 'celsius_to_fahrenheit(25) -> 77.0',
        breadcrumbs: {
          level1Concept: 'Multiplication (*) and division (/) run before addition (+). Using float(celsius) makes sure text like "25" or integers work cleanly.',
          level2Syntax: 'fahrenheit = (float(celsius) * 9 / 5) + 32\nreturn fahrenheit',
          level3Scaffold: 'def celsius_to_fahrenheit(celsius):\n    fahrenheit = (float(celsius) * 9 / 5) + 32\n    return fahrenheit',
        },
        validationSnippet: 'assert abs(celsius_to_fahrenheit(25) - 77.0) < 0.001',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Calculate Stops with // and %',
        taskInstruction: 'Inside trip_fuel_stops(total_miles, miles_per_tank), set full_stops = total_miles // miles_per_tank and leftover_miles = total_miles % miles_per_tank.',
        targetObjectiveId: '1.4',
        expectedExample: 'trip_fuel_stops(650, 300) -> (2, 50)',
        breadcrumbs: {
          level1Concept: 'Floor division (//) gives how many whole times one number fits into another (650 // 300 == 2). Modulo (%) gives the remainder left over (650 % 300 == 50).',
          level2Syntax: 'full_stops = int(total_miles) // int(miles_per_tank)\nleftover_miles = int(total_miles) % int(miles_per_tank)',
          level3Scaffold: 'def trip_fuel_stops(total_miles, miles_per_tank):\n    full_stops = int(total_miles) // int(miles_per_tank)\n    leftover_miles = int(total_miles) % int(miles_per_tank)\n    return (full_stops, leftover_miles)',
        },
        validationSnippet: 'assert trip_fuel_stops(650, 300) == (2, 50)',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Format Print Output with sep and end',
        taskInstruction: 'In show_summary(), add sep=" | " and end="\\n[Done]\\n" to the print() statement so values are separated cleanly.',
        targetObjectiveId: '1.6',
        expectedExample: 'Temp (F): | 77.0 | Stops: | 2 ... [Done]',
        breadcrumbs: {
          level1Concept: 'print() accepts sep= to choose what goes between items (default is a space) and end= to choose what goes at the very end (default is a newline).',
          level2Syntax: 'print("Temp (F):", temp_f, "Stops:", stops, "Extra miles:", extra, sep=" | ", end="\\n[Done]\\n")',
          level3Scaffold: 'def show_summary():\n    temp_f = celsius_to_fahrenheit(25)\n    stops, extra = trip_fuel_stops(650, 300)\n    print("Temp (F):", temp_f, "Stops:", stops, "Extra miles:", extra, sep=" | ", end="\\n[Done]\\n")',
        },
        validationSnippet: 'assert celsius_to_fahrenheit(0) == 32.0 and trip_fuel_stops(100, 40) == (2, 20)',
      },
    ],
  },
  {
    id: 'proj-02-sentinel-loops',
    title: 'Game Score Filter & Countdown Timer',
    sectionNumber: 2,
    sectionName: 'Control Flow — Conditional Blocks & Loops',
    examWeightPercentage: 23,
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    specificObjectives: ['2.1', '2.3', '2.6', '2.7'],
    fileName: 'score_tracker.py',
    testFileName: 'test_score_tracker.py',
    keyTip: 'break stops the entire loop immediately, while continue skips just the current item and jumps to the next loop turn.',
    pitfallWarning: 'In range(start, stop, step), the stop number is NEVER included! To count down 5, 4, 3, 2, 1, stop must be 0: range(5, 0, -1).',
    description: 'Practice Python loops and if/elif/else decisions by filtering game scores. Skip bad negative entries with continue, stop at the -1 quit signal with break, and count down with range().',
    learningOutcomes: [
      'Stop a loop early when hitting a sentinel value (-1) using break',
      'Skip invalid items cleanly using continue',
      'Count backwards using range(start, stop, -1)',
      'Classify scores with if / elif / else branches',
    ],
    starterCode: `# Lab 02: Game Score Filter & Countdown Timer (PCEP Domain 2)
# Follow Step 1 -> Step 2 -> Step 3 in order from top to bottom!

# STEP 1: Keep only valid scores until you hit the stop signal (-1)
# - If score == -1: stop the loop (break)
# - If score < 0: skip this score (continue)
# - Otherwise: append score to valid_scores
def filter_scores(scores):
    valid_scores = []
    for score in scores:
        # TODO (Step 1): Add break, continue, and append logic
        pass
    return valid_scores


# STEP 2: Count down from start_num to 1 using range() with a -1 step
def launch_countdown(start_num):
    # TODO (Step 2): Return a list like [5, 4, 3, 2, 1]
    return []


# STEP 3: Return "Gold" (90+), "Silver" (70-89), or "Bronze" (< 70)
def get_medal(score):
    # TODO (Step 3): Write an if / elif / else decision
    return ""


if __name__ == "__main__":
    print("Valid scores:", filter_scores([85, -5, 92, -1, 100]))
    print("Countdown:", launch_countdown(5))
    print("Medal for 95:", get_medal(95))
`,
    solutionCode: `# Solution: Game Score Filter & Countdown Timer (PCEP Domain 2)

def filter_scores(scores):
    valid_scores = []
    for score in scores:
        if score == -1:
            break
        if score < 0:
            continue
        valid_scores.append(score)
    return valid_scores

def launch_countdown(start_num):
    return list(range(start_num, 0, -1))

def get_medal(score):
    if score >= 90:
        return "Gold"
    elif score >= 70:
        return "Silver"
    else:
        return "Bronze"

if __name__ == "__main__":
    print("Valid scores:", filter_scores([85, -5, 92, -1, 100]))
    print("Countdown:", launch_countdown(5))
    print("Medal for 95:", get_medal(95))
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Skip Invalid Scores & Stop at -1',
        taskInstruction: 'Inside filter_scores(scores), check if score == -1 and use break. Next, check if score < 0 and use continue. Otherwise call valid_scores.append(score).',
        targetObjectiveId: '2.7',
        expectedExample: 'filter_scores([85, -5, 92, -1, 100]) -> [85, 92]',
        breadcrumbs: {
          level1Concept: 'Check for the stop signal (-1) first with break so it stops the loop immediately. Any other negative number is skipped with continue.',
          level2Syntax: 'if score == -1:\n    break\nif score < 0:\n    continue\nvalid_scores.append(score)',
          level3Scaffold: 'for score in scores:\n    if score == -1:\n        break\n    if score < 0:\n        continue\n    valid_scores.append(score)',
        },
        validationSnippet: 'assert filter_scores([85, -5, 92, -1, 100]) == [85, 92]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Build a Countdown with range()',
        taskInstruction: 'Inside launch_countdown(start_num), return list(range(start_num, 0, -1)).',
        targetObjectiveId: '2.6',
        expectedExample: 'launch_countdown(5) -> [5, 4, 3, 2, 1]',
        breadcrumbs: {
          level1Concept: 'range(start, stop, step) stops right before the stop number. Using stop=0 and step=-1 stops right after 1.',
          level2Syntax: 'return list(range(start_num, 0, -1))',
          level3Scaffold: 'def launch_countdown(start_num):\n    return list(range(start_num, 0, -1))',
        },
        validationSnippet: 'assert launch_countdown(5) == [5, 4, 3, 2, 1]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Award Medals with if / elif / else',
        taskInstruction: 'Inside get_medal(score), return "Gold" if score >= 90, "Silver" if score >= 70, and "Bronze" otherwise.',
        targetObjectiveId: '2.1',
        expectedExample: 'get_medal(95) -> "Gold", get_medal(75) -> "Silver"',
        breadcrumbs: {
          level1Concept: 'if/elif/else checks conditions from top to bottom and runs the first branch that is True.',
          level2Syntax: 'if score >= 90:\n    return "Gold"\nelif score >= 70:\n    return "Silver"\nelse:\n    return "Bronze"',
          level3Scaffold: 'def get_medal(score):\n    if score >= 90:\n        return "Gold"\n    elif score >= 70:\n        return "Silver"\n    else:\n        return "Bronze"',
        },
        validationSnippet: 'assert get_medal(95) == "Gold" and get_medal(75) == "Silver" and get_medal(50) == "Bronze"',
      },
    ],
  },
  {
    id: 'proj-03-caesar-cipher',
    title: 'Secret Message Scrambler (Caesar Cipher)',
    sectionNumber: 3,
    sectionName: 'Data Collections — Lists, Tuples, Sets, Dicts & Strings',
    examWeightPercentage: 26,
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    specificObjectives: ['3.1', '3.2', '3.8', '3.9'],
    fileName: 'secret_scrambler.py',
    testFileName: 'test_secret_scrambler.py',
    keyTip: 'ord("A") turns a letter into its number (65), and chr(65) turns a number back into "A". Modulo (% 26) wraps Z back around to A!',
    pitfallWarning: 'Strings cannot be changed in place in Python (text[0] = "X" causes a TypeError). Always collect letters in a list and combine them at the end with "".join(letters).',
    description: 'Build a secret-message scrambler that shifts letters forward or backward through the alphabet while keeping spaces, numbers, and punctuation untouched.',
    learningOutcomes: [
      'Convert letters to numbers and back with ord() and chr()',
      'Wrap around the 26-letter alphabet using modulo (% 26)',
      'Build new strings safely using a list and "".join()',
      'Keep spaces and punctuation unchanged in an else branch',
    ],
    starterCode: `# Lab 03: Secret Message Scrambler (PCEP Domain 3)
# Follow Step 1 -> Step 2 -> Step 3 in order from top to bottom!

def caesar_cipher(text, shift):
    result = []

    for char in text:
        # STEP 1: Shift uppercase letters ('A' to 'Z')
        if char.isupper():
            base = ord("A")
            # TODO (Step 1): Replace char with shifted uppercase letter
            new_char = char
            result.append(new_char)

        # STEP 2: Shift lowercase letters ('a' to 'z') and keep symbols as-is
        elif char.islower():
            base = ord("a")
            # TODO (Step 2): Replace char with shifted lowercase letter
            new_char = char
            result.append(new_char)
        else:
            # Keep spaces, numbers, and punctuation unchanged
            result.append(char)

    # STEP 3: Join all characters into one string and return it
    # TODO (Step 3): Return "".join(result)
    return ""


if __name__ == "__main__":
    print("Encoded:", caesar_cipher("PYTHON", 3))
    print("Decoded:", caesar_cipher("MZBM", -3))
`,
    solutionCode: `# Solution: Secret Message Scrambler (PCEP Domain 3)

def caesar_cipher(text, shift):
    result = []
    for char in text:
        if char.isupper():
            base = ord("A")
            new_char = chr((ord(char) - base + shift) % 26 + base)
            result.append(new_char)
        elif char.islower():
            base = ord("a")
            new_char = chr((ord(char) - base + shift) % 26 + base)
            result.append(new_char)
        else:
            result.append(char)
    return "".join(result)

if __name__ == "__main__":
    print("Encoded:", caesar_cipher("PYTHON", 3))
    print("Decoded:", caesar_cipher("MZBM", -3))
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Shift Uppercase Letters',
        taskInstruction: 'Under if char.isupper():, compute new_char = chr((ord(char) - base + shift) % 26 + base) so uppercase letters wrap cleanly from Z to A.',
        targetObjectiveId: '3.8',
        expectedExample: 'caesar_cipher("PYTHON", 3) -> "SBWKRQ"',
        breadcrumbs: {
          level1Concept: 'Subtracting base (65 for "A") turns A..Z into 0..25. Adding shift and taking % 26 wraps past 25 back to 0, and adding base brings it back to A..Z.',
          level2Syntax: 'new_char = chr((ord(char) - base + shift) % 26 + base)',
          level3Scaffold: 'if char.isupper():\n    base = ord("A")\n    new_char = chr((ord(char) - base + shift) % 26 + base)\n    result.append(new_char)',
        },
        validationSnippet: 'assert caesar_cipher("PYTHON", 3) == "SBWKRQ"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Shift Lowercase Letters & Keep Symbols',
        taskInstruction: 'Under elif char.islower():, use the same formula with base = ord("a") (97). Punctuation and spaces stay unchanged in the else block.',
        targetObjectiveId: '3.9',
        expectedExample: 'caesar_cipher("Hello, World!", 5) -> "Mjqqt, Btwqi!"',
        breadcrumbs: {
          level1Concept: 'Lowercase letters start at ord("a") = 97. Using base = ord("a") ensures "x", "y", "z" wrap back to "a", "b", "c".',
          level2Syntax: 'elif char.islower():\n    base = ord("a")\n    new_char = chr((ord(char) - base + shift) % 26 + base)\n    result.append(new_char)',
          level3Scaffold: 'elif char.islower():\n    base = ord("a")\n    new_char = chr((ord(char) - base + shift) % 26 + base)\n    result.append(new_char)',
        },
        validationSnippet: 'assert caesar_cipher("Hello, World!", 5) == "Mjqqt, Btwqi!"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Join List & Verify Negative Shift Decoding',
        taskInstruction: 'At the bottom of caesar_cipher, return "".join(result). Python handles negative shifts like -3 automatically with % 26.',
        targetObjectiveId: '3.1',
        expectedExample: 'caesar_cipher("PCEP", -3) -> "MZBM"',
        breadcrumbs: {
          level1Concept: '"".join(result) combines every letter in the list into one string. In Python, (-3) % 26 is 23, so negative shifts decode backwards automatically.',
          level2Syntax: 'return "".join(result)',
          level3Scaffold: 'return "".join(result)',
        },
        validationSnippet: 'assert caesar_cipher("PCEP", -3) == "MZBM"',
      },
    ],
  },
  {
    id: 'proj-03-collections-strings',
    title: 'School Store Cart & Receipt Formatter',
    sectionNumber: 3,
    sectionName: 'Data Collections — Lists, Tuples, Sets, Dicts & Strings',
    examWeightPercentage: 26,
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    specificObjectives: ['3.1', '3.4', '3.5', '3.6', '3.9'],
    fileName: 'school_store.py',
    testFileName: 'test_school_store.py',
    keyTip: 'Use a set() whenever you want zero duplicates, dict.get(key) to look up items safely, and :.2f inside an f-string for dollars and cents.',
    pitfallWarning: 'Empty curly braces {} create a dictionary, NOT a set! Always use set() when starting an empty set.',
    description: 'Organize a school store catalog using Python dictionaries, sets, list slicing, and f-strings to print clean, formatted price labels.',
    learningOutcomes: [
      'Remove duplicate category tags using a set',
      'Look up dictionary values safely with .get()',
      'Format uppercase names and 2-decimal prices with f-strings',
      'Take the first N items from a list using [:count]',
    ],
    starterCode: `# Lab 04: School Store Cart & Receipt Formatter (PCEP Domain 3)
# Follow Step 1 -> Step 2 -> Step 3 in order from top to bottom!

catalog = {
    "ITEM-1": {"name": "graphing calculator", "price": 89.99, "tags": ["math", "tech", "school"]},
    "ITEM-2": {"name": "spiral notebook", "price": 4.50, "tags": ["writing", "school"]},
    "ITEM-3": {"name": "usb flash drive", "price": 14.25, "tags": ["tech", "school"]},
}

# STEP 1: Collect every unique tag across all catalog items into a set
def get_unique_categories(store_catalog):
    categories = set()
    # TODO (Step 1): Loop over store_catalog.values() and add each tag to categories
    return categories


# STEP 2: Return a formatted label like "[ITEM-1] GRAPHING CALCULATOR: $89.99"
def format_price_label(code, store_catalog):
    item = store_catalog.get(code)
    if not item:
        return "Not found"
    # TODO (Step 2): Uppercase item["name"] and format item["price"] with :.2f
    return ""


# STEP 3: Return the first 'count' item codes using list slicing
def get_top_items(item_codes, count):
    # TODO (Step 3): Return item_codes[:count]
    return []


if __name__ == "__main__":
    print("Categories:", get_unique_categories(catalog))
    print(format_price_label("ITEM-1", catalog))
    print("Top 2:", get_top_items(["ITEM-1", "ITEM-2", "ITEM-3"], 2))
`,
    solutionCode: `# Solution: School Store Cart & Receipt Formatter (PCEP Domain 3)

catalog = {
    "ITEM-1": {"name": "graphing calculator", "price": 89.99, "tags": ["math", "tech", "school"]},
    "ITEM-2": {"name": "spiral notebook", "price": 4.50, "tags": ["writing", "school"]},
    "ITEM-3": {"name": "usb flash drive", "price": 14.25, "tags": ["tech", "school"]},
}

def get_unique_categories(store_catalog):
    categories = set()
    for item in store_catalog.values():
        for tag in item.get("tags", []):
            categories.add(tag)
    return categories

def format_price_label(code, store_catalog):
    item = store_catalog.get(code)
    if not item:
        return "Not found"
    clean_name = item["name"].upper()
    price = item["price"]
    return f"[{code}] {clean_name}: $" + f"{price:.2f}"

def get_top_items(item_codes, count):
    return item_codes[:count]

if __name__ == "__main__":
    print("Categories:", get_unique_categories(catalog))
    print(format_price_label("ITEM-1", catalog))
    print("Top 2:", get_top_items(["ITEM-1", "ITEM-2", "ITEM-3"], 2))
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Collect Unique Tags with a set',
        taskInstruction: 'Inside get_unique_categories(store_catalog), loop through store_catalog.values(), then loop through item["tags"] and call categories.add(tag).',
        targetObjectiveId: '3.5',
        expectedExample: '"tech" in get_unique_categories(catalog) -> True',
        breadcrumbs: {
          level1Concept: 'A set automatically ignores duplicates. Calling categories.add("school") twice only stores "school" once.',
          level2Syntax: 'for item in store_catalog.values():\n    for tag in item.get("tags", []):\n        categories.add(tag)',
          level3Scaffold: 'for item in store_catalog.values():\n    for tag in item.get("tags", []):\n        categories.add(tag)',
        },
        validationSnippet: 'assert "school" in get_unique_categories(catalog) and len(get_unique_categories(catalog)) == 4',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Format Price Labels with .upper() & :.2f',
        taskInstruction: 'Inside format_price_label(code, store_catalog), get clean_name = item["name"].upper() and price = item["price"], then return f"[{code}] {clean_name}: $" + f"{price:.2f}".',
        targetObjectiveId: '3.9',
        expectedExample: '"[ITEM-1] GRAPHING CALCULATOR: $89.99"',
        breadcrumbs: {
          level1Concept: '.upper() converts text to ALL CAPS, and :.2f inside an f-string guarantees two decimal places (like $4.50 instead of $4.5).',
          level2Syntax: 'clean_name = item["name"].upper()\nprice = item["price"]\nreturn f"[{code}] {clean_name}: $" + f"{price:.2f}"',
          level3Scaffold: 'clean_name = item["name"].upper()\nprice = item["price"]\nreturn f"[{code}] {clean_name}: $" + f"{price:.2f}"',
        },
        validationSnippet: 'assert format_price_label("ITEM-1", catalog) == "[ITEM-1] GRAPHING CALCULATOR: $89.99"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Slice Top Items with [:count]',
        taskInstruction: 'Inside get_top_items(item_codes, count), return item_codes[:count].',
        targetObjectiveId: '3.1',
        expectedExample: 'get_top_items(["A", "B", "C"], 2) -> ["A", "B"]',
        breadcrumbs: {
          level1Concept: 'Slicing with [:count] starts at index 0 and stops right before index count, without changing the original list.',
          level2Syntax: 'return item_codes[:count]',
          level3Scaffold: 'def get_top_items(item_codes, count):\n    return item_codes[:count]',
        },
        validationSnippet: 'assert get_top_items(["ITEM-1", "ITEM-2", "ITEM-3"], 2) == ["ITEM-1", "ITEM-2"]',
      },
    ],
  },
  {
    id: 'proj-04-functions-exceptions',
    title: 'Safe Quiz Average & Division Guard',
    sectionNumber: 4,
    sectionName: 'Functions & Exceptions',
    examWeightPercentage: 20,
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    specificObjectives: ['4.1', '4.2', '4.3', '4.4', '4.6', '4.7'],
    fileName: 'safe_grader.py',
    testFileName: 'test_safe_grader.py',
    keyTip: '*scores packs any number of arguments into a tuple, and try...except lets your program handle errors gracefully instead of crashing.',
    pitfallWarning: 'Always put specific exceptions (like ZeroDivisionError) BEFORE general ones (like Exception), otherwise the specific handler is never reached!',
    description: 'Write flexible Python functions using *args and default bonus points, then add try-except blocks to catch division by zero and bad text inputs safely.',
    learningOutcomes: [
      'Accept any number of arguments using *args',
      'Set default parameter values like bonus=0',
      'Catch ZeroDivisionError separately from ValueError and TypeError',
      'Return clear messages instead of letting errors crash your program',
    ],
    starterCode: `# Lab 05: Safe Quiz Average & Division Guard (PCEP Domain 4)
# Follow Step 1 -> Step 2 -> Step 3 in order from top to bottom!

# STEP 1: Compute the average of any number of scores, plus an optional bonus
def average_score(*scores, bonus=0):
    if not scores:
        return 0.0
    # TODO (Step 1): Compute (sum(scores) / len(scores)) + bonus, rounded to 2 decimals
    return 0.0


# STEP 2 & STEP 3: Safely divide two numbers without crashing
# - Valid numbers: return float(a) / float(b)
# - Dividing by 0 (ZeroDivisionError): return "Cannot divide by zero"
# - Non-numbers (ValueError, TypeError): return "Please enter numbers only"
def safe_divide(a, b):
    # TODO (Step 2 & 3): Wrap float(a) / float(b) in try / except blocks
    return None


if __name__ == "__main__":
    print("Average with bonus:", average_score(80, 90, 100, bonus=2))
    print("10 / 2 =", safe_divide(10, 2))
    print("10 / 0 =", safe_divide(10, 0))
    print("10 / abc =", safe_divide(10, "abc"))
`,
    solutionCode: `# Solution: Safe Quiz Average & Division Guard (PCEP Domain 4)

def average_score(*scores, bonus=0):
    if not scores:
        return 0.0
    avg = (sum(scores) / len(scores)) + bonus
    return round(avg, 2)

def safe_divide(a, b):
    try:
        return float(a) / float(b)
    except ZeroDivisionError:
        return "Cannot divide by zero"
    except (ValueError, TypeError):
        return "Please enter numbers only"

if __name__ == "__main__":
    print("Average with bonus:", average_score(80, 90, 100, bonus=2))
    print("10 / 2 =", safe_divide(10, 2))
    print("10 / 0 =", safe_divide(10, 0))
    print("10 / abc =", safe_divide(10, "abc"))
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Flexible Average with *scores & bonus=0',
        taskInstruction: 'Inside average_score(*scores, bonus=0), compute avg = (sum(scores) / len(scores)) + bonus and return round(avg, 2).',
        targetObjectiveId: '4.4',
        expectedExample: 'average_score(80, 90, 100, bonus=2) -> 92.0',
        breadcrumbs: {
          level1Concept: '*scores collects all positional numbers into a tuple so sum(scores) and len(scores) work for 1 score or 10 scores. bonus=0 is a default keyword argument.',
          level2Syntax: 'avg = (sum(scores) / len(scores)) + bonus\nreturn round(avg, 2)',
          level3Scaffold: 'def average_score(*scores, bonus=0):\n    if not scores:\n        return 0.0\n    return round((sum(scores) / len(scores)) + bonus, 2)',
        },
        validationSnippet: 'assert average_score(80, 90, 100, bonus=2) == 92.0',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Catch ZeroDivisionError in safe_divide()',
        taskInstruction: 'Inside safe_divide(a, b), add a try: block returning float(a) / float(b) and an except ZeroDivisionError: block returning "Cannot divide by zero".',
        targetObjectiveId: '4.6',
        expectedExample: 'safe_divide(10, 0) -> "Cannot divide by zero"',
        breadcrumbs: {
          level1Concept: 'Put the risky division inside try:. If b is 0, Python jumps straight to except ZeroDivisionError: instead of crashing.',
          level2Syntax: 'try:\n    return float(a) / float(b)\nexcept ZeroDivisionError:\n    return "Cannot divide by zero"',
          level3Scaffold: 'try:\n    return float(a) / float(b)\nexcept ZeroDivisionError:\n    return "Cannot divide by zero"',
        },
        validationSnippet: 'assert safe_divide(10, 0) == "Cannot divide by zero" and safe_divide(10, 2) == 5.0',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Catch ValueError & TypeError',
        taskInstruction: 'Add except (ValueError, TypeError): below ZeroDivisionError and return "Please enter numbers only".',
        targetObjectiveId: '4.7',
        expectedExample: 'safe_divide(10, "abc") -> "Please enter numbers only"',
        breadcrumbs: {
          level1Concept: 'float("abc") raises ValueError, and float(None) raises TypeError. Putting both in parentheses catches either mistake cleanly.',
          level2Syntax: 'except (ValueError, TypeError):\n    return "Please enter numbers only"',
          level3Scaffold: 'try:\n    return float(a) / float(b)\nexcept ZeroDivisionError:\n    return "Cannot divide by zero"\nexcept (ValueError, TypeError):\n    return "Please enter numbers only"',
        },
        validationSnippet: 'assert safe_divide(10, "abc") == "Please enter numbers only"',
      },
    ],
  },
  {
    id: 'proj-05-files-modules',
    title: 'Class Gradebook & Raffle Winner Picker',
    sectionNumber: 5,
    sectionName: 'File Handling & Module Imports',
    examWeightPercentage: 14,
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    specificObjectives: ['5.2', '5.3', '5.4', '5.5'],
    fileName: 'gradebook_raffle.py',
    testFileName: 'test_gradebook_raffle.py',
    keyTip: 'math.ceil() always rounds UP to the next integer, math.floor() always rounds DOWN, and random.seed() makes random picks repeatable for tests.',
    pitfallWarning: 'Watch out for negative numbers on the PCEP exam: math.floor(-3.2) is -4 (down), while math.trunc(-3.2) is -3 (chops off decimals).',
    description: 'Read comma-separated (CSV) student quiz scores, summarize class highs and lows with the math module, and pick a raffle winner using the random module.',
    learningOutcomes: [
      'Split CSV text lines into names and numeric scores',
      'Use math.ceil() and math.floor() from the standard math module',
      'Use random.seed() and random.choice() from the random module',
      'Return structured tuples and dictionaries',
    ],
    starterCode: `# Lab 06: Class Gradebook & Raffle Winner Picker (PCEP Domain 5)
# Follow Step 1 -> Step 2 -> Step 3 in order from top to bottom!

import math
import random

csv_data = """Alice,88,94
Bob,72,81
Charlie,95,99
Diana,61,68
Evan,84,87"""


# STEP 1: Parse CSV lines into a list of (name, average) tuples
def parse_gradebook(raw_text):
    records = []
    # TODO (Step 1): Split raw_text by "\\n", then split each line by ","
    # Convert the two scores with float(), compute (s1 + s2) / 2, and append (name, avg)
    return records


# STEP 2: Return {"highest_ceil": ..., "lowest_floor": ...} using math.ceil and math.floor
def summarize_scores(records):
    # TODO (Step 2): Gather all averages and apply math.ceil(max(...)) and math.floor(min(...))
    return {"highest_ceil": 0, "lowest_floor": 0}


# STEP 3: Seed random(42) and pick one student name using random.choice()
def pick_raffle_winner(records):
    # TODO (Step 3): Call random.seed(42) and return random.choice([r[0] for r in records])
    return ""


if __name__ == "__main__":
    parsed = parse_gradebook(csv_data)
    print("Parsed gradebook:", parsed)
    print("Summary:", summarize_scores(parsed))
    print("Raffle winner:", pick_raffle_winner(parsed))
`,
    solutionCode: `# Solution: Class Gradebook & Raffle Winner Picker (PCEP Domain 5)

import math
import random

csv_data = """Alice,88,94
Bob,72,81
Charlie,95,99
Diana,61,68
Evan,84,87"""

def parse_gradebook(raw_text):
    records = []
    for line in raw_text.strip().split("\\n"):
        parts = line.split(",")
        name = parts[0]
        avg = (float(parts[1]) + float(parts[2])) / 2.0
        records.append((name, avg))
    return records

def summarize_scores(records):
    averages = [r[1] for r in records]
    return {
        "highest_ceil": math.ceil(max(averages)),
        "lowest_floor": math.floor(min(averages)),
    }

def pick_raffle_winner(records):
    random.seed(42)
    names = [r[0] for r in records]
    return random.choice(names)

if __name__ == "__main__":
    parsed = parse_gradebook(csv_data)
    print("Parsed gradebook:", parsed)
    print("Summary:", summarize_scores(parsed))
    print("Raffle winner:", pick_raffle_winner(parsed))
`,
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Parse CSV Rows into (name, avg) Tuples',
        taskInstruction: 'Inside parse_gradebook(raw_text), loop over raw_text.strip().split("\\n"), split each line by ",", convert parts[1] and parts[2] to float, and append (name, (s1 + s2) / 2.0).',
        targetObjectiveId: '5.3',
        expectedExample: 'parse_gradebook(csv_data)[0] -> ("Alice", 91.0)',
        breadcrumbs: {
          level1Concept: 'CSV text stores one record per line and separates fields with commas. Splitting twice gives you each value cleanly.',
          level2Syntax: 'for line in raw_text.strip().split("\\n"):\n    parts = line.split(",")\n    avg = (float(parts[1]) + float(parts[2])) / 2.0\n    records.append((parts[0], avg))',
          level3Scaffold: 'for line in raw_text.strip().split("\\n"):\n    parts = line.split(",")\n    name = parts[0]\n    avg = (float(parts[1]) + float(parts[2])) / 2.0\n    records.append((name, avg))',
        },
        validationSnippet: 'assert parse_gradebook(csv_data)[0] == ("Alice", 91.0)',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Round Highs & Lows with math.ceil / math.floor',
        taskInstruction: 'Inside summarize_scores(records), extract averages = [r[1] for r in records] and return {"highest_ceil": math.ceil(max(averages)), "lowest_floor": math.floor(min(averages))}.',
        targetObjectiveId: '5.5',
        expectedExample: '{"highest_ceil": 97, "lowest_floor": 64}',
        breadcrumbs: {
          level1Concept: 'math.ceil() rounds any decimal up to the nearest whole number; math.floor() rounds down.',
          level2Syntax: 'averages = [r[1] for r in records]\nreturn {"highest_ceil": math.ceil(max(averages)), "lowest_floor": math.floor(min(averages))}',
          level3Scaffold: 'averages = [r[1] for r in records]\nreturn {\n    "highest_ceil": math.ceil(max(averages)),\n    "lowest_floor": math.floor(min(averages)),\n}',
        },
        validationSnippet: 'assert summarize_scores(parse_gradebook(csv_data)) == {"highest_ceil": 97, "lowest_floor": 64}',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Pick a Raffle Winner with random.choice()',
        taskInstruction: 'Inside pick_raffle_winner(records), call random.seed(42) and return random.choice([r[0] for r in records]).',
        targetObjectiveId: '5.4',
        expectedExample: 'Returns one student name from the gradebook',
        breadcrumbs: {
          level1Concept: 'random.choice(seq) picks one element at random from a list. Calling random.seed(42) makes the pick predictable for testing.',
          level2Syntax: 'random.seed(42)\nreturn random.choice([r[0] for r in records])',
          level3Scaffold: 'def pick_raffle_winner(records):\n    random.seed(42)\n    names = [r[0] for r in records]\n    return random.choice(names)',
        },
        validationSnippet: 'assert pick_raffle_winner(parse_gradebook(csv_data)) in ["Alice", "Bob", "Charlie", "Diana", "Evan"]',
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
    title: 'Road Trip & Weather Converter',
    subtitle: 'Operators, Type Casting & Print Formatting',
    domain: 'PCEP Domain 1 (Fundamentals & Math)',
    status: 'draft',
    statusLabel: 'READY TO BUILD',
    commitsCount: 0,
    description: 'A clean Python console calculator that converts Celsius to Fahrenheit, splits road-trip miles into fuel stops using // and %, and prints formatted summaries with sep and end.',
    coveragePercent: 0,
    unitTestsPassing: '0/3',
    tags: ['float()', 'floor //', 'modulo %', 'print(sep, end)'],
    codePreviewSnippet: `def trip_fuel_stops(total_miles, miles_per_tank):
    full_stops = int(total_miles) // int(miles_per_tank)
    leftover_miles = int(total_miles) % int(miles_per_tank)
    return (full_stops, leftover_miles)`,
    githubRepoUrl: 'https://github.com/pcep-candidate/road-trip-converter',
    syllabusGoal: 'Operator Precedence & Console Formatting',
    cornerCasesCount: 3,
  },
  {
    id: 'cap-02-flowmaster',
    title: 'Game Score Filter & Countdown Timer',
    subtitle: 'Decisions, Loops, break & continue',
    domain: 'PCEP Domain 2 (Control Flow & Loops)',
    status: 'draft',
    statusLabel: 'READY TO BUILD',
    commitsCount: 0,
    description: 'Build a game score tracker that skips invalid negative scores with continue, stops cleanly at a -1 quit value with break, and counts down using range() with a negative step.',
    coveragePercent: 0,
    unitTestsPassing: '0/3',
    tags: ['if / elif / else', 'break & continue', 'range(-1)'],
    codePreviewSnippet: `def filter_scores(scores):
    valid_scores = []
    for score in scores:
        if score == -1:
            break
        if score < 0:
            continue
        valid_scores.append(score)
    return valid_scores`,
    githubRepoUrl: 'https://github.com/pcep-candidate/game-score-tracker',
    syllabusGoal: 'Sentinel Loops & Branching',
    cornerCasesCount: 3,
  },
  {
    id: 'cap-03-collection-crafter',
    title: 'School Store Cart & Secret Scrambler',
    subtitle: 'Lists, Sets, Dictionaries & Strings',
    domain: 'PCEP Domain 3 (Collections & Strings)',
    status: 'draft',
    statusLabel: 'READY TO BUILD',
    commitsCount: 0,
    description: 'Combine two practical Python apps: a school store receipt formatter using dictionaries, sets, and slicing, plus a Caesar Cipher secret-message scrambler using ord(), chr(), and "".join().',
    coveragePercent: 0,
    unitTestsPassing: '0/3',
    tags: ['dict.get()', 'set()', 'slicing [:n]', 'f-strings'],
    codePreviewSnippet: `def format_price_label(code, store_catalog):
    item = store_catalog.get(code)
    if not item:
        return "Not found"
    clean_name = item["name"].upper()
    return f"[{code}] {clean_name}: $" + f"{item['price']:.2f}"`,
    githubRepoUrl: 'https://github.com/pcep-candidate/school-store-collections',
    syllabusGoal: 'Collections & String Immutability',
    cornerCasesCount: 3,
  },
  {
    id: 'cap-04-custom-exception',
    title: 'Safe Quiz Average & Division Guard',
    subtitle: 'Functions, *args & try-except Safety',
    domain: 'PCEP Domain 4 (Functions & Exceptions)',
    status: 'draft',
    statusLabel: 'READY TO BUILD',
    commitsCount: 0,
    description: 'Create reusable Python functions with *args and default bonus parameters, protected by try-except blocks that catch ZeroDivisionError and bad text inputs without crashing.',
    coveragePercent: 0,
    unitTestsPassing: '0/3',
    tags: ['def & *args', 'default args', 'ZeroDivisionError', 'ValueError'],
    codePreviewSnippet: `def safe_divide(a, b):
    try:
        return float(a) / float(b)
    except ZeroDivisionError:
        return "Cannot divide by zero"
    except (ValueError, TypeError):
        return "Please enter numbers only"`,
    githubRepoUrl: 'https://github.com/pcep-candidate/safe-quiz-grader',
    syllabusGoal: 'Reusable Functions & Safe Error Handling',
    cornerCasesCount: 3,
  },
  {
    id: 'cap-05-file-stream-audit',
    title: 'Class Gradebook & Raffle Winner Picker',
    subtitle: 'CSV Parsing, math & random Modules',
    domain: 'PCEP Domain 5 (Files & Standard Modules)',
    status: 'draft',
    statusLabel: 'READY TO BUILD',
    commitsCount: 0,
    description: 'Parse comma-separated (CSV) student quiz records into tuples, round class highs and lows with math.ceil() and math.floor(), and choose a repeatable raffle winner with random.seed().',
    coveragePercent: 0,
    unitTestsPassing: '0/3',
    tags: ['CSV parsing', 'math.ceil()', 'math.floor()', 'random.choice()'],
    codePreviewSnippet: `def summarize_scores(records):
    averages = [r[1] for r in records]
    return {
        "highest_ceil": math.ceil(max(averages)),
        "lowest_floor": math.floor(min(averages)),
    }`,
    githubRepoUrl: 'https://github.com/pcep-candidate/gradebook-raffle-picker',
    syllabusGoal: 'CSV Data & Standard Library Modules',
    cornerCasesCount: 3,
  },
];


