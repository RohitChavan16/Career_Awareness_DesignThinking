import React from 'react';
import { Users, Target, Eye, Heart, Award, Sparkles, Mail, Linkedin, Github } from 'lucide-react';
import Rohit from '../assets/RohitC.jpeg'
import Sudhindra from '../assets/Sudhindra.jpeg'
import TanmayD from '../assets/tanmayD.jpeg'

// Team member interface
interface TeamMember {
  name: string;
  role: string;
  description: string;
  image?: string;
  linkedin?: string;
  email?: string;
}

// Team data
const founders: TeamMember[] = [
  {
    name: 'Tanmay Dahake',
    role: 'Founder',
    description: '',
    image: TanmayD,
    linkedin: '#',
    email: 'rohit@careermarg.in'
  },
  {
    name: 'Rohit Chavan',
    role: 'Founder',
    description: '',
    image: Rohit,
    linkedin: '#',
    email: 'tanmay@careermarg.in'
  },
  {
    name: 'Shambhuraje Bhosale',
    role: 'Founder',
    description: '',
    image: '/assets/shambhuraje-bhosale.jpg',
    linkedin: '#',
    email: 'shambhuraje@careermarg.in'
  },
  {
    name: 'Akshay Diwan',
    role: 'Founder',
    description: '',
    image: 'assets.Rohit',
    linkedin: '#',
    email: 'akshay@careermarg.in'
  },
  {
    name: 'Sudhindra Despande',
    role: 'Founder',
    description: '',
    image: Sudhindra,
    linkedin: '#',
    email: 'sudhindra@careermarg.in'
  },
  {
    name: 'Sairaj Ahire',
    role: 'Founder',
    description: '',
    image: '/assets/sairaj-ahire.jpg',
    linkedin: '#',
    email: 'sairaj@careermarg.in'
  }
];

const specialThanks: TeamMember = {
  name: 'Shipra Moghe',
  role: 'Special Advisor & Mentor',
  description: 'Our guiding light and mentor whose invaluable support and wisdom have been instrumental in shaping CareerMarg\'s vision and mission.',
  image: '/assets/shipra-moghe.jpg',
  linkedin: '#',
  email: 'shipra@careermarg.in'
};

const Teams = () => {
  // Fallback emoji if image doesn't load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = '<div class="text-6xl">👨‍💼</div>';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Meet Our Team</h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Passionate individuals united by a common goal: empowering every Indian student to discover and achieve their dream career
          </p>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Vision */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become India's most trusted career guidance platform, helping every student make informed career decisions and achieve their full potential.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To democratize career guidance by providing comprehensive, accurate, and accessible information about careers, exams, and institutions across India.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h3>
            <p className="text-gray-600 leading-relaxed">
              Integrity, Innovation, Inclusivity, and Impact. We believe in empowering students with authentic information and personalized guidance.
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">What We Stand For</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Student-First', desc: 'Every decision we make puts students at the center' },
              { icon: '📚', title: 'Quality Content', desc: 'Accurate, verified, and comprehensive career information' },
              { icon: '🤝', title: 'Accessibility', desc: 'Making career guidance available to every student in India' },
              { icon: '🚀', title: 'Innovation', desc: 'Leveraging technology to solve career guidance challenges' }
            ].map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-3">{value.icon}</div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Founding Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the visionaries who brought CareerMarg to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 lg:m-10 gap-8">
            {founders.map((founder, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 lg:h-79 h-68 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    onError={handleImageError}
                    className="w-full h-full object-"
                  />
                  {/* Fallback emoji will be injected by handleImageError */}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{founder.name}</h3>
                  <p className="text-indigo-600 font-semibold mb-3">{founder.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{founder.description}</p>
                  <div className="flex items-center gap-3">
                    {founder.linkedin && (
  <a
    href={founder.linkedin}
    className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center hover:bg-indigo-200 transition"
    title="LinkedIn"
  >
    <Linkedin className="w-5 h-5 text-indigo-600" />
  </a>
)}

{founder.email && (
  <a
    href={`mailto:${founder.email}`}
    className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition"
    title="Email"
  >
    <Mail className="w-5 h-5 text-purple-600" />
  </a>
)}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Thanks Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-12 shadow-xl">
          <div className="text-center mb-8">
            <Sparkles className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Special Thanks</h2>
            <p className="text-xl text-gray-600">For Unwavering Support & Guidance</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center p-8">
                  <img
                    src={specialThanks.image}
                    alt={specialThanks.name}
                    onError={handleImageError}
                    className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center mb-3">
                    <Award className="w-6 h-6 text-amber-600 mr-2" />
                    <span className="text-amber-600 font-semibold uppercase text-sm tracking-wide">Mentor & Advisor</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{specialThanks.name}</h3>
                  <p className="text-indigo-600 font-semibold text-lg mb-4">{specialThanks.role}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{specialThanks.description}</p>
                  <div className="flex items-center gap-3">
                   {specialThanks.linkedin && (
  <a
    href={specialThanks.linkedin}
    className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-200 transition"
    title="LinkedIn"
  >
    <Linkedin className="w-6 h-6 text-amber-700" />
  </a>
)}

{specialThanks.email && (
  <a
    href={`mailto:${specialThanks.email}`}
    className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition"
    title="Email"
  >
    <Mail className="w-6 h-6 text-orange-700" />
  </a>
)}

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 italic text-lg">
              "Her mentorship and guidance have been the cornerstone of our journey. We are forever grateful for her trust, wisdom, and continuous support."
            </p>
            <p className="text-gray-800 font-semibold mt-3">— The CareerMarg Team</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Careers Listed' },
              { number: '100+', label: 'Entrance Exams' },
              { number: '1000+', label: 'Colleges Listed' },
              { number: '50K+', label: 'Students Helped' }
            ].map((stat, idx) => (
              <div key={idx} className="transform hover:scale-110 transition">
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-indigo-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Want to be part of India's career guidance revolution? We're always looking for passionate individuals to join our team.
          </p>
          <button className="bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition shadow-lg">
            View Open Positions →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Teams;