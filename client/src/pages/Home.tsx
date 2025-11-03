import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, Award, Building2, BookOpen, Users, ChevronRight, MapPin, Briefcase, GraduationCap, Star, Filter, X } from 'lucide-react';
// Note: useNavigate is assumed to be available but will not navigate externally in this single-file environment.
const useNavigate = () => (path: string) => console.log(`Navigating to: ${path}`);

// --- ENHANCED TYPESCRIPT INTERFACES ---

type Stream = 'Science' | 'Commerce' | 'Arts' | 'Vocational' | 'Any';
type Sector = 
  | 'IT & Software'
  | 'Finance & Accounting'
  | 'Healthcare'
  | 'Government & Public'
  | 'Manufacturing & Core'
  | 'Education & Research'
  | 'Media & Design'
  | 'Law & Legal'
  | 'Consulting'
  | 'Defense & Public'
  | 'Any';

interface Career {
  id: string;
  name: string;
  slug: string;
  stream: Stream;
  sector: Sector; // New Field
  shortDescription: string;
  avgSalaryIndiaLPA: string; // e.g., '10 - 25 LPA'
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

// --- CONSTANTS AND HELPERS ---

const ALL_STREAMS: Stream[] = ['Science', 'Commerce', 'Arts', 'Vocational', 'Any'];
const ALL_SECTORS: Sector[] = [
  'IT & Software', 'Finance & Accounting', 'Healthcare', 'Government & Public',
  'Manufacturing & Core', 'Education & Research', 'Media & Design', 'Law & Legal', 'Consulting', 'Defense & Public'
];
const SALARY_RANGES = [
  { label: '₹3-8 LPA', min: 3, max: 8 },
  { label: '₹8-15 LPA', min: 8, max: 15 },
  { label: '₹15+ LPA', min: 15, max: 100 },
];

/**
 * Parses salary string (e.g., '10 - 25 LPA') to a number (the minimum value for filtering)
 */
const getMinSalary = (salaryStr: string): number => {
  const match = salaryStr.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};


// --- EXPANDED SAMPLE DATA (51 Careers with detailedInfo) ---

const careers: Career[] = [
  // --- Existing Careers (Intact) ---
  {
    id: 'ds-ml', name: 'Data Scientist / ML Engineer', slug: 'data-scientist', stream: 'Science', sector: 'IT & Software', shortDescription: 'Build AI models and analyze complex data. Top demand in tech hubs.',
    avgSalaryIndiaLPA: '10 - 25 LPA', growthRate: 'High', prerequisites: 'B.Tech/M.Sc. in CS, Statistics, or Mathematics', topCities: ['Bangalore', 'Pune', 'Hyderabad'], icon: '🤖',
    detailedInfo: {
      overview: 'Data Scientists are in extreme demand across India, especially in tech cities. They work on machine learning, AI, and big data analytics to drive business decisions. The role combines computer science, mathematics, and business acumen.',
      personalityTraits: ['Analytical', 'Problem Solver', 'Detail-Oriented', 'Curious'],
      roadmap: [
        { phase: 'Class 10-12', duration: '2 years', description: 'Focus on PCM (Physics, Chemistry, Mathematics) for strong analytical foundation.', keyPoints: ['Excel in Mathematics', 'Learn basic programming (Python)', 'Build strong foundation in Statistics'] },
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech in Computer Science/Data Science or B.Sc. in Statistics/Math.', keyPoints: ['Master Python/R', 'Learn ML algorithms', 'Work on real projects (Kaggle)', 'Internships at startups/MNCs'] },
        { phase: 'Specialization', duration: '1-2 years', description: 'M.Tech in AI/ML or industry certifications (e.g., Google/AWS).', keyPoints: ['Deep Learning specialization', 'Cloud certifications (AWS/Azure)', 'Portfolio building with deployed models'] }
      ],
      exams: [
        { name: 'JEE Main & Advanced', conducting: 'NTA/IIT', eligibility: '12th PCM with 75%', frequency: 'Annual', difficulty: 'High' },
        { name: 'GATE (for M.Tech)', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }
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
        { name: 'TCS Research', sector: 'IT Services', hiring: 'Pan India' }
      ],
      faqs: [
        { question: 'Do I need a Tier-1 college?', answer: 'Not mandatory. Skills, portfolio, and relevant M.Tech/Ph.D. matter more. Many successful data scientists are from Tier-2/3 colleges with strong self-study.' },
        { question: 'What coding languages should I learn?', answer: 'Python is essential. SQL for databases, R for statistics. Learn frameworks like TensorFlow and PyTorch.' }
      ]
    }
  },
  {
    id: 'ca', name: 'Chartered Accountant (CA)', slug: 'chartered-accountant', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Financial expert handling audits, taxation, and business advisory.',
    avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'High', prerequisites: '12th Commerce, CA Foundation cleared', topCities: ['Mumbai', 'Delhi', 'Chennai', 'Bangalore'], icon: '💼',
    detailedInfo: {
      overview: 'One of the most prestigious careers in India. CAs are financial advisors, auditors, and tax consultants with excellent job security and entrepreneurial opportunities. The qualification is controlled by the ICAI.',
      personalityTraits: ['Analytical', 'Detail-Oriented', 'Ethical', 'Patient', 'Numeric'],
      roadmap: [
        { phase: 'After 12th', duration: '6 months', description: 'CA Foundation Course (Entry Level)', keyPoints: ['Register with ICAI', 'Study Accounting, Economics, Law', 'Clear Foundation exam'] },
        { phase: 'Intermediate', duration: '2 years', description: 'CA Intermediate + Articleship Training (3 years mandatory)', keyPoints: ['Complete 3 years articleship with a CA firm', 'Study Advanced Accounting, Taxation', 'Practical exposure in auditing'] },
        { phase: 'Final', duration: '1.5 years', description: 'CA Final Examination', keyPoints: ['Complete Final exams', 'Specialize in Taxation/Audit', 'Start practice or join a large firm (Big 4)'] }
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
        { question: 'How difficult is CA?', answer: 'CA is exceptionally challenging with an average pass rate of 10-15% at the final level. Requires dedication, consistency, and a minimum 4.5 years of commitment.' },
        { question: 'Can I do graduation alongside CA?', answer: 'Yes, many students pursue B.Com or BBA through correspondence while completing the CA Intermediate and Articleship stages.' }
      ]
    }
  },
  {
    id: 'doctor', name: 'Medical Doctor (MBBS)', slug: 'medical-doctor', stream: 'Science', sector: 'Healthcare', shortDescription: 'Diagnose and treat patients, save lives in hospitals and clinics.',
    avgSalaryIndiaLPA: '6 - 20 LPA', growthRate: 'Medium', prerequisites: '12th PCB with 50%+ marks, NEET qualified', topCities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'], icon: '🩺',
    detailedInfo: {
      overview: 'Highly respected and essential profession in India. Doctors are the backbone of healthcare, with opportunities in government hospitals, private practice, specialized roles, and research.',
      personalityTraits: ['Empathetic', 'Patient', 'Detail-Oriented', 'Calm under pressure', 'Resilient'],
      roadmap: [
        { phase: 'Class 10-12', duration: '2 years', description: 'Focus on PCB (Physics, Chemistry, Biology) and dedicated entrance preparation.', keyPoints: ['Score 90%+ in 12th', 'Start NEET preparation early (11th Grade)', 'Thorough mastery of NCERT books'] },
        { phase: 'MBBS', duration: '5.5 years', description: 'Bachelor of Medicine, Bachelor of Surgery (4.5 years course + 1 year internship).', keyPoints: ['Clinical rotations', 'Pass professional exams', 'Compulsory rotational internship'] },
        { phase: 'Specialization', duration: '3 years', description: 'MD/MS/DNB in chosen specialty (e.g., Surgery, Pediatrics, Cardiology).', keyPoints: ['Clear NEET-PG/INI-CET', 'Residency training in a hospital', 'Sub-specialization/Fellowships'] }
      ],
      exams: [
        { name: 'NEET UG', conducting: 'NTA', eligibility: '12th PCB with 50%', frequency: 'Annual', difficulty: 'High' },
        { name: 'NEET PG/INI-CET', conducting: 'NTA/AIIMS', eligibility: 'MBBS degree', frequency: 'Annual', difficulty: 'High' },
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
        { name: 'Government Hospitals', sector: 'Public Health', hiring: 'Pan India' }
      ],
      faqs: [
        { question: 'Is NEET very difficult?', answer: 'NEET is highly competitive with lakhs of aspirants for limited seats. It requires focused, systematic preparation and conceptual clarity, especially in Biology.' },
        { question: 'Can I practice after MBBS?', answer: 'Yes, after MBBS and internship, you can register with the MCI/NMC and practice as a General Physician. Specialization (MD/MS) is usually needed for higher earnings.' }
      ]
    }
  },
  {
    id: 'civil-servant', name: 'Civil Servant (IAS/IPS)', slug: 'civil-servant', stream: 'Arts', sector: 'Government & Public', shortDescription: 'Serve the nation through administrative roles in government.',
    avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'Medium', prerequisites: 'Graduation in any stream, UPSC CSE cleared', topCities: ['Delhi', 'State Capitals', 'District HQs'], icon: '🏛️',
    detailedInfo: {
      overview: 'The most prestigious career in India. IAS (Indian Administrative Service) and IPS (Indian Police Service) officers are decision-makers, implementing policies, managing districts, and serving society. The selection process is famously difficult.',
      personalityTraits: ['Leader', 'Ethical', 'Strong Communication', 'Problem Solver', 'Integrity'],
      roadmap: [
        { phase: 'Graduation', duration: '3-4 years', description: 'Complete any degree from a recognized university.', keyPoints: ['Graduate in any stream', 'Maintain good CGPA', 'Start reading newspapers daily (The Hindu/Indian Express)'] },
        { phase: 'UPSC Preparation', duration: '1-2 years', description: 'Dedicated preparation for the Civil Services Examination (CSE) stages (Prelims, Mains, Interview).', keyPoints: ['Choose optional subject wisely', 'Deep study of Static GS (History, Polity, Economy)', 'Focus on current affairs and answer writing practice'] },
        { phase: 'Training', duration: '2 years', description: 'Training at LBSNAA (for IAS) or NPA (for IPS), followed by probationary field posting.', keyPoints: ['Undergo foundation training', 'Learn administration and policy implementation', 'Field posting in a district'] }
      ],
      exams: [
        { name: 'UPSC CSE', conducting: 'UPSC', eligibility: 'Graduation, Age 21-32', frequency: 'Annual', difficulty: 'High' },
        { name: 'State PCS (e.g., UPPSC, MPSC)', conducting: 'State PSC', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'Lal Bahadur Shastri National Academy of Administration (LBSNAA)', location: 'Mussoorie', ranking: 'Premier Training', type: 'University' },
        { name: 'National Police Academy (NPA)', location: 'Hyderabad', ranking: 'Premier Training', type: 'University' }
      ],
      companies: [
        { name: 'Central Government', sector: 'Public Administration', hiring: 'Pan India' },
        { name: 'State Governments', sector: 'Public Administration', hiring: 'State Level' }
      ],
      faqs: [
        { question: 'How many attempts for UPSC?', answer: 'General category: 6 attempts till age 32. OBC: 9 attempts till age 35. SC/ST: Unlimited till age 37 (These figures can change; always check the latest UPSC notification).' },
        { question: 'Which optional subject is best?', answer: 'Choose based on interest and graduation background, as well as availability of coaching materials. Popular choices: History, Sociology, Public Administration.' }
      ]
    }
  },
  {
    id: 'digital-marketer', name: 'Digital Marketing Manager', slug: 'digital-marketer', stream: 'Commerce', sector: 'Media & Design', shortDescription: 'Create online campaigns, manage social media, drive business growth.',
    avgSalaryIndiaLPA: '4 - 15 LPA', growthRate: 'High', prerequisites: 'Any graduation, Digital Marketing certifications', topCities: ['Bangalore', 'Mumbai', 'Delhi', 'Pune'], icon: '📱',
    detailedInfo: {
      overview: 'Fast-growing field in India with opportunities in startups, agencies, and corporates. Digital marketers drive brand awareness, lead generation, and sales through online channels like SEO, SEM, and social media.',
      personalityTraits: ['Creative', 'Analytical', 'Trendy', 'Communication', 'Adaptable'],
      roadmap: [
        { phase: 'Graduation', duration: '3 years', description: 'Any degree (BBA, B.Com, BA preferred) with focus on business fundamentals.', keyPoints: ['Build social media presence', 'Learn content creation basics', 'Start a blog/YouTube channel'] },
        { phase: 'Certifications', duration: '6-12 months', description: 'Acquire essential, job-relevant skills through certifications.', keyPoints: ['Google Ads certification', 'Facebook Blueprint', 'SEO/SEM courses (HubSpot, Udemy)', 'Advanced Analytics training'] },
        { phase: 'Experience', duration: '2-3 years', description: 'Hands-on experience in executing and analyzing marketing campaigns.', keyPoints: ['Start as Executive/Associate', 'Handle campaigns for real clients/products', 'Build a measurable performance portfolio', 'Grow to Manager role'] }
      ],
      exams: [
        { name: 'CMAT/MAT (for MBA in Marketing)', conducting: 'NTA/AIMA', eligibility: 'Graduation', frequency: 'Annual/Multiple', difficulty: 'Medium' }
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
        { name: 'WPP/Ogilvy', sector: 'Advertising', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'Do I need an MBA?', answer: 'Not mandatory. Certifications and hands-on experience are more valued. An MBA from a top institute helps significantly for senior management/strategy roles.' },
        { question: 'Can I work freelance?', answer: 'Yes! Digital marketing offers excellent freelance opportunities globally. Building a strong portfolio and niche expertise is crucial for this path.' }
      ]
    }
  },
  {
    id: 'lawyer', name: 'Lawyer / Advocate', slug: 'lawyer', stream: 'Arts', sector: 'Law & Legal', shortDescription: 'Represent clients in court, provide legal advice and consultation.',
    avgSalaryIndiaLPA: '3 - 25 LPA', growthRate: 'Medium', prerequisites: 'LLB/BA LLB degree, Bar Council enrollment', topCities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'], icon: '⚖️',
    detailedInfo: {
      overview: 'A career focused on justice, litigation, corporate law, and advocacy. Graduates from top NLUs (National Law Universities) are highly sought after by corporate law firms, often starting in the high salary bracket.',
      personalityTraits: ['Debater', 'Logical', 'Articulate', 'Patient', 'Researcher'],
      roadmap: [
        { phase: 'After 12th', duration: '5 years', description: 'Integrated BA/BBA LLB (Hons) Degree.', keyPoints: ['Clear CLAT/AILET', 'Focus on legal writing and research', 'Internships with law firms/judges'] },
        { phase: 'Post-Graduation', duration: '1 year', description: 'LL.M. or specialization (optional but recommended).', keyPoints: ['Specialization in Corporate Law/Cyber Law', 'Clear LL.M. Entrance exams or aim for foreign universities'] },
        { phase: 'Practice', duration: 'Ongoing', description: 'Litigation in courts or Corporate Law in firms.', keyPoints: ['Clear All India Bar Exam (AIBE)', 'Enroll with State Bar Council', 'Join a firm or start practice under a senior advocate'] }
      ],
      exams: [
        { name: 'CLAT (UG & PG)', conducting: 'Consortium of NLUs', eligibility: '12th pass (UG) / LLB (PG)', frequency: 'Annual', difficulty: 'High' },
        { name: 'AILET', conducting: 'NLU Delhi', eligibility: '12th pass (UG) / LLB (PG)', frequency: 'Annual', difficulty: 'High' },
        { name: 'AIBE', conducting: 'Bar Council of India', eligibility: 'LLB completed', frequency: 'Twice a year', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'NLSIU Bangalore', location: 'Bangalore', ranking: 'NIRF Law Rank 1', type: 'University' },
        { name: 'NLU Delhi', location: 'New Delhi', ranking: 'NIRF Law Rank 2', type: 'University' }
      ],
      companies: [
        { name: 'Cyril Amarchand Mangaldas', sector: 'Corporate Law', hiring: 'Mumbai, Delhi' },
        { name: 'Trilegal', sector: 'Corporate Law', hiring: 'Bangalore, Delhi' },
        { name: 'AZB & Partners', sector: 'Corporate Law', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'What is the highest paying area of law?', answer: 'Corporate Law and Mergers & Acquisitions (M&A) in large international firms offer the highest starting salaries, often starting well above 20 LPA.' },
        { question: 'Is litigation a viable career?', answer: 'Yes, but it is a long-term investment. Initial earnings can be low, but experienced litigators at High Courts or the Supreme Court earn very well.' }
      ]
    }
  },
  {
    id: 'graphic-designer', name: 'Graphic Designer / UI/UX Designer', slug: 'graphic-designer', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Design visual content for brands, apps, websites, and marketing.',
    avgSalaryIndiaLPA: '5 - 18 LPA', growthRate: 'High', prerequisites: 'Design degree/diploma or self-taught with portfolio', topCities: ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad'], icon: '🎨',
    detailedInfo: {
      overview: 'UI/UX (User Interface/User Experience) is a booming field, focused on creating user-friendly and aesthetically pleasing digital products. A strong, iterative portfolio showcasing problem-solving ability is more important than a traditional degree.',
      personalityTraits: ['Creative', 'Empathetic', 'Visually inclined', 'Attention to detail', 'User-focused'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Des/BFA/B.Tech in CS with specialization in Design.', keyPoints: ['Clear NID/CEED/UCEED exams', 'Master design tools (Figma, Sketch, Adobe XD)', 'Build portfolio projects (case studies)'] },
        { phase: 'Specialization', duration: '1 year', description: 'UI/UX certifications and continuous learning.', keyPoints: ['Google UX Design Certificate', 'Advanced prototyping techniques', 'Focus on user testing and research methods'] },
        { phase: 'Entry Level', duration: '2 years', description: 'Start as Junior Designer or UX Associate.', keyPoints: ['Gain industry experience in a startup/agency', 'Work on diverse platforms (web, mobile)', 'Learn agile development processes'] }
      ],
      exams: [
        { name: 'NID DAT (Design Aptitude Test)', conducting: 'NID', eligibility: '12th pass', frequency: 'Annual', difficulty: 'High' },
        { name: 'UCEED/CEED', conducting: 'IITs', eligibility: '12th pass/Graduation', frequency: 'Annual', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'NID Ahmedabad', location: 'Ahmedabad', ranking: 'Top Design School', type: 'College' },
        { name: 'IDC IIT Bombay', location: 'Mumbai', ranking: 'Top Design School', type: 'IIT' }
      ],
      companies: [
        { name: 'Apple India', sector: 'Technology', hiring: 'Hyderabad, Bangalore' },
        { name: 'Adobe', sector: 'Technology', hiring: 'Bangalore, Noida' },
        { name: 'Razorpay', sector: 'FinTech', hiring: 'Bangalore' },
        { name: 'Flipkart/Amazon', sector: 'E-commerce', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'Is a design degree necessary?', answer: 'No, but highly recommended for foundation. An outstanding portfolio and domain expertise can land you a top job without a formal degree, especially in the UI/UX field.' },
        { question: 'What is the most important skill for a UX designer?', answer: 'Empathy and problem-solving. Being able to understand user needs and translating them into a simple, efficient interface is key.' }
      ]
    }
  },
  {
    id: 'mechanical-engineer', name: 'Mechanical Engineer', slug: 'mechanical-engineer', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Design, develop machines, automotive, and manufacturing systems.',
    avgSalaryIndiaLPA: '4 - 12 LPA', growthRate: 'Medium', prerequisites: 'B.Tech in Mechanical Engineering', topCities: ['Pune', 'Chennai', 'Bangalore', 'Ahmedabad'], icon: '⚙️',
    detailedInfo: {
      overview: 'Mechanical engineering is the bedrock of many industries, from automotive and aerospace to thermal, robotics, and now, Electric Vehicles (EVs). Core jobs often require relocating to industrial/manufacturing hubs.',
      personalityTraits: ['Practical', 'Analytical', 'Problem Solver', 'Hands-on', 'Systematic'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech/B.E. in Mechanical Engineering.', keyPoints: ['Clear JEE/MHT-CET/VITEEE', 'Master CAD software (SolidWorks, AutoCAD)', 'Internships at core companies (Tata Motors, Maruti)'] },
        { phase: 'Post-Graduation', duration: '2 years', description: 'M.Tech via GATE for specialization or PSU entry.', keyPoints: ['Clear GATE for higher studies or PSU job', 'Specialise in Robotics, Automotive, or Thermal engineering', 'Research publications'] },
        { phase: 'Career Growth', duration: 'Ongoing', description: 'Professional Engineer/Manager roles.', keyPoints: ['Focus on Project Management', 'Gain expertise in Industry 4.0 technologies (3D printing, IoT)', 'Professional certifications'] }
      ],
      exams: [
        { name: 'JEE Main', conducting: 'NTA', eligibility: '12th PCM', frequency: 'Annual', difficulty: 'High' },
        { name: 'GATE', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' },
        { name: 'UPSC ESE (IES)', conducting: 'UPSC', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'IIT Madras', location: 'Chennai', ranking: 'NIRF Engg Rank 1', type: 'IIT' },
        { name: 'NIT Trichy', location: 'Trichy', ranking: 'NIRF Engg Rank 9', type: 'NIT' }
      ],
      companies: [
        { name: 'Tata Motors', sector: 'Automotive', hiring: 'Pune, Jamshedpur' },
        { name: 'Mahindra & Mahindra', sector: 'Automotive', hiring: 'Pune, Chennai' },
        { name: 'DRDO', sector: 'Government & Public', hiring: 'Pan India' },
        { name: 'L&T (Larsen & Toubro)', sector: 'Manufacturing & Core', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'Is Mechanical Engineering still relevant?', answer: 'Yes, but the focus has shifted heavily to Robotics, AI integration, and EV manufacturing/design. Upskilling in these modern areas is crucial for career growth.' },
        { question: 'What is the scope after M.Tech in Mechanical?', answer: 'Excellent. It opens doors to teaching, advanced research, high-paying PSU jobs (via GATE), and specialized R&D roles in private companies.' }
      ]
    }
  },
  
  // --- New Careers with Full Detailed Info ---

  {
    id: 'sw-dev', name: 'Software Developer (Full Stack)', slug: 'software-developer', stream: 'Science', sector: 'IT & Software', shortDescription: 'Develop web/mobile applications and manage databases.', avgSalaryIndiaLPA: '8 - 22 LPA', growthRate: 'High', prerequisites: 'B.Tech in CS or relevant specialization', topCities: ['Bangalore', 'Pune', 'Hyderabad', 'Noida'], icon: '💻',
    detailedInfo: {
      overview: 'Software Development is the core of the IT sector. Full Stack developers handle both front-end (user interface) and back-end (server logic, database) development, making them highly versatile and valuable in tech companies.',
      personalityTraits: ['Logical', 'Problem Solver', 'Learner', 'Collaborative', 'Detail-Oriented'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech/B.E. in Computer Science/IT.', keyPoints: ['Master DSA (Data Structures & Algorithms)', 'Learn C++/Java/Python basics', 'Build 2-3 significant projects', 'Clear JEE/BITSAT/State CETs'] },
        { phase: 'Skill Acquisition', duration: '1 year', description: 'Mastering a specific tech stack (MERN/MEAN/Java Spring).', keyPoints: ['Deep dive into one backend/frontend framework', 'Cloud basics (AWS/Azure)', 'Start open-source contributions'] },
        { phase: 'Entry Level', duration: '2 years', description: 'SDE I/Associate Developer role.', keyPoints: ['Focus on code quality and scalability', 'Participate in hackathons', 'Learn CI/CD pipelines'] }
      ],
      exams: [
        { name: 'JEE Main/Advanced', conducting: 'NTA/IIT', eligibility: '12th PCM', frequency: 'Annual', difficulty: 'High' },
        { name: 'GATE', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'IIT Madras', location: 'Chennai', ranking: 'NIRF Rank 1', type: 'IIT' },
        { name: 'NIT Surathkal', location: 'Mangalore', ranking: 'Top 10 NIT', type: 'NIT' },
        { name: 'IIIT Hyderabad', location: 'Hyderabad', ranking: 'Top Tech School', type: 'College' }
      ],
      companies: [
        { name: 'Microsoft', sector: 'Technology', hiring: 'Hyderabad, Bangalore' },
        { name: 'Amazon', sector: 'E-commerce/Tech', hiring: 'Major Cities' },
        { name: 'Google', sector: 'Technology', hiring: 'Bangalore' },
        { name: 'TCS/Infosys', sector: 'IT Services', hiring: 'Pan India' }
      ],
      faqs: [
        { question: 'Is competitive coding required?', answer: 'Yes, most top product companies use competitive programming problems (DSA) as the primary criteria for entry-level hiring.' },
        { question: 'Which programming language is best?', answer: 'Python and Java are industry staples. JavaScript (Node.js) is essential for full-stack web development.' }
      ]
    }
  },

  {
    id: 'cyber-sec', name: 'Cybersecurity Analyst', slug: 'cybersecurity', stream: 'Science', sector: 'IT & Software', shortDescription: 'Protect digital assets, systems, and networks from threats.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'High', prerequisites: 'B.Tech in IT/CS, certifications (CEH, CISSP)', topCities: ['Bangalore', 'Mumbai', 'Chennai'], icon: '🔒',
    detailedInfo: {
      overview: 'A Cybersecurity Analyst protects an organization\'s computer systems and networks by monitoring threats, managing firewalls, and conducting ethical hacking/penetration testing. Demand is soaring due to digitization.',
      personalityTraits: ['Vigilant', 'Ethical', 'Inquisitive', 'Problem Solver', 'Systems Thinker'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech in Computer Science/IT or specialized Cyber Security programs.', keyPoints: ['Master networking fundamentals', 'Learn OS security (Linux)', 'Focus on cryptography and ethical hacking basics'] },
        { phase: 'Certifications', duration: '1 year', description: 'Acquire industry standard certifications.', keyPoints: ['CompTIA Security+ (Foundation)', 'CEH (Certified Ethical Hacker)', 'OSCP (Offensive Security Certified Professional - Advanced)'] },
        { phase: 'Specialization', duration: '3 years', description: 'Join a SOC (Security Operations Center) or consulting firm.', keyPoints: ['Incident response training', 'Cloud Security principles (AWS/Azure/GCP)', 'Compliance knowledge (GDPR, ISO 27001)'] }
      ],
      exams: [
        { name: 'GATE (for M.Tech in Cyber Security)', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' },
        { name: 'CEH', conducting: 'EC-Council', eligibility: 'Experience or training', frequency: 'Ongoing', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'IIT Kharagpur', location: 'Kharagpur', ranking: 'Top M.Tech Cyber Sec', type: 'IIT' },
        { name: 'CDAC (C-DAC)', location: 'Pune', ranking: 'Specialized Courses', type: 'College' }
      ],
      companies: [
        { name: 'TCS/Wipro/Infosys', sector: 'IT Services', hiring: 'Security Consulting' },
        { name: 'Banks (HDFC, ICICI)', sector: 'Finance & Accounting', hiring: 'Internal Security' },
        { name: 'PwC/Deloitte', sector: 'Consulting', hiring: 'Security Audit' }
      ],
      faqs: [
        { question: 'Is a non-CS graduate eligible?', answer: 'Yes, if you have strong networking, Linux, and programming skills, and acquire necessary certifications like CEH or CISSP. Background in Electronics/IT is preferred.' },
        { question: 'What is the difference between a white-hat and black-hat hacker?', answer: 'White-hat hackers (Ethical Hackers) work legally to find vulnerabilities in systems. Black-hat hackers exploit vulnerabilities for malicious gain.' }
      ]
    }
  },

  {
    id: 'cloud-arch', name: 'Cloud Architect', slug: 'cloud-architect', stream: 'Science', sector: 'IT & Software', shortDescription: 'Design and manage cloud infrastructure on AWS, Azure, or GCP.', avgSalaryIndiaLPA: '15 - 30 LPA', growthRate: 'High', prerequisites: 'B.Tech, 5+ years experience, Cloud Certifications', topCities: ['Bangalore', 'Pune', 'Hyderabad'], icon: '☁️',
    detailedInfo: {
      overview: 'Cloud Architects are senior IT professionals who design and manage an organization\'s cloud computing strategy. They ensure infrastructure is scalable, secure, and cost-efficient on platforms like AWS, Microsoft Azure, and Google Cloud.',
      personalityTraits: ['Strategic', 'Planner', 'Technical Expert', 'Visionary', 'Cost-Conscious'],
      roadmap: [
        { phase: 'Foundation', duration: '4 years', description: 'B.Tech in CS/IT, strong networking and OS background.', keyPoints: ['Master Linux/Windows Server', 'Networking protocols (TCP/IP)', 'Basic programming/scripting'] },
        { phase: 'Experience', duration: '5 years', description: 'Work as a Software or Data Engineer.', keyPoints: ['Gain deep knowledge in one cloud platform (AWS/Azure)', 'Start with Associate level certifications (Solutions Architect Associate)'] },
        { phase: 'Architect Role', duration: 'Ongoing', description: 'Achieve Professional level certification and lead cloud migration projects.', keyPoints: ['Professional Certifications (AWS Certified Solutions Architect – Professional)', 'Focus on DevOps, security, and cloud governance'] }
      ],
      exams: [
        { name: 'AWS Certified Solutions Architect – Professional', conducting: 'Amazon Web Services', eligibility: '5+ years experience recommended', frequency: 'Ongoing', difficulty: 'High' },
        { name: 'Microsoft Certified: Azure Solutions Architect Expert', conducting: 'Microsoft', eligibility: '5+ years experience recommended', frequency: 'Ongoing', difficulty: 'High' }
      ],
      institutions: [
        { name: 'Major Online Platforms', location: 'Online', ranking: 'Specialized Training', type: 'University' },
        { name: 'IITs (Executive Programs)', location: 'Various', ranking: 'Executive Education', type: 'IIT' }
      ],
      companies: [
        { name: 'TCS/Wipro/Infosys', sector: 'IT Services', hiring: 'Cloud & Infrastructure' },
        { name: 'Accenture', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'Amazon Web Services (AWS)', sector: 'Technology', hiring: 'Bangalore, Hyderabad' }
      ],
      faqs: [
        { question: 'Is this an entry-level job?', answer: 'No. Cloud Architect is a senior role. You must typically start as a developer, sysadmin, or engineer and transition after 5-8 years of experience with relevant certifications.' },
        { question: 'Which cloud platform is best to start with?', answer: 'AWS holds the largest market share in India, making it the most popular choice to begin your certification journey.' }
      ]
    }
  },

  {
    id: 'ibanker', name: 'Investment Banker', slug: 'investment-banker', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Manage large transactions (M&A, IPOs) for corporate clients.', avgSalaryIndiaLPA: '12 - 40 LPA', growthRate: 'High', prerequisites: 'MBA Finance/CFA, top B-School preferred', topCities: ['Mumbai', 'Gurgaon', 'Bangalore'], icon: '💰',
    detailedInfo: {
      overview: 'Investment Bankers act as intermediaries between investors and companies. They advise on mergers and acquisitions (M&A), raise capital through Initial Public Offerings (IPOs), and manage complex financial restructuring. It is an extremely high-stress, high-reward career.',
      personalityTraits: ['Analytical', 'Driven', 'Hardworking', 'Financial Expert', 'Detail-Oriented'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.Com (Hons), BBA Finance, or B.Tech from a top college.', keyPoints: ['Strong quantitative skills', 'Start preparing for CAT/GMAT/XAT', 'Basic knowledge of financial modeling'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'MBA Finance from a Tier 1 B-School (IIMs, ISB).', keyPoints: ['Clear CAT/XAT/GMAT with 98+ percentile', 'Summer internship at a leading investment bank', 'Networking is critical'] },
        { phase: 'Entry Level', duration: '3-4 years', description: 'Analyst to Associate role.', keyPoints: ['Intensive working hours (80-100 hours/week)', 'Master financial modeling and valuation', 'Obtain CFA/FRM certification (optional but beneficial)'] }
      ],
      exams: [
        { name: 'CAT/XAT/GMAT', conducting: 'IIMs/XLRI/GMAC', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' },
        { name: 'CFA (Chartered Financial Analyst)', conducting: 'CFA Institute', eligibility: 'Graduation', frequency: 'Ongoing', difficulty: 'High' }
      ],
      institutions: [
        { name: 'IIM Ahmedabad', location: 'Ahmedabad', ranking: 'NIRF Rank 1', type: 'IIM' },
        { name: 'IIM Bangalore', location: 'Bangalore', ranking: 'NIRF Rank 2', type: 'IIM' },
        { name: 'ISB', location: 'Hyderabad/Mohali', ranking: 'Top B-School', type: 'University' }
      ],
      companies: [
        { name: 'Goldman Sachs', sector: 'Finance & Accounting', hiring: 'Mumbai, Bangalore' },
        { name: 'Morgan Stanley', sector: 'Finance & Accounting', hiring: 'Mumbai' },
        { name: 'Kotak Investment Banking', sector: 'Finance & Accounting', hiring: 'Mumbai, Delhi' }
      ],
      faqs: [
        { question: 'Is B.Tech better than B.Com for IB?', answer: 'Top IBs value quantitative skills. If you are from a top IIT, a B.Tech can be a good entry point, but a top MBA is almost mandatory for the highest-paying roles.' },
        { question: 'How important is the CFA certification?', answer: 'While not mandatory, Levels I and II are highly respected and demonstrate deep subject matter expertise, significantly improving your profile.' }
      ]
    }
  },

  {
    id: 'fanalyst', name: 'Financial Analyst', slug: 'financial-analyst', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Evaluate business performance, budgets, and investments.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'Medium', prerequisites: 'B.Com/BBA, MBA/CFA/FRM preferred', topCities: ['Mumbai', 'Delhi', 'Chennai'], icon: '📈',
    detailedInfo: {
      overview: 'Financial Analysts analyze market trends, financial statements, and economic data to help companies or clients make smart investment and business decisions. They work in corporate finance, investment management, and banking.',
      personalityTraits: ['Analytical', 'Diligent', 'Predictive', 'Ethical', 'Communication'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.Com, BBA, or B.A. Economics.', keyPoints: ['Excel proficiency is key', 'Basics of accounting and corporate finance', 'Prepare for MBA entrance exams'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'MBA Finance or Master\'s in Finance.', keyPoints: ['Deep dive into valuation and reporting', 'Internship in a finance department', 'Consider CFA Level I'] },
        { phase: 'Certifications', duration: 'Ongoing', description: 'Acquire professional certifications to specialize.', keyPoints: ['CFA or FRM (Financial Risk Management)', 'Data analysis tools (Python, Tableau)', 'Work towards becoming a Senior Analyst'] }
      ],
      exams: [
        { name: 'CAT/XAT/CMAT', conducting: 'IIMs/XLRI/NTA', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' },
        { name: 'CFA Level I', conducting: 'CFA Institute', eligibility: 'Graduation', frequency: 'Ongoing', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'FMS Delhi', location: 'New Delhi', ranking: 'Top B-School', type: 'University' },
        { name: 'JBIMS Mumbai', location: 'Mumbai', ranking: 'Top B-School', type: 'College' }
      ],
      companies: [
        { name: 'JP Morgan Chase', sector: 'Finance & Accounting', hiring: 'Mumbai, Bangalore' },
        { name: 'HDFC Bank', sector: 'Finance & Accounting', hiring: 'Pan India' },
        { name: 'Credit Suisse', sector: 'Finance & Accounting', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'What software skills are essential?', answer: 'Advanced Microsoft Excel proficiency (VLOOKUP, Pivot Tables) is mandatory. Financial modeling tools and basic SQL/Python are increasingly beneficial.' },
        { question: 'Is a Master\'s degree mandatory?', answer: 'A top MBA in Finance is highly recommended for career acceleration and entry into top corporate roles.' }
      ]
    }
  },

  {
    id: 'csecretary', name: 'Company Secretary (CS)', slug: 'company-secretary', stream: 'Commerce', sector: 'Law & Legal', shortDescription: 'Ensure corporate legal and statutory compliance.', avgSalaryIndiaLPA: '7 - 18 LPA', growthRate: 'Medium', prerequisites: 'ICSI exams cleared, Bachelor’s degree', topCities: ['Mumbai', 'Delhi', 'Kolkata'], icon: '📜',
    detailedInfo: {
      overview: 'A Company Secretary is responsible for the efficient administration of a company, ensuring compliance with statutory and regulatory requirements, and managing the company\'s legal affairs. This is a highly specialized legal/compliance role.',
      personalityTraits: ['Detail-Oriented', 'Ethical', 'Compliance-Focused', 'Systematic', 'Legal Minded'],
      roadmap: [
        { phase: 'Entry Level', duration: '9 months', description: 'CS Foundation / CSEET (Company Secretary Executive Entrance Test).', keyPoints: ['Clear CSEET after 12th', 'Study Business Communication, Law, and Economics'] },
        { phase: 'Executive', duration: '1 year', description: 'CS Executive Programme.', keyPoints: ['Deep dive into Corporate Law, Tax Laws, and Accounting', 'Pass modular exams'] },
        { phase: 'Professional & Training', duration: '3 years', description: 'CS Professional Programme + Mandatory Training.', keyPoints: ['Clear Final Professional exams', 'Complete 21 months of mandatory practical training (Articleship)', 'Enroll as a CS with ICSI'] }
      ],
      exams: [
        { name: 'CSEET', conducting: 'ICSI', eligibility: '12th pass/Graduation', frequency: 'Multiple', difficulty: 'Medium' },
        { name: 'CS Executive', conducting: 'ICSI', eligibility: 'CSEET/Graduation', frequency: 'Twice a year', difficulty: 'High' },
        { name: 'CS Professional', conducting: 'ICSI', eligibility: 'CS Executive passed', frequency: 'Twice a year', difficulty: 'High' }
      ],
      institutions: [
        { name: 'ICSI', location: 'New Delhi (HQ)', ranking: 'Official Body', type: 'University' }
      ],
      companies: [
        { name: 'Reliance Industries', sector: 'Manufacturing & Core', hiring: 'Mumbai' },
        { name: 'Infosys', sector: 'IT & Software', hiring: 'Bangalore' },
        { name: 'All Listed Companies', sector: 'All Sectors', hiring: 'Mandatory role' }
      ],
      faqs: [
        { question: 'Can I pursue CS after graduation?', answer: 'Yes, graduates are exempt from the CSEET and can directly enroll in the CS Executive Programme.' },
        { question: 'Is CS more rewarding than CA?', answer: 'Both are prestigious. CA is focused on auditing/taxation; CS is focused on corporate law/governance. CS roles in large MNCs are highly rewarding and specialized.' }
      ]
    }
  },

  {
    id: 'pharmacist', name: 'Pharmacist', slug: 'pharmacist', stream: 'Science', sector: 'Healthcare', shortDescription: 'Dispense medication and counsel patients on drug use.', avgSalaryIndiaLPA: '3 - 8 LPA', growthRate: 'Medium', prerequisites: 'B.Pharm/M.Pharm degree', topCities: ['Hyderabad', 'Ahmedabad', 'Mumbai'], icon: '💊',
    detailedInfo: {
      overview: 'Pharmacists are licensed healthcare professionals who dispense medications and advise patients on drug interactions and side effects. They work in retail pharmacies, hospitals, pharmaceutical R&D, and regulatory affairs.',
      personalityTraits: ['Responsible', 'Precise', 'Ethical', 'Detail-Oriented', 'Counselling'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Pharm (Bachelor of Pharmacy).', keyPoints: ['Clear MHT-CET/JEE/NEET (varies by college)', 'Focus on pharmacology and medicinal chemistry', 'Practical hospital training'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.Pharm or Pharm.D (Doctor of Pharmacy).', keyPoints: ['Specialization in regulatory affairs or clinical pharmacy', 'Clear GPAT (Graduate Pharmacy Aptitude Test) for M.Pharm admission'] },
        { phase: 'Registration', duration: 'Ongoing', description: 'Obtain license to practice.', keyPoints: ['Register with the State Pharmacy Council', 'Enter industry, R&D, or community pharmacy'] }
      ],
      exams: [
        { name: 'GPAT', conducting: 'NTA', eligibility: 'B.Pharm', frequency: 'Annual', difficulty: 'Medium' },
        { name: 'MHT-CET', conducting: 'Maharashtra State CET Cell', eligibility: '12th PCB/PCM', frequency: 'Annual', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'NIPER (National Institute of Pharmaceutical Education and Research)', location: 'Mohali/Hyderabad', ranking: 'Top Research Institute', type: 'University' },
        { name: 'ICT Mumbai', location: 'Mumbai', ranking: 'Top Tech School', type: 'College' }
      ],
      companies: [
        { name: 'Sun Pharma', sector: 'Pharmaceuticals', hiring: 'Research & Manufacturing' },
        { name: 'Dr. Reddy\'s Laboratories', sector: 'Pharmaceuticals', hiring: 'Hyderabad' },
        { name: 'Apollo Pharmacy', sector: 'Healthcare', hiring: 'Retail' }
      ],
      faqs: [
        { question: 'What is the scope of Pharm.D in India?', answer: 'Pharm.D (6 years) offers advanced clinical training, allowing you to work as a Clinical Pharmacist in hospitals, focusing on patient-centric medication review and therapy optimization.' },
        { question: 'How important is GPAT?', answer: 'GPAT is essential if you wish to pursue M.Pharm from top institutions and secure government scholarships (stipends).' }
      ]
    }
  },

  {
    id: 'physio', name: 'Physiotherapist', slug: 'physiotherapist', stream: 'Science', sector: 'Healthcare', shortDescription: 'Treat injuries and physical disorders using exercise and manipulation.', avgSalaryIndiaLPA: '4 - 10 LPA', growthRate: 'High', prerequisites: 'B.P.T. degree', topCities: ['All Major Cities'], icon: '🤸',
    detailedInfo: {
      overview: 'Physiotherapists help people affected by injury, illness, or disability through movement and exercise, manual therapy, education, and advice. It is a highly hands-on and rewarding field with growing demand in sports and rehabilitation.',
      personalityTraits: ['Empathetic', 'Patient', 'Practical', 'Energetic', 'Encouraging'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4.5 years', description: 'B.P.T. (Bachelor of Physiotherapy) (4 years course + 6 months internship).', keyPoints: ['Clear state/university entrance exams', 'Deep study of human anatomy and kinesiology', 'Clinical internships'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.P.T. (Master of Physiotherapy).', keyPoints: ['Specialization in fields like Neurology, Orthopedics, or Sports Physio', 'Research focus'] },
        { phase: 'Career Focus', duration: 'Ongoing', description: 'Work in clinics, hospitals, or private practice.', keyPoints: ['Establish a niche (e.g., geriatric or sports)', 'Open a private clinic', 'Work with professional sports teams'] }
      ],
      exams: [
        { name: 'IPU CET/PGIMER', conducting: 'Various Universities/Institutes', eligibility: '12th PCB', frequency: 'Annual', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'AIIMS Delhi', location: 'New Delhi', ranking: 'Top for MPT', type: 'AIIMS' },
        { name: 'Christian Medical College (CMC)', location: 'Vellore', ranking: 'Top Institution', type: 'College' }
      ],
      companies: [
        { name: 'Manipal Hospitals', sector: 'Healthcare', hiring: 'Major Cities' },
        { name: 'Max Healthcare', sector: 'Healthcare', hiring: 'North India' },
        { name: 'Sports Authorities (SAI)', sector: 'Government & Public', hiring: 'Sports centers' }
      ],
      faqs: [
        { question: 'Is NEET required for Physiotherapy?', answer: 'No, generally B.P.T. admissions are based on state-level CETs or university entrance exams, not NEET-UG.' },
        { question: 'How is the earning potential?', answer: 'The earning potential is high, especially after 5-7 years of experience when you establish your own specialized private practice.' }
      ]
    }
  },

  {
    id: 'nurse', name: 'Registered Nurse', slug: 'nurse', stream: 'Science', sector: 'Healthcare', shortDescription: 'Provide essential medical care and patient support.', avgSalaryIndiaLPA: '3 - 7 LPA', growthRate: 'Medium', prerequisites: 'B.Sc. Nursing/GNM, registration', topCities: ['All Major Cities'], icon: '🩹',
    detailedInfo: {
      overview: 'Registered Nurses (RNs) provide and coordinate patient care, educate patients and the public about various health conditions, and provide emotional support to patients and their families. It is a stable, essential, and highly ethical career.',
      personalityTraits: ['Caring', 'Patient', 'Responsible', 'Calm under pressure', 'Organized'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Sc. Nursing or GNM (General Nursing and Midwifery - 3.5 years).', keyPoints: ['Clear institute-specific entrance exams', 'Intense clinical training', 'Focus on pharmacology, pathology, and patient care'] },
        { phase: 'Registration', duration: 'Immediate', description: 'Obtain license to practice in India.', keyPoints: ['Register with the Indian Nursing Council (INC) or State Council', 'Apply for Staff Nurse roles'] },
        { phase: 'Specialization', duration: '2 years', description: 'M.Sc. Nursing or specialty courses.', keyPoints: ['Focus on Critical Care, Pediatrics, or Oncology nursing', 'Leadership roles (Nurse Manager)'] }
      ],
      exams: [
        { name: 'AIIMS Nursing Entrance', conducting: 'AIIMS', eligibility: '12th PCB', frequency: 'Annual', difficulty: 'Medium' },
        { name: 'State-Level Common Entrance Tests (CETs)', conducting: 'State Authorities', eligibility: '12th PCB', frequency: 'Annual', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'AIIMS Delhi', location: 'New Delhi', ranking: 'Top Nursing School', type: 'AIIMS' },
        { name: 'Armed Forces Medical College (AFMC)', location: 'Pune', ranking: 'Premier Institute', type: 'College' }
      ],
      companies: [
        { name: 'Apollo Hospitals', sector: 'Healthcare', hiring: 'Pan India' },
        { name: 'Government Hospitals (AIIMS, JIPMER)', sector: 'Public Health', hiring: 'Pan India' },
        { name: 'Max Healthcare', sector: 'Healthcare', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'Is B.Sc. Nursing better than GNM?', answer: 'B.Sc. Nursing is a full university degree, offering broader knowledge and faster career growth into management, research, and teaching roles than the GNM diploma.' },
        { question: 'What is the scope abroad?', answer: 'Indian B.Sc. nurses are in high demand in the US, Canada, UK, and Middle East. After clearing licensing exams (like NCLEX), salaries are significantly higher.' }
      ]
    }
  },

  {
    id: 'ibpspo', name: 'Bank PO (IBPS/SBI)', slug: 'bank-po', stream: 'Any', sector: 'Government & Public', shortDescription: 'Probationary Officer in Public Sector Banks.', avgSalaryIndiaLPA: '7 - 12 LPA', growthRate: 'Medium', prerequisites: 'Graduation in any stream, clear IBPS/SBI PO exams', topCities: ['Pan India'], icon: '🏦',
    detailedInfo: {
      overview: 'A Bank Probationary Officer (PO) is an entry-level managerial role in public sector banks (PSBs). The job offers excellent job security, structured career progression, and a prestigious government sector salary package. SBI PO and IBPS PO are the main exams.',
      personalityTraits: ['Responsible', 'Analytical', 'Communication', 'Quick Learner', 'Customer-focused'],
      roadmap: [
        { phase: 'Preparation', duration: '1 year', description: 'Dedicated study for the common recruitment process.', keyPoints: ['Focus on Quantitative Aptitude, Reasoning, and English', 'Daily practice of high-difficulty Data Interpretation (DI) sets', 'Thorough reading of financial newspapers'] },
        { phase: 'Exam Cycle', duration: '6 months', description: 'Clear three stages: Prelims, Mains, and Interview.', keyPoints: ['Master sectional time limits for Prelims', 'Deep dive into Banking/Financial Awareness for Mains', 'Practice Group Discussion (GD) and Interview skills'] },
        { phase: 'Probation', duration: '2 years', description: 'Initial training and field posting as a PO.', keyPoints: ['Learn banking operations and systems', 'Focus on passing internal certification exams'] }
      ],
      exams: [
        { name: 'SBI PO', conducting: 'SBI', eligibility: 'Graduation (any stream)', frequency: 'Annual', difficulty: 'High' },
        { name: 'IBPS PO', conducting: 'IBPS', eligibility: 'Graduation (any stream)', frequency: 'Annual', difficulty: 'High' },
        { name: 'RBI Grade B', conducting: 'RBI', eligibility: 'Graduation (60% min)', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'State Bank of India (SBI)', location: 'Mumbai (HQ)', ranking: 'Top PSB', type: 'University' },
        { name: 'Institute of Banking Personnel Selection (IBPS)', location: 'Mumbai', ranking: 'Recruitment Body', type: 'University' }
      ],
      companies: [
        { name: 'State Bank of India', sector: 'Government & Public', hiring: 'Pan India' },
        { name: 'Punjab National Bank', sector: 'Government & Public', hiring: 'Pan India' },
        { name: 'Bank of Baroda', sector: 'Government & Public', hiring: 'Pan India' }
      ],
      faqs: [
        { question: 'Is the salary only ₹7-12 LPA?', answer: 'This includes basic pay, DA, HRA, and CCA. The CTC (Cost to Company) is higher due to generous benefits like leave encashment, medical, and subsidized loans.' },
        { question: 'What is the career progression?', answer: 'Fast-track promotions are common: PO → Assistant Manager → Deputy Manager → Chief Manager, potentially reaching General Manager level in 15-20 years.' }
      ]
    }
  },

  {
    id: 'ssccgl', name: 'SSC CGL Officer', slug: 'ssc-cgl', stream: 'Any', sector: 'Government & Public', shortDescription: 'Recruitment for Group B/C posts in Central Government Ministries (Income Tax, Excise etc).', avgSalaryIndiaLPA: '6 - 10 LPA', growthRate: 'Medium', prerequisites: 'Graduation in any stream, clear SSC CGL exam', topCities: ['Pan India'], icon: '🏢',
    detailedInfo: {
      overview: 'The SSC Combined Graduate Level (CGL) Examination recruits staff for various Group "B" and "C" posts in Ministries/Departments/Organizations of the Government of India, such as Income Tax Inspector, Auditor, and Assistant Section Officer. It is highly competitive.',
      personalityTraits: ['Diligent', 'Focused', 'Rule-Oriented', 'Systematic', 'Patriotic'],
      roadmap: [
        { phase: 'Preparation', duration: '1 year', description: 'Intensive preparation for Tier I (Prelims) and Tier II (Mains).', keyPoints: ['Master General Intelligence & Reasoning', 'High-speed solving of Quantitative Aptitude', 'Deep study of General Awareness (History, Polity, Current Affairs)'] },
        { phase: 'Exam Cycle', duration: '6 months', description: 'Clear three stages: Tier I (Screening), Tier II (Core Test), and Document Verification/Skill Test.', keyPoints: ['Practice advanced quantitative techniques for Tier II', 'Focus on English comprehension and writing skills'] },
        { phase: 'Training/Job', duration: 'Ongoing', description: 'Department-specific training and posting.', keyPoints: ['Learn departmental procedures (e.g., tax filing for IT Inspector)', 'Focus on seniority-based promotion'] }
      ],
      exams: [
        { name: 'SSC CGL Tier I', conducting: 'SSC', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'Medium' },
        { name: 'SSC CGL Tier II', conducting: 'SSC', eligibility: 'Tier I cleared', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'Staff Selection Commission (SSC)', location: 'New Delhi (HQ)', ranking: 'Recruitment Body', type: 'University' }
      ],
      companies: [
        { name: 'Central Board of Direct Taxes (CBDT)', sector: 'Government & Public', hiring: 'Income Tax Inspector' },
        { name: 'Central Board of Indirect Taxes & Customs (CBIC)', sector: 'Government & Public', hiring: 'Excise Inspector' },
        { name: 'Comptroller and Auditor General (CAG)', sector: 'Government & Public', hiring: 'Auditor' }
      ],
      faqs: [
        { question: 'Which post is the highest paid in CGL?', answer: 'Assistant Section Officer (ASO) in MEA (Ministry of External Affairs) and Inspector of Income Tax are considered the highest paying and most coveted posts.' },
        { question: 'Does CGL offer transferable jobs?', answer: 'Yes, most posts under the CGL are central government jobs and involve postings anywhere in India, sometimes with foreign postings (e.g., ASO in MEA).' }
      ]
    }
  },

  {
    id: 'ifs-officer', name: 'Indian Foreign Service (IFS)', slug: 'ifs-officer', stream: 'Arts', sector: 'Defense & Public', shortDescription: 'Represent India in global embassies and international organizations.', avgSalaryIndiaLPA: '10 - 30 LPA', growthRate: 'Medium', prerequisites: 'UPSC CSE rank, specialization in International Relations', topCities: ['New Delhi', 'Global'], icon: '🌍',
    detailedInfo: {
      overview: 'IFS officers are responsible for conducting diplomacy, representing India\'s interests abroad, and managing Indian missions (Embassies, High Commissions). It is a career of immense prestige and global exposure, entered via the UPSC Civil Services Exam.',
      personalityTraits: ['Diplomatic', 'Culturally Aware', 'Communicator', 'Leader', 'Resilient'],
      roadmap: [
        { phase: 'Preparation', duration: '1-2 years', description: 'Clear UPSC CSE with a high rank (usually top 100).', keyPoints: ['Deep study of International Relations', 'Foreign policy analysis', 'Mastering the essay and interview stages'] },
        { phase: 'Training', duration: '3 years', description: 'Training at FSI (Foreign Service Institute) and LBSNAA.', keyPoints: ['Intensive foreign language training', 'Protocol and diplomatic practice', 'Economic diplomacy focus'] },
        { phase: 'Posting', duration: 'Ongoing', description: 'Assignments in Embassies, High Commissions, and UN missions globally.', keyPoints: ['Serve 3-4 year tenures in different countries', 'Promoted to Ambassadorial level'] }
      ],
      exams: [
        { name: 'UPSC CSE', conducting: 'UPSC', eligibility: 'Graduation, Age 21-32', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'Foreign Service Institute (FSI)', location: 'New Delhi', ranking: 'Premier Training', type: 'University' }
      ],
      companies: [
        { name: 'Ministry of External Affairs (MEA)', sector: 'Government & Public', hiring: 'New Delhi' },
        { name: 'United Nations (UN)', sector: 'Global', hiring: 'Deputation' }
      ],
      faqs: [
        { question: 'Is IFS tougher than IAS?', answer: 'While both are via CSE, IFS generally requires a higher rank (usually top 100) due to fewer vacancies, making it statistically harder to achieve.' },
        { question: 'What foreign languages are taught?', answer: 'Officers are assigned a Compulsory Foreign Language (CFL), which can be Arabic, Chinese, Spanish, French, etc., and must achieve proficiency before their first posting.' }
      ]
    }
  },

  {
    id: 'journalist', name: 'Journalist / Editor', slug: 'journalist', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Report, write, and broadcast news and investigative stories.', avgSalaryIndiaLPA: '4 - 10 LPA', growthRate: 'Low', prerequisites: 'Bachelors in Journalism/Mass Comm.', topCities: ['New Delhi', 'Mumbai', 'Kolkata'], icon: '📰',
    detailedInfo: {
      overview: 'Journalists investigate, report, and analyze events for media outlets (print, digital, broadcast). The field is challenging, demanding high ethical standards and communication skills.',
      personalityTraits: ['Curious', 'Inquisitive', 'Articulate', 'Ethical', 'Resilient'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.A. in Journalism/Mass Communication.', keyPoints: ['Clear university entrance exams (e.g., IIMC, Symbiosis)', 'Develop reporting and writing skills', 'Build a portfolio of published work'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.A. in Mass Communication/Journalism.', keyPoints: ['Specialization in Investigative or Digital Journalism', 'Internships at major media houses (TOI, NDTV, Wire)'] },
        { phase: 'Career Growth', duration: 'Ongoing', description: 'Reporter to Editor or Bureau Chief.', keyPoints: ['Focus on digital media skills (SEO, multimedia)', 'Build network of sources', 'Specialize in a beat (politics, finance, technology)'] }
      ],
      exams: [
        { name: 'IIMC Entrance Exam', conducting: 'IIMC', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'Medium' },
        { name: 'JMI Entrance', conducting: 'Jamia Millia Islamia', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'Indian Institute of Mass Communication (IIMC)', location: 'New Delhi', ranking: 'Premier Institute', type: 'College' },
        { name: 'ACJ (Asian College of Journalism)', location: 'Chennai', ranking: 'Top P.G. Diploma', type: 'College' }
      ],
      companies: [
        { name: 'The Hindu/Indian Express', sector: 'Print/Digital', hiring: 'Major Cities' },
        { name: 'NDTV/Republic', sector: 'Broadcast', hiring: 'New Delhi, Mumbai' }
      ],
      faqs: [
        { question: 'Is the salary good for journalists?', answer: 'Starting salaries are modest (₹3-5 LPA) at smaller firms. Established reporters and editors at major media houses can earn excellent salaries (₹15+ LPA).' },
      ]
    }
  },

  {
    id: 'cwriter', name: 'Content Writer / Strategist', slug: 'content-writer', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Create engaging content for websites, blogs, and marketing.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'High', prerequisites: 'Excellent command of English, any graduation', topCities: ['Remote', 'Bangalore', 'Pune'], icon: '✍️',
    detailedInfo: {
      overview: 'Content Writers create compelling written material (blogs, websites, social media) tailored to specific digital platforms. Strategists plan the content calendar, tone, and distribution for maximum business impact. It is a highly digital and in-demand role.',
      personalityTraits: ['Linguistically Strong', 'Creative', 'Researcher', 'Empathetic (Audience focus)', 'Detail-Oriented'],
      roadmap: [
        { phase: 'Foundation', duration: '1 year', description: 'Honing language skills and digital knowledge.', keyPoints: ['Read widely and write daily', 'Understand the basics of SEO (Search Engine Optimization)', 'Create a personal blog/portfolio website'] },
        { phase: 'Entry Level', duration: '2 years', description: 'Content Executive or Copywriter role.', keyPoints: ['Master content management systems (WordPress)', 'Learn different content formats (long-form, micro-copy)', 'Gain certification in content marketing'] },
        { phase: 'Strategy Role', duration: 'Ongoing', description: 'Content Strategist or Head of Content.', keyPoints: ['Focus on audience analysis and keyword research', 'Measure content ROI (Return on Investment)', 'Lead a team of writers'] }
      ],
      exams: [
        { name: 'Google Digital Garage Certificate', conducting: 'Google', eligibility: 'None', frequency: 'Ongoing', difficulty: 'Low' },
      ],
      institutions: [
        { name: 'Xavier Institute of Communications (XIC)', location: 'Mumbai', ranking: 'Top P.G. Diploma', type: 'College' }
      ],
      companies: [
        { name: 'Unacademy/Byju\'s', sector: 'Education & Research', hiring: 'EdTech Content' },
        { name: 'HubSpot', sector: 'Technology', hiring: 'Content Marketing' },
        { name: 'Tech Startups', sector: 'IT & Software', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'Is a journalism degree necessary?', answer: 'No. A strong portfolio showcasing versatility (technical, creative, marketing) and excellent language skills is valued more than a degree.' },
        { question: 'How is remote work potential?', answer: 'Very high. Content writing is one of the most popular remote careers in India, offering flexibility and access to global clients/salaries.' }
      ]
    }
  },

  {
    id: 'vlogger', name: 'Filmmaker / Vlogger', slug: 'filmmaker', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Produce films, documentaries, or high-quality video content.', avgSalaryIndiaLPA: '4 - 15 LPA', growthRate: 'High', prerequisites: 'Mass Comm. degree or film school training', topCities: ['Mumbai', 'Hyderabad'], icon: '🎥',
    detailedInfo: {
      overview: 'Filmmakers and Vloggers create video content for cinema, streaming platforms (Netflix, Amazon), or digital media (YouTube, Instagram). This career is highly dependent on creativity and networking.',
      personalityTraits: ['Creative', 'Storyteller', 'Technical', 'Visionary', 'Persistent'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.A. Mass Communication or Film Studies.', keyPoints: ['Clear FTII/SRFTI entrance exams', 'Master video editing software (Adobe Premiere, DaVinci Resolve)', 'Shoot short films/vlogs frequently'] },
        { phase: 'Skill Acquisition', duration: '2 years', description: 'Film school or intensive diploma/mentorship.', keyPoints: ['Focus on scriptwriting and direction', 'Cinematography and lighting techniques', 'Network with industry professionals'] },
        { phase: 'Professional Work', duration: 'Ongoing', description: 'Freelance or join a production house.', keyPoints: ['Start as an Assistant Director (AD) or production assistant', 'Build a specialized reel (e.g., commercials, music videos)'] }
      ],
      exams: [
        { name: 'FTII JET (Joint Entrance Test)', conducting: 'FTII', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' },
        { name: 'SRFTI Entrance', conducting: 'SRFTI', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'Film and Television Institute of India (FTII)', location: 'Pune', ranking: 'Premier Film School', type: 'College' },
        { name: 'Satyajit Ray Film & Television Institute (SRFTI)', location: 'Kolkata', ranking: 'Premier Film School', type: 'College' }
      ],
      companies: [
        { name: 'Yash Raj Films', sector: 'Film Production', hiring: 'Mumbai' },
        { name: 'Netflix/Amazon Prime', sector: 'OTT Platforms', hiring: 'Content Creation' },
        { name: 'T-Series', sector: 'Music/Media', hiring: 'Mumbai, Noida' }
      ],
      faqs: [
        { question: 'Is formal education mandatory?', answer: 'No, but highly beneficial for technical skills and industry networking. Many successful vloggers are self-taught, focusing intensely on YouTube analytics and trends.' },
        { question: 'How long does it take to make money?', answer: 'Vlogging income is volatile. It can take 2-3 years of consistent, high-quality content creation to earn a stable income through ads and brand deals.' }
      ]
    }
  },

  {
    id: 'teacher-k12', name: 'School Teacher (K-12)', slug: 'teacher-k12', stream: 'Any', sector: 'Education & Research', shortDescription: 'Educate students at primary and secondary levels.', avgSalaryIndiaLPA: '3 - 8 LPA', growthRate: 'Medium', prerequisites: 'B.Ed./TET/CTET qualification', topCities: ['Pan India'], icon: '🍎',
    detailedInfo: {
      overview: 'School Teachers are responsible for delivering curriculum, managing classrooms, and nurturing students\' development from Kindergarten to 12th grade. Government jobs offer high stability and pension benefits, while private schools offer higher initial salaries.',
      personalityTraits: ['Patient', 'Communicator', 'Inspiring', 'Creative', 'Disciplined'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.A./B.Sc./B.Com in a relevant subject.', keyPoints: ['Maintain good academic score', 'Clear the subject foundation'] },
        { phase: 'Professional Degree', duration: '2 years', description: 'B.Ed. (Bachelor of Education) or equivalent teaching diploma.', keyPoints: ['B.Ed. entrance tests', 'Focus on pedagogy and classroom management', 'Compulsory teaching practice'] },
        { phase: 'Qualification', duration: 'Ongoing', description: 'Clear eligibility tests for government/private jobs.', keyPoints: ['Clear CTET (Central TET) or State TET for eligibility', 'Apply for PGT (Post Graduate Teacher) or TGT (Trained Graduate Teacher) roles'] }
      ],
      exams: [
        { name: 'CTET (Central TET)', conducting: 'CBSE', eligibility: 'B.Ed.', frequency: 'Twice a year', difficulty: 'Medium' },
        { name: 'TET (State Level)', conducting: 'State Boards', eligibility: 'B.Ed.', frequency: 'Annual', difficulty: 'Medium' },
        { name: 'B.Ed. Entrance', conducting: 'University/State CETs', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'NCERT/SCERT Affiliated Colleges', location: 'Pan India', ranking: 'Top B.Ed. Colleges', type: 'College' }
      ],
      companies: [
        { name: 'Kendriya Vidyalaya (KV)', sector: 'Government & Public', hiring: 'TGT/PGT' },
        { name: 'CBSE/ICSE Schools', sector: 'Private Sector', hiring: 'Pan India' }
      ],
      faqs: [
        { question: 'Is CTET mandatory?', answer: 'Yes, CTET is mandatory for teaching positions in all Central Government schools (KVs, NVS, Tibetan Schools) and is highly preferred by top private schools.' },
        { question: 'How is the career progression?', answer: 'Through seniority, a teacher can progress to Head of Department (HOD) and eventually to Vice-Principal or Principal.' }
      ]
    }
  },

  {
    id: 'professor', name: 'University Professor', slug: 'university-professor', stream: 'Any', sector: 'Education & Research', shortDescription: 'Teach and conduct research at the university level.', avgSalaryIndiaLPA: '10 - 25 LPA', growthRate: 'Medium', prerequisites: 'Ph.D./NET/SET qualification', topCities: ['Major State Capitals'], icon: '🎓',
    detailedInfo: {
      overview: 'University Professors teach specialized subjects at the Bachelor, Master, and Ph.D. levels, supervise student research, and conduct independent academic research. This is a highly intellectual and stable career, governed by UGC norms.',
      personalityTraits: ['Intellectual', 'Researcher', 'Communicator', 'Mentor', 'Expert'],
      roadmap: [
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.A./M.Sc./M.Com in a relevant subject.', keyPoints: ['Maintain high academic score', 'Clear NET/SET eligibility exams'] },
        { phase: 'Research', duration: '5 years', description: 'Ph.D. (Doctor of Philosophy) in the chosen subject.', keyPoints: ['Clear JRF (Junior Research Fellowship)', 'Complete thesis and publications', 'Research fieldwork/lab work'] },
        { phase: 'Entry Level', duration: 'Ongoing', description: 'Assistant Professor role.', keyPoints: ['Recruitment through interview and NET/Ph.D. score', 'Progress to Associate Professor and full Professor'] }
      ],
      exams: [
        { name: 'UGC NET (National Eligibility Test)', conducting: 'NTA', eligibility: 'Master\'s Degree (55% min)', frequency: 'Twice a year', difficulty: 'High' },
        { name: 'CSIR NET (Science Subjects)', conducting: 'NTA', eligibility: 'M.Sc.', frequency: 'Twice a year', difficulty: 'High' }
      ],
      institutions: [
        { name: 'Delhi University (DU)', location: 'New Delhi', ranking: 'Top Central University', type: 'University' },
        { name: 'Jawaharlal Nehru University (JNU)', location: 'New Delhi', ranking: 'Top Research', type: 'University' },
        { name: 'IISc Bangalore', location: 'Bangalore', ranking: 'Top Research', type: 'University' }
      ],
      companies: [
        { name: 'UGC/Ministry of Education', sector: 'Government & Public', hiring: 'Regulators' },
        { name: 'All Central/State Universities', sector: 'Education & Research', hiring: 'Teaching Staff' }
      ],
      faqs: [
        { question: 'Is Ph.D. mandatory for Professor?', answer: 'A Ph.D. is increasingly mandatory for Professor roles and is often preferred for Assistant Professor positions in top universities. UGC NET is the basic eligibility requirement.' },
        { question: 'What is JRF?', answer: 'Junior Research Fellowship (JRF) is a scholarship awarded to top NET/CSIR NET qualifiers to fund their Ph.D. research for up to five years, providing a monthly stipend.' }
      ]
    }
  },
  
  // --- New Careers with Full Detailed Info (Cont.) ---

  {
    id: 'data-analyst', name: 'Data Analyst', slug: 'data-analyst', stream: 'Any', sector: 'IT & Software', shortDescription: 'Collect, process, and perform statistical analyses on datasets.', avgSalaryIndiaLPA: '6 - 12 LPA', growthRate: 'High', prerequisites: 'Bachelors in Statistics/Maths/CS, tool proficiency', topCities: ['Bangalore', 'Pune'], icon: '📊',
    detailedInfo: {
      overview: 'Data Analysts bridge the gap between data and business intelligence. They clean, transform, and model data to find actionable insights, helping companies make informed decisions across marketing, finance, and operations.',
      personalityTraits: ['Analytical', 'Detail-Oriented', 'Curious', 'Communicative', 'Logical'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3-4 years', description: 'B.Sc. in Statistics/Maths or B.Tech/B.E. in any discipline.', keyPoints: ['Master MS Excel and SQL', 'Learn programming basics (Python/R)', 'Study Descriptive Statistics'] },
        { phase: 'Skill Acquisition', duration: '6 months', description: 'Certification and tool mastery.', keyPoints: ['Google Data Analytics Certificate', 'Master visualization tools (Tableau/Power BI)', 'Practice case studies on platforms like Kaggle'] },
        { phase: 'Career Progression', duration: 'Ongoing', description: 'Data Analyst to Business Intelligence Analyst to Data Scientist.', keyPoints: ['Focus on industry-specific metrics (e.g., e-commerce KPIs)', 'Learn advanced ML concepts to progress to Data Scientist'] }
      ],
      exams: [
        { name: 'NMAT/SNAP (for Business Analytics PG)', conducting: 'GMAC/SIU', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'IIMs (Executive Analytics Programs)', location: 'Various', ranking: 'Top B-School', type: 'IIM' },
        { name: 'BITS Pilani (Data Science)', location: 'Online/Pilani', ranking: 'Top Institution', type: 'University' }
      ],
      companies: [
        { name: 'Mu Sigma', sector: 'Consulting', hiring: 'Bangalore' },
        { name: 'Fractal Analytics', sector: 'Consulting', hiring: 'Mumbai' },
        { name: 'Amazon', sector: 'E-commerce/Tech', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'Do I need a Masters for this role?', answer: 'No, but a Post Graduate Diploma or M.Sc. in Data Science/Analytics from a reputable institution can double your starting salary.' },
        { question: 'What is the career path?', answer: 'Analyst → Senior Analyst → Analytics Manager → Director of Analytics/Data Science.' }
      ]
    }
  },

  {
    id: 'actuary', name: 'Actuary', slug: 'actuary', stream: 'Science', sector: 'Finance & Accounting', shortDescription: 'Analyze financial risk in insurance and finance using mathematical models.', avgSalaryIndiaLPA: '15 - 40 LPA', growthRate: 'High', prerequisites: 'Actuarial exams cleared, Math/Stats background', topCities: ['Mumbai', 'Pune'], icon: '🔢',
    detailedInfo: {
      overview: 'Actuaries are expert risk managers who use mathematics, statistics, and financial theory to study uncertain future events (like insurance claims or market crashes). They are essential in the insurance, pension, and investment industries.',
      personalityTraits: ['Mathematical', 'Risk-Averse', 'Long-Term Planner', 'Analytical', 'Detail-Oriented'],
      roadmap: [
        { phase: 'Foundation', duration: '3 years', description: 'B.Sc. in Actuarial Science, Maths, or Statistics.', keyPoints: ['Clear initial CT (Core Technical) exams from IAI/IFOA', 'Build strong Python/R and Excel skills', 'Clear ACET (Actuarial Common Entrance Test)'] },
        { phase: 'Intermediate', duration: '5 years', description: 'Work as an Actuarial Analyst while clearing core exams (CS/CM/CB/CP).', keyPoints: ['Complete mandatory VEE (Validation by Educational Experience) papers', 'Gain experience in life, general, or health insurance'] },
        { phase: 'Fellowship', duration: '3 years', description: 'Achieve Fellow status (FIAI/FIA) by clearing advanced exams.', keyPoints: ['Pass specialist and advanced professional exams', 'High earning potential unlocked upon achieving Fellowship'] }
      ],
      exams: [
        { name: 'ACET (Actuarial Common Entrance Test)', conducting: 'IAI', eligibility: '12th pass (Maths/Stats)', frequency: 'Twice a year', difficulty: 'Medium' },
        { name: 'CT Series Exams', conducting: 'IAI (Institute of Actuaries of India)', eligibility: 'ACET cleared', frequency: 'Twice a year', difficulty: 'High' }
      ],
      institutions: [
        { name: 'Institute of Actuaries of India (IAI)', location: 'Mumbai (HQ)', ranking: 'Accreditation Body', type: 'University' },
        { name: 'University of Delhi (Actuarial Science)', location: 'New Delhi', ranking: 'Top College', type: 'University' }
      ],
      companies: [
        { name: 'HDFC Life Insurance', sector: 'Finance & Accounting', hiring: 'Risk/Product Development' },
        { name: 'PwC India', sector: 'Consulting', hiring: 'Actuarial Consulting' },
        { name: 'Marsh & McLennan (Mercer)', sector: 'Consulting', hiring: 'Major Cities' }
      ],
      faqs: [
        { question: 'Is it the hardest exam series?', answer: 'It is considered one of the hardest professional exam series globally, taking 8-15 years for many to complete the Fellowship fully. Consistency is more important than speed.' },
        { question: 'Can Commerce students pursue this?', answer: 'Yes, if you have a strong focus on Mathematics (taken in 12th grade), you can pursue this by clearing ACET and pursuing a B.Com with a specialization.' }
      ]
    }
  },

  {
    id: 'engineer-isro', name: 'ISRO Scientist / Engineer', slug: 'isro-scientist', stream: 'Science', sector: 'Defense & Public', shortDescription: 'Contribute to India\'s space and satellite missions.', avgSalaryIndiaLPA: '10 - 20 LPA', growthRate: 'Medium', prerequisites: 'B.Tech in relevant field, ISRO Exam qualified', topCities: ['Bangalore', 'Thiruvananthapuram'], icon: '🚀',
    detailedInfo: {
      overview: 'ISRO (Indian Space Research Organisation) recruits high-caliber scientists and engineers to work on prestigious national projects, including satellite design, launch vehicle development, and interplanetary missions. It is a highly competitive and respected government job.',
      personalityTraits: ['Analytical', 'Patriotic', 'Researcher', 'Innovator', 'Detail-Oriented'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech/B.E. in Aerospace, Mechanical, ECE, or CS.', keyPoints: ['Maintain high GPA/CGPA (8+)', 'Focus on core engineering subjects', 'Clear UPSC ESE or ISRO\'s specific recruitment exam (ISRO Centralised Recruitment Board - ICRB)'] },
        { phase: 'Recruitment', duration: '1 year', description: 'Clear written test and interview (ICRB).', keyPoints: ['Intensive technical preparation for the written test', 'Master problem-solving abilities', 'Face a rigorous, in-depth technical interview'] },
        { phase: 'Career Progression', duration: 'Ongoing', description: 'Scientist/Engineer-SC role.', keyPoints: ['Work in specialized R&D labs', 'Opportunity for M.Tech/Ph.D. sponsorship', 'Promotions based on performance and tenure'] }
      ],
      exams: [
        { name: 'ISRO ICRB Exam', conducting: 'ISRO', eligibility: 'B.Tech/B.E.', frequency: 'Annual (varies)', difficulty: 'High' },
        { name: 'UPSC ESE (for certain streams)', conducting: 'UPSC', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'Indian Institute of Space Science and Technology (IIST)', location: 'Thiruvananthapuram', ranking: 'ISRO-affiliated', type: 'University' },
        { name: 'IIT Bombay/Madras', location: 'Various', ranking: 'Top Engineering School', type: 'IIT' }
      ],
      companies: [
        { name: 'ISRO (Various Centres)', sector: 'Defense & Public', hiring: 'Pan India' },
        { name: 'DRDO', sector: 'Defense & Public', hiring: 'R&D Labs' }
      ],
      faqs: [
        { question: 'Is the salary high?', answer: 'The salary is competitive (Level 10 of 7th CPC), but the benefits (pension, healthcare, housing) and prestige are what truly make the job valuable.' },
        { question: 'Can I apply after M.Tech?', answer: 'Yes, ISRO often recruits M.Tech graduates directly through internal channels or through GATE scores for specific positions.' }
      ]
    }
  },
  
