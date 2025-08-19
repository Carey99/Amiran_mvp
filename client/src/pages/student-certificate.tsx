import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Import elegant fonts from Google Fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Great+Vibes&family=Cormorant+Garamond:wght@300;400;500;600&family=Pinyon+Script&family=Dancing+Script:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

export default function StudentCertificate() {
  const [match, params] = useRoute('/admin/students/:id/certificate');
  const studentId = params?.id;
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    fetch(`/api/students/${studentId}`)
      .then(res => res.json())
      .then(data => {
        setStudent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div>;
  }
  if (!student) {
    return <div className="text-center py-16 text-gray-500">Student not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 print:bg-white">
      <div 
        className="relative w-full max-w-4xl h-[600px] shadow-2xl print:shadow-none overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          border: '8px solid #d4af37',
          borderRadius: '12px'
        }}
      >
        {/* Decorative golden border pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, #d4af37 2px, transparent 2px),
              radial-gradient(circle at 80% 20%, #d4af37 2px, transparent 2px),
              radial-gradient(circle at 20% 80%, #d4af37 2px, transparent 2px),
              radial-gradient(circle at 80% 80%, #d4af37 2px, transparent 2px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Golden wave decorations */}
        <div className="absolute top-0 left-0 w-full h-20 overflow-hidden">
          <div 
            className="absolute -top-2 left-0 w-full h-24 opacity-60"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, #d4af37 50%, transparent 60%)',
              transform: 'rotate(-1deg) scaleX(1.2)'
            }}
          ></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden">
          <div 
            className="absolute -bottom-2 left-0 w-full h-24 opacity-60"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, #d4af37 50%, transparent 60%)',
              transform: 'rotate(1deg) scaleX(1.2)'
            }}
          ></div>
        </div>

        {/* Subtle Diagonal Watermark - Multiple instances from top left to bottom right */}
        {/* Row 1 - Top */}
        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(-50px, -30px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(150px, -30px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(350px, -30px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        {/* Row 2 - Middle Top */}
        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(-100px, 70px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(100px, 70px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(300px, 70px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        {/* Row 3 - Center */}
        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(-50px, 170px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(150px, 170px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(350px, 170px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        {/* Row 4 - Middle Bottom */}
        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(-100px, 270px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(100px, 270px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(300px, 270px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        {/* Row 5 - Bottom */}
        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(-50px, 370px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(150px, 370px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.030,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ width: '300px', height: '150px', transform: 'translate(350px, 370px)' }}>
          <div 
            className="text-3xl font-semibold tracking-wider whitespace-nowrap"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              opacity: 0.025,
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              letterSpacing: '4px'
            }}
          >
            AMIRAN DRIVING COLLEGE
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 py-24 text-center">
          
          {/* School Logo - enhanced for black/gold theme */}
          <div
            className="w-24 h-24 mb-2 flex items-center justify-center relative"
            style={{}}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '4px solid #d4af37',
                boxShadow: '0 0 32px 8px rgba(212,175,55,0.5), 0 0 0 8px #1a1a2e',
                zIndex: 1
              }}
            ></div>
            <img
              src="/images/amiran_logo.jpg"
              alt="Amiran Logo"
              className="rounded-full w-20 h-20 object-cover relative"
              style={{
                zIndex: 2,
                filter: 'drop-shadow(0 0 12px #d4af37) brightness(1.1) contrast(1.1)',
                background: 'radial-gradient(circle, #1a1a2e 60%, transparent 100%)',
                border: '2px solid #d4af37'
              }}
            />
          </div>

          {/* Certificate Title */}
          <h1 
            className="text-6xl font-bold mb-4 tracking-wider"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(45deg, #d4af37, #ffd700, #d4af37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px rgba(212, 175, 55, 0.5)'
            }}
          >
            CERTIFICATE
          </h1>
          
          <p 
            className="text-lg text-gold-300 mb-8 tracking-widest"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              letterSpacing: '3px'
            }}
          >
            OF COMPLETION
          </p>

          <p 
            className="text-white text-lg mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            WE DEDICATE TO:
          </p>

          {/* Student Name */}
          <h2 
            className="text-5xl mb-8"
            style={{ 
              fontFamily: 'Pinyon Script, cursive',
              color: '#d4af37',
              textShadow: '0 0 25px rgba(212, 175, 55, 0.6), 0 0 50px rgba(212, 175, 55, 0.3)',
              letterSpacing: '2px',
              transform: 'rotate(-1deg)',
              lineHeight: '1.2',
              textTransform: 'capitalize'
            }}
          >
            {student.firstName} {student.lastName}
          </h2>

          {/* Course Description */}
          <p 
            className="text-white text-base mb-2 max-w-lg leading-relaxed"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            This award is dedicated to the successful completion of
          </p>
          
          <p 
            className="text-white text-base mb-8 max-w-lg leading-relaxed"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            the <span className="text-gold-300 font-semibold" style={{ color: '#d4af37' }}>{student.courseId?.name || student.courseId?.type || 'Driving Course'}</span> program at Amiran Driving College
          </p>

          {/* Date */}
          <p 
            className="text-gold-300 text-sm mb-8"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4af37',
              letterSpacing: '1px'
            }}
          >
            Completion Date: {new Date(student.updatedAt).toLocaleDateString('en-KE', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          {/* Signature Line */}
          <div className="border-t border-gold-400 pt-4" style={{ borderColor: '#d4af37' }}>
            {/* Instructor's Signature with Theme Integration */}
            <div className="mb-2 flex justify-center">
              <img 
                src="/images/amos_signature.png"
                alt="Amos Kibui Signature"
                className="signature-image"
                style={{
                  height: '48px',
                  width: 'auto',
                  filter: 'brightness(1.3) contrast(1.1) sepia(0.8) hue-rotate(30deg) saturate(1.5)',
                  opacity: 0.9,
                  mixBlendMode: 'screen',
                  dropShadow: '0 0 8px rgba(212,175,55,0.3)',
                  maxWidth: '200px'
                }}
                onError={(e) => {
                  // Hide image if signature file doesn't exist yet
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            <p 
              className="text-gold-300 text-sm"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                color: '#d4af37'
              }}
            >
              Authorized by Amos Kibui, Amiran Driving College
            </p>
          </div>
        </div>

        {/* Corner decorations - Art Deco Style like reference */}
        
        {/* Left Side Rhythmic Dots */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <svg width="20" height="300" viewBox="0 0 20 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main vertical line */}
            <line x1="10" y1="20" x2="10" y2="280" stroke="#d4af37" strokeWidth="1" opacity="0.6"/>
            
            {/* Rhythmic dots pattern */}
            <circle cx="10" cy="30" r="2" fill="#d4af37" opacity="0.8"/>
            <circle cx="10" cy="45" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="55" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="75" r="2.5" fill="#d4af37" opacity="0.9"/>
            <circle cx="10" cy="90" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="100" r="1" fill="#d4af37" opacity="0.4"/>
            <circle cx="10" cy="110" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="130" r="3" fill="#d4af37" opacity="1"/>
            <circle cx="10" cy="145" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="155" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="175" r="2.5" fill="#d4af37" opacity="0.9"/>
            <circle cx="10" cy="190" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="200" r="1" fill="#d4af37" opacity="0.4"/>
            <circle cx="10" cy="210" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="230" r="2" fill="#d4af37" opacity="0.8"/>
            <circle cx="10" cy="245" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="255" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="270" r="2" fill="#d4af37" opacity="0.8"/>
          </svg>
        </div>

        {/* Right Side Rhythmic Dots */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <svg width="20" height="300" viewBox="0 0 20 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main vertical line */}
            <line x1="10" y1="20" x2="10" y2="280" stroke="#d4af37" strokeWidth="1" opacity="0.6"/>
            
            {/* Rhythmic dots pattern */}
            <circle cx="10" cy="30" r="2" fill="#d4af37" opacity="0.8"/>
            <circle cx="10" cy="45" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="55" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="75" r="2.5" fill="#d4af37" opacity="0.9"/>
            <circle cx="10" cy="90" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="100" r="1" fill="#d4af37" opacity="0.4"/>
            <circle cx="10" cy="110" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="130" r="3" fill="#d4af37" opacity="1"/>
            <circle cx="10" cy="145" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="155" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="175" r="2.5" fill="#d4af37" opacity="0.9"/>
            <circle cx="10" cy="190" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="200" r="1" fill="#d4af37" opacity="0.4"/>
            <circle cx="10" cy="210" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="230" r="2" fill="#d4af37" opacity="0.8"/>
            <circle cx="10" cy="245" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="10" cy="255" r="1" fill="#d4af37" opacity="0.4"/>
            
            <circle cx="10" cy="270" r="2" fill="#d4af37" opacity="0.8"/>
          </svg>
        </div>
        
        {/* Top Left Corner */}
        <div className="absolute top-6 left-6">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer frame lines */}
            <path d="M5 5 L5 35 M5 5 L35 5" stroke="#d4af37" strokeWidth="3" strokeLinecap="round"/>
            <path d="M5 10 L5 30 M10 5 L30 5" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
            
            {/* Decorative corner elements */}
            <path d="M15 15 L25 15 L25 25 L15 25 Z" stroke="#d4af37" strokeWidth="1" fill="none"/>
            <path d="M12 12 L28 12 L28 28 L12 28 Z" stroke="#d4af37" strokeWidth="0.5" fill="none"/>
            
            {/* Inner geometric pattern */}
            <path d="M8 20 L20 8 M8 8 L20 20" stroke="#d4af37" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="14" cy="14" r="2" stroke="#d4af37" strokeWidth="0.8" fill="none"/>
            
            {/* Additional decorative lines */}
            <path d="M5 15 L15 15 M15 5 L15 15" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M7 25 L25 7" stroke="#d4af37" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
          </svg>
        </div>

        {/* Top Right Corner */}
        <div className="absolute top-6 right-6" style={{ transform: 'scaleX(-1)' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer frame lines */}
            <path d="M5 5 L5 35 M5 5 L35 5" stroke="#d4af37" strokeWidth="3" strokeLinecap="round"/>
            <path d="M5 10 L5 30 M10 5 L30 5" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
            
            {/* Decorative corner elements */}
            <path d="M15 15 L25 15 L25 25 L15 25 Z" stroke="#d4af37" strokeWidth="1" fill="none"/>
            <path d="M12 12 L28 12 L28 28 L12 28 Z" stroke="#d4af37" strokeWidth="0.5" fill="none"/>
            
            {/* Inner geometric pattern */}
            <path d="M8 20 L20 8 M8 8 L20 20" stroke="#d4af37" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="14" cy="14" r="2" stroke="#d4af37" strokeWidth="0.8" fill="none"/>
            
            {/* Additional decorative lines */}
            <path d="M5 15 L15 15 M15 5 L15 15" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M7 25 L25 7" stroke="#d4af37" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
          </svg>
        </div>

        {/* Bottom Left Corner */}
        <div className="absolute bottom-6 left-6" style={{ transform: 'scaleY(-1)' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer frame lines */}
            <path d="M5 5 L5 35 M5 5 L35 5" stroke="#d4af37" strokeWidth="3" strokeLinecap="round"/>
            <path d="M5 10 L5 30 M10 5 L30 5" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
            
            {/* Decorative corner elements */}
            <path d="M15 15 L25 15 L25 25 L15 25 Z" stroke="#d4af37" strokeWidth="1" fill="none"/>
            <path d="M12 12 L28 12 L28 28 L12 28 Z" stroke="#d4af37" strokeWidth="0.5" fill="none"/>
            
            {/* Inner geometric pattern */}
            <path d="M8 20 L20 8 M8 8 L20 20" stroke="#d4af37" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="14" cy="14" r="2" stroke="#d4af37" strokeWidth="0.8" fill="none"/>
            
            {/* Additional decorative lines */}
            <path d="M5 15 L15 15 M15 5 L15 15" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M7 25 L25 7" stroke="#d4af37" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
          </svg>
        </div>

        {/* Bottom Right Corner */}
        <div className="absolute bottom-6 right-6" style={{ transform: 'scale(-1)' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer frame lines */}
            <path d="M5 5 L5 35 M5 5 L35 5" stroke="#d4af37" strokeWidth="3" strokeLinecap="round"/>
            <path d="M5 10 L5 30 M10 5 L30 5" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
            
            {/* Decorative corner elements */}
            <path d="M15 15 L25 15 L25 25 L15 25 Z" stroke="#d4af37" strokeWidth="1" fill="none"/>
            <path d="M12 12 L28 12 L28 28 L12 28 Z" stroke="#d4af37" strokeWidth="0.5" fill="none"/>
            
            {/* Inner geometric pattern */}
            <path d="M8 20 L20 8 M8 8 L20 20" stroke="#d4af37" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="14" cy="14" r="2" stroke="#d4af37" strokeWidth="0.8" fill="none"/>
            
            {/* Additional decorative lines */}
            <path d="M5 15 L15 15 M15 5 L15 15" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M7 25 L25 7" stroke="#d4af37" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
          </svg>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-8 print:hidden">
        <Button 
          onClick={handlePrint} 
          className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-8 py-3 rounded-lg shadow-lg font-semibold"
        >
          Print Certificate
        </Button>
      </div>
    </div>
  );
}
