/**
 * Zustand store for global scan state.
 * Shared between DashboardOverview and Sidebar so both components
 * can react to the latest scan result without prop drilling.
 */
import { create } from 'zustand';

/**
 * @typedef {import('../services/scanService').ScanResult} ScanResult
 */

const useScanStore = create((set) => ({
  /** @type {ScanResult|null} */
  scanResult: null,
  /** @type {Date|null} */
  lastScanTime: null,

  /**
   * Store a completed scan result.
   * @param {ScanResult} result
   */
  setScanResult: (result) => set({ scanResult: result, lastScanTime: new Date() }),

  /** Clear stored scan data. */
  clearScan: () => set({ scanResult: null, lastScanTime: null }),
}));

export default useScanStore;
