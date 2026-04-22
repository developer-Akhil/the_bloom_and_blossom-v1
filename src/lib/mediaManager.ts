import { useMediaContext } from '../context/MediaContext';

// Export types for compatibility
export type { MediaFolder, MediaAsset } from '../context/MediaContext';

// Legacy hook wrapper to prevent breakage. 
// Now it consumes the global context instead of spawning local state.
export function useMediaManager() {
  return useMediaContext();
}
