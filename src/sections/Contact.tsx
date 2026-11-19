import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Twitter,
  Youtube,
  MessageSquare,
  Navigation,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const contacts = [
    { icon: Phone, title: 'Phone', value: '+91 98996 60313, +91 78270 28826' },
    { icon: MessageSquare, title: 'WhatsApp', value: '+91 98996 60313, +91 78270 28826' },
    { icon: Mail, title: 'Email', value: 'info@smartphotography.com' },
    { icon: MapPin, title: 'Address', value: 'G-1/8, Om Vihar, Phase-V, Near 40 Foota Road, Uttam Nagar, New Delhi-59' },
    { icon: Clock, title: 'Working Hours', value: 'Mon - Sun: 9AM - 9PM' },
  ];

  const socials = [
    { icon: Instagram, href: 'https://www.instagram.com/smartphotography1999/' },
    { icon: Twitter, href: '#' },
    { icon: Youtube, href: '#' },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-sm text-[#F4C430] tracking-widest mb-2">
            CONTACT
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white">
            Get In Touch
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {contacts.map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="p-4 bg-[#2E2E2E]">
                    <Icon className="w-6 h-6 text-[#F4C430]" />
                  </div>
                  <div>
                    <h4 className="font-playfair text-lg font-semibold text-white mb-1">
                      {contact.title}
                    </h4>
                    <p className="font-poppins text-[#BDBDBD]">
                      {contact.value}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-4 pt-4">
              {socials.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    {...(social.href !== '#' && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="p-4 bg-[#2E2E2E] hover:bg-[#F4C430] transition-all duration-300"
                  >
                    <Icon className="w-6 h-6 text-[#F4C430] hover:text-[#0A0A0A] transition-colors" />
                  </a>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="tel:+919899660313"
                className="font-poppins text-sm font-semibold px-8 py-4 bg-[#F4C430] text-[#0A0A0A] hover:bg-white transition-all duration-300 flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              <a
                href="https://wa.me/919899660313"
                className="font-poppins text-sm font-semibold px-8 py-4 border-2 border-[#F4C430] text-[#F4C430] hover:bg-[#F4C430] hover:text-[#0A0A0A] transition-all duration-300 flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=G-1%2F8%2C+Om+Vihar%2C+Phase-V%2C+Near+40+Foota+Road%2C+Uttam+Nagar%2C+New+Delhi+110059"
                target="_blank"
                rel="noopener noreferrer"
                className="font-poppins text-sm font-semibold px-8 py-4 border-2 border-[#F4C430] text-[#F4C430] hover:bg-[#F4C430] hover:text-[#0A0A0A] transition-all duration-300 flex items-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Get Directions
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="bg-[#2E2E2E] min-h-[400px]">
            <iframe
              title="Smart Photography Location"
              src="https://maps.google.com/maps?q=G-1%2F8%2C+Om+Vihar%2C+Phase-V%2C+Near+40+Foota+Road%2C+Uttam+Nagar%2C+New+Delhi+110059&z=16&output=embed"
              className="w-full h-full min-h-[400px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
