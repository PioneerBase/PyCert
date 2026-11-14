import { BonusProject } from '../types';

export const EASY_CATALOG_PROJECTS: BonusProject[] = [
  {
    id: 'bonus-number-guesser',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Number Guesser',
    sectionNumber: 2,
    sectionName: 'Control Flow - Conditional Blocks and Loops',
    examWeightPercentage: 29,
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    specificObjectives: ['2.1', '2.2', '4.3'],
    fileName: 'number_guesser.py',
    testFileName: 'test_number_guesser.py',
    keyTip: 'Compare guess against secret with <, >, and == inside an if/elif/else block before looping over guesses.',
    pitfallWarning: 'Remember to stop looping with break as soon as the player guesses the secret number so remaining guesses are not counted.',
    description: 'Build a game where the user tries to guess a hidden number with hints like too high/too low.',
    learningOutcomes: [
      'Compare numeric guesses using if/elif/else conditionals',
      'Track attempt counts inside a bounded loop',
      'Return structured game results when winning or running out of tries',
    ],
    starterCode: '# Number Guesser',
    solutionCode: '# Solution: Number Guesser',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Return High/Low/Correct Guess Hint',
        starterCode: `# Cell 1 (Step 1): Compare a single guess to the secret number
def evaluate_guess(secret, guess):
    # TODO: Return "Too low", "Too high", or "Correct!"
    return ""

print("Guess 40 vs 50:", evaluate_guess(50, 40))`,
        solutionCode: `# Cell 1 (Step 1): Compare a single guess to the secret number
def evaluate_guess(secret, guess):
    if guess < secret:
        return "Too low"
    elif guess > secret:
        return "Too high"
    return "Correct!"

print("Guess 40 vs 50:", evaluate_guess(50, 40))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Run a Multi-Attempt Guessing Session',
        starterCode: `# Cell 2 (Step 2): Process a list of guesses up to max_tries
def play_guessing_game(secret, guesses, max_tries=5):
    hints = []
    # TODO: Loop through guesses[:max_tries], append evaluate_guess(secret, g) to hints,
    # and if the hint is "Correct!", return {"won": True, "attempts": len(hints), "hints": hints}
    return {"won": False, "attempts": len(hints), "hints": hints}

print(play_guessing_game(42, [20, 60, 42]))`,
        solutionCode: `# Cell 2 (Step 2): Process a list of guesses up to max_tries
def play_guessing_game(secret, guesses, max_tries=5):
    hints = []
    for guess in guesses[:max_tries]:
        hint = evaluate_guess(secret, guess)
        hints.append(hint)
        if hint == "Correct!":
            return {"won": True, "attempts": len(hints), "hints": hints}
    return {"won": False, "attempts": len(hints), "hints": hints}

print(play_guessing_game(42, [20, 60, 42]))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Suggest Next Binary Search Midpoint',
        starterCode: `# Cell 3 (Step 3): Suggest the smart midpoint guess between low and high
def smart_next_guess(low, high):
    # TODO: Return integer midpoint (low + high) // 2
    return 0

print("Midpoint 1..100:", smart_next_guess(1, 100))`,
        solutionCode: `# Cell 3 (Step 3): Suggest the smart midpoint guess between low and high
def smart_next_guess(low, high):
    return (low + high) // 2

print("Midpoint 1..100:", smart_next_guess(1, 100))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: High/Low Hint Logic',
        taskInstruction: 'In Cell 1 inside evaluate_guess(secret, guess), return "Too low" if guess < secret, "Too high" if guess > secret, and "Correct!" otherwise.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Three-Way Comparison)',
        patternCode: `if value < target:
    return "Too low"
elif value > target:
    return "Too high"
return "Correct!"`,
        patternExplanation: 'An if/elif/else chain handles less-than, greater-than, and exact equality cleanly.',
        expectedExample: 'evaluate_guess(50, 75) -> "Too high"',
        diagnosticExpr: 'evaluate_guess(50, 75)',
        breadcrumbs: {
          level1Concept: 'Check guess < secret first, then guess > secret, then return "Correct!".',
          level2Syntax: 'if guess < secret:\n    return "Too low"\nelif guess > secret:\n    return "Too high"\nreturn "Correct!"',
          level3Scaffold: 'if guess < secret:\n    return "Too low"\nelif guess > secret:\n    return "Too high"\nreturn "Correct!"',
        },
        validationSnippet: 'assert evaluate_guess(50, 30) == "Too low" and evaluate_guess(50, 80) == "Too high" and evaluate_guess(50, 50) == "Correct!"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Loop Over Guesses & Track Attempts',
        taskInstruction: 'In Cell 2 inside play_guessing_game(), iterate over guesses[:max_tries], append evaluate_guess(secret, guess) to hints, and return immediately with won=True when "Correct!" is returned.',
        targetObjectiveId: '2.2',
        patternTitle: 'Worked Pattern (Early Return on Win)',
        patternCode: `for g in guesses[:limit]:
    hint = evaluate_guess(secret, g)
    hints.append(hint)
    if hint == "Correct!":
        return {"won": True, "attempts": len(hints), "hints": hints}`,
        patternExplanation: 'Slicing guesses[:max_tries] prevents the player from exceeding the allowed tries.',
        expectedExample: 'play_guessing_game(42, [20, 42])["attempts"] -> 2',
        diagnosticExpr: 'play_guessing_game(42, [20, 42])',
        breadcrumbs: {
          level1Concept: 'Iterate over guesses[:max_tries], collect hints, and stop when hint == "Correct!".',
          level2Syntax: 'for guess in guesses[:max_tries]:\n    hint = evaluate_guess(secret, guess)\n    hints.append(hint)',
          level3Scaffold: 'for guess in guesses[:max_tries]:\n    hint = evaluate_guess(secret, guess)\n    hints.append(hint)\n    if hint == "Correct!":\n        return {"won": True, "attempts": len(hints), "hints": hints}',
        },
        validationSnippet: 'r1 = play_guessing_game(42, [20, 60, 42])\nr2 = play_guessing_game(42, [1, 2], max_tries=2)\nassert r1["won"] is True and r1["attempts"] == 3 and r2["won"] is False',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Compute Smart Midpoint',
        taskInstruction: 'In Cell 3 inside smart_next_guess(low, high), return (low + high) // 2.',
        targetObjectiveId: '4.3',
        patternTitle: 'Worked Pattern (Floor Division Midpoint)',
        patternCode: `mid = (low + high) // 2`,
        patternExplanation: 'Integer floor division // ensures the guess is always a whole integer.',
        expectedExample: 'smart_next_guess(1, 100) -> 50',
        diagnosticExpr: 'smart_next_guess(1, 100)',
        breadcrumbs: {
          level1Concept: 'Add low and high and divide by 2 using integer division //.',
          level2Syntax: 'return (low + high) // 2',
          level3Scaffold: 'return (low + high) // 2',
        },
        validationSnippet: 'assert smart_next_guess(1, 100) == 50 and smart_next_guess(51, 100) == 75',
      },
    ],
  },
  {
    id: 'bonus-odd-even-checker',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Odd/Even Checker',
    sectionNumber: 1,
    sectionName: 'Computer Programming & Python Fundamentals',
    examWeightPercentage: 17,
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    specificObjectives: ['1.4', '2.1', '3.3'],
    fileName: 'odd_even_checker.py',
    testFileName: 'test_odd_even_checker.py',
    keyTip: 'An integer n is even whenever n % 2 == 0 and odd whenever n % 2 != 0.',
    pitfallWarning: 'Zero (0) is an even number because 0 % 2 == 0, and negative integers work with % 2 just like positive ones.',
    description: 'A simple utility that tells whether an entered number is odd or even.',
    learningOutcomes: [
      'Use the modulo operator (%) to test divisibility by 2',
      'Classify a batch of numbers into even and odd buckets',
      'Safely validate string input before converting to int',
    ],
    starterCode: '# Odd/Even Checker',
    solutionCode: '# Solution: Odd/Even Checker',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Check Single Integer Parity',
        starterCode: `# Cell 1 (Step 1): Return "Even" if number % 2 == 0 else "Odd"
def check_parity(number):
    # TODO: Implement parity check
    return ""

print("7 is:", check_parity(7), "| 12 is:", check_parity(12))`,
        solutionCode: `# Cell 1 (Step 1): Return "Even" if number % 2 == 0 else "Odd"
def check_parity(number):
    return "Even" if number % 2 == 0 else "Odd"

print("7 is:", check_parity(7), "| 12 is:", check_parity(12))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Split a List Into Even & Odd Groups',
        starterCode: `# Cell 2 (Step 2): Group a list of numbers into {"even": [...], "odd": [...]}
def split_even_odd(numbers):
    evens = []
    odds = []
    # TODO: Append each n to evens if check_parity(n) == "Even" else odds
    return {"even": evens, "odd": odds}

print(split_even_odd([1, 2, 3, 4, 5, 6]))`,
        solutionCode: `# Cell 2 (Step 2): Group a list of numbers into {"even": [...], "odd": [...]}
def split_even_odd(numbers):
    evens = []
    odds = []
    for n in numbers:
        if check_parity(n) == "Even":
            evens.append(n)
        else:
            odds.append(n)
    return {"even": evens, "odd": odds}

print(split_even_odd([1, 2, 3, 4, 5, 6]))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Safe Text Input Parity Helper',
        starterCode: `# Cell 3 (Step 3): Parse string input safely and report parity or "Invalid integer"
def check_input_parity(raw_text):
    # TODO: Use try/except ValueError with int(raw_text.strip()) and return f"{num} is {check_parity(num)}"
    return ""

print(check_input_parity(" 24 "), "|", check_input_parity("abc"))`,
        solutionCode: `# Cell 3 (Step 3): Parse string input safely and report parity or "Invalid integer"
def check_input_parity(raw_text):
    try:
        num = int(raw_text.strip())
    except ValueError:
        return "Invalid integer"
    return f"{num} is {check_parity(num)}"

print(check_input_parity(" 24 "), "|", check_input_parity("abc"))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Modulo Parity Check',
        taskInstruction: 'In Cell 1 inside check_parity(number), return "Even" when number % 2 == 0 and "Odd" otherwise.',
        targetObjectiveId: '1.4',
        patternTitle: 'Worked Pattern (Even/Odd Modulo)',
        patternCode: `label = "Even" if num % 2 == 0 else "Odd"`,
        patternExplanation: 'Remainder 0 after dividing by 2 always identifies an even integer.',
        expectedExample: 'check_parity(12) -> "Even"',
        diagnosticExpr: 'check_parity(12)',
        breadcrumbs: {
          level1Concept: 'Use % 2 == 0 to check if a number is evenly divisible by 2.',
          level2Syntax: 'return "Even" if number % 2 == 0 else "Odd"',
          level3Scaffold: 'return "Even" if number % 2 == 0 else "Odd"',
        },
        validationSnippet: 'assert check_parity(0) == "Even" and check_parity(7) == "Odd" and check_parity(-4) == "Even"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Group Even & Odd Lists',
        taskInstruction: 'In Cell 2 inside split_even_odd(numbers), loop through numbers and append each to evens or odds.',
        targetObjectiveId: '3.3',
        patternTitle: 'Worked Pattern (Partitioning Lists)',
        patternCode: `for n in numbers:
    if n % 2 == 0:
        evens.append(n)
    else:
        odds.append(n)`,
        patternExplanation: 'Building two lists in one loop partitions data in O(n) time.',
        expectedExample: 'split_even_odd([1, 2, 3, 4]) -> {"even": [2, 4], "odd": [1, 3]}',
        diagnosticExpr: 'split_even_odd([1, 2, 3, 4])',
        breadcrumbs: {
          level1Concept: 'Check check_parity(n) inside a for loop over numbers.',
          level2Syntax: 'for n in numbers:\n    if check_parity(n) == "Even": evens.append(n)\n    else: odds.append(n)',
          level3Scaffold: 'for n in numbers:\n    if check_parity(n) == "Even":\n        evens.append(n)\n    else:\n        odds.append(n)',
        },
        validationSnippet: 'assert split_even_odd([1, 2, 3, 4, 5]) == {"even": [2, 4], "odd": [1, 3, 5]}',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Validate String Input',
        taskInstruction: 'In Cell 3 inside check_input_parity(raw_text), convert raw_text.strip() with int() inside try/except ValueError and return f"{num} is {check_parity(num)}" or "Invalid integer".',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Safe Integer Parsing)',
        patternCode: `try:
    num = int(text.strip())
except ValueError:
    return "Invalid integer"`,
        patternExplanation: 'try/except ValueError prevents non-numeric text from crashing your utility.',
        expectedExample: 'check_input_parity("24") -> "24 is Even"',
        diagnosticExpr: 'check_input_parity("24")',
        breadcrumbs: {
          level1Concept: 'Wrap int(raw_text.strip()) in try/except ValueError.',
          level2Syntax: 'try:\n    num = int(raw_text.strip())\nexcept ValueError:\n    return "Invalid integer"\nreturn f"{num} is {check_parity(num)}"',
          level3Scaffold: 'try:\n    num = int(raw_text.strip())\nexcept ValueError:\n    return "Invalid integer"\nreturn f"{num} is {check_parity(num)}"',
        },
        validationSnippet: 'assert check_input_parity(" 24 ") == "24 is Even" and check_input_parity("xyz") == "Invalid integer"',
      },
    ],
  },
  {
    id: 'bonus-simple-calculator',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Simple Calculator',
    sectionNumber: 1,
    sectionName: 'Computer Programming & Python Fundamentals',
    examWeightPercentage: 17,
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    specificObjectives: ['1.4', '2.1', '4.6'],
    fileName: 'simple_calculator.py',
    testFileName: 'test_simple_calculator.py',
    keyTip: 'Validate operator membership against ("+", "-", "*", "/") and guard b == 0 before dividing.',
    pitfallWarning: 'Division by zero raises ZeroDivisionError in Python unless you return an error message when b == 0.',
    description: 'Perform basic arithmetic operations with input validation and clean output.',
    learningOutcomes: [
      'Dispatch +, -, *, / operations cleanly',
      'Prevent division by zero and unsupported operators',
      'Format clean human-readable calculation summaries',
    ],
    starterCode: '# Simple Calculator',
    solutionCode: '# Solution: Simple Calculator',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Core Arithmetic Dispatcher',
        starterCode: `# Cell 1 (Step 1): Perform +, -, *, / and raise ValueError on invalid ops or zero divisor
def compute(a, op, b):
    # TODO: Support "+", "-", "*", "/" (guard b == 0 on "/")
    return 0

print("12 * 4 =", compute(12, "*", 4))`,
        solutionCode: `# Cell 1 (Step 1): Perform +, -, *, / and raise ValueError on invalid ops or zero divisor
def compute(a, op, b):
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op == "*":
        return a * b
    if op == "/":
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b
    raise ValueError(f"Unsupported operator: {op}")

print("12 * 4 =", compute(12, "*", 4))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Parse & Validate String Expression',
        starterCode: `# Cell 2 (Step 2): Parse expressions like "10 / 2" with validation
def safe_calc_line(expr):
    parts = expr.strip().split()
    if len(parts) != 3:
        return "Error: Use format 'a op b'"
    # TODO: Convert parts[0] and parts[2] to float, call compute(), catch ValueError
    return ""

print(safe_calc_line("15 + 5"))
print(safe_calc_line("10 / 0"))`,
        solutionCode: `# Cell 2 (Step 2): Parse expressions like "10 / 2" with validation
def safe_calc_line(expr):
    parts = expr.strip().split()
    if len(parts) != 3:
        return "Error: Use format 'a op b'"
    try:
        a = float(parts[0])
        b = float(parts[2])
        result = compute(a, parts[1], b)
    except ValueError as err:
        return f"Error: {err}"
    return f"{parts[0]} {parts[1]} {parts[2]} = {round(result, 2)}"

print(safe_calc_line("15 + 5"))
print(safe_calc_line("10 / 0"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Batch History Formatter',
        starterCode: `# Cell 3 (Step 3): Run safe_calc_line() over a list of expressions
def run_calc_history(expressions):
    # TODO: Return a list of formatted output strings
    return []

print(run_calc_history(["8 * 3", "9 / 3"]))`,
        solutionCode: `# Cell 3 (Step 3): Run safe_calc_line() over a list of expressions
def run_calc_history(expressions):
    return [safe_calc_line(item) for item in expressions]

print(run_calc_history(["8 * 3", "9 / 3"]))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Arithmetic Dispatcher',
        taskInstruction: 'In Cell 1 inside compute(a, op, b), handle +, -, *, and / while raising ValueError if b == 0 on division or op is invalid.',
        targetObjectiveId: '1.4',
        patternTitle: 'Worked Pattern (Guarded Division)',
        patternCode: `if op == "/":
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b`,
        patternExplanation: 'Raising ValueError lets callers handle both bad operators and zero division uniformly.',
        expectedExample: 'compute(10, "+", 5) -> 15',
        diagnosticExpr: 'compute(10, "+", 5)',
        breadcrumbs: {
          level1Concept: 'Check each of the 4 operators and raise ValueError on invalid cases.',
          level2Syntax: 'if op == "+": return a + b\n... raise ValueError("Unsupported operator")',
          level3Scaffold: 'if op == "+": return a + b\nelif op == "-": return a - b\nelif op == "*": return a * b\nelif op == "/":\n    if b == 0: raise ValueError("Cannot divide by zero")\n    return a / b\nraise ValueError("Unsupported")',
        },
        validationSnippet: 'assert compute(10, "+", 5) == 15 and compute(10, "/", 2) == 5.0\ntry:\n    compute(5, "/", 0)\n    assert False\nexcept ValueError:\n    pass',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Parse & Format Calculation',
        taskInstruction: 'In Cell 2 inside safe_calc_line(expr), parse float operands, call compute(), catch ValueError returning f"Error: {err}", and return f"{parts[0]} {parts[1]} {parts[2]} = {round(result, 2)}".',
        targetObjectiveId: '4.6',
        patternTitle: 'Worked Pattern (Safe String Parsing)',
        patternCode: `try:
    result = compute(float(parts[0]), parts[1], float(parts[2]))
except ValueError as err:
    return f"Error: {err}"`,
        patternExplanation: 'Validating token count and numeric conversions keeps invalid input friendly.',
        expectedExample: 'safe_calc_line("15 + 5") -> "15 + 5 = 20.0"',
        diagnosticExpr: 'safe_calc_line("15 + 5")',
        breadcrumbs: {
          level1Concept: 'Convert parts[0] and parts[2] to float, compute, and format with round(result, 2).',
          level2Syntax: 'return f"{parts[0]} {parts[1]} {parts[2]} = {round(result, 2)}"',
          level3Scaffold: 'try:\n    a = float(parts[0])\n    b = float(parts[2])\n    result = compute(a, parts[1], b)\nexcept ValueError as err:\n    return f"Error: {err}"\nreturn f"{parts[0]} {parts[1]} {parts[2]} = {round(result, 2)}"',
        },
        validationSnippet: 'assert safe_calc_line("15 + 5") == "15 + 5 = 20.0" and safe_calc_line("10 / 0").startswith("Error:")',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Batch History Output',
        taskInstruction: 'In Cell 3 inside run_calc_history(expressions), return a list applying safe_calc_line() to each expression.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (List Comprehension Mapping)',
        patternCode: `results = [safe_calc_line(expr) for expr in expressions]`,
        patternExplanation: 'List comprehensions map each expression string to its formatted calculation line.',
        expectedExample: 'run_calc_history(["8 * 3"]) -> ["8 * 3 = 24.0"]',
        diagnosticExpr: 'run_calc_history(["8 * 3"])',
        breadcrumbs: {
          level1Concept: 'Call safe_calc_line(item) for every item in expressions.',
          level2Syntax: 'return [safe_calc_line(item) for item in expressions]',
          level3Scaffold: 'return [safe_calc_line(item) for item in expressions]',
        },
        validationSnippet: 'assert run_calc_history(["8 * 3", "9 / 3"]) == ["8 * 3 = 24.0", "9 / 3 = 3.0"]',
      },
    ],
  },
  {
    id: 'bonus-temperature-converter',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Temperature Converter',
    sectionNumber: 1,
    sectionName: 'Computer Programming & Python Fundamentals',
    examWeightPercentage: 17,
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    specificObjectives: ['1.4', '2.1', '4.1'],
    fileName: 'temperature_converter.py',
    testFileName: 'test_temperature_converter.py',
    keyTip: 'Normalize any input unit ("C", "F", or "K") to Celsius first, then convert from Celsius to the target unit.',
    pitfallWarning: 'Kelvin cannot go below absolute zero (0 K / -273.15 C). Validate unit letters with .upper().',
    description: 'Convert between Celsius, Fahrenheit, and Kelvin with a polished interface.',
    learningOutcomes: [
      'Convert temperatures accurately between C, F, and K',
      'Normalize multi-scale conversions via an intermediate Celsius step',
      'Format clean temperature cards with degree symbols',
    ],
    starterCode: '# Temperature Converter',
    solutionCode: '# Solution: Temperature Converter',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Convert Any Scale to Celsius',
        starterCode: `# Cell 1 (Step 1): Convert value from "C", "F", or "K" into Celsius
def to_celsius(value, unit):
    u = unit.strip().upper()
    # TODO: Return Celsius float rounded to 2 decimals; raise ValueError for unknown unit
    return 0.0

print("212 F -> C:", to_celsius(212, "F"))`,
        solutionCode: `# Cell 1 (Step 1): Convert value from "C", "F", or "K" into Celsius
def to_celsius(value, unit):
    u = unit.strip().upper()
    if u == "C":
        return round(float(value), 2)
    if u == "F":
        return round((float(value) - 32) * 5 / 9, 2)
    if u == "K":
        return round(float(value) - 273.15, 2)
    raise ValueError(f"Unknown unit: {unit}")

print("212 F -> C:", to_celsius(212, "F"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Convert Between Any Two Scales',
        starterCode: `# Cell 2 (Step 2): Convert value from from_unit to to_unit ("C", "F", "K")
def convert_temperature(value, from_unit, to_unit):
    c = to_celsius(value, from_unit)
    target = to_unit.strip().upper()
    # TODO: Convert c to "C", "F" (c * 9 / 5 + 32), or "K" (c + 273.15), rounded to 2 decimals
    return 0.0

print("0 C -> K:", convert_temperature(0, "C", "K"))`,
        solutionCode: `# Cell 2 (Step 2): Convert value from from_unit to to_unit ("C", "F", "K")
def convert_temperature(value, from_unit, to_unit):
    c = to_celsius(value, from_unit)
    target = to_unit.strip().upper()
    if target == "C":
        return round(c, 2)
    if target == "F":
        return round((c * 9 / 5) + 32, 2)
    if target == "K":
        return round(c + 273.15, 2)
    raise ValueError(f"Unknown unit: {to_unit}")

print("0 C -> K:", convert_temperature(0, "C", "K"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Build Polished Summary Card',
        starterCode: `# Cell 3 (Step 3): Format all three scales in one string
def format_temp_summary(value, unit):
    c = convert_temperature(value, unit, "C")
    f = convert_temperature(value, unit, "F")
    k = convert_temperature(value, unit, "K")
    # TODO: Return f"{c:.1f} C | {f:.1f} F | {k:.1f} K"
    return ""

print(format_temp_summary(100, "C"))`,
        solutionCode: `# Cell 3 (Step 3): Format all three scales in one string
def format_temp_summary(value, unit):
    c = convert_temperature(value, unit, "C")
    f = convert_temperature(value, unit, "F")
    k = convert_temperature(value, unit, "K")
    return f"{c:.1f} C | {f:.1f} F | {k:.1f} K"

print(format_temp_summary(100, "C"))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Normalize to Celsius',
        taskInstruction: 'In Cell 1 inside to_celsius(value, unit), support "C", "F" ((value - 32) * 5 / 9), and "K" (value - 273.15), rounded to 2 decimals.',
        targetObjectiveId: '1.4',
        patternTitle: 'Worked Pattern (Fahrenheit & Kelvin to Celsius)',
        patternCode: `if u == "F":
    return round((float(value) - 32) * 5 / 9, 2)`,
        patternExplanation: 'Converting all inputs through Celsius avoids writing 6 separate conversion formulas.',
        expectedExample: 'to_celsius(212, "F") -> 100.0',
        diagnosticExpr: 'to_celsius(212, "F")',
        breadcrumbs: {
          level1Concept: 'Convert F with (v - 32) * 5 / 9 and K with v - 273.15.',
          level2Syntax: 'if u == "F": return round((float(value) - 32) * 5 / 9, 2)',
          level3Scaffold: 'if u == "C": return round(float(value), 2)\nif u == "F": return round((float(value) - 32) * 5 / 9, 2)\nif u == "K": return round(float(value) - 273.15, 2)\nraise ValueError(unit)',
        },
        validationSnippet: 'assert to_celsius(212, "F") == 100.0 and to_celsius(273.15, "K") == 0.0',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Convert Between Any Two Units',
        taskInstruction: 'In Cell 2 inside convert_temperature(value, from_unit, to_unit), convert c to "C", "F", or "K" rounded to 2 decimals.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Celsius to Target Scale)',
        patternCode: `if target == "F":
    return round((c * 9 / 5) + 32, 2)`,
        patternExplanation: 'Once c is in Celsius, converting out to Fahrenheit or Kelvin is a single expression.',
        expectedExample: 'convert_temperature(0, "C", "K") -> 273.15',
        diagnosticExpr: 'convert_temperature(0, "C", "K")',
        breadcrumbs: {
          level1Concept: 'Branch on target == "C", "F", or "K".',
          level2Syntax: 'if target == "F": return round((c * 9 / 5) + 32, 2)',
          level3Scaffold: 'if target == "C": return round(c, 2)\nif target == "F": return round((c * 9 / 5) + 32, 2)\nif target == "K": return round(c + 273.15, 2)',
        },
        validationSnippet: 'assert convert_temperature(0, "C", "F") == 32.0 and convert_temperature(32, "F", "K") == 273.15',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Formatted Multi-Scale Summary',
        taskInstruction: 'In Cell 3 inside format_temp_summary(value, unit), return f"{c:.1f} C | {f:.1f} F | {k:.1f} K".',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Fixed-Decimal Display)',
        patternCode: `return f"{c:.1f} C | {f:.1f} F | {k:.1f} K"`,
        patternExplanation: ':.1f prints one clean decimal digit for every scale.',
        expectedExample: 'format_temp_summary(100, "C") -> "100.0 C | 212.0 F | 373.1 K"',
        diagnosticExpr: 'format_temp_summary(100, "C")',
        breadcrumbs: {
          level1Concept: 'Format c, f, and k using :.1f inside an f-string.',
          level2Syntax: 'return f"{c:.1f} C | {f:.1f} F | {k:.1f} K"',
          level3Scaffold: 'return f"{c:.1f} C | {f:.1f} F | {k:.1f} K"',
        },
        validationSnippet: 'assert format_temp_summary(0, "C") == "0.0 C | 32.0 F | 273.1 K" or format_temp_summary(0, "C") == "0.0 C | 32.0 F | 273.2 K"',
      },
    ],
  },
  {
    id: 'bonus-multiplication-table',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Multiplication Table Generator',
    sectionNumber: 2,
    sectionName: 'Control Flow - Conditional Blocks and Loops',
    examWeightPercentage: 29,
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    specificObjectives: ['2.2', '2.3', '3.9'],
    fileName: 'multiplication_table.py',
    testFileName: 'test_multiplication_table.py',
    keyTip: 'Remember that range(1, limit + 1) includes limit, whereas range(1, limit) stops one short.',
    pitfallWarning: 'Align columns cleanly using width specifiers like f"{val:>3}" so single- and double-digit numbers line up.',
    description: 'Generate formatted multiplication tables for any number.',
    learningOutcomes: [
      'Generate sequential multiples with range(1, limit + 1)',
      'Align multiplication rows using f-string width formatting',
      'Construct 2D multiplication grids with nested loops',
    ],
    starterCode: '# Multiplication Table Generator',
    solutionCode: '# Solution: Multiplication Table Generator',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Generate Formatted Lines for One Number',
        starterCode: `# Cell 1 (Step 1): Build formatted rows "n x i = prod" for i in 1..limit
def build_table_lines(n, limit=10):
    lines = []
    # TODO: Loop i from 1 to limit inclusive and append f"{n} x {i} = {n * i}"
    return lines

print("\\n".join(build_table_lines(7, 3)))`,
        solutionCode: `# Cell 1 (Step 1): Build formatted rows "n x i = prod" for i in 1..limit
def build_table_lines(n, limit=10):
    lines = []
    for i in range(1, limit + 1):
        lines.append(f"{n} x {i} = {n * i}")
    return lines

print("\\n".join(build_table_lines(7, 3)))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Return Product Values as a List',
        starterCode: `# Cell 2 (Step 2): Return the numeric list [n*1, n*2, ..., n*limit]
def multiplication_row(n, limit=10):
    # TODO: Return [n * i for i in range(1, limit + 1)]
    return []

print("5s table:", multiplication_row(5, 5))`,
        solutionCode: `# Cell 2 (Step 2): Return the numeric list [n*1, n*2, ..., n*limit]
def multiplication_row(n, limit=10):
    return [n * i for i in range(1, limit + 1)]

print("5s table:", multiplication_row(5, 5))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Build Nested NxN Grid',
        starterCode: `# Cell 3 (Step 3): Build a 2D multiplication grid of size N x N
def multiplication_grid(size):
    grid = []
    # TODO: Append multiplication_row(row, size) for row in range(1, size + 1)
    return grid

print("3x3 grid:", multiplication_grid(3))`,
        solutionCode: `# Cell 3 (Step 3): Build a 2D multiplication grid of size N x N
def multiplication_grid(size):
    grid = []
    for row in range(1, size + 1):
        grid.append(multiplication_row(row, size))
    return grid

print("3x3 grid:", multiplication_grid(3))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Build Table Lines',
        taskInstruction: 'In Cell 1 inside build_table_lines(n, limit=10), append f"{n} x {i} = {n * i}" for i in range(1, limit + 1).',
        targetObjectiveId: '2.2',
        patternTitle: 'Worked Pattern (Inclusive Range)',
        patternCode: `for i in range(1, limit + 1):
    lines.append(f"{n} x {i} = {n * i}")`,
        patternExplanation: 'Using limit + 1 makes the upper bound inclusive.',
        expectedExample: 'build_table_lines(3, 2) -> ["3 x 1 = 3", "3 x 2 = 6"]',
        diagnosticExpr: 'build_table_lines(3, 2)',
        breadcrumbs: {
          level1Concept: 'Loop range(1, limit + 1) and append the formatted f-string.',
          level2Syntax: 'for i in range(1, limit + 1):\n    lines.append(f"{n} x {i} = {n * i}")',
          level3Scaffold: 'for i in range(1, limit + 1):\n    lines.append(f"{n} x {i} = {n * i}")',
        },
        validationSnippet: 'assert build_table_lines(3, 3) == ["3 x 1 = 3", "3 x 2 = 6", "3 x 3 = 9"]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Numeric Multiples List',
        taskInstruction: 'In Cell 2 inside multiplication_row(n, limit=10), return [n * i for i in range(1, limit + 1)].',
        targetObjectiveId: '2.3',
        patternTitle: 'Worked Pattern (Multiples Comprehension)',
        patternCode: `row = [n * i for i in range(1, limit + 1)]`,
        patternExplanation: 'One list comprehension produces the full sequence cleanly.',
        expectedExample: 'multiplication_row(4, 3) -> [4, 8, 12]',
        diagnosticExpr: 'multiplication_row(4, 3)',
        breadcrumbs: {
          level1Concept: 'Multiply n by each i from 1 to limit.',
          level2Syntax: 'return [n * i for i in range(1, limit + 1)]',
          level3Scaffold: 'return [n * i for i in range(1, limit + 1)]',
        },
        validationSnippet: 'assert multiplication_row(5, 4) == [5, 10, 15, 20]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: 2D Multiplication Grid',
        taskInstruction: 'In Cell 3 inside multiplication_grid(size), loop row in range(1, size + 1) and append multiplication_row(row, size).',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Nested 2D Matrix)',
        patternCode: `for row in range(1, size + 1):
    grid.append(multiplication_row(row, size))`,
        patternExplanation: 'Reusing multiplication_row() keeps the 2D table modular and readable.',
        expectedExample: 'multiplication_grid(2) -> [[1, 2], [2, 4]]',
        diagnosticExpr: 'multiplication_grid(2)',
        breadcrumbs: {
          level1Concept: 'Call multiplication_row(row, size) for each row 1..size.',
          level2Syntax: 'for row in range(1, size + 1):\n    grid.append(multiplication_row(row, size))',
          level3Scaffold: 'for row in range(1, size + 1):\n    grid.append(multiplication_row(row, size))',
        },
        validationSnippet: 'assert multiplication_grid(3) == [[1, 2, 3], [2, 4, 6], [3, 6, 9]]',
      },
    ],
  },
  {
    id: 'bonus-countdown-timer',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Countdown Timer',
    sectionNumber: 2,
    sectionName: 'Control Flow - Conditional Blocks and Loops',
    examWeightPercentage: 29,
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    specificObjectives: ['2.2', '4.2', '5.1'],
    fileName: 'countdown_timer.py',
    testFileName: 'test_countdown_timer.py',
    keyTip: 'Pass delay_sec=0 during automated testing so countdown logic runs instantly without stalling your browser!',
    pitfallWarning: 'In a while current > 0 loop, forgetting to decrement current -= 1 causes an infinite loop.',
    description: 'Accept a starting number and count down to zero with timed pauses.',
    learningOutcomes: [
      'Format seconds into clean MM:SS timer strings',
      'Count down with while loops and optional time.sleep() pauses',
      'Guard negative inputs cleanly with ValueError',
    ],
    starterCode: '# Countdown Timer',
    solutionCode: '# Solution: Countdown Timer',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Import time Module',
        readOnly: true,
        starterCode: `import time`,
        solutionCode: `import time`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Format Seconds as MM:SS',
        starterCode: `# Cell 1 (Step 1): Convert total seconds into "MM:SS"
def format_mm_ss(total_seconds):
    # TODO: Compute mins = total_seconds // 60 and secs = total_seconds % 60
    return ""

print("75 seconds ->", format_mm_ss(75))`,
        solutionCode: `# Cell 1 (Step 1): Convert total seconds into "MM:SS"
def format_mm_ss(total_seconds):
    mins = total_seconds // 60
    secs = total_seconds % 60
    return f"{mins:02d}:{secs:02d}"

print("75 seconds ->", format_mm_ss(75))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Run Countdown Sequence With Timed Pauses',
        starterCode: `# Cell 2 (Step 2): Count down from start to 1, pause delay_sec, and finish with "Time's up!"
def run_countdown(start_seconds, delay_sec=0.0):
    if start_seconds < 0:
        raise ValueError("Start seconds cannot be negative")
    frames = []
    current = start_seconds
    # TODO: While current > 0, append format_mm_ss(current), pause if delay_sec > 0 with time.sleep(delay_sec), decrement current
    # Finally append "Time's up!" and return frames
    return frames

print(run_countdown(3, delay_sec=0.0))`,
        solutionCode: `# Cell 2 (Step 2): Count down from start to 1, pause delay_sec, and finish with "Time's up!"
def run_countdown(start_seconds, delay_sec=0.0):
    if start_seconds < 0:
        raise ValueError("Start seconds cannot be negative")
    frames = []
    current = start_seconds
    while current > 0:
        frames.append(format_mm_ss(current))
        if delay_sec > 0:
            time.sleep(delay_sec)
        current -= 1
    frames.append("Time's up!")
    return frames

print(run_countdown(3, delay_sec=0.0))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Estimate Total Wait Duration',
        starterCode: `# Cell 3 (Step 3): Compute total wait seconds for steps at custom tick delay
def estimate_duration(start_seconds, delay_sec=1.0):
    # TODO: Return round(max(0, start_seconds) * delay_sec, 2)
    return 0.0

print("10 ticks @ 0.5s:", estimate_duration(10, 0.5))`,
        solutionCode: `# Cell 3 (Step 3): Compute total wait seconds for steps at custom tick delay
def estimate_duration(start_seconds, delay_sec=1.0):
    return round(max(0, start_seconds) * delay_sec, 2)

print("10 ticks @ 0.5s:", estimate_duration(10, 0.5))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Format MM:SS Clock Display',
        taskInstruction: 'In Cell 1 inside format_mm_ss(total_seconds), compute mins = total_seconds // 60 and secs = total_seconds % 60, returning f"{mins:02d}:{secs:02d}".',
        targetObjectiveId: '4.2',
        patternTitle: 'Worked Pattern (Seconds to MM:SS)',
        patternCode: `mins = total_seconds // 60
secs = total_seconds % 60
return f"{mins:02d}:{secs:02d}"`,
        patternExplanation: '// extracts whole minutes while % extracts leftover seconds.',
        expectedExample: 'format_mm_ss(75) -> "01:15"',
        diagnosticExpr: 'format_mm_ss(75)',
        breadcrumbs: {
          level1Concept: 'Use // 60 for minutes and % 60 for seconds.',
          level2Syntax: 'return f"{total_seconds // 60:02d}:{total_seconds % 60:02d}"',
          level3Scaffold: 'mins = total_seconds // 60\nsecs = total_seconds % 60\nreturn f"{mins:02d}:{secs:02d}"',
        },
        validationSnippet: 'assert format_mm_ss(75) == "01:15" and format_mm_ss(5) == "00:05"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: While-Loop Countdown with time.sleep()',
        taskInstruction: 'In Cell 2 inside run_countdown(), loop while current > 0: append format_mm_ss(current), call time.sleep(delay_sec) when delay_sec > 0, decrement current, then append "Time\'s up!".',
        targetObjectiveId: '2.2',
        patternTitle: 'Worked Pattern (Countdown While Loop)',
        patternCode: `while current > 0:
    frames.append(format_mm_ss(current))
    if delay_sec > 0:
        time.sleep(delay_sec)
    current -= 1
frames.append("Time's up!")`,
        patternExplanation: 'Parameterizing delay_sec keeps real pauses in production and instant execution in unit tests.',
        expectedExample: 'run_countdown(2) -> ["00:02", "00:01", "Time\'s up!"]',
        diagnosticExpr: 'run_countdown(2, delay_sec=0.0)',
        breadcrumbs: {
          level1Concept: 'Decrement current -= 1 on every iteration until reaching 0.',
          level2Syntax: 'while current > 0:\n    frames.append(format_mm_ss(current))\n    if delay_sec > 0: time.sleep(delay_sec)\n    current -= 1',
          level3Scaffold: 'while current > 0:\n    frames.append(format_mm_ss(current))\n    if delay_sec > 0:\n        time.sleep(delay_sec)\n    current -= 1\nframes.append("Time\'s up!")\nreturn frames',
        },
        validationSnippet: 'assert run_countdown(2, 0.0) == ["00:02", "00:01", "Time\'s up!"] and run_countdown(0, 0.0) == ["Time\'s up!"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Duration Estimator',
        taskInstruction: 'In Cell 3 inside estimate_duration(start_seconds, delay_sec=1.0), return round(max(0, start_seconds) * delay_sec, 2).',
        targetObjectiveId: '5.1',
        patternTitle: 'Worked Pattern (Safe Floor Clamp)',
        patternCode: `return round(max(0, start_seconds) * delay_sec, 2)`,
        patternExplanation: 'max(0, start_seconds) ensures negative counts never produce negative durations.',
        expectedExample: 'estimate_duration(10, 0.5) -> 5.0',
        diagnosticExpr: 'estimate_duration(10, 0.5)',
        breadcrumbs: {
          level1Concept: 'Multiply max(0, start_seconds) by delay_sec and round to 2 decimals.',
          level2Syntax: 'return round(max(0, start_seconds) * delay_sec, 2)',
          level3Scaffold: 'return round(max(0, start_seconds) * delay_sec, 2)',
        },
        validationSnippet: 'assert estimate_duration(10, 0.5) == 5.0 and estimate_duration(-3, 1.0) == 0.0',
      },
    ],
  },
  {
    id: 'bonus-character-counter',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Character Counter',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    specificObjectives: ['3.8', '3.9', '2.2'],
    fileName: 'character_counter.py',
    testFileName: 'test_character_counter.py',
    keyTip: 'Python strings have built-in classifiers: .isalpha(), .isdigit(), and .isspace(). Anything else counts as a symbol.',
    pitfallWarning: 'Check .isalpha(), .isdigit(), and .isspace() with elif so one character never increments two counters.',
    description: 'Count letters, digits, spaces, and symbols in a text input.',
    learningOutcomes: [
      'Classify every character using .isalpha(), .isdigit(), and .isspace()',
      'Store categorized counts inside a dictionary',
      'Calculate percentage breakdown of character classes',
    ],
    starterCode: '# Character Counter',
    solutionCode: '# Solution: Character Counter',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Count Letters, Digits, Spaces & Symbols',
        starterCode: `# Cell 1 (Step 1): Return {"letters": ..., "digits": ..., "spaces": ..., "symbols": ...}
def count_characters(text):
    counts = {"letters": 0, "digits": 0, "spaces": 0, "symbols": 0}
    # TODO: Loop ch in text and classify using .isalpha(), .isdigit(), .isspace(), else symbols
    return counts

print(count_characters("PyCert 30-03!"))`,
        solutionCode: `# Cell 1 (Step 1): Return {"letters": ..., "digits": ..., "spaces": ..., "symbols": ...}
def count_characters(text):
    counts = {"letters": 0, "digits": 0, "spaces": 0, "symbols": 0}
    for ch in text:
        if ch.isalpha():
            counts["letters"] += 1
        elif ch.isdigit():
            counts["digits"] += 1
        elif ch.isspace():
            counts["spaces"] += 1
        else:
            counts["symbols"] += 1
    return counts

print(count_characters("PyCert 30-03!"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Count Vowels vs Consonants',
        starterCode: `# Cell 2 (Step 2): Count vowels and consonants among alphabetic letters
def count_vowels_consonants(text):
    vowels = 0
    consonants = 0
    # TODO: For each ch in text.lower(), if ch.isalpha(): increment vowels if ch in "aeiou" else consonants
    return {"vowels": vowels, "consonants": consonants}

print(count_vowels_consonants("Python"))`,
        solutionCode: `# Cell 2 (Step 2): Count vowels and consonants among alphabetic letters
def count_vowels_consonants(text):
    vowels = 0
    consonants = 0
    for ch in text.lower():
        if ch.isalpha():
            if ch in "aeiou":
                vowels += 1
            else:
                consonants += 1
    return {"vowels": vowels, "consonants": consonants}

print(count_vowels_consonants("Python"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Dominant Character Category Summary',
        starterCode: `# Cell 3 (Step 3): Return formatted report string with total length and top category
def character_report(text):
    counts = count_characters(text)
    if not text:
        return "Empty input (0 chars)"
    # TODO: Find top category using max(counts, key=counts.get) and return f"Total: {len(text)} | Top: {top_cat}"
    return ""

print(character_report("Hello 123"))`,
        solutionCode: `# Cell 3 (Step 3): Return formatted report string with total length and top category
def character_report(text):
    counts = count_characters(text)
    if not text:
        return "Empty input (0 chars)"
    top_cat = max(counts, key=counts.get)
    return f"Total: {len(text)} | Top: {top_cat}"

print(character_report("Hello 123"))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Classify All Characters',
        taskInstruction: 'In Cell 1 inside count_characters(text), loop over each character and increment counts["letters"], "digits", "spaces", or "symbols".',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (String Character Methods)',
        patternCode: `if ch.isalpha(): counts["letters"] += 1
elif ch.isdigit(): counts["digits"] += 1
elif ch.isspace(): counts["spaces"] += 1
else: counts["symbols"] += 1`,
        patternExplanation: 'Mutually exclusive if/elif/else ensures every character increments exactly one bucket.',
        expectedExample: 'count_characters("Ab 1!") -> {"letters": 2, "digits": 1, "spaces": 1, "symbols": 1}',
        diagnosticExpr: 'count_characters("Ab 1!")',
        breadcrumbs: {
          level1Concept: 'Use .isalpha(), .isdigit(), and .isspace() inside a for loop.',
          level2Syntax: 'for ch in text:\n    if ch.isalpha(): counts["letters"] += 1 ...',
          level3Scaffold: 'for ch in text:\n    if ch.isalpha(): counts["letters"] += 1\n    elif ch.isdigit(): counts["digits"] += 1\n    elif ch.isspace(): counts["spaces"] += 1\n    else: counts["symbols"] += 1',
        },
        validationSnippet: 'assert count_characters("Py 30-03!") == {"letters": 2, "digits": 4, "spaces": 1, "symbols": 2}',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Vowels & Consonants',
        taskInstruction: 'In Cell 2 inside count_vowels_consonants(text), lowercase text, check ch.isalpha(), and increment vowels if ch in "aeiou" else consonants.',
        targetObjectiveId: '3.8',
        patternTitle: 'Worked Pattern (Filtering Letters)',
        patternCode: `for ch in text.lower():
    if ch.isalpha():
        if ch in "aeiou": vowels += 1
        else: consonants += 1`,
        patternExplanation: 'Calling ch.isalpha() skips spaces and digits so they are never counted as consonants.',
        expectedExample: 'count_vowels_consonants("Python") -> {"vowels": 1, "consonants": 5}',
        diagnosticExpr: 'count_vowels_consonants("Python")',
        breadcrumbs: {
          level1Concept: 'Convert text with .lower(), filter with .isalpha(), and check ch in "aeiou".',
          level2Syntax: 'if ch.isalpha():\n    if ch in "aeiou": vowels += 1\n    else: consonants += 1',
          level3Scaffold: 'for ch in text.lower():\n    if ch.isalpha():\n        if ch in "aeiou":\n            vowels += 1\n        else:\n            consonants += 1',
        },
        validationSnippet: 'assert count_vowels_consonants("Python 3!") == {"vowels": 1, "consonants": 5}',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Summary Report',
        taskInstruction: 'In Cell 3 inside character_report(text), find top_cat = max(counts, key=counts.get) and return f"Total: {len(text)} | Top: {top_cat}".',
        targetObjectiveId: '2.2',
        patternTitle: 'Worked Pattern (Max Dictionary Key)',
        patternCode: `top_cat = max(counts, key=counts.get)`,
        patternExplanation: 'Passing key=counts.get finds the key whose numeric count is highest.',
        expectedExample: 'character_report("Hello 1") -> "Total: 7 | Top: letters"',
        diagnosticExpr: 'character_report("Hello 1")',
        breadcrumbs: {
          level1Concept: 'Use max(counts, key=counts.get) to get the largest category name.',
          level2Syntax: 'top_cat = max(counts, key=counts.get)\nreturn f"Total: {len(text)} | Top: {top_cat}"',
          level3Scaffold: 'top_cat = max(counts, key=counts.get)\nreturn f"Total: {len(text)} | Top: {top_cat}"',
        },
        validationSnippet: 'assert character_report("Hello 123") == "Total: 9 | Top: letters" and character_report("") == "Empty input (0 chars)"',
      },
    ],
  },
  {
    id: 'bonus-basic-quiz-game',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Basic Quiz Game',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    specificObjectives: ['3.5', '2.2', '4.1'],
    fileName: 'basic_quiz_game.py',
    testFileName: 'test_basic_quiz_game.py',
    keyTip: 'Normalize both the user choice and correct answer with .strip().upper() so "a" and "A" both match.',
    pitfallWarning: 'Avoid dividing by zero in percentage calculations if the question list happens to be empty.',
    description: 'Ask multiple-choice questions and display the final score.',
    learningOutcomes: [
      'Store multiple-choice questions cleanly as dictionaries',
      'Grade user answers case-insensitively with zip()',
      'Display final score and percentage grade tiers',
    ],
    starterCode: '# Basic Quiz Game',
    solutionCode: '# Solution: Basic Quiz Game',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Sample Question Set',
        readOnly: true,
        starterCode: `SAMPLE_QUIZ = [
    {"prompt": "Which keyword defines a function?", "options": ["A) func", "B) def", "C) define"], "answer": "B"},
    {"prompt": "What is 7 // 2 in Python?", "options": ["A) 3.5", "B) 3", "C) 4"], "answer": "B"},
    {"prompt": "Which collection is immutable?", "options": ["A) list", "B) dict", "C) tuple"], "answer": "C"},
]`,
        solutionCode: `SAMPLE_QUIZ = [
    {"prompt": "Which keyword defines a function?", "options": ["A) func", "B) def", "C) define"], "answer": "B"},
    {"prompt": "What is 7 // 2 in Python?", "options": ["A) 3.5", "B) 3", "C) 4"], "answer": "B"},
    {"prompt": "Which collection is immutable?", "options": ["A) list", "B) dict", "C) tuple"], "answer": "C"},
]`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Check One Multiple-Choice Answer',
        starterCode: `# Cell 1 (Step 1): Return True if user_answer matches question["answer"] (case-insensitive)
def check_answer(question, user_answer):
    # TODO: Compare user_answer.strip().upper() == question["answer"].strip().upper()
    return False

print("Q1 with 'b':", check_answer(SAMPLE_QUIZ[0], " b "))`,
        solutionCode: `# Cell 1 (Step 1): Return True if user_answer matches question["answer"] (case-insensitive)
def check_answer(question, user_answer):
    return user_answer.strip().upper() == question["answer"].strip().upper()

print("Q1 with 'b':", check_answer(SAMPLE_QUIZ[0], " b "))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Grade All Submitted Answers',
        starterCode: `# Cell 2 (Step 2): Score a list of questions against a list of user answers
def grade_quiz(questions, answers):
    score = 0
    # TODO: Loop zip(questions, answers), increment score when check_answer(q, ans) is True
    # Return {"score": score, "total": len(questions)}
    return {"score": score, "total": len(questions)}

print(grade_quiz(SAMPLE_QUIZ, ["B", "B", "A"]))`,
        solutionCode: `# Cell 2 (Step 2): Score a list of questions against a list of user answers
def grade_quiz(questions, answers):
    score = 0
    for q, ans in zip(questions, answers):
        if check_answer(q, ans):
            score += 1
    return {"score": score, "total": len(questions)}

print(grade_quiz(SAMPLE_QUIZ, ["B", "B", "A"]))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Display Final Score Banner',
        starterCode: `# Cell 3 (Step 3): Format final score, percentage, and Pass/Retry badge (>=70% passes)
def format_score_banner(result):
    total = result["total"]
    pct = round((result["score"] / total) * 100, 1) if total > 0 else 0.0
    status = "PASS" if pct >= 70.0 else "RETRY"
    # TODO: Return f"Score: {result['score']}/{total} ({pct}%) - {status}"
    return ""

print(format_score_banner({"score": 2, "total": 3}))`,
        solutionCode: `# Cell 3 (Step 3): Format final score, percentage, and Pass/Retry badge (>=70% passes)
def format_score_banner(result):
    total = result["total"]
    pct = round((result["score"] / total) * 100, 1) if total > 0 else 0.0
    status = "PASS" if pct >= 70.0 else "RETRY"
    return f"Score: {result['score']}/{total} ({pct}%) - {status}"

print(format_score_banner({"score": 2, "total": 3}))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Case-Insensitive Answer Check',
        taskInstruction: 'In Cell 1 inside check_answer(question, user_answer), compare user_answer.strip().upper() == question["answer"].strip().upper().',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Normalized Comparison)',
        patternCode: `return user_answer.strip().upper() == question["answer"].strip().upper()`,
        patternExplanation: 'Normalizing whitespace and casing avoids frustrating typos.',
        expectedExample: 'check_answer(SAMPLE_QUIZ[0], " b ") -> True',
        diagnosticExpr: 'check_answer(SAMPLE_QUIZ[0], " b ")',
        breadcrumbs: {
          level1Concept: 'Strip whitespace and uppercase both strings before ==.',
          level2Syntax: 'return user_answer.strip().upper() == question["answer"].strip().upper()',
          level3Scaffold: 'return user_answer.strip().upper() == question["answer"].strip().upper()',
        },
        validationSnippet: 'assert check_answer(SAMPLE_QUIZ[0], "b") is True and check_answer(SAMPLE_QUIZ[0], "A") is False',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Score Entire Quiz with zip()',
        taskInstruction: 'In Cell 2 inside grade_quiz(questions, answers), loop over zip(questions, answers) and increment score for each correct match.',
        targetObjectiveId: '2.2',
        patternTitle: 'Worked Pattern (Pairing Questions & Answers)',
        patternCode: `for q, ans in zip(questions, answers):
    if check_answer(q, ans):
        score += 1`,
        patternExplanation: 'zip() pairs each question dictionary cleanly with its corresponding answer.',
        expectedExample: 'grade_quiz(SAMPLE_QUIZ, ["B", "B", "C"]) -> {"score": 3, "total": 3}',
        diagnosticExpr: 'grade_quiz(SAMPLE_QUIZ, ["B", "B", "C"])',
        breadcrumbs: {
          level1Concept: 'Use zip(questions, answers) and call check_answer(q, ans).',
          level2Syntax: 'for q, ans in zip(questions, answers):\n    if check_answer(q, ans): score += 1',
          level3Scaffold: 'for q, ans in zip(questions, answers):\n    if check_answer(q, ans):\n        score += 1',
        },
        validationSnippet: 'assert grade_quiz(SAMPLE_QUIZ, ["B", "B", "A"]) == {"score": 2, "total": 3}',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Format Score Banner',
        taskInstruction: 'In Cell 3 inside format_score_banner(result), return f"Score: {result[\'score\']}/{total} ({pct}%) - {status}".',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Final Score Display)',
        patternCode: `return f"Score: {result['score']}/{total} ({pct}%) - {status}"`,
        patternExplanation: 'Guard total == 0 so an empty quiz evaluates safely to 0.0%.',
        expectedExample: 'format_score_banner({"score": 3, "total": 3}) -> "Score: 3/3 (100.0%) - PASS"',
        diagnosticExpr: 'format_score_banner({"score": 3, "total": 3})',
        breadcrumbs: {
          level1Concept: 'Return the formatted f-string combining score, total, pct, and status.',
          level2Syntax: 'return f"Score: {result[\'score\']}/{total} ({pct}%) - {status}"',
          level3Scaffold: 'return f"Score: {result[\'score\']}/{total} ({pct}%) - {status}"',
        },
        validationSnippet: 'assert format_score_banner({"score": 3, "total": 3}) == "Score: 3/3 (100.0%) - PASS" and format_score_banner({"score": 1, "total": 3}).endswith("RETRY")',
      },
    ],
  },
  {
    id: 'bonus-palindrome-checker',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Palindrome Checker',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    specificObjectives: ['3.8', '3.9', '4.1'],
    fileName: 'palindrome_checker.py',
    testFileName: 'test_palindrome_checker.py',
    keyTip: 'Clean phrases first by keeping only ch.isalnum() characters converted to lowercase, then compare cleaned == cleaned[::-1].',
    pitfallWarning: 'Without removing spaces and punctuation, classic palindromes like "Race car!" would fail the reverse check.',
    description: 'Check whether a word or phrase reads the same forward and backward.',
    learningOutcomes: [
      'Strip punctuation and spaces using .isalnum() filtering',
      'Reverse strings cleanly via slicing [::-1]',
      'Filter lists of candidate phrases for true palindromes',
    ],
    starterCode: '# Palindrome Checker',
    solutionCode: '# Solution: Palindrome Checker',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Normalize Words & Phrases',
        starterCode: `# Cell 1 (Step 1): Keep only lowercase alphanumeric characters
def normalize_phrase(text):
    # TODO: Return "".join(ch.lower() for ch in text if ch.isalnum())
    return ""

print(normalize_phrase("A man, a plan, a canal: Panama!"))`,
        solutionCode: `# Cell 1 (Step 1): Keep only lowercase alphanumeric characters
def normalize_phrase(text):
    return "".join(ch.lower() for ch in text if ch.isalnum())

print(normalize_phrase("A man, a plan, a canal: Panama!"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Check Palindrome Symmetry',
        starterCode: `# Cell 2 (Step 2): Return True if normalized phrase equals its reverse
def is_palindrome(text):
    cleaned = normalize_phrase(text)
    # TODO: Return bool(cleaned) and cleaned == cleaned[::-1]
    return False

print("Race car! ->", is_palindrome("Race car!"))`,
        solutionCode: `# Cell 2 (Step 2): Return True if normalized phrase equals its reverse
def is_palindrome(text):
    cleaned = normalize_phrase(text)
    return bool(cleaned) and cleaned == cleaned[::-1]

print("Race car! ->", is_palindrome("Race car!"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Filter Palindromes From a List',
        starterCode: `# Cell 3 (Step 3): Return only phrases from candidates that are palindromes
def filter_palindromes(candidates):
    # TODO: Return [item for item in candidates if is_palindrome(item)]
    return []

print(filter_palindromes(["level", "python", "Never odd or even", "hello"]))`,
        solutionCode: `# Cell 3 (Step 3): Return only phrases from candidates that are palindromes
def filter_palindromes(candidates):
    return [item for item in candidates if is_palindrome(item)]

print(filter_palindromes(["level", "python", "Never odd or even", "hello"]))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Strip Punctuation & Case',
        taskInstruction: 'In Cell 1 inside normalize_phrase(text), return "".join(ch.lower() for ch in text if ch.isalnum()).',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Alphanumeric Normalization)',
        patternCode: `cleaned = "".join(ch.lower() for ch in text if ch.isalnum())`,
        patternExplanation: '.isalnum() preserves both letters and digits while ignoring punctuation and spaces.',
        expectedExample: 'normalize_phrase("Race car!") -> "racecar"',
        diagnosticExpr: 'normalize_phrase("Race car!")',
        breadcrumbs: {
          level1Concept: 'Filter characters with ch.isalnum(), lowercase each, and join into a string.',
          level2Syntax: 'return "".join(ch.lower() for ch in text if ch.isalnum())',
          level3Scaffold: 'return "".join(ch.lower() for ch in text if ch.isalnum())',
        },
        validationSnippet: 'assert normalize_phrase("Race car!") == "racecar" and normalize_phrase("123-321") == "123321"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Reverse Slice Comparison',
        taskInstruction: 'In Cell 2 inside is_palindrome(text), return bool(cleaned) and cleaned == cleaned[::-1].',
        targetObjectiveId: '3.8',
        patternTitle: 'Worked Pattern (String Reversal via [::-1])',
        patternCode: `return bool(cleaned) and cleaned == cleaned[::-1]`,
        patternExplanation: 'Step -1 slices a string from end to start cleanly.',
        expectedExample: 'is_palindrome("A man, a plan, a canal: Panama") -> True',
        diagnosticExpr: 'is_palindrome("Race car!")',
        breadcrumbs: {
          level1Concept: 'Compare cleaned with cleaned[::-1] and verify cleaned is non-empty.',
          level2Syntax: 'return bool(cleaned) and cleaned == cleaned[::-1]',
          level3Scaffold: 'return bool(cleaned) and cleaned == cleaned[::-1]',
        },
        validationSnippet: 'assert is_palindrome("Race car!") is True and is_palindrome("Python") is False and is_palindrome("!!!") is False',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Batch Filter Candidates',
        taskInstruction: 'In Cell 3 inside filter_palindromes(candidates), return [item for item in candidates if is_palindrome(item)].',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Predicate Filter)',
        patternCode: `return [item for item in candidates if is_palindrome(item)]`,
        patternExplanation: 'List comprehension keeps original formatting for every passing phrase.',
        expectedExample: 'filter_palindromes(["level", "code"]) -> ["level"]',
        diagnosticExpr: 'filter_palindromes(["level", "code"])',
        breadcrumbs: {
          level1Concept: 'Keep items where is_palindrome(item) returns True.',
          level2Syntax: 'return [item for item in candidates if is_palindrome(item)]',
          level3Scaffold: 'return [item for item in candidates if is_palindrome(item)]',
        },
        validationSnippet: 'assert filter_palindromes(["level", "python", "Never odd or even"]) == ["level", "Never odd or even"]',
      },
    ],
  },
  {
    id: 'bonus-grocery-list-manager',
    bonusNumber: 0,
    tier: 'Easy',
    title: 'Grocery List Manager',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    specificObjectives: ['3.1', '3.2', '4.3'],
    fileName: 'grocery_list_manager.py',
    testFileName: 'test_grocery_list_manager.py',
    keyTip: 'Title-case and strip item names consistently so "apples" and " Apples " are recognized as the same item.',
    pitfallWarning: 'Calling list.remove(item) raises ValueError if the item does not exist — always check if item in cart first.',
    description: 'Let users add, view, remove, and sort shopping items.',
    learningOutcomes: [
      'Prevent duplicate entries when adding shopping items',
      'Safely remove items without triggering ValueError',
      'Sort shopping lists alphabetically with sorted()',
    ],
    starterCode: '# Grocery List Manager',
    solutionCode: '# Solution: Grocery List Manager',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Initialize Grocery List',
        readOnly: true,
        starterCode: `grocery_cart = []`,
        solutionCode: `grocery_cart = []`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Add Normalized Unique Items',
        starterCode: `# Cell 1 (Step 1): Add stripped title-cased item if not already in cart; return True if added
def add_item(cart, item_name):
    cleaned = item_name.strip().title()
    # TODO: If cleaned and cleaned not in cart, append it and return True; else return False
    return False

add_item(grocery_cart, "apples")
add_item(grocery_cart, " bread ")
print("Cart:", grocery_cart)`,
        solutionCode: `# Cell 1 (Step 1): Add stripped title-cased item if not already in cart; return True if added
def add_item(cart, item_name):
    cleaned = item_name.strip().title()
    if cleaned and cleaned not in cart:
        cart.append(cleaned)
        return True
    return False

add_item(grocery_cart, "apples")
add_item(grocery_cart, " bread ")
print("Cart:", grocery_cart)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Safely Remove an Item',
        starterCode: `# Cell 2 (Step 2): Remove normalized item if present and return True, else False
def remove_item(cart, item_name):
    cleaned = item_name.strip().title()
    # TODO: If cleaned in cart: remove it and return True; else return False
    return False

print("Remove Bread:", remove_item(grocery_cart, "bread"), "| Cart:", grocery_cart)`,
        solutionCode: `# Cell 2 (Step 2): Remove normalized item if present and return True, else False
def remove_item(cart, item_name):
    cleaned = item_name.strip().title()
    if cleaned in cart:
        cart.remove(cleaned)
        return True
    return False

print("Remove Bread:", remove_item(grocery_cart, "bread"), "| Cart:", grocery_cart)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Sort & Format Shopping View',
        starterCode: `# Cell 3 (Step 3): Return numbered, alphabetically sorted lines ["1. Apples", ...]
def view_sorted_cart(cart):
    # TODO: Sort with sorted(cart) and format using enumerate(..., start=1)
    return []

add_item(grocery_cart, "Milk")
add_item(grocery_cart, "Bananas")
print(view_sorted_cart(grocery_cart))`,
        solutionCode: `# Cell 3 (Step 3): Return numbered, alphabetically sorted lines ["1. Apples", ...]
def view_sorted_cart(cart):
    return [f"{idx}. {item}" for idx, item in enumerate(sorted(cart), start=1)]

add_item(grocery_cart, "Milk")
add_item(grocery_cart, "Bananas")
print(view_sorted_cart(grocery_cart))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Add Unique Items',
        taskInstruction: 'In Cell 1 inside add_item(cart, item_name), append cleaned if non-empty and not already in cart, returning True if added.',
        targetObjectiveId: '3.1',
        patternTitle: 'Worked Pattern (Deduplicated Append)',
        patternCode: `if cleaned and cleaned not in cart:
    cart.append(cleaned)
    return True`,
        patternExplanation: 'Checking membership before appending avoids duplicate entries cleanly.',
        expectedExample: 'add_item([], "milk") -> True',
        diagnosticExpr: 'add_item([], "milk")',
        breadcrumbs: {
          level1Concept: 'Verify cleaned is truthy and not in cart before appending.',
          level2Syntax: 'if cleaned and cleaned not in cart:\n    cart.append(cleaned)\n    return True',
          level3Scaffold: 'if cleaned and cleaned not in cart:\n    cart.append(cleaned)\n    return True\nreturn False',
        },
        validationSnippet: 'c = []\nassert add_item(c, " eggs ") is True and add_item(c, "EGGS") is False and c == ["Eggs"]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Safe Item Removal',
        taskInstruction: 'In Cell 2 inside remove_item(cart, item_name), check if cleaned in cart before calling cart.remove(cleaned).',
        targetObjectiveId: '3.2',
        patternTitle: 'Worked Pattern (Guarded List Remove)',
        patternCode: `if cleaned in cart:
    cart.remove(cleaned)
    return True`,
        patternExplanation: 'Checking membership avoids ValueError when removing missing items.',
        expectedExample: 'remove_item(["Eggs"], "eggs") -> True',
        diagnosticExpr: 'remove_item(["Eggs"], "eggs")',
        breadcrumbs: {
          level1Concept: 'Check cleaned in cart, then call cart.remove(cleaned) and return True.',
          level2Syntax: 'if cleaned in cart:\n    cart.remove(cleaned)\n    return True\nreturn False',
          level3Scaffold: 'if cleaned in cart:\n    cart.remove(cleaned)\n    return True\nreturn False',
        },
        validationSnippet: 'c = ["Eggs", "Milk"]\nassert remove_item(c, "milk") is True and remove_item(c, "bread") is False and c == ["Eggs"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Sort & Display Items',
        taskInstruction: 'In Cell 3 inside view_sorted_cart(cart), use sorted(cart) and enumerate(..., start=1) to return ["1. ItemA", ...].',
        targetObjectiveId: '4.3',
        patternTitle: 'Worked Pattern (Sorted Numbered View)',
        patternCode: `return [f"{idx}. {item}" for idx, item in enumerate(sorted(cart), start=1)]`,
        patternExplanation: 'sorted() returns a new alphabetically ordered list without mutating the original order if needed.',
        expectedExample: 'view_sorted_cart(["Milk", "Apples"]) -> ["1. Apples", "2. Milk"]',
        diagnosticExpr: 'view_sorted_cart(["Milk", "Apples"])',
        breadcrumbs: {
          level1Concept: 'Loop over enumerate(sorted(cart), start=1) and format "{idx}. {item}".',
          level2Syntax: 'return [f"{idx}. {item}" for idx, item in enumerate(sorted(cart), start=1)]',
          level3Scaffold: 'return [f"{idx}. {item}" for idx, item in enumerate(sorted(cart), start=1)]',
        },
        validationSnippet: 'assert view_sorted_cart(["Milk", "Apples", "Bananas"]) == ["1. Apples", "2. Bananas", "3. Milk"]',
      },
    ],
  },
];
