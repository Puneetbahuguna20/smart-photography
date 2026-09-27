import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Priya & Rahul',
    role: 'Wedding Couple',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=75&w=200&auto=format&fit=crop',
    text: 'Smart Photography captured our wedding day perfectly! Every moment was beautifully preserved. The team was professional and the photos are stunning!',
    rating: 5,
  },
  {
    name: 'Amit Sharma',
    role: 'Corporate Client',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=75&w=200&auto=format&fit=crop',
    text: 'Excellent corporate event photography for our company conference. Professional, punctual, and delivered exceptional quality images!',
    rating: 5,
  },
  {
    name: 'Neha Patel',
    role: 'Maternity Shoot',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=75&w=200&auto=format&fit=crop',
    text: 'Our maternity shoot was an amazing experience! The photos are so natural and beautiful.',
    rating: 5,
  },
  {
    name: 'Rajesh & Meera',
    role: 'Pre Wedding',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=75&w=200&auto=format&fit=crop',
    text: 'Pre-wedding shoot was beyond our expectations! Creative locations and stunning photos!',
    rating: 5,
  },
];

export default function Testimonials() {
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

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-sm text-[#F4C430] tracking-widest mb-2">
            TESTIMONIALS
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white">
            What Our Clients Say
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop
          className="w-full"
        >
          {testimonials.map((testimonial, idx) => (
            <SwiperSlide key={idx}>
              <div className="p-8 bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#F4C430]/50">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#F4C430] fill-[#F4C430]" />
                  ))}
                </div>
                <p className="font-poppins text-[#BDBDBD] mb-8 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#F4C430]"
                  />
                  <div>
                    <h4 className="font-playfair text-lg font-semibold text-white">
                      {testimonial.name}
                    </h4>
                    <p className="font-poppins text-sm text-[#F4C430]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
