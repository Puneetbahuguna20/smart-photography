import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Camera,
  Users,
  Zap,
  Star,
  Palette,
  Check,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    icon: Camera,
    title: 'Premium Equipment',
    desc: 'Using the latest cameras and lenses for exceptional quality',
  },
  {
    icon: Users,
    title: 'Creative Team',
    desc: 'Experienced photographers with an eye for detail',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    desc: 'Quick turnaround times without compromising quality',
  },
  {
    icon: Star,
    title: 'Affordable Packages',
    desc: 'Competitive pricing for premium services',
  },
  {
    icon: Camera,
    title: 'Drone Coverage',
    desc: 'Aerial photography for unique perspectives',
  },
  {
    icon: Palette,
    title: 'Professional Editing',
    desc: 'Artistic post-processing for stunning results',
  },
  {
    icon: Check,
    title: '100% Satisfaction',
    desc: 'We guarantee you\'ll love your photos',
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current ? cardsRef.current.children : [],
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-sm text-[#F4C430] tracking-widest mb-2">
            WHY CHOOSE US
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white">
            Why Smart Photography
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="group p-8 bg-[#111111] border border-[#2E2E2E] hover:border-[#F4C430] transition-all duration-300 text-center"
              >
                <div className="mb-6 mx-auto w-fit p-4 bg-[#2E2E2E] group-hover:bg-[#F4C430] transition-all duration-300">
                  <Icon className="w-8 h-8 text-[#F4C430] group-hover:text-[#0A0A0A] transition-colors duration-300" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-white mb-3">
                  {reason.title}
                </h3>
                <p className="font-poppins text-sm text-[#BDBDBD]">
                  {reason.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
