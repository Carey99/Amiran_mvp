import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Award, Clock, Users, BookOpen, Shield, Menu, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const galleryImages = [
  "/images/DSC_3125.JPG",
  "/images/DSC_3000.JPG",
  "/images/DSC_2995.JPG",
  "/images/DSC_3276.JPG",
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200 font-inter">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 shadow-lg sticky top-0 z-50 border-b-4 border-yellow-400">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo and Title */}
          <Link href="/">
            <span className="flex items-center gap-3 cursor-pointer">
              <img
                src="/images/amiran_logo.jpg"
                alt="Amiran Driving School Logo"
                className="h-16 w-auto object-contain bg-white rounded shadow-md p-1"
                style={{ imageRendering: "auto" }}
              />
              <span className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
                Amiran Driving College
              </span>
            </span>
          </Link>

          {/* Hamburger Menu for Small Screens */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-yellow-400 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-full left-0 w-full bg-blue-900 shadow-md md:static md:flex md:justify-end md:space-x-6 md:bg-transparent md:shadow-none`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-6">
              <li>
                <Link href="/">
                  <span className="block text-yellow-400 font-bold border-b-2 border-yellow-400 pb-1 cursor-pointer hover:text-white transition-colors duration-300 md:border-none">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/apply">
                  <span className="block text-white hover:text-yellow-400 font-bold cursor-pointer transition-colors duration-300">
                    Apply Now
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Modern Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          src="/video/top_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-blue-900/60 to-blue-700/60" />
        {/* Content */}
        <motion.div
          className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
            Drive with <span className="text-yellow-400">Confidence</span>
          </h1>
          <p className="text-lg md:text-2xl text-white font-semibold mb-8">
            Perfect your ride with Kenya's most trusted driving college.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 4px 24px #FFD60055" }}
                className="px-8 py-3 rounded-full bg-yellow-400 text-blue-900 font-bold text-lg shadow-lg hover:bg-yellow-300 transition"
              >
                Book a Lesson
              </motion.button>
            </Link>
            <Link href="/view-courses">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#FFD600", color: "#1E3A8A" }}
                className="px-8 py-3 rounded-full border-2 border-yellow-400 text-yellow-400 font-bold text-lg bg-transparent hover:bg-yellow-400 hover:text-blue-900 transition"
              >
                View Courses
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-100 via-blue-50 to-white relative overflow-hidden">
        {/* Optional SVG or gradient accent */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-2xl pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-center mb-14 text-blue-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Why Choose Amiran Driving School?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">Our Driving Courses</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We offer a variety of driving courses to meet your needs, whether you're a beginner or looking to upgrade your skills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Course 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-900 text-yellow-400 p-4">
                <h3 className="text-xl font-bold">Class A - Motorcycle</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">For those looking to ride motorcycles safely and confidently.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span>8 practical lessons</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span>Safety gear provided</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span>Traffic rules and regulations</span>
                  </li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-900">KES 7,000</span>
                  <Link href="/apply">
                    <Button size="sm" className="bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300">Apply Now</Button>
                  </Link>
                </div>
              </div>
            </div>
            {/* Course 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-900 text-yellow-400 p-4">
                <h3 className="text-xl font-bold">Class B - Manual</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Complete training for manual transmission vehicles.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span>15 comprehensive lessons</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span>Highway and urban driving</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span>NTSA test preparation</span>
                  </li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-900">KES 11,000</span>
                  <Link href="/apply">
                    <Button size="sm" className="bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300">Apply Now</Button>
                  </Link>
                </div>
              </div>
            </div>
            {/* Course 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-900 text-yellow-400 p-4">
                <h3 className="text-xl font-bold">Class C - Commercial</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Professional training for commercial vehicle drivers.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span>20 extensive lessons</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span>Load securing techniques</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                    <span>Professional driver certification</span>
                  </li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-900">KES 11,000</span>
                  <Link href="/apply">
                    <Button size="sm" className="bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300">Apply Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Driving Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of satisfied students who have learned to drive with Amiran Driving School.
            Our professional instructors are ready to help you become a confident driver.
          </p>
          <Link href="/apply">
            <Button
              size="lg"
              className="bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 shadow-lg transition-shadow duration-300"
            >
              Apply Now <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Immersive Gallery Section */}
      <ImmersiveGallery images={galleryImages} infos={galleryInfos} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Amiran Driving College</h3>
              <p className="text-gray-400">
                Perfecting Your Ride with Confidence.
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={22} />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition"
                  aria-label="Instagram"
                >
                  <FaInstagram size={22} />
                </a>
                <a
                  href="https://wa.me/254708538416"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={22} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/apply">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Apply Now</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Courses</h4>
              <ul className="space-y-2">
                <li><a href="/view-courses" className="text-gray-400 hover:text-white">Class A - Motorcycle</a></li>
                <li><a href="/view-courses" className="text-gray-400 hover:text-white">Class B - Manual</a></li>
                <li><a href="/view-courses" className="text-gray-400 hover:text-white">Class C - Commercial</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                Kahawa Sukari stage 160 (Mwihoko )<br />
                Nairobi, Kenya<br />
                <a href="tel:+254708538416" className="hover:text-white">+254 708 538 416</a><br />
                <a href="mailto:info@amirandrivingschool.com" className="hover:text-white">info@amirandrivingcollege.co.ke</a>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Amiran Driving College. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Place this above your Home component or outside it:
const features = [
  {
    icon: <Award className="h-7 w-7 text-yellow-400" />,
    iconBg: "bg-yellow-100",
    title: "Certified Instructors",
    description: "Learn from experienced instructors with proven track records in driver education.",
  },
  {
    icon: <Clock className="h-7 w-7 text-blue-600" />,
    iconBg: "bg-blue-100",
    title: "Flexible Scheduling",
    description: "Choose lesson times that fit your schedule with options throughout the week.",
  },
  {
    icon: <Users className="h-7 w-7 text-green-500" />,
    iconBg: "bg-green-100",
    title: "Personalized Learning",
    description: "Receive individualized attention and tailored instruction based on your needs.",
  },
  {
    icon: <BookOpen className="h-7 w-7 text-purple-500" />,
    iconBg: "bg-purple-100",
    title: "Comprehensive Curriculum",
    description: "Cover all aspects of driving from basics to advanced techniques and safety protocols.",
  },
  {
    icon: <Shield className="h-7 w-7 text-pink-500" />,
    iconBg: "bg-pink-100",
    title: "Safety First Approach",
    description: "Safety is our top priority with well-maintained vehicles and defensive driving lessons.",
  },
  {
    icon: <Award className="h-7 w-7 text-yellow-400" />,
    iconBg: "bg-yellow-100",
    title: "NTSA Approved",
    description: "All our courses are fully approved and comply with NTSA regulations.",
  },
];

// Update FeatureCard:
function FeatureCard({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #3b82f633" }}
      className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
    >
      <div className={`mb-5 flex items-center justify-center rounded-full w-16 h-16 ${iconBg} shadow-inner`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 text-blue-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function GalleryPreview({ images }: { images: string[] }) {
  const [showModal, setShowModal] = useState(false);

  // Show only first 5 images in the grid
  const previewImages = images.slice(0, 5);
  const remainingCount = images.length - 5;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {previewImages.map((src, idx) => (
          <div
            key={idx}
            className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={idx === 4 && remainingCount > 0 ? () => setShowModal(true) : undefined}
          >
            <img
              src={src}
              alt={`Gallery image ${idx + 1}`}
              className="object-cover w-full h-44 sm:h-48 md:h-40 lg:h-44 xl:h-48 transform group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              style={{ filter: idx === 4 && remainingCount > 0 ? "brightness(0.7)" : undefined }}
            />
            {/* Overlay for the 5th image */}
            {idx === 4 && remainingCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white text-2xl font-bold">+{remainingCount}</span>
              </div>
            )}
            {/* "View" overlay for other images */}
            {idx !== 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for all images */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-5xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-6 text-blue-900 text-center">Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Gallery image ${idx + 1}`}
                  className="object-cover w-full h-32 sm:h-36 md:h-32 lg:h-36 xl:h-40 rounded shadow"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Typing animation for info
