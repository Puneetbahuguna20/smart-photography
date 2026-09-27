import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Camera from '../assets/images/camera.webp';
import Lens from '../assets/images/lens.webp';

interface PageLoaderProps {
  onComplete: () => void;
}

const PageLoader = ({ onComplete }: PageLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const lensContainerRef = useRef<HTMLDivElement>(null);
  const focusRingRef = useRef<HTMLDivElement>(null);
  const glassGlintRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<SVGGElement>(null);
  const shutterRef = useRef<HTMLDivElement>(null);

  // Keep latest onComplete in ref to prevent stale closures or re-triggering
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Track if onComplete was called to prevent duplicate calls
  const hasCompletedRef = useRef(false);

  const safeComplete = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onCompleteRef.current();
    }
  };

  useEffect(() => {
    let isCancelled = false;
    let tl: gsap.core.Timeline | null = null;

    // Hard fallback timeout: Preloader will NEVER stay stuck longer than 3.5s
    const fallbackTimer = setTimeout(() => {
      safeComplete();
    }, 3500);

    // Fast image loader with 400ms per-image timeout
    const loadAsset = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        let done = false;

        const finish = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };

        // Attach listeners before src to catch cached completions
        img.onload = finish;
        img.onerror = finish;
        img.src = src;

        if (img.complete && img.naturalWidth > 0) {
          finish();
        }

        // Safety timeout per image
        setTimeout(finish, 400);
      });
    };

    const startAnimation = () => {
      if (isCancelled) return;

      try {
        tl = gsap.timeline({
          onComplete: () => {
            clearTimeout(fallbackTimer);
            safeComplete();
          }
        });

        // Initial setup - realistic camera states
        tl.set(cameraRef.current, {
          opacity: 0,
          scale: 0.95
        });
        tl.set(lensContainerRef.current, {
          opacity: 0,
          scale: 0.92
        });
        tl.set(focusRingRef.current, {
          rotate: -18
        });
        tl.set(glassGlintRef.current, {
          opacity: 0.2,
          x: -25
        });
        tl.set(sparkleRef.current, {
          opacity: 0,
          scale: 0.3,
          transformOrigin: 'center center'
        });
        tl.set(shutterRef.current, {
          opacity: 0
        });
        tl.set(logoRef.current, {
          opacity: 0,
          y: 20
        });
        tl.set(flashRef.current, {
          opacity: 0
        });

        // 1. Camera body & lens barrel fade in cleanly
        tl.to(
          [cameraRef.current, lensContainerRef.current],
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.04
          },
          0.05
        );

        // 2. Autofocus mechanism engages: real lens rotates smoothly into sharp focus
        tl.to(
          focusRingRef.current,
          {
            rotate: 0,
            duration: 0.75,
            ease: 'power2.out'
          },
          0.2
        );

        // 3. Optical glass reflection sweeps across real lens surface
        tl.to(
          glassGlintRef.current,
          {
            opacity: 0.85,
            x: 0,
            duration: 0.6,
            ease: 'power2.out'
          },
          0.5
        );
        tl.to(
          glassGlintRef.current,
          {
            opacity: 0.3,
            duration: 0.4,
            ease: 'power2.in'
          },
          1.1
        );

        // 4. Optical focus-lock sparkle twinkles brightly when focus locks
        tl.to(
          sparkleRef.current,
          {
            opacity: 1,
            scale: 1.35,
            duration: 0.25,
            ease: 'back.out(2)'
          },
          0.85
        );
        tl.to(
          sparkleRef.current,
          {
            opacity: 0.35,
            scale: 0.85,
            duration: 0.3,
            ease: 'power2.in'
          },
          1.1
        );

        // 5. Mechanical Shutter Click: Shutter snaps shut for exposure
        tl.to(
          shutterRef.current,
          {
            opacity: 0.95,
            duration: 0.05,
            ease: 'power4.in'
          },
          1.38
        );
        tl.to(
          shutterRef.current,
          {
            opacity: 0,
            duration: 0.08,
            ease: 'power3.out'
          },
          1.43
        );

        // 6. Camera Flash bursts on shutter click
        tl.to(
          flashRef.current,
          {
            opacity: 1,
            duration: 0.08,
            ease: 'power3.out'
          },
          1.43
        );
        tl.to(
          flashRef.current,
          {
            opacity: 0,
            duration: 0.28,
            ease: 'power2.in'
          },
          1.51
        );

        // 7. Logo "SMART PHOTOGRAPHY" emerges with gold brilliance
        tl.to(
          logoRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out'
          },
          1.6
        );

        // 8. Fade out entire preloader smoothly
        tl.to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.55,
            ease: 'power2.inOut',
            onStart: () => {
              if (containerRef.current) {
                containerRef.current.style.pointerEvents = 'none';
              }
            }
          },
          2.3
        );
      } catch (err) {
        console.error('Error starting PageLoader animation:', err);
        safeComplete();
      }
    };

    // Preload both camera & lens images, then start animation immediately
    Promise.all([loadAsset(Camera), loadAsset(Lens)])
      .catch(() => {})
      .finally(() => {
        startAnimation();
      });

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimer);
      if (tl) {
        tl.kill();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden"
    >
      {/* Unified Camera & Lens Responsive Stage:
          Uses camera.webp's exact aspect ratio (1536/1024 = 1.5) so it scales perfectly on any device width */}
      <div className="relative w-full max-w-[340px] sm:max-w-[520px] md:max-w-[640px] lg:max-w-[760px] aspect-[1536/1024] flex items-center justify-center shrink-0">
        
        {/* Photorealistic DSLR Lens - True Macro Photography Optics:
            Exact Center: X=51.76%, Y=56.64%, Diameter=30.2% */}
        <div
          ref={lensContainerRef}
          className="absolute aspect-square rounded-full overflow-hidden pointer-events-none z-10 ring-1 ring-white/20 shadow-2xl"
          style={{
            left: '51.76%',
            top: '56.64%',
            width: '30.2%',
            transform: 'translate(-50%, -50%)',
            boxShadow:
              'inset 0 3px 8px rgba(255,255,255,0.25), inset 0 -4px 14px rgba(0,0,0,0.98), 0 0 32px rgba(0,0,0,0.85)',
          }}
        >
          {/* 1. Real Macro Photograph of Camera Lens (SMART OPTICS 50mm f/1.4) */}
          <div
            ref={focusRingRef}
            className="absolute inset-0 w-full h-full"
            style={{ transformOrigin: 'center center' }}
          >
            <img
              src={Lens}
              alt="Lens Optics"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              className="w-full h-full object-cover scale-[1.05] filter contrast-[1.06] brightness-[1.02]"
            />
          </div>

          {/* 2. Optical Glass Specular Flare & Dynamic Sparkle Layer */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full select-none pointer-events-none">
            <defs>
              {/* Primary Curved Glass Specular Highlight Gradient */}
              <linearGradient id="glintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="35%" stopColor="#f1f5f9" stopOpacity="0.35" />
                <stop offset="75%" stopColor="#cbd5e1" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              {/* Pinpoint Specular Catch-Light Bloom Filter */}
              <filter id="catchGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dynamic Glass Specular Flare (Sweeps across real photo with GSAP) */}
            <path
              ref={glassGlintRef}
              d="M 72 120 C 80 80, 124 52, 184 44 C 244 36, 296 52, 328 76 C 296 60, 240 50, 184 56 C 128 64, 88 90, 72 120 Z"
              fill="url(#glintGrad)"
            />

            {/* Pinpoint Specular Sparkle / Star Catch-Light with Focus-Lock Twinkle */}
            <g ref={sparkleRef} transform="translate(138, 128)">
              <circle cx="0" cy="0" r="3.4" fill="#ffffff" opacity="0.98" filter="url(#catchGlow)" />
              <path d="M 0 -9 L 0 9 M -9 0 L 9 0" stroke="rgba(255,255,255,0.9)" strokeWidth="0.9" />
            </g>

            {/* Subtle Ground-Glass Frosted Rim Reflection */}
            <circle
              cx="200"
              cy="200"
              r="194"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2.5"
            />
          </svg>

          {/* 3. Mechanical Shutter Snapshot Overlay */}
          <div
            ref={shutterRef}
            className="absolute inset-0 bg-black/90 rounded-full opacity-0 pointer-events-none"
          />
        </div>

        {/* Camera Body Image - Scaled dynamically to fit container without cropping */}
        <div 
          ref={cameraRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <img 
            src={Camera} 
            alt="Camera" 
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
          />
        </div>
      </div>

      {/* Logo */}
      <div ref={logoRef} className="mt-4 sm:mt-6 md:mt-8 text-center px-4 shrink-0">
        <h2 className="font-playfair text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide">
          <span className="text-gold">SMART</span> PHOTOGRAPHY
        </h2>
        <p className="font-poppins text-[10px] sm:text-xs md:text-sm text-text-secondary mt-1 sm:mt-1.5 tracking-[0.25em] uppercase">
          Capturing Timeless Moments
        </p>
      </div>

      {/* Flash */}
      <div
        ref={flashRef}
        className="fixed inset-0 bg-white pointer-events-none z-50 opacity-0"
      />
    </div>
  );
};

export default PageLoader;