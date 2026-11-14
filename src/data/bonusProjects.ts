import { BonusProject, BonusTier } from '../types';
import { EASY_CATALOG_PROJECTS } from './bonusCatalogEasy';
import { INTERMEDIATE_CATALOG_PROJECTS } from './bonusCatalogIntermediate';
import { ADVANCED_CATALOG_PROJECTS } from './bonusCatalogAdvanced';
import { HARD_MODE_CATALOG_PROJECTS } from './bonusCatalogHardMode';

const CORE_BONUS_PROJECTS: BonusProject[] = [
  // =========================================================================
  // CORE EASY PROJECTS (4)
  // =========================================================================
  {
    id: 'bonus-digital-clock',
    bonusNumber: 1,
    tier: 'Easy',
    title: 'Digital Clock & World Time Formatter',
    sectionNumber: 1,
    sectionName: 'Computer Programming & Python Fundamentals',
    examWeightPercentage: 17,
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    specificObjectives: ['1.4', '1.6', '3.9'],
    fileName: 'digital_clock.py',
    testFileName: 'test_digital_clock.py',
    keyTip: 'Use :02d inside an f-string (like f"{hour:02d}") to automatically pad single-digit numbers with a leading zero (e.g. 7 becomes "07").',
    pitfallWarning: 'Remember 12-hour clock edge cases: hour 0 (midnight) is 12 AM, and hour 12 (noon) is 12 PM!',
    description: 'Create a Python digital clock engine that formats 24-hour displays, converts to 12-hour AM/PM time, and calculates world timezone offsets cleanly.',
    learningOutcomes: [
      'Zero-pad numbers cleanly with f"{val:02d}"',
      'Convert 24-hour military time to 12-hour AM/PM format',
      'Wrap timezone shifts across midnight using modulo (% 24)',
    ],
    starterCode: `# Bonus Project 1: Digital Clock & World Time Formatter`,
    solutionCode: `# Solution: Digital Clock & World Time Formatter`,
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Format 24-Hour Digital Display',
        starterCode: `# Cell 1 (Step 1): Zero-pad hours, minutes, and seconds into "HH:MM:SS"
def format_24h(hours, minutes, seconds):
    # TODO: Return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
    return ""

clock_24 = format_24h(9, 5, 3)
print("24-hour clock:", clock_24)`,
        solutionCode: `# Cell 1 (Step 1): Zero-pad hours, minutes, and seconds into "HH:MM:SS"
def format_24h(hours, minutes, seconds):
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

clock_24 = format_24h(9, 5, 3)
print("24-hour clock:", clock_24)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Convert to 12-Hour AM/PM Clock',
        starterCode: `# Cell 2 (Step 2): Convert 24-hour time (0-23) to "HH:MM AM/PM"
def to_12h_clock(hours, minutes):
    period = "AM" if hours < 12 else "PM"
    # TODO: Compute display_hour = hours % 12 or 12, then return f"{display_hour:02d}:{minutes:02d} {period}"
    return ""

print("Midnight:", to_12h_clock(0, 15))
print("Afternoon:", to_12h_clock(14, 5))`,
        solutionCode: `# Cell 2 (Step 2): Convert 24-hour time (0-23) to "HH:MM AM/PM"
def to_12h_clock(hours, minutes):
    period = "AM" if hours < 12 else "PM"
    display_hour = hours % 12
    if display_hour == 0:
        display_hour = 12
    return f"{display_hour:02d}:{minutes:02d} {period}"

print("Midnight:", to_12h_clock(0, 15))
print("Afternoon:", to_12h_clock(14, 5))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Shift World Timezones Across Midnight',
        starterCode: `# Cell 3 (Step 3): Shift hour by timezone offset and format with to_12h_clock()
def world_clock(utc_hour, minutes, offset_hours, city_name):
    # TODO: Compute local_hour = (utc_hour + offset_hours) % 24 and return f"{city_name}: {to_12h_clock(local_hour, minutes)}"
    return ""

tokyo_time = world_clock(20, 30, 9, "Tokyo")
ny_time = world_clock(20, 30, -5, "New York")
print(tokyo_time, "|", ny_time)`,
        solutionCode: `# Cell 3 (Step 3): Shift hour by timezone offset and format with to_12h_clock()
def world_clock(utc_hour, minutes, offset_hours, city_name):
    local_hour = (utc_hour + offset_hours) % 24
    return f"{city_name}: {to_12h_clock(local_hour, minutes)}"

tokyo_time = world_clock(20, 30, 9, "Tokyo")
ny_time = world_clock(20, 30, -5, "New York")
print(tokyo_time, "|", ny_time)`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Zero-Pad 24-Hour Time',
        taskInstruction: 'In Cell 1 inside format_24h(hours, minutes, seconds), return f"{hours:02d}:{minutes:02d}:{seconds:02d}".',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Zero-Padding Numbers)',
        patternCode: `month = 4
day = 9
date_str = f"{month:02d}/{day:02d}"  # "04/09"`,
        patternExplanation: ':02d formats an integer to at least 2 digits wide, padding with a leading 0 when needed.',
        expectedExample: 'format_24h(9, 5, 3) -> "09:05:03"',
        diagnosticExpr: 'format_24h(9, 5, 3)',
        breadcrumbs: {
          level1Concept: 'Digital clocks always display two digits per unit (09 instead of 9).',
          level2Syntax: 'return f"{hours:02d}:{minutes:02d}:{seconds:02d}"',
          level3Scaffold: 'def format_24h(hours, minutes, seconds):\n    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"',
        },
        validationSnippet: 'assert format_24h(9, 5, 3) == "09:05:03" and format_24h(23, 59, 0) == "23:59:00"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Convert to 12-Hour AM/PM Format',
        taskInstruction: 'In Cell 2 inside to_12h_clock(hours, minutes), set display_hour = hours % 12 or 12, then return f"{display_hour:02d}:{minutes:02d} {period}".',
        targetObjectiveId: '1.4',
        patternTitle: 'Worked Pattern (Handling 0 and 12 on a 12-Hour Clock)',
        patternCode: `display_hour = hours % 12
if display_hour == 0:
    display_hour = 12  # Turns 0 (midnight) and 12 (noon) into 12`,
        patternExplanation: 'hours % 12 wraps 13..23 down to 1..11, and turns both 0 and 12 into 0, which we replace with 12.',
        expectedExample: 'to_12h_clock(0, 15) -> "12:15 AM"',
        diagnosticExpr: 'to_12h_clock(0, 15)',
        breadcrumbs: {
          level1Concept: '0 % 12 is 0 and 12 % 12 is 0, so replacing 0 with 12 handles both midnight and noon.',
          level2Syntax: 'display_hour = hours % 12 or 12\nreturn f"{display_hour:02d}:{minutes:02d} {period}"',
          level3Scaffold: 'display_hour = hours % 12\nif display_hour == 0:\n    display_hour = 12\nreturn f"{display_hour:02d}:{minutes:02d} {period}"',
        },
        validationSnippet: 'assert to_12h_clock(0, 15) == "12:15 AM" and to_12h_clock(14, 5) == "02:05 PM"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Wrap World Timezones with % 24',
        taskInstruction: 'In Cell 3 inside world_clock(utc_hour, minutes, offset_hours, city_name), compute local_hour = (utc_hour + offset_hours) % 24 and return f"{city_name}: {to_12h_clock(local_hour, minutes)}".',
        targetObjectiveId: '1.6',
        patternTitle: 'Worked Pattern (Wrapping Hours Past Midnight)',
        patternCode: `local_hour = (22 + 5) % 24  # 27 % 24 == 3 AM next day`,
        patternExplanation: 'Because Python modulo % 24 handles both positive overflow (29 -> 5) and negative wrap (-2 -> 22), one formula works for every timezone.',
        expectedExample: 'world_clock(20, 30, 9, "Tokyo") -> "Tokyo: 05:30 AM"',
        diagnosticExpr: 'world_clock(20, 30, 9, "Tokyo")',
        breadcrumbs: {
          level1Concept: 'Cell 3 calls to_12h_clock() from Cell 2 inside the shared notebook kernel.',
          level2Syntax: 'local_hour = (utc_hour + offset_hours) % 24\nreturn f"{city_name}: {to_12h_clock(local_hour, minutes)}"',
          level3Scaffold: 'local_hour = (utc_hour + offset_hours) % 24\nreturn f"{city_name}: {to_12h_clock(local_hour, minutes)}"',
        },
        validationSnippet: 'assert world_clock(20, 30, 9, "Tokyo") == "Tokyo: 05:30 AM" and world_clock(2, 0, -5, "NY") == "NY: 09:00 PM"',
      },
    ],
  },
  {
    id: 'bonus-unit-binary-converter',
    bonusNumber: 2,
    tier: 'Easy',
    title: 'Unit & Binary Code Converter',
    sectionNumber: 1,
    sectionName: 'Computer Programming & Python Fundamentals',
    examWeightPercentage: 17,
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    specificObjectives: ['1.3', '1.6', '3.9'],
    fileName: 'unit_binary_converter.py',
    testFileName: 'test_unit_binary_converter.py',
    keyTip: 'Python converts integers to 8-bit binary with format(num, "08b") and binary strings back to integers with int(bits, 2).',
    pitfallWarning: 'Passing a non-binary digit (like "102") to int(bits, 2) raises a ValueError because base 2 only allows 0 and 1.',
    description: 'Build a multi-purpose converter that translates numbers into 8-bit binary code, decodes binary bytes into ASCII letters, and converts bytes into Megabytes.',
    learningOutcomes: [
      'Encode integers into fixed 8-bit binary strings',
      'Decode base-2 binary strings back to numbers and ASCII characters',
      'Perform clean storage unit conversions (Bytes -> MB)',
    ],
    starterCode: `# Bonus Project 2: Unit & Binary Code Converter`,
    solutionCode: `# Solution: Unit & Binary Code Converter`,
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Decimal to 8-Bit Binary Encoder',
        starterCode: `# Cell 1 (Step 1): Convert an integer (0-255) into an 8-bit binary string
def decimal_to_binary(num):
    # TODO: Return format(int(num), "08b")
    return ""

bin_65 = decimal_to_binary(65)
print("65 in 8-bit binary:", bin_65)`,
        solutionCode: `# Cell 1 (Step 1): Convert an integer (0-255) into an 8-bit binary string
def decimal_to_binary(num):
    return format(int(num), "08b")

bin_65 = decimal_to_binary(65)
print("65 in 8-bit binary:", bin_65)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Binary Code to Text Decoder',
        starterCode: `# Cell 2 (Step 2): Convert a space-separated string of 8-bit bytes into text
def binary_to_text(binary_string):
    letters = []
    for chunk in binary_string.split():
        # TODO: Convert chunk with int(chunk, 2), then chr(...) and append to letters
        pass
    return "".join(letters)

decoded_word = binary_to_text("01010000 01111001")
print("Decoded text:", decoded_word)`,
        solutionCode: `# Cell 2 (Step 2): Convert a space-separated string of 8-bit bytes into text
def binary_to_text(binary_string):
    letters = []
    for chunk in binary_string.split():
        letters.append(chr(int(chunk, 2)))
    return "".join(letters)

decoded_word = binary_to_text("01010000 01111001")
print("Decoded text:", decoded_word)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Bytes to Megabytes Unit Converter',
        starterCode: `# Cell 3 (Step 3): Convert raw bytes into Megabytes (1 MB = 1024 * 1024 bytes)
def bytes_to_mb(byte_count):
    # TODO: Return round(byte_count / (1024 * 1024), 2)
    return 0.0

mb_size = bytes_to_mb(5242880)
print("5,242,880 bytes =", mb_size, "MB")`,
        solutionCode: `# Cell 3 (Step 3): Convert raw bytes into Megabytes (1 MB = 1024 * 1024 bytes)
def bytes_to_mb(byte_count):
    return round(byte_count / (1024 * 1024), 2)

mb_size = bytes_to_mb(5242880)
print("5,242,880 bytes =", mb_size, "MB")`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Encode Integers into 8-Bit Binary',
        taskInstruction: 'In Cell 1 inside decimal_to_binary(num), replace return "" with return format(int(num), "08b").',
        targetObjectiveId: '1.3',
        patternTitle: 'Worked Pattern (Binary Format Specifier)',
        patternCode: `bits = format(5, "08b")  # "00000101"`,
        patternExplanation: 'The format specifier "08b" turns any integer into base-2 binary ("b"), padded to 8 bits with leading zeros ("08").',
        expectedExample: 'decimal_to_binary(65) -> "01000001"',
        diagnosticExpr: 'decimal_to_binary(65)',
        breadcrumbs: {
          level1Concept: '65 in binary is 1000001 (7 bits), so "08b" adds one leading 0 to make a full 8-bit byte.',
          level2Syntax: 'return format(int(num), "08b")',
          level3Scaffold: 'def decimal_to_binary(num):\n    return format(int(num), "08b")',
        },
        validationSnippet: 'assert decimal_to_binary(65) == "01000001" and decimal_to_binary(5) == "00000101"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Decode Binary Bytes into ASCII Text',
        taskInstruction: 'In Cell 2 inside binary_to_text(binary_string), replace pass with letters.append(chr(int(chunk, 2))).',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Base-2 Integer to Character)',
        patternCode: `code = int("01000001", 2)  # 65
char = chr(code)           # "A"`,
        patternExplanation: 'int(chunk, 2) parses binary text using base 2, and chr() turns that number into its ASCII character.',
        expectedExample: 'binary_to_text("01010000 01111001") -> "Py"',
        diagnosticExpr: 'binary_to_text("01010000 01111001")',
        breadcrumbs: {
          level1Concept: 'Pass base 2 as the second argument to int(), then wrap the result in chr().',
          level2Syntax: 'letters.append(chr(int(chunk, 2)))',
          level3Scaffold: 'for chunk in binary_string.split():\n    letters.append(chr(int(chunk, 2)))',
        },
        validationSnippet: 'assert binary_to_text("01010000 01111001") == "Py"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Convert Bytes to Megabytes',
        taskInstruction: 'In Cell 3 inside bytes_to_mb(byte_count), return round(byte_count / (1024 * 1024), 2).',
        targetObjectiveId: '1.6',
        patternTitle: 'Worked Pattern (Binary Storage Units)',
        patternCode: `kb = round(2048 / 1024, 2)  # 2.0 KB`,
        patternExplanation: 'In binary computing, 1 KB = 1024 bytes and 1 MB = 1024 * 1024 bytes (1,048,576).',
        expectedExample: 'bytes_to_mb(5242880) -> 5.0',
        diagnosticExpr: 'bytes_to_mb(5242880)',
        breadcrumbs: {
          level1Concept: 'Divide byte_count by (1024 * 1024) and round to 2 decimal places.',
          level2Syntax: 'return round(byte_count / (1024 * 1024), 2)',
          level3Scaffold: 'def bytes_to_mb(byte_count):\n    return round(byte_count / (1024 * 1024), 2)',
        },
        validationSnippet: 'assert bytes_to_mb(5242880) == 5.0 and bytes_to_mb(1572864) == 1.5',
      },
    ],
  },
  {
    id: 'bonus-tkinter-calculator',
    bonusNumber: 3,
    tier: 'Easy',
    title: 'Desktop Calculator (Tkinter UI & Engine)',
    sectionNumber: 4,
    sectionName: 'Functions & Exceptions',
    examWeightPercentage: 20,
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    specificObjectives: ['2.1', '4.1', '4.6'],
    fileName: 'tkinter_calculator.py',
    testFileName: 'test_tkinter_calculator.py',
    keyTip: 'Keep your calculator math logic separate from Tkinter UI widgets so you can test every button click in Python without launching a desktop window.',
    pitfallWarning: 'Never pass unvalidated user strings straight into eval() in production apps—explicitly match "+", "-", "*", "/" operators.',
    description: 'Build the calculator math engine, button-press state machine, and Tkinter grid blueprint for a desktop GUI calculator.',
    learningOutcomes: [
      'Implement a safe 4-operation arithmetic dispatcher',
      'Manage calculator screen state across button presses',
      'Structure a Tkinter grid layout ready for desktop Python',
    ],
    starterCode: `# Bonus Project 3: Desktop Calculator (Tkinter UI & Engine)`,
    solutionCode: `# Solution: Desktop Calculator (Tkinter UI & Engine)`,
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Safe 4-Operation Math Engine',
        starterCode: `# Cell 1 (Step 1): Calculate a (+, -, *, /) b and guard against divide-by-zero
def calculate(a, op, b):
    # TODO: Handle "+", "-", "*", "/" (if op == "/" and b == 0 return "Error")
    return 0

print("12 * 4 =", calculate(12, "*", 4))
print("10 / 0 =", calculate(10, "/", 0))`,
        solutionCode: `# Cell 1 (Step 1): Calculate a (+, -, *, /) b and guard against divide-by-zero
def calculate(a, op, b):
    if op == "+":
        return a + b
    elif op == "-":
        return a - b
    elif op == "*":
        return a * b
    elif op == "/":
        if b == 0:
            return "Error"
        return round(a / b, 4)
    return "Error"

print("12 * 4 =", calculate(12, "*", 4))
print("10 / 0 =", calculate(10, "/", 0))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Tkinter Button-Press Display Handler',
        starterCode: `# Cell 2 (Step 2): Simulate clicking calculator buttons on a Tkinter Entry screen
def press_key(current_screen, key):
    # TODO: If key == "C", return "0"
    # If current_screen == "0" and key.isdigit(), return key
    # Otherwise return current_screen + key
    return current_screen

screen = "0"
for btn in ["7", "+", "3"]:
    screen = press_key(screen, btn)
print("Screen reads:", screen)`,
        solutionCode: `# Cell 2 (Step 2): Simulate clicking calculator buttons on a Tkinter Entry screen
def press_key(current_screen, key):
    if key == "C":
        return "0"
    if current_screen == "0" and key.isdigit():
        return key
    return current_screen + key

screen = "0"
for btn in ["7", "+", "3"]:
    screen = press_key(screen, btn)
print("Screen reads:", screen)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Build Tkinter Keypad Grid Specification',
        starterCode: `# Cell 3 (Step 3): Map a 4x4 Tkinter calculator keypad into (label, row, col) tuples
KEYPAD_ROWS = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["C", "0", "=", "+"],
]

def build_tkinter_grid(rows):
    placements = []
    # TODO: Loop with enumerate(rows) starting row_idx at 1, and enumerate(row) for col_idx
    # Append (label, row_idx, col_idx) for every button
    return placements

grid_layout = build_tkinter_grid(KEYPAD_ROWS)
print("Total Tkinter buttons positioned:", len(grid_layout))
print("Bottom-right button:", grid_layout[-1] if grid_layout else None)`,
        solutionCode: `# Cell 3 (Step 3): Map a 4x4 Tkinter calculator keypad into (label, row, col) tuples
KEYPAD_ROWS = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["C", "0", "=", "+"],
]

def build_tkinter_grid(rows):
    placements = []
    for row_idx, row in enumerate(rows, start=1):
        for col_idx, label in enumerate(row):
            placements.append((label, row_idx, col_idx))
    return placements

grid_layout = build_tkinter_grid(KEYPAD_ROWS)
print("Total Tkinter buttons positioned:", len(grid_layout))
print("Bottom-right button:", grid_layout[-1] if grid_layout else None)`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Build the Arithmetic Engine',
        taskInstruction: 'In Cell 1 inside calculate(a, op, b), handle "+", "-", "*", and "/" with if/elif, returning "Error" if op == "/" and b == 0.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Safe Operation Switch)',
        patternCode: `if op == "+":
    return a + b
elif op == "/" and b == 0:
    return "Error"`,
        patternExplanation: 'Check b == 0 before dividing so the calculator displays "Error" instead of crashing.',
        expectedExample: 'calculate(12, "*", 4) -> 48 and calculate(10, "/", 0) -> "Error"',
        diagnosticExpr: 'calculate(12, "*", 4)',
        breadcrumbs: {
          level1Concept: 'Use if/elif branches for each math symbol and guard division by zero.',
          level2Syntax: 'if op == "+": return a + b\nelif op == "-": return a - b\nelif op == "*": return a * b\nelif op == "/": return "Error" if b == 0 else round(a / b, 4)',
          level3Scaffold: 'if op == "+":\n    return a + b\nelif op == "-":\n    return a - b\nelif op == "*":\n    return a * b\nelif op == "/":\n    if b == 0:\n        return "Error"\n    return round(a / b, 4)',
        },
        validationSnippet: 'assert calculate(12, "*", 4) == 48 and calculate(10, "/", 0) == "Error" and calculate(9, "-", 4) == 5',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Handle Tkinter Button Presses',
        taskInstruction: 'In Cell 2 inside press_key(current_screen, key), return "0" when key == "C", return key when current_screen == "0" and key.isdigit(), else return current_screen + key.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Replacing Initial Zero)',
        patternCode: `if key == "C":
    return "0"
if current_screen == "0" and key.isdigit():
    return key`,
        patternExplanation: 'Just like a real calculator, typing "7" over the initial "0" shows "7" instead of "07".',
        expectedExample: 'press_key("0", "7") -> "7", press_key("7+", "3") -> "7+3"',
        diagnosticExpr: 'press_key("0", "7")',
        breadcrumbs: {
          level1Concept: 'Check "C" first to clear the screen, then replace leading "0" on digits.',
          level2Syntax: 'if key == "C": return "0"\nif current_screen == "0" and key.isdigit(): return key\nreturn current_screen + key',
          level3Scaffold: 'if key == "C":\n    return "0"\nif current_screen == "0" and key.isdigit():\n    return key\nreturn current_screen + key',
        },
        validationSnippet: 'assert press_key("0", "7") == "7" and press_key("7+", "3") == "7+3" and press_key("99", "C") == "0"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Position Buttons in a Tkinter Grid',
        taskInstruction: 'In Cell 3 inside build_tkinter_grid(rows), loop with enumerate(rows, start=1) and enumerate(row) to append (label, row_idx, col_idx).',
        targetObjectiveId: '2.8',
        patternTitle: 'Worked Pattern (Tkinter .grid() Coordinates)',
        patternCode: `for r, row in enumerate(rows, start=1):
    for c, label in enumerate(row):
        # tk.Button(root, text=label).grid(row=r, column=c)
        placements.append((label, r, c))`,
        patternExplanation: 'Row 0 holds the display Entry box in Tkinter, so buttons start cleanly at row=1, column=0..3.',
        expectedExample: 'len(build_tkinter_grid(KEYPAD_ROWS)) -> 16 and last -> ("+", 4, 3)',
        diagnosticExpr: 'build_tkinter_grid(KEYPAD_ROWS)[-1] if build_tkinter_grid(KEYPAD_ROWS) else None',
        breadcrumbs: {
          level1Concept: 'Use nested loops with enumerate() so each button gets its exact (row, column) position.',
          level2Syntax: 'for row_idx, row in enumerate(rows, start=1):\n    for col_idx, label in enumerate(row):\n        placements.append((label, row_idx, col_idx))',
          level3Scaffold: 'for row_idx, row in enumerate(rows, start=1):\n    for col_idx, label in enumerate(row):\n        placements.append((label, row_idx, col_idx))',
        },
        validationSnippet: 'assert len(build_tkinter_grid(KEYPAD_ROWS)) == 16 and build_tkinter_grid(KEYPAD_ROWS)[-1] == ("+", 4, 3)',
      },
    ],
  },
  {
    id: 'bonus-local-todo',
    bonusNumber: 4,
    tier: 'Easy',
    title: 'Local To-Do List Repository (JSON Storage)',
    sectionNumber: 5,
    sectionName: 'File Handling & Module Imports',
    examWeightPercentage: 14,
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    specificObjectives: ['3.2', '5.1', '5.2'],
    fileName: 'todo_repo.py',
    testFileName: 'test_todo_repo.py',
    keyTip: 'Always use with open(filename, "w") as f: when saving local files so Python closes the file automatically even if an error happens.',
    pitfallWarning: 'Opening a file in "w" mode overwrites existing contents! Always write the entire updated JSON list when saving.',
    description: 'Create a To-Do List repository that manages task priorities and saves/loads entries directly to a local JSON file using Python context managers.',
    learningOutcomes: [
      'Model structured task entries with lists and dictionaries',
      'Toggle task completion status cleanly by ID',
      'Persist and reload data locally with json.dump() and with open()',
    ],
    starterCode: `# Bonus Project 4: Local To-Do List Repository`,
    solutionCode: `# Solution: Local To-Do List Repository`,
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Import json & Initialize Local Task List',
        description: 'Run this setup cell to import the json module and create an empty local_tasks list.',
        starterCode: `# Setup Cell: Local Repository State
import json

local_tasks = []
print("Initialized empty local task repository.")`,
        solutionCode: `# Setup Cell: Local Repository State
import json

local_tasks = []
print("Initialized empty local task repository.")`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Add Task Entries to the Repository',
        starterCode: `# Cell 1 (Step 1): Add a task dictionary {"id": ..., "title": ..., "done": False}
def add_task(repo, title, priority="medium"):
    # TODO: Append {"id": len(repo) + 1, "title": title, "priority": priority, "done": False}
    return repo

add_task(local_tasks, "Study PCEP Domain 3", "high")
add_task(local_tasks, "Push repo to GitHub", "medium")
print("Current tasks:", local_tasks)`,
        solutionCode: `# Cell 1 (Step 1): Add a task dictionary {"id": ..., "title": ..., "done": False}
def add_task(repo, title, priority="medium"):
    entry = {
        "id": len(repo) + 1,
        "title": title,
        "priority": priority,
        "done": False,
    }
    repo.append(entry)
    return repo

add_task(local_tasks, "Study PCEP Domain 3", "high")
add_task(local_tasks, "Push repo to GitHub", "medium")
print("Current tasks:", local_tasks)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Mark a Task Complete by ID',
        starterCode: `# Cell 2 (Step 2): Find task by task_id, set task["done"] = True, and return True (or False if missing)
def complete_task(repo, task_id):
    # TODO: Loop through repo, check if task["id"] == task_id, set done=True, return True
    return False

marked = complete_task(local_tasks, 1)
print("Marked task 1 done?", marked, "->", local_tasks)`,
        solutionCode: `# Cell 2 (Step 2): Find task by task_id, set task["done"] = True, and return True (or False if missing)
def complete_task(repo, task_id):
    for task in repo:
        if task["id"] == task_id:
            task["done"] = True
            return True
    return False

marked = complete_task(local_tasks, 1)
print("Marked task 1 done?", marked, "->", local_tasks)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Save & Load Local JSON Storage File',
        starterCode: `# Cell 3 (Step 3): Write repo to a local JSON file and read it back
def save_tasks_local(repo, filepath="todos.json"):
    # TODO: Use with open(filepath, "w") as f: json.dump(repo, f)
    pass

def load_tasks_local(filepath="todos.json"):
    # TODO: Use with open(filepath, "r") as f: return json.load(f)
    return []

save_tasks_local(local_tasks, "todos.json")
reloaded = load_tasks_local("todos.json")
print("Reloaded from todos.json:", reloaded)`,
        solutionCode: `# Cell 3 (Step 3): Write repo to a local JSON file and read it back
def save_tasks_local(repo, filepath="todos.json"):
    with open(filepath, "w") as f:
        json.dump(repo, f)

def load_tasks_local(filepath="todos.json"):
    with open(filepath, "r") as f:
        return json.load(f)

save_tasks_local(local_tasks, "todos.json")
reloaded = load_tasks_local("todos.json")
print("Reloaded from todos.json:", reloaded)`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Append New Task Dictionaries',
        taskInstruction: 'In Cell 1 inside add_task(repo, title, priority="medium"), append {"id": len(repo) + 1, "title": title, "priority": priority, "done": False} to repo.',
        targetObjectiveId: '3.2',
        patternTitle: 'Worked Pattern (Appending a Record)',
        patternCode: `repo.append({"id": len(repo) + 1, "title": title, "priority": priority, "done": False})`,
        patternExplanation: 'Using len(repo) + 1 gives each new task a sequential numeric ID starting at 1.',
        expectedExample: 'add_task([], "Read", "high")[0]["done"] -> False',
        diagnosticExpr: 'add_task([], "Read", "high")',
        breadcrumbs: {
          level1Concept: 'Create a dictionary with keys "id", "title", "priority", and "done", then append it to repo.',
          level2Syntax: 'repo.append({"id": len(repo) + 1, "title": title, "priority": priority, "done": False})\nreturn repo',
          level3Scaffold: 'def add_task(repo, title, priority="medium"):\n    repo.append({"id": len(repo) + 1, "title": title, "priority": priority, "done": False})\n    return repo',
        },
        validationSnippet: 'assert add_task([], "Test", "high") == [{"id": 1, "title": "Test", "priority": "high", "done": False}]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Complete a Task by ID',
        taskInstruction: 'In Cell 2 inside complete_task(repo, task_id), loop over repo, set task["done"] = True when task["id"] == task_id, and return True.',
        targetObjectiveId: '3.7',
        patternTitle: 'Worked Pattern (Updating a Dict Inside a List)',
        patternCode: `for task in repo:
    if task["id"] == task_id:
        task["done"] = True
        return True`,
        patternExplanation: 'Mutating task["done"] inside the loop updates the dictionary directly inside the repo list.',
        expectedExample: 'complete_task([{"id": 1, "done": False}], 1) -> True',
        diagnosticExpr: 'complete_task([{"id": 1, "done": False}], 1)',
        breadcrumbs: {
          level1Concept: 'Loop through repo, check if task["id"] == task_id, update "done", and return True.',
          level2Syntax: 'for task in repo:\n    if task["id"] == task_id:\n        task["done"] = True\n        return True\nreturn False',
          level3Scaffold: 'for task in repo:\n    if task["id"] == task_id:\n        task["done"] = True\n        return True\nreturn False',
        },
        validationSnippet: 'sample = [{"id": 1, "title": "A", "done": False}]\nassert complete_task(sample, 1) is True and sample[0]["done"] is True',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Persist Locally with json & with open()',
        taskInstruction: 'In Cell 3, implement save_tasks_local() using with open(filepath, "w") as f: json.dump(repo, f) and load_tasks_local() using json.load(f).',
        targetObjectiveId: '5.2',
        patternTitle: 'Worked Pattern (Saving & Loading Local JSON)',
        patternCode: `with open("data.json", "w") as f:
    json.dump(items, f)

with open("data.json", "r") as f:
    loaded = json.load(f)`,
        patternExplanation: 'json.dump() writes Python lists/dicts into a real local JSON file, and json.load() reads them right back into Python objects.',
        expectedExample: 'load_tasks_local("test_todos.json") -> matches saved list',
        diagnosticExpr: 'load_tasks_local("todos.json")',
        breadcrumbs: {
          level1Concept: 'Use "w" mode for writing with json.dump(repo, f), and "r" mode for reading with json.load(f).',
          level2Syntax: 'with open(filepath, "w") as f:\n    json.dump(repo, f)',
          level3Scaffold: 'def save_tasks_local(repo, filepath="todos.json"):\n    with open(filepath, "w") as f:\n        json.dump(repo, f)\n\ndef load_tasks_local(filepath="todos.json"):\n    with open(filepath, "r") as f:\n        return json.load(f)',
        },
        validationSnippet: '_test_data = [{"id": 1, "title": "Verify", "done": True}]\nsave_tasks_local(_test_data, "_verify_todos.json")\nassert load_tasks_local("_verify_todos.json") == _test_data',
      },
    ],
  },

  // =========================================================================
  // INTERMEDIATE PROJECTS (3 — Includes Relocated Lab 6 CLI Cipher!)
  // =========================================================================
  {
    id: 'proj-03b-caesar-cipher',
    bonusNumber: 5,
    tier: 'Intermediate',
    movedFromLab: 'Syllabus Lab 6',
    title: 'CLI Cipher (Caesar Scrambler)',
    sectionNumber: 3,
    sectionName: 'Data Collections — Lists, Tuples, Sets, Dicts & Strings',
    examWeightPercentage: 26,
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    specificObjectives: ['3.1', '3.2', '3.8', '3.9'],
    fileName: 'cli_cipher.py',
    testFileName: 'test_cli_cipher.py',
    keyTip: 'ord() converts a letter to its ASCII number, % 26 wraps Z back around to A, and chr() converts the number back to a letter.',
    pitfallWarning: 'Strings in Python are immutable (text[0] = "X" raises a TypeError). Always append characters into a list and join them once at the end with "".join(result).',
    description: 'Build an interactive CLI Caesar Cipher scrambler that shifts uppercase and lowercase letters cleanly while keeping spaces and punctuation unchanged.',
    learningOutcomes: [
      'Convert letters to numeric codes and back using ord() and chr()',
      'Zero-base letters (0-25) and wrap cleanly using modulo (% 26)',
      'Preserve spaces, digits, and punctuation inside an else branch',
      'Decode messages backward using negative shifts',
    ],
    starterCode: `# Bonus Project: CLI Cipher (Caesar Scrambler)`,
    solutionCode: `# Solution: CLI Cipher (Caesar Scrambler)`,
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Shift Uppercase Letters (A–Z)',
        starterCode: `# Cell 1 (Step 1): Shift uppercase letters using ord(), % 26, and chr()
def caesar_cipher(text, shift):
    result = []
    for char in text:
        if char.isupper():
            base = ord("A")
            # TODO: Replace char with chr((ord(char) - base + shift) % 26 + base)
            new_char = char
            result.append(new_char)
        else:
            result.append(char)
    return "".join(result)

encoded_upper = caesar_cipher("PYTHON", 3)
print("Encoded uppercase:", encoded_upper)`,
        solutionCode: `# Cell 1 (Step 1): Shift uppercase letters using ord(), % 26, and chr()
def caesar_cipher(text, shift):
    result = []
    for char in text:
        if char.isupper():
            base = ord("A")
            new_char = chr((ord(char) - base + shift) % 26 + base)
            result.append(new_char)
        else:
            result.append(char)
    return "".join(result)

encoded_upper = caesar_cipher("PYTHON", 3)
print("Encoded uppercase:", encoded_upper)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Add Lowercase Letters (a–z) & Keep Symbols',
        starterCode: `# Cell 2 (Step 2): Expand caesar_cipher to shift lowercase letters too
def caesar_cipher(text, shift):
    result = []
    for char in text:
        if char.isupper():
            base = ord("A")
            result.append(chr((ord(char) - base + shift) % 26 + base))
        elif char.islower():
            base = ord("a")
            # TODO: Replace char with chr((ord(char) - base + shift) % 26 + base)
            new_char = char
            result.append(new_char)
        else:
            result.append(char)
    return "".join(result)

encoded_mixed = caesar_cipher("Hello, World!", 5)
print("Encoded with punctuation:", encoded_mixed)`,
        solutionCode: `# Cell 2 (Step 2): Expand caesar_cipher to shift lowercase letters too
def caesar_cipher(text, shift):
    result = []
    for char in text:
        if char.isupper():
            base = ord("A")
            result.append(chr((ord(char) - base + shift) % 26 + base))
        elif char.islower():
            base = ord("a")
            new_char = chr((ord(char) - base + shift) % 26 + base)
            result.append(new_char)
        else:
            result.append(char)
    return "".join(result)

encoded_mixed = caesar_cipher("Hello, World!", 5)
print("Encoded with punctuation:", encoded_mixed)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Decode Backward with Negative Shifts',
        starterCode: `# Cell 3 (Step 3): Uses caesar_cipher() from Cell 2 to decode backward!
def decode_cipher(text, shift):
    # TODO: Replace "" by calling caesar_cipher(text, -shift)
    return ""

decoded = decode_cipher("PCEP", 3)
print("Decoded PCEP (shift -3):", decoded)`,
        solutionCode: `# Cell 3 (Step 3): Uses caesar_cipher() from Cell 2 to decode backward!
def decode_cipher(text, shift):
    return caesar_cipher(text, -shift)

decoded = decode_cipher("PCEP", 3)
print("Decoded PCEP (shift -3):", decoded)`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Shift Uppercase Letters (A-Z)',
        taskInstruction: 'In Cell 1 under if char.isupper():, replace new_char = char with new_char = chr((ord(char) - base + shift) % 26 + base).',
        targetObjectiveId: '3.8',
        patternTitle: 'Worked Pattern (Shifting 1 Letter Forward)',
        patternCode: `base = ord("A")                 # 65
pos = ord("Y") - base           # 89 - 65 = 24
wrapped = (pos + 3) % 26        # 27 % 26 = 1
letter = chr(wrapped + base)    # chr(66) = "B"`,
        patternExplanation: 'Subtracting base (65) turns A..Z into 0..25. Modulo % 26 wraps Z back to A, and adding base + chr() turns the index back into a letter.',
        expectedExample: 'caesar_cipher("PYTHON", 3) -> "SBWKRQ"',
        diagnosticExpr: 'caesar_cipher("PYTHON", 3)',
        breadcrumbs: {
          level1Concept: 'Subtracting ord("A") maps A-Z onto 0-25. Taking % 26 wraps numbers >= 26 back around to 0-25 before adding ord("A") again.',
          level2Syntax: 'new_char = chr((ord(char) - base + shift) % 26 + base)',
          level3Scaffold: 'if char.isupper():\n    base = ord("A")\n    new_char = chr((ord(char) - base + shift) % 26 + base)\n    result.append(new_char)',
        },
        validationSnippet: 'assert caesar_cipher("PYTHON", 3) == "SBWKRQ"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Shift Lowercase Letters (a-z) & Keep Symbols',
        taskInstruction: 'In Cell 2 under elif char.islower():, replace new_char = char with new_char = chr((ord(char) - base + shift) % 26 + base).',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Lowercase Base "a" = 97)',
        patternCode: `base = ord("a")                 # 97
pos = ord("z") - base           # 122 - 97 = 25
wrapped = (pos + 2) % 26        # 27 % 26 = 1
letter = chr(wrapped + base)    # chr(98) = "b"`,
        patternExplanation: 'Lowercase letters start at 97 instead of 65, so base = ord("a") keeps lowercase letters lowercase while punctuation goes straight to else.',
        expectedExample: 'caesar_cipher("Hello, World!", 5) -> "Mjqqt, Btwqi!"',
        diagnosticExpr: 'caesar_cipher("Hello, World!", 5)',
        breadcrumbs: {
          level1Concept: 'The formula is identical to Step 1 because base is already set to ord("a") inside the elif branch.',
          level2Syntax: 'elif char.islower():\n    base = ord("a")\n    new_char = chr((ord(char) - base + shift) % 26 + base)\n    result.append(new_char)',
          level3Scaffold: 'elif char.islower():\n    base = ord("a")\n    new_char = chr((ord(char) - base + shift) % 26 + base)\n    result.append(new_char)',
        },
        validationSnippet: 'assert caesar_cipher("Hello, World!", 5) == "Mjqqt, Btwqi!"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Decode Backward with Negative Shifts',
        taskInstruction: 'In Cell 3 inside decode_cipher(text, shift), replace return "" with return caesar_cipher(text, -shift) using the function you defined in Cell 2.',
        targetObjectiveId: '3.1',
        patternTitle: 'Worked Pattern (Reversing a Shift)',
        patternCode: `def decode_word(word, shift):
    return caesar_cipher(word, -shift)
# (-3) % 26 == 23 automatically wraps backward!`,
        patternExplanation: 'Because Python modulo wraps cleanly for 26 (e.g. (-3) % 26 == 23), passing -shift into caesar_cipher() reverses the scramble.',
        expectedExample: 'decode_cipher("PCEP", 3) -> "MZBM"',
        diagnosticExpr: 'decode_cipher("PCEP", 3)',
        breadcrumbs: {
          level1Concept: 'Cell 3 shares the same Python kernel as Cell 2, so decode_cipher can directly call caesar_cipher(text, -shift).',
          level2Syntax: 'return caesar_cipher(text, -shift)',
          level3Scaffold: 'def decode_cipher(text, shift):\n    return caesar_cipher(text, -shift)',
        },
        validationSnippet: 'assert caesar_cipher("PCEP", -3) == "MZBM" and decode_cipher("PCEP", 3) == "MZBM"',
      },
    ],
  },
  {
    id: 'bonus-weather-dashboard',
    bonusNumber: 6,
    tier: 'Intermediate',
    title: 'Weather Dashboard & Forecast Analyzer',
    sectionNumber: 3,
    sectionName: 'Data Collections — Lists, Tuples, Sets, Dicts & Strings',
    examWeightPercentage: 26,
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    specificObjectives: ['2.1', '3.6', '3.9'],
    fileName: 'weather_dashboard.py',
    testFileName: 'test_weather_dashboard.py',
    keyTip: 'Keep weather data parsing (filtering JSON dicts) separate from display formatting so your dashboard stays easy to expand.',
    pitfallWarning: 'Use .get("rain_chance", 0) when reading API-style weather feeds so missing fields never crash your dashboard with a KeyError.',
    description: 'Create a weather dashboard that classifies temperature comfort levels, detects cities with high rain alerts from JSON feeds, and renders formatted forecast cards.',
    learningOutcomes: [
      'Classify numerical temperature ranges with if / elif / else',
      'Filter nested weather feed dictionaries safely with .get()',
      'Render clean multi-metric weather dashboard summary strings',
    ],
    starterCode: `# Bonus Project 6: Weather Dashboard & Forecast Analyzer`,
    solutionCode: `# Solution: Weather Dashboard & Forecast Analyzer`,
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · City Weather JSON Feed',
        description: 'Run this setup cell to load sample city forecast records into `weather_feed`.',
        starterCode: `# Setup Cell: Multi-City Weather API Payload
weather_feed = [
    {"city": "Seattle", "temp_f": 54, "rain_chance": 80, "condition": "Rainy"},
    {"city": "Phoenix", "temp_f": 96, "rain_chance": 5, "condition": "Sunny"},
    {"city": "Denver", "temp_f": 68, "rain_chance": 20, "condition": "Partly Cloudy"},
    {"city": "Miami", "temp_f": 84, "rain_chance": 65, "condition": "Storms"},
]
print("Loaded forecasts for", len(weather_feed), "cities.")`,
        solutionCode: `# Setup Cell: Multi-City Weather API Payload
weather_feed = [
    {"city": "Seattle", "temp_f": 54, "rain_chance": 80, "condition": "Rainy"},
    {"city": "Phoenix", "temp_f": 96, "rain_chance": 5, "condition": "Sunny"},
    {"city": "Denver", "temp_f": 68, "rain_chance": 20, "condition": "Partly Cloudy"},
    {"city": "Miami", "temp_f": 84, "rain_chance": 65, "condition": "Storms"},
]
print("Loaded forecasts for", len(weather_feed), "cities.")`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Classify Temperature Comfort Tiers',
        starterCode: `# Cell 1 (Step 1): Return "Hot" (>=85), "Warm" (>=70), "Mild" (>=50), or "Cold" (<50)
def comfort_tier(temp_f):
    # TODO: Write an if / elif / else chain
    return ""

print("96F is:", comfort_tier(96), "| 54F is:", comfort_tier(54))`,
        solutionCode: `# Cell 1 (Step 1): Return "Hot" (>=85), "Warm" (>=70), "Mild" (>=50), or "Cold" (<50)
def comfort_tier(temp_f):
    if temp_f >= 85:
        return "Hot"
    elif temp_f >= 70:
        return "Warm"
    elif temp_f >= 50:
        return "Mild"
    else:
        return "Cold"

print("96F is:", comfort_tier(96), "| 54F is:", comfort_tier(54))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Detect Rain Advisory Cities',
        starterCode: `# Cell 2 (Step 2): Return a list of city names whose rain_chance >= threshold (default 50)
def get_rain_alerts(feed, threshold=50):
    alerts = []
    # TODO: Loop through feed, check entry.get("rain_chance", 0) >= threshold, append entry["city"]
    return alerts

rain_cities = get_rain_alerts(weather_feed)
print("Umbrella alerts:", rain_cities)`,
        solutionCode: `# Cell 2 (Step 2): Return a list of city names whose rain_chance >= threshold (default 50)
def get_rain_alerts(feed, threshold=50):
    alerts = []
    for entry in feed:
        if entry.get("rain_chance", 0) >= threshold:
            alerts.append(entry["city"])
    return alerts

rain_cities = get_rain_alerts(weather_feed)
print("Umbrella alerts:", rain_cities)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Render Formatted Dashboard Card',
        starterCode: `# Cell 3 (Step 3): Format a weather line like "[SEATTLE] 54F (Mild) | Rain: 80%"
def format_weather_card(entry):
    # TODO: Use entry["city"].upper(), comfort_tier(entry["temp_f"]), and entry.get("rain_chance", 0)
    return ""

for row in weather_feed:
    print(format_weather_card(row))`,
        solutionCode: `# Cell 3 (Step 3): Format a weather line like "[SEATTLE] 54F (Mild) | Rain: 80%"
def format_weather_card(entry):
    city = entry["city"].upper()
    temp = entry["temp_f"]
    tier = comfort_tier(temp)
    rain = entry.get("rain_chance", 0)
    return f"[{city}] {temp}F ({tier}) | Rain: {rain}%"

for row in weather_feed:
    print(format_weather_card(row))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Classify Temperature Comfort Tiers',
        taskInstruction: 'In Cell 1 inside comfort_tier(temp_f), return "Hot" (>= 85), "Warm" (>= 70), "Mild" (>= 50), or "Cold".',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Descending Thresholds)',
        patternCode: `if temp_f >= 85:
    return "Hot"
elif temp_f >= 70:
    return "Warm"`,
        patternExplanation: 'Always check highest thresholds first in an if/elif ladder so 96 triggers >= 85 before >= 70.',
        expectedExample: 'comfort_tier(96) -> "Hot", comfort_tier(54) -> "Mild"',
        diagnosticExpr: 'comfort_tier(96)',
        breadcrumbs: {
          level1Concept: 'Order your conditions from >= 85 down to >= 50, ending with else: return "Cold".',
          level2Syntax: 'if temp_f >= 85: return "Hot"\nelif temp_f >= 70: return "Warm"\nelif temp_f >= 50: return "Mild"\nelse: return "Cold"',
          level3Scaffold: 'if temp_f >= 85:\n    return "Hot"\nelif temp_f >= 70:\n    return "Warm"\nelif temp_f >= 50:\n    return "Mild"\nelse:\n    return "Cold"',
        },
        validationSnippet: 'assert comfort_tier(96) == "Hot" and comfort_tier(75) == "Warm" and comfort_tier(54) == "Mild" and comfort_tier(30) == "Cold"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Detect Rain Advisory Cities',
        taskInstruction: 'In Cell 2 inside get_rain_alerts(feed, threshold=50), loop through feed and append entry["city"] whenever entry.get("rain_chance", 0) >= threshold.',
        targetObjectiveId: '3.6',
        patternTitle: 'Worked Pattern (Filtering API Dictionaries)',
        patternCode: `for item in items:
    if item.get("score", 0) >= limit:
        matches.append(item["name"])`,
        patternExplanation: '.get("rain_chance", 0) safely returns 0 if a weather station omits rain_chance.',
        expectedExample: 'get_rain_alerts(weather_feed) -> ["Seattle", "Miami"]',
        diagnosticExpr: 'get_rain_alerts(weather_feed)',
        breadcrumbs: {
          level1Concept: 'Iterate each dictionary in feed, check rain_chance against threshold, and append the city string.',
          level2Syntax: 'for entry in feed:\n    if entry.get("rain_chance", 0) >= threshold:\n        alerts.append(entry["city"])',
          level3Scaffold: 'for entry in feed:\n    if entry.get("rain_chance", 0) >= threshold:\n        alerts.append(entry["city"])',
        },
        validationSnippet: 'assert get_rain_alerts(weather_feed) == ["Seattle", "Miami"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Render Dashboard Summary Cards',
        taskInstruction: 'In Cell 3 inside format_weather_card(entry), return f"[{city}] {temp}F ({tier}) | Rain: {rain}%" using comfort_tier(temp) from Cell 1.',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Composing Helper Functions)',
        patternCode: `city = entry["city"].upper()
tier = comfort_tier(entry["temp_f"])
return f"[{city}] {entry['temp_f']}F ({tier}) | Rain: {entry.get('rain_chance', 0)}%"`,
        patternExplanation: 'Because comfort_tier() lives in the shared kernel from Cell 1, Cell 3 can call it directly inside the formatter.',
        expectedExample: 'format_weather_card(weather_feed[0]) -> "[SEATTLE] 54F (Mild) | Rain: 80%"',
        diagnosticExpr: 'format_weather_card(weather_feed[0])',
        breadcrumbs: {
          level1Concept: 'Uppercase city with .upper(), compute tier with comfort_tier(), and format all 4 values into the string.',
          level2Syntax: 'return f"[{entry[\'city\'].upper()}] {entry[\'temp_f\']}F ({comfort_tier(entry[\'temp_f\'])}) | Rain: {entry.get(\'rain_chance\', 0)}%"',
          level3Scaffold: 'city = entry["city"].upper()\ntemp = entry["temp_f"]\ntier = comfort_tier(temp)\nrain = entry.get("rain_chance", 0)\nreturn f"[{city}] {temp}F ({tier}) | Rain: {rain}%"',
        },
        validationSnippet: 'assert format_weather_card(weather_feed[0]) == "[SEATTLE] 54F (Mild) | Rain: 80%"',
      },
    ],
  },
  {
    id: 'bonus-text-adventure',
    bonusNumber: 7,
    tier: 'Intermediate',
    title: 'Text-Based Choice Game (Score & Penalties)',
    sectionNumber: 2,
    sectionName: 'Control Flow — Conditional Blocks & Loops',
    examWeightPercentage: 23,
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    specificObjectives: ['2.1', '3.6', '4.2'],
    fileName: 'text_adventure.py',
    testFileName: 'test_text_adventure.py',
    keyTip: 'Store the player state in one dictionary (score, penalties, choices) so every room or decision function cleanly updates and returns the same structure.',
    pitfallWarning: 'Never let penalties drop a player score below 0 unless negative scores are part of your design—clamp with max(0, ...).',
    description: 'Create an interactive text-based adventure game engine that tracks player choices, adds reward points, enforces penalty deductions, and assigns a final rank.',
    learningOutcomes: [
      'Track mutable game state inside a structured player dictionary',
      'Apply rewards and penalties with score clamping',
      'Rank player runs using compound score and penalty rules',
    ],
    starterCode: `# Bonus Project 7: Text-Based Choice Game`,
    solutionCode: `# Solution: Text-Based Choice Game`,
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Initialize Player State & Choice Log',
        starterCode: `# Cell 1 (Step 1): Return initial player dict {"name": name, "score": 100, "penalties": 0, "choices": []}
def create_player(name):
    # TODO: Return the starting player dictionary above
    return {}

hero = create_player("Alex")
print("Player initialized:", hero)`,
        solutionCode: `# Cell 1 (Step 1): Return initial player dict {"name": name, "score": 100, "penalties": 0, "choices": []}
def create_player(name):
    return {
        "name": name,
        "score": 100,
        "penalties": 0,
        "choices": [],
    }

hero = create_player("Alex")
print("Player initialized:", hero)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Record Choices & Apply Score / Penalty Rules',
        starterCode: `# Cell 2 (Step 2): Record choice_label, add points_delta (clamped >= 0), and increment penalties if is_penalty is True
def apply_choice(player, choice_label, points_delta, is_penalty=False):
    # TODO: Append choice_label to player["choices"]
    # Update player["score"] = max(0, player["score"] + points_delta)
    # If is_penalty is True, increment player["penalties"] += 1
    return player

apply_choice(hero, "Open Ancient Map", 25)
apply_choice(hero, "Trigger Spike Trap", -40, is_penalty=True)
print("After 2 turns:", hero)`,
        solutionCode: `# Cell 2 (Step 2): Record choice_label, add points_delta (clamped >= 0), and increment penalties if is_penalty is True
def apply_choice(player, choice_label, points_delta, is_penalty=False):
    player["choices"].append(choice_label)
    player["score"] = max(0, player["score"] + points_delta)
    if is_penalty:
        player["penalties"] += 1
    return player

apply_choice(hero, "Open Ancient Map", 25)
apply_choice(hero, "Trigger Spike Trap", -40, is_penalty=True)
print("After 2 turns:", hero)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Compute Final Adventure Rank',
        starterCode: `# Cell 3 (Step 3): Assign "Master" (score >= 120 and penalties == 0), "Explorer" (score >= 70), else "Survivor"
def final_rank(player):
    # TODO: Return the player's rank string using score and penalties
    return ""

print("Hero rank:", final_rank(hero))`,
        solutionCode: `# Cell 3 (Step 3): Assign "Master" (score >= 120 and penalties == 0), "Explorer" (score >= 70), else "Survivor"
def final_rank(player):
    if player["score"] >= 120 and player["penalties"] == 0:
        return "Master"
    elif player["score"] >= 70:
        return "Explorer"
    else:
        return "Survivor"

print("Hero rank:", final_rank(hero))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Initialize Player State',
        taskInstruction: 'In Cell 1 inside create_player(name), return {"name": name, "score": 100, "penalties": 0, "choices": []}.',
        targetObjectiveId: '3.6',
        patternTitle: 'Worked Pattern (Game State Dictionary)',
        patternCode: `def new_profile(alias):
    return {"name": alias, "score": 100, "penalties": 0, "choices": []}`,
        patternExplanation: 'Starting every player with a fresh empty list for "choices" prevents runs from sharing old logs.',
        expectedExample: 'create_player("Alex") -> {"name": "Alex", "score": 100, "penalties": 0, "choices": []}',
        diagnosticExpr: 'create_player("Alex")',
        breadcrumbs: {
          level1Concept: 'Return a dictionary with the four keys: "name", "score", "penalties", and "choices".',
          level2Syntax: 'return {"name": name, "score": 100, "penalties": 0, "choices": []}',
          level3Scaffold: 'def create_player(name):\n    return {"name": name, "score": 100, "penalties": 0, "choices": []}',
        },
        validationSnippet: 'assert create_player("Alex") == {"name": "Alex", "score": 100, "penalties": 0, "choices": []}',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Apply Choices, Points & Penalties',
        taskInstruction: 'In Cell 2 inside apply_choice(), append choice_label to player["choices"], update player["score"] = max(0, player["score"] + points_delta), and increment player["penalties"] when is_penalty is True.',
        targetObjectiveId: '4.3',
        patternTitle: 'Worked Pattern (Clamping Score at Zero)',
        patternCode: `player["choices"].append(choice_label)
player["score"] = max(0, player["score"] + points_delta)
if is_penalty:
    player["penalties"] += 1`,
        patternExplanation: 'max(0, new_score) guarantees score never goes negative even after a large penalty.',
        expectedExample: 'Score 100 + 25 - 40 -> 85 with penalties == 1',
        diagnosticExpr: 'hero',
        breadcrumbs: {
          level1Concept: 'Append the choice string first, update the clamped score, then check if is_penalty is True.',
          level2Syntax: 'player["choices"].append(choice_label)\nplayer["score"] = max(0, player["score"] + points_delta)\nif is_penalty:\n    player["penalties"] += 1\nreturn player',
          level3Scaffold: 'player["choices"].append(choice_label)\nplayer["score"] = max(0, player["score"] + points_delta)\nif is_penalty:\n    player["penalties"] += 1\nreturn player',
        },
        validationSnippet: '_p = create_player("T")\napply_choice(_p, "A", 20)\napply_choice(_p, "B", -200, is_penalty=True)\nassert _p["score"] == 0 and _p["penalties"] == 1 and _p["choices"] == ["A", "B"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Assign Final Player Rank',
        taskInstruction: 'In Cell 3 inside final_rank(player), return "Master" if score >= 120 and penalties == 0, "Explorer" if score >= 70, else "Survivor".',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Compound Win Condition)',
        patternCode: `if player["score"] >= 120 and player["penalties"] == 0:
    return "Master"`,
        patternExplanation: 'Using `and` requires BOTH high score AND zero penalties to unlock the top rank.',
        expectedExample: 'score=85, penalties=1 -> "Explorer"',
        diagnosticExpr: 'final_rank({"score": 85, "penalties": 1})',
        breadcrumbs: {
          level1Concept: 'Check the zero-penalty "Master" condition first using `and`, then check >= 70.',
          level2Syntax: 'if player["score"] >= 120 and player["penalties"] == 0:\n    return "Master"\nelif player["score"] >= 70:\n    return "Explorer"\nelse:\n    return "Survivor"',
          level3Scaffold: 'if player["score"] >= 120 and player["penalties"] == 0:\n    return "Master"\nelif player["score"] >= 70:\n    return "Explorer"\nelse:\n    return "Survivor"',
        },
        validationSnippet: 'assert final_rank({"score": 130, "penalties": 0}) == "Master" and final_rank({"score": 130, "penalties": 1}) == "Explorer" and final_rank({"score": 40, "penalties": 2}) == "Survivor"',
      },
    ],
  },

  // =========================================================================
  // ADVANCED PROJECTS (4)
  // =========================================================================
  {
    id: 'bonus-digital-sundial',
    bonusNumber: 8,
    tier: 'Advanced',
    title: 'Astronomy Digital Sundial (Solar Position)',
    sectionNumber: 5,
    sectionName: 'File Handling & Module Imports',
    examWeightPercentage: 14,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['1.5', '4.2', '5.5'],
    fileName: 'digital_sundial.py',
    testFileName: 'test_digital_sundial.py',
    keyTip: 'Python trig functions (math.sin, math.cos, math.tan) always expect RADIANS, not degrees! Always wrap degree inputs with math.radians().',
    pitfallWarning: 'Never divide by math.tan(0) when the sun is right on the horizon (elevation <= 0)—return "Night (No shadow)" before dividing.',
    description: 'Calculate solar hour angle, sun elevation for a specific regional latitude, and digital sundial shadow length using Python trigonometry.',
    learningOutcomes: [
      'Convert geographic degrees to radians with math.radians()',
      'Compute solar altitude using sin, cos, and asin',
      'Model real-world physical limits (nighttime horizon cutoff)',
    ],
    starterCode: `# Bonus Project 8: Astronomy Digital Sundial`,
    solutionCode: `# Solution: Astronomy Digital Sundial`,
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Import math & Regional Latitudes',
        description: 'Run this setup cell to load the `math` module and regional observatory latitudes.',
        starterCode: `# Setup Cell: Astronomy Constants
import math

REGIONS = {
    "Phoenix": 33.45,
    "Seattle": 47.61,
    "Equator": 0.0,
}
print("Regions loaded:", REGIONS)`,
        solutionCode: `# Setup Cell: Astronomy Constants
import math

REGIONS = {
    "Phoenix": 33.45,
    "Seattle": 47.61,
    "Equator": 0.0,
}
print("Regions loaded:", REGIONS)`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Compute Solar Hour Angle',
        starterCode: `# Cell 1 (Step 1): Earth rotates 15 degrees per hour; solar noon (12.0) is 0 degrees
def solar_hour_angle(local_hour):
    # TODO: Return (local_hour - 12.0) * 15.0
    return 0.0

print("Hour angle at 10 AM:", solar_hour_angle(10), "| at 3 PM:", solar_hour_angle(15))`,
        solutionCode: `# Cell 1 (Step 1): Earth rotates 15 degrees per hour; solar noon (12.0) is 0 degrees
def solar_hour_angle(local_hour):
    return (local_hour - 12.0) * 15.0

print("Hour angle at 10 AM:", solar_hour_angle(10), "| at 3 PM:", solar_hour_angle(15))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Calculate Sun Elevation Angle by Region',
        starterCode: `# Cell 2 (Step 2): Compute solar elevation in degrees using spherical astronomy
def solar_elevation_deg(latitude_deg, declination_deg, local_hour):
    lat = math.radians(latitude_deg)
    dec = math.radians(declination_deg)
    hra = math.radians(solar_hour_angle(local_hour))
    # TODO: sin_alt = math.sin(lat)*math.sin(dec) + math.cos(lat)*math.cos(dec)*math.cos(hra)
    # Clamp sin_alt to [-1.0, 1.0] and return round(math.degrees(math.asin(sin_alt)), 2)
    return 0.0

equinox_noon = solar_elevation_deg(REGIONS["Phoenix"], 0.0, 12)
print("Phoenix equinox solar noon elevation:", equinox_noon, "deg")`,
        solutionCode: `# Cell 2 (Step 2): Compute solar elevation in degrees using spherical astronomy
def solar_elevation_deg(latitude_deg, declination_deg, local_hour):
    lat = math.radians(latitude_deg)
    dec = math.radians(declination_deg)
    hra = math.radians(solar_hour_angle(local_hour))
    sin_alt = math.sin(lat) * math.sin(dec) + math.cos(lat) * math.cos(dec) * math.cos(hra)
    sin_alt = max(-1.0, min(1.0, sin_alt))
    return round(math.degrees(math.asin(sin_alt)), 2)

equinox_noon = solar_elevation_deg(REGIONS["Phoenix"], 0.0, 12)
print("Phoenix equinox solar noon elevation:", equinox_noon, "deg")`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Compute Sundial Shadow Length',
        starterCode: `# Cell 3 (Step 3): Compute shadow length in meters for a vertical gnomon pole
def sundial_shadow(gnomon_height_m, elevation_deg):
    # TODO: If elevation_deg <= 0, return "Night (No shadow)"
    # Otherwise return round(gnomon_height_m / math.tan(math.radians(elevation_deg)), 2)
    return 0.0

shadow_m = sundial_shadow(1.5, equinox_noon)
print("Shadow length for 1.5m gnomon:", shadow_m, "m")`,
        solutionCode: `# Cell 3 (Step 3): Compute shadow length in meters for a vertical gnomon pole
def sundial_shadow(gnomon_height_m, elevation_deg):
    if elevation_deg <= 0:
        return "Night (No shadow)"
    return round(gnomon_height_m / math.tan(math.radians(elevation_deg)), 2)

shadow_m = sundial_shadow(1.5, equinox_noon)
print("Shadow length for 1.5m gnomon:", shadow_m, "m")`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Solar Hour Angle Formula',
        taskInstruction: 'In Cell 1 inside solar_hour_angle(local_hour), return (local_hour - 12.0) * 15.0.',
        targetObjectiveId: '1.5',
        patternTitle: 'Worked Pattern (15 Degrees Per Hour)',
        patternCode: `# 360 deg / 24 hours = 15 deg per hour
angle = (14 - 12.0) * 15.0  # +30.0 degrees`,
        patternExplanation: 'Solar noon is 0 degrees; morning hours are negative (-15 deg/hr) and afternoon hours are positive (+15 deg/hr).',
        expectedExample: 'solar_hour_angle(10) -> -30.0 and solar_hour_angle(15) -> 45.0',
        diagnosticExpr: 'solar_hour_angle(10)',
        breadcrumbs: {
          level1Concept: 'Subtract 12.0 from local_hour and multiply by 15.0.',
          level2Syntax: 'return (local_hour - 12.0) * 15.0',
          level3Scaffold: 'def solar_hour_angle(local_hour):\n    return (local_hour - 12.0) * 15.0',
        },
        validationSnippet: 'assert solar_hour_angle(12) == 0.0 and solar_hour_angle(10) == -30.0 and solar_hour_angle(15) == 45.0',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Regional Solar Elevation Angle',
        taskInstruction: 'In Cell 2 inside solar_elevation_deg(), compute sin_alt = math.sin(lat)*math.sin(dec) + math.cos(lat)*math.cos(dec)*math.cos(hra) and return round(math.degrees(math.asin(sin_alt)), 2).',
        targetObjectiveId: '5.5',
        patternTitle: 'Worked Pattern (Spherical Sun Altitude)',
        patternCode: `sin_alt = math.sin(lat) * math.sin(dec) + math.cos(lat) * math.cos(dec) * math.cos(hra)
sin_alt = max(-1.0, min(1.0, sin_alt))
return round(math.degrees(math.asin(sin_alt)), 2)`,
        patternExplanation: 'Clamping sin_alt between -1.0 and 1.0 prevents floating-point rounding errors inside math.asin().',
        expectedExample: 'solar_elevation_deg(0.0, 0.0, 12) -> 90.0',
        diagnosticExpr: 'solar_elevation_deg(33.45, 0.0, 12)',
        breadcrumbs: {
          level1Concept: 'Convert lat, dec, and hra using math.radians(), compute sin_alt, then apply math.degrees(math.asin(sin_alt)).',
          level2Syntax: 'sin_alt = math.sin(lat) * math.sin(dec) + math.cos(lat) * math.cos(dec) * math.cos(hra)\nsin_alt = max(-1.0, min(1.0, sin_alt))\nreturn round(math.degrees(math.asin(sin_alt)), 2)',
          level3Scaffold: 'sin_alt = math.sin(lat) * math.sin(dec) + math.cos(lat) * math.cos(dec) * math.cos(hra)\nsin_alt = max(-1.0, min(1.0, sin_alt))\nreturn round(math.degrees(math.asin(sin_alt)), 2)',
        },
        validationSnippet: 'assert solar_elevation_deg(0.0, 0.0, 12) == 90.0 and abs(solar_elevation_deg(33.45, 0.0, 12) - 56.55) < 0.05',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Sundial Shadow Projection',
        taskInstruction: 'In Cell 3 inside sundial_shadow(gnomon_height_m, elevation_deg), return "Night (No shadow)" when elevation_deg <= 0, otherwise return round(gnomon_height_m / math.tan(math.radians(elevation_deg)), 2).',
        targetObjectiveId: '4.2',
        patternTitle: 'Worked Pattern (Trigonometric Shadow Ratio)',
        patternCode: `if elevation_deg <= 0:
    return "Night (No shadow)"
return round(height / math.tan(math.radians(elevation_deg)), 2)`,
        patternExplanation: 'At 45 degrees elevation, math.tan(45 deg) == 1, so a 1.5m sundial pole casts a 1.5m shadow.',
        expectedExample: 'sundial_shadow(1.5, 45) -> 1.5',
        diagnosticExpr: 'sundial_shadow(1.5, 45)',
        breadcrumbs: {
          level1Concept: 'Guard elevation_deg <= 0 first, then divide gnomon_height_m by math.tan(math.radians(elevation_deg)).',
          level2Syntax: 'if elevation_deg <= 0: return "Night (No shadow)"\nreturn round(gnomon_height_m / math.tan(math.radians(elevation_deg)), 2)',
          level3Scaffold: 'if elevation_deg <= 0:\n    return "Night (No shadow)"\nreturn round(gnomon_height_m / math.tan(math.radians(elevation_deg)), 2)',
        },
        validationSnippet: 'assert sundial_shadow(1.5, 45) == 1.5 and sundial_shadow(1.5, -5) == "Night (No shadow)"',
      },
    ],
  },
  {
    id: 'bonus-hobby-blog-api',
    bonusNumber: 9,
    tier: 'Advanced',
    title: 'Hobby Blog Platform (REST API & Integration)',
    sectionNumber: 4,
    sectionName: 'Functions & Exceptions',
    examWeightPercentage: 20,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['3.6', '4.3', '5.4'],
    fileName: 'hobby_blog_api.py',
    testFileName: 'test_hobby_blog_api.py',
    keyTip: 'Generate clean URL slugs using .lower().strip().replace(" ", "-") and return consistent JSON envelopes with status, count, and data keys.',
    pitfallWarning: 'When building API JSON responses, always check if optional filters like category are None before filtering.',
    description: 'Build the Python core of a hobby blog platform featuring URL slug generation, REST-style JSON GET endpoints, and an automated webhook integration payload.',
    learningOutcomes: [
      'Create normalized blog posts with auto-generated URL slugs',
      'Expose a filtered JSON API response endpoint',
      'Build an outbound webhook / RSS integration payload',
    ],
    starterCode: `# Bonus Project 9: Hobby Blog Platform`,
    solutionCode: `# Solution: Hobby Blog Platform`,
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Import json & Initialize Blog Store',
        description: 'Run this setup cell to import json and create the starter hobby blog post store.',
        starterCode: `# Setup Cell: Hobby Blog Store
import json

blog_posts = []
print("Blog store initialized.")`,
        solutionCode: `# Setup Cell: Hobby Blog Store
import json

blog_posts = []
print("Blog store initialized.")`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Publish a Post with Auto-Generated Slug',
        starterCode: `# Cell 1 (Step 1): Create and store a blog post dict with a clean URL slug
def create_post(store, title, category, tags):
    slug = title.lower().strip().replace(" ", "-")
    # TODO: Build post = {"id": len(store) + 1, "title": title, "slug": slug, "category": category, "tags": tags}
    # Append to store and return post
    return {}

p1 = create_post(blog_posts, "Astrophotography Basics", "Space", ["stars", "camera"])
p2 = create_post(blog_posts, "Sourdough Starter Guide", "Baking", ["bread", "ferment"])
print("Published:", p1)`,
        solutionCode: `# Cell 1 (Step 1): Create and store a blog post dict with a clean URL slug
def create_post(store, title, category, tags):
    slug = title.lower().strip().replace(" ", "-")
    post = {
        "id": len(store) + 1,
        "title": title,
        "slug": slug,
        "category": category,
        "tags": tags,
    }
    store.append(post)
    return post

p1 = create_post(blog_posts, "Astrophotography Basics", "Space", ["stars", "camera"])
p2 = create_post(blog_posts, "Sourdough Starter Guide", "Baking", ["bread", "ferment"])
print("Published:", p1)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · REST JSON API Endpoint (GET /posts)',
        starterCode: `# Cell 2 (Step 2): Return JSON string {"status": 200, "count": len(results), "data": results}
def api_get_posts(store, category=None):
    # TODO: Filter store by category if category is not None, then return json.dumps({"status": 200, "count": len(results), "data": results})
    return "{}"

print("API Space posts:", api_get_posts(blog_posts, category="Space"))`,
        solutionCode: `# Cell 2 (Step 2): Return JSON string {"status": 200, "count": len(results), "data": results}
def api_get_posts(store, category=None):
    if category is None:
        results = list(store)
    else:
        results = [p for p in store if p["category"].lower() == category.lower()]
    return json.dumps({"status": 200, "count": len(results), "data": results})

print("API Space posts:", api_get_posts(blog_posts, category="Space"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Build Webhook Integration Payload',
        starterCode: `# Cell 3 (Step 3): Format an integration event dict ready to POST to Discord/Slack/Newsletter
def build_webhook_payload(post, target_channel="newsletter-sync"):
    # TODO: Return {"event": "post.published", "channel": target_channel, "url": f"/blog/{post['slug']}", "title": post["title"]}
    return {}

webhook = build_webhook_payload(p1, "hobby-digest")
print("Integration payload:", webhook)`,
        solutionCode: `# Cell 3 (Step 3): Format an integration event dict ready to POST to Discord/Slack/Newsletter
def build_webhook_payload(post, target_channel="newsletter-sync"):
    return {
        "event": "post.published",
        "channel": target_channel,
        "url": f"/blog/{post['slug']}",
        "title": post["title"],
    }

webhook = build_webhook_payload(p1, "hobby-digest")
print("Integration payload:", webhook)`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Publish a Post with URL Slug',
        taskInstruction: 'In Cell 1 inside create_post(), create the post dictionary with id, title, slug, category, and tags, append it to store, and return post.',
        targetObjectiveId: '3.6',
        patternTitle: 'Worked Pattern (Slug + Record Creation)',
        patternCode: `slug = title.lower().strip().replace(" ", "-")
post = {"id": len(store) + 1, "title": title, "slug": slug, "category": category, "tags": tags}
store.append(post)`,
        patternExplanation: 'Slugs convert spaces and uppercase letters into clean URL paths like "astrophotography-basics".',
        expectedExample: 'create_post([], "My Post", "Art", [])["slug"] -> "my-post"',
        diagnosticExpr: 'create_post([], "My Post", "Art", [])',
        breadcrumbs: {
          level1Concept: 'Build the dictionary, append it to store, and return the new post dictionary.',
          level2Syntax: 'post = {"id": len(store) + 1, "title": title, "slug": slug, "category": category, "tags": tags}\nstore.append(post)\nreturn post',
          level3Scaffold: 'post = {\n    "id": len(store) + 1,\n    "title": title,\n    "slug": slug,\n    "category": category,\n    "tags": tags,\n}\nstore.append(post)\nreturn post',
        },
        validationSnippet: '_s = []\n_res = create_post(_s, "My Hobby", "Tech", ["py"])\nassert _res["slug"] == "my-hobby" and len(_s) == 1',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Implement REST JSON API Endpoint',
        taskInstruction: 'In Cell 2 inside api_get_posts(store, category=None), filter store when category is provided and return json.dumps({"status": 200, "count": len(results), "data": results}).',
        targetObjectiveId: '4.3',
        patternTitle: 'Worked Pattern (REST JSON Envelope)',
        patternCode: `results = list(store) if category is None else [p for p in store if p["category"].lower() == category.lower()]
return json.dumps({"status": 200, "count": len(results), "data": results})`,
        patternExplanation: 'Case-insensitive matching (.lower()) makes the API friendly for URL query strings like ?category=space.',
        expectedExample: 'json.loads(api_get_posts(blog_posts, "Space"))["count"] -> 1',
        diagnosticExpr: 'api_get_posts(blog_posts, category="Space")',
        breadcrumbs: {
          level1Concept: 'Filter with a list comprehension when category is not None, then serialize with json.dumps().',
          level2Syntax: 'results = list(store) if category is None else [p for p in store if p["category"].lower() == category.lower()]\nreturn json.dumps({"status": 200, "count": len(results), "data": results})',
          level3Scaffold: 'if category is None:\n    results = list(store)\nelse:\n    results = [p for p in store if p["category"].lower() == category.lower()]\nreturn json.dumps({"status": 200, "count": len(results), "data": results})',
        },
        validationSnippet: '_st = [{"id": 1, "title": "A", "slug": "a", "category": "Space", "tags": []}]\n_parsed = json.loads(api_get_posts(_st, "space"))\nassert _parsed["status"] == 200 and _parsed["count"] == 1',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Build Webhook Integration Payload',
        taskInstruction: 'In Cell 3 inside build_webhook_payload(post, target_channel="newsletter-sync"), return {"event": "post.published", "channel": target_channel, "url": f"/blog/{post[\'slug\']}", "title": post["title"]}.',
        targetObjectiveId: '5.4',
        patternTitle: 'Worked Pattern (Outbound Webhook Event)',
        patternCode: `return {
    "event": "post.published",
    "channel": target_channel,
    "url": f"/blog/{post['slug']}",
    "title": post["title"],
}`,
        patternExplanation: 'Webhooks notify external apps (newsletters, Discord, RSS) whenever a new post goes live.',
        expectedExample: 'build_webhook_payload({"title": "A", "slug": "a"})["url"] -> "/blog/a"',
        diagnosticExpr: 'build_webhook_payload({"title": "A", "slug": "a"})',
        breadcrumbs: {
          level1Concept: 'Return the 4-key integration payload dict referencing post["slug"] and post["title"].',
          level2Syntax: 'return {"event": "post.published", "channel": target_channel, "url": f"/blog/{post[\'slug\']}", "title": post["title"]}',
          level3Scaffold: 'return {\n    "event": "post.published",\n    "channel": target_channel,\n    "url": f"/blog/{post[\'slug\']}",\n    "title": post["title"],\n}',
        },
        validationSnippet: 'assert build_webhook_payload({"title": "Hi", "slug": "hi"}, "rss") == {"event": "post.published", "channel": "rss", "url": "/blog/hi", "title": "Hi"}',
      },
    ],
  },
  {
    id: 'bonus-ecommerce-backend',
    bonusNumber: 10,
    tier: 'Advanced',
    title: 'E-Commerce Site Backend (Cart & Checkout)',
    sectionNumber: 4,
    sectionName: 'Functions & Exceptions',
    examWeightPercentage: 20,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['3.6', '3.7', '4.2'],
    fileName: 'ecommerce_backend.py',
    testFileName: 'test_ecommerce_backend.py',
    keyTip: 'Always validate stock before adding items to a shopping cart, and always calculate discounts BEFORE sales tax.',
    pitfallWarning: 'Check `qty <= 0` and `sku not in inventory` so invalid client API requests cannot create negative cart totals.',
    description: 'Architect the Python backend for an online store: validate SKU inventory, add items to carts, apply promo discount codes, and generate itemized checkout receipts.',
    learningOutcomes: [
      'Enforce stock limits and SKU existence checks',
      'Apply coupon codes cleanly with dictionary lookups',
      'Deduct inventory and compute tax + grand totals on checkout',
    ],
    starterCode: `# Bonus Project 10: E-Commerce Site Backend`,
    solutionCode: `# Solution: E-Commerce Site Backend`,
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Store Inventory & Empty Cart',
        description: 'Run this cell to load product SKU prices and live stock quantities.',
        starterCode: `# Setup Cell: E-Commerce Inventory Catalog
inventory = {
    "MUG-01": {"name": "Ceramic Mug", "price": 18.00, "stock": 5},
    "TEE-02": {"name": "Python Hoodie", "price": 45.00, "stock": 2},
}
cart = {}
print("Store inventory ready:", inventory)`,
        solutionCode: `# Setup Cell: E-Commerce Inventory Catalog
inventory = {
    "MUG-01": {"name": "Ceramic Mug", "price": 18.00, "stock": 5},
    "TEE-02": {"name": "Python Hoodie", "price": 45.00, "stock": 2},
}
cart = {}
print("Store inventory ready:", inventory)`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Validate Stock & Add Items to Cart',
        starterCode: `# Cell 1 (Step 1): Validate SKU and stock, then add qty to cart[sku]
def add_to_cart(cart, inventory, sku, qty):
    # TODO: If sku not in inventory or qty <= 0, return (False, "Invalid item")
    # If cart.get(sku, 0) + qty > inventory[sku]["stock"], return (False, "Insufficient stock")
    # Otherwise update cart[sku] = cart.get(sku, 0) + qty and return (True, "Added")
    return (False, "Not implemented")

print("Add 2 mugs:", add_to_cart(cart, inventory, "MUG-01", 2))
print("Add 5 hoodies:", add_to_cart(cart, inventory, "TEE-02", 5))`,
        solutionCode: `# Cell 1 (Step 1): Validate SKU and stock, then add qty to cart[sku]
def add_to_cart(cart, inventory, sku, qty):
    if sku not in inventory or qty <= 0:
        return (False, "Invalid item")
    new_qty = cart.get(sku, 0) + qty
    if new_qty > inventory[sku]["stock"]:
        return (False, "Insufficient stock")
    cart[sku] = new_qty
    return (True, "Added")

print("Add 2 mugs:", add_to_cart(cart, inventory, "MUG-01", 2))
print("Add 5 hoodies:", add_to_cart(cart, inventory, "TEE-02", 5))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Apply Promo Discount Codes',
        starterCode: `# Cell 2 (Step 2): Support "SAVE10" (10% off) and "VIP20" (20% off)
PROMO_RATES = {"SAVE10": 0.10, "VIP20": 0.20}

def apply_promo(subtotal, code):
    # TODO: Look up rate = PROMO_RATES.get(code.upper(), 0.0) and return round(subtotal * (1 - rate), 2)
    return subtotal

print("$100 with SAVE10:", apply_promo(100.0, "SAVE10"))`,
        solutionCode: `# Cell 2 (Step 2): Support "SAVE10" (10% off) and "VIP20" (20% off)
PROMO_RATES = {"SAVE10": 0.10, "VIP20": 0.20}

def apply_promo(subtotal, code):
    rate = PROMO_RATES.get(code.upper(), 0.0) if code else 0.0
    return round(subtotal * (1.0 - rate), 2)

print("$100 with SAVE10:", apply_promo(100.0, "SAVE10"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Complete Checkout & Deduct Stock',
        starterCode: `# Cell 3 (Step 3): Compute subtotal, discounted total, tax, grand total, and deduct stock
def checkout_order(cart, inventory, promo_code="", tax_rate=0.08):
    subtotal = sum(inventory[sku]["price"] * qty for sku, qty in cart.items())
    # TODO: Compute discounted = apply_promo(subtotal, promo_code), tax = round(discounted * tax_rate, 2)
    # Deduct inventory[sku]["stock"] -= qty for each item in cart, then return receipt dict
    return {"subtotal": 0.0, "discounted": 0.0, "tax": 0.0, "total": 0.0}

receipt = checkout_order(cart, inventory, promo_code="SAVE10", tax_rate=0.08)
print("Checkout receipt:", receipt)
print("Remaining mug stock:", inventory["MUG-01"]["stock"])`,
        solutionCode: `# Cell 3 (Step 3): Compute subtotal, discounted total, tax, grand total, and deduct stock
def checkout_order(cart, inventory, promo_code="", tax_rate=0.08):
    subtotal = round(sum(inventory[sku]["price"] * qty for sku, qty in cart.items()), 2)
    discounted = apply_promo(subtotal, promo_code)
    tax = round(discounted * tax_rate, 2)
    total = round(discounted + tax, 2)
    for sku, qty in cart.items():
        inventory[sku]["stock"] -= qty
    return {
        "subtotal": subtotal,
        "discounted": discounted,
        "tax": tax,
        "total": total,
    }

receipt = checkout_order(cart, inventory, promo_code="SAVE10", tax_rate=0.08)
print("Checkout receipt:", receipt)
print("Remaining mug stock:", inventory["MUG-01"]["stock"])`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Validate Stock & Update Cart',
        taskInstruction: 'In Cell 1 inside add_to_cart(), reject invalid SKUs/quantities, reject over-stock requests, otherwise set cart[sku] and return (True, "Added").',
        targetObjectiveId: '3.7',
        patternTitle: 'Worked Pattern (Safe Cart Stock Guard)',
        patternCode: `new_qty = cart.get(sku, 0) + qty
if new_qty > inventory[sku]["stock"]:
    return (False, "Insufficient stock")
cart[sku] = new_qty`,
        patternExplanation: 'Adding to cart.get(sku, 0) ensures adding an item twice still respects total available warehouse stock.',
        expectedExample: 'add_to_cart({}, inventory, "MUG-01", 2) -> (True, "Added")',
        diagnosticExpr: 'add_to_cart({}, inventory, "MUG-01", 2)',
        breadcrumbs: {
          level1Concept: 'Check sku in inventory and qty > 0 first, then verify cart.get(sku, 0) + qty <= stock.',
          level2Syntax: 'if sku not in inventory or qty <= 0: return (False, "Invalid item")\nnew_qty = cart.get(sku, 0) + qty\nif new_qty > inventory[sku]["stock"]: return (False, "Insufficient stock")\ncart[sku] = new_qty\nreturn (True, "Added")',
          level3Scaffold: 'if sku not in inventory or qty <= 0:\n    return (False, "Invalid item")\nnew_qty = cart.get(sku, 0) + qty\nif new_qty > inventory[sku]["stock"]:\n    return (False, "Insufficient stock")\ncart[sku] = new_qty\nreturn (True, "Added")',
        },
        validationSnippet: '_c = {}\nassert add_to_cart(_c, inventory, "MUG-01", 2) == (True, "Added") and add_to_cart(_c, inventory, "TEE-02", 99) == (False, "Insufficient stock")',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Apply Promo Discount Codes',
        taskInstruction: 'In Cell 2 inside apply_promo(subtotal, code), look up PROMO_RATES.get(code.upper(), 0.0) and return round(subtotal * (1.0 - rate), 2).',
        targetObjectiveId: '3.6',
        patternTitle: 'Worked Pattern (Dictionary Discount Lookup)',
        patternCode: `rate = PROMO_RATES.get(code.upper(), 0.0)
return round(subtotal * (1.0 - rate), 2)`,
        patternExplanation: 'PROMO_RATES.get(..., 0.0) prevents unknown coupon codes from throwing a KeyError.',
        expectedExample: 'apply_promo(100.0, "SAVE10") -> 90.0',
        diagnosticExpr: 'apply_promo(100.0, "SAVE10")',
        breadcrumbs: {
          level1Concept: 'Guard empty code strings, uppercase the code, look up the rate, and multiply subtotal by (1 - rate).',
          level2Syntax: 'rate = PROMO_RATES.get(code.upper(), 0.0) if code else 0.0\nreturn round(subtotal * (1.0 - rate), 2)',
          level3Scaffold: 'rate = PROMO_RATES.get(code.upper(), 0.0) if code else 0.0\nreturn round(subtotal * (1.0 - rate), 2)',
        },
        validationSnippet: 'assert apply_promo(100.0, "SAVE10") == 90.0 and apply_promo(100.0, "VIP20") == 80.0 and apply_promo(50.0, "NONE") == 50.0',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Checkout Receipt & Stock Deduction',
        taskInstruction: 'In Cell 3 inside checkout_order(), calculate discounted = apply_promo(subtotal, promo_code), tax = round(discounted * tax_rate, 2), deduct stock, and return the receipt dict.',
        targetObjectiveId: '4.2',
        patternTitle: 'Worked Pattern (Order Checkout Pipeline)',
        patternCode: `discounted = apply_promo(subtotal, promo_code)
tax = round(discounted * tax_rate, 2)
total = round(discounted + tax, 2)`,
        patternExplanation: 'Rounding money values to 2 decimal places at each step avoids floating-point cents drift.',
        expectedExample: '2 mugs ($36) with SAVE10 + 8% tax -> total 34.99',
        diagnosticExpr: 'checkout_order({"MUG-01": 1}, {"MUG-01": {"price": 100.0, "stock": 5}}, "SAVE10", 0.08)',
        breadcrumbs: {
          level1Concept: 'Call apply_promo() from Cell 2, compute tax and total, loop over cart to subtract stock, and return the 4-key dict.',
          level2Syntax: 'discounted = apply_promo(subtotal, promo_code)\ntax = round(discounted * tax_rate, 2)\ntotal = round(discounted + tax, 2)',
          level3Scaffold: 'discounted = apply_promo(subtotal, promo_code)\ntax = round(discounted * tax_rate, 2)\ntotal = round(discounted + tax, 2)\nfor sku, qty in cart.items():\n    inventory[sku]["stock"] -= qty\nreturn {"subtotal": round(subtotal, 2), "discounted": discounted, "tax": tax, "total": total}',
        },
        validationSnippet: '_inv = {"X": {"price": 100.0, "stock": 5}}\n_r = checkout_order({"X": 1}, _inv, "SAVE10", 0.08)\nassert _r == {"subtotal": 100.0, "discounted": 90.0, "tax": 7.2, "total": 97.2} and _inv["X"]["stock"] == 4',
      },
    ],
  },
  {
    id: 'bonus-vibe-algorithm',
    bonusNumber: 11,
    tier: 'Advanced',
    title: '"Is It a Vibe?" Consumer Data Algorithm',
    sectionNumber: 3,
    sectionName: 'Data Collections — Lists, Tuples, Sets, Dicts & Strings',
    examWeightPercentage: 26,
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    specificObjectives: ['2.1', '3.2', '4.3'],
    fileName: 'vibe_algorithm.py',
    testFileName: 'test_vibe_algorithm.py',
    keyTip: 'Weighted scoring models combine normalized signals (0.0 to 1.0) multiplied by weights that add up to 100, then check hard minimum guardrails.',
    pitfallWarning: 'A high weighted average can hide a fatal flaw (like terrible user sentiment)! Pair your total score threshold with minimum safety thresholds.',
    description: 'Design a consumer-data scoring algorithm that evaluates product ideas across engagement, positive sentiment, share velocity, and budget fit to decide whether an idea is "A vibe."',
    learningOutcomes: [
      'Implement a multi-factor weighted consumer scoring function',
      'Combine total score thresholds with non-negotiable criteria guardrails',
      'Rank and filter consumer product ideas from highest vibe score down',
    ],
    starterCode: `# Bonus Project 11: "Is It a Vibe?" Consumer Data Algorithm`,
    solutionCode: `# Solution: "Is It a Vibe?" Consumer Data Algorithm`,
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Consumer Idea Testing Dataset',
        description: 'Run this cell to load normalized consumer survey metrics (0.0 to 1.0) for candidate product ideas.',
        starterCode: `# Setup Cell: Consumer Market Data (Metrics normalized 0.0 to 1.0)
ideas_dataset = [
    {"name": "Solar Backpack", "engagement": 0.88, "sentiment": 0.84, "shares": 0.75, "budget_fit": 0.80},
    {"name": "Neon Toothbrush", "engagement": 0.90, "sentiment": 0.45, "shares": 0.85, "budget_fit": 0.90},
    {"name": "Pocket Espresso", "engagement": 0.78, "sentiment": 0.82, "shares": 0.70, "budget_fit": 0.76},
]
print("Loaded", len(ideas_dataset), "consumer product ideas.")`,
        solutionCode: `# Setup Cell: Consumer Market Data (Metrics normalized 0.0 to 1.0)
ideas_dataset = [
    {"name": "Solar Backpack", "engagement": 0.88, "sentiment": 0.84, "shares": 0.75, "budget_fit": 0.80},
    {"name": "Neon Toothbrush", "engagement": 0.90, "sentiment": 0.45, "shares": 0.85, "budget_fit": 0.90},
    {"name": "Pocket Espresso", "engagement": 0.78, "sentiment": 0.82, "shares": 0.70, "budget_fit": 0.76},
]
print("Loaded", len(ideas_dataset), "consumer product ideas.")`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Weighted Consumer Vibe Score (0–100)',
        starterCode: `# Cell 1 (Step 1): Weighted sum: engagement*35 + sentiment*30 + shares*20 + budget_fit*15
def compute_vibe_score(metrics):
    # TODO: Compute weighted score using the weights above, rounded to 1 decimal
    return 0.0

for idea in ideas_dataset:
    print(idea["name"], "-> score:", compute_vibe_score(idea))`,
        solutionCode: `# Cell 1 (Step 1): Weighted sum: engagement*35 + sentiment*30 + shares*20 + budget_fit*15
def compute_vibe_score(metrics):
    score = (
        metrics["engagement"] * 35
        + metrics["sentiment"] * 30
        + metrics["shares"] * 20
        + metrics["budget_fit"] * 15
    )
    return round(score, 1)

for idea in ideas_dataset:
    print(idea["name"], "-> score:", compute_vibe_score(idea))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Apply "A vibe." Decision Criteria',
        starterCode: `# Cell 2 (Step 2): Return "A vibe." only if compute_vibe_score >= min_score AND sentiment >= min_sentiment
def judge_vibe(metrics, min_score=75.0, min_sentiment=0.70):
    # TODO: Use compute_vibe_score(metrics) and metrics["sentiment"] to decide
    return ""

for idea in ideas_dataset:
    print(idea["name"], "->", judge_vibe(idea))`,
        solutionCode: `# Cell 2 (Step 2): Return "A vibe." only if compute_vibe_score >= min_score AND sentiment >= min_sentiment
def judge_vibe(metrics, min_score=75.0, min_sentiment=0.70):
    score = compute_vibe_score(metrics)
    if score >= min_score and metrics["sentiment"] >= min_sentiment:
        return "A vibe."
    return "Not quite a vibe."

for idea in ideas_dataset:
    print(idea["name"], "->", judge_vibe(idea))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Filter & Rank Winning Consumer Ideas',
        starterCode: `# Cell 3 (Step 3): Return list of (name, score) tuples for ideas judged "A vibe.", sorted highest score first
def rank_winning_vibes(dataset):
    winners = []
    # TODO: Loop through dataset, check if judge_vibe(item) == "A vibe.", append (item["name"], compute_vibe_score(item))
    # Sort winners descending by score and return
    return winners

ranked = rank_winning_vibes(ideas_dataset)
print("Ranked winning ideas:", ranked)`,
        solutionCode: `# Cell 3 (Step 3): Return list of (name, score) tuples for ideas judged "A vibe.", sorted highest score first
def rank_winning_vibes(dataset):
    winners = []
    for item in dataset:
        if judge_vibe(item) == "A vibe.":
            winners.append((item["name"], compute_vibe_score(item)))
    winners.sort(key=lambda pair: pair[1], reverse=True)
    return winners

ranked = rank_winning_vibes(ideas_dataset)
print("Ranked winning ideas:", ranked)`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Compute Weighted Consumer Score',
        taskInstruction: 'In Cell 1 inside compute_vibe_score(metrics), return round(metrics["engagement"] * 35 + metrics["sentiment"] * 30 + metrics["shares"] * 20 + metrics["budget_fit"] * 15, 1).',
        targetObjectiveId: '1.5',
        patternTitle: 'Worked Pattern (Weighted Consumer Index)',
        patternCode: `score = metrics["engagement"] * 35 + metrics["sentiment"] * 30 + metrics["shares"] * 20 + metrics["budget_fit"] * 15
return round(score, 1)`,
        patternExplanation: 'Since 35 + 30 + 20 + 15 = 100 and each metric is 0.0..1.0, the final score naturally sits on a 0 to 100 scale.',
        expectedExample: 'Solar Backpack -> 83.0',
        diagnosticExpr: 'compute_vibe_score(ideas_dataset[0])',
        breadcrumbs: {
          level1Concept: 'Multiply each of the 4 metric keys by its weight (35, 30, 20, 15) and round to 1 decimal.',
          level2Syntax: 'return round(metrics["engagement"] * 35 + metrics["sentiment"] * 30 + metrics["shares"] * 20 + metrics["budget_fit"] * 15, 1)',
          level3Scaffold: 'score = (\n    metrics["engagement"] * 35\n    + metrics["sentiment"] * 30\n    + metrics["shares"] * 20\n    + metrics["budget_fit"] * 15\n)\nreturn round(score, 1)',
        },
        validationSnippet: 'assert compute_vibe_score({"engagement": 1.0, "sentiment": 1.0, "shares": 1.0, "budget_fit": 1.0}) == 100.0 and compute_vibe_score(ideas_dataset[0]) == 83.0',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Apply "A vibe." Guardrails',
        taskInstruction: 'In Cell 2 inside judge_vibe(metrics, min_score=75.0, min_sentiment=0.70), return "A vibe." only when compute_vibe_score(metrics) >= min_score and metrics["sentiment"] >= min_sentiment; otherwise return "Not quite a vibe.".',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Score + Sentiment Guardrail)',
        patternCode: `if compute_vibe_score(metrics) >= min_score and metrics["sentiment"] >= min_sentiment:
    return "A vibe."
return "Not quite a vibe."`,
        patternExplanation: 'Notice Neon Toothbrush scores 75.5 overall, yet fails the sentiment guardrail (0.45 < 0.70) so it does NOT falsely pass!',
        expectedExample: 'Solar Backpack -> "A vibe.", Neon Toothbrush -> "Not quite a vibe."',
        diagnosticExpr: 'judge_vibe(ideas_dataset[1])',
        breadcrumbs: {
          level1Concept: 'Use `and` so both the weighted score and minimum positive sentiment must pass.',
          level2Syntax: 'if compute_vibe_score(metrics) >= min_score and metrics["sentiment"] >= min_sentiment:\n    return "A vibe."\nreturn "Not quite a vibe."',
          level3Scaffold: 'score = compute_vibe_score(metrics)\nif score >= min_score and metrics["sentiment"] >= min_sentiment:\n    return "A vibe."\nreturn "Not quite a vibe."',
        },
        validationSnippet: 'assert judge_vibe(ideas_dataset[0]) == "A vibe." and judge_vibe(ideas_dataset[1]) == "Not quite a vibe."',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Filter & Rank Winning Ideas',
        taskInstruction: 'In Cell 3 inside rank_winning_vibes(dataset), collect (item["name"], compute_vibe_score(item)) for every item returning "A vibe.", sort descending by score, and return the list.',
        targetObjectiveId: '3.2',
        patternTitle: 'Worked Pattern (Sorting Tuples Descending)',
        patternCode: `winners.sort(key=lambda pair: pair[1], reverse=True)`,
        patternExplanation: 'key=lambda pair: pair[1] tells Python to sort by the numeric score (index 1) rather than alphabetically by name.',
        expectedExample: 'rank_winning_vibes(ideas_dataset) -> [("Solar Backpack", 83.0), ("Pocket Espresso", 77.3)]',
        diagnosticExpr: 'rank_winning_vibes(ideas_dataset)',
        breadcrumbs: {
          level1Concept: 'Filter using judge_vibe(item) == "A vibe.", append tuples, and sort with reverse=True.',
          level2Syntax: 'for item in dataset:\n    if judge_vibe(item) == "A vibe.":\n        winners.append((item["name"], compute_vibe_score(item)))\nwinners.sort(key=lambda pair: pair[1], reverse=True)',
          level3Scaffold: 'for item in dataset:\n    if judge_vibe(item) == "A vibe.":\n        winners.append((item["name"], compute_vibe_score(item)))\nwinners.sort(key=lambda pair: pair[1], reverse=True)\nreturn winners',
        },
        validationSnippet: 'assert rank_winning_vibes(ideas_dataset) == [("Solar Backpack", 83.0), ("Pocket Espresso", 77.3)]',
      },
    ],
  },
];

const TIER_ORDER: BonusTier[] = [
  'Easy',
  'Intermediate',
  'Advanced',
  'Cerebral Conquest (Hard Mode)',
];

const ALL_UNNUMBERED: BonusProject[] = [
  ...CORE_BONUS_PROJECTS,
  ...EASY_CATALOG_PROJECTS,
  ...INTERMEDIATE_CATALOG_PROJECTS,
  ...ADVANCED_CATALOG_PROJECTS,
  ...HARD_MODE_CATALOG_PROJECTS,
];

export const BONUS_PROJECTS: BonusProject[] = TIER_ORDER.flatMap((tier) =>
  ALL_UNNUMBERED.filter((proj) => proj.tier === tier)
).map((proj, index) => ({
  ...proj,
  bonusNumber: index + 1,
}));

