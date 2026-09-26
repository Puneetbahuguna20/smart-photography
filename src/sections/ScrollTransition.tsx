import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CameraImg from '../assets/images/camera1.png';

gsap.registerPlugin(ScrollTrigger);

const ScrollTransition = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cameraRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    // Camera image floats into view
    tl.fromTo(
      cameraRef.current,
      { y: -40, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
    )
    // Camera flash burst
    .to(flashRef.current, {
      opacity: 0.85,
      duration: 0.08,
    })
    .to(flashRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    })
    // Show placeholder text
    .to(
      placeholderRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.2'
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      id="transition"
      ref={sectionRef}
      className="py-16 md:py-24 min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center bg-background relative overflow-hidden"
    >
      {/* Background glow behind camera */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/10 blur-[120px] pointer-events-none" />

      {/* Camera Image without Box */}
      <div
        ref={cameraRef}
        className="relative z-10 mb-8 md:mb-10 w-72 sm:w-88 md:w-[440px] flex items-center justify-center group"
      >
        <img
          src={CameraImg}
          alt="Professional Camera"
          className="w-full h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] drop-shadow-[0_0_25px_rgba(250,179,60,0.25)] transform transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Flash */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-white z-20 opacity-0 pointer-events-none"
      />

      {/* Placeholder */}
      <div
        ref={placeholderRef}
        className="text-center z-10 opacity-0 translate-y-6"
      >
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 md:mb-4">
          Next Phase <span className="text-gold">Starts Here</span>
        </h2>
        <p className="font-poppins text-base md:text-xl text-text-secondary">
          Coming Soon...
        </p>
      </div>
    </section>
  );
};

export default ScrollTransition;
