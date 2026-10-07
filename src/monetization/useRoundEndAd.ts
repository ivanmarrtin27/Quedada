import { useEffect, useRef } from 'react';
import { useAds } from './AdsContext';

/** Dispara un interstitial una vez cuando `active` pasa a true (fin de ronda). */
export function useRoundEndAd(active: boolean) {
  const { showInterstitialIfNeeded } = useAds();
  const shownForCycle = useRef(false);

  useEffect(() => {
    if (!active) {
      shownForCycle.current = false;
      return;
    }
    if (shownForCycle.current) return;
    shownForCycle.current = true;
    void showInterstitialIfNeeded();
  }, [active, showInterstitialIfNeeded]);
}
