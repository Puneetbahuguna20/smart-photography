import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = cursorFollowerRef.current;
    if (!cursor || !follower) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const handleImageEnter = () => setIsImage(true);
    const handleImageLeave = () => setIsImage(false);

    document.addEventListener('mousemove', moveCursor);

    const interactiveEls = document.querySelectorAll('a, button, input, select, textarea');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('mouseenter', handleImageEnter);
      img.addEventListener('mouseleave', handleImageLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      images.forEach(img => {
        img.removeEventListener('mouseenter', handleImageEnter);
        img.removeEventListener('mouseleave', handleImageLeave);
      });
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = cursorFollowerRef.current;
    if (!cursor || !follower) return;

    if (isImage) {
      gsap.to(cursor, {
        scale: 0.5,
        duration: 0.3,
        backgroundColor: '#F4C430'
      });
      gsap.to(follower, {
        scale: 3,
        duration: 0.3,
        borderWidth: '2px',
        borderColor: '#F4C430',
        backgroundColor: 'rgba(244, 196, 48, 0.05)'
      });
    } else if (isHovering) {
      gsap.to(cursor, {
        scale: 1.4,
        duration: 0.3,
        backgroundColor: '#F4C430'
      });
      gsap.to(follower, {
        scale: 0.7,
        duration: 0.3,
        borderColor: '#F4C430',
        backgroundColor: 'transparent'
      });
    } else {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        backgroundColor: '#F4C430'
      });
      gsap.to(follower, {
        scale: 1,
        duration: 0.3,
        borderColor: '#2E2E2E',
        backgroundColor: 'transparent'
      });
    }
  }, [isHovering, isImage]);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={cursorFollowerRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 pointer-events-none z-[9998] border-accent"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {/* Crosshair for image hover */}
        {isImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-[1px] bg-primary/60" />
            <div className="absolute w-[1px] h-4 bg-primary/60" />
          </div>
        )}
      </div>
    </>
  );
};

export default CustomCursor;