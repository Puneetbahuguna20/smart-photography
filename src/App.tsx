import { useState, useEffect, useCallback } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RouterProvider, useRouter } from './context/RouterContext';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import BackgroundEffects from './components/BackgroundEffects';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import ScrollTransition from './sections/ScrollTransition';
import About from './sections/About';
import Services from './sections/Services';
import Portfolio from './sections/Portfolio';
import WhyChooseUs from './sections/WhyChooseUs';
import Packages from './sections/Packages';
import Testimonials from './sections/Testimonials';
import Booking from './sections/Booking';
import Contact from './sections/Contact';
import GalleryPage from './pages/GalleryPage';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showCursor, setShowCursor] = useState(false);
  const { categorySlug } = useRouter();

  // Stable callback when preloader finishes
  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);

    // Refresh layout, Lenis, and ScrollTrigger immediately and after opacity transition
    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
      window.dispatchEvent(new Event('resize'));
    });

    const t1 = setTimeout(() => {
      ScrollTrigger.refresh(true);
      window.dispatchEvent(new Event('resize'));
    }, 120);

    const t2 = setTimeout(() => {
      ScrollTrigger.refresh(true);
      window.dispatchEvent(new Event('resize'));
    }, 850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setShowCursor(!isMobile);

    const handleResize = () => {
      setShowCursor(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);

    // Ensure ScrollTrigger recalibrates when web fonts finish rendering
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh(true);
      });
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ReactLenis root>
      <div className="min-h-screen bg-background">
        {isLoading && <PageLoader onComplete={handleLoaderComplete} />}

        <div
          style={{
            opacity: isLoading ? 0 : 1,
            pointerEvents: isLoading ? 'none' : 'auto',
            transition: 'opacity 0.8s ease-out'
          }}
        >
          <BackgroundEffects />
          {showCursor && <CustomCursor />}

          {categorySlug !== null ? (
            <GalleryPage slug={categorySlug} />
          ) : (
            <>
              <Navbar />
              <Hero />
              <Marquee />
              <ScrollTransition />
              <About />
              <Services />
              <Portfolio />
              <WhyChooseUs />
              <Packages />
              <Testimonials />
              <Booking />
              <Contact />
              <Footer />
            </>
          )}
        </div>
      </div>
    </ReactLenis>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
