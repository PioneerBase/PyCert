import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { X, Copy, Check, Download, GitBranch } from 'lucide-react';

interface GitReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitReadmeModal: React.FC<GitReadmeModalProps> = ({ isOpen, onClose }) => {
  const { currentProject, currentUser } = useProgress();

  const [activeTab, setActiveTab] = useState<'readme' | 'gitignore'>('readme');
  const [projectTitle, setProjectTitle] = useState<string>(currentProject.title);
  const [authorName, setAuthorName] = useState<string>(currentUser.name || 'Student Developer');
  const [githubHandle, setGithubHandle] = useState<string>(currentUser.githubHandle || 'your-github');
  const [repoName] = useState<string>('pycert-portfolio-project');
  const [projectDesc, setProjectDesc] = useState<string>(
    currentProject.description || 'A Python application demonstrating core computer science concepts and PCEP-30-03 certification syllabus objectives.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setProjectTitle(currentProject.title);
      setAuthorName(currentUser.name || 'Student Developer');
      setGithubHandle(currentUser.githubHandle || 'your-github');
      setProjectDesc(
        currentProject.description ||
          'A Python application demonstrating core computer science concepts and PCEP-30-03 certification syllabus objectives.'
      );
    }
  }, [isOpen, currentProject, currentUser]);

  if (!isOpen) return null;

  const generatedReadme = `# ${projectTitle}

![Python Version](https://img.shields.io/badge/python-3.11%2B-blue.svg)
![PCEP Domain](https://img.shields.io/badge/PCEP--30--03-Section%200${currentProject.sectionNumber}-emerald)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📌 Project Overview
${projectDesc}

Built as part of the **PyCert 30-03** project-first certification curriculum, bridging technical problem-solving with Python Institute **PCEP-30-03** exam syllabus standards.

---

## 🎯 PCEP-30-03 Syllabus Objectives Demonstrated
- **Domain:** Section 0${currentProject.sectionNumber} — ${currentProject.sectionName} (${currentProject.examWeightPercentage}% Exam Weight)
- **Specific Objectives:**
${currentProject.specificObjectives.map((obj) => `  - \`Objective ${obj}\``).join('\n')}
- **Key Concepts:**
${currentProject.learningOutcomes.map((lo) => `  - ${lo}`).join('\n')}

---

## 🛠️ Tech Stack & Requirements
- **Python**: 3.11+
- **Standard Library Modules**: \`sys\`, \`math\`, \`random\`, \`csv\`
- **Zero External Bloat**: Pure standard library implementation with strict PEP 8 compliance.

---

## 🚀 Installation & Local Setup

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/${githubHandle}/${repoName}.git
cd ${repoName}
\`\`\`

### 2. Set Up Virtual Environment
\`\`\`bash
# Create isolated environment
python3 -m venv .venv

# Activate environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\\Scripts\\activate
\`\`\`

### 3. Run Application
\`\`\`bash
python3 main.py
\`\`\`

---

## 💻 Code Architecture
The core logic resides in \`main.py\` structured with defensive typing and modular functions:
- Robust error handling for runtime edge cases.
- Formatted console input/output with clean stream terminators.
- Memory-efficient sequence iterations and dictionary hashing.

---

## 👨‍💻 Author & Connect
- **Developer**: [${authorName}](https://github.com/${githubHandle})
- **Portfolio**: [github.com/${githubHandle}](https://github.com/${githubHandle})
- **Certification Track**: PCEP-30-03 & PCAD Candidate

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
`;

  const standardGitignore = `# Python virtual environments
.venv/
env/
venv/
ENV/

# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Distribution / packaging
build/
dist/
*.egg-info/

# Environment variables & secrets
.env
.env.local
*.secret.json

# IDE & Editor caches
.vscode/
.idea/
*.swp
*.swo

# Operating System files
.DS_Store
Thumbs.db
`;

  const handleCopy = () => {
    const textToCopy = activeTab === 'readme' ? generatedReadme : standardGitignore;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'readme' ? 'README.md' : '.gitignore';
    const content = activeTab === 'readme' ? generatedReadme : standardGitignore;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141C24]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#FAF9F5] dark:bg-[#1A2634] rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#BDC3C7] dark:border-[#2C3E50] flex items-center justify-between bg-[#F5F5DC] dark:bg-[#141C24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A78]/15 dark:bg-[#1E3A78]/30 text-[#1E3A78] dark:text-[#BDC3C7] flex items-center justify-center border border-[#1E3A78]/30">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                Recruiter-Ready GitHub Portfolio Artifact Generator
              </h3>
              <p className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                Auto-generate professional documentation and git configs for recruiters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#2C3E50]/60 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="p-4 border-b border-[#BDC3C7] dark:border-[#2C3E50] bg-[#EBE9DF]/60 dark:bg-[#1E2936] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[#2C3E50] dark:text-[#BDC3C7] font-semibold mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
            />
          </div>

          <div>
            <label className="block text-[#2C3E50] dark:text-[#BDC3C7] font-semibold mb-1">
              Author Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
            />
          </div>

          <div>
            <label className="block text-[#2C3E50] dark:text-[#BDC3C7] font-semibold mb-1">
              GitHub Username
            </label>
            <input
              type="text"
              value={githubHandle}
              onChange={(e) => setGithubHandle(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] font-mono focus:outline-hidden focus:border-[#1E3A78]"
            />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-[#BDC3C7] dark:border-[#2C3E50] text-xs bg-[#FAF9F5] dark:bg-[#1A2634]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('readme')}
              className={`pb-2.5 font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'readme'
                  ? 'border-[#1E3A78] text-[#1E3A78] dark:text-[#F5F5DC] dark:border-[#BDC3C7]'
                  : 'border-transparent text-[#2C3E50]/70 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC]'
              }`}
            >
              README.md Preview
            </button>
            <button
              onClick={() => setActiveTab('gitignore')}
              className={`pb-2.5 font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'gitignore'
                  ? 'border-[#1E3A78] text-[#1E3A78] dark:text-[#F5F5DC] dark:border-[#BDC3C7]'
                  : 'border-transparent text-[#2C3E50]/70 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC]'
              }`}
            >
              .gitignore Preview
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#E5E5D8] dark:bg-[#243342] hover:bg-[#DCDCCF] dark:hover:bg-[#2C3E50] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-[#BDC3C7] dark:border-[#2C3E50]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : `Copy ${activeTab === 'readme' ? 'README' : '.gitignore'}`}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Preview Code View */}
        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs bg-[#141C24] text-[#F5F5DC] leading-relaxed border-t border-[#2C3E50]">
          <pre className="whitespace-pre-wrap">
            <code>{activeTab === 'readme' ? generatedReadme : standardGitignore}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
