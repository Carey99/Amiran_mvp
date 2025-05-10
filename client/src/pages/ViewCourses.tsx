import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function ViewCourses() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 shadow-lg sticky top-0 z-50 border-b-4 border-yellow-400">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-yellow-400 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
      <section className="relative min-h-[40vh] flex items-center justify-center text-white overflow-hidden bg-black">
        <img
          src="/images/img_I.jpg"
          alt="Driving dashboard"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 container mx-auto px-4 text-center py-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Our Courses & School Information
          </h1>
          <p className="text-lg md:text-xl mb-4">
            Amiran Driving College — Perfecting Your Ride With Confidence
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
          </div>
        </div>
      </section>

      {/* Why Train With Us */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Why Train With Us?</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Experienced and competent instructors certified by NTSA</li>
              <li>NTSA approved curriculum</li>
              <li>Highly discounted rates</li>
              <li>Road safety centered program</li>
              <li>Modern, well-maintained vehicles</li>
              <li>Flexible scheduling — open 7 days a week</li>
              <li>Personalized lessons for every student</li>
              <li>State-of-the-art learning materials</li>
              <li>Branches in Kahawa Sukari, Kahawa Wendani, Githurai 45, Kasarani</li>
            </ul>
          </div>
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src="/images/img_I.jpg"
              alt="Driving dashboard"
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Course Table Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Course Categories & Fees</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <CourseCard
              category="A2 Motorbike"
              fee="5,000"
              image="/images/Motorbike_A1.webp"
            />
            <CourseCard
              category="A3 Motorbike Taxi"
              fee="7,000"
              image="/images/img_A3.png"
            />
            <CourseCard
              category="B1 (Automatic Light Vehicle)"
              fee="11,000"
              image="/images/img_B.png"
            />
            <CourseCard
              category="B2 (Manual Light Vehicle)"
              fee="11,000"
              image="/images/img_B.png"
            />
            <CourseCard
              category="B3 (Professional Taxi)"
              fee="7,000"
              image="/images/img_B.png"
            />
            <CourseCard
              category="C1 Light Truck"
              fee="11,000"
              image="/images/img_C.webp"
            />
            <CourseCard
              category="C2 Medium Truck"
              fee="11,000"
              image="/images/img_C.webp"
            />
            <CourseCard
              category="PSV - For experience"
              fee="9,000"
              image="/images/img_D.jpg"
            />
            <CourseCard
              category="D1 Van - 14 Passengers PSV"
              fee="9,000"
              image="/images/img_D.jpg"
            />
            <CourseCard
              category="D2 Mini Van 14-32 Passengers"
              fee="9,000"
              image="/images/img_D.jpg"
            />
            <CourseCard
              category="D3 Large Bus 33 & Above"
              fee="9,000"
              image="/images/img_D3.jpg"
            />
          </div>
        </div>
      </section>

      {/* Branches & Contact */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Branches</h2>
            <ul className="text-gray-700 space-y-2">
              <li>Kahawa Sukari stage 160 (Mwihoko)</li>
              <li>Kahawa Wendani</li>
              <li>Githurai 45</li>
              <li>Kasarani</li>
            </ul>
          </div>
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src="/images/img_III.jpg"
              alt="Amiran Fleet"
              className="rounded-lg shadow-lg w-full max-w-md object-cover"
            />
          </div>
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
                <li><a href="#courses" className="text-gray-400 hover:text-white">Class A - Motorcycle</a></li>
                <li><a href="#courses" className="text-gray-400 hover:text-white">Class B - Manual</a></li>
                <li><a href="#courses" className="text-gray-400 hover:text-white">Class C - Commercial</a></li>
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

// Helper for course table rows
function CourseRow({
  category,
  fee,
}: {
  category: string;
  fee: string;
}) {
  return (
    <tr className="border-b">
      <td className="py-2 px-2 font-semibold">{category}</td>
      <td className="py-2 px-2 text-blue-900 font-bold">{fee}</td>
    </tr>
  );
}

// Helper for course cards
function CourseCard({
  category,
  fee,
  image,
}: {
  category: string;
  fee: string;
  image: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
      <div className="w-full flex justify-center mb-4">
        <img
          src={image}
          alt={category}
          className="h-32 w-full max-w-[180px] object-contain rounded-lg bg-white"
          style={{ backgroundColor: "#fff" }}
        />
      </div>
      <h3 className="text-lg font-bold text-blue-900 mb-2 text-center">{category}</h3>
      <div className="text-yellow-500 text-xl font-extrabold mb-2">KES {fee}</div>
      <Link href="/apply">
        <Button size="sm" className="bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 mt-2 w-full">
          Enroll Now
        </Button>
      </Link>
    </div>
  );
}