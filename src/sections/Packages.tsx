import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const packages = [
  {
    name: 'Silver',
    price: '₹25,000',
    features: [
      '6 Hours Coverage',
      '1 Photographer',
      '100 Edited Photos',
      'Online Gallery',
      'Digital Delivery',
    ],
  },
  {
    name: 'Gold',
    price: '₹50,000',
    features: [
      'Full Day Coverage',
      '2 Photographers',
      'Cinematic Highlight Film',
      '300 Edited Photos',
      'Drone Shots',
      'Premium Online Gallery',
      'Digital Delivery',
    ],
  },
  {
    name: 'Platinum',
    price: '₹1,00,000',
    features: [
      '2 Days Coverage',
      '3 Photographers + Videographer',
      'Full Wedding Film',
      'Cinematic Highlight',
      '500+ Edited Photos',
      'Drone Coverage',
      'Premium Album',
      'Pre-Wedding Shoot',
      'Online Gallery',
      'Digital Delivery',
    ],
  },
  {
    name: 'Custom',
    price: 'Custom',
    features: [
      'Flexible Hours Coverage',
      'Tailored Team Selection',
      'Custom Photography & Films',
      'Drone Shots & Specialty',
      'Premium Album Options',
      'Online Gallery Access',
      'Digital Delivery',
    ],
  },
];

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState('Gold');
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
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section id="packages" ref={sectionRef} className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-sm text-[#F4C430] tracking-widest mb-2">
            PRICING
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white">
            Our Packages
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {packages.map((pkg, idx) => {
            const isSelected = selectedPackage === pkg.name;

            return (
              <div
                key={idx}
                onClick={() => setSelectedPackage(pkg.name)}
                className={`relative p-8 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1a1a1a] border-2 border-[#F4C430] scale-105 z-10'
                    : 'bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#F4C430]/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F4C430] px-6 py-1 rounded-full shadow-md">
                    <span className="font-poppins text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">
                      {pkg.name === 'Gold' ? 'MOST POPULAR' : 'SELECTED'}
                    </span>
                  </div>
                )}
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">
                  {pkg.name}
                </h3>
                <div className="mb-8">
                  <span className="font-montserrat text-5xl font-bold text-[#F4C430]">
                    {pkg.price}
                  </span>
                </div>
                <ul className="space-y-4 mb-10">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#F4C430] flex-shrink-0" />
                      <span className="font-poppins text-sm text-[#BDBDBD]">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#booking"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPackage(pkg.name);
                  }}
                  className={`block text-center font-poppins text-sm font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#F4C430] text-[#0A0A0A] hover:bg-[#ffb52b] shadow-[0_0_25px_rgba(244,196,48,0.4)]'
                      : 'border-2 border-[#F4C430] text-[#F4C430] hover:bg-[#F4C430] hover:text-[#0A0A0A]'
                  }`}
                >
                  Book Now
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
