import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, Award, Building2, BookOpen, Users, ChevronRight, MapPin, Briefcase, GraduationCap, Star, Filter, X } from 'lucide-react';
// Note: useNavigate is assumed to be available but will not navigate externally in this single-file environment.
const useNavigate = () => (path: string) => console.log(`Navigating to: ${path}`);

// --- ENHANCED TYPESCRIPT INTERFACES ---

type Stream = 'Science' | 'Commerce' | 'Arts' | 'Vocational' | 'Any' | 'Law & Legal';
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
  'Manufacturing & Core', 'Education & Research', 'Media & Design', 'Law & Legal', 'Consulting'
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


// --- EXPANDED SAMPLE DATA (51 Careers) ---

const careers: Career[] = [
  // --- Existing Careers (Intact) ---
  {
    id: 'ds-ml', name: 'Data Scientist / ML Engineer', slug: 'data-scientist', stream: 'Science', sector: 'IT & Software', shortDescription: 'Build AI models and analyze complex data. Top demand in tech hubs.',
    avgSalaryIndiaLPA: '10 - 25 LPA', growthRate: 'High', prerequisites: 'B.Tech/M.Sc. in CS, Statistics, or Mathematics', topCities: ['Bangalore', 'Pune', 'Hyderabad'], icon: '🤖',
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
        { name: 'GATE', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }
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
      ],
      faqs: [
        { question: 'Do I need a Tier-1 college?', answer: 'Not mandatory. Skills and portfolio matter more. Many successful data scientists are from Tier-2/3 colleges.' },
        { question: 'What coding languages should I learn?', answer: 'Python is essential. SQL for databases, R for statistics. Learn frameworks like TensorFlow and PyTorch.' }
      ]
    }
  },
  {
    id: 'ca', name: 'Chartered Accountant (CA)', slug: 'chartered-accountant', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Financial expert handling audits, taxation, and business advisory.',
    avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'High', prerequisites: '12th Commerce, CA Foundation cleared', topCities: ['Mumbai', 'Delhi', 'Chennai', 'Bangalore'], icon: '💼',
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
        { name: 'CA Final', conducting: 'ICAI', eligibility: 'CA Intermediate + Articleship', frequency: 'Twice a year', difficulty: 'High' }
      ],
      institutions: [
        { name: 'ICAI - Mumbai', location: 'Mumbai', ranking: 'Official Body', type: 'University' },
        { name: 'ICAI - Delhi', location: 'New Delhi', ranking: 'Official Body', type: 'University' }
      ],
      companies: [
        { name: 'Deloitte India', sector: 'Consulting', hiring: 'Pan India' },
        { name: 'EY India', sector: 'Consulting', hiring: 'Major Cities' },
      ],
      faqs: [
        { question: 'How difficult is CA?', answer: 'CA is challenging with an average pass rate of 10-15%. Requires dedication, consistency, and 3-4 years of commitment.' },
        { question: 'Can I do graduation alongside CA?', answer: 'Yes, many students pursue B.Com while doing CA Intermediate.' }
      ]
    }
  },
  {
    id: 'doctor', name: 'Medical Doctor (MBBS)', slug: 'medical-doctor', stream: 'Science', sector: 'Healthcare', shortDescription: 'Diagnose and treat patients, save lives in hospitals and clinics.',
    avgSalaryIndiaLPA: '6 - 20 LPA', growthRate: 'Medium', prerequisites: '12th PCB with 50%+ marks, NEET qualified', topCities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'], icon: '🩺',
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
      ],
      institutions: [
        { name: 'AIIMS Delhi', location: 'New Delhi', ranking: 'NIRF Rank 1', type: 'AIIMS' },
        { name: 'PGIMER Chandigarh', location: 'Chandigarh', ranking: 'NIRF Rank 2', type: 'College' },
      ],
      companies: [
        { name: 'Apollo Hospitals', sector: 'Healthcare', hiring: 'Pan India' },
        { name: 'Government Hospitals', sector: 'Public Health', hiring: 'Pan India' }
      ],
      faqs: [
        { question: 'Is NEET very difficult?', answer: 'NEET is competitive with lakhs of aspirants. Start preparation from 11th standard and focus on NCERT thoroughly.' },
        { question: 'Can I practice after MBBS?', answer: 'Yes, after MBBS and internship, you can start practice. However, specialization (MD/MS) increases opportunities.' }
      ]
    }
  },
  {
    id: 'civil-servant', name: 'Civil Servant (IAS/IPS)', slug: 'civil-servant', stream: 'Arts', sector: 'Government & Public', shortDescription: 'Serve the nation through administrative roles in government.',
    avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'Medium', prerequisites: 'Graduation in any stream, UPSC CSE cleared', topCities: ['Delhi', 'State Capitals', 'District HQs'], icon: '🏛️',
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
    id: 'digital-marketer', name: 'Digital Marketing Manager', slug: 'digital-marketer', stream: 'Commerce', sector: 'Media & Design', shortDescription: 'Create online campaigns, manage social media, drive business growth.',
    avgSalaryIndiaLPA: '4 - 15 LPA', growthRate: 'High', prerequisites: 'Any graduation, Digital Marketing certifications', topCities: ['Bangalore', 'Mumbai', 'Delhi', 'Pune'], icon: '📱',
    detailedInfo: {
      overview: 'Fast-growing field in India with opportunities in startups, agencies, and corporates. Digital marketers drive brand awareness and sales through online channels.',
      personalityTraits: ['Creative', 'Analytical', 'Trendy', 'Communication'],
      roadmap: [
        { phase: 'Graduation', duration: '3 years', description: 'Any degree (BBA, B.Com, BA preferred)', keyPoints: ['Build social media presence', 'Learn content creation', 'Start a blog/YouTube channel'] },
        { phase: 'Certifications', duration: '6-12 months', description: 'Digital Marketing courses', keyPoints: ['Google Ads certification', 'Facebook Blueprint', 'SEO/SEM courses', 'Analytics training'] },
        { phase: 'Experience', duration: '2-3 years', description: 'Work in agency or in-house', keyPoints: ['Start as Executive/Associate', 'Handle campaigns', 'Build portfolio', 'Grow to Manager role'] }
      ],
      exams: [
        { name: 'CMAT/MAT (for MBA in Marketing)', conducting: 'NTA/AIMA', eligibility: 'Graduation', frequency: 'Annual/Multiple', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'MICA Ahmedabad', location: 'Ahmedabad', ranking: 'Top Marketing School', type: 'College' },
      ],
      companies: [
        { name: 'Flipkart', sector: 'E-commerce', hiring: 'Bangalore' },
        { name: 'Amazon India', sector: 'E-commerce', hiring: 'Bangalore, Mumbai' },
      ],
      faqs: [
        { question: 'Do I need an MBA?', answer: 'Not mandatory. Certifications and hands-on experience are more valued. MBA helps for senior roles.' },
        { question: 'Can I work freelance?', answer: 'Yes! Digital marketing offers excellent freelance opportunities. Build portfolio and client base.' }
      ]
    }
  },
  {
    id: 'lawyer', name: 'Lawyer / Advocate', slug: 'lawyer', stream: 'Arts', sector: 'Law & Legal', shortDescription: 'Represent clients in court, provide legal advice and consultation.',
    avgSalaryIndiaLPA: '3 - 25 LPA', growthRate: 'Medium', prerequisites: 'LLB/BA LLB degree, Bar Council enrollment', topCities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'], icon: '⚖️',
    detailedInfo: {
      overview: 'A career focused on justice, litigation, and corporate law. Graduates from top NLUs are highly sought after by corporate law firms (high salary bracket).',
      personalityTraits: ['Debater', 'Logical', 'Articulate', 'Patient'],
      roadmap: [
        { phase: 'After 12th', duration: '5 years', description: 'Integrated BA/BBA LLB', keyPoints: ['Clear CLAT/AILET', 'Focus on legal writing and research', 'Internships with law firms/judges'] },
        { phase: 'Post-Graduation', duration: '1 year', description: 'LL.M. or specialization', keyPoints: ['Specialization in Corporate Law/Cyber Law', 'Clear LL.M. Entrance exams'] },
        { phase: 'Practice', duration: 'Ongoing', description: 'Litigation or Corporate Law', keyPoints: ['Clear All India Bar Exam (AIBE)', 'Join a firm or start own practice'] }
      ],
      exams: [
        { name: 'CLAT', conducting: 'Consortium of NLUs', eligibility: '12th pass', frequency: 'Annual', difficulty: 'High' },
        { name: 'AILET', conducting: 'NLU Delhi', eligibility: '12th pass', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'NLSIU Bangalore', location: 'Bangalore', ranking: 'NIRF Law Rank 1', type: 'University' },
        { name: 'NLU Delhi', location: 'New Delhi', ranking: 'NIRF Law Rank 2', type: 'University' }
      ],
      companies: [
        { name: 'Cyril Amarchand Mangaldas', sector: 'Corporate Law', hiring: 'Mumbai, Delhi' },
        { name: 'Trilegal', sector: 'Corporate Law', hiring: 'Bangalore, Delhi' },
      ],
      faqs: [
        { question: 'What is the highest paying area of law?', answer: 'Corporate Law and Mergers & Acquisitions (M&A) in large international firms offer the highest starting salaries.' },
      ]
    }
  },
  {
    id: 'graphic-designer', name: 'Graphic Designer / UI/UX Designer', slug: 'graphic-designer', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Design visual content for brands, apps, websites, and marketing.',
    avgSalaryIndiaLPA: '5 - 18 LPA', growthRate: 'High', prerequisites: 'Design degree/diploma or self-taught with portfolio', topCities: ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad'], icon: '🎨',
    detailedInfo: {
      overview: 'UI/UX (User Interface/User Experience) is a booming field, focused on creating user-friendly and aesthetically pleasing digital products. A strong portfolio is more important than a degree.',
      personalityTraits: ['Creative', 'Empathetic', 'Visually inclined', 'Attention to detail'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Des/BFA/B.Tech in CS with specialization', keyPoints: ['Clear NID/CEED/UCEED exams', 'Master design tools (Figma, Sketch)', 'Build portfolio projects'] },
        { phase: 'Specialization', duration: '1 year', description: 'UI/UX certifications', keyPoints: ['Google UX Design Certificate', 'Advanced prototyping techniques', 'Focus on user testing'] },
        { phase: 'Entry Level', duration: '2 years', description: 'Start as Junior Designer', keyPoints: ['Gain industry experience in a startup/agency', 'Work on diverse platforms (web, mobile)'] }
      ],
      exams: [
        { name: 'NID DAT', conducting: 'NID', eligibility: '12th pass', frequency: 'Annual', difficulty: 'High' },
        { name: 'UCEED/CEED', conducting: 'IITs', eligibility: '12th pass', frequency: 'Annual', difficulty: 'Medium' }
      ],
      institutions: [
        { name: 'NID Ahmedabad', location: 'Ahmedabad', ranking: 'Top Design School', type: 'College' },
        { name: 'IDC IIT Bombay', location: 'Mumbai', ranking: 'Top Design School', type: 'IIT' }
      ],
      companies: [
        { name: 'Apple India', sector: 'Technology', hiring: 'Hyderabad, Bangalore' },
        { name: 'Adobe', sector: 'Technology', hiring: 'Bangalore, Noida' },
        { name: 'Razorpay', sector: 'FinTech', hiring: 'Bangalore' }
      ],
      faqs: [
        { question: 'Is a design degree necessary?', answer: 'No, but highly recommended for foundation. An outstanding portfolio and domain expertise can land you a top job without a formal degree.' },
      ]
    }
  },
  {
    id: 'mechanical-engineer', name: 'Mechanical Engineer', slug: 'mechanical-engineer', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Design, develop machines, automotive, and manufacturing systems.',
    avgSalaryIndiaLPA: '4 - 12 LPA', growthRate: 'Medium', prerequisites: 'B.Tech in Mechanical Engineering', topCities: ['Pune', 'Chennai', 'Bangalore', 'Ahmedabad'], icon: '⚙️',
    detailedInfo: {
      overview: 'Mechanical engineering is the bedrock of many industries, from automotive and aerospace to thermal and robotics. Core jobs often require relocating to industrial hubs.',
      personalityTraits: ['Practical', 'Analytical', 'Problem Solver', 'Hands-on'],
      roadmap: [
        { phase: 'Undergraduate', duration: '4 years', description: 'B.Tech/B.E. in Mechanical Engineering', keyPoints: ['Clear JEE/MHT-CET/VITEEE', 'Master CAD software (SolidWorks, AutoCAD)', 'Internships at core companies (Tata Motors, Maruti)'] },
        { phase: 'Post-Graduation', duration: '2 years', description: 'M.Tech via GATE', keyPoints: ['Clear GATE for higher studies or PSU job', 'Specialise in Robotics, Automotive, or Thermal engineering'] }
      ],
      exams: [
        { name: 'JEE Main', conducting: 'NTA', eligibility: '12th PCM', frequency: 'Annual', difficulty: 'High' },
        { name: 'GATE', conducting: 'IITs/IISc', eligibility: 'B.Tech/B.E.', frequency: 'Annual', difficulty: 'High' }
      ],
      institutions: [
        { name: 'IIT Madras', location: 'Chennai', ranking: 'NIRF Engg Rank 1', type: 'IIT' },
        { name: 'NIT Trichy', location: 'Trichy', ranking: 'NIRF Engg Rank 9', type: 'NIT' }
      ],
      companies: [
        { name: 'Tata Motors', sector: 'Automotive', hiring: 'Pune, Jamshedpur' },
        { name: 'Mahindra & Mahindra', sector: 'Automotive', hiring: 'Pune, Chennai' },
        { name: 'DRDO', sector: 'Government & Public', hiring: 'Pan India' }
      ],
      faqs: [
        { question: 'Is Mechanical Engineering still relevant?', answer: 'Yes, but the focus has shifted to Robotics, AI integration, and EV manufacturing. Upskilling in these areas is crucial.' },
      ]
    }
  },
  
  // --- New Careers (Expanded List) ---

  // IT & Software (High Growth)
  { id: 'sw-dev', name: 'Software Developer (Full Stack)', slug: 'software-developer', stream: 'Science', sector: 'IT & Software', shortDescription: 'Develop web/mobile applications and manage databases.', avgSalaryIndiaLPA: '8 - 22 LPA', growthRate: 'High', prerequisites: 'B.Tech in CS or relevant specialization', topCities: ['Bangalore', 'Pune', 'Hyderabad', 'Noida'], icon: '💻' },
  { id: 'cyber-sec', name: 'Cybersecurity Analyst', slug: 'cybersecurity', stream: 'Science', sector: 'IT & Software', shortDescription: 'Protect digital assets, systems, and networks from threats.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'High', prerequisites: 'B.Tech in IT/CS, certifications (CEH, CISSP)', topCities: ['Bangalore', 'Mumbai', 'Chennai'], icon: '🔒' },
  { id: 'cloud-arch', name: 'Cloud Architect', slug: 'cloud-architect', stream: 'Science', sector: 'IT & Software', shortDescription: 'Design and manage cloud infrastructure on AWS, Azure, or GCP.', avgSalaryIndiaLPA: '15 - 30 LPA', growthRate: 'High', prerequisites: 'B.Tech, 5+ years experience, Cloud Certifications', topCities: ['Bangalore', 'Pune'], icon: '☁️' },
  
  // Finance & Accounting (Commerce Focus)
  { id: 'ibanker', name: 'Investment Banker', slug: 'investment-banker', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Manage large transactions (M&A, IPOs) for corporate clients.', avgSalaryIndiaLPA: '12 - 40 LPA', growthRate: 'High', prerequisites: 'MBA Finance/CFA, top B-School preferred', topCities: ['Mumbai', 'Gurgaon', 'Bangalore'], icon: '💰' },
  { id: 'fanalyst', name: 'Financial Analyst', slug: 'financial-analyst', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Evaluate business performance, budgets, and investments.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'Medium', prerequisites: 'B.Com/BBA, MBA/CFA/FRM preferred', topCities: ['Mumbai', 'Delhi', 'Chennai'], icon: '📈' },
  { id: 'csecretary', name: 'Company Secretary (CS)', slug: 'company-secretary', stream: 'Commerce', sector: 'Law & Legal', shortDescription: 'Ensure corporate legal and statutory compliance.', avgSalaryIndiaLPA: '7 - 18 LPA', growthRate: 'Medium', prerequisites: 'ICSI exams cleared, Bachelor’s degree', topCities: ['Mumbai', 'Delhi', 'Kolkata'], icon: '📜' },
  
  // Healthcare (Science Focus)
  { id: 'pharmacist', name: 'Pharmacist', slug: 'pharmacist', stream: 'Science', sector: 'Healthcare', shortDescription: 'Dispense medication and counsel patients on drug use.', avgSalaryIndiaLPA: '3 - 8 LPA', growthRate: 'Medium', prerequisites: 'B.Pharm/M.Pharm degree', topCities: ['Hyderabad', 'Ahmedabad', 'Mumbai'], icon: '💊' },
  { id: 'physio', name: 'Physiotherapist', slug: 'physiotherapist', stream: 'Science', sector: 'Healthcare', shortDescription: 'Treat injuries and physical disorders using exercise and manipulation.', avgSalaryIndiaLPA: '4 - 10 LPA', growthRate: 'High', prerequisites: 'B.P.T. degree', topCities: ['All Major Cities'], icon: '🤸' },
  { id: 'nurse', name: 'Registered Nurse', slug: 'nurse', stream: 'Science', sector: 'Healthcare', shortDescription: 'Provide essential medical care and patient support.', avgSalaryIndiaLPA: '3 - 7 LPA', growthRate: 'Medium', prerequisites: 'B.Sc. Nursing/GNM, registration', topCities: ['All Major Cities'], icon: '🩹' },
  
  // Government & Public Sector
  { id: 'ibpspo', name: 'Bank PO (IBPS/SBI)', slug: 'bank-po', stream: 'Any', sector: 'Government & Public', shortDescription: 'Probationary Officer in Public Sector Banks.', avgSalaryIndiaLPA: '7 - 12 LPA', growthRate: 'Medium', prerequisites: 'Graduation in any stream, clear IBPS/SBI PO exams', topCities: ['Pan India'], icon: '🏦' },
  { id: 'ssccgl', name: 'SSC CGL Officer', slug: 'ssc-cgl', stream: 'Any', sector: 'Government & Public', shortDescription: 'Recruitment for Group B/C posts in Central Government Ministries (Income Tax, Excise etc).', avgSalaryIndiaLPA: '6 - 10 LPA', growthRate: 'Medium', prerequisites: 'Graduation in any stream, clear SSC CGL exam', topCities: ['Pan India'], icon: '🏢' },
  { id: 'ifs-officer', name: 'Indian Foreign Service (IFS)', slug: 'ifs-officer', stream: 'Arts', sector: 'Government & Public', shortDescription: 'Represent India in global embassies and international organizations.', avgSalaryIndiaLPA: '10 - 30 LPA', growthRate: 'Medium', prerequisites: 'UPSC CSE rank, specialization in International Relations', topCities: ['New Delhi', 'Global'], icon: '🌍' },
  
  // Media & Arts (Arts Focus)
  { id: 'journalist', name: 'Journalist / Editor', slug: 'journalist', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Report, write, and broadcast news and investigative stories.', avgSalaryIndiaLPA: '4 - 10 LPA', growthRate: 'Low', prerequisites: 'Bachelors in Journalism/Mass Comm.', topCities: ['New Delhi', 'Mumbai', 'Kolkata'], icon: '📰' },
  { id: 'cwriter', name: 'Content Writer / Strategist', slug: 'content-writer', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Create engaging content for websites, blogs, and marketing.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'High', prerequisites: 'Excellent command of English, any graduation', topCities: ['Remote', 'Bangalore', 'Pune'], icon: '✍️' },
  { id: 'vlogger', name: 'Filmmaker / Vlogger', slug: 'filmmaker', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Produce films, documentaries, or high-quality video content.', avgSalaryIndiaLPA: '4 - 15 LPA', growthRate: 'High', prerequisites: 'Mass Comm. degree or film school training', topCities: ['Mumbai', 'Hyderabad'], icon: '🎥' },
  
  // Education & Research (Any Stream)
  { id: 'teacher-k12', name: 'School Teacher (K-12)', slug: 'teacher-k12', stream: 'Any', sector: 'Education & Research', shortDescription: 'Educate students at primary and secondary levels.', avgSalaryIndiaLPA: '3 - 8 LPA', growthRate: 'Medium', prerequisites: 'B.Ed./TET/CTET qualification', topCities: ['Pan India'], icon: '🍎' },
  { id: 'professor', name: 'University Professor', slug: 'university-professor', stream: 'Any', sector: 'Education & Research', shortDescription: 'Teach and conduct research at the university level.', avgSalaryIndiaLPA: '10 - 25 LPA', growthRate: 'Medium', prerequisites: 'Ph.D./NET/SET qualification', topCities: ['Major State Capitals'], icon: '🎓' },
  { id: 'scientist-isro', name: 'ISRO Scientist / Engineer', slug: 'isro-scientist', stream: 'Science', sector: 'Government & Public', shortDescription: 'Contribute to India\'s space and satellite missions.', avgSalaryIndiaLPA: '10 - 20 LPA', growthRate: 'Medium', prerequisites: 'B.Tech in relevant field, ISRO Exam qualified', topCities: ['Bangalore', 'Thiruvananthapuram'], icon: '🚀' },
  
  // Other Engineering Disciplines
  { id: 'civil-eng', name: 'Civil Engineer', slug: 'civil-engineer', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Design, plan, and construct infrastructure (buildings, roads, bridges).', avgSalaryIndiaLPA: '5 - 14 LPA', growthRate: 'Medium', prerequisites: 'B.Tech in Civil Engineering', topCities: ['All Major Cities'], icon: '🏗️' },
  { id: 'aero-eng', name: 'Aeronautical Engineer', slug: 'aeronautical-engineer', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Design and maintenance of aircraft and aerospace equipment.', avgSalaryIndiaLPA: '6 - 18 LPA', growthRate: 'High', prerequisites: 'B.Tech/M.Tech in Aeronautical/Aerospace', topCities: ['Bangalore', 'Hyderabad', 'Nashik'], icon: '✈️' },
  { id: 'electrical-eng', name: 'Electrical Engineer', slug: 'electrical-engineer', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Design, develop, and manage electrical control systems and power generation.', avgSalaryIndiaLPA: '5 - 15 LPA', growthRate: 'Medium', prerequisites: 'B.Tech in Electrical/Electronics', topCities: ['Pune', 'Vadodara', 'Kolkata'], icon: '⚡' },
  
  // Vocational/Skilled Trades
  { id: 'chef', name: 'Chef / Restaurateur', slug: 'chef', stream: 'Vocational', sector: 'Media & Design', shortDescription: 'Professional cook or manager of a hospitality business.', avgSalaryIndiaLPA: '4 - 15 LPA', growthRate: 'High', prerequisites: 'Hotel Management/Culinary Degree', topCities: ['Mumbai', 'Goa', 'Delhi'], icon: '👨‍🍳' },
  { id: 'pilot', name: 'Commercial Pilot', slug: 'pilot', stream: 'Science', sector: 'Any', shortDescription: 'Fly passenger or cargo aircraft for commercial airlines.', avgSalaryIndiaLPA: '15 - 80 LPA', growthRate: 'High', prerequisites: '10+2 Science, CPL license, high investment', topCities: ['Delhi', 'Mumbai', 'Bangalore'], icon: '🧑‍✈️' },
  
  // Arts & Humanities
  { id: 'curator', name: 'Museum Curator / Archivist', slug: 'curator', stream: 'Arts', sector: 'Education & Research', shortDescription: 'Manage and preserve historical, artistic, or cultural collections.', avgSalaryIndiaLPA: '4 - 10 LPA', growthRate: 'Low', prerequisites: 'M.A. History/Museology, NET qualified', topCities: ['Delhi', 'Kolkata', 'Chennai'], icon: '🏺' },
  
  // Management & Consulting
  { id: 'mgt-consult', name: 'Management Consultant', slug: 'management-consultant', stream: 'Any', sector: 'Consulting', shortDescription: 'Advise organizations on high-level strategic decisions and operations.', avgSalaryIndiaLPA: '18 - 50 LPA', growthRate: 'High', prerequisites: 'MBA from IIM/ISB, strong analytical skills', topCities: ['Mumbai', 'Bangalore', 'Gurgaon'], icon: '💡' },
  { id: 'hrm', name: 'HR Manager', slug: 'hr-manager', stream: 'Any', sector: 'Consulting', shortDescription: 'Manage employee relations, recruitment, and organizational policy.', avgSalaryIndiaLPA: '7 - 18 LPA', growthRate: 'Medium', prerequisites: 'MBA HR/PGDM from top B-School', topCities: ['All Major Cities'], icon: '🤝' },
  
  // New Additions to reach 51+
  { id: 'data-analyst', name: 'Data Analyst', slug: 'data-analyst', stream: 'Any', sector: 'IT & Software', shortDescription: 'Collect, process, and perform statistical analyses on datasets.', avgSalaryIndiaLPA: '6 - 12 LPA', growthRate: 'High', prerequisites: 'Bachelors in Statistics/Maths/CS, tool proficiency', topCities: ['Bangalore', 'Pune'], icon: '📊' },
  { id: 'actuary', name: 'Actuary', slug: 'actuary', stream: 'Science', sector: 'Finance & Accounting', shortDescription: 'Analyze financial risk in insurance and finance using mathematical models.', avgSalaryIndiaLPA: '15 - 40 LPA', growthRate: 'High', prerequisites: 'Actuarial exams cleared, Math/Stats background', topCities: ['Mumbai', 'Pune'], icon: '🔢' },
  { id: 'dentist', name: 'Dentist (BDS)', slug: 'dentist', stream: 'Science', sector: 'Healthcare', shortDescription: 'Diagnose and treat diseases of the oral cavity.', avgSalaryIndiaLPA: '4 - 15 LPA', growthRate: 'Medium', prerequisites: 'BDS degree, NEET-UG qualified', topCities: ['All Major Cities'], icon: '🦷' },
  { id: 'law-firm-associate', name: 'Law Firm Associate', slug: 'law-associate', stream: 'Law & Legal', sector: 'Law & Legal', shortDescription: 'Work for a corporate law firm on client cases and legal drafting.', avgSalaryIndiaLPA: '7 - 30 LPA', growthRate: 'High', prerequisites: 'LLB from NLU/Top College', topCities: ['Mumbai', 'New Delhi'], icon: '🧑‍⚖️' },
  { id: 'architect', name: 'Architect', slug: 'architect', stream: 'Science', sector: 'Media & Design', shortDescription: 'Design buildings, open spaces, and master plans for construction.', avgSalaryIndiaLPA: '4 - 12 LPA', growthRate: 'Medium', prerequisites: 'B.Arch degree, NATA/JEE Main Paper 2', topCities: ['Mumbai', 'Bangalore', 'Chandigarh'], icon: '📐' },
  { id: 'state-pcs-officer', name: 'State PCS Officer', slug: 'state-pcs-officer', stream: 'Any', sector: 'Government & Public', shortDescription: 'Administrative officer at the state level (e.g., SDM, Deputy SP).', avgSalaryIndiaLPA: '6 - 12 LPA', growthRate: 'Medium', prerequisites: 'Graduation in any stream, clear State PSC exams', topCities: ['State Capitals'], icon: '🗺️' },
  { id: 'rrb-officer', name: 'Railway Board (RRB) Officer', slug: 'rrb-officer', stream: 'Any', sector: 'Government & Public', shortDescription: 'Managerial and technical roles in Indian Railways.', avgSalaryIndiaLPA: '5 - 10 LPA', growthRate: 'Medium', prerequisites: 'Graduation in any stream or Engineering, RRB exams', topCities: ['Pan India'], icon: '🚂' },
  { id: 'biotech-researcher', name: 'Biotech Scientist / Researcher', slug: 'biotech-researcher', stream: 'Science', sector: 'Education & Research', shortDescription: 'Conduct research in genetics, medicine, and agricultural biotechnology.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'High', prerequisites: 'M.Sc. / Ph.D. in Biotechnology/Life Science, NET/GATE', topCities: ['Pune', 'Hyderabad', 'Bangalore'], icon: '🧬' },
  { id: 'supply-chain', name: 'Supply Chain Manager', slug: 'supply-chain', stream: 'Commerce', sector: 'Manufacturing & Core', shortDescription: 'Optimize logistics, procurement, and distribution of goods.', avgSalaryIndiaLPA: '7 - 18 LPA', growthRate: 'Medium', prerequisites: 'MBA Operations/Supply Chain, B.Tech preferred', topCities: ['Mumbai', 'Chennai', 'Gurgaon'], icon: '📦' },
  { id: 'interior-designer', name: 'Interior Designer', slug: 'interior-designer', stream: 'Vocational', sector: 'Media & Design', shortDescription: 'Plan and execute interior spaces for homes and commercial clients.', avgSalaryIndiaLPA: '4 - 12 LPA', growthRate: 'High', prerequisites: 'Diploma/B.Des in Interior Design', topCities: ['Delhi', 'Mumbai', 'Bangalore'], icon: '🛋️' },
  { id: 'financial-risk', name: 'Financial Risk Manager (FRM)', slug: 'frm', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Specialist in identifying, analyzing, and mitigating financial risks.', avgSalaryIndiaLPA: '10 - 25 LPA', growthRate: 'High', prerequisites: 'FRM certification, MBA Finance', topCities: ['Mumbai', 'Bangalore'], icon: '🛡️' },
  { id: 'equity-analyst', name: 'Equity Research Analyst', slug: 'equity-analyst', stream: 'Commerce', sector: 'Finance & Accounting', shortDescription: 'Research and recommend stock investments for clients.', avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'Medium', prerequisites: 'MBA Finance/CFA Level 1+ required', topCities: ['Mumbai', 'Kolkata'], icon: '📉' },
  { id: 'bde', name: 'Business Development Executive (BDE)', slug: 'bde', stream: 'Any', sector: 'Consulting', shortDescription: 'Drive sales, forge partnerships, and expand market reach.', avgSalaryIndiaLPA: '4 - 10 LPA', growthRate: 'High', prerequisites: 'Any graduation, strong sales skills', topCities: ['All Major Cities'], icon: '🗣️' },
  { id: 'game-dev', name: 'Game Developer', slug: 'game-dev', stream: 'Science', sector: 'IT & Software', shortDescription: 'Program and design interactive video games for various platforms.', avgSalaryIndiaLPA: '6 - 18 LPA', growthRate: 'High', prerequisites: 'B.Tech in CS, proficiency in Unity/Unreal Engine', topCities: ['Pune', 'Bangalore', 'Hyderabad'], icon: '🎮' },
  { id: 'data-engineer', name: 'Data Engineer', slug: 'data-engineer', stream: 'Science', sector: 'IT & Software', shortDescription: 'Build and maintain data pipelines for ML/BI teams.', avgSalaryIndiaLPA: '12 - 28 LPA', growthRate: 'High', prerequisites: 'B.Tech CS, expertise in distributed systems (Hadoop, Spark)', topCities: ['Bangalore', 'Hyderabad'], icon: '⚙️' },
  { id: 'hospital-mgt', name: 'Hospital Administrator', slug: 'hospital-administrator', stream: 'Any', sector: 'Healthcare', shortDescription: 'Manage the operations and strategic planning of healthcare facilities.', avgSalaryIndiaLPA: '7 - 15 LPA', growthRate: 'Medium', prerequisites: 'MBA Hospital Management/Health Administration', topCities: ['All Major Cities'], icon: '🏥' },
  { id: 'public-relations', name: 'Public Relations (PR) Specialist', slug: 'pr-specialist', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Manage public image and communication between clients and media.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'Medium', prerequisites: 'Mass Comm./PR degree', topCities: ['Mumbai', 'Delhi'], icon: '📢' },
  { id: 'fashion-designer', name: 'Fashion Designer', slug: 'fashion-designer', stream: 'Vocational', sector: 'Media & Design', shortDescription: 'Create original clothing and accessory designs.', avgSalaryIndiaLPA: '4 - 15 LPA', growthRate: 'Medium', prerequisites: 'NIFT/NID degree', topCities: ['Delhi', 'Mumbai'], icon: '👗' },
  { id: 'mba-general', name: 'MBA Generalist (IIM)', slug: 'mba-generalist', stream: 'Any', sector: 'Consulting', shortDescription: 'General management role, often leading to top corporate positions.', avgSalaryIndiaLPA: '15 - 35 LPA', growthRate: 'High', prerequisites: 'Graduation, CAT score, IIM/Top B-School admission', topCities: ['Mumbai', 'Bangalore', 'Gurgaon'], icon: '📈' },
  { id: 'market-research', name: 'Market Research Analyst', slug: 'market-research', stream: 'Commerce', sector: 'Consulting', shortDescription: 'Analyze markets, identify trends, and advise companies on product strategy.', avgSalaryIndiaLPA: '6 - 14 LPA', growthRate: 'Medium', prerequisites: 'MBA Marketing/Research, strong analytical skills', topCities: ['Pune', 'Mumbai', 'Bangalore'], icon: '🔍' },
  { id: 'bank-clerk', name: 'Bank Clerk / Assistant', slug: 'bank-clerk', stream: 'Any', sector: 'Government & Public', shortDescription: 'Front office and clerical duties in public sector banks.', avgSalaryIndiaLPA: '3 - 6 LPA', growthRate: 'Low', prerequisites: 'Graduation in any stream, clear IBPS/SBI Clerk exams', topCities: ['Pan India'], icon: '💳' },
  { id: 'forensic-scientist', name: 'Forensic Scientist', slug: 'forensic-scientist', stream: 'Science', sector: 'Law & Legal', shortDescription: 'Apply scientific principles to criminal investigation.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'Medium', prerequisites: 'M.Sc. in Forensic Science', topCities: ['State FSLs'], icon: '🔬' },
  { id: 'urban-planner', name: 'Urban & Regional Planner', slug: 'urban-planner', stream: 'Arts', sector: 'Manufacturing & Core', shortDescription: 'Design communities, transport networks, and land use policies.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'Medium', prerequisites: 'B.Plan/M.Plan degree', topCities: ['New Delhi', 'Chennai'], icon: '🏙️' },
  { id: 'defence-officer', name: 'Defence Officer (Army/Navy/Air Force)', slug: 'defence-officer', stream: 'Any', sector: 'Defense & Public', shortDescription: 'Commissioned officer in the Indian Armed Forces.', avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'Medium', prerequisites: 'NDA/CDS cleared, Graduation', topCities: ['Military Bases'], icon: '🎖️' },
  { id: 'environmental-sci', name: 'Environmental Scientist', slug: 'environmental-sci', stream: 'Science', sector: 'Education & Research', shortDescription: 'Study environmental issues and develop solutions for sustainability.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'High', prerequisites: 'M.Sc. Environmental Science', topCities: ['Pune', 'Bangalore', 'Research Institutes'], icon: '🌿' },
  { id: 'auditor-govt', name: 'Government Auditor (CAG/SSC)', slug: 'govt-auditor', stream: 'Commerce', sector: 'Government & Public', shortDescription: 'Audit government accounts and financial transactions.', avgSalaryIndiaLPA: '6 - 12 LPA', growthRate: 'Medium', prerequisites: 'Graduation, SSC CGL/Auditor exam', topCities: ['Pan India'], icon: '🔎' },
  { id: 'media-producer', name: 'Media Producer / Director', slug: 'media-producer', stream: 'Arts', sector: 'Media & Design', shortDescription: 'Oversee and manage the production of television or film projects.', avgSalaryIndiaLPA: '8 - 20 LPA', growthRate: 'Medium', prerequisites: 'Film school degree, experience', topCities: ['Mumbai', 'Chennai'], icon: '🎬' },
  { id: 'patent-attorney', name: 'Patent Attorney', slug: 'patent-attorney', stream: 'Science', sector: 'Law & Legal', shortDescription: 'Specialist in intellectual property (IP) law, focusing on patents.', avgSalaryIndiaLPA: '10 - 30 LPA', growthRate: 'High', prerequisites: 'B.Tech/M.Sc. + LLB + Patent Agent Exam', topCities: ['Bangalore', 'New Delhi'], icon: '©️' },
  { id: 'food-scientist', name: 'Food Scientist / Technologist', slug: 'food-scientist', stream: 'Science', sector: 'Manufacturing & Core', shortDescription: 'Develop new food products and ensure food safety and quality control.', avgSalaryIndiaLPA: '5 - 12 LPA', growthRate: 'Medium', prerequisites: 'B.Tech Food Technology', topCities: ['Pune', 'Hyderabad'], icon: '🍚' },
  { id: 'hotel-mgt', name: 'Hotel Manager', slug: 'hotel-manager', stream: 'Vocational', sector: 'Consulting', shortDescription: 'Manage all operations of a large hotel or resort.', avgSalaryIndiaLPA: '6 - 15 LPA', growthRate: 'Medium', prerequisites: 'Hotel Management degree (NCHMCT-JEE)', topCities: ['Metro Cities', 'Tourism Hubs'], icon: '🛎️' },
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">Advanced Filters (10 Categories)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                
                {/* Filter 1: Stream */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stream</label>
                  <select
                    value={filterStream}
                    onChange={(e) => setFilterStream(e.target.value as Stream)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {ALL_STREAMS.map(stream => <option key={stream}>{stream}</option>)}
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
                    <option>All</option>
                    {ALL_SECTORS.map(sector => <option key={sector}>{sector}</option>)}
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
                    <option>All</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
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
