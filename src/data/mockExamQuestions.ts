import { QuizQuestion } from '../types';

export const PRACTICE_EXAM_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // DOMAIN 1: Computer Programming & Python Fundamentals (10 Questions)
  // =========================================================================
  {
    id: 'q-1',
    pcepSection: 1,
    pcepObjective: '1.5',
    question: 'What is the output of the following Python snippet?',
    codeSnippet: 'x = 2 ** 3 ** 2\nprint(x)',
    options: ['64', '512', '36', 'SyntaxError'],
    correctIndex: 1,
    explanation:
      'The exponentiation operator (**) binds from right to left (right-associative). Therefore, 2 ** 3 ** 2 is evaluated as 2 ** (3 ** 2) = 2 ** 9 = 512.',
  },
  {
    id: 'q-2',
    pcepSection: 1,
    pcepObjective: '1.6',
    question: 'What is the output of the following print statement?',
    codeSnippet: 'print("A", "B", "C", sep="#", end="*")\nprint("D")',
    options: ['A#B#C*D', 'A B C\\n#*D', 'A#B#C\\n*D', 'A#B#C*\\nD'],
    correctIndex: 0,
    explanation:
      'sep="#" places "#" between "A", "B", and "C". end="*" prevents a newline and places "*" immediately at the end. The subsequent print("D") follows right on the same line.',
  },
  {
    id: 'q-1-3',
    pcepSection: 1,
    pcepObjective: '1.1',
    question: 'In standard CPython execution, what role does a .pyc file serve?',
    codeSnippet: '',
    options: [
      'It stores native machine code linked directly to the OS kernel',
      'It caches compiled Python bytecode so the Python Virtual Machine can skip re-parsing unchanged modules',
      'It holds PEP 8 formatting rules for the interpreter',
      'It encrypts source code into an executable binary',
    ],
    correctIndex: 1,
    explanation:
      'CPython compiles .py source files into platform-independent bytecode (.pyc) inside __pycache__, which is then executed by the Python Virtual Machine (PVM).',
  },
  {
    id: 'q-1-4',
    pcepSection: 1,
    pcepObjective: '1.2',
    question: 'Which of the following is NOT a valid Python identifier for a variable name?',
    codeSnippet: '',
    options: ['_total_2', 'userAge', '2nd_value', 'break_count'],
    correctIndex: 2,
    explanation:
      'Python identifiers must begin with a letter (a-z, A-Z) or an underscore (_). Starting an identifier with a digit like 2nd_value causes a SyntaxError. Note that break_count is valid because only the exact keyword "break" is reserved.',
  },
  {
    id: 'q-1-5',
    pcepSection: 1,
    pcepObjective: '1.3',
    question: 'What is printed when this code runs?',
    codeSnippet: 'a = 1_000\nb = 2e2\nprint(type(a).__name__, type(b).__name__, a + b)',
    options: [
      'int int 1200',
      'int float 1200.0',
      'str float 1000200.0',
      'SyntaxError',
    ],
    correctIndex: 1,
    explanation:
      'Underscores in numeric literals (1_000) are visual separators yielding an int (1000). Scientific notation (2e2) always produces a float (200.0), and int + float evaluates to float (1200.0).',
  },
  {
    id: 'q-1-6',
    pcepSection: 1,
    pcepObjective: '1.4',
    question: 'What is the output of these floor division and modulo operations?',
    codeSnippet: 'print(-7 // 2, -7 % 2)',
    options: ['-3 -1', '-4 1', '-3 1', '-4 -1'],
    correctIndex: 1,
    explanation:
      'Python floor division (//) always rounds toward negative infinity: -7 / 2 = -3.5, which floors to -4. Modulo satisfies a == (a // b) * b + (a % b), so -7 == (-4 * 2) + 1, giving 1.',
  },
  {
    id: 'q-1-7',
    pcepSection: 1,
    pcepObjective: '1.4',
    question: 'What does the following boolean/logical expression print?',
    codeSnippet: 'x = 0 or "Python" and 42\nprint(x)',
    options: ['True', 'False', '42', '"Python"'],
    correctIndex: 2,
    explanation:
      'Operator precedence evaluates "and" before "or". "Python" and 42 evaluates both truthy values and returns the last value (42). Then 0 or 42 returns the first truthy operand, 42.',
  },
  {
    id: 'q-1-8',
    pcepSection: 1,
    pcepObjective: '1.5',
    question: 'What is the output of comparing unary negation with exponentiation?',
    codeSnippet: 'print(-2 ** 4, (-2) ** 4)',
    options: ['16 16', '-16 16', '-16 -16', '16 -16'],
    correctIndex: 1,
    explanation:
      'Exponentiation (**) has higher precedence than unary negation (-). Therefore -2 ** 4 parses as -(2 ** 4) = -16, while (-2) ** 4 raises -2 to the 4th power = 16.',
  },
  {
    id: 'q-1-9',
    pcepSection: 1,
    pcepObjective: '1.3',
    question: 'What does the following type-mixing and casting snippet output?',
    codeSnippet: 'print(True + True + False, int("010"), bool("False"))',
    options: ['2 10 False', 'True 10 True', '2 10 True', 'TypeError'],
    correctIndex: 2,
    explanation:
      'bool is a subclass of int where True == 1 and False == 0, so True + True + False == 2. int("010") parses base-10 integer 10. Any non-empty string, including "False", is truthy in bool().',
  },
  {
    id: 'q-1-10',
    pcepSection: 1,
    pcepObjective: '1.6',
    question: 'If the user types 15 and presses Enter at the prompt, what is printed?',
    codeSnippet: 'val = input("Enter a number: ")\nprint(val * 2)',
    options: ['30', '1515', '15 15', 'TypeError'],
    correctIndex: 1,
    explanation:
      'input() always returns a str regardless of whether the user enters digits. Multiplying the string "15" by 2 repeats it twice, producing "1515".',
  },

  // =========================================================================
  // DOMAIN 2: Control Flow — Conditional Blocks & Loops (10 Questions)
  // =========================================================================
  {
    id: 'q-3',
    pcepSection: 2,
    pcepObjective: '2.1',
    question: 'Which of the following values evaluates to False in a boolean context in Python?',
    codeSnippet: '',
    options: ['"False"', '[-1]', '()', '{"key": False}'],
    correctIndex: 2,
    explanation:
      'An empty tuple () is falsy. Non-empty strings (including "False") and non-empty collections (even containing False or -1) evaluate to True.',
  },
  {
    id: 'q-4',
    pcepSection: 2,
    pcepObjective: '2.6',
    question: 'What will be printed by this code?',
    codeSnippet: 'total = 0\nfor i in range(1, 10, 3):\n    total += i\nprint(total)',
    options: ['12', '22', '15', '18'],
    correctIndex: 0,
    explanation:
      'range(1, 10, 3) yields 1, 4, 7. 1 + 4 + 7 = 12 (10 is excluded by the exclusive stop boundary).',
  },
  {
    id: 'q-2-3',
    pcepSection: 2,
    pcepObjective: '2.1',
    question: 'What will be printed by this conditional cascade?',
    codeSnippet:
      'score = 85\nif score >= 60:\n    grade = "D"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "F"\nprint(grade)',
    options: ['B', 'D', 'F', 'DB'],
    correctIndex: 1,
    explanation:
      'Python evaluates if-elif-else top to bottom and executes only the first matching branch. Since 85 >= 60 is True, grade is set to "D" and subsequent elif blocks are skipped.',
  },
  {
    id: 'q-2-4',
    pcepSection: 2,
    pcepObjective: '2.2',
    question: 'What is the output of this while...else loop?',
    codeSnippet: 'n = 3\nwhile n > 0:\n    n -= 1\nelse:\n    n = 99\nprint(n)',
    options: ['0', '-1', '99', '3'],
    correctIndex: 2,
    explanation:
      'A loop else clause runs whenever the loop terminates normally (its condition becomes False without encountering a break statement). After n reaches 0, the else branch sets n = 99.',
  },
  {
    id: 'q-2-5',
    pcepSection: 2,
    pcepObjective: '2.7',
    question: 'What is printed when break interrupts a for...else loop?',
    codeSnippet:
      'for x in [2, 4, 6, 8]:\n    if x == 6:\n        break\nelse:\n    x = 0\nprint(x)',
    options: ['0', '6', '8', '2'],
    correctIndex: 1,
    explanation:
      'When break executes at x == 6, it exits the loop immediately and skips the loop else clause. Therefore x remains 6.',
  },
  {
    id: 'q-2-6',
    pcepSection: 2,
    pcepObjective: '2.4',
    question: 'What does this snippet using the walrus operator (:=) output?',
    codeSnippet:
      'items = [10, 20, 30]\nif (count := len(items)) > 2:\n    print(count * 2)',
    options: ['3', '6', 'True', 'SyntaxError'],
    correctIndex: 1,
    explanation:
      'The assignment expression (count := len(items)) assigns 3 to count and returns 3. Since 3 > 2 is True, it prints count * 2 = 6.',
  },
  {
    id: 'q-2-7',
    pcepSection: 2,
    pcepObjective: '2.6',
    question: 'What list is produced by this negative-step range() call?',
    codeSnippet: 'print(list(range(5, 0, -2)))',
    options: ['[5, 3, 1]', '[5, 3, 1, -1]', '[5, 4, 3, 2, 1]', '[]'],
    correctIndex: 0,
    explanation:
      'range(5, 0, -2) starts at 5 and decrements by 2 while values remain strictly greater than stop (0). It yields 5, 3, 1.',
  },
  {
    id: 'q-2-8',
    pcepSection: 2,
    pcepObjective: '2.7',
    question: 'What is the final value of total printed by this loop?',
    codeSnippet:
      'total = 0\nfor i in range(5):\n    if i % 2 == 0:\n        continue\n    total += i\nprint(total)',
    options: ['6', '4', '10', '1'],
    correctIndex: 1,
    explanation:
      'continue skips the rest of the current iteration when i is even (0, 2, 4). Only odd values (1 and 3) reach total += i, giving 1 + 3 = 4.',
  },
  {
    id: 'q-2-9',
    pcepSection: 2,
    pcepObjective: '2.8',
    question: 'What is the output when pass is used inside the conditional block?',
    codeSnippet:
      'res = []\nfor i in range(3):\n    if i == 1:\n        pass\n    res.append(i)\nprint(res)',
    options: ['[0, 2]', '[0, 1, 2]', '[0]', '[1]'],
    correctIndex: 1,
    explanation:
      'pass is a syntactical null placeholder—it performs no operation and does NOT skip the remainder of the loop body like continue would. Every iteration appends i, yielding [0, 1, 2].',
  },
  {
    id: 'q-2-10',
    pcepSection: 2,
    pcepObjective: '2.8',
    question: 'How many times does count increment in this nested loop?',
    codeSnippet:
      'count = 0\nfor i in range(3):\n    for j in range(i, 3):\n        count += 1\nprint(count)',
    options: ['3', '6', '9', '5'],
    correctIndex: 1,
    explanation:
      'For i=0, j runs 0,1,2 (3 times). For i=1, j runs 1,2 (2 times). For i=2, j runs 2 (1 time). Total increments: 3 + 2 + 1 = 6.',
  },

  // =========================================================================
  // DOMAIN 3: Data Collections — Lists, Tuples, Sets, Dicts & Strings (10 Questions)
  // =========================================================================
  {
    id: 'q-5',
    pcepSection: 3,
    pcepObjective: '3.1',
    question: 'What does the slice operation produce?',
    codeSnippet: 'word = "PYTHON"\nprint(word[::-2])',
    options: ['"NHY"', '"OTP"', '"NTP"', '"NOT"'],
    correctIndex: 0,
    explanation:
      'A negative step stride [::-2] starts from the end of the string and steps backwards by 2: index -1 is "N", index -3 is "H", index -5 is "Y". The output is "NHY".',
  },
  {
    id: 'q-6',
    pcepSection: 3,
    pcepObjective: '3.6',
    question: 'What will happen when executing this code?',
    codeSnippet: 'data = {1: "one", 2: "two"}\nprint(data.get(3, "missing"))',
    options: ['Raises KeyError: 3', 'Prints None', 'Prints "missing"', 'Raises TypeError'],
    correctIndex: 2,
    explanation:
      'The dictionary .get(key, default) method safely retrieves the value, returning the second argument ("missing") when the key is absent, avoiding a KeyError.',
  },
  {
    id: 'q-3-3',
    pcepSection: 3,
    pcepObjective: '3.1',
    question: 'What does this code print regarding list references and slicing?',
    codeSnippet: 'a = [1, 2, 3]\nb = a\nc = a[:]\nb[0] = 99\nprint(a[0], c[0])',
    options: ['1 1', '99 99', '99 1', '1 99'],
    correctIndex: 2,
    explanation:
      'b = a creates an alias pointing to the exact same list object in memory, so mutating b[0] updates a[0] to 99. However, c = a[:] creates a new shallow copy whose first element stays 1.',
  },
  {
    id: 'q-3-4',
    pcepSection: 3,
    pcepObjective: '3.2',
    question: 'What is printed after calling append(), extend(), and pop()?',
    codeSnippet:
      'nums = [1, 2]\nnums.append([3, 4])\nnums.extend([5])\nprint(len(nums), nums.pop(1))',
    options: ['5 2', '4 2', '4 1', '5 [3, 4]'],
    correctIndex: 1,
    explanation:
      'append([3, 4]) adds the nested list as 1 single element, and extend([5]) unpacks 5 as 1 element: nums is [1, 2, [3, 4], 5] (length 4). nums.pop(1) then removes and returns index 1 (value 2).',
  },
  {
    id: 'q-3-5',
    pcepSection: 3,
    pcepObjective: '3.3',
    question: 'What value is accessed at grid[2][1] in this 2D list comprehension?',
    codeSnippet: 'grid = [[r + c for c in range(2)] for r in range(3)]\nprint(grid[2][1])',
    options: ['2', '3', '1', 'IndexError'],
    correctIndex: 1,
    explanation:
      'The outer comprehension loops r over 0, 1, 2 and the inner loops c over 0, 1. grid[2] corresponds to r = 2 ([2, 3]), and index [1] is c = 1, yielding 2 + 1 = 3.',
  },
  {
    id: 'q-3-6',
    pcepSection: 3,
    pcepObjective: '3.4',
    question: 'What are the types of t1 and t2?',
    codeSnippet: 't1 = (5)\nt2 = (5,)\nprint(type(t1).__name__, type(t2).__name__)',
    options: ['tuple tuple', 'int tuple', 'tuple int', 'int int'],
    correctIndex: 1,
    explanation:
      'Parentheses around a single expression without a trailing comma are treated purely as grouping, so t1 is an int. A trailing comma is mandatory for a 1-element tuple (t2).',
  },
  {
    id: 'q-3-7',
    pcepSection: 3,
    pcepObjective: '3.5',
    question: 'What is the output of these set operations?',
    codeSnippet: 's = {1, 2, 2, 3}\ns.discard(99)\ns.add(3)\nprint(len(s))',
    options: ['4', '3', 'Raises KeyError on discard(99)', '5'],
    correctIndex: 1,
    explanation:
      'Sets automatically deduplicate elements ({1, 2, 3}). Unlike remove(), discard() does not raise an error if the element is absent. Adding 3 again leaves 3 unique elements.',
  },
  {
    id: 'q-3-8',
    pcepSection: 3,
    pcepObjective: '3.6',
    question: 'Which of the following expressions raises a TypeError if used as a dictionary key?',
    codeSnippet: '',
    options: ['(1, 2)', '"status"', '[1, 2]', '42'],
    correctIndex: 2,
    explanation:
      'Dictionary keys must be immutable and hashable. Tuples of immutables, strings, and ints are hashable, whereas a list [1, 2] is mutable and raises TypeError: unhashable type: \'list\'.',
  },
  {
    id: 'q-3-9',
    pcepSection: 3,
    pcepObjective: '3.8',
    question: 'What does len(path) return for this raw string literal?',
    codeSnippet: 'path = r"C:\\new\\test"\nprint(len(path))',
    options: ['9', '11', '10', '12'],
    correctIndex: 1,
    explanation:
      'A raw string r"..." treats backslashes as literal characters rather than escape sequences like \\n or \\t. Counting every character in C:\\new\\test gives 11.',
  },
  {
    id: 'q-3-10',
    pcepSection: 3,
    pcepObjective: '3.9',
    question: 'What string is printed after chaining strip(), split(), slicing, and join()?',
    codeSnippet:
      'text = "  red,green,blue  "\nparts = text.strip().split(",")\nprint("-".join(parts[::-1]))',
    options: [
      'red-green-blue',
      'blue-green-red',
      '  blue-green-red  ',
      'eulb-neerg-der',
    ],
    correctIndex: 1,
    explanation:
      'strip() removes leading/trailing spaces, split(",") yields ["red", "green", "blue"], [::-1] reverses the list to ["blue", "green", "red"], and "-".join(...) outputs "blue-green-red".',
  },

  // =========================================================================
  // DOMAIN 4: Functions & Exceptions (10 Questions)
  // =========================================================================
  {
    id: 'q-7',
    pcepSection: 4,
    pcepObjective: '4.3',
    question: 'What is the output of the following function call?',
    codeSnippet:
      'def add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\nprint(add_item("apple"))\nprint(add_item("banana"))',
    options: [
      "['apple'] then ['banana']",
      "['apple'] then ['apple', 'banana']",
      "['banana'] then ['apple', 'banana']",
      'Raises ValueError',
    ],
    correctIndex: 1,
    explanation:
      'Default argument expressions in Python are evaluated once at function definition time. The list [] persists across subsequent invocations.',
  },
  {
    id: 'q-8',
    pcepSection: 4,
    pcepObjective: '4.7',
    question:
      'Which block in a try-except structure is guaranteed to execute regardless of whether an exception occurred?',
    codeSnippet: '',
    options: ['else', 'finally', 'except Exception', 'catch'],
    correctIndex: 1,
    explanation:
      'The finally block always runs upon leaving the try-except statement, even if an uncaught exception or return statement occurs.',
  },
  {
    id: 'q-4-3',
    pcepSection: 4,
    pcepObjective: '4.1',
    question: 'What is printed when calling a function with no return statement?',
    codeSnippet: 'def greet(name):\n    msg = f"Hi {name}"\n\nprint(greet("Ada"))',
    options: ['Hi Ada', 'None', '""', 'NameError'],
    correctIndex: 1,
    explanation:
      'msg is only assigned locally inside greet() and never returned. Any Python function that reaches its end without executing a return statement implicitly returns None.',
  },
  {
    id: 'q-4-4',
    pcepSection: 4,
    pcepObjective: '4.2',
    question: 'What does this function returning two comma-separated values print?',
    codeSnippet:
      'def stats(a, b):\n    return a + b, a * b\n\nres = stats(3, 4)\nprint(type(res).__name__, res[1])',
    options: ['list 12', 'tuple 12', 'tuple 7', 'int 12'],
    correctIndex: 1,
    explanation:
      'Returning comma-separated expressions packs them into a tuple: (7, 12). Accessing res[1] returns the second element, 12.',
  },
  {
    id: 'q-4-5',
    pcepSection: 4,
    pcepObjective: '4.3',
    question: 'Given def calc(a, b=2, c=3): return a + b + c, which call causes a SyntaxError?',
    codeSnippet: '',
    options: [
      'calc(1, c=5)',
      'calc(a=1, 2)',
      'calc(1, 2, 3)',
      'calc(c=1, a=2, b=3)',
    ],
    correctIndex: 1,
    explanation:
      'In Python function calls, positional arguments must always precede keyword arguments. Passing 2 after a=1 violates this rule and triggers a SyntaxError.',
  },
  {
    id: 'q-4-6',
    pcepSection: 4,
    pcepObjective: '4.4',
    question: 'What tuple is printed by this *args and **kwargs function?',
    codeSnippet:
      'def record(label, *args, **kwargs):\n    return len(args), len(kwargs)\n\nprint(record("log", 10, 20, 30, level="INFO"))',
    options: ['(4, 1)', '(3, 1)', '(3, 0)', '(1, 3)'],
    correctIndex: 1,
    explanation:
      '"log" binds to positional parameter label. The remaining three positional arguments (10, 20, 30) pack into args (len 3), and level="INFO" packs into kwargs (len 1).',
  },
  {
    id: 'q-4-7',
    pcepSection: 4,
    pcepObjective: '4.5',
    question: 'What is printed after update() runs without the global keyword?',
    codeSnippet: 'x = 10\ndef update():\n    x = 20\n\nupdate()\nprint(x)',
    options: ['20', '10', 'None', 'UnboundLocalError'],
    correctIndex: 1,
    explanation:
      'Assigning x = 20 inside update() creates a new local variable named x that shadows the global x only inside the function. The outer global x stays 10.',
  },
  {
    id: 'q-4-8',
    pcepSection: 4,
    pcepObjective: '4.6',
    question: 'Which message is printed given Python exception hierarchy matching?',
    codeSnippet:
      'try:\n    vals = [10, 20]\n    print(vals[5])\nexcept LookupError:\n    print("Lookup")\nexcept IndexError:\n    print("Index")',
    options: ['Index', 'Lookup', 'Lookup then Index', 'Unhandled IndexError'],
    correctIndex: 1,
    explanation:
      'Python checks except clauses strictly from top to bottom and stops at the first match. Because IndexError inherits from LookupError, except LookupError catches it first.',
  },
  {
    id: 'q-4-9',
    pcepSection: 4,
    pcepObjective: '4.7',
    question: 'What is printed when no exception occurs inside this try-except-else-finally block?',
    codeSnippet:
      'out = []\ntry:\n    out.append("try")\nexcept ValueError:\n    out.append("except")\nelse:\n    out.append("else")\nfinally:\n    out.append("finally")\nprint("-".join(out))',
    options: ['try-finally', 'try-else-finally', 'try-else', 'try-except-finally'],
    correctIndex: 1,
    explanation:
      'The else clause runs only when the try block completes with no exceptions, and finally always runs afterward. Output is "try-else-finally".',
  },
  {
    id: 'q-4-10',
    pcepSection: 4,
    pcepObjective: '4.7',
    question: 'Which built-in exception is raised when evaluating int("3.14")?',
    codeSnippet: '',
    options: ['TypeError', 'ValueError', 'SyntaxError', 'ArithmeticError'],
    correctIndex: 1,
    explanation:
      'int() expects a string argument (so the type is valid), but "3.14" cannot be directly parsed as a base-10 integer string, raising a ValueError.',
  },

  // =========================================================================
  // DOMAIN 5: File Handling & Standard Library Modules (10 Questions)
  // =========================================================================
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
    explanation:
      'The with statement acts as a context manager that guarantees the file descriptor is closed properly upon block exit, even if an unhandled exception interrupts execution.',
  },
  {
    id: 'q-10',
    pcepSection: 5,
    pcepObjective: '5.5',
    question: 'What is the return value of math.floor(4.9) and math.ceil(4.1)?',
    codeSnippet: 'import math\nprint(math.floor(4.9), math.ceil(4.1))',
    options: ['4 and 4', '5 and 5', '4 and 5', '5 and 4'],
    correctIndex: 2,
    explanation:
      'math.floor(4.9) returns 4 (largest integer <= 4.9). math.ceil(4.1) returns 5 (smallest integer >= 4.1).',
  },
  {
    id: 'q-5-3',
    pcepSection: 5,
    pcepObjective: '5.1',
    question: 'What happens if you open an existing non-empty file with open("notes.txt", "w")?',
    codeSnippet: '',
    options: [
      'New writes are appended after the existing text',
      'Python raises FileExistsError',
      'Existing file contents are immediately truncated (erased) before writing',
      'The file is opened in read-only mode first',
    ],
    correctIndex: 2,
    explanation:
      'Write mode ("w") creates the file if it does not exist, or truncates an existing file to zero bytes. Use append mode ("a") to preserve existing content.',
  },
  {
    id: 'q-5-4',
    pcepSection: 5,
    pcepObjective: '5.1',
    question: 'What does file.readlines() return when called on an open text file?',
    codeSnippet: '',
    options: [
      'A single string containing the whole file',
      'A list of strings where each item is one line (keeping trailing newline characters)',
      'A tuple of line lengths',
      'The integer count of lines in the file',
    ],
    correctIndex: 1,
    explanation:
      'readlines() reads all remaining lines from the stream and returns them as a list of strings, with each line retaining its trailing "\\n" (except possibly the last line).',
  },
  {
    id: 'q-5-5',
    pcepSection: 5,
    pcepObjective: '5.2',
    question: 'Assuming log.txt exists, what does f.closed print right after the with block exits?',
    codeSnippet: 'with open("log.txt", "r") as f:\n    data = f.read()\nprint(f.closed)',
    options: ['False', 'True', 'None', 'ValueError: I/O operation on closed file'],
    correctIndex: 1,
    explanation:
      'The context manager closes the stream automatically on leaving the with suite. Inspecting the boolean attribute f.closed returns True without raising an error.',
  },
  {
    id: 'q-5-6',
    pcepSection: 5,
    pcepObjective: '5.3',
    question: 'When csv.reader(f) reads the CSV line Alice,92,Passed, what value does next(reader) return?',
    codeSnippet: '',
    options: [
      '("Alice", 92, "Passed")',
      '["Alice", "92", "Passed"]',
      '{"name": "Alice", "score": "92"}',
      '["Alice", 92, "Passed"]',
    ],
    correctIndex: 1,
    explanation:
      'csv.reader() yields each row as a Python list of strings—even fields containing digits like "92" are returned as strings until explicitly cast.',
  },
  {
    id: 'q-5-7',
    pcepSection: 5,
    pcepObjective: '5.4',
    question: 'Which statement is true after executing from math import sqrt as root?',
    codeSnippet: 'from math import sqrt as root\nprint(int(root(81)))',
    options: [
      'Both math.sqrt(81) and root(81) work in the current scope',
      'Prints 9, while the name "math" is not bound in the current namespace',
      'Prints 9.0',
      'Raises ImportError because aliases only work with import math as m',
    ],
    correctIndex: 1,
    explanation:
      'from module import name as alias imports only the specified object under the alias root. Neither "sqrt" nor "math" is added to the current namespace.',
  },
  {
    id: 'q-5-8',
    pcepSection: 5,
    pcepObjective: '5.4',
    question: 'When report.py is executed directly via python report.py, what is __name__ inside report.py?',
    codeSnippet: '',
    options: ['"report"', '"report.py"', '"__main__"', 'None'],
    correctIndex: 2,
    explanation:
      'Python sets __name__ to "__main__" for the top-level script being executed, whereas any module imported by another script has __name__ set to its module name ("report").',
  },
  {
    id: 'q-5-9',
    pcepSection: 5,
    pcepObjective: '5.5',
    question: 'What is printed when comparing math.trunc() and math.floor() on a negative float?',
    codeSnippet: 'import math\nprint(math.trunc(-3.7), math.floor(-3.7))',
    options: ['-4 -4', '-3 -4', '-3 -3', '-4 -3'],
    correctIndex: 1,
    explanation:
      'math.trunc(-3.7) truncates toward zero, returning -3. math.floor(-3.7) rounds down toward negative infinity, returning -4.',
  },
  {
    id: 'q-5-10',
    pcepSection: 5,
    pcepObjective: '5.5',
    question:
      'Which random function call returns a list of 3 unique elements without replacement from items = [10, 20, 30, 40, 50]?',
    codeSnippet: '',
    options: [
      'random.choice(items, 3)',
      'random.sample(items, 3)',
      'random.randint(items, 3)',
      'random.choices(items, k=3)',
    ],
    correctIndex: 1,
    explanation:
      'random.sample(population, k) selects k distinct elements without replacement. random.choices() samples with replacement (allowing duplicates), while choice() returns a single element.',
  },
];
