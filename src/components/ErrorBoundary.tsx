import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Handled gracefully by recovery UI
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('pycert_user_progress_v1');
    } catch {
      // Ignore storage access errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5DC] text-[#2C3E50] p-6 font-sans">
          <div className="max-w-lg w-full rounded-2xl border border-[#BDC3C7] bg-[#FAF9F5] p-6 shadow-lg space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A1827]/15 text-[#5A1827] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-bold text-[#1E3A78]">
                  Something went wrong
                </h1>
                <p className="text-xs text-[#5D6D7E] leading-relaxed">
                  We ran into an unexpected issue displaying this screen. Reload the page to continue, or reset your cached session data if the issue persists.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleResetAndReload}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Session Data & Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
