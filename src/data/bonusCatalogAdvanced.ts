import { BonusProject } from '../types';

export const ADVANCED_CATALOG_PROJECTS: BonusProject[] = [
  {
    id: 'bonus-student-gradebook',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'Student Gradebook System',
    sectionNumber: 4,
    sectionName: 'Functions and Exceptions',
    examWeightPercentage: 29,
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    specificObjectives: ['3.5', '4.1', '4.6'],
    fileName: 'student_gradebook.py',
    testFileName: 'test_student_gradebook.py',
    keyTip: 'Validate scores between 0 and 100 before storing them so corrupted records never skew class averages.',
    pitfallWarning: 'Compute averages safely by returning 0.0 when a student has no recorded scores yet.',
    description: 'Manage student records, compute averages, and generate performance summaries.',
    learningOutcomes: [
      'Maintain multi-student grade dictionaries safely',
      'Compute weighted/unweighted averages and letter grades',
      'Generate ranked class performance summaries',
    ],
    starterCode: '# Student Gradebook System',
    solutionCode: '# Solution: Student Gradebook System',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Initialize Gradebook',
        readOnly: true,
        starterCode: `gradebook = {}`,
        solutionCode: `gradebook = {}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Record Validated Student Scores',
        starterCode: `# Cell 1 (Step 1): Validate 0 <= score <= 100 and append to book[student]
def record_score(book, student, score):
    if not (0 <= score <= 100):
        raise ValueError("Score must be between 0 and 100")
    # TODO: Use book.setdefault(student.strip(), []).append(float(score)) and return list
    return []

record_score(gradebook, "Maya", 92)
record_score(gradebook, "Maya", 88)
record_score(gradebook, "Leo", 76)
print("Gradebook:", gradebook)`,
        solutionCode: `# Cell 1 (Step 1): Validate 0 <= score <= 100 and append to book[student]
def record_score(book, student, score):
    if not (0 <= score <= 100):
        raise ValueError("Score must be between 0 and 100")
    scores = book.setdefault(student.strip(), [])
    scores.append(float(score))
    return scores

record_score(gradebook, "Maya", 92)
record_score(gradebook, "Maya", 88)
record_score(gradebook, "Leo", 76)
print("Gradebook:", gradebook)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Compute Student Average & Letter Grade',
        starterCode: `# Cell 2 (Step 2): Return {"average": avg, "letter": "A"|"B"|"C"|"D"|"F"}
def student_report(book, student):
    scores = book.get(student.strip(), [])
    avg = round(sum(scores) / len(scores), 2) if scores else 0.0
    # TODO: Assign letter A (>=90), B (>=80), C (>=70), D (>=60), else F
    return {"average": avg, "letter": "F"}

print("Maya:", student_report(gradebook, "Maya"))`,
        solutionCode: `# Cell 2 (Step 2): Return {"average": avg, "letter": "A"|"B"|"C"|"D"|"F"}
def student_report(book, student):
    scores = book.get(student.strip(), [])
    avg = round(sum(scores) / len(scores), 2) if scores else 0.0
    if avg >= 90:
        letter = "A"
    elif avg >= 80:
        letter = "B"
    elif avg >= 70:
        letter = "C"
    elif avg >= 60:
        letter = "D"
    else:
        letter = "F"
    return {"average": avg, "letter": letter}

print("Maya:", student_report(gradebook, "Maya"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Generate Class Performance Summary',
        starterCode: `# Cell 3 (Step 3): Return {"class_avg": ..., "top_student": ..., "honor_roll": [...]} (honor_roll >= 90)
def class_summary(book):
    if not book:
        return {"class_avg": 0.0, "top_student": None, "honor_roll": []}
    averages = {name: student_report(book, name)["average"] for name in book}
    # TODO: Compute class_avg, top_student = max(averages, key=averages.get), and sorted honor_roll (>= 90)
    return {}

print(class_summary(gradebook))`,
        solutionCode: `# Cell 3 (Step 3): Return {"class_avg": ..., "top_student": ..., "honor_roll": [...]} (honor_roll >= 90)
def class_summary(book):
    if not book:
        return {"class_avg": 0.0, "top_student": None, "honor_roll": []}
    averages = {name: student_report(book, name)["average"] for name in book}
    class_avg = round(sum(averages.values()) / len(averages), 2)
    top_student = max(averages, key=averages.get)
    honor_roll = sorted(name for name, avg in averages.items() if avg >= 90)
    return {"class_avg": class_avg, "top_student": top_student, "honor_roll": honor_roll}

print(class_summary(gradebook))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Record Validated Scores',
        taskInstruction: 'In Cell 1 inside record_score(book, student, score), append float(score) to book.setdefault(student.strip(), []) and return the list.',
        targetObjectiveId: '4.6',
        patternTitle: 'Worked Pattern (Validated Dict List Append)',
        patternCode: `scores = book.setdefault(student.strip(), [])
scores.append(float(score))
return scores`,
        patternExplanation: 'Validating bounds prevents bad grades from entering the gradebook.',
        expectedExample: 'record_score({}, "Maya", 95) -> [95.0]',
        diagnosticExpr: 'record_score({}, "Maya", 95)',
        breadcrumbs: {
          level1Concept: 'Use book.setdefault(student.strip(), []) and append float(score).',
          level2Syntax: 'scores = book.setdefault(student.strip(), [])\nscores.append(float(score))\nreturn scores',
          level3Scaffold: 'scores = book.setdefault(student.strip(), [])\nscores.append(float(score))\nreturn scores',
        },
        validationSnippet: 'gb = {}\nassert record_score(gb, "Maya", 92) == [92.0] and record_score(gb, "Maya", 88) == [92.0, 88.0]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Student Average & Letter Grade',
        taskInstruction: 'In Cell 2 inside student_report(book, student), map avg to A (>=90), B (>=80), C (>=70), D (>=60), or F.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Grade Scale Ladder)',
        patternCode: `if avg >= 90: letter = "A"
elif avg >= 80: letter = "B"
elif avg >= 70: letter = "C"
elif avg >= 60: letter = "D"
else: letter = "F"`,
        patternExplanation: 'Checking thresholds top-down keeps the grading rules clear.',
        expectedExample: 'student_report({"Maya": [92, 88]}, "Maya") -> {"average": 90.0, "letter": "A"}',
        diagnosticExpr: 'student_report({"Maya": [92, 88]}, "Maya")',
        breadcrumbs: {
          level1Concept: 'Use an if/elif/else chain on avg >= 90, 80, 70, 60.',
          level2Syntax: 'if avg >= 90: letter = "A" ... return {"average": avg, "letter": letter}',
          level3Scaffold: 'if avg >= 90: letter = "A"\nelif avg >= 80: letter = "B"\nelif avg >= 70: letter = "C"\nelif avg >= 60: letter = "D"\nelse: letter = "F"\nreturn {"average": avg, "letter": letter}',
        },
        validationSnippet: 'assert student_report({"Maya": [92, 88]}, "Maya") == {"average": 90.0, "letter": "A"} and student_report({"Leo": [75]}, "Leo")["letter"] == "C"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Class Performance Summary',
        taskInstruction: 'In Cell 3 inside class_summary(book), compute class_avg, top_student, and sorted honor_roll (>= 90).',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Class Analytics)',
        patternCode: `class_avg = round(sum(averages.values()) / len(averages), 2)
top_student = max(averages, key=averages.get)
honor_roll = sorted(name for name, avg in averages.items() if avg >= 90)`,
        patternExplanation: 'Deriving averages once lets you compute all summary fields cleanly.',
        expectedExample: 'class_summary({"Maya": [92, 88], "Leo": [76]})',
        diagnosticExpr: 'class_summary({"Maya": [92, 88], "Leo": [76]})',
        breadcrumbs: {
          level1Concept: 'Average averages.values(), find max key, and filter names with avg >= 90.',
          level2Syntax: 'return {"class_avg": class_avg, "top_student": top_student, "honor_roll": honor_roll}',
          level3Scaffold: 'class_avg = round(sum(averages.values()) / len(averages), 2)\ntop_student = max(averages, key=averages.get)\nhonor_roll = sorted(name for name, avg in averages.items() if avg >= 90)\nreturn {"class_avg": class_avg, "top_student": top_student, "honor_roll": honor_roll}',
        },
        validationSnippet: 's = class_summary({"Maya": [92, 88], "Leo": [76]})\nassert s == {"class_avg": 83.0, "top_student": "Maya", "honor_roll": ["Maya"]}',
      },
    ],
  },
  {
    id: 'bonus-library-management',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'Library Management System',
    sectionNumber: 5,
    sectionName: 'Standard Library & File Persistence',
    examWeightPercentage: 15,
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    specificObjectives: ['5.2', '3.5', '4.6'],
    fileName: 'library_management.py',
    testFileName: 'test_library_management.py',
    keyTip: 'Keep every book record uniform: {"isbn": ..., "title": ..., "borrower": None} so lending checks simply inspect borrower is None.',
    pitfallWarning: 'Save catalog changes to JSON immediately after checkout/return so disk state stays synchronized.',
    description: 'Track books, borrowers, and lending status with persistent storage.',
    learningOutcomes: [
      'Register books and track checkout/return borrower state',
      'Prevent double checkouts when a book is already lent out',
      'Persist and reload the library catalog as JSON',
    ],
    starterCode: '# Library Management System',
    solutionCode: '# Solution: Library Management System',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Import json & Catalog Store',
        readOnly: true,
        starterCode: `import json

LIBRARY_FILE = "library_catalog.json"
library_db = {}`,
        solutionCode: `import json

LIBRARY_FILE = "library_catalog.json"
library_db = {}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Register Books & Checkout Lending',
        starterCode: `# Cell 1 (Step 1): Add book record and allow checkout only when available
def add_book(db, isbn, title):
    db[isbn] = {"isbn": isbn, "title": title, "borrower": None}
    return db[isbn]

def checkout_book(db, isbn, borrower):
    book = db.get(isbn)
    # TODO: If book exists and book["borrower"] is None, set book["borrower"] = borrower.strip() and return True; else False
    return False

add_book(library_db, "978-01", "Fluent Python")
print("Checkout 1:", checkout_book(library_db, "978-01", "Alice"))`,
        solutionCode: `# Cell 1 (Step 1): Add book record and allow checkout only when available
def add_book(db, isbn, title):
    db[isbn] = {"isbn": isbn, "title": title, "borrower": None}
    return db[isbn]

def checkout_book(db, isbn, borrower):
    book = db.get(isbn)
    if book and book["borrower"] is None:
        book["borrower"] = borrower.strip()
        return True
    return False

add_book(library_db, "978-01", "Fluent Python")
print("Checkout 1:", checkout_book(library_db, "978-01", "Alice"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Return Book & List Available Titles',
        starterCode: `# Cell 2 (Step 2): Clear borrower on return and list available book titles
def return_book(db, isbn):
    book = db.get(isbn)
    # TODO: If book and book["borrower"] is not None: set borrower = None, return True; else False
    return False

def available_titles(db):
    # TODO: Return sorted list of titles where book["borrower"] is None
    return []

add_book(library_db, "978-02", "Clean Code")
print("Available:", available_titles(library_db))`,
        solutionCode: `# Cell 2 (Step 2): Clear borrower on return and list available book titles
def return_book(db, isbn):
    book = db.get(isbn)
    if book and book["borrower"] is not None:
        book["borrower"] = None
        return True
    return False

def available_titles(db):
    return sorted(b["title"] for b in db.values() if b["borrower"] is None)

add_book(library_db, "978-02", "Clean Code")
print("Available:", available_titles(library_db))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Persist & Reload Catalog JSON',
        starterCode: `# Cell 3 (Step 3): Save db to filepath and reload it cleanly
def save_library(db, filepath):
    # TODO: Write JSON to filepath with json.dump(db, f, indent=2)
    pass

def load_library(filepath):
    # TODO: Load JSON from filepath (return {} if FileNotFoundError)
    return {}

save_library(library_db, LIBRARY_FILE)
print("Reloaded:", load_library(LIBRARY_FILE))`,
        solutionCode: `# Cell 3 (Step 3): Save db to filepath and reload it cleanly
def save_library(db, filepath):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)

def load_library(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

save_library(library_db, LIBRARY_FILE)
print("Reloaded:", load_library(LIBRARY_FILE))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Checkout Guarding',
        taskInstruction: 'In Cell 1 inside checkout_book(db, isbn, borrower), assign book["borrower"] = borrower.strip() only if book exists and borrower is None.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Availability State Check)',
        patternCode: `if book and book["borrower"] is None:
    book["borrower"] = borrower.strip()
    return True
return False`,
        patternExplanation: 'Checking borrower is None prevents two borrowers checking out the same copy.',
        expectedExample: 'checkout_book(db, "978-01", "Alice") -> True',
        diagnosticExpr: 'checkout_book({"1": {"isbn": "1", "title": "Book", "borrower": None}}, "1", "Bob")',
        breadcrumbs: {
          level1Concept: 'Verify book exists and book["borrower"] is None before assigning borrower.',
          level2Syntax: 'if book and book["borrower"] is None:\n    book["borrower"] = borrower.strip()\n    return True',
          level3Scaffold: 'if book and book["borrower"] is None:\n    book["borrower"] = borrower.strip()\n    return True\nreturn False',
        },
        validationSnippet: 'd = {}\nadd_book(d, "1", "Python")\nassert checkout_book(d, "1", "Alice") is True and checkout_book(d, "1", "Bob") is False',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Return & Available Books',
        taskInstruction: 'In Cell 2, implement return_book() (clears borrower to None) and available_titles() (sorted titles where borrower is None).',
        targetObjectiveId: '4.6',
        patternTitle: 'Worked Pattern (Filtered Book List)',
        patternCode: `return sorted(b["title"] for b in db.values() if b["borrower"] is None)`,
        patternExplanation: 'Sorting the available titles ensures predictable catalog display.',
        expectedExample: 'available_titles(db)',
        diagnosticExpr: 'available_titles({"1": {"title": "Z", "borrower": None}, "2": {"title": "A", "borrower": None}})',
        breadcrumbs: {
          level1Concept: 'Reset book["borrower"] = None in return_book; filter borrower is None in available_titles.',
          level2Syntax: 'return sorted(b["title"] for b in db.values() if b["borrower"] is None)',
          level3Scaffold: 'if book and book["borrower"] is not None:\n    book["borrower"] = None\n    return True\nreturn False',
        },
        validationSnippet: 'd = {}\nadd_book(d, "1", "Zebra")\nadd_book(d, "2", "Alpha")\ncheckout_book(d, "1", "Sam")\nassert available_titles(d) == ["Alpha"] and return_book(d, "1") is True and available_titles(d) == ["Alpha", "Zebra"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: JSON Persistence',
        taskInstruction: 'In Cell 3, implement save_library(db, filepath) with json.dump() and load_library(filepath) with try/except FileNotFoundError.',
        targetObjectiveId: '5.2',
        patternTitle: 'Worked Pattern (JSON Save & Safe Load)',
        patternCode: `with open(filepath, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2)`,
        patternExplanation: 'Returning {} on FileNotFoundError lets fresh installs boot gracefully.',
        expectedExample: 'load_library(LIBRARY_FILE)',
        diagnosticExpr: 'load_library("nonexistent_lib.json")',
        breadcrumbs: {
          level1Concept: 'Use json.dump() for save and json.load() inside try/except FileNotFoundError for load.',
          level2Syntax: 'with open(filepath, "r", encoding="utf-8") as f:\n    return json.load(f)',
          level3Scaffold: 'try:\n    with open(filepath, "r", encoding="utf-8") as f:\n        return json.load(f)\nexcept FileNotFoundError:\n    return {}',
        },
        validationSnippet: 'd = {"1": {"isbn": "1", "title": "Python", "borrower": "Ada"}}\nsave_library(d, "test_lib.json")\nassert load_library("test_lib.json") == d and load_library("missing_lib.json") == {}',
      },
    ],
  },
  {
    id: 'bonus-text-adventure-branching',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'Text Adventure Game',
    sectionNumber: 2,
    sectionName: 'Control Flow - Conditional Blocks and Loops',
    examWeightPercentage: 29,
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    specificObjectives: ['2.1', '3.5', '4.1'],
    fileName: 'text_adventure_game.py',
    testFileName: 'test_text_adventure_game.py',
    keyTip: 'Represent rooms as a graph dictionary where each room maps choices to target rooms, item pickups, or required inventory keys!',
    pitfallWarning: 'Check if a player has the required key in state["inventory"] BEFORE unlocking the secret exit ending.',
    description: 'Build a branching story with inventory, decisions, and multiple endings.',
    learningOutcomes: [
      'Model branching room nodes, items, and endings in a story graph',
      'Gate locked paths using player inventory requirements',
      'Simulate multi-decision runs to reach multiple distinct endings',
    ],
    starterCode: '# Text Adventure Game',
    solutionCode: '# Solution: Text Adventure Game',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Story Graph Definition',
        readOnly: true,
        starterCode: `STORY_MAP = {
    "hall": {"item": None, "exits": {"left": "library", "right": "vault"}, "ending": None},
    "library": {"item": "brass_key", "exits": {"back": "hall", "stairs": "roof"}, "ending": None},
    "vault": {"item": None, "requires": "brass_key", "exits": {}, "ending": "Treasure Ending"},
    "roof": {"item": None, "exits": {}, "ending": "Escape Ending"},
}`,
        solutionCode: `STORY_MAP = {
    "hall": {"item": None, "exits": {"left": "library", "right": "vault"}, "ending": None},
    "library": {"item": "brass_key", "exits": {"back": "hall", "stairs": "roof"}, "ending": None},
    "vault": {"item": None, "requires": "brass_key", "exits": {}, "ending": "Treasure Ending"},
    "roof": {"item": None, "exits": {}, "ending": "Escape Ending"},
}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Initialize Player State & Move Between Rooms',
        starterCode: `# Cell 1 (Step 1): Create initial player state and move one step along exits
def new_adventure():
    return {"room": "hall", "inventory": [], "ending": None, "log": ["hall"]}

def take_step(state, story_map, choice):
    current = story_map[state["room"]]
    next_room = current["exits"].get(choice)
    if not next_room:
        return False
    target = story_map[next_room]
    req = target.get("requires")
    # TODO: If req and req not in state["inventory"], return False
    # Update state["room"] = next_room, append next_room to log, pick up item if new, set ending
    return False

s = new_adventure()
print("Move left:", take_step(s, STORY_MAP, "left"), s)`,
        solutionCode: `# Cell 1 (Step 1): Create initial player state and move one step along exits
def new_adventure():
    return {"room": "hall", "inventory": [], "ending": None, "log": ["hall"]}

def take_step(state, story_map, choice):
    current = story_map[state["room"]]
    next_room = current["exits"].get(choice)
    if not next_room:
        return False
    target = story_map[next_room]
    req = target.get("requires")
    if req and req not in state["inventory"]:
        return False
    state["room"] = next_room
    state["log"].append(next_room)
    item = target.get("item")
    if item and item not in state["inventory"]:
        state["inventory"].append(item)
    state["ending"] = target.get("ending")
    return True

s = new_adventure()
print("Move left:", take_step(s, STORY_MAP, "left"), s)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Run a Full Sequence of Decisions',
        starterCode: `# Cell 2 (Step 2): Execute a list of choices until exhausted or an ending is reached
def play_adventure(story_map, choices):
    state = new_adventure()
    # TODO: Loop through choices, call take_step(state, story_map, c), stop if state["ending"] is set
    return state

print("Path to Treasure:", play_adventure(STORY_MAP, ["left", "back", "right"]))`,
        solutionCode: `# Cell 2 (Step 2): Execute a list of choices until exhausted or an ending is reached
def play_adventure(story_map, choices):
    state = new_adventure()
    for choice in choices:
        if state["ending"] is not None:
            break
        take_step(state, story_map, choice)
    return state

print("Path to Treasure:", play_adventure(STORY_MAP, ["left", "back", "right"]))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Discover All Reachable Endings',
        starterCode: `# Cell 3 (Step 3): Collect all unique ending labels defined in story_map
def list_possible_endings(story_map):
    # TODO: Return sorted list of non-None ending strings in story_map.values()
    return []

print("Endings:", list_possible_endings(STORY_MAP))`,
        solutionCode: `# Cell 3 (Step 3): Collect all unique ending labels defined in story_map
def list_possible_endings(story_map):
    return sorted({node["ending"] for node in story_map.values() if node.get("ending")})

print("Endings:", list_possible_endings(STORY_MAP))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Gated Room Transitions & Inventory',
        taskInstruction: 'In Cell 1 inside take_step(), block entry if req is missing from inventory, then update room, log, inventory, and ending.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Inventory Key Gate)',
        patternCode: `req = target.get("requires")
if req and req not in state["inventory"]:
    return False
state["room"] = next_room
if target.get("item") and target["item"] not in state["inventory"]:
    state["inventory"].append(target["item"])`,
        patternExplanation: 'Checking inventory before moving prevents accessing the vault without first visiting the library.',
        expectedExample: 'take_step(new_adventure(), STORY_MAP, "right") -> False (needs brass_key)',
        diagnosticExpr: 'take_step(new_adventure(), STORY_MAP, "right")',
        breadcrumbs: {
          level1Concept: 'Check req not in state["inventory"], update room, pick up item, and set ending.',
          level2Syntax: 'if req and req not in state["inventory"]: return False\nstate["room"] = next_room',
          level3Scaffold: 'if req and req not in state["inventory"]:\n    return False\nstate["room"] = next_room\nstate["log"].append(next_room)\nitem = target.get("item")\nif item and item not in state["inventory"]:\n    state["inventory"].append(item)\nstate["ending"] = target.get("ending")\nreturn True',
        },
        validationSnippet: 'st = new_adventure()\nassert take_step(st, STORY_MAP, "right") is False and take_step(st, STORY_MAP, "left") is True and "brass_key" in st["inventory"]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Play Decision Sequence',
        taskInstruction: 'In Cell 2 inside play_adventure(story_map, choices), call take_step() for each choice and stop if state["ending"] becomes non-None.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Story Replay Loop)',
        patternCode: `for choice in choices:
    if state["ending"] is not None:
        break
    take_step(state, story_map, choice)`,
        patternExplanation: 'Breaking once an ending is reached stops further moves cleanly.',
        expectedExample: 'play_adventure(STORY_MAP, ["left", "stairs"])["ending"] -> "Escape Ending"',
        diagnosticExpr: 'play_adventure(STORY_MAP, ["left", "stairs"])["ending"]',
        breadcrumbs: {
          level1Concept: 'Iterate through choices, breaking if state["ending"] is already reached.',
          level2Syntax: 'for choice in choices:\n    if state["ending"] is not None: break\n    take_step(state, story_map, choice)',
          level3Scaffold: 'for choice in choices:\n    if state["ending"] is not None:\n        break\n    take_step(state, story_map, choice)',
        },
        validationSnippet: 'assert play_adventure(STORY_MAP, ["left", "back", "right"])["ending"] == "Treasure Ending" and play_adventure(STORY_MAP, ["left", "stairs"])["ending"] == "Escape Ending"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Catalog Story Endings',
        taskInstruction: 'In Cell 3 inside list_possible_endings(story_map), return a sorted list of non-None ending values.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Set Comprehension Sort)',
        patternCode: `return sorted({node["ending"] for node in story_map.values() if node.get("ending")})`,
        patternExplanation: 'Set comprehension deduplicates endings and sorted() orders them cleanly.',
        expectedExample: 'list_possible_endings(STORY_MAP) -> ["Escape Ending", "Treasure Ending"]',
        diagnosticExpr: 'list_possible_endings(STORY_MAP)',
        breadcrumbs: {
          level1Concept: 'Collect unique truthy node["ending"] values and sort them.',
          level2Syntax: 'return sorted({node["ending"] for node in story_map.values() if node.get("ending")})',
          level3Scaffold: 'return sorted({node["ending"] for node in story_map.values() if node.get("ending")})',
        },
        validationSnippet: 'assert list_possible_endings(STORY_MAP) == ["Escape Ending", "Treasure Ending"]',
      },
    ],
  },
  {
    id: 'bonus-bank-account-simulator',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'Bank Account Simulator',
    sectionNumber: 4,
    sectionName: 'Functions and Exceptions',
    examWeightPercentage: 29,
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    specificObjectives: ['4.6', '3.5', '4.1'],
    fileName: 'bank_account_sim.py',
    testFileName: 'test_bank_account_sim.py',
    keyTip: 'Keep every transaction recorded as a tuple or dict in account["history"] so balances can always be audited.',
    pitfallWarning: 'A transfer from account A to account B must validate sufficient funds in A BEFORE crediting B so money is never created out of thin air.',
    description: 'Model deposits, withdrawals, transfers, and transaction history.',
    learningOutcomes: [
      'Enforce positive amounts and overdraft protection',
      'Execute atomic account-to-account transfers',
      'Maintain an immutable-style transaction audit trail',
    ],
    starterCode: '# Bank Account Simulator',
    solutionCode: '# Solution: Bank Account Simulator',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Create Account & Handle Deposits / Withdrawals',
        starterCode: `# Cell 1 (Step 1): Model account dict with balance and transaction history
def create_account(owner, initial_balance=0.0):
    return {"owner": owner, "balance": round(float(initial_balance), 2), "history": []}

def deposit(acct, amount):
    if amount <= 0:
        raise ValueError("Deposit must be positive")
    # TODO: Add amount to acct["balance"] (rounded 2 decimals) and append ("deposit", round(float(amount), 2)) to history
    return acct["balance"]

def withdraw(acct, amount):
    if amount <= 0 or amount > acct["balance"]:
        raise ValueError("Invalid or insufficient funds")
    # TODO: Subtract amount from acct["balance"] (rounded 2 decimals) and append ("withdraw", round(float(amount), 2)) to history
    return acct["balance"]

alice = create_account("Alice", 100.0)
print("After +50:", deposit(alice, 50.0))`,
        solutionCode: `# Cell 1 (Step 1): Model account dict with balance and transaction history
def create_account(owner, initial_balance=0.0):
    return {"owner": owner, "balance": round(float(initial_balance), 2), "history": []}

def deposit(acct, amount):
    if amount <= 0:
        raise ValueError("Deposit must be positive")
    amt = round(float(amount), 2)
    acct["balance"] = round(acct["balance"] + amt, 2)
    acct["history"].append(("deposit", amt))
    return acct["balance"]

def withdraw(acct, amount):
    if amount <= 0 or amount > acct["balance"]:
        raise ValueError("Invalid or insufficient funds")
    amt = round(float(amount), 2)
    acct["balance"] = round(acct["balance"] - amt, 2)
    acct["history"].append(("withdraw", amt))
    return acct["balance"]

alice = create_account("Alice", 100.0)
print("After +50:", deposit(alice, 50.0))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Atomic Account-to-Account Transfer',
        starterCode: `# Cell 2 (Step 2): Withdraw from sender then deposit to receiver; return True on success
def transfer(sender, receiver, amount):
    # TODO: Withdraw from sender first (raises ValueError on overdraft), then deposit to receiver
    return False

bob = create_account("Bob", 25.0)
transfer(alice, bob, 40.0)
print("Alice:", alice["balance"], "| Bob:", bob["balance"])`,
        solutionCode: `# Cell 2 (Step 2): Withdraw from sender then deposit to receiver; return True on success
def transfer(sender, receiver, amount):
    withdraw(sender, amount)
    deposit(receiver, amount)
    return True

bob = create_account("Bob", 25.0)
transfer(alice, bob, 40.0)
print("Alice:", alice["balance"], "| Bob:", bob["balance"])`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Summarize Account Statement',
        starterCode: `# Cell 3 (Step 3): Compute total_deposited, total_withdrawn, and ending balance
def statement_summary(acct):
    # TODO: Sum ("deposit", amt) and ("withdraw", amt) entries in acct["history"]
    return {"owner": acct["owner"], "deposited": 0.0, "withdrawn": 0.0, "balance": acct["balance"]}

print(statement_summary(alice))`,
        solutionCode: `# Cell 3 (Step 3): Compute total_deposited, total_withdrawn, and ending balance
def statement_summary(acct):
    dep = round(sum(amt for kind, amt in acct["history"] if kind == "deposit"), 2)
    wd = round(sum(amt for kind, amt in acct["history"] if kind == "withdraw"), 2)
    return {"owner": acct["owner"], "deposited": dep, "withdrawn": wd, "balance": acct["balance"]}

print(statement_summary(alice))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Deposits, Withdrawals & Ledger',
        taskInstruction: 'In Cell 1, implement deposit() and withdraw() to update balance and append ("deposit"|"withdraw", amt) to history.',
        targetObjectiveId: '4.6',
        patternTitle: 'Worked Pattern (Guarded Ledger Mutation)',
        patternCode: `amt = round(float(amount), 2)
acct["balance"] = round(acct["balance"] - amt, 2)
acct["history"].append(("withdraw", amt))`,
        patternExplanation: 'Validating amount > 0 and amount <= balance before mutating state keeps accounts consistent.',
        expectedExample: 'deposit(create_account("A", 10), 15) -> 25.0',
        diagnosticExpr: 'deposit(create_account("A", 10), 15)',
        breadcrumbs: {
          level1Concept: 'Update acct["balance"] and append the tuple to acct["history"].',
          level2Syntax: 'acct["balance"] = round(acct["balance"] + amt, 2)\nacct["history"].append(("deposit", amt))',
          level3Scaffold: 'amt = round(float(amount), 2)\nacct["balance"] = round(acct["balance"] + amt, 2)\nacct["history"].append(("deposit", amt))\nreturn acct["balance"]',
        },
        validationSnippet: 'a = create_account("A", 100)\nassert deposit(a, 25) == 125.0 and withdraw(a, 50) == 75.0 and len(a["history"]) == 2',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Atomic Transfer',
        taskInstruction: 'In Cell 2 inside transfer(sender, receiver, amount), call withdraw(sender, amount) before deposit(receiver, amount) and return True.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Withdraw-Before-Deposit)',
        patternCode: `withdraw(sender, amount)
deposit(receiver, amount)
return True`,
        patternExplanation: 'Because withdraw() raises ValueError if funds are low, deposit() is never reached on failure.',
        expectedExample: 'transfer(a, b, 20) -> True',
        diagnosticExpr: 'transfer(create_account("A", 50), create_account("B", 0), 20)',
        breadcrumbs: {
          level1Concept: 'Call withdraw(sender, amount) first, then deposit(receiver, amount).',
          level2Syntax: 'withdraw(sender, amount)\ndeposit(receiver, amount)\nreturn True',
          level3Scaffold: 'withdraw(sender, amount)\ndeposit(receiver, amount)\nreturn True',
        },
        validationSnippet: 'a = create_account("A", 50)\nb = create_account("B", 10)\nassert transfer(a, b, 30) is True and a["balance"] == 20.0 and b["balance"] == 40.0',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Statement Summary',
        taskInstruction: 'In Cell 3 inside statement_summary(acct), sum deposits and withdrawals from acct["history"].',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (History Audit)',
        patternCode: `dep = round(sum(amt for kind, amt in acct["history"] if kind == "deposit"), 2)
wd = round(sum(amt for kind, amt in acct["history"] if kind == "withdraw"), 2)`,
        patternExplanation: 'Unpacking (kind, amt) tuples filters history entries cleanly.',
        expectedExample: 'statement_summary(alice)',
        diagnosticExpr: 'statement_summary({"owner": "A", "balance": 70.0, "history": [("deposit", 20.0), ("withdraw", 50.0)]})',
        breadcrumbs: {
          level1Concept: 'Sum amounts grouped by kind == "deposit" and kind == "withdraw".',
          level2Syntax: 'dep = round(sum(amt for kind, amt in acct["history"] if kind == "deposit"), 2)',
          level3Scaffold: 'dep = round(sum(amt for kind, amt in acct["history"] if kind == "deposit"), 2)\nwd = round(sum(amt for kind, amt in acct["history"] if kind == "withdraw"), 2)\nreturn {"owner": acct["owner"], "deposited": dep, "withdrawn": wd, "balance": acct["balance"]}',
        },
        validationSnippet: 'a = create_account("A", 100)\ndeposit(a, 50)\nwithdraw(a, 20)\nassert statement_summary(a) == {"owner": "A", "deposited": 50.0, "withdrawn": 20.0, "balance": 130.0}',
      },
    ],
  },
  {
    id: 'bonus-inventory-manager',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'Inventory Manager',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Advanced',
    estimatedMinutes: 22,
    specificObjectives: ['3.5', '3.6', '4.6'],
    fileName: 'inventory_manager.py',
    testFileName: 'test_inventory_manager.py',
    keyTip: 'Store a per-product min_stock threshold alongside qty and price so restock alerts adapt to each item.',
    pitfallWarning: 'Prevent negative stock levels by raising ValueError when an order exceeds available qty.',
    description: 'Maintain product stock, pricing, and restock alerts.',
    learningOutcomes: [
      'Register SKUs with stock quantities, prices, and reorder thresholds',
      'Process stock sales and restock deliveries safely',
      'Flag low-stock alerts and calculate total inventory valuation',
    ],
    starterCode: '# Inventory Manager',
    solutionCode: '# Solution: Inventory Manager',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Initialize Warehouse Dict',
        readOnly: true,
        starterCode: `warehouse = {}`,
        solutionCode: `warehouse = {}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Register & Adjust Product Stock',
        starterCode: `# Cell 1 (Step 1): Add SKU record and sell/restock units safely
def register_product(inv, sku, name, price, qty, min_stock=5):
    inv[sku] = {"sku": sku, "name": name, "price": round(float(price), 2), "qty": int(qty), "min_stock": int(min_stock)}
    return inv[sku]

def sell_product(inv, sku, units):
    item = inv[sku]
    if units <= 0 or units > item["qty"]:
        raise ValueError("Invalid sale quantity")
    # TODO: Subtract units from item["qty"] and return round(units * item["price"], 2)
    return 0.0

register_product(warehouse, "SKU-1", "USB Cable", 9.50, 8, min_stock=5)
print("Sale revenue:", sell_product(warehouse, "SKU-1", 4))`,
        solutionCode: `# Cell 1 (Step 1): Add SKU record and sell/restock units safely
def register_product(inv, sku, name, price, qty, min_stock=5):
    inv[sku] = {"sku": sku, "name": name, "price": round(float(price), 2), "qty": int(qty), "min_stock": int(min_stock)}
    return inv[sku]

def sell_product(inv, sku, units):
    item = inv[sku]
    if units <= 0 or units > item["qty"]:
        raise ValueError("Invalid sale quantity")
    item["qty"] -= units
    return round(units * item["price"], 2)

register_product(warehouse, "SKU-1", "USB Cable", 9.50, 8, min_stock=5)
print("Sale revenue:", sell_product(warehouse, "SKU-1", 4))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Detect Low-Stock Restock Alerts',
        starterCode: `# Cell 2 (Step 2): Return sorted list of SKUs where qty <= min_stock
def get_restock_alerts(inv):
    # TODO: Return sorted(sku for sku, item in inv.items() if item["qty"] <= item["min_stock"])
    return []

register_product(warehouse, "SKU-2", "Mouse", 24.00, 12, min_stock=4)
print("Restock alerts:", get_restock_alerts(warehouse))`,
        solutionCode: `# Cell 2 (Step 2): Return sorted list of SKUs where qty <= min_stock
def get_restock_alerts(inv):
    return sorted(sku for sku, item in inv.items() if item["qty"] <= item["min_stock"])

register_product(warehouse, "SKU-2", "Mouse", 24.00, 12, min_stock=4)
print("Restock alerts:", get_restock_alerts(warehouse))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Calculate Total Warehouse Valuation',
        starterCode: `# Cell 3 (Step 3): Compute total retail value across all SKUs (qty * price)
def total_inventory_value(inv):
    # TODO: Return round(sum(item["qty"] * item["price"] for item in inv.values()), 2)
    return 0.0

print("Warehouse value: $", total_inventory_value(warehouse))`,
        solutionCode: `# Cell 3 (Step 3): Compute total retail value across all SKUs (qty * price)
def total_inventory_value(inv):
    return round(sum(item["qty"] * item["price"] for item in inv.values()), 2)

print("Warehouse value: $", total_inventory_value(warehouse))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Validated Stock Sale',
        taskInstruction: 'In Cell 1 inside sell_product(inv, sku, units), deduct units from item["qty"] and return round(units * item["price"], 2).',
        targetObjectiveId: '4.6',
        patternTitle: 'Worked Pattern (Stock Deduction & Revenue)',
        patternCode: `item["qty"] -= units
return round(units * item["price"], 2)`,
        patternExplanation: 'Guarding units > item["qty"] ensures inventory never turns negative.',
        expectedExample: 'sell_product(warehouse, "SKU-1", 4) -> 38.0',
        diagnosticExpr: 'warehouse["SKU-1"]["qty"]',
        breadcrumbs: {
          level1Concept: 'Subtract units from item["qty"] and return rounded units * price.',
          level2Syntax: 'item["qty"] -= units\nreturn round(units * item["price"], 2)',
          level3Scaffold: 'item["qty"] -= units\nreturn round(units * item["price"], 2)',
        },
        validationSnippet: 'w = {}\nregister_product(w, "A", "Item", 5.0, 10, 3)\nassert sell_product(w, "A", 4) == 20.0 and w["A"]["qty"] == 6',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Restock Alerts',
        taskInstruction: 'In Cell 2 inside get_restock_alerts(inv), return sorted(sku for sku, item in inv.items() if item["qty"] <= item["min_stock"]).',
        targetObjectiveId: '3.6',
        patternTitle: 'Worked Pattern (Threshold Alert Filter)',
        patternCode: `return sorted(sku for sku, item in inv.items() if item["qty"] <= item["min_stock"])`,
        patternExplanation: 'Using <= triggers alerts cleanly as soon as stock reaches the minimum threshold.',
        expectedExample: 'get_restock_alerts(warehouse) -> ["SKU-1"]',
        diagnosticExpr: 'get_restock_alerts(warehouse)',
        breadcrumbs: {
          level1Concept: 'Collect keys where item["qty"] <= item["min_stock"] and sort them.',
          level2Syntax: 'return sorted(sku for sku, item in inv.items() if item["qty"] <= item["min_stock"])',
          level3Scaffold: 'return sorted(sku for sku, item in inv.items() if item["qty"] <= item["min_stock"])',
        },
        validationSnippet: 'w = {"A": {"qty": 3, "min_stock": 5}, "B": {"qty": 10, "min_stock": 5}}\nassert get_restock_alerts(w) == ["A"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Warehouse Valuation',
        taskInstruction: 'In Cell 3 inside total_inventory_value(inv), return round(sum(item["qty"] * item["price"] for item in inv.values()), 2).',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Inventory Value Sum)',
        patternCode: `return round(sum(item["qty"] * item["price"] for item in inv.values()), 2)`,
        patternExplanation: 'Summing qty * price across all dictionary values calculates retail inventory worth.',
        expectedExample: 'total_inventory_value({"A": {"qty": 2, "price": 10.0}}) -> 20.0',
        diagnosticExpr: 'total_inventory_value({"A": {"qty": 2, "price": 10.0}})',
        breadcrumbs: {
          level1Concept: 'Multiply qty by price for each item in inv.values() and sum them.',
          level2Syntax: 'return round(sum(item["qty"] * item["price"] for item in inv.values()), 2)',
          level3Scaffold: 'return round(sum(item["qty"] * item["price"] for item in inv.values()), 2)',
        },
        validationSnippet: 'w = {"A": {"qty": 4, "price": 9.5}, "B": {"qty": 2, "price": 24.0}}\nassert total_inventory_value(w) == 86.0',
      },
    ],
  },
  {
    id: 'bonus-task-scheduler',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'Task Scheduler',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Advanced',
    estimatedMinutes: 22,
    specificObjectives: ['3.1', '3.5', '4.1'],
    fileName: 'task_scheduler.py',
    testFileName: 'test_task_scheduler.py',
    keyTip: 'Map priority strings to numeric ranks: PRIORITY_RANK = {"high": 1, "medium": 2, "low": 3} so Python sorts (rank, due_date) naturally!',
    pitfallWarning: 'Sorting by raw priority text alphabetically puts "high" before "low" before "medium" — always use a rank map.',
    description: 'Organize tasks by priority and due date with sorting and filtering.',
    learningOutcomes: [
      'Rank task priorities numerically instead of alphabetically',
      'Sort schedules by multi-key tuples (priority_rank, due_date, title)',
      'Filter overdue or priority-specific task subsets',
    ],
    starterCode: '# Task Scheduler',
    solutionCode: '# Solution: Task Scheduler',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Priority Rank Map',
        readOnly: true,
        starterCode: `PRIORITY_RANK = {"high": 1, "medium": 2, "low": 3}`,
        solutionCode: `PRIORITY_RANK = {"high": 1, "medium": 2, "low": 3}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Create Validated Scheduled Task',
        starterCode: `# Cell 1 (Step 1): Validate priority and return standardized task dict
def create_task(title, priority, due_date):
    p = priority.strip().lower()
    if p not in PRIORITY_RANK:
        raise ValueError(f"Unknown priority: {priority}")
    # TODO: Return {"title": title.strip(), "priority": p, "due_date": due_date.strip()}
    return {}

sample_tasks = [
    create_task("Write unit tests", "low", "2026-11-22"),
    create_task("Fix login bug", "high", "2026-11-18"),
    create_task("Deploy build", "high", "2026-11-16"),
]
print("Tasks:", sample_tasks)`,
        solutionCode: `# Cell 1 (Step 1): Validate priority and return standardized task dict
def create_task(title, priority, due_date):
    p = priority.strip().lower()
    if p not in PRIORITY_RANK:
        raise ValueError(f"Unknown priority: {priority}")
    return {"title": title.strip(), "priority": p, "due_date": due_date.strip()}

sample_tasks = [
    create_task("Write unit tests", "low", "2026-11-22"),
    create_task("Fix login bug", "high", "2026-11-18"),
    create_task("Deploy build", "high", "2026-11-16"),
]
print("Tasks:", sample_tasks)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Sort by Priority Rank Then Due Date',
        starterCode: `# Cell 2 (Step 2): Sort tasks by (PRIORITY_RANK[t["priority"]], t["due_date"], t["title"])
def sort_schedule(tasks):
    # TODO: Return a newly sorted list using multi-key lambda
    return []

print("Sorted:", [t["title"] for t in sort_schedule(sample_tasks)])`,
        solutionCode: `# Cell 2 (Step 2): Sort tasks by (PRIORITY_RANK[t["priority"]], t["due_date"], t["title"])
def sort_schedule(tasks):
    return sorted(tasks, key=lambda t: (PRIORITY_RANK[t["priority"]], t["due_date"], t["title"]))

print("Sorted:", [t["title"] for t in sort_schedule(sample_tasks)])`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Filter Tasks Due On or Before Cutoff Date',
        starterCode: `# Cell 3 (Step 3): Return sorted tasks due on/before cutoff_date (or matching priority)
def filter_due_before(tasks, cutoff_date, priority=None):
    filtered = [t for t in tasks if t["due_date"] <= cutoff_date]
    if priority:
        p = priority.strip().lower()
        filtered = [t for t in filtered if t["priority"] == p]
    # TODO: Return sort_schedule(filtered)
    return []

print("Due <= 2026-11-18:", filter_due_before(sample_tasks, "2026-11-18", "high"))`,
        solutionCode: `# Cell 3 (Step 3): Return sorted tasks due on/before cutoff_date (or matching priority)
def filter_due_before(tasks, cutoff_date, priority=None):
    filtered = [t for t in tasks if t["due_date"] <= cutoff_date]
    if priority:
        p = priority.strip().lower()
        filtered = [t for t in filtered if t["priority"] == p]
    return sort_schedule(filtered)

print("Due <= 2026-11-18:", filter_due_before(sample_tasks, "2026-11-18", "high"))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Validate & Build Task Dict',
        taskInstruction: 'In Cell 1 inside create_task(title, priority, due_date), return {"title": title.strip(), "priority": p, "due_date": due_date.strip()}.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Validated Task Schema)',
        patternCode: `return {"title": title.strip(), "priority": p, "due_date": due_date.strip()}`,
        patternExplanation: 'Checking p in PRIORITY_RANK catches invalid priority typos early.',
        expectedExample: 'create_task("Test", "HIGH", "2026-11-18")["priority"] -> "high"',
        diagnosticExpr: 'create_task("Test", "HIGH", "2026-11-18")',
        breadcrumbs: {
          level1Concept: 'Return the normalized task dict with title, priority, and due_date.',
          level2Syntax: 'return {"title": title.strip(), "priority": p, "due_date": due_date.strip()}',
          level3Scaffold: 'return {"title": title.strip(), "priority": p, "due_date": due_date.strip()}',
        },
        validationSnippet: 't = create_task(" Fix ", "HIGH", "2026-11-18")\nassert t == {"title": "Fix", "priority": "high", "due_date": "2026-11-18"}',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Multi-Key Schedule Sort',
        taskInstruction: 'In Cell 2 inside sort_schedule(tasks), sort by (PRIORITY_RANK[t["priority"]], t["due_date"], t["title"]).',
        targetObjectiveId: '3.1',
        patternTitle: 'Worked Pattern (Tuple Sort Key)',
        patternCode: `return sorted(tasks, key=lambda t: (PRIORITY_RANK[t["priority"]], t["due_date"], t["title"]))`,
        patternExplanation: 'Python compares tuples element by element: priority rank first, then earliest due date, then title.',
        expectedExample: '[t["title"] for t in sort_schedule(sample_tasks)]',
        diagnosticExpr: '[t["title"] for t in sort_schedule(sample_tasks)]',
        breadcrumbs: {
          level1Concept: 'Pass key=lambda t: (PRIORITY_RANK[t["priority"]], t["due_date"], t["title"]) to sorted().',
          level2Syntax: 'return sorted(tasks, key=lambda t: (PRIORITY_RANK[t["priority"]], t["due_date"], t["title"]))',
          level3Scaffold: 'return sorted(tasks, key=lambda t: (PRIORITY_RANK[t["priority"]], t["due_date"], t["title"]))',
        },
        validationSnippet: 'ordered = [t["title"] for t in sort_schedule(sample_tasks)]\nassert ordered == ["Deploy build", "Fix login bug", "Write unit tests"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Due Date & Priority Filter',
        taskInstruction: 'In Cell 3 inside filter_due_before(), return sort_schedule(filtered).',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Filter & Reuse Sort)',
        patternCode: `return sort_schedule(filtered)`,
        patternExplanation: 'Composing filter_due_before() with sort_schedule() keeps output consistently ordered.',
        expectedExample: 'len(filter_due_before(sample_tasks, "2026-11-18", "high")) -> 2',
        diagnosticExpr: 'len(filter_due_before(sample_tasks, "2026-11-18", "high"))',
        breadcrumbs: {
          level1Concept: 'Pass filtered to sort_schedule().',
          level2Syntax: 'return sort_schedule(filtered)',
          level3Scaffold: 'return sort_schedule(filtered)',
        },
        validationSnippet: 'assert len(filter_due_before(sample_tasks, "2026-11-18", "high")) == 2 and len(filter_due_before(sample_tasks, "2026-11-18", "low")) == 0',
      },
    ],
  },
  {
    id: 'bonus-sudoku-validator',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'Sudoku Validator',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    specificObjectives: ['3.4', '2.3', '4.1'],
    fileName: 'sudoku_validator.py',
    testFileName: 'test_sudoku_validator.py',
    keyTip: 'Every valid row, column, and 3x3 box in a solved 9x9 Sudoku grid must equal set(range(1, 10)) == {1,2,3,4,5,6,7,8,9}.',
    pitfallWarning: 'Checking only rows and columns is not enough — duplicate numbers inside a 3x3 subgrid also invalidate a Sudoku board!',
    description: 'Verify whether a completed Sudoku grid follows the rules.',
    learningOutcomes: [
      'Validate 9-element uniqueness against {1..9} using sets',
      'Extract columns across a 2D matrix cleanly',
      'Traverse 3x3 subgrids using nested step-3 box indices',
    ],
    starterCode: '# Sudoku Validator',
    solutionCode: '# Solution: Sudoku Validator',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Sample Valid 9x9 Sudoku Grid',
        readOnly: true,
        starterCode: `VALID_DIGITS = set(range(1, 10))
VALID_BOARD = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
]`,
        solutionCode: `VALID_DIGITS = set(range(1, 10))