function TypingText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.045, duration: 0.38, ease: "easeOut" }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// Immersive Gallery Section
function ImmersiveGallery({ images, infos }: { images: string[]; infos: { title: string; desc: string }[] }) {
  const [idx, setIdx] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setIdx((i) => (i + 1) % images.length), 4200);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [idx, images.length]);

  return (
    <section className="relative w-full min-h-[380px] md:min-h-[520px] flex items-center justify-center overflow-hidden py-10 md:py-20">
      {/* Background Image with feathered mask */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={images[idx]}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1.08 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{
            zIndex: 1,
            pointerEvents: "none",
            background: `url(${images[idx]}) center center / cover no-repeat`,
            // Center crop for DSC_2995.JPG
            backgroundPosition: images[idx].includes("DSC_2995.JPG") ? "center 80%" : "center center",
            maskImage:
              "radial-gradient(ellipse 120% 80% at 60% 50%, #000 80%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 120% 80% at 60% 50%, #000 80%, transparent 100%)",
            filter: "brightness(0.93) blur(0.5px)",
          }}
        />
      </AnimatePresence>
      {/* Soft overlay for info area (like hero section) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-full md:w-2/3 bg-gradient-to-r from-blue-900/80 via-blue-700/60 to-transparent" />
        {/* Optional: subtle feather for mobile */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-700/60 to-transparent" />
      </div>
      {/* Info Panel (no card, just text) */}
      <div className="relative z-30 w-full md:w-2/3 flex flex-col justify-center items-start px-6 md:pl-16 md:pr-10 py-10 md:py-0">
        <TypingText
          text={infos[idx].title}
          className="block text-2xl md:text-4xl font-extrabold text-blue-100 mb-6 tracking-wide drop-shadow-lg"
        />
        <TypingText
          text={infos[idx].desc}
          className="block text-lg md:text-2xl text-blue-100 font-medium drop-shadow"
        />
        {/* Navigation dots */}
        <div className="flex gap-2 mt-8">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === idx ? "bg-yellow-400 scale-125" : "bg-blue-200"
              }`}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Spacer for right side (image only) */}
      <div className="hidden md:block w-1/3" />
    </section>
  );
}

// In your Home component, REPLACE the commented Gallery section with:
// <ImmersiveGallery images={galleryImages} infos={galleryInfos} />

const galleryInfos = [
  {
    title: "Real Lessons. Real Roads.",
    desc: "Our students learn in real-world conditions, guided by patient, certified instructors. See the Amiran difference in every lesson.",
  },
  {
    title: "Modern Fleet, Modern Skills",
    desc: "Train with the latest vehicles and technology. Safety, comfort, and confidence—every step of the way.",
  },
  {
    title: "Community & Success",
    desc: "Join a vibrant community of learners and achievers. Our graduates are our pride—see their journeys in action.",
  },
  {
    title: "Your Journey Starts Here",
    desc: "From your first lesson to your license, Amiran supports you at every milestone. Experience the journey visually.",
  },
];