import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Award, Clock, Users, BookOpen, Shield, Menu, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const galleryImages = [
  "/images/IMG-20250511-WA0016.jpg",
  "/images/IMG-20250511-WA0007.jpg",
  "/images/IMG-20250511-WA0009.jpg",
  "/images/IMG-20250511-WA0010.jpg",
  "/images/IMG-20250511-WA0011.jpg",
  "/images/IMG-20250511-WA0012.jpg",
  "/images/IMG-20250511-WA0013.jpg",
  "/images/IMG-20250511-WA0014.jpg",
  "/images/IMG-20250511-WA0015.jpg",
  "/images/IMG-20250511-WA0006.jpg",
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
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

      {/* Hero Section */}
      <section className="relative min-h-[55vh] flex items-center justify-center text-white overflow-hidden bg-black">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          src="/video/top_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        {/* Overlay Content */}
        <div className="relative z-10 container mx-auto px-4 text-center py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-lg">Drive with Confidence</h1>
          <p className="text-lg md:text-xl mb-8 overflow-hidden whitespace-nowrap border-r-2 border-white animate-typewriter">
            Perfect Your ride with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 shadow-lg transition-shadow duration-300"
              >
                Apply Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/view-courses">
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition"
              >
                View Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Why Choose Amiran Driving School?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Award className="h-10 w-10 text-yellow-400" />}
              title="Certified Instructors"
              description="Learn from experienced instructors with proven track records in driver education."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-blue-600" />}
              title="Flexible Scheduling"
              description="Choose lesson times that fit your schedule with options throughout the week."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-green-500" />}
              title="Personalized Learning"
              description="Receive individualized attention and tailored instruction based on your needs."
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-purple-500" />}
              title="Comprehensive Curriculum"
              description="Cover all aspects of driving from basics to advanced techniques and safety protocols."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-pink-500" />}
              title="Safety First Approach"
              description="Safety is our top priority with well-maintained vehicles and defensive driving lessons."
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-yellow-400" />}
              title="NTSA Approved"
              description="All our courses are fully approved and comply with NTSA regulations."
            />
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

      {/* Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Gallery</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Explore moments from our classes, events, and student achievements at Amiran Driving College.
          </p>
          <GalleryPreview images={galleryImages} />
        </div>
      </section>

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
                <a href="mailto:info@amirandrivingschool.com" className="hover:text-white">info@amirandrivingschool.com</a>
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

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-[0_0_15px_3px_rgba(128,128,255,0.5)] transition-shadow duration-300">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-blue-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
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