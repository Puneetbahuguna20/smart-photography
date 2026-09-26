import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from '../context/RouterContext';
import Logo from '../assets/logo.png';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { categorySlug, navigate } = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    gsap.to(navRef.current, {
      backgroundColor: scrolled ? 'rgba(17, 17, 17, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      paddingTop: scrolled ? '1rem' : '2rem',
      paddingBottom: scrolled ? '1rem' : '2rem',
      duration: 0.5,
      ease: 'power3.out',
    });
  }, [scrolled]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'About', href: '#about' },
    { name: 'Packages', href: '#packages' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (categorySlug !== null) {
      e.preventDefault();
      navigate('/' + href);
    }
  };

  return (
    <nav 
      ref={navRef} 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleLinkClick(e, '#home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img 
            src={Logo} 
            alt="Smart Photography Logo" 
            className="h-12 md:h-16 w-auto"
          />
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-poppins text-sm md:text-base text-white/80 hover:text-gold transition-colors duration-300 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href="#booking"
          onClick={(e) => handleLinkClick(e, '#booking')}
          className="group relative inline-flex items-center justify-center rounded-full bg-gold hover:bg-[#ffb52b] text-black font-poppins text-xs sm:text-sm font-bold px-5 sm:px-7 py-2.5 sm:py-3 shadow-[0_0_25px_rgba(250,179,60,0.4)] hover:shadow-[0_0_35px_rgba(250,179,60,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <span>Book Now</span>
            <span className="text-xs sm:text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
