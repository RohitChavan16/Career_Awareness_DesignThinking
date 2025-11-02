import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, Award, Building2, BookOpen, Users, ChevronRight, MapPin, Briefcase, GraduationCap, Star, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// TypeScript Interfaces
interface Career {
  id: string;
  name: string;
  slug: string;
  stream: 'Science' | 'Commerce' | 'Arts' | 'Vocational';
  shortDescription: string;
  avgSalaryIndiaLPA: string;
  growthRate: 'High' | 'Medium' | 'Low';
  prerequisites: string;
  topCities: string[];
  icon: string;
  detailedInfo?: CareerDetail;
}

interface CareerDetail {
  overview: string;
  personalityTraits: string[];
  roadmap: RoadmapStep[];
  exams: Exam[];
  institutions: Institution[];
  companies: Company[];
  faqs: FAQ[];
}

interface RoadmapStep {
  phase: string;
  duration: string;
  description: string;
  keyPoints: string[];
}

interface Exam {
  name: string;
  conducting: string;
  eligibility: string;
  frequency: string;
  difficulty: 'High' | 'Medium' | 'Low';
}

interface Institution {
  name: string;
  location: string;
  ranking: string;
  type: 'IIT' | 'IIM' | 'NIT' | 'AIIMS' | 'University' | 'College';
}

interface Company {
  name: string;
  sector: string;
  hiring: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  category: string;
}



