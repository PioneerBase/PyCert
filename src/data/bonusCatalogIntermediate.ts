import { BonusProject } from '../types';

export const INTERMEDIATE_CATALOG_PROJECTS: BonusProject[] = [
  {
    id: 'bonus-expense-tracker',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'Expense Tracker',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    specificObjectives: ['3.5', '3.6', '4.1'],
    fileName: 'expense_tracker.py',
    testFileName: 'test_expense_tracker.py',
    keyTip: 'Group expenses by category using dict.get(cat, 0.0) + amount so new categories initialize cleanly without KeyError.',
    pitfallWarning: 'Round currency sums with round(..., 2) so floating-point arithmetic like 0.1 + 0.2 never prints 0.30000000000000004.',
    description: 'Track spending by category and show totals, averages, and summaries.',
    learningOutcomes: [
      'Validate and record expense entries with category labels',
      'Aggregate spending totals per category in a dictionary',
      'Compute overall total, average expense, and top spending category',
    ],
    starterCode: '# Expense Tracker',
    solutionCode: '# Solution: Expense Tracker',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Initialize Expense Ledger',
        readOnly: true,
        starterCode: `expenses = []`,
        solutionCode: `expenses = []`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Record Validated Expense Entries',
        starterCode: `# Cell 1 (Step 1): Validate amount > 0 and append {"category": category, "amount": round(float(amount), 2), "note": note}
def add_expense(ledger, category, amount, note=""):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    # TODO: Append entry dict with title-cased category and return entry
    return {}

add_expense(expenses, "food", 14.50, "Lunch")
add_expense(expenses, "travel", 32.00, "Bus pass")
print("Ledger:", expenses)`,
        solutionCode: `# Cell 1 (Step 1): Validate amount > 0 and append {"category": category, "amount": round(float(amount), 2), "note": note}
def add_expense(ledger, category, amount, note=""):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    entry = {"category": category.strip().title(), "amount": round(float(amount), 2), "note": note}
    ledger.append(entry)
    return entry

add_expense(expenses, "food", 14.50, "Lunch")
add_expense(expenses, "travel", 32.00, "Bus pass")
print("Ledger:", expenses)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Group Spending Totals by Category',
        starterCode: `# Cell 2 (Step 2): Return {category: rounded_total} across all entries
def totals_by_category(ledger):
    totals = {}
    # TODO: Accumulate totals[cat] = round(totals.get(cat, 0.0) + entry["amount"], 2)
    return totals

add_expense(expenses, "food", 9.25, "Coffee & bagel")
print("By category:", totals_by_category(expenses))`,
        solutionCode: `# Cell 2 (Step 2): Return {category: rounded_total} across all entries
def totals_by_category(ledger):
    totals = {}
    for entry in ledger:
        cat = entry["category"]
        totals[cat] = round(totals.get(cat, 0.0) + entry["amount"], 2)
    return totals

add_expense(expenses, "food", 9.25, "Coffee & bagel")
print("By category:", totals_by_category(expenses))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Compute Total, Average & Top Category Summary',
        starterCode: `# Cell 3 (Step 3): Return {"total": ..., "average": ..., "top_category": ...}
def expense_summary(ledger):
    if not ledger:
        return {"total": 0.0, "average": 0.0, "top_category": None}
    # TODO: Compute total sum, average per entry, and top_category using totals_by_category(ledger)
    return {}

print("Summary:", expense_summary(expenses))`,
        solutionCode: `# Cell 3 (Step 3): Return {"total": ..., "average": ..., "top_category": ...}
def expense_summary(ledger):
    if not ledger:
        return {"total": 0.0, "average": 0.0, "top_category": None}
    total = round(sum(e["amount"] for e in ledger), 2)
    avg = round(total / len(ledger), 2)
    by_cat = totals_by_category(ledger)
    top_cat = max(by_cat, key=by_cat.get)
    return {"total": total, "average": avg, "top_category": top_cat}

print("Summary:", expense_summary(expenses))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Record Expense Entry',
        taskInstruction: 'In Cell 1 inside add_expense(), build entry = {"category": category.strip().title(), "amount": round(float(amount), 2), "note": note}, append it to ledger, and return entry.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Validated Record Append)',
        patternCode: `entry = {"category": category.strip().title(), "amount": round(float(amount), 2), "note": note}
ledger.append(entry)
return entry`,
        patternExplanation: 'Normalizing category names keeps "food" and "Food" grouped together.',
        expectedExample: 'add_expense([], "food", 12.5)["category"] -> "Food"',
        diagnosticExpr: 'add_expense([], "food", 12.5)',
        breadcrumbs: {
          level1Concept: 'Create the entry dict, append to ledger, and return entry.',
          level2Syntax: 'entry = {"category": category.strip().title(), "amount": round(float(amount), 2), "note": note}',
          level3Scaffold: 'entry = {"category": category.strip().title(), "amount": round(float(amount), 2), "note": note}\nledger.append(entry)\nreturn entry',
        },
        validationSnippet: 'l = []\ne = add_expense(l, " food ", 14.5, "Lunch")\nassert e == {"category": "Food", "amount": 14.5, "note": "Lunch"} and len(l) == 1',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Aggregate by Category',
        taskInstruction: 'In Cell 2 inside totals_by_category(ledger), accumulate each entry amount into totals[cat] using totals.get(cat, 0.0).',
        targetObjectiveId: '3.6',
        patternTitle: 'Worked Pattern (Dictionary Accumulation)',
        patternCode: `for entry in ledger:
    cat = entry["category"]
    totals[cat] = round(totals.get(cat, 0.0) + entry["amount"], 2)`,
        patternExplanation: 'dict.get(cat, 0.0) provides 0.0 the first time a category appears.',
        expectedExample: 'totals_by_category([{"category": "Food", "amount": 10}, {"category": "Food", "amount": 5}]) -> {"Food": 15.0}',
        diagnosticExpr: 'totals_by_category([{"category": "Food", "amount": 10.0}, {"category": "Food", "amount": 5.5}])',
        breadcrumbs: {
          level1Concept: 'Loop over ledger and add entry["amount"] to totals.get(cat, 0.0).',
          level2Syntax: 'totals[cat] = round(totals.get(cat, 0.0) + entry["amount"], 2)',
          level3Scaffold: 'for entry in ledger:\n    cat = entry["category"]\n    totals[cat] = round(totals.get(cat, 0.0) + entry["amount"], 2)',
        },
        validationSnippet: 'sample = [{"category": "Food", "amount": 10.0}, {"category": "Travel", "amount": 25.0}, {"category": "Food", "amount": 5.5}]\nassert totals_by_category(sample) == {"Food": 15.5, "Travel": 25.0}',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Total, Average & Top Category',
        taskInstruction: 'In Cell 3 inside expense_summary(ledger), return {"total": total, "average": avg, "top_category": top_cat}.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Summary Metrics)',
        patternCode: `total = round(sum(e["amount"] for e in ledger), 2)
avg = round(total / len(ledger), 2)
by_cat = totals_by_category(ledger)
top_cat = max(by_cat, key=by_cat.get)`,
        patternExplanation: 'Combining sum(), len(), and max(..., key=by_cat.get) gives a complete spending snapshot.',
        expectedExample: 'expense_summary(sample)["top_category"] -> "Travel"',
        diagnosticExpr: 'expense_summary([{"category": "Food", "amount": 10.0}, {"category": "Travel", "amount": 25.0}])',
        breadcrumbs: {
          level1Concept: 'Compute total, avg = round(total / len(ledger), 2), and top_cat from totals_by_category(ledger).',
          level2Syntax: 'return {"total": total, "average": avg, "top_category": max(by_cat, key=by_cat.get)}',
          level3Scaffold: 'total = round(sum(e["amount"] for e in ledger), 2)\navg = round(total / len(ledger), 2)\nby_cat = totals_by_category(ledger)\ntop_cat = max(by_cat, key=by_cat.get)\nreturn {"total": total, "average": avg, "top_category": top_cat}',
        },
        validationSnippet: 'sample = [{"category": "Food", "amount": 10.0}, {"category": "Travel", "amount": 20.0}, {"category": "Food", "amount": 3.0}]\nassert expense_summary(sample) == {"total": 33.0, "average": 11.0, "top_category": "Travel"}',
      },
    ],
  },
  {
    id: 'bonus-todo-list-cli',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'To-Do List CLI',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    specificObjectives: ['3.1', '3.5', '4.3'],
    fileName: 'todo_list_cli.py',
    testFileName: 'test_todo_list_cli.py',
    keyTip: 'Generate unique task IDs using max((t["id"] for t in tasks), default=0) + 1 so deleting tasks never causes duplicate IDs.',
    pitfallWarning: 'Removing an item inside a list while looping over it skips items — build a filtered list or break right after finding the matching ID.',
    description: 'Create a command-line task manager with add, complete, delete, and filter options.',
    learningOutcomes: [
      'Assign auto-incrementing IDs for CLI tasks',
      'Implement add, complete, and delete operations cleanly',
      'Filter tasks by completion status ("all", "open", "done")',
    ],
    starterCode: '# To-Do List CLI',
    solutionCode: '# Solution: To-Do List CLI',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Initialize Task Queue',
        readOnly: true,
        starterCode: `cli_tasks = []`,
        solutionCode: `cli_tasks = []`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Add Task With Auto-Incrementing ID',
        starterCode: `# Cell 1 (Step 1): Add {"id": next_id, "title": title.strip(), "done": False}
def cli_add(tasks, title):
    next_id = max((t["id"] for t in tasks), default=0) + 1
    # TODO: Build task dict, append to tasks, and return task
    return {}

cli_add(cli_tasks, "Study loops")
cli_add(cli_tasks, "Practice slicing")
print("Tasks:", cli_tasks)`,
        solutionCode: `# Cell 1 (Step 1): Add {"id": next_id, "title": title.strip(), "done": False}
def cli_add(tasks, title):
    next_id = max((t["id"] for t in tasks), default=0) + 1
    task = {"id": next_id, "title": title.strip(), "done": False}
    tasks.append(task)
    return task

cli_add(cli_tasks, "Study loops")
cli_add(cli_tasks, "Practice slicing")
print("Tasks:", cli_tasks)`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Complete & Delete Tasks by ID',
        starterCode: `# Cell 2 (Step 2): Mark task done or delete it by numeric ID
def cli_complete(tasks, task_id):
    # TODO: Find task by id, set done = True, return True (else False)
    return False

def cli_delete(tasks, task_id):
    # TODO: Find task index by id, pop it, return True (else False)
    return False

print("Complete #1:", cli_complete(cli_tasks, 1))`,
        solutionCode: `# Cell 2 (Step 2): Mark task done or delete it by numeric ID
def cli_complete(tasks, task_id):
    for t in tasks:
        if t["id"] == task_id:
            t["done"] = True
            return True
    return False

def cli_delete(tasks, task_id):
    for idx, t in enumerate(tasks):
        if t["id"] == task_id:
            tasks.pop(idx)
            return True
    return False

print("Complete #1:", cli_complete(cli_tasks, 1))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Filter Tasks ("all", "open", "done")',
        starterCode: `# Cell 3 (Step 3): Filter tasks list by status mode
def cli_filter(tasks, mode="all"):
    # TODO: If mode == "open" return [t for t in tasks if not t["done"]];
    # if mode == "done" return [t for t in tasks if t["done"]]; else return list(tasks)
    return []

print("Open tasks:", cli_filter(cli_tasks, "open"))`,
        solutionCode: `# Cell 3 (Step 3): Filter tasks list by status mode
def cli_filter(tasks, mode="all"):
    if mode == "open":
        return [t for t in tasks if not t["done"]]
    if mode == "done":
        return [t for t in tasks if t["done"]]
    return list(tasks)

print("Open tasks:", cli_filter(cli_tasks, "open"))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Add Tasks With Unique IDs',
        taskInstruction: 'In Cell 1 inside cli_add(tasks, title), build task = {"id": next_id, "title": title.strip(), "done": False}, append it, and return task.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Safe ID Generation)',
        patternCode: `next_id = max((t["id"] for t in tasks), default=0) + 1
task = {"id": next_id, "title": title.strip(), "done": False}
tasks.append(task)`,
        patternExplanation: 'Using max(..., default=0) + 1 guarantees IDs never collide even after deletions.',
        expectedExample: 'cli_add([], "Read")["id"] -> 1',
        diagnosticExpr: 'cli_add([], "Read")',
        breadcrumbs: {
          level1Concept: 'Create task with next_id, append to tasks, and return task.',
          level2Syntax: 'task = {"id": next_id, "title": title.strip(), "done": False}\ntasks.append(task)\nreturn task',
          level3Scaffold: 'task = {"id": next_id, "title": title.strip(), "done": False}\ntasks.append(task)\nreturn task',
        },
        validationSnippet: 'ts = []\nt1 = cli_add(ts, "A")\nt2 = cli_add(ts, "B")\nassert t1["id"] == 1 and t2["id"] == 2 and t1["done"] is False',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Complete & Delete Operations',
        taskInstruction: 'In Cell 2, implement cli_complete() (sets t["done"] = True) and cli_delete() (pops matching index), each returning True if found else False.',
        targetObjectiveId: '3.1',
        patternTitle: 'Worked Pattern (Enumerate & Pop)',
        patternCode: `for idx, t in enumerate(tasks):
    if t["id"] == task_id:
        tasks.pop(idx)
        return True
return False`,
        patternExplanation: 'Popping at the matched index modifies the list in place and returns immediately.',
        expectedExample: 'cli_complete([{"id": 1, "done": False}], 1) -> True',
        diagnosticExpr: 'cli_complete([{"id": 1, "title": "A", "done": False}], 1)',
        breadcrumbs: {
          level1Concept: 'Loop over tasks; update t["done"] in cli_complete and tasks.pop(idx) in cli_delete.',
          level2Syntax: 'for idx, t in enumerate(tasks):\n    if t["id"] == task_id:\n        tasks.pop(idx)\n        return True',
          level3Scaffold: 'for t in tasks:\n    if t["id"] == task_id:\n        t["done"] = True\n        return True\nreturn False',
        },
        validationSnippet: 'ts = [{"id": 1, "title": "A", "done": False}, {"id": 2, "title": "B", "done": False}]\nassert cli_complete(ts, 1) is True and ts[0]["done"] is True\nassert cli_delete(ts, 2) is True and len(ts) == 1 and cli_delete(ts, 99) is False',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Filter Open vs Done Tasks',
        taskInstruction: 'In Cell 3 inside cli_filter(tasks, mode="all"), return open tasks when mode == "open", done tasks when mode == "done", and list(tasks) otherwise.',
        targetObjectiveId: '4.3',
        patternTitle: 'Worked Pattern (Conditional List Filtering)',
        patternCode: `if mode == "open":
    return [t for t in tasks if not t["done"]]`,
        patternExplanation: 'Filtering produces a fresh view without altering the underlying task list.',
        expectedExample: 'cli_filter(tasks, "done")',
        diagnosticExpr: 'len(cli_filter([{"id": 1, "done": True}, {"id": 2, "done": False}], "open"))',
        breadcrumbs: {
          level1Concept: 'Branch on mode == "open", mode == "done", and fallback list(tasks).',
          level2Syntax: 'if mode == "open": return [t for t in tasks if not t["done"]]',
          level3Scaffold: 'if mode == "open":\n    return [t for t in tasks if not t["done"]]\nif mode == "done":\n    return [t for t in tasks if t["done"]]\nreturn list(tasks)',
        },
        validationSnippet: 'ts = [{"id": 1, "done": True}, {"id": 2, "done": False}]\nassert len(cli_filter(ts, "open")) == 1 and len(cli_filter(ts, "done")) == 1 and len(cli_filter(ts, "all")) == 2',
      },
    ],
  },
  {
    id: 'bonus-number-stats-analyzer',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'Number Statistics Analyzer',
    sectionNumber: 4,
    sectionName: 'Functions and Exceptions',
    examWeightPercentage: 29,
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    specificObjectives: ['4.1', '4.3', '3.1'],
    fileName: 'number_stats_analyzer.py',
    testFileName: 'test_number_stats_analyzer.py',
    keyTip: 'Sorting first with sorted(nums) makes min, max, range, and median straightforward without mutating the input list.',
    pitfallWarning: 'Median works differently for odd vs even list lengths: even lengths average the two middle numbers (ordered[mid - 1] + ordered[mid]) / 2.',
    description: 'Accept a list of numbers and compute min, max, mean, and median-style insights.',
    learningOutcomes: [
      'Compute min, max, mean, and range cleanly',
      'Calculate median for both odd- and even-length datasets',
      'Detect outliers or above-average values',
    ],
    starterCode: '# Number Statistics Analyzer',
    solutionCode: '# Solution: Number Statistics Analyzer',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Compute Min, Max, Mean & Spread',
        starterCode: `# Cell 1 (Step 1): Compute basic descriptive stats; raise ValueError if empty
def basic_stats(numbers):
    if not numbers:
        raise ValueError("Dataset cannot be empty")
    # TODO: Return {"min": min(numbers), "max": max(numbers), "mean": round(sum(numbers)/len(numbers), 2), "range": max(numbers)-min(numbers)}
    return {}

print(basic_stats([10, 20, 30, 40]))`,
        solutionCode: `# Cell 1 (Step 1): Compute basic descriptive stats; raise ValueError if empty
def basic_stats(numbers):
    if not numbers:
        raise ValueError("Dataset cannot be empty")
    low = min(numbers)
    high = max(numbers)
    mean = round(sum(numbers) / len(numbers), 2)
    return {"min": low, "max": high, "mean": mean, "range": high - low}

print(basic_stats([10, 20, 30, 40]))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Compute Exact Median (Odd & Even Lengths)',
        starterCode: `# Cell 2 (Step 2): Compute median without mutating the original list
def compute_median(numbers):
    if not numbers:
        raise ValueError("Dataset cannot be empty")
    ordered = sorted(numbers)
    n = len(ordered)
    mid = n // 2
    # TODO: If n % 2 == 1 return float(ordered[mid]), else return (ordered[mid - 1] + ordered[mid]) / 2
    return 0.0

print("Median [10, 40, 20, 30]:", compute_median([10, 40, 20, 30]))`,
        solutionCode: `# Cell 2 (Step 2): Compute median without mutating the original list
def compute_median(numbers):
    if not numbers:
        raise ValueError("Dataset cannot be empty")
    ordered = sorted(numbers)
    n = len(ordered)
    mid = n // 2
    if n % 2 == 1:
        return float(ordered[mid])
    return (ordered[mid - 1] + ordered[mid]) / 2

print("Median [10, 40, 20, 30]:", compute_median([10, 40, 20, 30]))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Combine Full Statistical Insights',
        starterCode: `# Cell 3 (Step 3): Combine basic_stats, median, and count of above-mean values
def full_stats_report(numbers):
    stats = basic_stats(numbers)
    stats["median"] = compute_median(numbers)
    # TODO: Add stats["above_mean_count"] = sum(1 for x in numbers if x > stats["mean"])
    return stats

print(full_stats_report([5, 10, 15, 50]))`,
        solutionCode: `# Cell 3 (Step 3): Combine basic_stats, median, and count of above-mean values
def full_stats_report(numbers):
    stats = basic_stats(numbers)
    stats["median"] = compute_median(numbers)
    stats["above_mean_count"] = sum(1 for x in numbers if x > stats["mean"])
    return stats

print(full_stats_report([5, 10, 15, 50]))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Min, Max, Mean & Range',
        taskInstruction: 'In Cell 1 inside basic_stats(numbers), return {"min": low, "max": high, "mean": mean, "range": high - low}.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Descriptive Stats Dictionary)',
        patternCode: `low = min(numbers)
high = max(numbers)
mean = round(sum(numbers) / len(numbers), 2)
return {"min": low, "max": high, "mean": mean, "range": high - low}`,
        patternExplanation: 'Guarding empty lists avoids ValueError from min() and ZeroDivisionError from len().',
        expectedExample: 'basic_stats([10, 20, 30]) -> {"min": 10, "max": 30, "mean": 20.0, "range": 20}',
        diagnosticExpr: 'basic_stats([10, 20, 30])',
        breadcrumbs: {
          level1Concept: 'Use built-in min(), max(), sum(), and len().',
          level2Syntax: 'return {"min": min(numbers), "max": max(numbers), "mean": round(sum(numbers)/len(numbers), 2), "range": max(numbers)-min(numbers)}',
          level3Scaffold: 'low = min(numbers)\nhigh = max(numbers)\nmean = round(sum(numbers) / len(numbers), 2)\nreturn {"min": low, "max": high, "mean": mean, "range": high - low}',
        },
        validationSnippet: 'assert basic_stats([10, 20, 30, 40]) == {"min": 10, "max": 40, "mean": 25.0, "range": 30}',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Exact Median Calculation',
        taskInstruction: 'In Cell 2 inside compute_median(numbers), return float(ordered[mid]) when n is odd and (ordered[mid - 1] + ordered[mid]) / 2 when n is even.',
        targetObjectiveId: '3.1',
        patternTitle: 'Worked Pattern (Odd vs Even Median)',
        patternCode: `if n % 2 == 1:
    return float(ordered[mid])
return (ordered[mid - 1] + ordered[mid]) / 2`,
        patternExplanation: 'sorted(numbers) creates a sorted copy so the caller list remains unchanged.',
        expectedExample: 'compute_median([10, 40, 20, 30]) -> 25.0',
        diagnosticExpr: 'compute_median([10, 40, 20, 30])',
        breadcrumbs: {
          level1Concept: 'Check n % 2 == 1 for middle element; average middle two for even n.',
          level2Syntax: 'if n % 2 == 1: return float(ordered[mid])\nreturn (ordered[mid - 1] + ordered[mid]) / 2',
          level3Scaffold: 'if n % 2 == 1:\n    return float(ordered[mid])\nreturn (ordered[mid - 1] + ordered[mid]) / 2',
        },
        validationSnippet: 'assert compute_median([9, 1, 5]) == 5.0 and compute_median([10, 40, 20, 30]) == 25.0',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Full Insights Report',
        taskInstruction: 'In Cell 3 inside full_stats_report(numbers), add stats["above_mean_count"] = sum(1 for x in numbers if x > stats["mean"]) and return stats.',
        targetObjectiveId: '4.3',
        patternTitle: 'Worked Pattern (Above-Mean Counter)',
        patternCode: `stats["above_mean_count"] = sum(1 for x in numbers if x > stats["mean"])`,
        patternExplanation: 'A generator sum counts matching items without creating an intermediate list.',
        expectedExample: 'full_stats_report([5, 10, 15, 50])["above_mean_count"] -> 1',
        diagnosticExpr: 'full_stats_report([5, 10, 15, 50])',
        breadcrumbs: {
          level1Concept: 'Count numbers strictly greater than stats["mean"].',
          level2Syntax: 'stats["above_mean_count"] = sum(1 for x in numbers if x > stats["mean"])',
          level3Scaffold: 'stats["above_mean_count"] = sum(1 for x in numbers if x > stats["mean"])\nreturn stats',
        },
        validationSnippet: 'r = full_stats_report([5, 10, 15, 50])\nassert r["median"] == 12.5 and r["above_mean_count"] == 1',
      },
    ],
  },
  {
    id: 'bonus-word-frequency-counter',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'Word Frequency Counter',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    specificObjectives: ['3.5', '3.9', '4.1'],
    fileName: 'word_frequency_counter.py',
    testFileName: 'test_word_frequency_counter.py',
    keyTip: 'Strip punctuation from each token with word.strip(".,!?;:\'\\"()") and lowercase before counting.',
    pitfallWarning: 'Sorting ties consistently with key=lambda pair: (-pair[1], pair[0]) guarantees deterministic top-N results.',
    description: 'Analyze text and report the most common words and overall counts.',
    learningOutcomes: [
      'Tokenize and clean raw sentences into lowercase words',
      'Build a frequency histogram dictionary',
      'Rank the top-N most frequent words deterministically',
    ],
    starterCode: '# Word Frequency Counter',
    solutionCode: '# Solution: Word Frequency Counter',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Tokenize & Clean Text Words',
        starterCode: `# Cell 1 (Step 1): Split text into clean lowercase words without punctuation
def clean_words(text):
    words = []
    for raw in text.split():
        cleaned = raw.lower().strip(".,!?;:\\"'()")
        # TODO: Append cleaned to words if cleaned is non-empty
    return words

print(clean_words("Python is great, and Python is fun!"))`,
        solutionCode: `# Cell 1 (Step 1): Split text into clean lowercase words without punctuation
def clean_words(text):
    words = []
    for raw in text.split():
        cleaned = raw.lower().strip(".,!?;:\\"'()")
        if cleaned:
            words.append(cleaned)
    return words

print(clean_words("Python is great, and Python is fun!"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Build Frequency Dictionary',
        starterCode: `# Cell 2 (Step 2): Count occurrences of each cleaned word
def count_word_frequencies(text):
    freqs = {}
    # TODO: Loop over clean_words(text) and increment freqs[w] = freqs.get(w, 0) + 1
    return freqs

print(count_word_frequencies("Code, test, code!"))`,
        solutionCode: `# Cell 2 (Step 2): Count occurrences of each cleaned word
def count_word_frequencies(text):
    freqs = {}
    for w in clean_words(text):
        freqs[w] = freqs.get(w, 0) + 1
    return freqs

print(count_word_frequencies("Code, test, code!"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Top-N Common Words & Overall Metrics',
        starterCode: `# Cell 3 (Step 3): Return {"total_words": ..., "unique_words": ..., "top_words": [(word, count), ...]}
def analyze_text(text, top_n=3):
    words = clean_words(text)
    freqs = count_word_frequencies(text)
    # TODO: Sort freqs.items() by (-count, word) and slice [:top_n]
    return {"total_words": len(words), "unique_words": len(freqs), "top_words": []}

print(analyze_text("Red fish, blue fish, one fish, two fish.", top_n=2))`,
        solutionCode: `# Cell 3 (Step 3): Return {"total_words": ..., "unique_words": ..., "top_words": [(word, count), ...]}
def analyze_text(text, top_n=3):
    words = clean_words(text)
    freqs = count_word_frequencies(text)
    ranked = sorted(freqs.items(), key=lambda pair: (-pair[1], pair[0]))
    return {
        "total_words": len(words),
        "unique_words": len(freqs),
        "top_words": ranked[:top_n],
    }

print(analyze_text("Red fish, blue fish, one fish, two fish.", top_n=2))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Clean & Lowercase Tokens',
        taskInstruction: 'In Cell 1 inside clean_words(text), append cleaned to words only when cleaned is non-empty.',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Word Cleaning)',
        patternCode: `cleaned = raw.lower().strip(".,!?;:\\"'()")
if cleaned:
    words.append(cleaned)`,
        patternExplanation: 'Checking if cleaned skips standalone punctuation tokens like "--".',
        expectedExample: 'clean_words("Hi, hi!") -> ["hi", "hi"]',
        diagnosticExpr: 'clean_words("Hi, hi!")',
        breadcrumbs: {
          level1Concept: 'Guard against empty strings after stripping punctuation.',
          level2Syntax: 'if cleaned:\n    words.append(cleaned)',
          level3Scaffold: 'if cleaned:\n    words.append(cleaned)',
        },
        validationSnippet: 'assert clean_words("Python is great, Python!") == ["python", "is", "great", "python"]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Frequency Histogram',
        taskInstruction: 'In Cell 2 inside count_word_frequencies(text), count each word from clean_words(text) using freqs.get(w, 0) + 1.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Frequency Counting)',
        patternCode: `for w in clean_words(text):
    freqs[w] = freqs.get(w, 0) + 1`,
        patternExplanation: 'dict.get(w, 0) returns 0 for unseen words cleanly.',
        expectedExample: 'count_word_frequencies("Code, test, code!") -> {"code": 2, "test": 1}',
        diagnosticExpr: 'count_word_frequencies("Code, test, code!")',
        breadcrumbs: {
          level1Concept: 'Iterate over clean_words(text) and update freqs[w].',
          level2Syntax: 'for w in clean_words(text):\n    freqs[w] = freqs.get(w, 0) + 1',
          level3Scaffold: 'for w in clean_words(text):\n    freqs[w] = freqs.get(w, 0) + 1',
        },
        validationSnippet: 'assert count_word_frequencies("Code, test, code!") == {"code": 2, "test": 1}',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Rank Top-N Words',
        taskInstruction: 'In Cell 3 inside analyze_text(text, top_n=3), sort freqs.items() by (-pair[1], pair[0]) and slice [:top_n].',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Descending Count, Ascending Tie-Break)',
        patternCode: `ranked = sorted(freqs.items(), key=lambda pair: (-pair[1], pair[0]))
top_words = ranked[:top_n]`,
        patternExplanation: 'Negating count sorts highest counts first while pair[0] breaks ties alphabetically.',
        expectedExample: 'analyze_text("a b a", top_n=1)["top_words"] -> [("a", 2)]',
        diagnosticExpr: 'analyze_text("a b a", top_n=1)',
        breadcrumbs: {
          level1Concept: 'Sort freqs.items() with key=lambda p: (-p[1], p[0]) and slice [:top_n].',
          level2Syntax: 'ranked = sorted(freqs.items(), key=lambda pair: (-pair[1], pair[0]))',
          level3Scaffold: 'ranked = sorted(freqs.items(), key=lambda pair: (-pair[1], pair[0]))\nreturn {"total_words": len(words), "unique_words": len(freqs), "top_words": ranked[:top_n]}',
        },
        validationSnippet: 'res = analyze_text("Red fish, blue fish, one fish, two fish.", top_n=2)\nassert res["total_words"] == 8 and res["unique_words"] == 5 and res["top_words"][0] == ("fish", 4)',
      },
    ],
  },
  {
    id: 'bonus-password-strength-checker',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'Password Strength Checker',
    sectionNumber: 2,
    sectionName: 'Control Flow - Conditional Blocks and Loops',
    examWeightPercentage: 29,
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    specificObjectives: ['2.1', '3.9', '4.1'],
    fileName: 'password_strength.py',
    testFileName: 'test_password_strength.py',
    keyTip: 'Use Python any(...) generator expressions like any(c.isupper() for c in pw) to test character variety concisely.',
    pitfallWarning: 'Check for common weak passwords in lowercase so "PASSWORD" or "Qwerty123" still triggers a penalty.',
    description: 'Score passwords based on length, character variety, and common patterns.',
    learningOutcomes: [
      'Inspect uppercase, lowercase, digit, and symbol variety',
      'Penalize predictable passwords and repeated characters',
      'Classify final numeric scores into Weak, Moderate, and Strong tiers',
    ],
    starterCode: '# Password Strength Checker',
    solutionCode: '# Solution: Password Strength Checker',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Common Weak Patterns',
        readOnly: true,
        starterCode: `COMMON_WEAK = {"password", "123456", "qwerty", "letmein", "admin123"}`,
        solutionCode: `COMMON_WEAK = {"password", "123456", "qwerty", "letmein", "admin123"}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Inspect Character Variety Flags',
        starterCode: `# Cell 1 (Step 1): Return dict of booleans for upper, lower, digit, symbol
def inspect_variety(pw):
    # TODO: Use any(ch.isupper() for ch in pw), .islower(), .isdigit(), and symbol (not ch.isalnum())
    return {"upper": False, "lower": False, "digit": False, "symbol": False}

print(inspect_variety("PyCert!3"))`,
        solutionCode: `# Cell 1 (Step 1): Return dict of booleans for upper, lower, digit, symbol
def inspect_variety(pw):
    return {
        "upper": any(ch.isupper() for ch in pw),
        "lower": any(ch.islower() for ch in pw),
        "digit": any(ch.isdigit() for ch in pw),
        "symbol": any(not ch.isalnum() for ch in pw),
    }

print(inspect_variety("PyCert!3"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Score Password Strength (0-100)',
        starterCode: `# Cell 2 (Step 2): Score up to 100 based on length, variety, and common pattern penalty
def score_password(pw):
    if pw.lower() in COMMON_WEAK:
        return 10
    score = 0
    if len(pw) >= 8:
        score += 30
    if len(pw) >= 12:
        score += 20
    # TODO: Add 12 points per True flag in inspect_variety(pw).values(), plus 2 penalty check (-15 if len(set(pw)) < 4)
    return max(0, min(100, score))

print("Score 'PyCert!30-03':", score_password("PyCert!30-03"))`,
        solutionCode: `# Cell 2 (Step 2): Score up to 100 based on length, variety, and common pattern penalty
def score_password(pw):
    if pw.lower() in COMMON_WEAK:
        return 10
    score = 0
    if len(pw) >= 8:
        score += 30
    if len(pw) >= 12:
        score += 20
    variety = inspect_variety(pw)
    score += sum(12 for has_type in variety.values() if has_type)
    if len(set(pw)) < 4:
        score -= 15
    return max(0, min(100, score))

print("Score 'PyCert!30-03':", score_password("PyCert!30-03"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Assign Strength Rating Label',
        starterCode: `# Cell 3 (Step 3): Return {"score": s, "rating": "Strong"|"Moderate"|"Weak"}
def rate_password(pw):
    s = score_password(pw)
    # TODO: >= 75 -> "Strong", >= 45 -> "Moderate", else "Weak"
    return {"score": s, "rating": ""}

print(rate_password("password"), "|", rate_password("PyCert!30-03"))`,
        solutionCode: `# Cell 3 (Step 3): Return {"score": s, "rating": "Strong"|"Moderate"|"Weak"}
def rate_password(pw):
    s = score_password(pw)
    if s >= 75:
        rating = "Strong"
    elif s >= 45:
        rating = "Moderate"
    else:
        rating = "Weak"
    return {"score": s, "rating": rating}

print(rate_password("password"), "|", rate_password("PyCert!30-03"))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Character Variety Flags',
        taskInstruction: 'In Cell 1 inside inspect_variety(pw), check upper, lower, digit, and symbol (not ch.isalnum()) using any().',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (any() Variety Check)',
        patternCode: `has_upper = any(ch.isupper() for ch in pw)
has_symbol = any(not ch.isalnum() for ch in pw)`,
        patternExplanation: 'any() stops scanning as soon as one matching character is found.',
        expectedExample: 'inspect_variety("Ab1!") -> {"upper": True, "lower": True, "digit": True, "symbol": True}',
        diagnosticExpr: 'inspect_variety("Ab1!")',
        breadcrumbs: {
          level1Concept: 'Check each character class with any(... for ch in pw).',
          level2Syntax: '"upper": any(ch.isupper() for ch in pw)',
          level3Scaffold: 'return {\n    "upper": any(ch.isupper() for ch in pw),\n    "lower": any(ch.islower() for ch in pw),\n    "digit": any(ch.isdigit() for ch in pw),\n    "symbol": any(not ch.isalnum() for ch in pw),\n}',
        },
        validationSnippet: 'assert inspect_variety("PyCert!3") == {"upper": True, "lower": True, "digit": True, "symbol": True} and inspect_variety("abc")["digit"] is False',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Password Score Calculation',
        taskInstruction: 'In Cell 2 inside score_password(pw), add 12 points for each True variety flag and subtract 15 if len(set(pw)) < 4.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Weighted Score & Clamp)',
        patternCode: `score += sum(12 for has_type in variety.values() if has_type)
if len(set(pw)) < 4:
    score -= 15
return max(0, min(100, score))`,
        patternExplanation: 'max(0, min(100, score)) clamps the final score neatly between 0 and 100.',
        expectedExample: 'score_password("PyCert!30-03") -> 98',
        diagnosticExpr: 'score_password("PyCert!30-03")',
        breadcrumbs: {
          level1Concept: 'Add 12 points per True flag in inspect_variety(pw) and penalize low unique char counts.',
          level2Syntax: 'variety = inspect_variety(pw)\nscore += sum(12 for v in variety.values() if v)',
          level3Scaffold: 'variety = inspect_variety(pw)\nscore += sum(12 for has_type in variety.values() if has_type)\nif len(set(pw)) < 4:\n    score -= 15',
        },
        validationSnippet: 'assert score_password("password") == 10 and score_password("PyCert!30-03") >= 90 and score_password("aaaaaaaa") < 40',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Tier Rating Classifier',
        taskInstruction: 'In Cell 3 inside rate_password(pw), assign "Strong" (>=75), "Moderate" (>=45), or "Weak".',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Rating Thresholds)',
        patternCode: `if s >= 75: rating = "Strong"
elif s >= 45: rating = "Moderate"
else: rating = "Weak"`,
        patternExplanation: 'Descending threshold checks classify scores cleanly into three tiers.',
        expectedExample: 'rate_password("PyCert!30-03")["rating"] -> "Strong"',
        diagnosticExpr: 'rate_password("PyCert!30-03")',
        breadcrumbs: {
          level1Concept: 'Use if/elif/else for >= 75 and >= 45.',
          level2Syntax: 'if s >= 75: rating = "Strong"\nelif s >= 45: rating = "Moderate"\nelse: rating = "Weak"',
          level3Scaffold: 'if s >= 75:\n    rating = "Strong"\nelif s >= 45:\n    rating = "Moderate"\nelse:\n    rating = "Weak"',
        },
        validationSnippet: 'assert rate_password("password")["rating"] == "Weak" and rate_password("PyCert!30-03")["rating"] == "Strong"',
      },
    ],
  },
  {
    id: 'bonus-contact-book',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'Contact Book',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    specificObjectives: ['3.5', '3.6', '4.1'],
    fileName: 'contact_book.py',
    testFileName: 'test_contact_book.py',
    keyTip: 'Store contacts in a dictionary keyed by lowercase name (or normalized key) for instant O(1) lookup, update, and deletion.',
    pitfallWarning: 'When searching by partial query, match query.lower() against both the contact name and email or phone string.',
    description: 'Store, search, update, and delete contact records in a structured format.',
    learningOutcomes: [
      'Model contact records inside a dictionary keyed by normalized name',
      'Implement substring search across contact fields',
      'Perform clean updates and safe deletions',
    ],
    starterCode: '# Contact Book',
    solutionCode: '# Solution: Contact Book',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Initialize Contacts Dictionary',
        readOnly: true,
        starterCode: `contacts = {}`,
        solutionCode: `contacts = {}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Add or Upsert Contact Records',
        starterCode: `# Cell 1 (Step 1): Store contact under name.strip().lower()
def save_contact(book, name, phone, email=""):
    key = name.strip().lower()
    # TODO: Store {"name": name.strip(), "phone": phone.strip(), "email": email.strip()} in book[key] and return it
    return {}

save_contact(contacts, "Ada Lovelace", "555-0101", "ada@analytical.org")
save_contact(contacts, "Grace Hopper", "555-0199", "grace@navy.mil")
print("Saved:", list(contacts.keys()))`,
        solutionCode: `# Cell 1 (Step 1): Store contact under name.strip().lower()
def save_contact(book, name, phone, email=""):
    key = name.strip().lower()
    record = {"name": name.strip(), "phone": phone.strip(), "email": email.strip()}
    book[key] = record
    return record

save_contact(contacts, "Ada Lovelace", "555-0101", "ada@analytical.org")
save_contact(contacts, "Grace Hopper", "555-0199", "grace@navy.mil")
print("Saved:", list(contacts.keys()))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Search Contacts Case-Insensitively',
        starterCode: `# Cell 2 (Step 2): Return sorted list of matching contact dicts where query appears in name or email
def search_contacts(book, query):
    q = query.strip().lower()
    # TODO: Find all records in book.values() matching q in name.lower() or email.lower(), sorted by name
    return []

print("Search 'ada':", search_contacts(contacts, "ada"))`,
        solutionCode: `# Cell 2 (Step 2): Return sorted list of matching contact dicts where query appears in name or email
def search_contacts(book, query):
    q = query.strip().lower()
    matches = [
        rec for rec in book.values()
        if q in rec["name"].lower() or q in rec["email"].lower()
    ]
    return sorted(matches, key=lambda rec: rec["name"])

print("Search 'ada':", search_contacts(contacts, "ada"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Update Phone & Delete Contact',
        starterCode: `# Cell 3 (Step 3): Update an existing contact's phone or delete a contact safely
def update_phone(book, name, new_phone):
    key = name.strip().lower()
    # TODO: If key in book, update phone and return True; else return False
    return False

def delete_contact(book, name):
    key = name.strip().lower()
    # TODO: Use book.pop(key, None) is not None
    return False

print("Update Ada:", update_phone(contacts, "Ada Lovelace", "555-9999"))`,
        solutionCode: `# Cell 3 (Step 3): Update an existing contact's phone or delete a contact safely
def update_phone(book, name, new_phone):
    key = name.strip().lower()
    if key in book:
        book[key]["phone"] = new_phone.strip()
        return True
    return False

def delete_contact(book, name):
    key = name.strip().lower()
    return book.pop(key, None) is not None

print("Update Ada:", update_phone(contacts, "Ada Lovelace", "555-9999"))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Add Contact Record',
        taskInstruction: 'In Cell 1 inside save_contact(book, name, phone, email=""), store the record dict under book[key] and return it.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Keyed Dictionary Storage)',
        patternCode: `key = name.strip().lower()
record = {"name": name.strip(), "phone": phone.strip(), "email": email.strip()}
book[key] = record
return record`,
        patternExplanation: 'Lowercasing the dictionary key guarantees case-insensitive lookups later.',
        expectedExample: 'save_contact({}, "Ada", "555-0101")["name"] -> "Ada"',
        diagnosticExpr: 'save_contact({}, "Ada", "555-0101")',
        breadcrumbs: {
          level1Concept: 'Create the record dictionary and assign it to book[key].',
          level2Syntax: 'record = {"name": name.strip(), "phone": phone.strip(), "email": email.strip()}\nbook[key] = record',
          level3Scaffold: 'record = {"name": name.strip(), "phone": phone.strip(), "email": email.strip()}\nbook[key] = record\nreturn record',
        },
        validationSnippet: 'b = {}\nr = save_contact(b, " Ada ", "555-0101", "ada@ex.org")\nassert "ada" in b and r["phone"] == "555-0101"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Substring Search',
        taskInstruction: 'In Cell 2 inside search_contacts(book, query), filter records where q appears in name or email, sorted by rec["name"].',
        targetObjectiveId: '3.6',
        patternTitle: 'Worked Pattern (Multi-Field Substring Filter)',
        patternCode: `matches = [
    rec for rec in book.values()
    if q in rec["name"].lower() or q in rec["email"].lower()
]
return sorted(matches, key=lambda rec: rec["name"])`,
        patternExplanation: 'Checking both name and email makes search intuitive.',
        expectedExample: 'search_contacts(contacts, "navy")',
        diagnosticExpr: 'len(search_contacts({"ada": {"name": "Ada", "phone": "1", "email": "ada@org"}}, "ada"))',
        breadcrumbs: {
          level1Concept: 'Filter book.values() where q is in name.lower() or email.lower().',
          level2Syntax: 'sorted([r for r in book.values() if q in r["name"].lower() or q in r["email"].lower()], key=lambda r: r["name"])',
          level3Scaffold: 'matches = [rec for rec in book.values() if q in rec["name"].lower() or q in rec["email"].lower()]\nreturn sorted(matches, key=lambda rec: rec["name"])',
        },
        validationSnippet: 'b = {"ada": {"name": "Ada", "phone": "1", "email": "ada@ex.org"}, "bob": {"name": "Bob", "phone": "2", "email": "bob@ex.org"}}\nassert len(search_contacts(b, "ada")) == 1 and len(search_contacts(b, "ex.org")) == 2',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Update & Delete Safely',
        taskInstruction: 'In Cell 3, update book[key]["phone"] inside update_phone() and pop with default None inside delete_contact().',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Safe Dict Pop)',
        patternCode: `return book.pop(key, None) is not None`,
        patternExplanation: 'Passing default None to dict.pop() prevents KeyError when deleting unknown names.',
        expectedExample: 'delete_contact({"ada": {}}, "Ada") -> True',
        diagnosticExpr: 'delete_contact({"ada": {"name": "Ada"}}, "Ada")',
        breadcrumbs: {
          level1Concept: 'Check key in book before updating; use book.pop(key, None) is not None for deletion.',
          level2Syntax: 'if key in book:\n    book[key]["phone"] = new_phone.strip()\n    return True',
          level3Scaffold: 'if key in book:\n    book[key]["phone"] = new_phone.strip()\n    return True\nreturn False',
        },
        validationSnippet: 'b = {}\nsave_contact(b, "Ada", "111")\nassert update_phone(b, "ada", "222") is True and b["ada"]["phone"] == "222"\nassert delete_contact(b, "ADA") is True and delete_contact(b, "ADA") is False',
      },
    ],
  },
  {
    id: 'bonus-rock-paper-scissors',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'Rock-Paper-Scissors Game',
    sectionNumber: 2,
    sectionName: 'Control Flow - Conditional Blocks and Loops',
    examWeightPercentage: 29,
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    specificObjectives: ['2.1', '3.5', '5.3'],
    fileName: 'rock_paper_scissors.py',
    testFileName: 'test_rock_paper_scissors.py',
    keyTip: 'Define a dictionary BEATS = {"rock": "scissors", "paper": "rock", "scissors": "paper"} to resolve any matchup in one line!',
    pitfallWarning: 'Validate user choices against ("rock", "paper", "scissors") after calling .strip().lower() before comparing.',
    description: 'Add score tracking and multiple rounds against the computer.',
    learningOutcomes: [
      'Resolve game matchups cleanly with a lookup map instead of 9 nested ifs',
      'Track wins, losses, and ties across multi-round matches',
      'Generate reproducible computer moves with random.choice()',
    ],
    starterCode: '# Rock-Paper-Scissors Game',
    solutionCode: '# Solution: Rock-Paper-Scissors Game',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Import random & Define Matchup Rules',
        readOnly: true,
        starterCode: `import random

BEATS = {
    "rock": "scissors",
    "paper": "rock",
    "scissors": "paper",
}`,
        solutionCode: `import random

BEATS = {
    "rock": "scissors",
    "paper": "rock",
    "scissors": "paper",
}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Resolve One Round Winner',
        starterCode: `# Cell 1 (Step 1): Return "tie", "player", or "computer"
def resolve_round(player_move, cpu_move):
    p = player_move.strip().lower()
    c = cpu_move.strip().lower()
    if p not in BEATS or c not in BEATS:
        raise ValueError("Invalid move")
    # TODO: Return "tie" if p == c, "player" if BEATS[p] == c, else "computer"
    return ""

print("Rock vs Scissors:", resolve_round("rock", "scissors"))`,
        solutionCode: `# Cell 1 (Step 1): Return "tie", "player", or "computer"
def resolve_round(player_move, cpu_move):
    p = player_move.strip().lower()
    c = cpu_move.strip().lower()
    if p not in BEATS or c not in BEATS:
        raise ValueError("Invalid move")
    if p == c:
        return "tie"
    return "player" if BEATS[p] == c else "computer"

print("Rock vs Scissors:", resolve_round("rock", "scissors"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Play Multi-Round Match With Scoreboard',
        starterCode: `# Cell 2 (Step 2): Simulate multi-round play and return {"player": ..., "computer": ..., "ties": ..., "winner": ...}
def play_match(player_moves, cpu_moves):
    scores = {"player": 0, "computer": 0, "ties": 0}
    # TODO: Loop zip(player_moves, cpu_moves), resolve_round(pm, cm), update scores
    # Set winner to "player", "computer", or "tie"
    scores["winner"] = "tie"
    return scores

print(play_match(["rock", "paper", "scissors"], ["scissors", "scissors", "paper"]))`,
        solutionCode: `# Cell 2 (Step 2): Simulate multi-round play and return {"player": ..., "computer": ..., "ties": ..., "winner": ...}
def play_match(player_moves, cpu_moves):
    scores = {"player": 0, "computer": 0, "ties": 0}
    for pm, cm in zip(player_moves, cpu_moves):
        outcome = resolve_round(pm, cm)
        if outcome == "player":
            scores["player"] += 1
        elif outcome == "computer":
            scores["computer"] += 1
        else:
            scores["ties"] += 1
    if scores["player"] > scores["computer"]:
        scores["winner"] = "player"
    elif scores["computer"] > scores["player"]:
        scores["winner"] = "computer"
    else:
        scores["winner"] = "tie"
    return scores

print(play_match(["rock", "paper", "scissors"], ["scissors", "scissors", "paper"]))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Seeded Random CPU Move Generator',
        starterCode: `# Cell 3 (Step 3): Generate n random CPU moves using optional seed for repeatability
def generate_cpu_moves(rounds, seed=None):
    rng = random.Random(seed)
    choices = list(BEATS.keys())
    # TODO: Return [rng.choice(choices) for _ in range(rounds)]
    return []

print("3 seeded moves:", generate_cpu_moves(3, seed=42))`,
        solutionCode: `# Cell 3 (Step 3): Generate n random CPU moves using optional seed for repeatability
def generate_cpu_moves(rounds, seed=None):
    rng = random.Random(seed)
    choices = list(BEATS.keys())
    return [rng.choice(choices) for _ in range(rounds)]

print("3 seeded moves:", generate_cpu_moves(3, seed=42))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Resolve Matchup via Lookup Dict',
        taskInstruction: 'In Cell 1 inside resolve_round(player_move, cpu_move), return "tie" if p == c, "player" if BEATS[p] == c, else "computer".',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Rules Dictionary)',
        patternCode: `if p == c:
    return "tie"
return "player" if BEATS[p] == c else "computer"`,
        patternExplanation: 'A 3-entry dictionary replaces all 9 branching comparisons.',
        expectedExample: 'resolve_round("rock", "scissors") -> "player"',
        diagnosticExpr: 'resolve_round("rock", "scissors")',
        breadcrumbs: {
          level1Concept: 'Check p == c first, then BEATS[p] == c.',
          level2Syntax: 'if p == c: return "tie"\nreturn "player" if BEATS[p] == c else "computer"',
          level3Scaffold: 'if p == c:\n    return "tie"\nreturn "player" if BEATS[p] == c else "computer"',
        },
        validationSnippet: 'assert resolve_round("rock", "scissors") == "player" and resolve_round("rock", "paper") == "computer" and resolve_round("rock", "rock") == "tie"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Multi-Round Scoreboard',
        taskInstruction: 'In Cell 2 inside play_match(), count wins/losses/ties across zip(player_moves, cpu_moves) and determine the overall winner.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Round Score Aggregation)',
        patternCode: `for pm, cm in zip(player_moves, cpu_moves):
    outcome = resolve_round(pm, cm)`,
        patternExplanation: 'Comparing scores["player"] against scores["computer"] declares the match winner cleanly.',
        expectedExample: 'play_match(["rock", "paper"], ["scissors", "rock"])["winner"] -> "player"',
        diagnosticExpr: 'play_match(["rock", "paper"], ["scissors", "rock"])',
        breadcrumbs: {
          level1Concept: 'Tally each round outcome into scores, then compare player vs computer totals.',
          level2Syntax: 'if scores["player"] > scores["computer"]: scores["winner"] = "player"',
          level3Scaffold: 'for pm, cm in zip(player_moves, cpu_moves):\n    outcome = resolve_round(pm, cm)\n    if outcome == "player": scores["player"] += 1\n    elif outcome == "computer": scores["computer"] += 1\n    else: scores["ties"] += 1',
        },
        validationSnippet: 'r = play_match(["rock", "paper", "scissors"], ["scissors", "scissors", "paper"])\nassert r == {"player": 2, "computer": 1, "ties": 0, "winner": "player"}',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Random CPU Move Generator',
        taskInstruction: 'In Cell 3 inside generate_cpu_moves(rounds, seed=None), return [rng.choice(choices) for _ in range(rounds)].',
        targetObjectiveId: '5.3',
        patternTitle: 'Worked Pattern (Local Seeded RNG)',
        patternCode: `rng = random.Random(seed)
return [rng.choice(choices) for _ in range(rounds)]`,
        patternExplanation: 'Using random.Random(seed) keeps tests deterministic without touching global random state.',
        expectedExample: 'len(generate_cpu_moves(5, seed=7)) -> 5',
        diagnosticExpr: 'generate_cpu_moves(3, seed=42)',
        breadcrumbs: {
          level1Concept: 'Call rng.choice(choices) rounds times inside a list comprehension.',
          level2Syntax: 'return [rng.choice(choices) for _ in range(rounds)]',
          level3Scaffold: 'return [rng.choice(choices) for _ in range(rounds)]',
        },
        validationSnippet: 'm1 = generate_cpu_moves(4, seed=42)\nm2 = generate_cpu_moves(4, seed=42)\nassert len(m1) == 4 and m1 == m2 and all(m in BEATS for m in m1)',
      },
    ],
  },
  {
    id: 'bonus-file-word-counter',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'File Word Counter',
    sectionNumber: 4,
    sectionName: 'Functions and Exceptions',
    examWeightPercentage: 29,
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    specificObjectives: ['4.6', '3.9', '5.1'],
    fileName: 'file_word_counter.py',
    testFileName: 'test_file_word_counter.py',
    keyTip: 'Always open files with "with open(path, "r", encoding="utf-8") as f:" so Python closes the file handle automatically.',
    pitfallWarning: 'Remember to handle FileNotFoundError cleanly when analyzing file paths supplied by users.',
    description: 'Read a text file and count words, lines, and characters.',
    learningOutcomes: [
      'Write and read text files safely using with open()',
      'Compute lines, words, and character counts accurately',
      'Catch FileNotFoundError and report missing file paths gracefully',
    ],
    starterCode: '# File Word Counter',
    solutionCode: '# Solution: File Word Counter',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Create Sample Text File',
        readOnly: true,
        starterCode: `SAMPLE_FILE = "notes.txt"
with open(SAMPLE_FILE, "w", encoding="utf-8") as f:
    f.write("Python builds clarity.\\nFunctions keep code clean.\\nTest every step.")`,
        solutionCode: `SAMPLE_FILE = "notes.txt"
with open(SAMPLE_FILE, "w", encoding="utf-8") as f:
    f.write("Python builds clarity.\\nFunctions keep code clean.\\nTest every step.")`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Count Lines, Words & Characters From Text',
        starterCode: `# Cell 1 (Step 1): Compute {"lines": ..., "words": ..., "chars": ...} for raw text
def count_text_metrics(content):
    lines = content.splitlines()
    # TODO: Return {"lines": len(lines), "words": len(content.split()), "chars": len(content)}
    return {}

print(count_text_metrics("Hello world\\nSecond line"))`,
        solutionCode: `# Cell 1 (Step 1): Compute {"lines": ..., "words": ..., "chars": ...} for raw text
def count_text_metrics(content):
    lines = content.splitlines()
    return {
        "lines": len(lines),
        "words": len(content.split()),
        "chars": len(content),
    }

print(count_text_metrics("Hello world\\nSecond line"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Read File Safely With Exception Handling',
        starterCode: `# Cell 2 (Step 2): Open filepath, read content, and return count_text_metrics(content) or {"error": "File not found"}
def analyze_file(filepath):
    # TODO: Wrap with open(filepath, "r", encoding="utf-8") inside try/except FileNotFoundError
    return {}

print("notes.txt ->", analyze_file(SAMPLE_FILE))
print("missing.txt ->", analyze_file("missing.txt"))`,
        solutionCode: `# Cell 2 (Step 2): Open filepath, read content, and return count_text_metrics(content) or {"error": "File not found"}
def analyze_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        return count_text_metrics(content)
    except FileNotFoundError:
        return {"error": "File not found"}

print("notes.txt ->", analyze_file(SAMPLE_FILE))
print("missing.txt ->", analyze_file("missing.txt"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Report Longest Word in File',
        starterCode: `# Cell 3 (Step 3): Return the longest cleaned word in a file (or "" if missing/empty)
def longest_word_in_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            words = [w.strip(".,!?;:") for w in f.read().split()]
        # TODO: Return max(words, key=len) if words else ""
        return ""
    except FileNotFoundError:
        return ""

print("Longest word:", longest_word_in_file(SAMPLE_FILE))`,
        solutionCode: `# Cell 3 (Step 3): Return the longest cleaned word in a file (or "" if missing/empty)
def longest_word_in_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            words = [w.strip(".,!?;:") for w in f.read().split()]
        return max(words, key=len) if words else ""
    except FileNotFoundError:
        return ""

print("Longest word:", longest_word_in_file(SAMPLE_FILE))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Count Lines, Words & Chars',
        taskInstruction: 'In Cell 1 inside count_text_metrics(content), return {"lines": len(lines), "words": len(content.split()), "chars": len(content)}.',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Text Metrics)',
        patternCode: `lines = content.splitlines()
return {"lines": len(lines), "words": len(content.split()), "chars": len(content)}`,
        patternExplanation: 'splitlines() handles all newline formats without leaving trailing \\n characters.',
        expectedExample: 'count_text_metrics("Hi there\\nFriend") -> {"lines": 2, "words": 3, "chars": 15}',
        diagnosticExpr: 'count_text_metrics("Hi there\\nFriend")',
        breadcrumbs: {
          level1Concept: 'Use .splitlines(), .split(), and len(content).',
          level2Syntax: 'return {"lines": len(lines), "words": len(content.split()), "chars": len(content)}',
          level3Scaffold: 'lines = content.splitlines()\nreturn {"lines": len(lines), "words": len(content.split()), "chars": len(content)}',
        },
        validationSnippet: 'assert count_text_metrics("Hi there\\nFriend") == {"lines": 2, "words": 3, "chars": 15}',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Read File With FileNotFoundError Guard',
        taskInstruction: 'In Cell 2 inside analyze_file(filepath), read the file with open() inside try/except FileNotFoundError.',
        targetObjectiveId: '4.6',
        patternTitle: 'Worked Pattern (Context Manager File Read)',
        patternCode: `try:
    with open(filepath, "r", encoding="utf-8") as f:
        return count_text_metrics(f.read())
except FileNotFoundError:
    return {"error": "File not found"}`,
        patternExplanation: 'Catching FileNotFoundError turns missing paths into predictable return values.',
        expectedExample: 'analyze_file("notes.txt")["lines"] -> 3',
        diagnosticExpr: 'analyze_file(SAMPLE_FILE)',
        breadcrumbs: {
          level1Concept: 'Open filepath inside try/except FileNotFoundError and pass f.read() to count_text_metrics().',
          level2Syntax: 'with open(filepath, "r", encoding="utf-8") as f:\n    content = f.read()',
          level3Scaffold: 'try:\n    with open(filepath, "r", encoding="utf-8") as f:\n        content = f.read()\n    return count_text_metrics(content)\nexcept FileNotFoundError:\n    return {"error": "File not found"}',
        },
        validationSnippet: 'assert analyze_file(SAMPLE_FILE)["lines"] == 3 and analyze_file("nope.txt") == {"error": "File not found"}',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Find Longest Word',
        taskInstruction: 'In Cell 3 inside longest_word_in_file(filepath), return max(words, key=len) if words else "".',
        targetObjectiveId: '5.1',
        patternTitle: 'Worked Pattern (Longest String with max)',
        patternCode: `return max(words, key=len) if words else ""`,
        patternExplanation: 'Passing key=len to max() selects the longest word cleanly.',
        expectedExample: 'longest_word_in_file(SAMPLE_FILE) -> "Functions"',
        diagnosticExpr: 'longest_word_in_file(SAMPLE_FILE)',
        breadcrumbs: {
          level1Concept: 'Return max(words, key=len) when words is non-empty.',
          level2Syntax: 'return max(words, key=len) if words else ""',
          level3Scaffold: 'return max(words, key=len) if words else ""',
        },
        validationSnippet: 'assert longest_word_in_file(SAMPLE_FILE) == "Functions" and longest_word_in_file("missing.txt") == ""',
      },
    ],
  },
  {
    id: 'bonus-quiz-question-bank',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'Quiz App with Question Bank',
    sectionNumber: 5,
    sectionName: 'Standard Library & File Persistence',
    examWeightPercentage: 15,
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    specificObjectives: ['5.2', '5.3', '4.1'],
    fileName: 'quiz_question_bank.py',
    testFileName: 'test_quiz_question_bank.py',
    keyTip: 'Use random.Random(seed).sample(bank, k=min(count, len(bank))) so you never raise ValueError asking for more questions than exist.',
    pitfallWarning: 'Avoid mutating the master question list in place with random.shuffle(bank) if you need repeatable sessions.',
    description: 'Load questions from a file and randomize them for replayability.',
    learningOutcomes: [
      'Load structured JSON question banks from disk',
      'Sample unique randomized question subsets safely',
      'Filter question banks by topic tag for focused practice',
    ],
    starterCode: '# Quiz App with Question Bank',
    solutionCode: '# Solution: Quiz App with Question Bank',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Create JSON Question Bank File',
        readOnly: true,
        starterCode: `import json, random

BANK_FILE = "question_bank.json"
_seed_questions = [
    {"id": 1, "topic": "types", "q": "Type of 3.0?", "answer": "float"},
    {"id": 2, "topic": "loops", "q": "Keyword to exit loop early?", "answer": "break"},
    {"id": 3, "topic": "types", "q": "Type of True?", "answer": "bool"},
    {"id": 4, "topic": "functions", "q": "Default return when no return?", "answer": "None"},
]
with open(BANK_FILE, "w", encoding="utf-8") as f:
    json.dump(_seed_questions, f)`,
        solutionCode: `import json, random

BANK_FILE = "question_bank.json"
_seed_questions = [
    {"id": 1, "topic": "types", "q": "Type of 3.0?", "answer": "float"},
    {"id": 2, "topic": "loops", "q": "Keyword to exit loop early?", "answer": "break"},
    {"id": 3, "topic": "types", "q": "Type of True?", "answer": "bool"},
    {"id": 4, "topic": "functions", "q": "Default return when no return?", "answer": "None"},
]
with open(BANK_FILE, "w", encoding="utf-8") as f:
    json.dump(_seed_questions, f)`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Load Question Bank From JSON File',
        starterCode: `# Cell 1 (Step 1): Read and parse JSON list from filepath
def load_question_bank(filepath):
    # TODO: Open filepath and return json.load(f)
    return []

loaded_bank = load_question_bank(BANK_FILE)
print("Loaded questions:", len(loaded_bank))`,
        solutionCode: `# Cell 1 (Step 1): Read and parse JSON list from filepath
def load_question_bank(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

loaded_bank = load_question_bank(BANK_FILE)
print("Loaded questions:", len(loaded_bank))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Pick Randomized Unique Questions',
        starterCode: `# Cell 2 (Step 2): Draw up to count unique questions using optional seed
def pick_quiz_questions(bank, count, seed=None):
    rng = random.Random(seed)
    # TODO: Return rng.sample(bank, min(count, len(bank)))
    return []

print("Picked 2:", pick_quiz_questions(loaded_bank, 2, seed=10))`,
        solutionCode: `# Cell 2 (Step 2): Draw up to count unique questions using optional seed
def pick_quiz_questions(bank, count, seed=None):
    rng = random.Random(seed)
    return rng.sample(bank, min(count, len(bank)))

print("Picked 2:", pick_quiz_questions(loaded_bank, 2, seed=10))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Filter Question Bank by Topic',
        starterCode: `# Cell 3 (Step 3): Filter questions matching a topic tag (case-insensitive)
def filter_by_topic(bank, topic):
    target = topic.strip().lower()
    # TODO: Return [q for q in bank if q.get("topic", "").lower() == target]
    return []

print("Topic 'types':", filter_by_topic(loaded_bank, "types"))`,
        solutionCode: `# Cell 3 (Step 3): Filter questions matching a topic tag (case-insensitive)
def filter_by_topic(bank, topic):
    target = topic.strip().lower()
    return [q for q in bank if q.get("topic", "").lower() == target]

print("Topic 'types':", filter_by_topic(loaded_bank, "types"))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Load JSON Question Bank',
        taskInstruction: 'In Cell 1 inside load_question_bank(filepath), open filepath and return json.load(f).',
        targetObjectiveId: '5.2',
        patternTitle: 'Worked Pattern (Loading JSON)',
        patternCode: `with open(filepath, "r", encoding="utf-8") as f:
    return json.load(f)`,
        patternExplanation: 'json.load() parses a JSON file directly into Python lists and dicts.',
        expectedExample: 'len(load_question_bank(BANK_FILE)) -> 4',
        diagnosticExpr: 'len(load_question_bank(BANK_FILE))',
        breadcrumbs: {
          level1Concept: 'Use with open() and json.load(f).',
          level2Syntax: 'with open(filepath, "r", encoding="utf-8") as f:\n    return json.load(f)',
          level3Scaffold: 'with open(filepath, "r", encoding="utf-8") as f:\n    return json.load(f)',
        },
        validationSnippet: 'b = load_question_bank(BANK_FILE)\nassert len(b) == 4 and b[0]["answer"] == "float"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Sample Randomized Subset',
        taskInstruction: 'In Cell 2 inside pick_quiz_questions(bank, count, seed=None), return rng.sample(bank, min(count, len(bank))).',
        targetObjectiveId: '5.3',
        patternTitle: 'Worked Pattern (Safe Unique Sampling)',
        patternCode: `return rng.sample(bank, min(count, len(bank)))`,
        patternExplanation: 'Clamping with min(count, len(bank)) prevents ValueError when requesting more questions than exist.',
        expectedExample: 'len(pick_quiz_questions(loaded_bank, 2, seed=10)) -> 2',
        diagnosticExpr: 'len(pick_quiz_questions(loaded_bank, 2, seed=10))',
        breadcrumbs: {
          level1Concept: 'Use rng.sample(bank, min(count, len(bank))).',
          level2Syntax: 'return rng.sample(bank, min(count, len(bank)))',
          level3Scaffold: 'return rng.sample(bank, min(count, len(bank)))',
        },
        validationSnippet: 'p1 = pick_quiz_questions(loaded_bank, 2, seed=10)\np2 = pick_quiz_questions(loaded_bank, 10, seed=10)\nassert len(p1) == 2 and len(p2) == 4',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Topic Filtering',
        taskInstruction: 'In Cell 3 inside filter_by_topic(bank, topic), return [q for q in bank if q.get("topic", "").lower() == target].',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Topic Tag Filter)',
        patternCode: `return [q for q in bank if q.get("topic", "").lower() == target]`,
        patternExplanation: 'Case-insensitive matching ensures "Types" and "types" return the same subset.',
        expectedExample: 'len(filter_by_topic(loaded_bank, "types")) -> 2',
        diagnosticExpr: 'len(filter_by_topic(loaded_bank, "types"))',
        breadcrumbs: {
          level1Concept: 'Compare q.get("topic", "").lower() against target.',
          level2Syntax: 'return [q for q in bank if q.get("topic", "").lower() == target]',
          level3Scaffold: 'return [q for q in bank if q.get("topic", "").lower() == target]',
        },
        validationSnippet: 'assert len(filter_by_topic(loaded_bank, "TYPES")) == 2 and len(filter_by_topic(loaded_bank, "loops")) == 1',
      },
    ],
  },
  {
    id: 'bonus-calendar-event-manager',
    bonusNumber: 0,
    tier: 'Intermediate',
    title: 'Calendar Event Manager',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    specificObjectives: ['3.5', '3.6', '5.1'],
    fileName: 'calendar_event_manager.py',
    testFileName: 'test_calendar_event_manager.py',
    keyTip: 'ISO date strings like "2026-11-15" and 24-hour times like "09:30" sort chronologically with standard Python sorting!',
    pitfallWarning: 'Check for time-slot collisions on the same date before adding a duplicate event.',
    description: 'Add and display simple events by date in a text-based planner.',
    learningOutcomes: [
      'Store events grouped by ISO date strings ("YYYY-MM-DD")',
      'Sort events chronologically by start time within each day',
      'Format clean daily agenda views and upcoming date summaries',
    ],
    starterCode: '# Calendar Event Manager',
    solutionCode: '# Solution: Calendar Event Manager',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Initialize Planner Dictionary',
        readOnly: true,
        starterCode: `planner = {}`,
        solutionCode: `planner = {}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Add Event by Date & Time',
        starterCode: `# Cell 1 (Step 1): Add {"time": time_str, "title": title} under calendar[date_str], keeping times sorted
def add_event(calendar, date_str, time_str, title):
    events = calendar.setdefault(date_str, [])
    # TODO: Append {"time": time_str, "title": title.strip()} and sort events by key=lambda e: e["time"]
    return len(events)

add_event(planner, "2026-11-20", "14:00", "Lab Review")
add_event(planner, "2026-11-20", "09:00", "Python Study")
print("Nov 20:", planner["2026-11-20"])`,
        solutionCode: `# Cell 1 (Step 1): Add {"time": time_str, "title": title} under calendar[date_str], keeping times sorted
def add_event(calendar, date_str, time_str, title):
    events = calendar.setdefault(date_str, [])
    events.append({"time": time_str, "title": title.strip()})
    events.sort(key=lambda e: e["time"])
    return len(events)

add_event(planner, "2026-11-20", "14:00", "Lab Review")
add_event(planner, "2026-11-20", "09:00", "Python Study")
print("Nov 20:", planner["2026-11-20"])`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Display Formatted Agenda for One Date',
        starterCode: `# Cell 2 (Step 2): Return formatted lines ["09:00 - Python Study", ...] or ["No events scheduled"]
def get_day_agenda(calendar, date_str):
    events = calendar.get(date_str, [])
    if not events:
        return ["No events scheduled"]
    # TODO: Return [f"{e['time']} - {e['title']}" for e in events]
    return []

print(get_day_agenda(planner, "2026-11-20"))`,
        solutionCode: `# Cell 2 (Step 2): Return formatted lines ["09:00 - Python Study", ...] or ["No events scheduled"]
def get_day_agenda(calendar, date_str):
    events = calendar.get(date_str, [])
    if not events:
        return ["No events scheduled"]
    return [f"{e['time']} - {e['title']}" for e in events]

print(get_day_agenda(planner, "2026-11-20"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · List Chronological Event Counts Across Dates',
        starterCode: `# Cell 3 (Step 3): Return sorted list of (date_str, count) tuples
def calendar_overview(calendar):
    # TODO: Return [(d, len(calendar[d])) for d in sorted(calendar) if calendar[d]]
    return []

add_event(planner, "2026-11-18", "10:00", "Mock Exam")
print("Overview:", calendar_overview(planner))`,
        solutionCode: `# Cell 3 (Step 3): Return sorted list of (date_str, count) tuples
def calendar_overview(calendar):
    return [(d, len(calendar[d])) for d in sorted(calendar) if calendar[d]]

add_event(planner, "2026-11-18", "10:00", "Mock Exam")
print("Overview:", calendar_overview(planner))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Store & Sort Events by Time',
        taskInstruction: 'In Cell 1 inside add_event(), append {"time": time_str, "title": title.strip()} and sort events by e["time"].',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (setdefault + Sort)',
        patternCode: `events = calendar.setdefault(date_str, [])
events.append({"time": time_str, "title": title.strip()})
events.sort(key=lambda e: e["time"])`,
        patternExplanation: 'setdefault() creates the list automatically on a new date.',
        expectedExample: 'add_event({}, "2026-11-20", "09:00", "Study") -> 1',
        diagnosticExpr: 'add_event({}, "2026-11-20", "09:00", "Study")',
        breadcrumbs: {
          level1Concept: 'Append the event dict and call events.sort(key=lambda e: e["time"]).',
          level2Syntax: 'events.append({"time": time_str, "title": title.strip()})\nevents.sort(key=lambda e: e["time"])',
          level3Scaffold: 'events.append({"time": time_str, "title": title.strip()})\nevents.sort(key=lambda e: e["time"])\nreturn len(events)',
        },
        validationSnippet: 'cal = {}\nadd_event(cal, "2026-11-20", "14:00", "Afternoon")\nadd_event(cal, "2026-11-20", "09:00", "Morning")\nassert cal["2026-11-20"][0]["title"] == "Morning"',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Format Day Agenda',
        taskInstruction: 'In Cell 2 inside get_day_agenda(calendar, date_str), return [f"{e[\'time\']} - {e[\'title\']}" for e in events].',
        targetObjectiveId: '3.6',
        patternTitle: 'Worked Pattern (Agenda Line Formatting)',
        patternCode: `return [f"{e['time']} - {e['title']}" for e in events]`,
        patternExplanation: 'Returning a clean list of formatted strings makes rendering easy.',
        expectedExample: 'get_day_agenda({"2026-11-20": [{"time": "09:00", "title": "Study"}]}, "2026-11-20")',
        diagnosticExpr: 'get_day_agenda({"2026-11-20": [{"time": "09:00", "title": "Study"}]}, "2026-11-20")',
        breadcrumbs: {
          level1Concept: 'Format each event dictionary as "{time} - {title}".',
          level2Syntax: 'return [f"{e[\'time\']} - {e[\'title\']}" for e in events]',
          level3Scaffold: 'return [f"{e[\'time\']} - {e[\'title\']}" for e in events]',
        },
        validationSnippet: 'cal = {"2026-11-20": [{"time": "09:00", "title": "Study"}]}\nassert get_day_agenda(cal, "2026-11-20") == ["09:00 - Study"] and get_day_agenda(cal, "2026-11-21") == ["No events scheduled"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Chronological Planner Overview',
        taskInstruction: 'In Cell 3 inside calendar_overview(calendar), return [(d, len(calendar[d])) for d in sorted(calendar) if calendar[d]].',
        targetObjectiveId: '5.1',
        patternTitle: 'Worked Pattern (Sorted Date Tuples)',
        patternCode: `return [(d, len(calendar[d])) for d in sorted(calendar) if calendar[d]]`,
        patternExplanation: 'ISO date strings sort chronologically in standard lexicographical order.',
        expectedExample: 'calendar_overview({"2026-11-20": [1, 2], "2026-11-18": [1]}) -> [("2026-11-18", 1), ("2026-11-20", 2)]',
        diagnosticExpr: 'calendar_overview({"2026-11-20": [{}], "2026-11-18": [{}, {}]})',
        breadcrumbs: {
          level1Concept: 'Iterate over sorted(calendar) and pair each date with len(calendar[d]).',
          level2Syntax: 'return [(d, len(calendar[d])) for d in sorted(calendar) if calendar[d]]',
          level3Scaffold: 'return [(d, len(calendar[d])) for d in sorted(calendar) if calendar[d]]',
        },
        validationSnippet: 'assert calendar_overview({"2026-11-20": [{}], "2026-11-18": [{}, {}]}) == [("2026-11-18", 2), ("2026-11-20", 1)]',
      },
    ],
  },
];
