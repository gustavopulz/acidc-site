import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import AnimatedBackground from "./components/AnimatedBackground";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) return;
    fetch(`${apiUrl}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: location.pathname }),
    }).catch(() => {});
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col flex-1">
        <ScrollToTop />
        <AnalyticsTracker />
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <WhatsAppButton />
        <Footer />
      </div>
    </div>
  );
}
