import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Camera,
  Video,
  Heart,
  Cake,
  Baby,
  User,
  Briefcase,
  Shirt,
  BookOpen,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Camera,
    title: 'Wedding Photography',
    desc: 'Complete coverage of your special day with candid and traditional shots',
  },
  {
    icon: Video,
    title: 'Wedding Videography',
    desc: 'Cinematic wedding films that tell your beautiful love story',
  },
  {
    icon: Heart,
    title: 'Pre Wedding',
    desc: 'Romantic pre-wedding shoots at stunning locations',
  },
  {
    icon: Cake,
    title: 'Birthday',
    desc: 'Fun and vibrant birthday party photography for all ages',
  },
  {
    icon: Baby,
    title: 'Baby Shoot',
    desc: 'Adorable newborn and baby photography sessions',
  },
  {
    icon: User,
    title: 'Maternity Shoot',
    desc: 'Beautiful maternity portraits celebrating motherhood',
  },
  {
    icon: Briefcase,
    title: 'Corporate Shoot',
    desc: 'Professional corporate headshots and event photography',
  },
  {
    icon: Shirt,
    title: 'Fashion Shoot',
    desc: 'High-fashion photography for portfolios and campaigns',
  },
  {
    icon: Camera,
    title: 'Drone Coverage',
    desc: 'Aerial photography and videography for epic shots',
  },
  {
    icon: BookOpen,
    title: 'Album Design',
    desc: 'Premium custom-designed photo albums',
  },
];

export default function Services() {
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
    <section id="services" ref={sectionRef} className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-sm text-gold tracking-widest mb-2">
            WHAT WE OFFER
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white">
            Our Services
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="group p-8 bg-black border border-silver/40 hover:border-gold hover:bg-dark-surface transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-6 p-4 bg-dark-surface w-fit group-hover:bg-gold transition-all duration-300">
                  <Icon className="w-8 h-8 text-gold group-hover:text-black transition-colors duration-300" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="font-poppins text-sm text-text-secondary">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
