import React, { useState, useRef, useCallback } from 'react';
import { X, File, CheckCircle, AlertCircle, Upload, ShieldCheck } from 'lucide-react';
import { runScan } from '../../services/scanService';

const ACCEPTED_EXTENSIONS = ['.json', '.txt', '.xml', '.toml', '.mod'];
const SUPPORTED_NAMES = ['package.json', 'requirements.txt', 'pom.xml', 'go.mod', 'Cargo.toml'];

/**
 * Formats a file size in bytes to a human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * ScanModal – file upload and vulnerability scanning modal.
 *
 * @param {{ isOpen: boolean, onClose: () => void, onScanComplete: (result: object) => void }} props
 */
const ScanModal = ({ isOpen, onClose, onScanComplete }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const reset = useCallback(() => {
    setDragOver(false);
    setSelectedFile(null);
    setScanning(false);
    setProgress(0);
    setProgressMessage('');
    setError('');
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const validateAndSet = useCallback((file) => {
    if (!file) return;

    setError('');
    const lower = file.name.toLowerCase();
    const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
    if (!hasValidExt) {
      setError(
        'Please upload a supported dependency file (package.json, requirements.txt, pom.xml, go.mod, or Cargo.toml)'
      );
      return;
    }

    if (file.size > 500 * 1024) {
      setError('File too large. Maximum size is 500KB');
      return;
    }

    setSelectedFile(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      validateAndSet(file);
    },
    [validateAndSet]
  );

  const handleFileChange = useCallback(
    (e) => {
      validateAndSet(e.target.files?.[0]);
      // Reset input so same file can be re-selected
      e.target.value = '';
    },
    [validateAndSet]
  );

  const handleStartScan = useCallback(async () => {
    if (!selectedFile) return;
    setScanning(true);
    setError('');
    setProgress(0);

    const onProgress = (pct, msg) => {
      setProgress(pct);
      setProgressMessage(msg);
    };

    try {
      const result = await runScan(selectedFile, onProgress);
      // Brief pause so user sees "Scan complete" message
      await new Promise((r) => setTimeout(r, 600));
      onScanComplete(result);
      handleClose();
    } catch (err) {
      setScanning(false);
      setError(err.message || 'Scan failed. Please try again.');
    }
  }, [selectedFile, onScanComplete, handleClose]);

  if (!isOpen) return null;

  const isIdle = !scanning && !selectedFile;
  const hasFile = !scanning && !!selectedFile;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Scan your project"
    >
      {/* Modal card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Scan Your Project</h2>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
              Upload your dependency file to detect vulnerabilities
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="rounded-full p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8 space-y-5">
          {/* ── IDLE STATE: drag-and-drop zone ── */}
          {isIdle && (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                aria-label="Upload file area"
                className={[
                  'flex flex-col items-center justify-center gap-3 cursor-pointer rounded-xl border-2 border-dashed py-12 px-6 transition-all duration-150',
                  dragOver
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60',
                ].join(' ')}
              >
                <Upload
                  className={`w-10 h-10 transition-colors ${
                    dragOver ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 text-center">
                  Drop your file here or{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">click to browse</span>
                </p>
                {/* File type chips */}
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {SUPPORTED_NAMES.map((name) => (
                    <span
                      key={name}
                      className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-mono"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              {/* Hidden file input */}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS.join(',')}
                className="hidden"
                onChange={handleFileChange}
                aria-hidden="true"
              />
            </>
          )}

          {/* ── FILE SELECTED STATE ── */}
          {hasFile && (
            <>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-slate-800 dark:text-white truncate">
                      {selectedFile.name}
                    </p>
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleStartScan}
                className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-base transition-colors"
                aria-label="Start vulnerability scan"
              >
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Start Scan
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  setError('');
                }}
                className="w-full text-sm text-slate-500 dark:text-slate-400 underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                Choose different file
              </button>
            </>
          )}

          {/* ── SCANNING STATE: progress ── */}
          {scanning && (
            <div className="py-2 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {progressMessage}
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                {progress < 100
                  ? 'Checking against OSV.dev vulnerability database…'
                  : '✅ Scan complete! Preparing results…'}
              </p>
            </div>
          )}

          {/* ── ERROR STATE ── */}
          {error && (
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">Scan Error</p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-0.5">{error}</p>
                <button
                  onClick={() => {
                    setError('');
                    setSelectedFile(null);
                  }}
                  className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400 underline underline-offset-2 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanModal;
