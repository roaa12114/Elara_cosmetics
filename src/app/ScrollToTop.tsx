import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top whenever the route path changes.
 *
 * React Router v6 preserves scroll position across navigations by default,
 * which means clicking a Link near the bottom of one page lands you near the
 * bottom of the next page too. This component listens for pathname changes
 * and resets `window.scrollTo(0, 0)` so each new route starts at the top.
 *
 * Mount it ONCE inside the <BrowserRouter> tree (e.g. next to <AppRouter />).
 * It renders nothing.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" jump — no smooth scroll — so the new page is already at top
    // before paint. Smooth scroll on route change feels laggy and can briefly
    // show the old scroll position.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}