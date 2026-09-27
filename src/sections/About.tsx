import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Award, Palette, Heart } from 'lucide-react';
import AboutImg from '../assets/about/about.webp';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );

    const counterEls = document.querySelectorAll('.counter-number');
    counterEls.forEach((el) => {
      const target = parseInt((el as HTMLElement).dataset.target || '0');
      const suffix = (el as HTMLElement).dataset.suffix || '';
      
      gsap.to(el, {
        innerText: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        snap: { innerText: 1 },
        onUpdate: function () {
          (el as HTMLElement).textContent = Math.round(parseFloat((el as HTMLElement).innerText || '0')) + suffix;
        },
      });
    });
  }, []);

  const features = [
    {
      icon: Camera,
      title: 'Professional Equipment',
      desc: 'Top-of-the-line cameras and lenses for stunning results',
    },
    {
      icon: Palette,
      title: 'Creative Editing',
      desc: 'Artistic post-processing to make your photos pop',
    },
    {
      icon: Camera,
      title: 'Drone Services',
      desc: 'Aerial photography for breathtaking perspectives',
    },
    {
      icon: Heart,
      title: 'Premium Albums',
      desc: 'High-quality printed albums to cherish forever',
    },
  ];

  const counters = [
    { number: 500, suffix: '+', label: 'Happy Clients' },
    { number: 150, suffix: '+', label: 'Weddings' },
    { number: 100, suffix: '%', label: 'Customer Satisfaction' },
    { number: 20, suffix: '+', label: 'Awards' },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="relative group">
              <div className="absolute -top-4 -left-4 border-2 border-gold w-full h-full rounded-xl pointer-events-none transition-transform duration-500 group-hover:-top-5 group-hover:-left-5" />
              <div className="relative z-10 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10">
                <img
                  src={AboutImg}
                  alt="About Smart Photography"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold p-6 sm:p-7 rounded-xl z-20 shadow-[0_10px_30px_rgba(250,179,60,0.4)]">
                <Award className="w-10 h-10 sm:w-12 sm:h-12 text-black" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <p className="font-poppins text-sm text-gold tracking-widest mb-2">
                ABOUT US
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
                About Smart Photography
              </h2>
            </div>
            <p className="font-poppins text-text-secondary leading-relaxed">
              With over a decade of experience in capturing life's most precious moments, Smart
              Photography brings a perfect blend of artistry and professionalism to every shoot.
              We specialize in creating timeless memories through our lens, whether it's your
              special wedding day, a corporate event, or a family portrait.
            </p>
            <p className="font-poppins text-text-secondary leading-relaxed">
              Our team of passionate photographers uses state-of-the-art equipment and creative
              techniques to deliver stunning images that you'll treasure for generations to come.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="p-3 bg-dark-surface">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-playfair text-lg font-semibold text-white mb-1">
                        {feat.title}
                      </h4>
                      <p className="font-poppins text-sm text-text-secondary">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Counters */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {counters.map((counter, idx) => (
            <div key={idx} className="text-center">
              <div className="font-montserrat text-5xl md:text-6xl font-bold text-gold mb-2">
                <span
                  className="counter-number"
                  data-target={counter.number}
                  data-suffix={counter.suffix}
                >
                  0
                </span>
              </div>
              <p className="font-poppins text-text-secondary">{counter.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