VALID_BOARD = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
]`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Validate All 9 Rows & All 9 Columns',
        starterCode: `# Cell 1 (Step 1): Check every row and column has digits 1..9
def validate_rows_and_cols(board):
    # TODO: Check len(row) == 9 and set(row) == VALID_DIGITS for each row,
    # and set(board[r][c] for r in range(9)) == VALID_DIGITS for each column c
    return False

print("Rows & cols valid:", validate_rows_and_cols(VALID_BOARD))`,
        solutionCode: `# Cell 1 (Step 1): Check every row and column has digits 1..9
def validate_rows_and_cols(board):
    if len(board) != 9:
        return False
    for r in range(9):
        if len(board[r]) != 9 or set(board[r]) != VALID_DIGITS:
            return False
    for c in range(9):
        col = {board[r][c] for r in range(9)}
        if col != VALID_DIGITS:
            return False
    return True

print("Rows & cols valid:", validate_rows_and_cols(VALID_BOARD))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Validate Each 3x3 Subgrid Box',
        starterCode: `# Cell 2 (Step 2): Check every 3x3 box starting at (box_r, box_c) in range(0, 9, 3)
def validate_boxes(board):
    # TODO: Collect 9 cells in each 3x3 block into a set and compare == VALID_DIGITS
    return False

print("3x3 boxes valid:", validate_boxes(VALID_BOARD))`,
        solutionCode: `# Cell 2 (Step 2): Check every 3x3 box starting at (box_r, box_c) in range(0, 9, 3)
def validate_boxes(board):
    for br in range(0, 9, 3):
        for bc in range(0, 9, 3):
            box = {board[r][c] for r in range(br, br + 3) for c in range(bc, bc + 3)}
            if box != VALID_DIGITS:
                return False
    return True

print("3x3 boxes valid:", validate_boxes(VALID_BOARD))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Combined Complete Board Validator',
        starterCode: `# Cell 3 (Step 3): Return True only if rows, cols, AND 3x3 boxes all pass
