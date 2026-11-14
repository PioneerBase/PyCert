import { BonusProject } from '../types';

export const HARD_MODE_CATALOG_PROJECTS: BonusProject[] = [
  {
    id: 'bonus-recursive-maze-solver',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Recursive Maze Solver',
    sectionNumber: 4,
    sectionName: 'Functions and Exceptions',
    examWeightPercentage: 29,
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    specificObjectives: ['4.5', '2.1', '3.4'],
    fileName: 'recursive_maze_solver.py',
    testFileName: 'test_recursive_maze_solver.py',
    keyTip: 'Always track a visited set AND pop dead-end coordinates when backtracking so the returned path contains only the winning route.',
    pitfallWarning: 'Forgetting to add the current cell to visited BEFORE recursing causes infinite recursion cycles between adjacent open tiles.',
    description: 'Use recursion and backtracking to find a path through a maze.',
    learningOutcomes: [
      'Validate in-bounds, open-tile, and unvisited maze coordinates',
      'Implement recursive depth-first backtracking across 4 directions',
      'Render solved routes directly onto a clean ASCII maze map',
    ],
    starterCode: '# Recursive Maze Solver',
    solutionCode: '# Solution: Recursive Maze Solver',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Sample 5x5 Maze Grid',
        readOnly: true,
        starterCode: `MAZE = [
    ["S", ".", "#", ".", "E"],
    ["#", ".", "#", ".", "#"],
    [".", ".", ".", ".", "."],
    [".", "#", "#", "#", "."],
    [".", ".", ".", "#", "."],
]`,
        solutionCode: `MAZE = [
    ["S", ".", "#", ".", "E"],
    ["#", ".", "#", ".", "#"],
    [".", ".", ".", ".", "."],
    [".", "#", "#", "#", "."],
    [".", ".", ".", "#", "."],
]`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Check Legal Open Neighbor Moves',
        starterCode: `# Cell 1 (Step 1): Return valid (r, c) neighbors (up/down/left/right) not '#' and not in visited
def get_valid_moves(maze, r, c, visited):
    rows, cols = len(maze), len(maze[0])
    moves = []
    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nr, nc = r + dr, c + dc
        # TODO: Check 0 <= nr < rows and 0 <= nc < cols, maze[nr][nc] != "#", (nr, nc) not in visited
    return moves

print("Moves from (0, 0):", get_valid_moves(MAZE, 0, 0, {(0, 0)}))`,
        solutionCode: `# Cell 1 (Step 1): Return valid (r, c) neighbors (up/down/left/right) not '#' and not in visited
def get_valid_moves(maze, r, c, visited):
    rows, cols = len(maze), len(maze[0])
    moves = []
    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols and maze[nr][nc] != "#" and (nr, nc) not in visited:
            moves.append((nr, nc))
    return moves

print("Moves from (0, 0):", get_valid_moves(MAZE, 0, 0, {(0, 0)}))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Recursive Backtracking Path Finder',
        starterCode: `# Cell 2 (Step 2): Recursively find path from start (r, c) to goal; return list of coords or None
def solve_maze(maze, pos, goal, visited=None, path=None):
    if visited is None:
        visited = set()
    if path is None:
        path = []
    r, c = pos
    visited.add(pos)
    path.append(pos)
    if pos == goal:
        return list(path)
    # TODO: Recurse on each move in get_valid_moves(maze, r, c, visited); return result if found
    # Backtrack with path.pop() before returning None
    path.pop()
    return None

solution = solve_maze(MAZE, (0, 0), (0, 4))
print("Path:", solution)`,
        solutionCode: `# Cell 2 (Step 2): Recursively find path from start (r, c) to goal; return list of coords or None
def solve_maze(maze, pos, goal, visited=None, path=None):
    if visited is None:
        visited = set()
    if path is None:
        path = []
    r, c = pos
    visited.add(pos)
    path.append(pos)
    if pos == goal:
        return list(path)
    for nxt in get_valid_moves(maze, r, c, visited):
        found = solve_maze(maze, nxt, goal, visited, path)
        if found is not None:
            return found
    path.pop()
    return None

solution = solve_maze(MAZE, (0, 0), (0, 4))
print("Path:", solution)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Render Solved Path on Grid',
        starterCode: `# Cell 3 (Step 3): Copy maze and mark intermediate path tiles with '*'
def render_solution(maze, path):
    grid = [row[:] for row in maze]
    # TODO: For (r, c) in path: if grid[r][c] == ".", set grid[r][c] = "*"
    return ["".join(row) for row in grid]

print("\\n".join(render_solution(MAZE, solution or [])))`,
        solutionCode: `# Cell 3 (Step 3): Copy maze and mark intermediate path tiles with '*'
def render_solution(maze, path):
    grid = [row[:] for row in maze]
    for r, c in path:
        if grid[r][c] == ".":
            grid[r][c] = "*"
    return ["".join(row) for row in grid]

print("\\n".join(render_solution(MAZE, solution or [])))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Neighbor Bounds & Wall Checks',
        taskInstruction: 'In Cell 1 inside get_valid_moves(), append (nr, nc) only when inside grid bounds, not "#", and not in visited.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (4-Way Grid Neighbors)',
        patternCode: `if 0 <= nr < rows and 0 <= nc < cols and maze[nr][nc] != "#" and (nr, nc) not in visited:
    moves.append((nr, nc))`,
        patternExplanation: 'Checking bounds before indexing maze[nr][nc] avoids IndexError on border tiles.',
        expectedExample: 'get_valid_moves(MAZE, 0, 0, {(0, 0)}) -> [(0, 1)]',
        diagnosticExpr: 'get_valid_moves(MAZE, 0, 0, {(0, 0)})',
        breadcrumbs: {
          level1Concept: 'Check row/col bounds, != "#", and not in visited.',
          level2Syntax: 'if 0 <= nr < rows and 0 <= nc < cols and maze[nr][nc] != "#" and (nr, nc) not in visited:\n    moves.append((nr, nc))',
          level3Scaffold: 'if 0 <= nr < rows and 0 <= nc < cols and maze[nr][nc] != "#" and (nr, nc) not in visited:\n    moves.append((nr, nc))',
        },
        validationSnippet: 'assert get_valid_moves(MAZE, 0, 0, {(0, 0)}) == [(0, 1)]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Recursive Backtracking Solver',
        taskInstruction: 'In Cell 2 inside solve_maze(), recurse over get_valid_moves(), return immediately when found is not None, and backtrack via path.pop().',
        targetObjectiveId: '4.5',
        patternTitle: 'Worked Pattern (DFS Backtracking)',
        patternCode: `for nxt in get_valid_moves(maze, r, c, visited):
    found = solve_maze(maze, nxt, goal, visited, path)
    if found is not None:
        return found
path.pop()
return None`,
        patternExplanation: 'path.pop() removes dead-end branches so only the true path reaches the caller.',
        expectedExample: 'solve_maze(MAZE, (0, 0), (0, 4))[-1] -> (0, 4)',
        diagnosticExpr: 'solve_maze(MAZE, (0, 0), (0, 4))',
        breadcrumbs: {
          level1Concept: 'Loop over get_valid_moves(), recurse, and return found if non-None.',
          level2Syntax: 'for nxt in get_valid_moves(maze, r, c, visited):\n    found = solve_maze(maze, nxt, goal, visited, path)\n    if found is not None: return found',
          level3Scaffold: 'for nxt in get_valid_moves(maze, r, c, visited):\n    found = solve_maze(maze, nxt, goal, visited, path)\n    if found is not None:\n        return found\npath.pop()\nreturn None',
        },
        validationSnippet: 'p = solve_maze(MAZE, (0, 0), (0, 4))\nassert p is not None and p[0] == (0, 0) and p[-1] == (0, 4)\nassert all(MAZE[r][c] != "#" for r, c in p)',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Render Maze Path',
        taskInstruction: 'In Cell 3 inside render_solution(maze, path), replace "." tiles along path with "*".',
        targetObjectiveId: '3.4',
        patternTitle: 'Worked Pattern (Deep Grid Copy + Overlay)',
        patternCode: `for r, c in path:
    if grid[r][c] == ".":
        grid[r][c] = "*"`,
        patternExplanation: 'Copying each row preserves the original MAZE while displaying the solved trail.',
        expectedExample: 'render_solution(MAZE, solve_maze(MAZE, (0, 0), (0, 4)))',
        diagnosticExpr: 'render_solution(MAZE, [(0, 0), (0, 1), (1, 1)])[0]',
        breadcrumbs: {
          level1Concept: 'Mark each (r, c) in path as "*" if grid[r][c] == ".".',
          level2Syntax: 'for r, c in path:\n    if grid[r][c] == ".": grid[r][c] = "*"',
          level3Scaffold: 'for r, c in path:\n    if grid[r][c] == ".":\n        grid[r][c] = "*"',
        },
        validationSnippet: 'p = solve_maze(MAZE, (0, 0), (0, 4))\nrendered = render_solution(MAZE, p)\nassert "*" in rendered[0] and rendered[0].startswith("S*")',
      },
    ],
  },
  {
    id: 'bonus-console-roguelike',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Console Roguelike',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    specificObjectives: ['3.5', '2.1', '4.1'],
    fileName: 'console_roguelike.py',
    testFileName: 'test_console_roguelike.py',
    keyTip: 'Keep all game entities (player, enemies, potions, walls) inside one state dict so turn execution is completely pure and deterministic.',
    pitfallWarning: 'Check enemy collisions on the player\'s target tile BEFORE moving the player onto a monster tile!',
    description: 'Create a complex text-based game with enemies, items, maps, and turn-based logic.',
    learningOutcomes: [
      'Architect a turn-based dungeon state with grid coordinates, HP, and items',
      'Implement player movement, item pickups, and bump-to-attack combat',
      'Advance enemy counter-turns and detect victory or defeat states',
    ],
    starterCode: '# Console Roguelike',
    solutionCode: '# Solution: Console Roguelike',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Create Dungeon State & Map Bounds',
        starterCode: `# Cell 1 (Step 1): Initialize dungeon state dict
def create_dungeon():
    return {
        "width": 5,
        "height": 5,
        "walls": {(1, 1), (1, 2)},
        "player": {"pos": [0, 0], "hp": 20, "atk": 5, "items": []},
        "enemies": {(2, 0): {"name": "Goblin", "hp": 8, "atk": 3}},
        "items": {(0, 2): "potion"},
        "turn": 0,
        "status": "active",
    }

print("Initial state turn:", create_dungeon()["turn"])`,
        solutionCode: `# Cell 1 (Step 1): Initialize dungeon state dict
def create_dungeon():
    return {
        "width": 5,
        "height": 5,
        "walls": {(1, 1), (1, 2)},
        "player": {"pos": [0, 0], "hp": 20, "atk": 5, "items": []},
        "enemies": {(2, 0): {"name": "Goblin", "hp": 8, "atk": 3}},
        "items": {(0, 2): "potion"},
        "turn": 0,
        "status": "active",
    }

print("Initial state turn:", create_dungeon()["turn"])`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Execute Player Turn (Move, Pickup, or Bump-Attack)',
        starterCode: `# Cell 2 (Step 2): Process direction "N", "S", "E", "W" (dr, dc)
DIRS = {"N": (-1, 0), "S": (1, 0), "W": (0, -1), "E": (0, 1)}

def player_turn(state, direction):
    if state["status"] != "active":
        return "Game over"
    dr, dc = DIRS[direction.upper()]
    nr, nc = state["player"]["pos"][0] + dr, state["player"]["pos"][1] + dc
    if not (0 <= nr < state["height"] and 0 <= nc < state["width"]) or (nr, nc) in state["walls"]:
        return "Blocked"
    state["turn"] += 1
    target = (nr, nc)
    # TODO: If target in state["enemies"]: deal player["atk"] dmg; pop enemy if hp <= 0 (set status="won" if no enemies left)
    # Else move player["pos"] = [nr, nc], pick up any item at target (if potion, heal +5 hp)
    return "Blocked"

g = create_dungeon()
print(player_turn(g, "S"), "| Turn:", g["turn"])`,
        solutionCode: `# Cell 2 (Step 2): Process direction "N", "S", "E", "W" (dr, dc)
DIRS = {"N": (-1, 0), "S": (1, 0), "W": (0, -1), "E": (0, 1)}

def player_turn(state, direction):
    if state["status"] != "active":
        return "Game over"
    dr, dc = DIRS[direction.upper()]
    nr, nc = state["player"]["pos"][0] + dr, state["player"]["pos"][1] + dc
    if not (0 <= nr < state["height"] and 0 <= nc < state["width"]) or (nr, nc) in state["walls"]:
        return "Blocked"
    state["turn"] += 1
    target = (nr, nc)
    if target in state["enemies"]:
        enemy = state["enemies"][target]
        enemy["hp"] -= state["player"]["atk"]
        if enemy["hp"] <= 0:
            del state["enemies"][target]
            if not state["enemies"]:
                state["status"] = "won"
            return f"Defeated {enemy['name']}"
        state["player"]["hp"] -= enemy["atk"]
        if state["player"]["hp"] <= 0:
            state["status"] = "lost"
        return f"Hit {enemy['name']}"
    state["player"]["pos"] = [nr, nc]
    if target in state["items"]:
        item = state["items"].pop(target)
        state["player"]["items"].append(item)
        if item == "potion":
            state["player"]["hp"] += 5
    return "Moved"

g = create_dungeon()
print(player_turn(g, "S"), "| Turn:", g["turn"])`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Simulate Turn Command Sequence & Render Minimap',
        starterCode: `# Cell 3 (Step 3): Run multiple moves and return final status + turn count
def run_roguelike_script(commands):
    state = create_dungeon()
    events = []
    # TODO: Execute player_turn(state, cmd) for each cmd, stop early if state["status"] != "active"
    return {"status": state["status"], "hp": state["player"]["hp"], "turns": state["turn"], "events": events}

print(run_roguelike_script(["E", "E", "W", "W", "S", "S", "S"]))`,
        solutionCode: `# Cell 3 (Step 3): Run multiple moves and return final status + turn count
def run_roguelike_script(commands):
    state = create_dungeon()
    events = []
    for cmd in commands:
        if state["status"] != "active":
            break
        events.append(player_turn(state, cmd))
    return {"status": state["status"], "hp": state["player"]["hp"], "turns": state["turn"], "events": events}

print(run_roguelike_script(["E", "E", "W", "W", "S", "S", "S"]))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Initialize Dungeon State',
        taskInstruction: 'Run Cell 1 to define create_dungeon() returning the initial dungeon dictionary.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Centralized Game State)',
        patternCode: `state = {"player": ..., "enemies": ..., "items": ..., "status": "active"}`,
        patternExplanation: 'Storing walls, enemies, and items keyed by (row, col) coordinates makes collision checks O(1).',
        expectedExample: 'create_dungeon()["status"] -> "active"',
        diagnosticExpr: 'create_dungeon()["status"]',
        breadcrumbs: {
          level1Concept: 'Run Cell 1 to load create_dungeon() into the kernel.',
          level2Syntax: 'create_dungeon()',
          level3Scaffold: 'create_dungeon()',
        },
        validationSnippet: 'd = create_dungeon()\nassert d["player"]["hp"] == 20 and (2, 0) in d["enemies"] and (0, 2) in d["items"]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Movement, Pickups & Combat',
        taskInstruction: 'In Cell 2 inside player_turn(state, direction), resolve bump-attack combat when target is in state["enemies"], otherwise move player and pick up items.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Bump-to-Attack Turn Resolution)',
        patternCode: `if target in state["enemies"]:
    enemy = state["enemies"][target]
    enemy["hp"] -= state["player"]["atk"]`,
        patternExplanation: 'Resolving combat on contact keeps turn controls compact and tactical.',
        expectedExample: 'player_turn(create_dungeon(), "S") -> "Moved"',
        diagnosticExpr: 'player_turn(create_dungeon(), "S")',
        breadcrumbs: {
          level1Concept: 'Handle target in enemies (damage/defeat/counterattack) vs open tile move + item pickup.',
          level2Syntax: 'if target in state["enemies"]: ... else: state["player"]["pos"] = [nr, nc]',
          level3Scaffold: 'if target in state["enemies"]:\n    enemy = state["enemies"][target]\n    enemy["hp"] -= state["player"]["atk"]\n    if enemy["hp"] <= 0:\n        del state["enemies"][target]\n        if not state["enemies"]: state["status"] = "won"\n        return f"Defeated {enemy[\'name\']}"\n    state["player"]["hp"] -= enemy["atk"]\n    return f"Hit {enemy[\'name\']}"\nstate["player"]["pos"] = [nr, nc]\nreturn "Moved"',
        },
        validationSnippet: 'g = create_dungeon()\nassert player_turn(g, "E") == "Moved"\nassert player_turn(g, "E") == "Moved" and g["player"]["hp"] == 25\nassert player_turn(g, "W") == "Moved" and player_turn(g, "W") == "Moved"\nassert player_turn(g, "S") == "Moved" and player_turn(g, "S") == "Hit Goblin" and player_turn(g, "S") == "Defeated Goblin" and g["status"] == "won"',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Execute Turn Script',
        taskInstruction: 'In Cell 3 inside run_roguelike_script(commands), execute each command with player_turn() while active and return the summary dict.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Deterministic Replay Harness)',
        patternCode: `for cmd in commands:
    if state["status"] != "active":
        break
    events.append(player_turn(state, cmd))`,
        patternExplanation: 'Stopping when status changes prevents extra turns after winning or losing.',
        expectedExample: 'run_roguelike_script(["S", "S", "S"])["status"] -> "won"',
        diagnosticExpr: 'run_roguelike_script(["S", "S", "S"])',
        breadcrumbs: {
          level1Concept: 'Loop commands and record player_turn(state, cmd) while status == "active".',
          level2Syntax: 'for cmd in commands:\n    if state["status"] != "active": break\n    events.append(player_turn(state, cmd))',
          level3Scaffold: 'for cmd in commands:\n    if state["status"] != "active":\n        break\n    events.append(player_turn(state, cmd))',
        },
        validationSnippet: 'res = run_roguelike_script(["S", "S", "S"])\nassert res["status"] == "won" and res["turns"] == 3',
      },
    ],
  },
  {
    id: 'bonus-multi-file-crud',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Multi-File CRUD App',
    sectionNumber: 5,
    sectionName: 'Standard Library & File Persistence',
    examWeightPercentage: 15,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['5.2', '4.6', '3.5'],
    fileName: 'multi_file_crud.py',
    testFileName: 'test_multi_file_crud.py',
    keyTip: 'Separate concerns cleanly: keep storage index metadata in one JSON file and record payloads in a dedicated data file.',
    pitfallWarning: 'Maintain an audit log file alongside CRUD state so every create, update, and delete operation leaves a trace.',
    description: 'Build a data-driven app with create, read, update, delete operations and file persistence.',
    learningOutcomes: [
      'Persist records, primary-key indexes, and audit logs across multiple files',
      'Implement full Create, Read, Update, Delete lifecycle safely',
      'Keep index and record stores synchronized across operations',
    ],
    starterCode: '# Multi-File CRUD App',
    solutionCode: '# Solution: Multi-File CRUD App',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Multi-File Store Paths',
        readOnly: true,
        starterCode: `import json

RECORDS_FILE = "crud_records.json"
AUDIT_FILE = "crud_audit.log"

def init_store(records_path=RECORDS_FILE, audit_path=AUDIT_FILE):
    with open(records_path, "w", encoding="utf-8") as f:
        json.dump({}, f)
    with open(audit_path, "w", encoding="utf-8") as f:
        f.write("")`,
        solutionCode: `import json

RECORDS_FILE = "crud_records.json"
AUDIT_FILE = "crud_audit.log"

def init_store(records_path=RECORDS_FILE, audit_path=AUDIT_FILE):
    with open(records_path, "w", encoding="utf-8") as f:
        json.dump({}, f)
    with open(audit_path, "w", encoding="utf-8") as f:
        f.write("")`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Create & Read Persistent JSON Records',
        starterCode: `# Cell 1 (Step 1): Create record by string ID and read it back from disk
def create_record(rec_id, payload, records_path=RECORDS_FILE, audit_path=AUDIT_FILE):
    with open(records_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    if rec_id in db:
        raise ValueError(f"Duplicate ID: {rec_id}")
    db[rec_id] = dict(payload)
    # TODO: Save updated db back to records_path AND append f"CREATE {rec_id}\\n" to audit_path
    return db[rec_id]

def read_record(rec_id, records_path=RECORDS_FILE):
    with open(records_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    return db.get(rec_id)

init_store()
print("Created:", create_record("u1", {"name": "Ada", "role": "Engineer"}))`,
        solutionCode: `# Cell 1 (Step 1): Create record by string ID and read it back from disk
def create_record(rec_id, payload, records_path=RECORDS_FILE, audit_path=AUDIT_FILE):
    with open(records_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    if rec_id in db:
        raise ValueError(f"Duplicate ID: {rec_id}")
    db[rec_id] = dict(payload)
    with open(records_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)
    with open(audit_path, "a", encoding="utf-8") as f:
        f.write(f"CREATE {rec_id}\\n")
    return db[rec_id]

def read_record(rec_id, records_path=RECORDS_FILE):
    with open(records_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    return db.get(rec_id)

init_store()
print("Created:", create_record("u1", {"name": "Ada", "role": "Engineer"}))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Update & Delete Persisted Records',
        starterCode: `# Cell 2 (Step 2): Update fields and delete records with multi-file audit trail
def update_record(rec_id, patch, records_path=RECORDS_FILE, audit_path=AUDIT_FILE):
    with open(records_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    if rec_id not in db:
        return False
    db[rec_id].update(patch)
    # TODO: Save db, append f"UPDATE {rec_id}\\n" to audit_path, return True
    return False

def delete_record(rec_id, records_path=RECORDS_FILE, audit_path=AUDIT_FILE):
    with open(records_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    if rec_id not in db:
        return False
    del db[rec_id]
    # TODO: Save db, append f"DELETE {rec_id}\\n" to audit_path, return True
    return False

print("Updated u1:", update_record("u1", {"role": "Lead"}))`,
        solutionCode: `# Cell 2 (Step 2): Update fields and delete records with multi-file audit trail
def update_record(rec_id, patch, records_path=RECORDS_FILE, audit_path=AUDIT_FILE):
    with open(records_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    if rec_id not in db:
        return False
    db[rec_id].update(patch)
    with open(records_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)
    with open(audit_path, "a", encoding="utf-8") as f:
        f.write(f"UPDATE {rec_id}\\n")
    return True

def delete_record(rec_id, records_path=RECORDS_FILE, audit_path=AUDIT_FILE):
    with open(records_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    if rec_id not in db:
        return False
    del db[rec_id]
    with open(records_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)
    with open(audit_path, "a", encoding="utf-8") as f:
        f.write(f"DELETE {rec_id}\\n")
    return True

print("Updated u1:", update_record("u1", {"role": "Lead"}))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Read Audit History Across Files',
        starterCode: `# Cell 3 (Step 3): Return list of audit actions recorded in audit_path
def read_audit_log(audit_path=AUDIT_FILE):
    # TODO: Open audit_path and return [line.strip() for line in f if line.strip()]
    return []

print("Audit:", read_audit_log())`,
        solutionCode: `# Cell 3 (Step 3): Return list of audit actions recorded in audit_path
def read_audit_log(audit_path=AUDIT_FILE):
    with open(audit_path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]

print("Audit:", read_audit_log())`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Persistent Create & Read',
        taskInstruction: 'In Cell 1 inside create_record(), write updated db to records_path and append f"CREATE {rec_id}\\n" to audit_path.',
        targetObjectiveId: '5.2',
        patternTitle: 'Worked Pattern (JSON Write + Audit Append)',
        patternCode: `with open(records_path, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2)
with open(audit_path, "a", encoding="utf-8") as f:
    f.write(f"CREATE {rec_id}\\n")`,
        patternExplanation: 'Using mode "a" appends each audit event without overwriting earlier entries.',
        expectedExample: 'read_record("u1")["name"] -> "Ada"',
        diagnosticExpr: 'read_record("u1")',
        breadcrumbs: {
          level1Concept: 'Write db as JSON to records_path and append the CREATE line to audit_path.',
          level2Syntax: 'with open(records_path, "w", encoding="utf-8") as f: json.dump(db, f, indent=2)',
          level3Scaffold: 'with open(records_path, "w", encoding="utf-8") as f:\n    json.dump(db, f, indent=2)\nwith open(audit_path, "a", encoding="utf-8") as f:\n    f.write(f"CREATE {rec_id}\\n")\nreturn db[rec_id]',
        },
        validationSnippet: 'init_store("t_rec.json", "t_aud.log")\ncreate_record("x1", {"name": "Lin"}, "t_rec.json", "t_aud.log")\nassert read_record("x1", "t_rec.json") == {"name": "Lin"}',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Persistent Update & Delete',
        taskInstruction: 'In Cell 2 inside update_record() and delete_record(), persist db changes and append UPDATE/DELETE audit events.',
        targetObjectiveId: '4.6',
        patternTitle: 'Worked Pattern (Synchronized Update & Audit)',
        patternCode: `with open(records_path, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2)
with open(audit_path, "a", encoding="utf-8") as f:
    f.write(f"UPDATE {rec_id}\\n")
return True`,
        patternExplanation: 'Returning False for nonexistent IDs avoids mutating files unnecessarily.',
        expectedExample: 'update_record("u1", {"role": "Lead"}) -> True',
        diagnosticExpr: 'read_record("u1")',
        breadcrumbs: {
          level1Concept: 'Save db with json.dump() and append the audit entry in both functions.',
          level2Syntax: 'with open(records_path, "w", encoding="utf-8") as f: json.dump(db, f, indent=2)\nreturn True',
          level3Scaffold: 'with open(records_path, "w", encoding="utf-8") as f:\n    json.dump(db, f, indent=2)\nwith open(audit_path, "a", encoding="utf-8") as f:\n    f.write(f"UPDATE {rec_id}\\n")\nreturn True',
        },
        validationSnippet: 'init_store("t2_rec.json", "t2_aud.log")\ncreate_record("x1", {"name": "Lin", "role": "Dev"}, "t2_rec.json", "t2_aud.log")\nassert update_record("x1", {"role": "CTO"}, "t2_rec.json", "t2_aud.log") is True\nassert read_record("x1", "t2_rec.json")["role"] == "CTO"\nassert delete_record("x1", "t2_rec.json", "t2_aud.log") is True and read_record("x1", "t2_rec.json") is None',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Audit Log Reader',
        taskInstruction: 'In Cell 3 inside read_audit_log(audit_path), return [line.strip() for line in f if line.strip()].',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Clean Log Lines)',
        patternCode: `return [line.strip() for line in f if line.strip()]`,
        patternExplanation: 'Filtering blank lines leaves clean action strings.',
        expectedExample: 'read_audit_log("t2_aud.log") -> ["CREATE x1", "UPDATE x1", "DELETE x1"]',
        diagnosticExpr: 'read_audit_log("t2_aud.log")',
        breadcrumbs: {
          level1Concept: 'Read audit_path and strip non-empty lines.',
          level2Syntax: 'return [line.strip() for line in f if line.strip()]',
          level3Scaffold: 'with open(audit_path, "r", encoding="utf-8") as f:\n    return [line.strip() for line in f if line.strip()]',
        },
        validationSnippet: 'init_store("t3_rec.json", "t3_aud.log")\ncreate_record("a", {"v": 1}, "t3_rec.json", "t3_aud.log")\nupdate_record("a", {"v": 2}, "t3_rec.json", "t3_aud.log")\nassert read_audit_log("t3_aud.log") == ["CREATE a", "UPDATE a"]',
      },
    ],
  },
  {
    id: 'bonus-regex-log-parser',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Regex Log Parser',
    sectionNumber: 5,
    sectionName: 'Standard Library & File Persistence',
    examWeightPercentage: 15,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['5.1', '3.9', '3.5'],
    fileName: 'regex_log_parser.py',
    testFileName: 'test_regex_log_parser.py',
    keyTip: 'Use named capture groups like (?P<ip>\\d+\\.\\d+\\.\\d+\\.\\d+) in re.compile() so match.groupdict() builds dictionaries automatically!',
    pitfallWarning: 'Remember raw strings r"..." for regex patterns so Python does not treat \\d or \\s as string escapes.',
    description: 'Extract structured insights from unstructured logs using pattern matching.',
    learningOutcomes: [
      'Compile reusable named-group regex patterns with re.compile()',
      'Extract IPs, HTTP status codes, and latency milliseconds from raw logs',
      'Aggregate structured regex matches into error-rate and latency summaries',
    ],
    starterCode: '# Regex Log Parser',
    solutionCode: '# Solution: Regex Log Parser',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Import re & Sample Unstructured Logs',
        readOnly: true,
        starterCode: `import re

RAW_LOGS = [
    "[2026-11-15 10:01:12] ip=192.168.1.10 status=200 latency=42ms path=/home",
    "[2026-11-15 10:01:14] ip=10.0.0.5 status=500 latency=310ms path=/checkout",
    "CORRUPT LINE WITHOUT FIELDS",
    "[2026-11-15 10:01:19] ip=192.168.1.10 status=404 latency=18ms path=/missing",
]`,
        solutionCode: `import re

RAW_LOGS = [
    "[2026-11-15 10:01:12] ip=192.168.1.10 status=200 latency=42ms path=/home",
    "[2026-11-15 10:01:14] ip=10.0.0.5 status=500 latency=310ms path=/checkout",
    "CORRUPT LINE WITHOUT FIELDS",
    "[2026-11-15 10:01:19] ip=192.168.1.10 status=404 latency=18ms path=/missing",
]`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Match Named Fields With Regex',
        starterCode: `# Cell 1 (Step 1): Extract ip, status (int), latency_ms (int), and path using re.compile()
LOG_PATTERN = re.compile(
    r"ip=(?P<ip>\\d+\\.\\d+\\.\\d+\\.\\d+)\\s+status=(?P<status>\\d+)\\s+latency=(?P<latency>\\d+)ms\\s+path=(?P<path>\\S+)"
)

def parse_regex_log(line):
    match = LOG_PATTERN.search(line)
    # TODO: If match, return {"ip": ..., "status": int(...), "latency_ms": int(...), "path": ...}; else None
    return None

print(parse_regex_log(RAW_LOGS[0]))`,
        solutionCode: `# Cell 1 (Step 1): Match Named Fields With Regex
LOG_PATTERN = re.compile(
    r"ip=(?P<ip>\\d+\\.\\d+\\.\\d+\\.\\d+)\\s+status=(?P<status>\\d+)\\s+latency=(?P<latency>\\d+)ms\\s+path=(?P<path>\\S+)"
)

def parse_regex_log(line):
    match = LOG_PATTERN.search(line)
    if not match:
        return None
    data = match.groupdict()
    return {
        "ip": data["ip"],
        "status": int(data["status"]),
        "latency_ms": int(data["latency"]),
        "path": data["path"],
    }

print(parse_regex_log(RAW_LOGS[0]))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Parse Batch & Filter Failed Requests',
        starterCode: `# Cell 2 (Step 2): Parse valid lines and return only entries with status >= 400
def extract_error_requests(lines):
    # TODO: Parse all lines with parse_regex_log(), keep non-None entries with status >= 400
    return []

print("Errors:", extract_error_requests(RAW_LOGS))`,
        solutionCode: `# Cell 2 (Step 2): Parse valid lines and return only entries with status >= 400
def extract_error_requests(lines):
    parsed = [parse_regex_log(line) for line in lines]
    return [entry for entry in parsed if entry and entry["status"] >= 400]

print("Errors:", extract_error_requests(RAW_LOGS))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Aggregate IP Counts & Average Latency',
        starterCode: `# Cell 3 (Step 3): Return {"total_valid": ..., "avg_latency_ms": ..., "ip_hits": {...}}
def summarize_parsed_logs(lines):
    entries = [e for e in (parse_regex_log(l) for l in lines) if e]
    if not entries:
        return {"total_valid": 0, "avg_latency_ms": 0.0, "ip_hits": {}}
    # TODO: Compute avg_latency_ms (rounded 2 decimals) and ip_hits dictionary
    return {}

print("Summary:", summarize_parsed_logs(RAW_LOGS))`,
        solutionCode: `# Cell 3 (Step 3): Return {"total_valid": ..., "avg_latency_ms": ..., "ip_hits": {...}}
def summarize_parsed_logs(lines):
    entries = [e for e in (parse_regex_log(l) for l in lines) if e]
    if not entries:
        return {"total_valid": 0, "avg_latency_ms": 0.0, "ip_hits": {}}
    avg_lat = round(sum(e["latency_ms"] for e in entries) / len(entries), 2)
    ip_hits = {}
    for e in entries:
        ip_hits[e["ip"]] = ip_hits.get(e["ip"], 0) + 1
    return {"total_valid": len(entries), "avg_latency_ms": avg_lat, "ip_hits": ip_hits}

print("Summary:", summarize_parsed_logs(RAW_LOGS))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Named-Group Regex Extraction',
        taskInstruction: 'In Cell 1 inside parse_regex_log(line), convert match.groupdict() into the typed dict or return None if unmatched.',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (groupdict() Conversion)',
        patternCode: `data = match.groupdict()
return {"ip": data["ip"], "status": int(data["status"]), "latency_ms": int(data["latency"]), "path": data["path"]}`,
        patternExplanation: 'Casting status and latency to int lets downstream code compute numeric averages and >= 400 checks.',
        expectedExample: 'parse_regex_log(RAW_LOGS[0])["status"] -> 200',
        diagnosticExpr: 'parse_regex_log(RAW_LOGS[0])',
        breadcrumbs: {
          level1Concept: 'Return None if not match; otherwise cast status and latency to int.',
          level2Syntax: 'if not match: return None\ndata = match.groupdict()',
          level3Scaffold: 'if not match:\n    return None\ndata = match.groupdict()\nreturn {"ip": data["ip"], "status": int(data["status"]), "latency_ms": int(data["latency"]), "path": data["path"]}',
        },
        validationSnippet: 'assert parse_regex_log(RAW_LOGS[0]) == {"ip": "192.168.1.10", "status": 200, "latency_ms": 42, "path": "/home"} and parse_regex_log(RAW_LOGS[2]) is None',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Filter HTTP Error Entries',
        taskInstruction: 'In Cell 2 inside extract_error_requests(lines), keep parsed entries with status >= 400.',
        targetObjectiveId: '5.1',
        patternTitle: 'Worked Pattern (Valid + Error Filter)',
        patternCode: `parsed = [parse_regex_log(line) for line in lines]
return [entry for entry in parsed if entry and entry["status"] >= 400]`,
        patternExplanation: 'Guarding entry ensures None (corrupted log lines) are safely skipped.',
        expectedExample: 'len(extract_error_requests(RAW_LOGS)) -> 2',
        diagnosticExpr: 'len(extract_error_requests(RAW_LOGS))',
        breadcrumbs: {
          level1Concept: 'Parse each line and keep items where entry is truthy and entry["status"] >= 400.',
          level2Syntax: 'return [e for e in (parse_regex_log(l) for l in lines) if e and e["status"] >= 400]',
          level3Scaffold: 'parsed = [parse_regex_log(line) for line in lines]\nreturn [entry for entry in parsed if entry and entry["status"] >= 400]',
        },
        validationSnippet: 'errs = extract_error_requests(RAW_LOGS)\nassert len(errs) == 2 and errs[0]["status"] == 500',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Aggregate Hits & Latency',
        taskInstruction: 'In Cell 3 inside summarize_parsed_logs(lines), compute avg_latency_ms and ip_hits dictionary.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Traffic Aggregation)',
        patternCode: `avg_lat = round(sum(e["latency_ms"] for e in entries) / len(entries), 2)
for e in entries:
    ip_hits[e["ip"]] = ip_hits.get(e["ip"], 0) + 1`,
        patternExplanation: 'Combining mean latency with per-IP hit counts surfaces slow endpoints and top clients.',
        expectedExample: 'summarize_parsed_logs(RAW_LOGS)["total_valid"] -> 3',
        diagnosticExpr: 'summarize_parsed_logs(RAW_LOGS)',
        breadcrumbs: {
          level1Concept: 'Average latency_ms across entries and count ip occurrences in ip_hits.',
          level2Syntax: 'return {"total_valid": len(entries), "avg_latency_ms": avg_lat, "ip_hits": ip_hits}',
          level3Scaffold: 'avg_lat = round(sum(e["latency_ms"] for e in entries) / len(entries), 2)\nip_hits = {}\nfor e in entries:\n    ip_hits[e["ip"]] = ip_hits.get(e["ip"], 0) + 1\nreturn {"total_valid": len(entries), "avg_latency_ms": avg_lat, "ip_hits": ip_hits}',
        },
        validationSnippet: 's = summarize_parsed_logs(RAW_LOGS)\nassert s == {"total_valid": 3, "avg_latency_ms": 123.33, "ip_hits": {"192.168.1.10": 2, "10.0.0.5": 1}}',
      },
    ],
  },
  {
    id: 'bonus-queue-interest-sim',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Queue and Interest Simulation',
    sectionNumber: 2,
    sectionName: 'Control Flow - Conditional Blocks and Loops',
    examWeightPercentage: 29,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['2.2', '3.1', '4.1'],
    fileName: 'queue_interest_sim.py',
    testFileName: 'test_queue_interest_sim.py',
    keyTip: 'Model waiting lines in FIFO order (pop(0) or collections.deque.popleft()) so the first customer arriving is served first.',
    pitfallWarning: 'Compound interest applies the periodic rate to the current balance every period: balance *= (1 + rate / periods_per_year).',
    description: 'Simulate banking flow, waiting lines, and compounding interest over time.',
    learningOutcomes: [
      'Simulate FIFO bank teller waiting queues using deque',
      'Compute average customer wait time across arrivals',
      'Model multi-period compound interest growth over time',
    ],
    starterCode: '# Queue and Interest Simulation',
    solutionCode: '# Solution: Queue and Interest Simulation',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Import deque',
        readOnly: true,
        starterCode: `from collections import deque`,
        solutionCode: `from collections import deque`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Simulate FIFO Bank Teller Queue',
        starterCode: `# Cell 1 (Step 1): Simulate single-teller FIFO service for [(name, arrival_min, service_mins), ...]
def simulate_teller_queue(customers):
    queue = deque(customers)
    clock = 0
    wait_times = []
    # TODO: Popleft (name, arrival, svc); start_time = max(clock, arrival); wait = start_time - arrival
    # Append wait to wait_times, advance clock = start_time + svc
    avg_wait = round(sum(wait_times) / len(wait_times), 2) if wait_times else 0.0
    return {"served": len(wait_times), "avg_wait": avg_wait, "finish_min": clock}

print(simulate_teller_queue([("Ada", 0, 5), ("Bob", 2, 4), ("Cy", 3, 2)]))`,
        solutionCode: `# Cell 1 (Step 1): Simulate single-teller FIFO service for [(name, arrival_min, service_mins), ...]
def simulate_teller_queue(customers):
    queue = deque(customers)
    clock = 0
    wait_times = []
    while queue:
        _, arrival, svc = queue.popleft()
        start_time = max(clock, arrival)
        wait_times.append(start_time - arrival)
        clock = start_time + svc
    avg_wait = round(sum(wait_times) / len(wait_times), 2) if wait_times else 0.0
    return {"served": len(wait_times), "avg_wait": avg_wait, "finish_min": clock}

print(simulate_teller_queue([("Ada", 0, 5), ("Bob", 2, 4), ("Cy", 3, 2)]))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Simulate Compound Interest Over Months',
        starterCode: `# Cell 2 (Step 2): Simulate monthly compounding with optional monthly deposit; return balance history
def simulate_compound_interest(principal, annual_rate, months, monthly_deposit=0.0):
    balance = float(principal)
    monthly_rate = annual_rate / 12
    history = []
    # TODO: For each month in range(months), apply interest balance = balance * (1 + monthly_rate) + monthly_deposit
    # Append round(balance, 2) to history
    return history

print("6 months:", simulate_compound_interest(1000, 0.06, 6, 100))`,
        solutionCode: `# Cell 2 (Step 2): Simulate monthly compounding with optional monthly deposit; return balance history
def simulate_compound_interest(principal, annual_rate, months, monthly_deposit=0.0):
    balance = float(principal)
    monthly_rate = annual_rate / 12
    history = []
    for _ in range(months):
        balance = balance * (1 + monthly_rate) + monthly_deposit
        history.append(round(balance, 2))
    return history

print("6 months:", simulate_compound_interest(1000, 0.06, 6, 100))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Estimate Years to Double Principal',
        starterCode: `# Cell 3 (Step 3): Count how many months until balance reaches >= 2 * principal
def months_to_double(principal, annual_rate):
    if annual_rate <= 0:
        raise ValueError("Annual rate must be positive")
    balance = float(principal)
    target = balance * 2
    months = 0
    # TODO: While balance < target: compound monthly and increment months
    return months

print("Months to double at 12%:", months_to_double(1000, 0.12))`,
        solutionCode: `# Cell 3 (Step 3): Count how many months until balance reaches >= 2 * principal
def months_to_double(principal, annual_rate):
    if annual_rate <= 0:
        raise ValueError("Annual rate must be positive")
    balance = float(principal)
    target = balance * 2
    months = 0
    monthly_rate = annual_rate / 12
    while balance < target:
        balance *= (1 + monthly_rate)
        months += 1
    return months

print("Months to double at 12%:", months_to_double(1000, 0.12))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: FIFO Bank Teller Queue',
        taskInstruction: 'In Cell 1 inside simulate_teller_queue(), process customers using queue.popleft(), compute start_time = max(clock, arrival), record wait time, and update clock.',
        targetObjectiveId: '3.1',
        patternTitle: 'Worked Pattern (Discrete Event Queue)',
        patternCode: `while queue:
    _, arrival, svc = queue.popleft()
    start_time = max(clock, arrival)
    wait_times.append(start_time - arrival)
    clock = start_time + svc`,
        patternExplanation: 'max(clock, arrival) handles idle teller periods when a customer arrives after the previous one finished.',
        expectedExample: 'simulate_teller_queue([("A", 0, 5), ("B", 2, 4)])["avg_wait"] -> 1.5',
        diagnosticExpr: 'simulate_teller_queue([("A", 0, 5), ("B", 2, 4)])',
        breadcrumbs: {
          level1Concept: 'Pop from deque, calculate start_time = max(clock, arrival), append wait, and set clock = start_time + svc.',
          level2Syntax: 'while queue:\n    _, arrival, svc = queue.popleft()\n    start_time = max(clock, arrival)',
          level3Scaffold: 'while queue:\n    _, arrival, svc = queue.popleft()\n    start_time = max(clock, arrival)\n    wait_times.append(start_time - arrival)\n    clock = start_time + svc',
        },
        validationSnippet: 'res = simulate_teller_queue([("Ada", 0, 5), ("Bob", 2, 4), ("Cy", 3, 2)])\nassert res == {"served": 3, "avg_wait": 3.0, "finish_min": 11}',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Monthly Compound Growth',
        taskInstruction: 'In Cell 2 inside simulate_compound_interest(), update balance monthly and append round(balance, 2) to history.',
        targetObjectiveId: '2.2',
        patternTitle: 'Worked Pattern (Compound Interest Loop)',
        patternCode: `for _ in range(months):
    balance = balance * (1 + monthly_rate) + monthly_deposit
    history.append(round(balance, 2))`,
        patternExplanation: 'Keep full floating-point precision in balance during the loop and round only for display snapshots.',
        expectedExample: 'simulate_compound_interest(1000, 0.12, 2) -> [1010.0, 1020.1]',
        diagnosticExpr: 'simulate_compound_interest(1000, 0.12, 2)',
        breadcrumbs: {
          level1Concept: 'Multiply balance by (1 + monthly_rate), add monthly_deposit, and append rounded balance.',
          level2Syntax: 'for _ in range(months):\n    balance = balance * (1 + monthly_rate) + monthly_deposit\n    history.append(round(balance, 2))',
          level3Scaffold: 'for _ in range(months):\n    balance = balance * (1 + monthly_rate) + monthly_deposit\n    history.append(round(balance, 2))',
        },
        validationSnippet: 'assert simulate_compound_interest(1000, 0.12, 2) == [1010.0, 1020.1]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Months to Double Principal',
        taskInstruction: 'In Cell 3 inside months_to_double(principal, annual_rate), loop while balance < target compounding monthly.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Target Doubling Loop)',
        patternCode: `while balance < target:
    balance *= (1 + monthly_rate)
    months += 1`,
        patternExplanation: 'Guarding annual_rate <= 0 guarantees the while loop terminates.',
        expectedExample: 'months_to_double(1000, 0.12) -> 70',
        diagnosticExpr: 'months_to_double(1000, 0.12)',
        breadcrumbs: {
          level1Concept: 'Multiply balance by (1 + annual_rate / 12) and increment months while balance < target.',
          level2Syntax: 'while balance < target:\n    balance *= (1 + monthly_rate)\n    months += 1',
          level3Scaffold: 'monthly_rate = annual_rate / 12\nwhile balance < target:\n    balance *= (1 + monthly_rate)\n    months += 1',
        },
        validationSnippet: 'assert months_to_double(1000, 0.12) == 70',
      },
    ],
  },
  {
    id: 'bonus-strategy-game-ai',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Strategy Game AI',
    sectionNumber: 4,
    sectionName: 'Functions and Exceptions',
    examWeightPercentage: 29,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['4.1', '2.1', '3.1'],
    fileName: 'strategy_game_ai.py',
    testFileName: 'test_strategy_game_ai.py',
    keyTip: 'Evaluate winning moves first, blocking opponent wins second, and positional priority (center > corners > edges) third!',
    pitfallWarning: 'Remember to undo temporary simulated board moves (or copy the board) when testing candidate AI plays.',
    description: 'Design a basic opponent that chooses actions based on game state.',
    learningOutcomes: [
      'Detect winning lines on a 3x3 strategy board',
      'Build a tactical AI that takes immediate wins or blocks threats',
      'Score positional fallbacks cleanly across open squares',
    ],
    starterCode: '# Strategy Game AI',
    solutionCode: '# Solution: Strategy Game AI',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Winning Lines Geometry',
        readOnly: true,
        starterCode: `WIN_LINES = [
    (0, 1, 2), (3, 4, 5), (6, 7, 8),
    (0, 3, 6), (1, 4, 7), (2, 5, 8),
    (0, 4, 8), (2, 4, 6),
]`,
        solutionCode: `WIN_LINES = [
    (0, 1, 2), (3, 4, 5), (6, 7, 8),
    (0, 3, 6), (1, 4, 7), (2, 5, 8),
    (0, 4, 8), (2, 4, 6),
]`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Detect Board Winner',
        starterCode: `# Cell 1 (Step 1): Given 9-char board list (e.g. ["X", " ", ...]), return "X", "O", or None
def check_winner(board):
    # TODO: Check each (a, b, c) in WIN_LINES; if board[a] != " " and board[a] == board[b] == board[c], return board[a]
    return None

print("Winner:", check_winner(["X", "X", "X", " ", "O", " ", " ", " ", "O"]))`,
        solutionCode: `# Cell 1 (Step 1): Given 9-char board list (e.g. ["X", " ", ...]), return "X", "O", or None
def check_winner(board):
    for a, b, c in WIN_LINES:
        if board[a] != " " and board[a] == board[b] == board[c]:
            return board[a]
    return None

print("Winner:", check_winner(["X", "X", "X", " ", "O", " ", " ", " ", "O"]))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Find Immediate Winning Index for a Player',
        starterCode: `# Cell 2 (Step 2): Return index (0..8) that immediately wins for marker ("X" or "O"), else None
def find_winning_move(board, marker):
    for idx in range(9):
        if board[idx] == " ":
            test_board = board[:]
            test_board[idx] = marker
            # TODO: If check_winner(test_board) == marker, return idx
    return None

print("Win for O:", find_winning_move(["O", "O", " ", "X", "X", " ", " ", " ", " "], "O"))`,
        solutionCode: `# Cell 2 (Step 2): Return index (0..8) that immediately wins for marker ("X" or "O"), else None
def find_winning_move(board, marker):
    for idx in range(9):
        if board[idx] == " ":
            test_board = board[:]
            test_board[idx] = marker
            if check_winner(test_board) == marker:
                return idx
    return None

print("Win for O:", find_winning_move(["O", "O", " ", "X", "X", " ", " ", " ", " "], "O"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Full Tactical AI Decision Policy',
        starterCode: `# Cell 3 (Step 3): Choose move: (1) win for ai_mark, (2) block human_mark, (3) center 4, (4) corners, (5) edges
def choose_ai_move(board, ai_mark="O", human_mark="X"):
    win_idx = find_winning_move(board, ai_mark)
    if win_idx is not None:
        return win_idx
    block_idx = find_winning_move(board, human_mark)
    if block_idx is not None:
        return block_idx
    # TODO: Return first empty index from [4, 0, 2, 6, 8, 1, 3, 5, 7], or None if full
    return None

print("Block X at 2:", choose_ai_move(["X", "X", " ", " ", "O", " ", " ", " ", " "]))`,
        solutionCode: `# Cell 3 (Step 3): Choose move: (1) win for ai_mark, (2) block human_mark, (3) center 4, (4) corners, (5) edges
def choose_ai_move(board, ai_mark="O", human_mark="X"):
    win_idx = find_winning_move(board, ai_mark)
    if win_idx is not None:
        return win_idx
    block_idx = find_winning_move(board, human_mark)
    if block_idx is not None:
        return block_idx
    for idx in [4, 0, 2, 6, 8, 1, 3, 5, 7]:
        if board[idx] == " ":
            return idx
    return None

print("Block X at 2:", choose_ai_move(["X", "X", " ", " ", "O", " ", " ", " ", " "]))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Check Winning Triples',
        taskInstruction: 'In Cell 1 inside check_winner(board), check each (a, b, c) in WIN_LINES for 3 matching non-space markers.',
        targetObjectiveId: '3.1',
        patternTitle: 'Worked Pattern (Three-in-a-Row Check)',
        patternCode: `for a, b, c in WIN_LINES:
    if board[a] != " " and board[a] == board[b] == board[c]:
        return board[a]`,
        patternExplanation: 'Chained equality checks all 3 positions in one readable expression.',
        expectedExample: 'check_winner(["X", "X", "X", " ", " ", " ", " ", " ", " "]) -> "X"',
        diagnosticExpr: 'check_winner(["X", "X", "X", " ", " ", " ", " ", " ", " "])',
        breadcrumbs: {
          level1Concept: 'Verify board[a] != " " and board[a] == board[b] == board[c].',
          level2Syntax: 'for a, b, c in WIN_LINES:\n    if board[a] != " " and board[a] == board[b] == board[c]: return board[a]',
          level3Scaffold: 'for a, b, c in WIN_LINES:\n    if board[a] != " " and board[a] == board[b] == board[c]:\n        return board[a]\nreturn None',
        },
        validationSnippet: 'assert check_winner(["O", " ", " ", "O", " ", " ", "O", " ", " "]) == "O" and check_winner([" "] * 9) is None',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Simulated Lookahead Winning Move',
        taskInstruction: 'In Cell 2 inside find_winning_move(board, marker), return idx when placing marker on test_board produces check_winner(test_board) == marker.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (One-Ply Board Lookahead)',
        patternCode: `if check_winner(test_board) == marker:
    return idx`,
        patternExplanation: 'Cloning with board[:] keeps the real game board untouched during lookahead.',
        expectedExample: 'find_winning_move(["O", "O", " ", "X", "X", " ", " ", " ", " "], "O") -> 2',
        diagnosticExpr: 'find_winning_move(["O", "O", " ", "X", "X", " ", " ", " ", " "], "O")',
        breadcrumbs: {
          level1Concept: 'Call check_winner(test_board) == marker and return idx.',
          level2Syntax: 'if check_winner(test_board) == marker: return idx',
          level3Scaffold: 'if check_winner(test_board) == marker:\n    return idx',
        },
        validationSnippet: 'assert find_winning_move(["O", "O", " ", "X", "X", " ", " ", " ", " "], "O") == 2 and find_winning_move([" "] * 9, "X") is None',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Priority-Ordered Tactical AI',
        taskInstruction: 'In Cell 3 inside choose_ai_move(), fall back to the first empty slot in [4, 0, 2, 6, 8, 1, 3, 5, 7].',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Heuristics Fallback Order)',
        patternCode: `for idx in [4, 0, 2, 6, 8, 1, 3, 5, 7]:
    if board[idx] == " ":
        return idx`,
        patternExplanation: 'Checking center (4), then corners, then edges encodes classic 3x3 strategy cleanly.',
        expectedExample: 'choose_ai_move(["X", " ", " ", " ", " ", " ", " ", " ", " "]) -> 4',
        diagnosticExpr: 'choose_ai_move(["X", " ", " ", " ", " ", " ", " ", " ", " "])',
        breadcrumbs: {
          level1Concept: 'Loop over [4, 0, 2, 6, 8, 1, 3, 5, 7] and return the first index where board[idx] == " ".',
          level2Syntax: 'for idx in [4, 0, 2, 6, 8, 1, 3, 5, 7]:\n    if board[idx] == " ": return idx',
          level3Scaffold: 'for idx in [4, 0, 2, 6, 8, 1, 3, 5, 7]:\n    if board[idx] == " ":\n        return idx\nreturn None',
        },
        validationSnippet: 'assert choose_ai_move(["X", "X", " ", " ", "O", " ", " ", " ", " "]) == 2 and choose_ai_move(["O", "O", " ", "X", "X", " ", " ", " ", " "]) == 2 and choose_ai_move(["X"] + [" "] * 8) == 4',
      },
    ],
  },
  {
    id: 'bonus-terminal-spreadsheet',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Terminal Spreadsheet',
    sectionNumber: 3,
    sectionName: 'Data Collections - Tuples, Dictionaries, Lists, and Strings',
    examWeightPercentage: 25,
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    specificObjectives: ['3.5', '3.9', '4.5'],
    fileName: 'terminal_spreadsheet.py',
    testFileName: 'test_terminal_spreadsheet.py',
    keyTip: 'Store raw cell inputs ("10", "=A1+B1", "=SUM(A1:A3)") in a dict keyed by uppercase cell IDs ("A1", "B2") and evaluate formulas recursively on demand.',
    pitfallWarning: 'Track a visiting set during formula evaluation so circular references like A1="=B1" and B1="=A1" raise ValueError instead of crashing with RecursionError.',
    description: 'Implement a grid of cells with editing, formulas, and display logic.',
    learningOutcomes: [
      'Parse cell coordinates and edit raw values or formulas in a dict grid',
      'Evaluate arithmetic (+, -) and range =SUM(A1:A3) formulas recursively',
      'Detect circular cell references and render formatted terminal tables',
    ],
    starterCode: '# Terminal Spreadsheet',
    solutionCode: '# Solution: Terminal Spreadsheet',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Initialize Sheet Grid',
        readOnly: true,
        starterCode: `sheet = {}`,
        solutionCode: `sheet = {}`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Edit Cells & Expand Range References',
        starterCode: `# Cell 1 (Step 1): Store raw values and expand ranges like "A1:A3" into ["A1", "A2", "A3"]
def set_cell(grid, cell_ref, raw_value):
    grid[cell_ref.strip().upper()] = str(raw_value).strip()

def expand_range(range_expr):
    start, end = [p.strip().upper() for p in range_expr.split(":")]
    col = start[0]
    r1, r2 = int(start[1:]), int(end[1:])
    # TODO: Return [f"{col}{r}" for r in range(r1, r2 + 1)]
    return []

print("Range A1:A3 ->", expand_range("A1:A3"))`,
        solutionCode: `# Cell 1 (Step 1): Store raw values and expand ranges like "A1:A3" into ["A1", "A2", "A3"]
def set_cell(grid, cell_ref, raw_value):
    grid[cell_ref.strip().upper()] = str(raw_value).strip()

def expand_range(range_expr):
    start, end = [p.strip().upper() for p in range_expr.split(":")]
    col = start[0]
    r1, r2 = int(start[1:]), int(end[1:])
    return [f"{col}{r}" for r in range(r1, r2 + 1)]

print("Range A1:A3 ->", expand_range("A1:A3"))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Evaluate Numbers, References & =SUM() Formulas',
        starterCode: `# Cell 2 (Step 2): Recursively evaluate a cell reference with cycle detection
def eval_cell(grid, cell_ref, visiting=None):
    ref = cell_ref.strip().upper()
    if visiting is None:
        visiting = set()
    if ref in visiting:
        raise ValueError(f"Circular reference at {ref}")
    raw = grid.get(ref, "0")
    if not raw.startswith("="):
        return float(raw)
    visiting.add(ref)
    expr = raw[1:].strip().upper()
    # TODO: Handle "SUM(A1:A3)" via expand_range() and handle "+" addition like "A1+B1"
    # Always remove ref from visiting before returning
    visiting.remove(ref)
    return 0.0

set_cell(sheet, "A1", 10)
set_cell(sheet, "A2", 25)
set_cell(sheet, "A3", "=SUM(A1:A2)")
print("A3 =", eval_cell(sheet, "A3"))`,
        solutionCode: `# Cell 2 (Step 2): Recursively evaluate a cell reference with cycle detection
def eval_cell(grid, cell_ref, visiting=None):
    ref = cell_ref.strip().upper()
    if visiting is None:
        visiting = set()
    if ref in visiting:
        raise ValueError(f"Circular reference at {ref}")
    raw = grid.get(ref, "0")
    if not raw.startswith("="):
        return float(raw)
    visiting.add(ref)
    expr = raw[1:].strip().upper()
    if expr.startswith("SUM(") and expr.endswith(")"):
        total = sum(eval_cell(grid, c, visiting) for c in expand_range(expr[4:-1]))
    elif "+" in expr:
        parts = [p.strip() for p in expr.split("+")]
        total = sum(eval_cell(grid, p, visiting) if p[0].isalpha() else float(p) for p in parts)
    elif expr[0].isalpha():
        total = eval_cell(grid, expr, visiting)
    else:
        total = float(expr)
    visiting.remove(ref)
    return round(total, 2)

set_cell(sheet, "A1", 10)
set_cell(sheet, "A2", 25)
set_cell(sheet, "A3", "=SUM(A1:A2)")
print("A3 =", eval_cell(sheet, "A3"))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Render Terminal Table Rows',
        starterCode: `# Cell 3 (Step 3): Render columns (e.g. ["A", "B"]) and rows (1..num_rows) as formatted rows
def render_sheet(grid, cols, num_rows):
    rows_out = []
    # TODO: For r in range(1, num_rows + 1), format [f"{col}{r}: {eval_cell(grid, f'{col}{r}')}" for col in cols]
    return rows_out

print("\\n".join(render_sheet(sheet, ["A"], 3)))`,
        solutionCode: `# Cell 3 (Step 3): Render columns (e.g. ["A", "B"]) and rows (1..num_rows) as formatted rows
def render_sheet(grid, cols, num_rows):
    rows_out = []
    for r in range(1, num_rows + 1):
        row_cells = [f"{col}{r}: {eval_cell(grid, f'{col}{r}')}" for col in cols]
        rows_out.append(" | ".join(row_cells))
    return rows_out

print("\\n".join(render_sheet(sheet, ["A"], 3)))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Cell Edits & Range Expansion',
        taskInstruction: 'In Cell 1 inside expand_range(range_expr), return [f"{col}{r}" for r in range(r1, r2 + 1)].',
        targetObjectiveId: '3.9',
        patternTitle: 'Worked Pattern (Column Range Expansion)',
        patternCode: `return [f"{col}{r}" for r in range(r1, r2 + 1)]`,
        patternExplanation: 'Expanding ranges turns "A1:A3" into explicit cell addresses before evaluation.',
        expectedExample: 'expand_range("B2:B4") -> ["B2", "B3", "B4"]',
        diagnosticExpr: 'expand_range("B2:B4")',
        breadcrumbs: {
          level1Concept: 'Generate f"{col}{r}" for each r from r1 to r2 inclusive.',
          level2Syntax: 'return [f"{col}{r}" for r in range(r1, r2 + 1)]',
          level3Scaffold: 'return [f"{col}{r}" for r in range(r1, r2 + 1)]',
        },
        validationSnippet: 'assert expand_range("a1:a3") == ["A1", "A2", "A3"]',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Recursive Formula Evaluator',
        taskInstruction: 'In Cell 2 inside eval_cell(grid, cell_ref), evaluate =SUM(...) and + expressions recursively while guarding circular references.',
        targetObjectiveId: '4.5',
        patternTitle: 'Worked Pattern (Cycle-Guarded Recursion)',
        patternCode: `if expr.startswith("SUM(") and expr.endswith(")"):
    total = sum(eval_cell(grid, c, visiting) for c in expand_range(expr[4:-1]))`,
        patternExplanation: 'Adding ref to visiting before recursion and removing it after detects dependency cycles cleanly.',
        expectedExample: 'eval_cell({"A1": "10", "A2": "25", "A3": "=SUM(A1:A2)"}, "A3") -> 35.0',
        diagnosticExpr: 'eval_cell({"A1": "10", "A2": "25", "A3": "=SUM(A1:A2)"}, "A3")',
        breadcrumbs: {
          level1Concept: 'Handle SUM(...) via expand_range(expr[4:-1]) and + via splitting on "+".',
          level2Syntax: 'if expr.startswith("SUM("): total = sum(eval_cell(grid, c, visiting) for c in expand_range(expr[4:-1]))',
          level3Scaffold: 'if expr.startswith("SUM(") and expr.endswith(")"):\n    total = sum(eval_cell(grid, c, visiting) for c in expand_range(expr[4:-1]))\nelif "+" in expr:\n    parts = [p.strip() for p in expr.split("+")]\n    total = sum(eval_cell(grid, p, visiting) if p[0].isalpha() else float(p) for p in parts)',
        },
        validationSnippet: 'g = {"A1": "10", "A2": "20", "A3": "=SUM(A1:A2)", "B1": "=A3+5"}\nassert eval_cell(g, "A3") == 30.0 and eval_cell(g, "B1") == 35.0',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Display Grid Table',
        taskInstruction: 'In Cell 3 inside render_sheet(grid, cols, num_rows), format each row as "A1: val | B1: val".',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Grid Formatting)',
        patternCode: `for r in range(1, num_rows + 1):
    row_cells = [f"{col}{r}: {eval_cell(grid, f'{col}{r}')}" for col in cols]
    rows_out.append(" | ".join(row_cells))`,
        patternExplanation: 'Joining each row with " | " makes terminal output readable across columns.',
        expectedExample: 'render_sheet({"A1": "5"}, ["A"], 1) -> ["A1: 5.0"]',
        diagnosticExpr: 'render_sheet({"A1": "5"}, ["A"], 1)',
        breadcrumbs: {
          level1Concept: 'Evaluate every (col, r) cell and join row strings with " | ".',
          level2Syntax: 'rows_out.append(" | ".join(f"{col}{r}: {eval_cell(grid, f\'{col}{r}\')}" for col in cols))',
          level3Scaffold: 'for r in range(1, num_rows + 1):\n    row_cells = [f"{col}{r}: {eval_cell(grid, f\'{col}{r}\')}" for col in cols]\n    rows_out.append(" | ".join(row_cells))',
        },
        validationSnippet: 'assert render_sheet({"A1": "10", "B1": "=A1+5"}, ["A", "B"], 1) == ["A1: 10.0 | B1: 15.0"]',
      },
    ],
  },
  {
    id: 'bonus-data-pipeline-tool',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Data Pipeline Tool',
    sectionNumber: 5,
    sectionName: 'Standard Library & File Persistence',
    examWeightPercentage: 15,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['5.1', '4.1', '3.5'],
    fileName: 'data_pipeline_tool.py',
    testFileName: 'test_data_pipeline_tool.py',
    keyTip: 'Design pipelines as clean Extract -> Transform -> Summarize/Load stages where each function receives plain Python lists/dicts.',
    pitfallWarning: 'Never skip validation inside Transform — dirty strings or negative quantities in input files must be filtered before Summarize runs.',
    description: 'Clean, transform, and summarize input files into polished reports.',
    learningOutcomes: [
      'Build an Extract-Transform-Load (ETL) file processing pipeline',
      'Enrich records with derived totals and discount tiers',
      'Export polished JSON and text summary reports from transformed data',
    ],
    starterCode: '# Data Pipeline Tool',
    solutionCode: '# Solution: Data Pipeline Tool',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Create Raw Pipeline Input File',
        readOnly: true,
        starterCode: `import csv, json

PIPE_INPUT = "orders_raw.csv"
PIPE_REPORT = "orders_summary.json"
with open(PIPE_INPUT, "w", encoding="utf-8", newline="") as f:
    f.write("region,item,qty,unit_price\\n")
    f.write(" west , Keyboard , 3 , 50.0 \\n")
    f.write("east,Monitor,bad,200.0\\n")
    f.write("EAST,Mouse,4,25.0\\n")
    f.write("west,USB Hub,2,30.0\\n")`,
        solutionCode: `import csv, json

PIPE_INPUT = "orders_raw.csv"
PIPE_REPORT = "orders_summary.json"
with open(PIPE_INPUT, "w", encoding="utf-8", newline="") as f:
    f.write("region,item,qty,unit_price\\n")
    f.write(" west , Keyboard , 3 , 50.0 \\n")
    f.write("east,Monitor,bad,200.0\\n")
    f.write("EAST,Mouse,4,25.0\\n")
    f.write("west,USB Hub,2,30.0\\n")`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Extract Raw Records From CSV',
        starterCode: `# Cell 1 (Step 1): Read CSV file into list of raw row dictionaries
def extract_orders(filepath):
    # TODO: Open filepath and return list(csv.DictReader(f))
    return []

raw_orders = extract_orders(PIPE_INPUT)
print("Extracted rows:", len(raw_orders))`,
        solutionCode: `# Cell 1 (Step 1): Read CSV file into list of raw row dictionaries
def extract_orders(filepath):
    with open(filepath, "r", encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))

raw_orders = extract_orders(PIPE_INPUT)
print("Extracted rows:", len(raw_orders))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Clean & Transform Valid Rows With Line Totals',
        starterCode: `# Cell 2 (Step 2): Clean region/item, cast qty (int > 0) and unit_price (float > 0), add line_total
def transform_orders(rows):
    transformed = []
    for row in rows:
        try:
            qty = int(row["qty"].strip())
            price = float(row["unit_price"].strip())
        except (ValueError, KeyError):
            continue
        if qty <= 0 or price <= 0:
            continue
        # TODO: Append cleaned dict {"region": row["region"].strip().upper(), "item": row["item"].strip().title(), "qty": qty, "line_total": round(qty * price, 2)}
    return transformed

clean_orders = transform_orders(raw_orders)
print("Transformed:", clean_orders)`,
        solutionCode: `# Cell 2 (Step 2): Clean region/item, cast qty (int > 0) and unit_price (float > 0), add line_total
def transform_orders(rows):
    transformed = []
    for row in rows:
        try:
            qty = int(row["qty"].strip())
            price = float(row["unit_price"].strip())
        except (ValueError, KeyError):
            continue
        if qty <= 0 or price <= 0:
            continue
        transformed.append({
            "region": row["region"].strip().upper(),
            "item": row["item"].strip().title(),
            "qty": qty,
            "line_total": round(qty * price, 2),
        })
    return transformed

clean_orders = transform_orders(raw_orders)
print("Transformed:", clean_orders)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Summarize & Export Polished JSON Report',
        starterCode: `# Cell 3 (Step 3): Compute grand_total, total_units, revenue_by_region, save JSON to report_path
def run_pipeline(in_path, report_path):
    records = transform_orders(extract_orders(in_path))
    by_region = {}
    for rec in records:
        reg = rec["region"]
        by_region[reg] = round(by_region.get(reg, 0.0) + rec["line_total"], 2)
    report = {
        "valid_orders": len(records),
        "total_units": sum(r["qty"] for r in records),
        "grand_total": round(sum(r["line_total"] for r in records), 2),
        "revenue_by_region": by_region,
    }
    # TODO: Write report to report_path using json.dump(report, f, indent=2) and return report
    return {}

print("Pipeline report:", run_pipeline(PIPE_INPUT, PIPE_REPORT))`,
        solutionCode: `# Cell 3 (Step 3): Compute grand_total, total_units, revenue_by_region, save JSON to report_path
def run_pipeline(in_path, report_path):
    records = transform_orders(extract_orders(in_path))
    by_region = {}
    for rec in records:
        reg = rec["region"]
        by_region[reg] = round(by_region.get(reg, 0.0) + rec["line_total"], 2)
    report = {
        "valid_orders": len(records),
        "total_units": sum(r["qty"] for r in records),
        "grand_total": round(sum(r["line_total"] for r in records), 2),
        "revenue_by_region": by_region,
    }
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    return report

print("Pipeline report:", run_pipeline(PIPE_INPUT, PIPE_REPORT))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Extract Raw CSV Rows',
        taskInstruction: 'In Cell 1 inside extract_orders(filepath), open filepath and return list(csv.DictReader(f)).',
        targetObjectiveId: '5.1',
        patternTitle: 'Worked Pattern (Extract Stage)',
        patternCode: `with open(filepath, "r", encoding="utf-8", newline="") as f:
    return list(csv.DictReader(f))`,
        patternExplanation: 'Decoupling Extract lets Transform operate purely on in-memory lists.',
        expectedExample: 'len(extract_orders(PIPE_INPUT)) -> 4',
        diagnosticExpr: 'len(extract_orders(PIPE_INPUT))',
        breadcrumbs: {
          level1Concept: 'Open filepath and return list(csv.DictReader(f)).',
          level2Syntax: 'with open(filepath, "r", encoding="utf-8", newline="") as f:\n    return list(csv.DictReader(f))',
          level3Scaffold: 'with open(filepath, "r", encoding="utf-8", newline="") as f:\n    return list(csv.DictReader(f))',
        },
        validationSnippet: 'assert len(extract_orders(PIPE_INPUT)) == 4',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Clean & Transform Valid Records',
        taskInstruction: 'In Cell 2 inside transform_orders(rows), append cleaned dictionaries with derived line_total.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Transform & Enrich)',
        patternCode: `transformed.append({
    "region": row["region"].strip().upper(),
    "item": row["item"].strip().title(),
    "qty": qty,
    "line_total": round(qty * price, 2),
})`,
        patternExplanation: 'Standardizing keys and computing derived columns makes reporting trivial.',
        expectedExample: 'len(transform_orders(extract_orders(PIPE_INPUT))) -> 3',
        diagnosticExpr: 'len(transform_orders(extract_orders(PIPE_INPUT)))',
        breadcrumbs: {
          level1Concept: 'Append the normalized dict with line_total = round(qty * price, 2).',
          level2Syntax: 'transformed.append({"region": row["region"].strip().upper(), "item": row["item"].strip().title(), "qty": qty, "line_total": round(qty * price, 2)})',
          level3Scaffold: 'transformed.append({\n    "region": row["region"].strip().upper(),\n    "item": row["item"].strip().title(),\n    "qty": qty,\n    "line_total": round(qty * price, 2),\n})',
        },
        validationSnippet: 'clean = transform_orders(extract_orders(PIPE_INPUT))\nassert len(clean) == 3 and clean[0]["line_total"] == 150.0',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Export Summary Report JSON',
        taskInstruction: 'In Cell 3 inside run_pipeline(in_path, report_path), dump report to report_path and return report.',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Load/Export Stage)',
        patternCode: `with open(report_path, "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2)
return report`,
        patternExplanation: 'Writing formatted JSON produces a clean machine- and human-readable summary.',
        expectedExample: 'run_pipeline(PIPE_INPUT, PIPE_REPORT)["grand_total"] -> 310.0',
        diagnosticExpr: 'run_pipeline(PIPE_INPUT, PIPE_REPORT)',
        breadcrumbs: {
          level1Concept: 'Call json.dump(report, f, indent=2) and return report.',
          level2Syntax: 'with open(report_path, "w", encoding="utf-8") as f:\n    json.dump(report, f, indent=2)\nreturn report',
          level3Scaffold: 'with open(report_path, "w", encoding="utf-8") as f:\n    json.dump(report, f, indent=2)\nreturn report',
        },
        validationSnippet: 'rep = run_pipeline(PIPE_INPUT, PIPE_REPORT)\nassert rep["valid_orders"] == 3 and rep["grand_total"] == 310.0 and rep["revenue_by_region"] == {"WEST": 210.0, "EAST": 100.0}',
      },
    ],
  },
  {
    id: 'bonus-adaptive-quiz-engine',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Adaptive Quiz Engine',
    sectionNumber: 2,
    sectionName: 'Control Flow - Conditional Blocks and Loops',
    examWeightPercentage: 29,
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    specificObjectives: ['2.1', '3.5', '4.1'],
    fileName: 'adaptive_quiz_engine.py',
    testFileName: 'test_adaptive_quiz_engine.py',
    keyTip: 'Clamp difficulty level cleanly between 1 (Easy) and 3 (Hard) with min(3, max(1, level + delta)) so streaks adapt without going out of bounds.',
    pitfallWarning: 'Track asked question IDs in a set so stepping up and back down in difficulty never repeats an already-asked question.',
    description: 'Increase or decrease difficulty based on the user’s answers.',
    learningOutcomes: [
      'Maintain dynamic difficulty levels (1..3) with streak-based transitions',
      'Select unseen questions closest to the learner’s current level',
      'Compute weighted mastery scores where harder questions earn more points',
    ],
    starterCode: '# Adaptive Quiz Engine',
    solutionCode: '# Solution: Adaptive Quiz Engine',
    notebookCells: [
      {
        id: 'setup',
        kind: 'setup',
        title: 'Setup Cell · Multi-Level Question Pool',
        readOnly: true,
        starterCode: `ADAPTIVE_POOL = [
    {"id": "q1", "level": 1, "answer": "a"},
    {"id": "q2", "level": 1, "answer": "b"},
    {"id": "q3", "level": 2, "answer": "c"},
    {"id": "q4", "level": 2, "answer": "a"},
    {"id": "q5", "level": 3, "answer": "d"},
    {"id": "q6", "level": 3, "answer": "b"},
]`,
        solutionCode: `ADAPTIVE_POOL = [
    {"id": "q1", "level": 1, "answer": "a"},
    {"id": "q2", "level": 1, "answer": "b"},
    {"id": "q3", "level": 2, "answer": "c"},
    {"id": "q4", "level": 2, "answer": "a"},
    {"id": "q5", "level": 3, "answer": "d"},
    {"id": "q6", "level": 3, "answer": "b"},
]`,
      },
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Adjust Difficulty Based on Answer Outcome',
        starterCode: `# Cell 1 (Step 1): Level up (+1, max 3) on correct answer; level down (-1, min 1) on wrong answer
def next_difficulty(current_level, is_correct):
    # TODO: Return clamped level in [1, 3]
    return current_level

print("Correct at L1 ->", next_difficulty(1, True), "| Wrong at L1 ->", next_difficulty(1, False))`,
        solutionCode: `# Cell 1 (Step 1): Level up (+1, max 3) on correct answer; level down (-1, min 1) on wrong answer
def next_difficulty(current_level, is_correct):
    delta = 1 if is_correct else -1
    return min(3, max(1, current_level + delta))

print("Correct at L1 ->", next_difficulty(1, True), "| Wrong at L1 ->", next_difficulty(1, False))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Pick Unseen Question Closest to Current Level',
        starterCode: `# Cell 2 (Step 2): Return first unseen question matching target_level, or closest available level
def select_next_question(pool, target_level, asked_ids):
    unseen = [q for q in pool if q["id"] not in asked_ids]
    if not unseen:
        return None
    # TODO: Return min(unseen, key=lambda q: abs(q["level"] - target_level))
    return None

print("Pick L2 unseen:", select_next_question(ADAPTIVE_POOL, 2, {"q3"}))`,
        solutionCode: `# Cell 2 (Step 2): Return first unseen question matching target_level, or closest available level
def select_next_question(pool, target_level, asked_ids):
    unseen = [q for q in pool if q["id"] not in asked_ids]
    if not unseen:
        return None
    return min(unseen, key=lambda q: abs(q["level"] - target_level))

print("Pick L2 unseen:", select_next_question(ADAPTIVE_POOL, 2, {"q3"}))`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Run Full Adaptive Session With Weighted Mastery Score',
        starterCode: `# Cell 3 (Step 3): Simulate user responses and award question["level"] * 10 points per correct answer
def run_adaptive_session(pool, user_answers, start_level=1):
    level = start_level
    asked = set()
    points = 0
    trajectory = []
    # TODO: For each ans in user_answers: pick q with select_next_question(), record level, check correctness, add level*10 if correct, update level
    return {"final_level": level, "points": points, "trajectory": trajectory}

print(run_adaptive_session(ADAPTIVE_POOL, ["a", "c", "d"]))`,
        solutionCode: `# Cell 3 (Step 3): Simulate user responses and award question["level"] * 10 points per correct answer
def run_adaptive_session(pool, user_answers, start_level=1):
    level = start_level
    asked = set()
    points = 0
    trajectory = []
    for ans in user_answers:
        q = select_next_question(pool, level, asked)
        if q is None:
            break
        asked.add(q["id"])
        trajectory.append((q["id"], q["level"]))
        correct = ans.strip().lower() == q["answer"].lower()
        if correct:
            points += q["level"] * 10
        level = next_difficulty(level, correct)
    return {"final_level": level, "points": points, "trajectory": trajectory}

print(run_adaptive_session(ADAPTIVE_POOL, ["a", "c", "d"]))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Clamped Difficulty Transitions',
        taskInstruction: 'In Cell 1 inside next_difficulty(current_level, is_correct), return min(3, max(1, current_level + delta)).',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Bounded Step Update)',
        patternCode: `delta = 1 if is_correct else -1
return min(3, max(1, current_level + delta))`,
        patternExplanation: 'Clamping with min/max guarantees the difficulty stays cleanly inside 1..3.',
        expectedExample: 'next_difficulty(3, True) -> 3',
        diagnosticExpr: 'next_difficulty(1, True)',
        breadcrumbs: {
          level1Concept: 'Add +1 if correct else -1, clamped between 1 and 3.',
          level2Syntax: 'return min(3, max(1, current_level + (1 if is_correct else -1)))',
          level3Scaffold: 'delta = 1 if is_correct else -1\nreturn min(3, max(1, current_level + delta))',
        },
        validationSnippet: 'assert next_difficulty(1, True) == 2 and next_difficulty(3, True) == 3 and next_difficulty(1, False) == 1 and next_difficulty(3, False) == 2',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Closest Unseen Question Selection',
        taskInstruction: 'In Cell 2 inside select_next_question(pool, target_level, asked_ids), return min(unseen, key=lambda q: abs(q["level"] - target_level)).',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Nearest-Level Selection)',
        patternCode: `return min(unseen, key=lambda q: abs(q["level"] - target_level))`,
        patternExplanation: 'Python min() keeps the first item when distances tie, falling back gracefully if one level runs empty.',
        expectedExample: 'select_next_question(ADAPTIVE_POOL, 2, {"q3"})["id"] -> "q4"',
        diagnosticExpr: 'select_next_question(ADAPTIVE_POOL, 2, {"q3"})',
        breadcrumbs: {
          level1Concept: 'Use min(unseen, key=lambda q: abs(q["level"] - target_level)).',
          level2Syntax: 'return min(unseen, key=lambda q: abs(q["level"] - target_level))',
          level3Scaffold: 'return min(unseen, key=lambda q: abs(q["level"] - target_level))',
        },
        validationSnippet: 'assert select_next_question(ADAPTIVE_POOL, 2, {"q3"})["id"] == "q4" and select_next_question(ADAPTIVE_POOL, 1, {"q1", "q2"})["level"] == 2',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Adaptive Quiz Loop',
        taskInstruction: 'In Cell 3 inside run_adaptive_session(), select each next question, mark asked, award level*10 on correct answers, and update level.',
        targetObjectiveId: '4.1',
        patternTitle: 'Worked Pattern (Adaptive Feedback Loop)',
        patternCode: `asked.add(q["id"])
trajectory.append((q["id"], q["level"]))
correct = ans.strip().lower() == q["answer"].lower()
if correct: points += q["level"] * 10
level = next_difficulty(level, correct)`,
        patternExplanation: 'Rewarding harder questions with higher points mirrors real adaptive certification scoring.',
        expectedExample: 'run_adaptive_session(ADAPTIVE_POOL, ["a", "c", "d"])["points"] -> 60',
        diagnosticExpr: 'run_adaptive_session(ADAPTIVE_POOL, ["a", "c", "d"])',
        breadcrumbs: {
          level1Concept: 'Pick unseen question, check answer == q["answer"], add level*10, and call next_difficulty().',
          level2Syntax: 'q = select_next_question(pool, level, asked)\nasked.add(q["id"])\ntrajectory.append((q["id"], q["level"]))',
          level3Scaffold: 'for ans in user_answers:\n    q = select_next_question(pool, level, asked)\n    if q is None: break\n    asked.add(q["id"])\n    trajectory.append((q["id"], q["level"]))\n    correct = ans.strip().lower() == q["answer"].lower()\n    if correct: points += q["level"] * 10\n    level = next_difficulty(level, correct)',
        },
        validationSnippet: 'res = run_adaptive_session(ADAPTIVE_POOL, ["a", "c", "d"])\nassert res["points"] == 60 and res["trajectory"] == [("q1", 1), ("q3", 2), ("q5", 3)]',
      },
    ],
  },
  {
    id: 'bonus-tiny-interpreter',
    bonusNumber: 0,
    tier: 'Cerebral Conquest (Hard Mode)',
    title: 'Tiny Interpreter',
    sectionNumber: 4,
    sectionName: 'Functions and Exceptions',
    examWeightPercentage: 29,
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    specificObjectives: ['4.6', '3.5', '2.1'],
    fileName: 'tiny_interpreter.py',
    testFileName: 'test_tiny_interpreter.py',
    keyTip: 'Design your mini language around clear commands like SET x 10, ADD x 5, MUL x 2, and PRINT x backed by an environment dict env = {}.',
    pitfallWarning: 'An argument token like "5" can be a literal integer OR a variable name like "y" — write a small resolve_value(token, env) helper!',
    description: 'Create a mini language that can parse and execute custom commands.',
    learningOutcomes: [
      'Resolve literal numbers vs variables stored in an interpreter environment',
      'Execute custom AST/command lines (SET, ADD, SUB, MUL, PRINT)',
      'Run multi-line programs cleanly and capture stdout output',
    ],
    starterCode: '# Tiny Interpreter',
    solutionCode: '# Solution: Tiny Interpreter',
    notebookCells: [
      {
        id: 'step-1',
        kind: 'step',
        stepNumber: 1,
        title: 'Cell 1 · Resolve Literals & Environment Variables',
        starterCode: `# Cell 1 (Step 1): Convert numeric token to int/float or look up variable name in env
def resolve_value(token, env):
    try:
        return int(token)
    except ValueError:
        if token in env:
            return env[token]
        # TODO: Raise NameError(f"Undefined variable: {token}")
        raise NameError(token)

print("Literal 7:", resolve_value("7", {}), "| Var x:", resolve_value("x", {"x": 12}))`,
        solutionCode: `# Cell 1 (Step 1): Convert numeric token to int/float or look up variable name in env
def resolve_value(token, env):
    try:
        return int(token)
    except ValueError:
        if token in env:
            return env[token]
        raise NameError(f"Undefined variable: {token}")

print("Literal 7:", resolve_value("7", {}), "| Var x:", resolve_value("x", {"x": 12}))`,
      },
      {
        id: 'step-2',
        kind: 'step',
        stepNumber: 2,
        title: 'Cell 2 · Execute Single Mini-Language Statement',
        starterCode: `# Cell 2 (Step 2): Support SET var val, ADD var val, SUB var val, MUL var val, PRINT val
def execute_statement(line, env, outputs):
    tokens = line.strip().split()
    if not tokens or tokens[0].startswith("#"):
        return
    cmd = tokens[0].upper()
    # TODO: Implement SET, ADD, SUB, MUL (updating env[tokens[1]]) and PRINT (appending str(resolve_value) to outputs)
    # Raise ValueError for unknown commands

env_demo = {}
out_demo = []
execute_statement("SET x 10", env_demo, out_demo)
print("Env:", env_demo)`,
        solutionCode: `# Cell 2 (Step 2): Support SET var val, ADD var val, SUB var val, MUL var val, PRINT val
def execute_statement(line, env, outputs):
    tokens = line.strip().split()
    if not tokens or tokens[0].startswith("#"):
        return
    cmd = tokens[0].upper()
    if cmd == "SET":
        env[tokens[1]] = resolve_value(tokens[2], env)
    elif cmd == "ADD":
        env[tokens[1]] = env[tokens[1]] + resolve_value(tokens[2], env)
    elif cmd == "SUB":
        env[tokens[1]] = env[tokens[1]] - resolve_value(tokens[2], env)
    elif cmd == "MUL":
        env[tokens[1]] = env[tokens[1]] * resolve_value(tokens[2], env)
    elif cmd == "PRINT":
        outputs.append(str(resolve_value(tokens[1], env)))
    else:
        raise ValueError(f"Unknown command: {cmd}")

env_demo = {}
out_demo = []
execute_statement("SET x 10", env_demo, out_demo)
print("Env:", env_demo)`,
      },
      {
        id: 'step-3',
        kind: 'step',
        stepNumber: 3,
        title: 'Cell 3 · Run Complete Mini-Language Program',
        starterCode: `# Cell 3 (Step 3): Run multi-line script and return {"env": env, "outputs": outputs}
def run_program(script):
    env = {}
    outputs = []
    # TODO: Loop through script.splitlines() and call execute_statement(line, env, outputs)
    return {"env": env, "outputs": outputs}

prog = """
SET a 4
SET b 6
ADD a b
MUL a 2
PRINT a
"""
print("Program result:", run_program(prog))`,
        solutionCode: `# Cell 3 (Step 3): Run Complete Mini-Language Program
def run_program(script):
    env = {}
    outputs = []
    for line in script.splitlines():
        execute_statement(line, env, outputs)
    return {"env": env, "outputs": outputs}

prog = """
SET a 4
SET b 6
ADD a b
MUL a 2
PRINT a
"""
print("Program result:", run_program(prog))`,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Literal & Variable Resolution',
        taskInstruction: 'Run Cell 1 so resolve_value(token, env) parses integers or resolves variable names cleanly.',
        targetObjectiveId: '4.6',
        patternTitle: 'Worked Pattern (Operand Resolver)',
        patternCode: `try:
    return int(token)
except ValueError:
    if token in env:
        return env[token]
    raise NameError(f"Undefined variable: {token}")`,
        patternExplanation: 'A dedicated resolver lets SET, ADD, MUL, and PRINT all accept both literals and variable names.',
        expectedExample: 'resolve_value("x", {"x": 12}) -> 12',
        diagnosticExpr: 'resolve_value("x", {"x": 12})',
        breadcrumbs: {
          level1Concept: 'Check if token converts to int, otherwise look up token in env.',
          level2Syntax: 'try: return int(token)\nexcept ValueError: ...',
          level3Scaffold: 'try:\n    return int(token)\nexcept ValueError:\n    if token in env: return env[token]\n    raise NameError(f"Undefined variable: {token}")',
        },
        validationSnippet: 'assert resolve_value("7", {}) == 7 and resolve_value("x", {"x": 12}) == 12',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Execute Statement Opcodes',
        taskInstruction: 'In Cell 2 inside execute_statement(), implement SET, ADD, SUB, MUL, and PRINT, raising ValueError on unknown commands.',
        targetObjectiveId: '2.1',
        patternTitle: 'Worked Pattern (Command Dispatch)',
        patternCode: `if cmd == "SET":
    env[tokens[1]] = resolve_value(tokens[2], env)
elif cmd == "ADD":
    env[tokens[1]] += resolve_value(tokens[2], env)`,
        patternExplanation: 'Interpreters evaluate commands by mutating an explicit symbol table dictionary (env).',
        expectedExample: 'execute_statement("SET x 10", env, out)',
        diagnosticExpr: '(lambda e, o: (execute_statement("SET x 10", e, o), e)[1])({}, [])',
        breadcrumbs: {
          level1Concept: 'Branch on cmd == "SET", "ADD", "SUB", "MUL", "PRINT", else raise ValueError.',
          level2Syntax: 'if cmd == "SET": env[tokens[1]] = resolve_value(tokens[2], env)',
          level3Scaffold: 'if cmd == "SET": env[tokens[1]] = resolve_value(tokens[2], env)\nelif cmd == "ADD": env[tokens[1]] += resolve_value(tokens[2], env)\nelif cmd == "SUB": env[tokens[1]] -= resolve_value(tokens[2], env)\nelif cmd == "MUL": env[tokens[1]] *= resolve_value(tokens[2], env)\nelif cmd == "PRINT": outputs.append(str(resolve_value(tokens[1], env)))\nelse: raise ValueError(cmd)',
        },
        validationSnippet: 'e, o = {}, []\nexecute_statement("SET x 5", e, o)\nexecute_statement("ADD x 3", e, o)\nexecute_statement("MUL x 2", e, o)\nexecute_statement("PRINT x", e, o)\nassert e["x"] == 16 and o == ["16"]',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Multi-Line Program Runner',
        taskInstruction: 'In Cell 3 inside run_program(script), iterate over script.splitlines() and call execute_statement(line, env, outputs).',
        targetObjectiveId: '3.5',
        patternTitle: 'Worked Pattern (Interpreter Loop)',
        patternCode: `for line in script.splitlines():
    execute_statement(line, env, outputs)`,
        patternExplanation: 'Blank lines and # comments are skipped cleanly by execute_statement().',
        expectedExample: 'run_program("SET a 4\\nADD a 6\\nPRINT a")["outputs"] -> ["10"]',
        diagnosticExpr: 'run_program("SET a 4\\nADD a 6\\nPRINT a")',
        breadcrumbs: {
          level1Concept: 'Loop line in script.splitlines() and pass env, outputs to execute_statement().',
          level2Syntax: 'for line in script.splitlines():\n    execute_statement(line, env, outputs)',
          level3Scaffold: 'for line in script.splitlines():\n    execute_statement(line, env, outputs)',
        },
        validationSnippet: 'res = run_program("SET a 4\\nSET b 6\\nADD a b\\nMUL a 2\\nPRINT a")\nassert res["outputs"] == ["20"] and res["env"] == {"a": 20, "b": 6}',
      },
    ],
  },
];