  // --- Remaining Careers (Shortened for brevity but complete in code) ---
  
  {
    id: 'civil-eng', name: 'Civil Engineer', slug: 'civil-engineer', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Design, plan, and construct infrastructure (buildings, roads, bridges).', avgSalaryIndiaLPA: '5 - 14 LPA', growthRate: 'Medium', prerequisites: 'B.Tech in Civil Engineering', topCities: ['All Major Cities'], icon: '🏗️',
    detailedInfo: {
      overview: 'Civil Engineers are responsible for the public infrastructure of a nation—bridges, dams, buildings, airports, and water systems. Roles exist in government (PWD, Railways) and private construction.',
      personalityTraits: ['Practical', 'Planner', 'Responsible', 'Detail-Oriented', 'Problem Solver'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech/B.E. in Civil Engineering.', keyPoints: ['Master CAD and structural analysis software', 'Internships at construction sites (L&T, Afcons)', 'Clear JEE/State CETs'] },
        { phase: 'Post-Graduation', duration: '2 years', description: 'M.Tech in Structural/Transportation Engineering via GATE.', keyPoints: ['Clear GATE for PSU or M.Tech', 'Focus on Earthquake Engineering or Urban Planning'] }
      ],
      exams: [
        { name: 'GATE', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' },
        { name: 'UPSC ESE (Civil)', conducting: 'UPSC', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'IIT Delhi', location: 'New Delhi', ranking: 'Top Civil Engg', type: 'IIT' },
        { name: 'NIT Warangal', location: 'Warangal', ranking: 'Top NIT', type: 'NIT' }
      ],
      companies: [
        { name: 'Larsen & Toubro (L&T)', sector: 'Manufacturing & Core', hiring: 'Pan India' },
        { name: 'AFCONS Infrastructure', sector: 'Manufacturing & Core', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Is it only a government job?', answer: 'No, while PSUs and government bodies offer stability, major private infrastructure companies offer higher initial compensation and global projects.' }]
    }
  },
  {
    id: 'aero-eng', name: 'Aeronautical Engineer', slug: 'aeronautical-engineer', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Design and maintenance of aircraft and aerospace equipment.', avgSalaryIndiaLPA: '6 - 18 LPA', growthRate: 'High', prerequisites: 'B.Tech/M.Tech in Aeronautical/Aerospace', topCities: ['Bangalore', 'Hyderabad', 'Nashik'], icon: '✈️',
    detailedInfo: {
      overview: 'Aeronautical Engineers design, test, and maintain commercial and military aircraft, satellites, and missiles. The industry is highly niche, dominated by government research and defense organizations in India.',
      personalityTraits: ['Precise', 'Analytical', 'Innovative', 'Systematic', 'High Attention to Detail'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech in Aeronautical/Aerospace Engineering.', keyPoints: ['Clear JEE/BITSAT', 'Strong focus on fluid dynamics and propulsion', 'Internships at HAL/DRDO'] },
        { phase: 'Post-Graduation', duration: '2 years', description: 'M.Tech in relevant specialization (e.g., Propulsion or Structures).', keyPoints: ['Clear GATE', 'Focus on advanced computational techniques (CFD/FEM)'] }
      ],
      exams: [{ name: 'GATE', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'IIT Bombay', location: 'Mumbai', ranking: 'Top Aerospace', type: 'IIT' },
        { name: 'IIEST Shibpur', location: 'Howrah', ranking: 'Top College', type: 'College' }
      ],
      companies: [
        { name: 'Hindustan Aeronautics Limited (HAL)', sector: 'Defense & Public', hiring: 'Bangalore, Nasik' },
        { name: 'DRDO', sector: 'Defense & Public', hiring: 'R&D Labs' }
      ],
      faqs: [{ question: 'Is this only a government job?', answer: 'Primarily, yes. The core sector in India is state-controlled (HAL, ISRO, DRDO). However, MRO (Maintenance, Repair, and Overhaul) services offer private opportunities.' }]
    }
  },
  {
    id: 'electrical-eng', name: 'Electrical Engineer', slug: 'electrical-engineer', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Design, develop, and manage electrical control systems and power generation.', avgSalaryIndiaLPA: '5 - 15 LPA', growthRate: 'Medium', prerequisites: 'B.Tech in Electrical/Electronics', topCities: ['Pune', 'Vadodara', 'Kolkata'], icon: '⚡',
    detailedInfo: {
      overview: 'Electrical Engineers work on everything from power generation and transmission (Core sector) to designing circuitry and embedded systems (IT/Electronics sector). The field is critical for both old and new industries.',
      personalityTraits: ['Analytical', 'Systematic', 'Precise', 'Problem Solver', 'Safety Conscious'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech/B.E. in Electrical/EEE.', keyPoints: ['Master circuit analysis and power systems', 'Learn basic Python/C++', 'Internships at power generation companies (NTPC, PowerGrid)'] },
        { phase: 'Post-Graduation', duration: '2 years', description: 'M.Tech in Power Systems or VLSI via GATE.', keyPoints: ['Clear GATE for PSU or M.Tech', 'Focus on renewable energy integration and smart grids'] }
      ],
      exams: [{ name: 'GATE', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }, { name: 'UPSC ESE (Electrical)', conducting: 'UPSC', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'IIT Kanpur', location: 'Kanpur', ranking: 'Top Electrical Engg', type: 'IIT' },
        { name: 'NIT Rourkela', location: 'Rourkela', ranking: 'Top NIT', type: 'NIT' }
      ],
      companies: [
        { name: 'NTPC (National Thermal Power Corporation)', sector: 'Government & Public', hiring: 'Power Generation' },
        { name: 'Siemens', sector: 'Manufacturing & Core', hiring: 'Automation' }
      ],
      faqs: [{ question: 'What is the highest paid area in EE?', answer: 'Roles in specialized fields like VLSI design (Electronics) or high-voltage Power Systems (PSUs) are the highest paid.' }]
    }
  },
  {
    id: 'chef', name: 'Chef / Restaurateur', slug: 'chef', stream: 'Vocational', sector: 'Media & Design', shortDescription: 'Professional cook or manager of a hospitality business.', avgSalaryIndiaLPA: '4 - 15 LPA', growthRate: 'High', prerequisites: 'Hotel Management/Culinary Degree', topCities: ['Mumbai', 'Goa', 'Delhi'], icon: '👨‍🍳',
    detailedInfo: {
      overview: 'Culinary professionals work in hotels, restaurants, and catering to create innovative food experiences. Starting as a chef can lead to becoming a Restaurateur or Food Consultant.',
      personalityTraits: ['Creative', 'Passionate', 'Resilient', 'High-Energy', 'Hygienic'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3-4 years', description: 'B.Sc. in Hospitality & Hotel Administration.', keyPoints: ['Clear NCHMCT-JEE', 'Intensive practical kitchen training', 'Learn food cost and management'] },
        { phase: 'Apprenticeship', duration: '5 years', description: 'Start as Trainee/Commis Chef in a 5-star hotel.', keyPoints: ['Long working hours', 'Master different cuisines', 'Progress to Chef de Partie'] }
      ],
      exams: [{ name: 'NCHMCT-JEE', conducting: 'NTA', eligibility: '12th pass', frequency: 'Annual', difficulty: 'Medium' }],
      institutions: [
        { name: 'IHM Pusa', location: 'New Delhi', ranking: 'Top IHM', type: 'College' },
      ],
      companies: [
        { name: 'Taj Group of Hotels', sector: 'Consulting', hiring: 'Pan India' },
        { name: 'Oberoi Hotels', sector: 'Consulting', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Is the pay worth the hours?', answer: 'Initial pay is low, but Executive Chefs and those with their own restaurant chains command very high salaries. Passion is necessary to endure the early years.' }]
    }
  },
  {
    id: 'pilot', name: 'Commercial Pilot', slug: 'pilot', stream: 'Science', sector: 'Any', shortDescription: 'Fly passenger or cargo aircraft for commercial airlines.', avgSalaryIndiaLPA: '15 - 80 LPA', growthRate: 'High', prerequisites: '10+2 Science, CPL license, high investment', topCities: ['Delhi', 'Mumbai', 'Bangalore'], icon: '🧑‍✈️',
    detailedInfo: {
      overview: 'A Commercial Pilot flies for commercial airlines. This career offers immense travel opportunities and a very high salary, but requires significant financial investment (₹40-80 Lakhs) for training and licensing.',
      personalityTraits: ['Disciplined', 'Calm under pressure', 'Responsible', 'Logical', 'Physically Fit'],
      roadmap: [
        { phase: 'Pre-Licensing', duration: '6 months', description: '10+2 with PCM (Physics, Chemistry, Maths).', keyPoints: ['Clear the DGCA Class 1 and Class 2 medicals', 'Pass entrance exam for flying school'] },
        { phase: 'Training', duration: '1.5 years', description: 'Flying School (abroad or India) for CPL.', keyPoints: ['Complete 200 hours of flying time', 'Clear DGCA theory papers', 'Obtain Commercial Pilot License (CPL)'] },
        { phase: 'Job Entry', duration: '2 years', description: 'Type rating and job search.', keyPoints: ['Obtain type rating for a specific aircraft (e.g., Airbus A320)', 'Join an airline as a First Officer'] }
      ],
      exams: [{ name: 'DGCA Exams', conducting: 'DGCA', eligibility: '10+2', frequency: 'Multiple', difficulty: 'High' }],
      institutions: [
        { name: 'Indira Gandhi Rashtriya Uran Akademi (IGRUA)', location: 'Rae Bareli', ranking: 'Top Flying School', type: 'College' }
      ],
      companies: [
        { name: 'Air India', sector: 'Aviation', hiring: 'Pan India' },
        { name: 'IndiGo', sector: 'Aviation', hiring: 'Pan India' }
      ],
      faqs: [{ question: 'Is it expensive?', answer: 'Yes, pilot training costs between ₹40 to ₹80 Lakhs. Bank loans are available, but ensure job placement prospects are clear.' }]
    }
  },
  {
    id: 'curator', name: 'Museum Curator / Archivist', slug: 'curator', stream: 'Arts', sector: 'Education & Research', shortDescription: 'Manage and preserve historical, artistic, or cultural collections.', avgSalaryIndiaLPA: '4 - 10 LPA', growthRate: 'Low', prerequisites: 'M.A. History/Museology, NET qualified', topCities: ['Delhi', 'Kolkata, Chennai'], icon: '🏺',
    detailedInfo: {
      overview: 'Curators and Archivists manage historical artifacts, documents, and artworks in museums or government archives. This is a highly specialized academic career, often requiring post-graduate degrees and qualifying for government positions.',
      personalityTraits: ['Historical Minded', 'Detail-Oriented', 'Organized', 'Researcher', 'Preservationist'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.A. in History, Archaeology, or Fine Arts.', keyPoints: ['Maintain a high GPA', 'Volunteer at local museums'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.A. in Museology, Conservation, or Archival Studies.', keyPoints: ['Clear UGC NET/JRF', 'Focus on conservation techniques and cataloging'] }
      ],
      exams: [{ name: 'UGC NET (History/Museology)', conducting: 'NTA', eligibility: 'Master\'s Degree', frequency: 'Twice a year', difficulty: 'High' }],
      institutions: [
        { name: 'National Museum Institute', location: 'New Delhi', ranking: 'Top Institution', type: 'University' }
      ],
      companies: [
        { name: 'Archaeological Survey of India (ASI)', sector: 'Government & Public', hiring: 'Curators/Archivists' },
        { name: 'National Museum, Delhi', sector: 'Government & Public', hiring: 'Pan India' }
      ],
      faqs: [{ question: 'Are there many jobs?', answer: 'The number of jobs is limited and mostly concentrated in government-run museums and national archives. It is highly competitive for the few roles available.' }]
    }
  },
  {
    id: 'mgt-consult', name: 'Management Consultant', slug: 'management-consultant', stream: 'Any', sector: 'Consulting', shortDescription: 'Advise organizations on high-level strategic decisions and operations.', avgSalaryIndiaLPA: '18 - 50 LPA', growthRate: 'High', prerequisites: 'MBA from IIM/ISB, strong analytical skills', topCities: ['Mumbai', 'Bangalore', 'Gurgaon'], icon: '💡',
    detailedInfo: {
      overview: 'Management Consultants solve the biggest strategic challenges for CEOs and senior leaders across various industries. They advise on cost-cutting, market entry, and organizational redesign. This role is highly demanding, involving extensive travel and long hours.',
      personalityTraits: ['Analytical', 'Problem Solver', 'Communicator', 'Fast Learner', 'Structured'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech from IIT/NIT or Economics/BMS from top college.', keyPoints: ['Maintain exceptional GPA', 'Clear CAT/GMAT/XAT'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'MBA from a Tier 1 IIM or ISB.', keyPoints: ['Secure a pre-placement offer (PPO) during summer internship', 'Practice case interviews intensively'] },
        { phase: 'Career Progression', duration: 'Ongoing', description: 'Associate to Partner.', keyPoints: ['Work 70-80 hours per week', 'Travel extensively', 'Focus on rapid promotion cycles'] }
      ],
      exams: [{ name: 'CAT/XAT/GMAT', conducting: 'IIMs/XLRI/GMAC', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'IIM Ahmedabad', location: 'Ahmedabad', ranking: 'NIRF Rank 1', type: 'IIM' },
        { name: 'ISB', location: 'Hyderabad/Mohali', ranking: 'Top B-School', type: 'University' }
      ],
      companies: [
        { name: 'McKinsey & Company', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'Boston Consulting Group (BCG)', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'Bain & Company', sector: 'Consulting', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Is prior experience needed for MBA?', answer: 'Yes, most top consulting firms prefer candidates with 1-3 years of work experience before their MBA.' }, { question: 'What is a "case interview"?', answer: 'A case interview is a challenging Q&A session where you solve a real-life business problem given by the interviewer to test your analytical and structured thinking skills.' }]
    }
  },
  {
    id: 'hrm', name: 'HR Manager', slug: 'hr-manager', stream: 'Any', sector: 'Consulting', shortDescription: 'Manage employee relations, recruitment, and organizational policy.', avgSalaryIndiaLPA: '7 - 18 LPA', growthRate: 'Medium', prerequisites: 'MBA HR/PGDM from top B-School', topCities: ['All Major Cities'], icon: '🤝',
    detailedInfo: {
      overview: 'HR Managers oversee human capital, handling recruitment, training, compensation, employee relations, and policy compliance. The role is shifting towards strategic business partnering.',
      personalityTraits: ['Empathetic', 'Communicator', 'Ethical', 'Organized', 'Conflict Mediator'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'Any degree.', keyPoints: ['Gain exposure to organizational behavior courses', 'Prepare for CAT/XAT/TISSNET'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'MBA in HR/PGDM from a premier school (XLRI, TISS).', keyPoints: ['Clear TISSNET/XAT', 'Focus on Labour Law and Industrial Relations', 'Summer internship in an HR department'] }
      ],
      exams: [{ name: 'XAT', conducting: 'XLRI', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }, { name: 'TISSNET', conducting: 'TISS', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'XLRI Jamshedpur', location: 'Jamshedpur', ranking: 'Top HR School', type: 'College' },
        { name: 'TISS Mumbai', location: 'Mumbai', ranking: 'Top HR School', type: 'University' }
      ],
      companies: [
        { name: 'Reliance Industries', sector: 'Manufacturing & Core', hiring: 'Major Cities' },
        { name: 'Hindustan Unilever (HUL)', sector: 'FMCG', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Is an MBA from XLRI/TISS necessary?', answer: 'Yes, for a strategic HR career in a top MNC or blue-chip company, a specialized MBA/PGDM from a top HR school is highly recommended due to competition.' }]
    }
  },
  {
    id: 'biotech-researcher', name: 'Biotech Scientist / Researcher', slug: 'biotech-researcher', stream: 'Science', sector: 'Education & Research', shortDescription: 'Conduct research in genetics, medicine, and agricultural biotechnology.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'High', prerequisites: 'M.Sc. / Ph.D. in Biotechnology/Life Science, NET/GATE', topCities: ['Pune', 'Hyderabad', 'Bangalore'], icon: '🧬',
    detailedInfo: {
      overview: 'Biotech Scientists work on developing new drugs, modifying crops (GM technology), and advancing diagnostics using biological processes. Career paths lead to pharmaceuticals, R&D labs, and academia.',
      personalityTraits: ['Curious', 'Patient', 'Experimental', 'Analytical', 'Detail-Oriented'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech in Biotechnology or B.Sc. in Life Sciences.', keyPoints: ['Clear JEE/BITSAT (for B.Tech)', 'Focus on Molecular Biology and Genetics', 'Summer internships in labs (CSIR/ICMR)'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.Sc./M.Tech, typically via GATE/JAM.', keyPoints: ['Clear NET/JRF for Ph.D. scholarship', 'Lab experience and publications are critical'] }
      ],
      exams: [{ name: 'GATE (for M.Tech)', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }, { name: 'CSIR NET', conducting: 'NTA', eligibility: 'M.Sc.', frequency: 'Twice a year', difficulty: 'High' }],
      institutions: [
        { name: 'IIT Delhi', location: 'New Delhi', ranking: 'Top Bio-Tech', type: 'IIT' },
        { name: 'JNU', location: 'New Delhi', ranking: 'Top Research', type: 'University' }
      ],
      companies: [
        { name: 'Dr. Reddy\'s Labs', sector: 'Pharmaceuticals', hiring: 'R&D' },
        { name: 'Biocon', sector: 'Pharmaceuticals', hiring: 'Bangalore' }
      ],
      faqs: [{ question: 'Is Ph.D. necessary?', answer: 'Yes, a Ph.D. is almost mandatory to lead independent research projects and secure permanent scientist positions in government or industry R&D.' }]
    }
  },
  {
    id: 'supply-chain', name: 'Supply Chain Manager', slug: 'supply-chain', stream: 'Commerce', sector: 'Manufacturing & Core', shortDescription: 'Optimize logistics, procurement, and distribution of goods.', avgSalaryIndiaLPA: '7 - 18 LPA', growthRate: 'Medium', prerequisites: 'MBA Operations/Supply Chain, B.Tech preferred', topCities: ['Mumbai', 'Chennai', 'Gurgaon'], icon: '📦',
    detailedInfo: {
      overview: 'Supply Chain Managers oversee the entire flow of goods, from raw material procurement to final customer delivery. They minimize costs, improve efficiency, and ensure timely delivery. Roles exist across manufacturing, retail, and e-commerce.',
      personalityTraits: ['Organizer', 'Negotiator', 'Analytical', 'Problem Solver', 'Logistics Expert'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech/B.E. (Mechanical/Industrial) or B.Com/BBA.', keyPoints: ['Master inventory management basics', 'Strong data analysis skills'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'MBA in Operations/Supply Chain from IIM/NITIE.', keyPoints: ['Clear CAT/XAT', 'Focus on logistics and warehouse management', 'SCM certifications (APICS/ISM)'] }
      ],
      exams: [{ name: 'CAT/XAT', conducting: 'IIMs/XLRI', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }, { name: 'GMAT', conducting: 'GMAC', eligibility: 'Graduation', frequency: 'Ongoing', difficulty: 'High' }],
      institutions: [
        { name: 'NITIE (Now IIM Mumbai)', location: 'Mumbai', ranking: 'Top SCM School', type: 'IIM' }
      ],
      companies: [
        { name: 'Amazon', sector: 'E-commerce/Tech', hiring: 'Logistics' },
        { name: 'Maruti Suzuki', sector: 'Manufacturing & Core', hiring: 'Procurement/Logistics' }
      ],
      faqs: [{ question: 'Is a B.Tech required?', answer: 'Not strictly, but preferred for analytical roles in manufacturing. B.Com/BBA graduates with a specialized MBA are common in retail/e-commerce supply chain roles.' }]
    }
  },
  
  // The rest of the careers follow this complete, detailed structure.
  
  {
    id: 'interior-designer', name: 'Interior Designer', slug: 'interior-designer', stream: 'Vocational', sector: 'Media & Design', shortDescription: 'Plan and execute interior spaces for homes and commercial clients.', avgSalaryIndiaLPA: '4 - 12 LPA', growthRate: 'High', prerequisites: 'Diploma/B.Des in Interior Design', topCities: ['Delhi', 'Mumbai', 'Bangalore'], icon: '🛋️',
    detailedInfo: {
      overview: 'Interior Designers create functional and aesthetically pleasing interior spaces. The role involves client consultation, drafting floor plans, selecting materials, and project management during execution.',
      personalityTraits: ['Creative', 'Detail-Oriented', 'Communicator', 'Visual Thinker', 'Budget Conscious'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3-4 years', description: 'B.Des/B.A. in Interior Design or Architecture.', keyPoints: ['Clear NID/NATA exams (if aiming for B.Arch base)', 'Master AutoCAD, SketchUp, and rendering tools', 'Build a diverse portfolio'] },
        { phase: 'Skill Acquisition', duration: '1 year', description: 'Freelancing or apprenticeship.', keyPoints: ['Gain experience with materials and vendors (local markets)', 'Learn project budgeting and client management'] }
      ],
      exams: [{ name: 'NID DAT (Design)', conducting: 'NID', eligibility: '12th pass', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'School of Planning and Architecture (SPA)', location: 'New Delhi', ranking: 'Top Architecture', type: 'University' },
        { name: 'CEPT University', location: 'Ahmedabad', ranking: 'Top Architecture', type: 'University' }
      ],
      companies: [
        { name: 'Livspace/HomeLane', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'Architectural Firms', sector: 'Consulting', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Is a portfolio necessary?', answer: 'Yes, a professional portfolio of your best work, including sketches, models, and executed projects, is the single most important document for hiring.' }]
    }
  },
  {
    id: 'financial-risk', name: 'Financial Risk Manager (FRM)', slug: 'frm', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Specialist in identifying, analyzing, and mitigating financial risks.', avgSalaryIndiaLPA: '10 - 25 LPA', growthRate: 'High', prerequisites: 'FRM certification, MBA Finance', topCities: ['Mumbai', 'Bangalore'], icon: '🛡️',
    detailedInfo: {
      overview: 'FRMs specialize in managing credit risk, market risk, and operational risk for financial institutions (banks, investment firms). The certification is globally recognized and highly valued in the post-2008 regulatory environment.',
      personalityTraits: ['Analytical', 'Detail-Oriented', 'Risk-Averse', 'Ethical', 'Quantitative'],
      roadmap: [
        { phase: 'Foundation', duration: '3 years', description: 'B.Com, BBA, or B.Tech (quantitative focus).', keyPoints: ['Strong foundation in statistics and calculus', 'Basics of derivatives and fixed income'] },
        { phase: 'Certification', duration: '2 years', description: 'Clear FRM Part I and Part II exams (GARP).', keyPoints: ['Intense self-study or specialized coaching', 'Must clear both parts within 4 years'] }
      ],
      exams: [{ name: 'FRM Part I & II', conducting: 'GARP (Global Association of Risk Professionals)', eligibility: 'None', frequency: 'Ongoing', difficulty: 'High' }],
      institutions: [
        { name: 'IIMs (Finance Programs)', location: 'Various', ranking: 'Premier', type: 'IIM' }
      ],
      companies: [
        { name: 'HDFC Bank', sector: 'Finance & Accounting', hiring: 'Risk Management' },
        { name: 'Axis Bank', sector: 'Finance & Accounting', hiring: 'Risk Management' }
      ],
      faqs: [{ question: 'Is FRM better than CFA for risk?', answer: 'Yes, FRM is a dedicated risk management certification, whereas CFA is a broader investment management qualification. FRM is superior for roles purely focused on risk.' }]
    }
  },
  {
    id: 'equity-analyst', name: 'Equity Research Analyst', slug: 'equity-analyst', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Research and recommend stock investments for clients.', avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'Medium', prerequisites: 'MBA Finance/CFA Level 1+ required', topCities: ['Mumbai', 'Kolkata'], icon: '📉',
    detailedInfo: {
      overview: 'Equity Research Analysts study publicly traded companies, create detailed financial models, and issue buy/sell/hold recommendations on stocks. They are employed by brokerages, asset management firms, and investment banks.',
      personalityTraits: ['Analytical', 'Market-Savvy', 'Diligent', 'Predictive', 'Structured'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.Com, BBA, or B.A. Economics.', keyPoints: ['Learn valuation and financial statement analysis', 'Start following the stock market actively'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'MBA Finance from a reputed institute.', keyPoints: ['Clear CAT/XAT', 'Begin preparing for CFA Level I', 'Focus on industry analysis and sector mapping'] }
      ],
      exams: [{ name: 'CFA Level I & II', conducting: 'CFA Institute', eligibility: 'Graduation', frequency: 'Ongoing', difficulty: 'High' }],
      institutions: [
        { name: 'NMIMS Mumbai', location: 'Mumbai', ranking: 'Top Finance School', type: 'University' }
      ],
      companies: [
        { name: 'Motilal Oswal', sector: 'Finance & Accounting', hiring: 'Mumbai' },
        { name: 'ICICI Securities', sector: 'Finance & Accounting', hiring: 'Mumbai, Chennai' }
      ],
      faqs: [{ question: 'What software is essential?', answer: 'Proficiency in MS Excel (advanced modeling), Bloomberg Terminal/Reuters Eikon (market data), and basic knowledge of accounting software.' }]
    }
  },
  {
    id: 'bde', name: 'Business Development Executive (BDE)', slug: 'bde', stream: 'Any', sector: 'Consulting', shortDescription: 'Drive sales, forge partnerships, and expand market reach.', avgSalaryIndiaLPA: '4 - 10 LPA', growthRate: 'High', prerequisites: 'Any graduation, strong sales skills', topCities: ['All Major Cities'], icon: '🗣️',
    detailedInfo: {
      overview: 'BDEs are front-line sales and growth professionals responsible for identifying new market opportunities, building client relationships, and driving revenue. It is a target-driven role common in startups and IT services.',
      personalityTraits: ['Communicator', 'Persuasive', 'Goal-Oriented', 'Resilient', 'Energetic'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'Any degree (BBA/B.Com preferred).', keyPoints: ['Participate in college sales/marketing clubs', 'Develop strong negotiation skills'] },
        { phase: 'Entry Level', duration: '2 years', description: 'BDE or Sales Executive role.', keyPoints: ['Focus on lead generation and cold calling', 'Master CRM tools (Salesforce)', 'Achieve aggressive sales targets'] }
      ],
      exams: [{ name: 'None', conducting: 'N/A', eligibility: 'N/A', frequency: 'N/A', difficulty: 'Low' }],
      institutions: [{ name: 'Various Sales Training Academies', location: 'Online/Major Cities', ranking: 'Skill-based', type: 'College' }],
      companies: [
        { name: 'Byju\'s/Vedantu', sector: 'Education & Research', hiring: 'Sales/BD' },
        { name: 'IT Services Firms', sector: 'IT & Software', hiring: 'Client Acquisition' }
      ],
      faqs: [{ question: 'Is BDE a high-pressure job?', answer: 'Yes, it is highly target-driven. Performance directly affects your salary (via incentives/bonuses) and job security.' }]
    }
  },
  {
    id: 'game-dev', name: 'Game Developer', slug: 'game-dev', stream: 'Science', sector: 'IT & Software', shortDescription: 'Program and design interactive video games for various platforms.', avgSalaryIndiaLPA: '6 - 18 LPA', growthRate: 'High', prerequisites: 'B.Tech in CS, proficiency in Unity/Unreal Engine', topCities: ['Pune', 'Bangalore', 'Hyderabad'], icon: '🎮',
    detailedInfo: {
      overview: 'Game Developers program the core mechanics, AI, and graphics of video games. Roles include programmer, designer, and animator. The industry in India is rapidly growing, especially in mobile gaming.',
      personalityTraits: ['Creative', 'Technical', 'Problem Solver', 'Patience', 'Gamer'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech/B.E. in Computer Science or specialized Game Design course.', keyPoints: ['Master C++ and C#', 'Learn game engines (Unity/Unreal Engine)', 'Build simple game prototypes'] },
        { phase: 'Specialization', duration: '1 year', description: 'Mastering a niche (e.g., Graphics Programming or AI).', keyPoints: ['Create a compelling game portfolio', 'Internships at game studios'] }
      ],
      exams: [{ name: 'NID DAT (Visual Design)', conducting: 'NID', eligibility: '12th pass', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'NID', location: 'Ahmedabad', ranking: 'Top Design School', type: 'College' },
        { name: 'IIT Bombay (IDDC)', location: 'Mumbai', ranking: 'Top Design', type: 'IIT' }
      ],
      companies: [
        { name: 'Ubisoft India', sector: 'IT & Software', hiring: 'Major Cities' },
        { name: 'Nazara Games', sector: 'IT & Software', hiring: 'Mumbai' }
      ],
      faqs: [{ question: 'Is a CS degree required?', answer: 'Not mandatory, but highly recommended for programmer roles. Designers and artists can come from Arts/Design backgrounds with a strong portfolio.' }]
    }
  },
  {
    id: 'data-engineer', name: 'Data Engineer', slug: 'data-engineer', stream: 'Science', sector: 'IT & Software', shortDescription: 'Build and maintain data pipelines for ML/BI teams.', avgSalaryIndiaLPA: '12 - 28 LPA', growthRate: 'High', prerequisites: 'B.Tech CS, expertise in distributed systems (Hadoop, Spark)', topCities: ['Bangalore', 'Hyderabad'], icon: '⚙️',
    detailedInfo: {
      overview: 'Data Engineers are responsible for creating and optimizing the infrastructure (pipelines, warehouses, ETL processes) that allows data scientists and analysts to access high-quality, reliable data.',
      personalityTraits: ['Systematic', 'Infrastructure-Focused', 'Problem Solver', 'Technical', 'Reliable'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech in Computer Science.', keyPoints: ['Master SQL and Python/Scala', 'Familiarity with Cloud databases', 'Clear JEE/BITSAT'] },
        { phase: 'Experience', duration: '3 years', description: 'Work as a Software Engineer, pivoting to infrastructure.', keyPoints: ['Master distributed systems (Spark, Hadoop)', 'Cloud data certifications (AWS Data Analytics/Azure Data Engineer)'] }
      ],
      exams: [{ name: 'GATE', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'IIT Kharagpur', location: 'Kharagpur', ranking: 'Top Data Engg', type: 'IIT' }
      ],
      companies: [
        { name: 'Ola', sector: 'Technology', hiring: 'Bangalore' },
        { name: 'Flipkart', sector: 'E-commerce/Tech', hiring: 'Bangalore' }
      ],
      faqs: [{ question: 'How is it different from Data Scientist?', answer: 'Data Engineer focuses on *data infrastructure* (getting the data ready). Data Scientist focuses on *data analysis* (using the ready data to build models).' }]
    }
  },
  {
    id: 'hospital-mgt', name: 'Hospital Administrator', slug: 'hospital-administrator', stream: 'Any', sector: 'Healthcare', shortDescription: 'Manage the operations and strategic planning of healthcare facilities.', avgSalaryIndiaLPA: '7 - 15 LPA', growthRate: 'Medium', prerequisites: 'MBA Hospital Management/Health Administration', topCities: ['All Major Cities'], icon: '🏥',
    detailedInfo: {
      overview: 'Hospital Administrators manage the non-clinical, business side of healthcare facilities. They handle budgets, HR, procurement, and ensure the hospital meets legal and regulatory standards.',
      personalityTraits: ['Leader', 'Organized', 'Communicator', 'Ethical', 'Business Minded'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'Any graduation (Science or BHA preferred).', keyPoints: ['Volunteer at hospitals', 'Prepare for management entrance exams (CAT/MAT/CMAT)'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'MBA in Hospital Management/Health Administration.', keyPoints: ['Focus on healthcare policy and operations management', 'Hospital administration internship'] }
      ],
      exams: [{ name: 'CAT/MAT/CMAT', conducting: 'IIMs/AIMA/NTA', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }, { name: 'TISSNET', conducting: 'TISS', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'AIIMS Delhi (MHA)', location: 'New Delhi', ranking: 'Top Institution', type: 'AIIMS' },
        { name: 'TISS Mumbai', location: 'Mumbai', ranking: 'Top HR/Social School', type: 'University' }
      ],
      companies: [
        { name: 'Apollo Hospitals', sector: 'Healthcare', hiring: 'Management' },
        { name: 'Max Healthcare', sector: 'Healthcare', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Is a medical background needed?', answer: 'No, but highly beneficial. Many top administrators are non-medical graduates with MBAs. Doctors often transition into this role after an MHA.' }]
    }
  },
  {
    id: 'public-relations', name: 'Public Relations (PR) Specialist', slug: 'pr-specialist', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Manage public image and communication between clients and media.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'Medium', prerequisites: 'Mass Comm./PR degree', topCities: ['Mumbai', 'Delhi'], icon: '📢',
    detailedInfo: {
      overview: 'PR Specialists manage the reputation and public image of clients (individuals, companies, or governments). They write press releases, handle media queries, and manage crises.',
      personalityTraits: ['Communicator', 'Networker', 'Crisis Manager', 'Articulate', 'Creative'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.A. in Mass Communication or Public Relations.', keyPoints: ['Strong writing and verbal skills', 'Internships at PR agencies'] },
        { phase: 'Post-Graduate', duration: '1-2 years', description: 'P.G. Diploma or M.A. in PR/Corporate Communication.', keyPoints: ['Master media relations and digital PR', 'Build a professional network'] }
      ],
      exams: [{ name: 'IIMC Entrance Exam', conducting: 'IIMC', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'Medium' }],
      institutions: [
        { name: 'Xavier Institute of Communications (XIC)', location: 'Mumbai', ranking: 'Top P.G. Diploma', type: 'College' }
      ],
      companies: [
        { name: 'Edelman India', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'Aditya Birla Group', sector: 'Consulting', hiring: 'Corporate Communication' }
      ],
      faqs: [{ question: 'What is a typical workday like?', answer: 'Fast-paced, involving writing press releases, scheduling media interviews, tracking news coverage, and coordinating with clients and journalists.' }]
    }
  },
  {
    id: 'fashion-designer', name: 'Fashion Designer', slug: 'fashion-designer', stream: 'Vocational', sector: 'Media & Design', shortDescription: 'Create original clothing and accessory designs.', avgSalaryIndiaLPA: '4 - 15 LPA', growthRate: 'Medium', prerequisites: 'NIFT/NID degree', topCities: ['Delhi', 'Mumbai'], icon: '👗',
    detailedInfo: {
      overview: 'Fashion Designers research trends, sketch designs, select fabrics, and oversee garment production. Success depends heavily on creativity, technical sewing/pattern skills, and market knowledge.',
      personalityTraits: ['Creative', 'Trend-Aware', 'Technical', 'Detail-Oriented', 'Hands-on'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Des in Fashion Design.', keyPoints: ['Clear NIFT/NID entrance exams', 'Master pattern making and garment construction', 'Build a strong design portfolio'] },
        { phase: 'Experience', duration: '5 years', description: 'Start as an Assistant Designer.', keyPoints: ['Work in export houses or designer studios', 'Develop technical expertise in sourcing and production'] }
      ],
      exams: [{ name: 'NIFT Entrance Exam', conducting: 'NIFT', eligibility: '12th pass', frequency: 'Annual', difficulty: 'High' }, { name: 'NID DAT', conducting: 'NID', eligibility: '12th pass', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'National Institute of Fashion Technology (NIFT)', location: 'New Delhi', ranking: 'Top Institution', type: 'College' },
        { name: 'NID', location: 'Ahmedabad', ranking: 'Top Institution', type: 'College' }
      ],
      companies: [
        { name: 'Reliance Retail', sector: 'Manufacturing & Core', hiring: 'Design teams' },
        { name: 'Designer Labels (Sabyasachi, Manish Malhotra)', sector: 'Boutique', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Is the competition fierce?', answer: 'Extremely. The market is saturated. Success often comes to those who blend unique creativity with strong business and manufacturing knowledge.' }]
    }
  },
  {
    id: 'mba-general', name: 'MBA Generalist (IIM)', slug: 'mba-generalist', stream: 'Any', sector: 'Consulting', shortDescription: 'General management role, often leading to top corporate positions.', avgSalaryIndiaLPA: '15 - 35 LPA', growthRate: 'High', prerequisites: 'Graduation, CAT score, IIM/Top B-School admission', topCities: ['Mumbai', 'Bangalore', 'Gurgaon'], icon: '📈',
    detailedInfo: {
      overview: 'A generalist MBA from a top-tier school (IIMs, FMS) trains you for senior leadership roles in strategy, marketing, finance, or operations across any industry. The high entry barrier is rewarded with excellent placement and rapid growth.',
      personalityTraits: ['Strategic', 'Leader', 'Analytical', 'Communicator', 'Quick Learner'],
      roadmap: [
        { phase: 'Preparation', duration: '1 year', description: 'Dedicated preparation for management entrance exams.', keyPoints: ['Clear CAT/XAT (99+ percentile)', 'Build a strong profile (academics, extra-curriculars, work experience)'] },
        { phase: 'MBA', duration: '2 years', description: 'Full-time MBA/PGDM.', keyPoints: ['Intensive summer internship', 'Networking with alumni', 'Focus on case study method and group projects'] }
      ],
      exams: [{ name: 'CAT', conducting: 'IIMs', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }, { name: 'XAT', conducting: 'XLRI', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'IIM Ahmedabad', location: 'Ahmedabad', ranking: 'NIRF Rank 1', type: 'IIM' },
        { name: 'IIM Bangalore', location: 'Bangalore', ranking: 'NIRF Rank 2', type: 'IIM' }
      ],
      companies: [
        { name: 'Bain & Company', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'Procter & Gamble (P&G)', sector: 'FMCG', hiring: 'Leadership Roles' }
      ],
      faqs: [{ question: 'Is work experience mandatory?', answer: 'For the top IIMs, 1-3 years of relevant work experience is highly beneficial for securing admission and top placements.' }]
    }
  },
  {
    id: 'market-research', name: 'Market Research Analyst', slug: 'market-research', stream: 'Commerce', sector: 'Consulting', shortDescription: 'Analyze markets, identify trends, and advise companies on product strategy.', avgSalaryIndiaLPA: '6 - 14 LPA', growthRate: 'Medium', prerequisites: 'MBA Marketing/Research, strong analytical skills', topCities: ['Pune', 'Mumbai', 'Bangalore'], icon: '🔍',
    detailedInfo: {
      overview: 'Market Research Analysts study consumer behavior, market size, and competition to advise companies on the viability of new products or services. This is a data-intensive role, crucial for marketing strategy.',
      personalityTraits: ['Analytical', 'Curious', 'Statistical', 'Communicator', 'Trend-Aware'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'BBA/B.Com/B.A. Economics.', keyPoints: ['Master survey design and data collection methods', 'Basic knowledge of statistics software (SPSS)'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'MBA Marketing or specialization in Research.', keyPoints: ['Focus on quantitative analysis and consumer psychology', 'Internships at research firms'] }
      ],
      exams: [{ name: 'CAT/XAT', conducting: 'IIMs/XLRI', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'MICA Ahmedabad', location: 'Ahmedabad', ranking: 'Top Marketing School', type: 'College' }
      ],
      companies: [
        { name: 'Nielsen India', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'Kantar', sector: 'Consulting', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'What skills matter most?', answer: 'Statistical software proficiency, the ability to translate complex data into simple, actionable business reports, and strong presentation skills.' }]
    }
  },
  {
    id: 'bank-clerk', name: 'Bank Clerk / Assistant', slug: 'bank-clerk', stream: 'Any', sector: 'Government & Public', shortDescription: 'Front office and clerical duties in public sector banks.', avgSalaryIndiaLPA: '3 - 6 LPA', growthRate: 'Low', prerequisites: 'Graduation in any stream, clear IBPS/SBI Clerk exams', topCities: ['Pan India'], icon: '💳',
    detailedInfo: {
      overview: 'Bank Clerks (or Junior Associates) handle customer transactions, cash management, account opening, and front-office duties. This is a stable, entry-level government job with fixed hours, focused on localized service.',
      personalityTraits: ['Detail-Oriented', 'Polite', 'Quick Calculator', 'Patient', 'Responsible'],
      roadmap: [
        { phase: 'Preparation', duration: '6 months', description: 'Dedicated preparation for Clerical exams.', keyPoints: ['Focus on Quantitative Aptitude, Reasoning, and English', 'Master speed maths techniques', 'Practice current affairs related to banking'] },
        { phase: 'Exam Cycle', duration: '4 months', description: 'Clear Prelims and Mains exams.', keyPoints: ['High accuracy is paramount', 'Focus on computer aptitude and general awareness for Mains'] }
      ],
      exams: [{ name: 'IBPS Clerk', conducting: 'IBPS', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'Medium' }, { name: 'SBI Clerk', conducting: 'SBI', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'Medium' }],
      institutions: [{ name: 'IBPS', location: 'Mumbai', ranking: 'Recruitment Body', type: 'University' }],
      companies: [
        { name: 'State Bank of India', sector: 'Government & Public', hiring: 'Pan India' },
        { name: 'Bank of Baroda', sector: 'Government & Public', hiring: 'Pan India' }
      ],
      faqs: [{ question: 'How is the career path compared to PO?', answer: 'Clerical roles have slower progression than POs, but promotional exams are available to reach Officer level after 3-5 years.' }]
    }
  },
  {
    id: 'forensic-scientist', name: 'Forensic Scientist', slug: 'forensic-scientist', stream: 'Science', sector: 'Law & Legal', shortDescription: 'Apply scientific principles to criminal investigation.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'Medium', prerequisites: 'M.Sc. in Forensic Science', topCities: ['State FSLs'], icon: '🔬',
    detailedInfo: {
      overview: 'Forensic Scientists analyze physical evidence (DNA, fingerprints, ballistics) collected at crime scenes and present their findings as expert witnesses in court. Most jobs are in government Forensic Science Laboratories (FSLs).',
      personalityTraits: ['Analytical', 'Objective', 'Detail-Oriented', 'Ethical', 'Scientific'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.Sc. in Forensic Science, Chemistry, or Biology.', keyPoints: ['Strong foundation in lab techniques', 'Internships at FSLs'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.Sc. in Forensic Science (mandatory for most jobs).', keyPoints: ['Specialization in questioned documents or digital forensics', 'Clear NET/GATE for research or teaching'] }
      ],
      exams: [{ name: 'UGC NET (Forensic Science)', conducting: 'NTA', eligibility: 'M.Sc.', frequency: 'Twice a year', difficulty: 'High' }],
      institutions: [
        { name: 'Gujarat Forensic Sciences University (GFSU)', location: 'Gandhinagar', ranking: 'Top FSL', type: 'University' }
      ],
      companies: [
        { name: 'State Forensic Science Labs', sector: 'Government & Public', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Is this a high-risk job?', answer: 'It is a low-risk, lab-based job. The primary pressure comes from presenting accurate, objective evidence in high-stakes court cases.' }]
    }
  },
  {
    id: 'urban-planner', name: 'Urban & Regional Planner', slug: 'urban-planner', stream: 'Arts', sector: 'Manufacturing & Core', shortDescription: 'Design communities, transport networks, and land use policies.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'Medium', prerequisites: 'B.Plan/M.Plan degree', topCities: ['New Delhi', 'Chennai'], icon: '🏙️',
    detailedInfo: {
      overview: 'Urban Planners design the physical layout of cities, balancing economic, environmental, and social needs. They create master plans for land use, housing, transportation, and public services.',
      personalityTraits: ['Visionary', 'Analytical', 'Planner', 'Communicator', 'Sustainable'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Plan (Bachelor of Planning).', keyPoints: ['Clear JEE Main Paper 2/NATA', 'Master GIS software and drafting tools', 'Internships with development authorities'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.Plan in Urban Planning/Housing/Transport.', keyPoints: ['Focus on public policy and large-scale development projects', 'Clear GATE (optional)'] }
      ],
      exams: [{ name: 'NATA', conducting: 'CoA', eligibility: '12th pass', frequency: 'Annual', difficulty: 'Medium' }, { name: 'JEE Main Paper 2 (B.Arch/B.Plan)', conducting: 'NTA', eligibility: '12th pass', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'School of Planning and Architecture (SPA)', location: 'New Delhi', ranking: 'Top Institution', type: 'University' }
      ],
      companies: [
        { name: 'DDA (Delhi Development Authority)', sector: 'Government & Public', hiring: 'Planners' },
        { name: 'TATA Consulting Engineers', sector: 'Consulting', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Do I need an Architecture background?', answer: 'Not mandatory, but many M.Plan students come from B.Arch. B.Plan is the direct, preferred route.' }]
    }
  },
  {
    id: 'defence-officer', name: 'Defence Officer (Army/Navy/Air Force)', slug: 'defence-officer', stream: 'Any', sector: 'Defense & Public', shortDescription: 'Commissioned officer in the Indian Armed Forces.', avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'Medium', prerequisites: 'NDA/CDS cleared, Graduation', topCities: ['Military Bases'], icon: '🎖️',
    detailedInfo: {
      overview: 'Commissioned Officers lead men and women in the Indian Armed Forces. This career offers immense honor, responsibility, and an unparalleled lifestyle, with entry through NDA (after 12th) or CDS (after graduation).',
      personalityTraits: ['Leader', 'Brave', 'Disciplined', 'Patriotic', 'Decision Maker'],
      roadmap: [
        { phase: 'Entry (10+2)', duration: '4 years', description: 'Clear NDA exam and training at NDA Pune.', keyPoints: ['Clear UPSC NDA written exam', 'Pass the rigorous 5-day SSB (Service Selection Board) interview', '3 years at NDA, then 1 year at respective academy'] },
        { phase: 'Entry (Graduation)', duration: '1.5 years', description: 'Clear CDS exam and training at IMA/OTA/AFA/INA.', keyPoints: ['Clear UPSC CDS written exam', 'Pass SSB interview', 'Training at the chosen academy'] }
      ],
      exams: [{ name: 'UPSC NDA', conducting: 'UPSC', eligibility: '10+2', frequency: 'Twice a year', difficulty: 'High' }, { name: 'UPSC CDS', conducting: 'UPSC', eligibility: 'Graduation', frequency: 'Twice a year', difficulty: 'High' }],
      institutions: [
        { name: 'National Defence Academy (NDA)', location: 'Pune', ranking: 'Premier Training', type: 'College' }
      ],
      companies: [
        { name: 'Indian Army', sector: 'Defense & Public', hiring: 'Pan India' },
        { name: 'Indian Navy', sector: 'Defense & Public', hiring: 'Naval Bases' }
      ],
      faqs: [{ question: 'What is the most challenging stage?', answer: 'The 5-day Service Selection Board (SSB) interview is the most rigorous, testing your Officer Like Qualities (OLQs) through various psychological and group tasks.' }]
    }
  },
  {
    id: 'environmental-sci', name: 'Environmental Scientist', slug: 'environmental-sci', stream: 'Science', sector: 'Education & Research', shortDescription: 'Study environmental issues and develop solutions for sustainability.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'High', prerequisites: 'M.Sc. Environmental Science', topCities: ['Pune', 'Bangalore', 'Research Institutes'], icon: '🌿',
    detailedInfo: {
      overview: 'Environmental Scientists investigate pollution, climate change, and biodiversity loss. They develop mitigation strategies for government, industry, and NGOs, playing a key role in sustainability efforts.',
      personalityTraits: ['Analytical', 'Ethical', 'Field-Oriented', 'Advocate', 'Curious'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.Sc. in Environmental Science, Chemistry, or Botany.', keyPoints: ['Fieldwork and lab exposure', 'Strong chemistry/biology foundation'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.Sc. in Environmental Science or Policy.', keyPoints: ['Clear GATE/NET', 'Focus on remote sensing (GIS) and EIA (Environmental Impact Assessment)'] }
      ],
      exams: [{ name: 'GATE/CSIR NET', conducting: 'IITs/NTA', eligibility: 'M.Sc.', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'TERI School of Advanced Studies', location: 'New Delhi', ranking: 'Top Institution', type: 'University' }
      ],
      companies: [
        { name: 'CPCB (Central Pollution Control Board)', sector: 'Government & Public', hiring: 'Scientists' },
        { name: 'Environmental Consulting Firms', sector: 'Consulting', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'Where are the jobs concentrated?', answer: 'Jobs are concentrated in state pollution control boards (government) and private consulting firms that advise companies on environmental compliance and sustainability.' }]
    }
  },
  {
    id: 'auditor-govt', name: 'Government Auditor (CAG/SSC)', slug: 'govt-auditor', stream: 'Commerce', sector: 'Government & Public', shortDescription: 'Audit government accounts and financial transactions.', avgSalaryIndiaLPA: '6 - 12 LPA', growthRate: 'Medium', prerequisites: 'Graduation, SSC CGL/Auditor exam', topCities: ['Pan India'], icon: '🔎',
    detailedInfo: {
      overview: 'Government Auditors (e.g., in the CAG office or various ministries) ensure the proper and efficient use of public funds. This job offers strong job security and is an excellent entry point into the central government administration.',
      personalityTraits: ['Detail-Oriented', 'Ethical', 'Analytical', 'Rule-Follower', 'Responsible'],
      roadmap: [
        { phase: 'Preparation', duration: '1 year', description: 'Dedicated preparation for SSC CGL (AAO/Auditor posts) or Railway/Defense Audit exams.', keyPoints: ['Focus on Accounts, General Studies, and Quantitative Aptitude', 'Mastering the Tier II difficulty level'] }
      ],
      exams: [{ name: 'SSC CGL (AAO/Auditor)', conducting: 'SSC', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }],
      institutions: [{ name: 'SSC', location: 'New Delhi (HQ)', ranking: 'Recruitment Body', type: 'University' }],
      companies: [
        { name: 'Comptroller and Auditor General (CAG)', sector: 'Government & Public', hiring: 'Auditor' }
      ],
      faqs: [{ question: 'How is the work-life balance?', answer: 'Excellent. Government auditing roles typically have fixed hours (9-5) and offer a much better work-life balance than corporate auditing.' }]
    }
  },
  {
    id: 'media-producer', name: 'Media Producer / Director', slug: 'media-producer', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Oversee and manage the production of television or film projects.', avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'Medium', prerequisites: 'Film school degree, experience', topCities: ['Mumbai', 'Chennai'], icon: '🎬',
    detailedInfo: {
      overview: 'Media Producers/Directors oversee all aspects of a video project, from creative vision and script to budgeting and final execution. This requires a strong mix of artistic and managerial skills.',
      personalityTraits: ['Visionary', 'Leader', 'Creative', 'Budget Conscious', 'Problem Solver'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3 years', description: 'B.A. Mass Communication or Film Studies.', keyPoints: ['Clear FTII/SRFTI entrance exams (if desired)', 'Learn budgeting and production management', 'Direct short films/web series'] },
        { phase: 'Experience', duration: '5 years', description: 'Start as an Assistant Director or Production Coordinator.', keyPoints: ['Master scheduling and logistics', 'Develop a strong network of writers, actors, and crew'] }
      ],
      exams: [{ name: 'FTII JET', conducting: 'FTII', eligibility: 'Graduation', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'Film and Television Institute of India (FTII)', location: 'Pune', ranking: 'Premier Film School', type: 'College' }
      ],
      companies: [
        { name: 'Balaji Telefilms', sector: 'Media & Design', hiring: 'Mumbai' },
        { name: 'Netflix/Amazon Studios', sector: 'Media & Design', hiring: 'Content Partnerships' }
      ],
      faqs: [{ question: 'Is networking the most important thing?', answer: 'Yes. In the media industry, your network is your net worth. Connecting with peers and industry veterans is crucial for landing projects.' }]
    }
  },
  {
    id: 'patent-attorney', name: 'Patent Attorney', slug: 'patent-attorney', stream: 'Science', sector: 'Law & Legal', shortDescription: 'Specialist in intellectual property (IP) law, focusing on patents.', avgSalaryIndiaLPA: '10 - 30 LPA', growthRate: 'High', prerequisites: 'B.Tech/M.Sc. + LLB + Patent Agent Exam', topCities: ['Bangalore', 'New Delhi'], icon: '©️',
    detailedInfo: {
      overview: 'Patent Attorneys protect new inventions by drafting, filing, and litigating patent applications. This career uniquely requires a technical/science background (B.Tech/M.Sc.) combined with a law degree (LLB).',
      personalityTraits: ['Technical', 'Legal Minded', 'Detail-Oriented', 'Researcher', 'Analytical'],
      roadmap: [
        { phase: 'Technical UG', duration: '4 years', description: 'B.Tech in Engineering or M.Sc. in Science.', keyPoints: ['Must maintain strong technical knowledge', 'Start preparing for Patent Agent Exam'] },
        { phase: 'Legal PG', duration: '3 years', description: 'LLB (Bachelor of Law) or integrated B.Tech+LLB.', keyPoints: ['Focus on Intellectual Property Law', 'Clear the Patent Agent Examination (CPA)'] }
      ],
      exams: [{ name: 'Patent Agent Exam (CPA)', conducting: 'Indian Patent Office', eligibility: 'Science/Engg Degree', frequency: 'Annual (varies)', difficulty: 'Medium' }],
      institutions: [
        { name: 'IIT Kharagpur (IPR Law School)', location: 'Kharagpur', ranking: 'Top Institution', type: 'IIT' }
      ],
      companies: [
        { name: 'C.P.A. Global', sector: 'Law & Legal', hiring: 'IP Services' },
        { name: 'Law Firms (e.g., Khaitan & Co.)', sector: 'Law & Legal', hiring: 'IP Practice' }
      ],
      faqs: [{ question: 'Is the salary high?', answer: 'Extremely high. Specialized knowledge at the intersection of law and technology is a rare commodity, commanding premium salaries in the private sector.' }]
    }
  },
  {
    id: 'food-scientist', name: 'Food Scientist / Technologist', slug: 'food-scientist', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Develop new food products and ensure food safety and quality control.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'Medium', prerequisites: 'B.Tech Food Technology', topCities: ['Pune', 'Hyderabad'], icon: '🍚',
    detailedInfo: {
      overview: 'Food Scientists work in R&D and Quality Assurance (QA) for food processing companies. They develop new recipes, ensure mass-produced food is safe, nutritious, and meets regulatory standards (FSSAI).',
      personalityTraits: ['Scientific', 'Innovator', 'Detail-Oriented', 'Experimental', 'Hygienic'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech in Food Technology or Dairy Technology.', keyPoints: ['Clear JEE/State CETs', 'Focus on food chemistry and microbiology', 'Internships at food processing plants'] },
        { phase: 'Post-Graduate', duration: '2 years', description: 'M.Tech Food Technology via GATE.', keyPoints: ['Specialization in fermentation or post-harvest technology', 'Clear GATE for research/PSU jobs'] }
      ],
      exams: [{ name: 'ICAR AIEEA (Food Tech)', conducting: 'NTA', eligibility: '12th pass (PCB/PCM)', frequency: 'Annual', difficulty: 'Medium' }, { name: 'GATE', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }],
      institutions: [
        { name: 'National Institute of Food Technology, Entrepreneurship and Management (NIFTEM)', location: 'Haryana', ranking: 'Top Institution', type: 'University' }
      ],
      companies: [
        { name: 'Nestlé India', sector: 'Manufacturing & Core', hiring: 'R&D/QA' },
        { name: 'Britannia', sector: 'Manufacturing & Core', hiring: 'Major Cities' }
      ],
      faqs: [{ question: 'What is the role of FSSAI?', answer: 'FSSAI (Food Safety and Standards Authority of India) regulates all food manufacturing. Food Scientists must ensure their products and plants meet FSSAI guidelines.' }]
    }
  },
  {
    id: 'hotel-mgt', name: 'Hotel Manager', slug: 'hotel-manager', stream: 'Vocational', sector: 'Consulting', shortDescription: 'Manage all operations of a large hotel or resort.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'Medium', prerequisites: 'Hotel Management degree (NCHMCT-JEE)', topCities: ['Metro Cities', 'Tourism Hubs'], icon: '🛎️',
    detailedInfo: {
      overview: 'Hotel Managers oversee all guest services, operations, finance, and human resources within a hotel property. It is a demanding but highly customer-centric leadership role in the hospitality industry.',
      personalityTraits: ['Communicator', 'Leader', 'Service-Oriented', 'Problem Solver', 'Polite'],
      roadmap: [
        { phase: 'Undergraduate', duration: '3-4 years', description: 'B.Sc. in Hospitality & Hotel Administration.', keyPoints: ['Clear NCHMCT-JEE', 'Compulsory industrial training in F&B, Front Office, etc.', 'Focus on leadership and customer service'] },
        { phase: 'Entry Level', duration: '5 years', description: 'Management Trainee to Assistant Manager.', keyPoints: ['Learn operations from the ground up (long hours)', 'Master budgeting and guest relationship management'] }
      ],
      exams: [{ name: 'NCHMCT-JEE', conducting: 'NTA', eligibility: '12th pass', frequency: 'Annual', difficulty: 'Medium' }],
      institutions: [
        { name: 'IHM Pusa (New Delhi)', location: 'New Delhi', ranking: 'Top IHM', type: 'College' }
      ],
      companies: [
        { name: 'Taj Group of Hotels', sector: 'Consulting', hiring: 'Major Cities' },
        { name: 'Marriott International', sector: 'Consulting', hiring: 'Pan India' }
      ],
      faqs: [{ question: 'Is the work-life balance difficult?', answer: 'Yes, especially in the early years. Hospitality is a 24/7 industry. Managers often work late nights, weekends, and holidays.' }]
    }
  }
];

// --- QUIZ QUESTIONS (Updated to reflect new categories) ---
const quizQuestions: QuizQuestion[] = [
  { id: 1, question: 'I enjoy solving complex mathematical problems and logical puzzles', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'analytical' },
  { id: 2, question: 'I like helping people and feel satisfied when I make a difference in their lives', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'social' },
  { id: 3, question: 'I am comfortable with public speaking and making formal presentations', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'communication' },
  { id: 4, question: 'I prefer working with computers, programming, and cutting-edge technology', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'technical' },
  { id: 5, question: 'I enjoy creating visual designs, artistic content, or writing stories/articles', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'creative' },
  { id: 6, question: 'I am good at managing finances, budgeting, and understanding business processes', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'business' },
  { id: 7, question: 'I like understanding how machines, engines, or physical structures work mechanically', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'core_eng' },
  { id: 8, question: 'I am detail-oriented and like ensuring rules, compliance, and procedures are followed', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'compliance' },
  { id: 9, question: 'I want to serve the public, enforce laws, and work directly for a government body', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'government' },
  { id: 10, question: 'I enjoy learning about biology, human anatomy, and life sciences research', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], category: 'science' }
];

// Main App Component
const CareerPortal = () => {
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'career-detail' | 'quiz' | 'quiz-result'>('home');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState<Stream>('Any');
  const [filterSector, setFilterSector] = useState<Sector | 'All'>('All'); // New State
  const [filterGrowth, setFilterGrowth] = useState<'All' | 'High' | 'Medium' | 'Low'>('All'); // New State
  const [filterSalary, setFilterSalary] = useState<'All' | '3-8' | '8-15' | '15+'>('All'); // New State
  const [showFilters, setShowFilters] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
  const navigate = useNavigate();

  // --- ENHANCED FILTERING LOGIC ---
  const filteredCareers = useMemo(() => {
    return careers.filter(career => {
      // 1. Search Filtering
      const matchesSearch = career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Stream Filtering
      const matchesStream = filterStream === 'Any' || career.stream === filterStream;

      // 3. Sector Filtering
      const matchesSector = filterSector === 'All' || career.sector === filterSector;

      // 4. Growth Rate Filtering
      const matchesGrowth = filterGrowth === 'All' || career.growthRate === filterGrowth;

      // 5. Salary Range Filtering
      const matchesSalary = (() => {
        if (filterSalary === 'All') return true;
        const minSalaryLPA = getMinSalary(career.avgSalaryIndiaLPA);
        
        switch (filterSalary) {
          case '3-8': return minSalaryLPA >= 3 && minSalaryLPA <= 8;
          case '8-15': return minSalaryLPA >= 8 && minSalaryLPA <= 15;
          case '15+': return minSalaryLPA >= 15;
          default: return true;
        }
      })();
      
      return matchesSearch && matchesStream && matchesSector && matchesGrowth && matchesSalary;
    });
  }, [searchTerm, filterStream, filterSector, filterGrowth, filterSalary]);
  // --- END ENHANCED FILTERING LOGIC ---


  const handleCareerClick = (career: Career) => {
    setSelectedCareer(career);
    setActiveView('career-detail');
    scroll(0,0);
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
      // Simple scoring: 2 points for Strongly Agree, 1 point for Agree
      const scores = { analytical: 0, social: 0, technical: 0, creative: 0, business: 0, compliance: 0, core_eng: 0, government: 0, science: 0 };
      
      quizQuestions.forEach((q, idx) => {
        const answer = newAnswers[idx];
        const scoreIncrement = answer === 'Strongly Agree' ? 2 : answer === 'Agree' ? 1 : 0;
        // @ts-ignore
        scores[q.category] += scoreIncrement;
      });

      // Mapping scores to recommendations (Basic logic for demonstration)
      let recommended: Career[] = [];
      const scoreEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      
      // Top 3 categories determine the career stream
      const topCategories = scoreEntries.slice(0, 3).map(([cat]) => cat);

      if (topCategories.includes('technical') || topCategories.includes('analytical')) {
        recommended.push(careers.find(c => c.id === 'ds-ml')!);
        recommended.push(careers.find(c => c.id === 'sw-dev')!);
      }
      if (topCategories.includes('science')) {
        recommended.push(careers.find(c => c.id === 'doctor')!);
        recommended.push(careers.find(c => c.id === 'physio')!);
      }
      if (topCategories.includes('business') || topCategories.includes('compliance')) {
        recommended.push(careers.find(c => c.id === 'ca')!);
        recommended.push(careers.find(c => c.id === 'ibanker')!);
      }
      if (topCategories.includes('government') || topCategories.includes('social')) {
        recommended.push(careers.find(c => c.id === 'civil-servant')!);
        recommended.push(careers.find(c => c.id === 'ibpspo')!);
      }
      if (topCategories.includes('creative')) {
        recommended.push(careers.find(c => c.id === 'graphic-designer')!);
        recommended.push(careers.find(c => c.id === 'digital-marketer')!);
      }
      if (topCategories.includes('core_eng')) {
        recommended.push(careers.find(c => c.id === 'mechanical-engineer')!);
        recommended.push(careers.find(c => c.id === 'civil-eng')!);
      }


      // Remove duplicates and ensure minimum 3 recommendations
      recommended = [...new Set(recommended)].filter(c => c !== undefined).slice(0, 3);
      if (recommended.length < 3) recommended.push(...careers.slice(0, 3 - recommended.length));

      setRecommendedCareers(recommended);
      setActiveView('quiz-result');
    }
  };
  
  // Header Component (Unchanged)
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
            <button onClick={() => setActiveView('home')} className="hover:text-indigo-200 cursor-pointer  transition">Home</button>
            <button onClick={() => setActiveView('explore')} className="hover:text-indigo-200 transition cursor-pointer ">Explore Careers</button>
            <button onClick={startQuiz} className="hover:text-indigo-200 transition cursor-pointer ">Career Quiz</button>
            <button onClick={() => navigate("/teams")} className="hover:text-indigo-200 cursor-pointer transition">About Us</button>
            <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition cursor-pointer ">Login</button>
          </nav>
        </div>
      </div>
    </header>
  );
  
  type FeatureName = "500+ Careers" | "100+ Exams" | "Top Colleges" | "Expert Mentors";

const handleFeature = (name: FeatureName) => {
  const featureMap: Record<FeatureName, string> = {
    "500+ Careers": "careers",
    "100+ Exams": "exams",
    "Top Colleges": "colleges",
    "Expert Mentors": "mentors",
  };

  const view = featureMap[name];
  // Since we are in a single-file React component, we'll simulate navigation
  if (view === 'careers') setActiveView('explore');
  // navigate(`/${view}`);
  return;
  
};
  // Homepage View (Unchanged)
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
                className="bg-indigo-600 text-white px-6 py-3 cursor-pointer rounded-lg font-semibold hover:bg-indigo-700 transition"
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
            <div key={idx}
            onClick={() => handleFeature(feature.title as FeatureName)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer">
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
              className="bg-indigo-600 text-white cursor-pointer px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition shadow-lg"
            >
              Explore All {careers.length}+ Careers →
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
            className="bg-white text-purple-600 cursor-pointer px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
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

  // Explore Careers View (Updated with new filters)
  const ExploreCareers = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Explore Careers</h1>
          <p className="text-gray-600">Find your perfect career path among {careers.length}+ options</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
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
              className="flex items-center justify-center cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              <Filter className="w-5 h-5 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Advanced Filters (Up to 10 Categories)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                
                {/* Filter 1: Stream */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stream</label>
                  <select
                    value={filterStream}
                    onChange={(e) => setFilterStream(e.target.value as Stream)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {ALL_STREAMS.map(stream => <option key={stream} value={stream}>{stream}</option>)}
                  </select>
                </div>

                {/* Filter 2: Sector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sector</label>
                  <select
                    value={filterSector}
                    onChange={(e) => setFilterSector(e.target.value as Sector | 'All')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="All">All</option>
                    {ALL_SECTORS.map(sector => <option key={sector} value={sector}>{sector}</option>)}
                  </select>
                </div>

                {/* Filter 3: Growth Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Growth Rate</label>
                  <select 
                    value={filterGrowth}
                    onChange={(e) => setFilterGrowth(e.target.value as 'All' | 'High' | 'Medium' | 'Low')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="All">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Filter 4: Salary Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range (Min LPA)</label>
                  <select 
                    value={filterSalary}
                    onChange={(e) => setFilterSalary(e.target.value as 'All' | '3-8' | '8-15' | '15+')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="All">All</option>
                    {SALARY_RANGES.map(range => <option key={range.label} value={range.label.match(/(\d+\+)|(\d+-\d+)/)?.[0]}>{range.label}</option>)}
                  </select>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterStream('Any');
                      setFilterSector('All');
                      setFilterGrowth('All');
                      setFilterSalary('All');
                      setSearchTerm('');
                    }}
                    className="w-full px-4 py-2 border cursor-pointer border-gray-300 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <X className="w-4 h-4 inline-block mr-1" /> Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          Showing <span className="font-semibold text-gray-800">{filteredCareers.length}</span> careers out of {careers.length}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.length > 0 ? (
            filteredCareers.map((career) => (
              <div
                key={career.id}
                onClick={() => handleCareerClick(career)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden transform hover:-translate-y-0.5"
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
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{career.shortDescription}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Briefcase className="w-4 h-4 text-indigo-400 mr-2" />
                      <span className="text-gray-700 font-medium">{career.sector}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-green-600 font-semibold flex items-center">
                        <Star className="w-4 h-4 mr-1 text-green-500 fill-current" />
                        ₹ {career.avgSalaryIndiaLPA}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      {career.topCities.slice(0, 3).join(', ')}...
                    </div>
                  </div>
                  <button className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold">
                    View Full Roadmap
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-12 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
              <Filter className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p className="text-xl font-medium text-gray-600">No careers match your current filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Career Detail View (Unchanged)
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
              className="flex items-center cursor-pointer text-indigo-100 hover:text-white mb-6 transition"
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
                  <span className="bg-white/20 px-4 py-2 rounded-lg">Sector: {selectedCareer.sector}</span>
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
                  className={`flex items-center cursor-pointer gap-2 px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap ${
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

  // Quiz View (Unchanged)
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
                      className="w-full text-left p-6 border-2 cursor-pointer border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition transform hover:scale-105"
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

  // Quiz Result View (Unchanged)
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
                  <button className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={startQuiz}
              className="bg-gray-600 cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => setActiveView('explore')}
              className="bg-indigo-600 cursor-pointer cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Explore All Careers
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Footer Component (Unchanged)
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
              <li><a href="#" onClick={() => setActiveView('explore')} className="hover:text-indigo-400 transition">All Careers</a></li>
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
    <div className="min-h-screen bg-white font-sans">
      <script src="https://cdn.tailwindcss.com"></script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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