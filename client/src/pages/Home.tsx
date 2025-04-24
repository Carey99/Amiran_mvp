import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Award, Clock, Users, BookOpen, Shield, Menu, X } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-700 cursor-pointer flex items-center whitespace-normal md:whitespace-nowrap">
              <img
                src="/images/amiran_logo.jpg"
                alt="Amiran Driving School Logo"
                className="h-[5.5rem] w-auto mr-2 object-contain"
              />
              Amiran Driving College
            </h1>
          </Link>

          {/* Hamburger Menu for Small Screens */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-full left-0 w-full bg-white shadow-md md:static md:flex md:justify-end md:space-x-6 md:bg-transparent md:shadow-none`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-6">
              <li>
                <Link href="/">
                  <span className="block text-blue-600 font-medium border-b-2 border-blue-600 pb-1 cursor-pointer hover:text-blue-800 transition-colors duration-300 md:border-none">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/apply">
                  <span className="block text-gray-600 hover:text-blue-600 font-medium cursor-pointer transition-colors duration-300">
                    Apply Now
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="sticky top-0 text-white py-20 overflow-hidden bg-black">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          src="/video/top_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          onPlay={(e) => e.currentTarget.play()} // Ensure the video resumes play
        ></video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Overlay Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Drive with Confidence</h1>
          <p className="text-xl md:text-2xl mb-8 overflow-hidden whitespace-nowrap border-r-2 border-white animate-typewriter">
            Perfect Your ride with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-[0_0_15px_3px_rgba(0,128,255,0.5)] transition-shadow duration-300"
              >
                Apply Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#courses">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-blue-700 hover:shadow-[0_0_15px_3px_rgba(255,165,0,0.5)] transition-shadow duration-300"
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
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Amiran Driving School?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Award className="h-10 w-10 text-blue-600" />}
              title="Certified Instructors"
              description="Learn from experienced instructors with proven track records in driver education."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-blue-600" />}
              title="Flexible Scheduling"
              description="Choose lesson times that fit your schedule with options throughout the week."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-blue-600" />}
              title="Personalized Learning"
              description="Receive individualized attention and tailored instruction based on your needs."
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-blue-600" />}
              title="Comprehensive Curriculum"
              description="Cover all aspects of driving from basics to advanced techniques and safety protocols."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-blue-600" />}
              title="Safety First Approach"
              description="Safety is our top priority with well-maintained vehicles and defensive driving lessons."
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-blue-600" />}
              title="NTSA Approved"
              description="All our courses are fully approved and comply with NTSA regulations."
            />
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Driving Courses</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We offer a variety of driving courses to meet your needs, whether you're a beginner or looking to upgrade your skills.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Course 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-800 text-white p-4">
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
                  <span className="text-2xl font-bold text-black-700">KES 7,000</span>
                  <Link href="/apply">
                    <Button size="sm">Apply Now</Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Course 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-800 text-white p-4">
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
                  <span className="text-2xl font-bold text-black-700">KES 11,000</span>
                  <Link href="/apply">
                    <Button size="sm">Apply Now</Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Course 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-800 text-white p-4">
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
                  <span className="text-2xl font-bold text-black-700">KES 11,000</span>
                  <Link href="/apply">
                    <Button size="sm">Apply Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Driving Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of satisfied students who have learned to drive with Amiran Driving School.
            Our professional instructors are ready to help you become a confident driver.
          </p>
          <Link href="/apply">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 hover:shadow-[0_0_15px_3px_rgba(0,128,255,0.5)] transition-shadow duration-300"
            >
              Apply Now <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
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

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-[0_0_15px_3px_rgba(128,128,255,0.5)] transition-shadow duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}