// Sample Data
const careers: Career[] = [
  {
    id: 'ds-ml',
    name: 'Data Scientist / ML Engineer',
    slug: 'data-scientist',
    stream: 'Science',
    shortDescription: 'Build AI models and analyze complex data. Top demand in tech hubs.',
    avgSalaryIndiaLPA: '10 - 25 LPA',
    growthRate: 'High',
    prerequisites: 'B.Tech/M.Sc. in CS, Statistics, or Mathematics',
    topCities: ['Bangalore', 'Pune', 'Hyderabad'],
    icon: '🤖',
    detailedInfo: {
      overview: 'Data Scientists are in extreme demand across India, especially in tech cities. They work on machine learning, AI, and big data analytics to drive business decisions.',
      personalityTraits: ['Analytical', 'Problem Solver', 'Detail-Oriented', 'Curious'],
      roadmap: [
        { phase: 'Class 10-12', duration: '2 years', description: 'Focus on PCM (Physics, Chemistry, Mathematics)', keyPoints: ['Excel in Mathematics', 'Learn basic programming', 'Build strong foundation in Statistics'] },
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech in Computer Science/Data Science or B.Sc. in Statistics', keyPoints: ['Master Python/R', 'Learn ML algorithms', 'Work on real projects', 'Internships at startups'] },
        { phase: 'Specialization', duration: '1-2 years', description: 'M.Tech in AI/ML or industry certifications', keyPoints: ['Deep Learning specialization', 'Cloud certifications (AWS/Azure)', 'Portfolio building'] }
      ],
      exams: [
        { name: 'JEE Main & Advanced', conducting: 'NTA/IIT', eligibility: '12th PCM with 75%', frequency: 'Annual', difficulty: 'High' },
        { name: 'BITSAT', conducting: 'BITS Pilani', eligibility: '12th PCM with 75%', frequency: 'Annual', difficulty: 'High' },
        { name: 'State CETs', conducting: 'State Boards', eligibility: '12th PCM', frequency: 'Annual', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'IIT Bombay', location: 'Mumbai', ranking: 'NIRF Rank 1', type: 'IIT' },
        { name: 'IIT Delhi', location: 'New Delhi', ranking: 'NIRF Rank 2', type: 'IIT' },
        { name: 'BITS Pilani', location: 'Pilani', ranking: 'NIRF Rank 25', type: 'University' },
        { name: 'IIIT Hyderabad', location: 'Hyderabad', ranking: 'NIRF Rank 50', type: 'College' }
      ],
      companies: [
        { name: 'Google India', sector: 'Technology', hiring: 'Bangalore, Hyderabad' },
        { name: 'Microsoft India', sector: 'Technology', hiring: 'Bangalore, Hyderabad' },
        { name: 'Amazon', sector: 'E-commerce/Tech', hiring: 'Bangalore, Mumbai' },
        { name: 'Flipkart', sector: 'E-commerce', hiring: 'Bangalore' },
        { name: 'TCS Research', sector: 'IT Services', hiring: 'Pan India' }
      ],
      faqs: [
        { question: 'Do I need a Tier-1 college?', answer: 'Not mandatory. Skills and portfolio matter more. Many successful data scientists are from Tier-2/3 colleges.' },
        { question: 'What coding languages should I learn?', answer: 'Python is essential. SQL for databases, R for statistics. Learn frameworks like TensorFlow and PyTorch.' }
      ]
    }
  },
  {
    id: 'ca',
    name: 'Chartered Accountant (CA)',
    slug: 'chartered-accountant',
    stream: 'Commerce',
    shortDescription: 'Financial expert handling audits, taxation, and business advisory.',
    avgSalaryIndiaLPA: '8 - 20 LPA',
    growthRate: 'High',
    prerequisites: '12th Commerce, CA Foundation cleared',
    topCities: ['Mumbai', 'Delhi', 'Chennai', 'Bangalore'],
    icon: '💼',
    detailedInfo: {
      overview: 'One of the most prestigious careers in India. CAs are financial advisors, auditors, and tax consultants with excellent job security and entrepreneurial opportunities.',
      personalityTraits: ['Analytical', 'Detail-Oriented', 'Ethical', 'Patient'],
      roadmap: [
        { phase: 'After 12th', duration: '6 months', description: 'CA Foundation Course', keyPoints: ['Register with ICAI', 'Study Accounting, Economics, Law', 'Clear Foundation exam'] },
        { phase: 'Intermediate', duration: '2 years', description: 'CA Intermediate + Articleship', keyPoints: ['Complete 3 years articleship', 'Study Advanced Accounting, Taxation', 'Practical exposure'] },
        { phase: 'Final', duration: '1.5 years', description: 'CA Final', keyPoints: ['Complete Final exams', 'Specialize in Taxation/Audit', 'Start practice or join firm'] }
      ],
      exams: [
        { name: 'CA Foundation', conducting: 'ICAI', eligibility: '12th Commerce', frequency: 'Twice a year', difficulty: 'Medium' },
        { name: 'CA Intermediate', conducting: 'ICAI', eligibility: 'CA Foundation cleared', frequency: 'Twice a year', difficulty: 'High' },
        { name: 'CA Final', conducting: 'ICAI', eligibility: 'CA Intermediate + Articleship', frequency: 'Twice a year', difficulty: 'High' }
      ],
      institutions: [
        { name: 'ICAI - Mumbai', location: 'Mumbai', ranking: 'Official Body', type: 'University' },
        { name: 'ICAI - Delhi', location: 'New Delhi', ranking: 'Official Body', type: 'University' }
      ],
      companies: [
        { name: 'Deloitte India', sector: 'Consulting', hiring: 'Pan India' },
        { name: 'EY India', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'KPMG India', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'PwC India', sector: 'Consulting', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'How difficult is CA?', answer: 'CA is challenging with an average pass rate of 10-15%. Requires dedication, consistency, and 3-4 years of commitment.' },
        { question: 'Can I do graduation alongside CA?', answer: 'Yes, many students pursue B.Com while doing CA Intermediate.' }
      ]
    }
  },
  {
    id: 'doctor',
    name: 'Medical Doctor (MBBS)',
    slug: 'medical-doctor',
    stream: 'Science',
    shortDescription: 'Diagnose and treat patients, save lives in hospitals and clinics.',
    avgSalaryIndiaLPA: '6 - 20 LPA',
    growthRate: 'Medium',
    prerequisites: '12th PCB with 50%+ marks, NEET qualified',
    topCities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'],
    icon: '🩺',
    detailedInfo: {
      overview: 'Highly respected profession in India. Doctors are essential to healthcare with opportunities in government hospitals, private practice, and research.',
      personalityTraits: ['Empathetic', 'Patient', 'Detail-Oriented', 'Calm under pressure'],
      roadmap: [
        { phase: 'Class 10-12', duration: '2 years', description: 'Focus on PCB (Physics, Chemistry, Biology)', keyPoints: ['Score 90%+ in 12th', 'Start NEET preparation early', 'Join coaching if needed'] },
        { phase: 'MBBS', duration: '5.5 years', description: 'Bachelor of Medicine, Bachelor of Surgery', keyPoints: ['5 years course + 1 year internship', 'Clinical rotations', 'Pass final exams'] },
        { phase: 'Specialization', duration: '3 years', description: 'MD/MS in chosen specialty', keyPoints: ['Clear NEET-PG', 'Choose specialty', 'Residency training'] }
      ],
      exams: [
        { name: 'NEET UG', conducting: 'NTA', eligibility: '12th PCB with 50%', frequency: 'Annual', difficulty: 'High' },
        { name: 'NEET PG', conducting: 'NTA', eligibility: 'MBBS degree', frequency: 'Annual', difficulty: 'High' },
        { name: 'AIIMS', conducting: 'AIIMS', eligibility: '12th PCB', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'AIIMS Delhi', location: 'New Delhi', ranking: 'NIRF Rank 1', type: 'AIIMS' },
        { name: 'PGIMER Chandigarh', location: 'Chandigarh', ranking: 'NIRF Rank 2', type: 'College' },
        { name: 'CMC Vellore', location: 'Vellore', ranking: 'NIRF Rank 3', type: 'College' },
        { name: 'KMC Manipal', location: 'Manipal', ranking: 'Top 20', type: 'College' }
      ],
      companies: [
        { name: 'Apollo Hospitals', sector: 'Healthcare', hiring: 'Pan India' },
        { name: 'Fortis Healthcare', sector: 'Healthcare', hiring: 'Major Cities' },
        { name: 'Max Healthcare', sector: 'Healthcare', hiring: 'North India' },
        { name: 'Government Hospitals', sector: 'Public Health', hiring: 'Pan India' }
      ],
      faqs: [
        { question: 'Is NEET very difficult?', answer: 'NEET is competitive with lakhs of aspirants. Start preparation from 11th standard and focus on NCERT thoroughly.' },
        { question: 'Can I practice after MBBS?', answer: 'Yes, after MBBS and internship, you can start practice. However, specialization (MD/MS) increases opportunities.' }
      ]
    }
  },
  {
    id: 'civil-servant',
    name: 'Civil Servant (IAS/IPS)',
    slug: 'civil-servant',
    stream: 'Arts',
    shortDescription: 'Serve the nation through administrative roles in government.',
    avgSalaryIndiaLPA: '8 - 20 LPA',
    growthRate: 'Medium',
    prerequisites: 'Graduation in any stream, UPSC CSE cleared',
    topCities: ['Delhi', 'State Capitals', 'District HQs'],
    icon: '🏛️',
    detailedInfo: {
      overview: 'The most prestigious career in India. IAS/IPS officers are decision-makers, implementing policies and serving society. Extremely competitive but highly rewarding.',
      personalityTraits: ['Leader', 'Ethical', 'Strong Communication', 'Problem Solver'],
      roadmap: [
        { phase: 'Graduation', duration: '3-4 years', description: 'Complete any degree', keyPoints: ['Graduate in any stream', 'Maintain good CGPA', 'Start reading newspapers daily'] },
        { phase: 'UPSC Preparation', duration: '1-2 years', description: 'Dedicated preparation for Civil Services', keyPoints: ['Choose optional subject wisely', 'Join coaching or self-study', 'Current affairs focus', 'Answer writing practice'] },
        { phase: 'Training', duration: '2 years', description: 'Lal Bahadur Shastri Academy', keyPoints: ['Undergo foundation training', 'Learn administration', 'Field posting'] }
      ],
      exams: [
        { name: 'UPSC CSE', conducting: 'UPSC', eligibility: 'Graduation, Age 21-32', frequency: 'Annual', difficulty: 'High' },
        { name: 'State PCS', conducting: 'State PSC', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'Lal Bahadur Shastri Academy', location: 'Mussoorie', ranking: 'Premier Training', type: 'University' },
        { name: 'State Training Institutes', location: 'Various States', ranking: 'State Level', type: 'University' }
      ],
      companies: [
        { name: 'Central Government', sector: 'Public Administration', hiring: 'Pan India' },
        { name: 'State Governments', sector: 'Public Administration', hiring: 'State Level' }
      ],
      faqs: [
        { question: 'How many attempts for UPSC?', answer: 'General category: 6 attempts till age 32. OBC: 9 attempts till age 35. SC/ST: Unlimited till age 37.' },
        { question: 'Which optional subject is best?', answer: 'Choose based on interest and graduation background. Popular options: History, Geography, Public Administration, Sociology.' }
      ]
    }
  },
  {
    id: 'digital-marketer',
    name: 'Digital Marketing Manager',
    slug: 'digital-marketer',
    stream: 'Commerce',
    shortDescription: 'Create online campaigns, manage social media, drive business growth.',
    avgSalaryIndiaLPA: '4 - 15 LPA',
    growthRate: 'High',
    prerequisites: 'Any graduation, Digital Marketing certifications',
    topCities: ['Bangalore', 'Mumbai', 'Delhi', 'Pune'],
    icon: '📱',
    detailedInfo: {
      overview: 'Fast-growing field in India with opportunities in startups, agencies, and corporates. Digital marketers drive brand awareness and sales through online channels.',
      personalityTraits: ['Creative', 'Analytical', 'Trendy', 'Communication'],
      roadmap: [
        { phase: 'Graduation', duration: '3 years', description: 'Any degree (BBA, B.Com, BA preferred)', keyPoints: ['Build social media presence', 'Learn content creation', 'Start a blog/YouTube channel'] },
        { phase: 'Certifications', duration: '6-12 months', description: 'Digital Marketing courses', keyPoints: ['Google Ads certification', 'Facebook Blueprint', 'SEO/SEM courses', 'Analytics training'] },
        { phase: 'Experience', duration: '2-3 years', description: 'Work in agency or in-house', keyPoints: ['Start as Executive/Associate', 'Handle campaigns', 'Build portfolio', 'Grow to Manager role'] }
      ],
      exams: [
        { name: 'Google Ads Certification', conducting: 'Google', eligibility: 'None', frequency: 'Anytime', difficulty: 'Low' },
        { name: 'HubSpot Content Marketing', conducting: 'HubSpot', eligibility: 'None', frequency: 'Anytime', difficulty: 'Low' }
      ],
      institutions: [
        { name: 'MICA Ahmedabad', location: 'Ahmedabad', ranking: 'Top Marketing School', type: 'College' },
        { name: 'IIM Marketing Programs', location: 'Various', ranking: 'Premier', type: 'IIM' },
        { name: 'Online Platforms', location: 'Online', ranking: 'Self-paced', type: 'University' }
      ],
      companies: [
        { name: 'Flipkart', sector: 'E-commerce', hiring: 'Bangalore' },
        { name: 'Amazon India', sector: 'E-commerce', hiring: 'Bangalore, Mumbai' },
        { name: 'Unilever', sector: 'FMCG', hiring: 'Mumbai, Bangalore' },
        { name: 'WPP/Ogilvy', sector: 'Advertising', hiring: 'Major Cities' },
        { name: 'Startups', sector: 'Various', hiring: 'Tech Hubs' }
      ],
      faqs: [
        { question: 'Do I need an MBA?', answer: 'Not mandatory. Certifications and hands-on experience are more valued. MBA helps for senior roles.' },
        { question: 'Can I work freelance?', answer: 'Yes! Digital marketing offers excellent freelance opportunities. Build portfolio and client base.' }
      ]
    }
  },
  {
    id: 'lawyer',
    name: 'Lawyer / Advocate',
    slug: 'lawyer',
    stream: 'Arts',
    shortDescription: 'Represent clients in court, provide legal advice and consultation.',
    avgSalaryIndiaLPA: '3 - 25 LPA',
    growthRate: 'Medium',
    prerequisites: 'LLB/BA LLB degree, Bar Council enrollment',
    topCities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'],
    icon: '⚖️'
  },
  {
    id: 'graphic-designer',
    name: 'Graphic Designer / UI/UX',
    slug: 'graphic-designer',
    stream: 'Arts',
    shortDescription: 'Design visual content for brands, apps, websites, and marketing.',
    avgSalaryIndiaLPA: '3 - 12 LPA',
    growthRate: 'High',
    prerequisites: 'Design degree/diploma or self-taught with portfolio',
    topCities: ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad'],
    icon: '🎨'
  },
  {
    id: 'mechanical-engineer',
    name: 'Mechanical Engineer',
    slug: 'mechanical-engineer',
    stream: 'Science',
    shortDescription: 'Design, develop machines, automotive, and manufacturing systems.',
    avgSalaryIndiaLPA: '4 - 12 LPA',
    growthRate: 'Medium',
    prerequisites: 'B.Tech in Mechanical Engineering',
    topCities: ['Pune', 'Chennai', 'Bangalore', 'Ahmedabad'],
    icon: '⚙️'
  }
];

