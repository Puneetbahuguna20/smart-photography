import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  eventType: z.string().min(1, 'Please select an event type'),
  date: z.string().min(1, 'Please select a date'),
  venue: z.string().min(1, 'Venue is required'),
  city: z.string().min(1, 'City is required'),
  package: z.string().min(1, 'Please select a package'),
  budget: z.string().optional(),
  requirements: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function Booking() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
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

  const onSubmit = async (data: BookingFormData) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert('Booking submitted successfully! We will contact you soon!');
        reset();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit booking. Please try again.');
    }
  };

  const eventTypes = ['Wedding', 'Birthday', 'Corporate', 'Pre Wedding', 'Other'];
  const packages = ['Silver', 'Gold', 'Platinum', 'Custom'];

  return (
    <section id="booking" ref={sectionRef} className="py-24 bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-sm text-[#F4C430] tracking-widest mb-2">
            BOOK NOW
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white">
            Get In Touch
          </h2>
        </div>

        <div
          ref={formRef}
          className="p-8 md:p-12 bg-[#111111] border border-[#2E2E2E] backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                  Full Name *
                </label>
                <input
                  {...register('fullName')}
                  type="text"
                  className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none"
                  placeholder="Your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                  Phone Number *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none"
                  placeholder="Your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                  Event Type *
                </label>
                <select
                  {...register('eventType')}
                  className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none"
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.eventType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.eventType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                  Event Date *
                </label>
                <input
                  {...register('date')}
                  type="date"
                  className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                  Venue *
                </label>
                <input
                  {...register('venue')}
                  type="text"
                  className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none"
                  placeholder="Event venue"
                />
                {errors.venue && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.venue.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                  City *
                </label>
                <input
                  {...register('city')}
                  type="text"
                  className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none"
                  placeholder="Your city"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                  Package *
                </label>
                <select
                  {...register('package')}
                  className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none"
                >
                  <option value="">Select a package</option>
                  {packages.map((pkg) => (
                    <option key={pkg} value={pkg}>
                      {pkg}
                    </option>
                  ))}
                </select>
                {errors.package && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.package.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                Budget (Optional)
              </label>
              <input
                {...register('budget')}
                type="text"
                className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none"
                placeholder="Your budget range"
              />
            </div>

            <div>
              <label className="block font-poppins text-sm text-[#BDBDBD] mb-2">
                Special Requirements
              </label>
              <textarea
                {...register('requirements')}
                rows={4}
                className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#3E3E3E] text-white focus:border-[#F4C430] outline-none resize-none"
                placeholder="Tell us about your special requirements"
              />
            </div>

            <button
              type="submit"
              className="w-full font-poppins text-sm font-semibold px-8 py-4 bg-[#F4C430] text-[#0A0A0A] hover:bg-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Booking Request
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
