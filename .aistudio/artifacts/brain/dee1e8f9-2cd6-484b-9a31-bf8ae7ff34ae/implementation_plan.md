# Implementation Plan: Incorporating Mockup UI Features into PyCert

This plan outlines the architecture and phased integration of the key features requested from the attached UI mockups into PyCert, maintaining the approved top-bar navigation and warm color palette (Navy, Cream, Silver, Charcoal) enriched with subtle burgundy accents (`#5A1827`).

---

## 1. Feature Specifications

### A. Comprehensive Home Dashboard (`HomeDashboard.tsx`)
*Reference: `screen_25c23433.png`*
- **Welcome Hero Section**:
  - Personalized greeting with study streak (e.g., 12-day streak) and exam countdown (14 days remaining).
  - PCEP-30-03 Readiness Circular Gauge (78% Readiness vs. 70% passing threshold, +6% this week).
  - Quick action buttons: **Launch Daily Flashcard Drill**, **Create Syllabus Project**, **Take 45-min Mock Exam**.
- **Syllabus Examination Matrix**:
  - 4 core domain cards (Domain 1: Fundamentals 95%, Domain 2: Control Flow 82%, Domain 3: Collections 64%, Domain 4: Functions & Exceptions 45%).
  - Progress bars, completed task counters, and active lab status tags.
- **Split Daily Practice Grid**:
  - **Adaptive Flashcard Drill Widget**: In-place interactive card prompt (`print(3 * '7')`), type preview, "Reveal Answer", "Needs Review", and "Got it Mastered" buttons.
  - **Featured Syllabus Lab**: Active lab card (*Interactive CLI Caesar Cipher*), milestone progress (3/5), auto-graded tests (4/6 passing), and direct "Resume in Workspace" action.
- **GitHub Sync Bar**:
  - Live repo status (`github.com/devonvance/pcep-prep-2025 Up to date`), recent commit hash, and "Launch README Architect" shortcut.

---

### B. Automated PyTest Test Matrix & Lab Specifications in Workspace (`Workspace.tsx`)
*Reference: `screen_63b705f1.png`*
- **Left Drawer / Pane: Lab Specifications & Automated Test Matrix**:
  - **Lab Specifications (SPEC v30-03)**: Objective breakdown, algorithm trajectory diagram (e.g., Modulo shift `'Y' -> 'B'`), and acceptance criteria checkboxes (interactive & reactive to test results).
  - **PCEP Certification Warning Box**: Domain-specific trap warnings (e.g., string immutability, walrus operator scoping).
  - **Automated Test Matrix**: Multi-test suite breakdown with execution times (`1.8ms`, `2.1ms`), expected vs. actual values, and pass/fail badges.
- **Code Workspace Enhancements**:
  - **Multi-File Tab Bar**: Toggle between primary solution file (`caesar_cipher.py`), unit test file (`test_caesar.py`), and hints (`solution_hints.md`).
  - **Automated Test Runner Action ("Run Tests")**: Runs real assertion tests against student code in Pyodide/simulation runner and outputs formatted PyTest results (`=== test session starts ===`, `4 collected items`, `PASSED [75%]`, `FAILED [100%]`).
  - **PyTest Diagnostic Callouts**: Syllabus-linked diagnostic hints on assertion failure pointing to specific arithmetic or syntax wrap traps.

---

### C. Portfolio Capstone Manager with Git Telemetry (`PortfolioManager.tsx`)
*Reference: `screen_57a1bce1.png`*
- **Target Remote Host & Pre-Flight Audit**:
  - Recruiter host profile card (`@devonvance`, 3/4 Repos Ready, 100% Lab Tests Passing).
  - 6-Point Pre-Flight Audit Checklist (Virtualenv, Standard Folder Layout, Unit Suite, Markdown Badges, License & .gitignore, Annotated Release Tag).
  - Interactive "Push Selected Repos to GitHub" button.
- **Live Telemetry Output Terminal**:
  - Simulated interactive Git & test telemetry showing `git remote -v`, `pytest --tb=line tests/`, and remote push logs.
- **Syllabus Capstone Projects Directory**:
  - Filter tabs: **All**, **Synced (1)**, **Ready (2)**, **Drafts (1)**.
  - Project cards (*PyCalc-CLI*, *CollectionCrafter*, *FlowMaster*, *CustomException Logger*) with commit counts, live architecture tech diagrams, coverage badges, and "Update README" / "View GitHub Repo" actions.

---

### D. Navigation & Color Palette Refinement
- **Top Bar Integration**:
  - Retain clean top navigation with active view tabs: **Home Dashboard**, **Syllabus Labs**, **Capstone Portfolio**, **Flashcards**, and **Practice Exam**.
  - Add search bar for PCEP topics (`'try...except'`, `'slices'`, `'bitwise'`) and readiness indicator pill (`78% Exam Standard`).
  - Student profile badge with avatar (`Devon Vance · Junior Python Dev`).
- **Color Harmony**:
  - Canvas: Cream (`#F5F5DC`) in light mode, Dark Charcoal (`#1A2634`) in dark mode.
  - Core Brand: Deep Navy (`#1E3A78`) & Dark Charcoal (`#2C3E50`).
  - Subtle Burgundy Accents: (`#5A1827` / `#6B1D2F`) for active lab badges, priority indicators, and warning headers matching the mockup aesthetics.

---

## 2. Implementation Steps

1. **Data Model & Types Expansion (`src/types/index.ts` & `src/data/pcepCurriculum.ts`)**:
   - Add capstone project metadata (commit counts, repo status, diagram paths, test suite cases).
   - Add unit test definitions for syllabus lab projects with assertion parameters.

2. **Home Dashboard Component (`src/components/HomeDashboard.tsx`)**:
   - Build readiness gauge, domain matrix cards, daily flashcard widget, and active lab resume card.

3. **Workspace Lab Specifications & PyTest Runner (`src/components/Workspace.tsx`)**:
   - Implement split or tabbed Lab Specifications with algorithm diagrams and acceptance criteria.
   - Implement Automated Test Matrix with `Run Tests` execution and PyTest terminal rendering.

4. **Portfolio Capstone Manager (`src/components/PortfolioManager.tsx`)**:
   - Build dual-column capstone view with pre-flight audit, telemetry output terminal, and rich project cards.

5. **Navbar & App View Switching (`src/components/Navbar.tsx` & `src/App.tsx`)**:
   - Add topic search filter, readiness badge, and new view routing.

6. **Verification & Testing**:
   - Run `compile_applet` and `lint_applet` to confirm 0 errors.
   - Verify server response and responsive layout.