const quizQuestions: QuizQuestion[] = [
  { id: 1, question: 'I enjoy solving mathematical problems and puzzles', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'analytical' },
  { id: 2, question: 'I like helping people and making a difference in their lives', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'social' },
  { id: 3, question: 'I am comfortable with public speaking and presentations', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'communication' },
  { id: 4, question: 'I prefer working with computers and technology', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'technical' },
  { id: 5, question: 'I enjoy creating visual designs and artistic content', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'creative' },
  { id: 6, question: 'I am good at managing finances and understanding business', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'business' },
  { id: 7, question: 'I like understanding how things work mechanically', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'technical' },
  { id: 8, question: 'I am detail-oriented and like following procedures', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'analytical' },
  { id: 9, question: 'I want to serve society and work for public welfare', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'social' },
  { id: 10, question: 'I enjoy learning about biology and life sciences', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'science' }
];

// Main App Component
const CareerPortal = () => {
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'career-detail' | 'quiz' | 'quiz-result'>('home');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
  const navigate = useNavigate();

  const filteredCareers = useMemo(() => {
    return careers.filter(career => {
      const matchesSearch = career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          career.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStream = filterStream === 'All' || career.stream === filterStream;
      return matchesSearch && matchesStream;
    });
  }, [searchTerm, filterStream]);

  const handleCareerClick = (career: Career) => {
    setSelectedCareer(career);
    setActiveView('career-detail');
  };

  const startQuiz = () => {
    setActiveView('quiz');
    setCurrentQuestion(0);
    setQuizAnswers([]);
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate recommendations based on answers
      const scores = { analytical: 0, social: 0, technical: 0, creative: 0, business: 0, science: 0 };
      
      quizQuestions.forEach((q, idx) => {
        const answer = newAnswers[idx];
        if (answer === 'Strongly Agree') {}
        else if (answer === 'Agree'){}
      });

      // Recommend careers based on top categories
      const topCategories = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2);
      
      let recommended: Career[] = [];
      if (scores.analytical > 5 || scores.technical > 5) {
        recommended.push(careers.find(c => c.id === 'ds-ml')!);
        recommended.push(careers.find(c => c.id === 'mechanical-engineer')!);
      }
      if (scores.business > 5) {
        recommended.push(careers.find(c => c.id === 'ca')!);
        recommended.push(careers.find(c => c.id === 'digital-marketer')!);
      }
      if (scores.social > 5) {
        recommended.push(careers.find(c => c.id === 'doctor')!);
        recommended.push(careers.find(c => c.id === 'civil-servant')!);
      }
      if (scores.creative > 5) {
        recommended.push(careers.find(c => c.id === 'graphic-designer')!);
        recommended.push(careers.find(c => c.id === 'digital-marketer')!);
      }

      // Remove duplicates and limit to 3
      recommended = [...new Set(recommended)].slice(0, 3);
      if (recommended.length === 0) recommended = careers.slice(0, 3);

      setRecommendedCareers(recommended);
      setActiveView('quiz-result');
    }
  };
  
  // Header Component
  const Header = () => (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('home')}>
            <GraduationCap className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">CareerMarg</h1>
              <p className="text-xs text-indigo-100">Your Path to Success in India</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => setActiveView('home')} className="hover:text-indigo-200 transition">Home</button>
            <button onClick={() => setActiveView('explore')} className="hover:text-indigo-200 transition">Explore Careers</button>
            <button onClick={startQuiz} className="hover:text-indigo-200 transition">Career Quiz</button>
            <button onClick={() => navigate("/teams")} className="hover:text-indigo-200 transition">About Us</button>
            <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition">Login</button>
          </nav>
        </div>
      </div>
    </header>
  );

  // Homepage View
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover Your Future in India 🇮🇳
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            Comprehensive career guidance from Class 10 to Dream Job
          </p>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl p-2">
            <div className="flex items-center">
              <Search className="w-6 h-6 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search careers, exams, colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-800 outline-none rounded"
              />
              <button
                onClick={() => setActiveView('explore')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <TrendingUp className="w-8 h-8" />, title: '500+ Careers', desc: 'Detailed roadmaps', color: 'bg-blue-500' },
            { icon: <Award className="w-8 h-8" />, title: '100+ Exams', desc: 'JEE, NEET, CAT & more', color: 'bg-green-500' },
            { icon: <Building2 className="w-8 h-8" />, title: 'Top Colleges', desc: 'IITs, NITs, IIMs listed', color: 'bg-purple-500' },
            { icon: <Users className="w-8 h-8" />, title: 'Expert Mentors', desc: 'Connect with pros', color: 'bg-pink-500' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer">
              <div className={`${feature.color} text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Careers */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">🔥 Trending Careers in India</h2>
            <p className="text-xl text-gray-600">High-growth opportunities for the next decade</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careers.slice(0, 8).map((career) => (
              <div
                key={career.id}
                onClick={() => handleCareerClick(career)}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-center">
                  <div className="text-5xl mb-2">{career.icon}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    career.growthRate === 'High' ? 'bg-green-400' : career.growthRate === 'Medium' ? 'bg-yellow-400' : 'bg-gray-400'
                  } text-white`}>
                    {career.growthRate} Growth
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
                    {career.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{career.shortDescription}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-semibold">₹ {career.avgSalaryIndiaLPA}</span>
                    <span className="text-indigo-600 flex items-center">
                      View <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => setActiveView('explore')}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition shadow-lg"
            >
              Explore All 500+ Careers →
            </button>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Not Sure Which Career Suits You?</h2>
          <p className="text-xl mb-8">Take our AI-powered career assessment quiz in just 5 minutes</p>
          <button
            onClick={startQuiz}
            className="bg-white text-purple-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Start Career Quiz 🎯
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', role: 'Data Scientist at Google', quote: 'CareerMarg helped me navigate from 12th to my dream job!', rating: 5 },
              { name: 'Rahul Verma', role: 'CA, Mumbai', quote: 'The roadmap feature was a game-changer for my CA journey.', rating: 5 },
              { name: 'Ananya Singh', role: 'MBBS Student, AIIMS', quote: 'Found the best NEET preparation strategy here.', rating: 5 }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 shadow-md">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  // Explore Careers View
  const ExploreCareers = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Explore Careers</h1>
          <p className="text-gray-600">Find your perfect career path among 500+ options</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search careers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 bg-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stream</label>
                  <select
                    value={filterStream}
                    onChange={(e) => setFilterStream(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>All</option>
                    <option>Science</option>
                    <option>Commerce</option>
                    <option>Arts</option>
                    <option>Vocational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Growth Rate</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>All</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>All</option>
                    <option>₹3-8 LPA</option>
                    <option>₹8-15 LPA</option>
                    <option>₹15+ LPA</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterStream('All');
                      setSearchTerm('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          Showing <span className="font-semibold text-gray-800">{filteredCareers.length}</span> careers
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              onClick={() => handleCareerClick(career)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{career.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    career.growthRate === 'High' ? 'bg-green-400' : career.growthRate === 'Medium' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}>
                    {career.growthRate}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{career.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{career.shortDescription}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{career.stream}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 font-semibold">₹ {career.avgSalaryIndiaLPA}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    {career.topCities.join(', ')}
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold">
                  View Full Roadmap
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Career Detail View
  const CareerDetailView = () => {
    if (!selectedCareer || !selectedCareer.detailedInfo) return null;
    const detail = selectedCareer.detailedInfo;
    const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'exams' | 'colleges' | 'companies' | 'faq'>('overview');

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <button
              onClick={() => setActiveView('explore')}
              className="flex items-center text-indigo-100 hover:text-white mb-6 transition"
            >
              ← Back to Explore
            </button>
            <div className="flex items-center gap-6">
              <div className="text-7xl">{selectedCareer.icon}</div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{selectedCareer.name}</h1>
                <p className="text-xl text-indigo-100 mb-4">{selectedCareer.shortDescription}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/20 px-4 py-2 rounded-lg">Stream: {selectedCareer.stream}</span>
                  <span className="bg-white/20 px-4 py-2 rounded-lg">Salary: ₹ {selectedCareer.avgSalaryIndiaLPA}</span>
                  <span className={`px-4 py-2 rounded-lg ${
                    selectedCareer.growthRate === 'High' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {selectedCareer.growthRate} Growth
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
                { id: 'roadmap', label: 'Roadmap', icon: <TrendingUp className="w-4 h-4" /> },
                { id: 'exams', label: 'Entrance Exams', icon: <Award className="w-4 h-4" /> },
                { id: 'colleges', label: 'Top Colleges', icon: <Building2 className="w-4 h-4" /> },
                { id: 'companies', label: 'Top Companies', icon: <Briefcase className="w-4 h-4" /> },
                { id: 'faq', label: 'FAQ', icon: <Users className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {activeTab === 'overview' && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Career Overview</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{detail.overview}</p>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8">Key Personality Traits</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {detail.personalityTraits.map((trait, idx) => (
                    <div key={idx} className="bg-indigo-50 rounded-lg p-4 text-center">
                      <p className="text-indigo-700 font-semibold">{trait}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8">Top Employment Cities</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedCareer.topCities.map((city, idx) => (
                    <span key={idx} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Complete Career Roadmap</h2>
              <div className="space-y-6">
                {detail.roadmap.map((step, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">{step.phase}</h3>
                        <span className="bg-white/20 px-4 py-2 rounded-full text-sm">{step.duration}</span>
                      </div>
                      <p className="text-indigo-100 mt-2">{step.description}</p>
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Key Focus Areas:</h4>
                      <ul className="space-y-2">
                        {step.keyPoints.map((point, pidx) => (
                          <li key={pidx} className="flex items-start">
                            <ChevronRight className="w-5 h-5 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="max-w-5xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Entrance Exams You Need to Know</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {detail.exams.map((exam, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{exam.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        exam.difficulty === 'High' ? 'bg-red-100 text-red-700' :
                        exam.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {exam.difficulty}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <span className="text-gray-500 w-32 flex-shrink-0">Conducted by:</span>
                        <span className="text-gray-800 font-medium">{exam.conducting}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-500 w-32 flex-shrink-0">Eligibility:</span>
                        <span className="text-gray-800 font-medium">{exam.eligibility}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-500 w-32 flex-shrink-0">Frequency:</span>
                        <span className="text-gray-800 font-medium">{exam.frequency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'colleges' && (
            <div className="max-w-5xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Top Institutions in India</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Institution</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ranking</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {detail.institutions.map((inst, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">{inst.name}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{inst.location}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center text-yellow-600 font-medium">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            {inst.ranking}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {inst.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="max-w-5xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Top Hiring Companies in India</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {detail.companies.map((company, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{company.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{company.sector}</p>
                    <div className="flex items-center text-sm text-indigo-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {company.hiring}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {detail.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">{faq.question}</h3>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Quiz View
  const QuizView = () => {
    const question = quizQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Career Aptitude Quiz</h1>
                <p className="text-indigo-100">Question {currentQuestion + 1} of {quizQuestions.length}</p>
                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">{question.question}</h2>
                <div className="space-y-4">
                  {question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      className="w-full text-left p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition transform hover:scale-105"
                    >
                      <span className="text-lg font-medium text-gray-800">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Quiz Result View
  const QuizResultView = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Career Matches!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Based on your responses, here are careers that align with your interests and strengths
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Careers for You:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recommendedCareers.map((career, idx) => (
              <div
                key={career.id}
                onClick={() => handleCareerClick(career)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-center">
                  <div className="text-5xl mb-2">{career.icon}</div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white">
                    Match #{idx + 1}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{career.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{career.shortDescription}</p>
                  <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={startQuiz}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => setActiveView('explore')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Explore All Careers
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">CareerMarg</h3>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted partner in career guidance for Indian students and professionals.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition">All Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Entrance Exams</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Top Colleges</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Mentor Connect</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
                f
              </a>
              <a href="#" className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
                t
              </a>
              <a href="#" className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
                in
              </a>
              <a href="#" className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
                yt
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              📧 info@careermarg.in<br/>
              📞 +91-8888-888-888
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 CareerMarg. All rights reserved. Made with ❤️ for Indian students.</p>
        </div>
      </div>
    </footer>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {activeView === 'home' && <HomePage />}
      {activeView === 'explore' && <ExploreCareers />}
      {activeView === 'career-detail' && <CareerDetailView />}
      {activeView === 'quiz' && <QuizView />}
      {activeView === 'quiz-result' && <QuizResultView />}
      
      <Footer />
    </div>
  );
};

export default CareerPortal;