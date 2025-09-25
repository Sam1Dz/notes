import * as React from 'react';

/**
 * Mobile breakpoint width in pixels.
 * Devices with width below this value are considered mobile.
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook that detects if the current viewport is mobile-sized.
 * Uses media queries to track window resize events and determine device type.
 * Returns true for screens narrower than 768px (mobile breakpoint).
 *
 * @returns Boolean indicating if the current viewport is mobile-sized
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 *
 * return (
 *   <div>
 *     {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *   </div>
 * );
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkDevice();

    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
}
