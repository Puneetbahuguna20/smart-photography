import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Marquee = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const marqueeContent = [
    "📷 WEDDING SHOOTS",
    "✦ PRE WEDDING",
    "✦ CINEMATIC FILMS",
    "✦ BABY SHOOTS",
    "✦ DESTINATION WEDDINGS",
    "✦ DRONE SHOOTS",
    "✦"
  ];

  useEffect(() => {
    if (!marqueeRef.current) return;

    // Duplicate the content to make it infinite
    const content = marqueeRef.current.querySelector('.marquee-content');
    if (content) {
      content.innerHTML += content.innerHTML;
    }

    const tl = gsap.to('.marquee-content', {
      xPercent: -50,
      duration: 20,
      ease: 'none',
      repeat: -1,
    });
    animationRef.current = tl;

    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    if (animationRef.current) {
      gsap.to(animationRef.current, {
        timeScale: isHovering ? 0.3 : 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [isHovering]);

  return (
    <section
      className="py-6 bg-background border-y border-silver/30 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div ref={marqueeRef} className="relative">
        <div className="marquee-content flex items-center gap-8 whitespace-nowrap">
          {marqueeContent.map((item, i) => (
            <span
              key={i}
              className="font-montserrat text-lg md:text-xl text-gold font-bold uppercase tracking-widest"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marquee;