def is_valid_sudoku(board):
    # TODO: Return validate_rows_and_cols(board) and validate_boxes(board)
    return False

print("Full board valid:", is_valid_sudoku(VALID_BOARD))`,
        solutionCode: `# Cell 3 (Step 3): Return True only if rows, cols, AND 3x3 boxes all pass
def is_valid_sudoku(board):
    return validate_rows_and_cols(board) and validate_boxes(board)

print("Full board valid:", is_valid_sudoku(VALID_BOARD))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Row & Column Set Checks',
        taskInstruction: 'In Cell 1 inside validate_rows_and_cols(board), verify every row and column equals VALID_DIGITS.',
        targetObjectiveId: '3.4',
        patternTitle: 'Worked Pattern (Column Set Extraction)',
        patternCode: `for c in range(9):
    if {board[r][c] for r in range(9)} != VALID_DIGITS:
        return False`,
        patternExplanation: 'A set comprehension over row indices extracts any column in one line.',
        expectedExample: 'validate_rows_and_cols(VALID_BOARD) -> True',
        diagnosticExpr: 'validate_rows_and_cols(VALID_BOARD)',
        breadcrumbs: {
          level1Concept: 'Compare each row set and column set against VALID_DIGITS.',
          level2Syntax: 'if {board[r][c] for r in range(9)} != VALID_DIGITS: return False',
          level3Scaffold: 'for r in range(9):\n    if len(board[r]) != 9 or set(board[r]) != VALID_DIGITS: return False\nfor c in range(9):\n    if {board[r][c] for r in range(9)} != VALID_DIGITS: return False\nreturn True',
        },
        validationSnippet: 'bad = [row[:] for row in VALID_BOARD]\nbad[0][0] = 3\nassert validate_rows_and_cols(VALID_BOARD) is True and validate_rows_and_cols(bad) is False',
      },
      {
        stepNumber: 2,
        title: 'Step 2: 3x3 Subgrid Box Checks',
        taskInstruction: 'In Cell 2 inside validate_boxes(board), iterate br and bc over range(0, 9, 3) and check each 3x3 box equals VALID_DIGITS.',
        targetObjectiveId: '2.3',
        patternTitle: 'Worked Pattern (Step-3 Box Indexing)',
        patternCode: `for br in range(0, 9, 3):
    for bc in range(0, 9, 3):
        box = {board[r][c] for r in range(br, br + 3) for c in range(bc, bc + 3)}`,
        patternExplanation: 'Stepping by 3 visits the top-left corner of all nine 3x3 boxes cleanly.',
        expectedExample: 'validate_boxes(VALID_BOARD) -> True',
        diagnosticExpr: 'validate_boxes(VALID_BOARD)',
        breadcrumbs: {
          level1Concept: 'Loop br and bc over 0, 3, 6 and collect the 3x3 cells into a set.',
          level2Syntax: 'box = {board[r][c] for r in range(br, br + 3) for c in range(bc, bc + 3)}',
          level3Scaffold: 'for br in range(0, 9, 3):\n    for bc in range(0, 9, 3):\n        box = {board[r][c] for r in range(br, br + 3) for c in range(bc, bc + 3)}\n        if box != VALID_DIGITS:\n            return False\nreturn True',
        },
        validationSnippet: 'assert validate_boxes(VALID_BOARD) is True',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Full Sudoku Rule Validator',
        taskInstruction: 'In Cell 3 inside is_valid_sudoku(board), return validate_rows_and_cols(board) and validate_boxes(board).',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Combined Predicate)',
        patternCode: `return validate_rows_and_cols(board) and validate_boxes(board)`,
        patternExplanation: 'Short-circuit evaluation skips box checking if rows or columns already failed.',
        expectedExample: 'is_valid_sudoku(VALID_BOARD) -> True',
        diagnosticExpr: 'is_valid_sudoku(VALID_BOARD)',
        breadcrumbs: {
          level1Concept: 'Combine both helper validators with and.',
          level2Syntax: 'return validate_rows_and_cols(board) and validate_boxes(board)',
          level3Scaffold: 'return validate_rows_and_cols(board) and validate_boxes(board)',
        },
        validationSnippet: 'bad = [row[:] for row in VALID_BOARD]\nbad[0][0], bad[0][1] = bad[0][1], bad[0][0]\nassert is_valid_sudoku(VALID_BOARD) is True and is_valid_sudoku(bad) is False',
      },
    ],
  },
  {
    id: 'bonus-log-file-analyzer',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'Log File Analyzer',
    sectionNumber: 5,
    sectionName: 'Standard Library & File Persistence',
    examWeightPercentage: 15,
    difficulty: 'Advanced',
    estimatedMinutes: 22,
    specificObjectives: ['5.1', '3.5', '3.9'],
    fileName: 'log_file_analyzer.py',
    testFileName: 'test_log_file_analyzer.py',
    keyTip: 'Use str.split(None, 3) to split log lines like "2026-11-15 10:01 ERROR Database timeout" without breaking the multi-word message!',
    pitfallWarning: 'Blank trailing lines in real log files can raise IndexError unless skipped with if not line.strip(): continue.',
    description: 'Parse logs and generate summaries, error counts, and patterns.',
    learningOutcomes: [
      'Parse structured log lines into timestamp, level, and message fields',
      'Tally INFO, WARN, and ERROR counts from log files',
      'Identify the most frequent error messages for triage',
    ],
    starterCode: '# Log File Analyzer',
    solutionCode: '# Solution: Log File Analyzer',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Write Sample Server Log File',
        readOnly: true,
        starterCode: `LOG_FILE = "server.log"
with open(LOG_FILE, "w", encoding="utf-8") as f:
    f.write(
        "2026-11-15 09:00 INFO Server booted\\n"
        "2026-11-15 09:02 ERROR Timeout on /api/orders\\n"
        "2026-11-15 09:05 WARN High memory usage\\n"
        "2026-11-15 09:08 ERROR Timeout on /api/orders\\n"
        "2026-11-15 09:10 ERROR Invalid auth token\\n"
    )`,
        solutionCode: `LOG_FILE = "server.log"
with open(LOG_FILE, "w", encoding="utf-8") as f:
    f.write(
        "2026-11-15 09:00 INFO Server booted\\n"
        "2026-11-15 09:02 ERROR Timeout on /api/orders\\n"
        "2026-11-15 09:05 WARN High memory usage\\n"
        "2026-11-15 09:08 ERROR Timeout on /api/orders\\n"
        "2026-11-15 09:10 ERROR Invalid auth token\\n"
    )`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Parse Single Log Line Into Fields',
        starterCode: `# Cell 1 (Step 1): Parse "DATE TIME LEVEL MESSAGE..." into dict or None if invalid
def parse_log_line(line):
    stripped = line.strip()
    if not stripped:
        return None
    parts = stripped.split(None, 3)
    if len(parts) < 4:
        return None
    # TODO: Return {"timestamp": f"{parts[0]} {parts[1]}", "level": parts[2].upper(), "message": parts[3]}
    return None

print(parse_log_line("2026-11-15 09:02 ERROR Timeout on /api/orders"))`,
        solutionCode: `# Cell 1 (Step 1): Parse "DATE TIME LEVEL MESSAGE..." into dict or None if invalid
def parse_log_line(line):
    stripped = line.strip()
    if not stripped:
        return None
    parts = stripped.split(None, 3)
    if len(parts) < 4:
        return None
    return {
        "timestamp": f"{parts[0]} {parts[1]}",
        "level": parts[2].upper(),
        "message": parts[3],
    }

print(parse_log_line("2026-11-15 09:02 ERROR Timeout on /api/orders"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Count Log Levels Across a File',
        starterCode: `# Cell 2 (Step 2): Read filepath and return {"INFO": ..., "WARN": ..., "ERROR": ...}
def count_log_levels(filepath):
    counts = {"INFO": 0, "WARN": 0, "ERROR": 0}
    # TODO: Read lines, parse with parse_log_line(), and increment counts for known levels
    return counts

print("Level counts:", count_log_levels(LOG_FILE))`,
        solutionCode: `# Cell 2 (Step 2): Read filepath and return {"INFO": ..., "WARN": ..., "ERROR": ...}
def count_log_levels(filepath):
    counts = {"INFO": 0, "WARN": 0, "ERROR": 0}
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            entry = parse_log_line(line)
            if entry and entry["level"] in counts:
                counts[entry["level"]] += 1
    return counts

print("Level counts:", count_log_levels(LOG_FILE))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Summarize Top Error Patterns',
        starterCode: `# Cell 3 (Step 3): Return {"counts": ..., "top_error": (msg, count) or None}
def generate_log_report(filepath):
    counts = count_log_levels(filepath)
    error_msgs = {}
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            entry = parse_log_line(line)
            if entry and entry["level"] == "ERROR":
                msg = entry["message"]
                error_msgs[msg] = error_msgs.get(msg, 0) + 1
    # TODO: Find top_error = max(error_msgs.items(), key=lambda p: (p[1], p[0])) if error_msgs else None
    return {"counts": counts, "top_error": None}

print("Report:", generate_log_report(LOG_FILE))`,
        solutionCode: `# Cell 3 (Step 3): Return {"counts": ..., "top_error": (msg, count) or None}
def generate_log_report(filepath):
    counts = count_log_levels(filepath)
    error_msgs = {}
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            entry = parse_log_line(line)
            if entry and entry["level"] == "ERROR":
                msg = entry["message"]
                error_msgs[msg] = error_msgs.get(msg, 0) + 1
    top_error = max(error_msgs.items(), key=lambda p: (p[1], p[0])) if error_msgs else None
    return {"counts": counts, "top_error": top_error}

print("Report:", generate_log_report(LOG_FILE))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Parse Log Line',
        taskInstruction: 'In Cell 1 inside parse_log_line(line), return {"timestamp": f"{parts[0]} {parts[1]}", "level": parts[2].upper(), "message": parts[3]}.',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Bounded Split)',
        patternCode: `parts = stripped.split(None, 3)
return {"timestamp": f"{parts[0]} {parts[1]}", "level": parts[2].upper(), "message": parts[3]}`,
        patternExplanation: 'split(None, 3) splits only the first 3 whitespace boundaries so the remaining message stays intact.',
        expectedExample: 'parse_log_line("2026-11-15 09:00 INFO Up")["level"] -> "INFO"',
        diagnosticExpr: 'parse_log_line("2026-11-15 09:00 INFO Server booted")',
        breadcrumbs: {
          level1Concept: 'Return the dictionary combining parts[0..3].',
          level2Syntax: 'return {"timestamp": f"{parts[0]} {parts[1]}", "level": parts[2].upper(), "message": parts[3]}',
          level3Scaffold: 'return {\n    "timestamp": f"{parts[0]} {parts[1]}",\n    "level": parts[2].upper(),\n    "message": parts[3],\n}',
        },
        validationSnippet: 'p = parse_log_line("2026-11-15 09:02 error DB down")\nassert p == {"timestamp": "2026-11-15 09:02", "level": "ERROR", "message": "DB down"} and parse_log_line("") is None',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Count Severity Levels',
        taskInstruction: 'In Cell 2 inside count_log_levels(filepath), read lines, parse with parse_log_line(), and increment counts.',
        targetObjectiveId: '5.1',
        patternTitle: 'Worked Pattern (Streaming File Line Loop)',
        patternCode: `with open(filepath, "r", encoding="utf-8") as f:
    for line in f:
        entry = parse_log_line(line)
        if entry and entry["level"] in counts:
            counts[entry["level"]] += 1`,
        patternExplanation: 'Iterating directly over the file object streams one line at a time cleanly.',
        expectedExample: 'count_log_levels(LOG_FILE) -> {"INFO": 1, "WARN": 1, "ERROR": 3}',
        diagnosticExpr: 'count_log_levels(LOG_FILE)',
        breadcrumbs: {
          level1Concept: 'Open filepath, parse each line, and increment counts[entry["level"]].',
          level2Syntax: 'for line in f:\n    entry = parse_log_line(line)\n    if entry and entry["level"] in counts:\n        counts[entry["level"]] += 1',
          level3Scaffold: 'with open(filepath, "r", encoding="utf-8") as f:\n    for line in f:\n        entry = parse_log_line(line)\n        if entry and entry["level"] in counts:\n            counts[entry["level"]] += 1',
        },
        validationSnippet: 'assert count_log_levels(LOG_FILE) == {"INFO": 1, "WARN": 1, "ERROR": 3}',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Top Error Message Pattern',
        taskInstruction: 'In Cell 3 inside generate_log_report(filepath), compute top_error and return {"counts": counts, "top_error": top_error}.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Most Frequent Error)',
        patternCode: `top_error = max(error_msgs.items(), key=lambda p: (p[1], p[0])) if error_msgs else None`,
        patternExplanation: 'max() over dict items returns both the offending error message and its occurrence count.',
        expectedExample: 'generate_log_report(LOG_FILE)["top_error"] -> ("Timeout on /api/orders", 2)',
        diagnosticExpr: 'generate_log_report(LOG_FILE)',
        breadcrumbs: {
          level1Concept: 'Use max(error_msgs.items(), ...) if error_msgs else None.',
          level2Syntax: 'top_error = max(error_msgs.items(), key=lambda p: (p[1], p[0])) if error_msgs else None',
          level3Scaffold: 'top_error = max(error_msgs.items(), key=lambda p: (p[1], p[0])) if error_msgs else None\nreturn {"counts": counts, "top_error": top_error}',
        },
        validationSnippet: 'rep = generate_log_report(LOG_FILE)\nassert rep["top_error"] == ("Timeout on /api/orders", 2)',
      },
    ],
  },
  {
    id: 'bonus-csv-data-cleaner',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'CSV Data Cleaner',
    sectionNumber: 5,
    sectionName: 'Standard Library & File Persistence',
    examWeightPercentage: 15,
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    specificObjectives: ['5.1', '3.9', '4.6'],
    fileName: 'csv_data_cleaner.py',
    testFileName: 'test_csv_data_cleaner.py',
    keyTip: 'Always use Python\'s built-in csv.DictReader and csv.DictWriter (with newline="") so commas inside fields and headers stay properly aligned.',
    pitfallWarning: 'Check for missing or empty email/price cells and skip/drop invalid rows rather than letting float("") crash the pipeline.',
    description: 'Read messy CSV data, normalize it, and export a cleaned version.',
    learningOutcomes: [
      'Trim whitespace and standardize casing across messy CSV columns',
      'Deduplicate rows and drop invalid/missing numeric records safely',
      'Export normalized rows cleanly using csv.DictWriter',
    ],
    starterCode: '# CSV Data Cleaner',
    solutionCode: '# Solution: CSV Data Cleaner',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Create Messy Input CSV File',
        readOnly: true,
        starterCode: `import csv

RAW_CSV = "messy_sales.csv"
CLEAN_CSV = "clean_sales.csv"
with open(RAW_CSV, "w", encoding="utf-8", newline="") as f:
    f.write("customer,email,amount\\n")
    f.write("  ada lovelace , ADA@ORG.COM , 49.5 \\n")
    f.write("bob smith,bob@ex.com,not_a_number\\n")
    f.write("Ada Lovelace,ada@org.com,49.50\\n")
    f.write(" grace hopper , GRACE@NAVY.MIL , 120.00 \\n")`,
        solutionCode: `import csv

RAW_CSV = "messy_sales.csv"
CLEAN_CSV = "clean_sales.csv"
with open(RAW_CSV, "w", encoding="utf-8", newline="") as f:
    f.write("customer,email,amount\\n")
    f.write("  ada lovelace , ADA@ORG.COM , 49.5 \\n")
    f.write("bob smith,bob@ex.com,not_a_number\\n")
    f.write("Ada Lovelace,ada@org.com,49.50\\n")
    f.write(" grace hopper , GRACE@NAVY.MIL , 120.00 \\n")`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Normalize & Validate a Single CSV Row',
        starterCode: `# Cell 1 (Step 1): Normalize customer (title), email (lower), amount (float >= 0); return None if invalid
def clean_row(row):
    name = row.get("customer", "").strip().title()
    email = row.get("email", "").strip().lower()
    raw_amt = row.get("amount", "").strip()
    if not name or "@" not in email:
        return None
    # TODO: Convert raw_amt to float inside try/except ValueError, return cleaned dict with rounded amount (2 decimals)
    return None

print("Row 1:", clean_row({"customer": " ada ", "email": " ADA@ORG.COM ", "amount": "49.5"}))`,
        solutionCode: `# Cell 1 (Step 1): Normalize customer (title), email (lower), amount (float >= 0); return None if invalid
def clean_row(row):
    name = row.get("customer", "").strip().title()
    email = row.get("email", "").strip().lower()
    raw_amt = row.get("amount", "").strip()
    if not name or "@" not in email:
        return None
    try:
        amount = round(float(raw_amt), 2)
    except ValueError:
        return None
    if amount < 0:
        return None
    return {"customer": name, "email": email, "amount": amount}

print("Row 1:", clean_row({"customer": " ada ", "email": " ADA@ORG.COM ", "amount": "49.5"}))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Deduplicate & Clean Entire CSV File',
        starterCode: `# Cell 2 (Step 2): Read CSV rows, clean each, deduplicate by email, and return list
def load_and_clean_csv(filepath):
    cleaned = []
    seen_emails = set()
    # TODO: Use csv.DictReader, clean_row(row), skip None and duplicate emails
    return cleaned

print("Cleaned rows:", load_and_clean_csv(RAW_CSV))`,
        solutionCode: `# Cell 2 (Step 2): Read CSV rows, clean each, deduplicate by email, and return list
def load_and_clean_csv(filepath):
    cleaned = []
    seen_emails = set()
    with open(filepath, "r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            item = clean_row(row)
            if item and item["email"] not in seen_emails:
                seen_emails.add(item["email"])
                cleaned.append(item)
    return cleaned

print("Cleaned rows:", load_and_clean_csv(RAW_CSV))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Export Cleaned Rows to New CSV',
        starterCode: `# Cell 3 (Step 3): Write cleaned rows to out_path with csv.DictWriter and return row count written
def export_clean_csv(in_path, out_path):
    rows = load_and_clean_csv(in_path)
    # TODO: Write header ["customer", "email", "amount"] and rows using csv.DictWriter, return len(rows)
    return 0

print("Exported count:", export_clean_csv(RAW_CSV, CLEAN_CSV))`,
        solutionCode: `# Cell 3 (Step 3): Write cleaned rows to out_path with csv.DictWriter and return row count written
def export_clean_csv(in_path, out_path):
    rows = load_and_clean_csv(in_path)
    with open(out_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["customer", "email", "amount"])
        writer.writeheader()
        writer.writerows(rows)
    return len(rows)

print("Exported count:", export_clean_csv(RAW_CSV, CLEAN_CSV))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Normalize & Validate Row',
        taskInstruction: 'In Cell 1 inside clean_row(row), parse raw_amt with float() inside try/except ValueError and return the cleaned dict or None.',
        targetObjectiveId: '4.6',
        patternTitle: 'Worked Pattern (Row Sanitization)',
        patternCode: `try:
    amount = round(float(raw_amt), 2)
except ValueError:
    return None`,
        patternExplanation: 'Returning None on bad rows lets callers filter corrupted records safely.',
        expectedExample: 'clean_row({"customer": " ada ", "email": "A@B.C", "amount": "10"})',
        diagnosticExpr: 'clean_row({"customer": " ada ", "email": "A@B.C", "amount": "10"})',
        breadcrumbs: {
          level1Concept: 'Parse raw_amt in try/except ValueError and verify amount >= 0.',
          level2Syntax: 'try: amount = round(float(raw_amt), 2)\nexcept ValueError: return None',
          level3Scaffold: 'try:\n    amount = round(float(raw_amt), 2)\nexcept ValueError:\n    return None\nif amount < 0:\n    return None\nreturn {"customer": name, "email": email, "amount": amount}',
        },
        validationSnippet: 'assert clean_row({"customer": " ada ", "email": "ADA@ORG.COM", "amount": "49.5"}) == {"customer": "Ada", "email": "ada@org.com", "amount": 49.5} and clean_row({"customer": "x", "email": "x@y.z", "amount": "bad"}) is None',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Read & Deduplicate CSV',
        taskInstruction: 'In Cell 2 inside load_and_clean_csv(filepath), stream rows with csv.DictReader(f), skip invalid rows, and deduplicate by email.',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Seen-Set Deduplication)',
        patternCode: `if item and item["email"] not in seen_emails:
    seen_emails.add(item["email"])
    cleaned.append(item)`,
        patternExplanation: 'Tracking seen emails in a set deduplicates rows in O(1) lookup time.',
        expectedExample: 'len(load_and_clean_csv(RAW_CSV)) -> 2',
        diagnosticExpr: 'len(load_and_clean_csv(RAW_CSV))',
        breadcrumbs: {
          level1Concept: 'Use csv.DictReader(f), clean_row(row), and track seen emails in seen_emails.',
          level2Syntax: 'for row in csv.DictReader(f):\n    item = clean_row(row)\n    if item and item["email"] not in seen_emails: ...',
          level3Scaffold: 'with open(filepath, "r", encoding="utf-8", newline="") as f:\n    for row in csv.DictReader(f):\n        item = clean_row(row)\n        if item and item["email"] not in seen_emails:\n            seen_emails.add(item["email"])\n            cleaned.append(item)',
        },
        validationSnippet: 'rows = load_and_clean_csv(RAW_CSV)\nassert len(rows) == 2 and rows[0]["customer"] == "Ada Lovelace"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Export Clean CSV',
        taskInstruction: 'In Cell 3 inside export_clean_csv(in_path, out_path), write header and rows with csv.DictWriter and return len(rows).',
        targetObjectiveId: '5.1',
        patternTitle: 'Worked Pattern (DictWriter Export)',
        patternCode: `writer = csv.DictWriter(f, fieldnames=["customer", "email", "amount"])
writer.writeheader()
writer.writerows(rows)`,
        patternExplanation: 'DictWriter automatically maps dictionary keys to the exact column order.',
        expectedExample: 'export_clean_csv(RAW_CSV, CLEAN_CSV) -> 2',
        diagnosticExpr: 'export_clean_csv(RAW_CSV, CLEAN_CSV)',
        breadcrumbs: {
          level1Concept: 'Create csv.DictWriter, call writeheader() and writerows(rows), and return len(rows).',
          level2Syntax: 'writer = csv.DictWriter(f, fieldnames=["customer", "email", "amount"])\nwriter.writeheader()\nwriter.writerows(rows)',
          level3Scaffold: 'with open(out_path, "w", encoding="utf-8", newline="") as f:\n    writer = csv.DictWriter(f, fieldnames=["customer", "email", "amount"])\n    writer.writeheader()\n    writer.writerows(rows)\nreturn len(rows)',
        },
        validationSnippet: 'cnt = export_clean_csv(RAW_CSV, CLEAN_CSV)\nassert cnt == 2',
      },
    ],
  },
  {
    id: 'bonus-rule-based-chatbot',
    bonusNumber: 0,
    tier: 'Advanced',
    title: 'Rule-Based Chatbot',
    sectionNumber: 2,
    sectionName: 'Control Flow - Conditional Blocks and Loops',
    examWeightPercentage: 29,
    difficulty: 'Advanced',
    estimatedMinutes: 20,
    specificObjectives: ['2.1', '3.5', '3.9'],
    fileName: 'rule_based_chatbot.py',
    testFileName: 'test_rule_based_chatbot.py',
    keyTip: 'Order intent rules deliberately and check tokenized words or clean keyword triggers so general greetings do not shadow specific help intents.',
    pitfallWarning: 'Always return a friendly fallback message when no predefined intent keyword matches the user prompt.',
    description: 'Respond to user input using conditional logic and predefined intents.',
    learningOutcomes: [
      'Match user messages against structured intent keyword dictionaries',
      'Support personalized responses when a user shares their name',
      'Track conversation history and handle unknown intents gracefully',
    ],
    starterCode: '# Rule-Based Chatbot',
    solutionCode: '# Solution: Rule-Based Chatbot',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Predefined Intents',
        readOnly: true,
        starterCode: `INTENTS = {
    "hours": ("hour", "open", "schedule"),
    "pricing": ("price", "cost", "fee", "refund"),
    "greeting": ("hello", "hi", "hey"),
    "farewell": ("bye", "goodbye", "exit"),
}
RESPONSES = {
    "hours": "Support is open Monday to Friday, 9 AM - 5 PM.",
    "pricing": "Standard access is free; exam vouchers are $68.",
    "greeting": "Hello! How can I help you today?",
    "farewell": "Goodbye! Keep practicing Python.",
}`,
        solutionCode: `INTENTS = {
    "hours": ("hour", "open", "schedule"),
    "pricing": ("price", "cost", "fee", "refund"),
    "greeting": ("hello", "hi", "hey"),
    "farewell": ("bye", "goodbye", "exit"),
}
RESPONSES = {
    "hours": "Support is open Monday to Friday, 9 AM - 5 PM.",
    "pricing": "Standard access is free; exam vouchers are $68.",
    "greeting": "Hello! How can I help you today?",
    "farewell": "Goodbye! Keep practicing Python.",
}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Classify Intent From User Message',
        starterCode: `# Cell 1 (Step 1): Return matching intent key from INTENTS or "unknown"
def detect_intent(message):
    cleaned = message.strip().lower()
    # TODO: Check each intent, keywords in INTENTS.items(); if any keyword in cleaned, return intent
    return "unknown"

print("Intent 'What is the cost?':", detect_intent("What is the cost?"))`,
        solutionCode: `# Cell 1 (Step 1): Return matching intent key from INTENTS or "unknown"
def detect_intent(message):
    cleaned = message.strip().lower()
    for intent, keywords in INTENTS.items():
        if any(kw in cleaned for kw in keywords):
            return intent
    return "unknown"

print("Intent 'What is the cost?':", detect_intent("What is the cost?"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Generate Rule-Based Reply',
        starterCode: `# Cell 2 (Step 2): Respond based on "my name is X" special rule or detected intent
def reply(message, fallback="I didn't catch that — ask about hours or pricing."):
    low = message.strip().lower()
    if low.startswith("my name is "):
        name = message.strip()[11:].strip().title()
        # TODO: Return f"Nice to meet you, {name}!"
    intent = detect_intent(message)
    # TODO: Return RESPONSES.get(intent, fallback)
    return fallback

print(reply("My name is jordan"))
print(reply("Are you open?"))`,
        solutionCode: `# Cell 2 (Step 2): Respond based on "my name is X" special rule or detected intent
def reply(message, fallback="I didn't catch that — ask about hours or pricing."):
    low = message.strip().lower()
    if low.startswith("my name is "):
        name = message.strip()[11:].strip().title()
        if name:
            return f"Nice to meet you, {name}!"
    intent = detect_intent(message)
    return RESPONSES.get(intent, fallback)

print(reply("My name is jordan"))
print(reply("Are you open?"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Simulate Multi-Turn Conversation Transcript',
        starterCode: `# Cell 3 (Step 3): Run a list of user messages and return [(user_msg, bot_reply), ...]
def run_chat_session(messages):
    # TODO: Return [(msg, reply(msg)) for msg in messages]
    return []

print(run_chat_session(["Hi!", "What does it cost?", "Bye"]))`,
        solutionCode: `# Cell 3 (Step 3): Run a list of user messages and return [(user_msg, bot_reply), ...]
def run_chat_session(messages):
    return [(msg, reply(msg)) for msg in messages]

print(run_chat_session(["Hi!", "What does it cost?", "Bye"]))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Intent Classification',
        taskInstruction: 'In Cell 1 inside detect_intent(message), iterate INTENTS.items() and return intent if any keyword appears in cleaned.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Keyword Intent Matching)',
        patternCode: `for intent, keywords in INTENTS.items():
    if any(kw in cleaned for kw in keywords):
        return intent`,
        patternExplanation: 'Testing specific business intents before generic greetings prevents "hi, what is the cost" from matching only greeting.',
        expectedExample: 'detect_intent("What is the cost?") -> "pricing"',
        diagnosticExpr: 'detect_intent("What is the cost?")',
        breadcrumbs: {
          level1Concept: 'Loop over INTENTS.items() and check any(kw in cleaned for kw in keywords).',
          level2Syntax: 'for intent, keywords in INTENTS.items():\n    if any(kw in cleaned for kw in keywords): return intent',
          level3Scaffold: 'for intent, keywords in INTENTS.items():\n    if any(kw in cleaned for kw in keywords):\n        return intent\nreturn "unknown"',
        },
        validationSnippet: 'assert detect_intent("What is the cost?") == "pricing" and detect_intent("xyzzy") == "unknown"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Personalized Rule-Based Reply',
        taskInstruction: 'In Cell 2 inside reply(message), greet the user if message starts with "my name is ", otherwise return RESPONSES.get(intent, fallback).',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Prefix Rule + Intent Lookup)',
        patternCode: `if low.startswith("my name is "):
    name = message.strip()[11:].strip().title()
    if name:
        return f"Nice to meet you, {name}!"
return RESPONSES.get(detect_intent(message), fallback)`,
        patternExplanation: 'Combining conditional prefix rules with dictionary lookup keeps responses extensible.',
        expectedExample: 'reply("My name is jordan") -> "Nice to meet you, Jordan!"',
        diagnosticExpr: 'reply("My name is jordan")',
        breadcrumbs: {
          level1Concept: 'Return the personalized greeting if name is truthy, else RESPONSES.get(intent, fallback).',
          level2Syntax: 'return f"Nice to meet you, {name}!"\nreturn RESPONSES.get(intent, fallback)',
          level3Scaffold: 'if low.startswith("my name is "):\n    name = message.strip()[11:].strip().title()\n    if name:\n        return f"Nice to meet you, {name}!"\nreturn RESPONSES.get(detect_intent(message), fallback)',
        },
        validationSnippet: 'assert reply("My name is jordan") == "Nice to meet you, Jordan!" and reply("Are you open?") == RESPONSES["hours"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Multi-Turn Transcript',
        taskInstruction: 'In Cell 3 inside run_chat_session(messages), return [(msg, reply(msg)) for msg in messages].',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Session Transcript)',
        patternCode: `return [(msg, reply(msg)) for msg in messages]`,
        patternExplanation: 'Pairing each prompt with its reply creates a clean testable conversation log.',
        expectedExample: 'len(run_chat_session(["Hi", "Bye"])) -> 2',
        diagnosticExpr: 'run_chat_session(["Hi", "Bye"])',
        breadcrumbs: {
          level1Concept: 'Build a list of (msg, reply(msg)) tuples.',
          level2Syntax: 'return [(msg, reply(msg)) for msg in messages]',
          level3Scaffold: 'return [(msg, reply(msg)) for msg in messages]',
        },
        validationSnippet: 'log = run_chat_session(["Hi", "Bye"])\nassert len(log) == 2 and log[0][1] == RESPONSES["greeting"] and log[1][1] == RESPONSES["farewell"]',
      },
    ],
  },
];
