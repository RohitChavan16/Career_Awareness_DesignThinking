import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Zap, ChevronDown, BookOpen, Clock, Users, MapPin, CheckCircle, GraduationCap, Briefcase, ZapIcon } from 'lucide-react';

// --- 1. DATA STRUCTURE DEFINITION ---

type Category =
  | 'Engineering Entrance'
  | 'Medical Entrance'
  | 'UPSC & Civil Services'
  | 'Banking & Finance'
  | 'SSC & Railways'
  | 'Defense & Paramilitary'
  | 'Law Entrance'
  | 'Management (MBA)'
  | 'Postgraduate Engineering'
  | 'Teaching & Research';

interface Exam {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  level: 'UG' | 'PG' | 'Govt' | 'Professional';
  conductedBy: string;
  examDate: string; // Placeholder or general time
  description: string;
  eligibility: string;
  roadmap: string; // Detailed preparation strategy
}

// --- 2. MOCK DATA (AT LEAST 50 EXAMS) ---

const MOCK_EXAMS: Exam[] = [
  // --- Engineering Entrance (Must have filter example) ---
  {
    id: 'e01', name: 'Joint Entrance Examination (JEE) Advanced', shortName: 'JEE Advanced', category: 'Engineering Entrance', level: 'UG', conductedBy: 'IITs',
    examDate: 'May/June',
    description: 'The final gateway examination for admission into the prestigious Indian Institutes of Technology (IITs) and other top-tier engineering colleges.',
    eligibility: 'Must have qualified JEE Main and be in the top 2,50,000 rankers. Must have passed 12th grade with PCM.',
    roadmap: 'Focus heavily on advanced problem-solving in Physics, Chemistry, and Mathematics. Practice mock tests under strict time constraints. Review past year papers extensively for pattern analysis.'
  },
  {
    id: 'e02', name: 'Joint Entrance Examination (JEE) Main', shortName: 'JEE Main', category: 'Engineering Entrance', level: 'UG', conductedBy: 'NTA',
    examDate: 'January & April',
    description: 'The primary entrance exam for admission to NITs, IIITs, GFTIs, and the initial screening for JEE Advanced.',
    eligibility: 'Passed 10+2 or equivalent with Physics, Chemistry, and Mathematics.',
    roadmap: 'Master NCERT concepts completely. Focus on speed and accuracy for the large number of questions. Utilize the two sessions to maximize score potential.'
  },
  {
    id: 'e03', name: 'Graduate Aptitude Test in Engineering', shortName: 'GATE', category: 'Postgraduate Engineering', level: 'PG', conductedBy: 'IITs/IISc',
    examDate: 'February',
    description: 'National level exam for M.Tech admissions and recruitment in Public Sector Undertakings (PSUs).',
    eligibility: 'Bachelor\'s degree in Engineering/Technology or relevant Science/Maths degree.',
    roadmap: 'Deep understanding of core engineering subjects is essential. Focus on numerical ability and subject-specific technical content. Use previous year GATE questions as the primary study material.'
  },
  {
    id: 'e04', name: 'Birla Institute of Technology and Science Admission Test', shortName: 'BITSAT', category: 'Engineering Entrance', level: 'UG', conductedBy: 'BITS Pilani',
    examDate: 'May/June',
    description: 'Computer-based entrance test for admission to the B.E., B.Pharm., and M.Sc. programs offered by BITS campuses in India.',
    eligibility: 'Minimum 75% aggregate in 12th grade (PCM/PCB) with at least 60% in each subject.',
    roadmap: 'High-speed solving capacity is key. The paper includes a dedicated English proficiency and Logical Reasoning section, which should not be ignored.'
  },
  {
    id: 'e05', name: 'Common Entrance Test (CET) - MHT CET', shortName: 'MHT CET', category: 'Engineering Entrance', level: 'UG', conductedBy: 'Maharashtra State CET Cell',
    examDate: 'May',
    description: 'State-level entrance exam for admission to engineering and pharmacy courses in Maharashtra.',
    eligibility: 'Passed 10+2 with PCM/PCB and domicile requirements for state seats.',
    roadmap: 'Moderate difficulty, but wide syllabus. Balance between 11th and 12th standard curriculum, with more weight usually given to 12th standard.'
  },

  // --- Medical Entrance ---
  {
    id: 'm01', name: 'National Eligibility cum Entrance Test (Undergraduate)', shortName: 'NEET-UG', category: 'Medical Entrance', level: 'UG', conductedBy: 'NTA',
    examDate: 'May',
    description: 'The single largest entrance test for admission to MBBS, BDS, and other undergraduate medical courses across India.',
    eligibility: 'Minimum 17 years old, passed 10+2 with Physics, Chemistry, Biology/Biotechnology, and English.',
    roadmap: 'Thorough mastery of NCERT Biology is non-negotiable. Consistent practice of MCQs and focus on conceptual clarity in Physics and Chemistry.'
  },
  {
    id: 'm02', name: 'National Eligibility cum Entrance Test (Postgraduate)', shortName: 'NEET-PG', category: 'Medical Entrance', level: 'PG', conductedBy: 'NBE',
    examDate: 'Jan/Feb',
    description: 'Entrance exam for admission to MD/MS and PG Diploma courses in various medical colleges.',
    eligibility: 'Possession of MBBS degree and completion of mandatory internship.',
    roadmap: 'Revision of all 19 subjects taught during MBBS. Focus on high-yield topics and clinical questions. Use question banks extensively.'
  },

  // --- UPSC & Civil Services ---
  {
    id: 'g01', name: 'UPSC Civil Services Examination', shortName: 'UPSC CSE', category: 'UPSC & Civil Services', level: 'Govt', conductedBy: 'UPSC',
    examDate: 'Prelims: June, Mains: Sept',
    description: 'The most prestigious exam for selection into top services like IAS, IPS, and IFS.',
    eligibility: 'Bachelor\'s degree from any recognized university.',
    roadmap: 'Requires a multi-year preparation plan. Deep study of static General Studies (History, Polity, Geography) and daily Current Affairs analysis. Requires excellent essay and answer writing skills for Mains.'
  },
  {
    id: 'g02', name: 'Staff Selection Commission - Combined Graduate Level', shortName: 'SSC CGL', category: 'SSC & Railways', level: 'Govt', conductedBy: 'SSC',
    examDate: 'Tier I: July/Aug',
    description: 'Recruitment for Group \'B\' and \'C\' posts in various Central Government Ministries and Departments.',
    eligibility: 'Bachelor\'s degree from a recognized university.',
    roadmap: 'Focus on Quantitative Aptitude, Reasoning, English, and General Awareness. High-speed, time-bound practice is crucial for Tier-I and Tier-II.'
  },
  {
    id: 'g03', name: 'Reserve Bank of India Grade B Officer', shortName: 'RBI Grade B', category: 'Banking & Finance', level: 'Govt', conductedBy: 'RBI',
    examDate: 'May/June',
    description: 'Recruitment for Officers in the Reserve Bank of India, focused on economic and financial knowledge.',
    eligibility: 'Bachelor\'s degree with minimum 60% marks (50% for SC/ST/PwBD).',
    roadmap: 'Requires strong focus on Economic & Social Issues (ESI), Finance & Management, and daily Current Affairs related to banking and economy.'
  },
  {
    id: 'g04', name: 'Institute of Banking Personnel Selection - PO', shortName: 'IBPS PO', category: 'Banking & Finance', level: 'Govt', conductedBy: 'IBPS',
    examDate: 'Prelims: Oct, Mains: Dec',
    description: 'Recruitment of Probationary Officers (PO) for public sector banks in India.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Practice sectional tests for Prelims (Speed-based) and dedicated study for Mains (Data Analysis & Interpretation, English, Reasoning, Computer, General Awareness).'
  },
  {
    id: 'g05', name: 'Railway Recruitment Board - Non-Technical Popular Categories', shortName: 'RRB NTPC', category: 'SSC & Railways', level: 'Govt', conductedBy: 'RRB',
    examDate: 'Varies',
    description: 'Recruitment for various non-technical posts like Clerk, Ticket Collector, and Goods Guard in Indian Railways.',
    eligibility: '12th pass or Graduate, depending on the post.',
    roadmap: 'Focus on General Awareness, Mathematics, and General Intelligence & Reasoning. High volume of practice papers is key.'
  },
  {
    id: 'g06', name: 'Combined Defence Services Examination', shortName: 'UPSC CDS', category: 'Defense & Paramilitary', level: 'Govt', conductedBy: 'UPSC',
    examDate: 'April & September',
    description: 'Exam for recruiting commissioned officers in the Indian Army, Navy, and Air Force.',
    eligibility: 'Degree from a recognized university. Age restrictions apply.',
    roadmap: 'Written test focuses on English, General Knowledge, and Elementary Mathematics. Must pass the rigorous Service Selection Board (SSB) interview.'
  },
  {
    id: 'g07', name: 'Air Force Common Admission Test', shortName: 'AFCAT', category: 'Defense & Paramilitary', level: 'Govt', conductedBy: 'Indian Air Force',
    examDate: 'Feb & Aug',
    description: 'Entrance exam for Flying, Ground Duty (Technical), and Ground Duty (Non-Technical) Branches in the Indian Air Force.',
    eligibility: 'Graduate with specific percentage/subject requirements based on the branch.',
    roadmap: 'Focus on verbal ability, numerical ability, reasoning, general awareness, and military aptitude test (MAT).'
  },
  {
    id: 'g08', name: 'Union Public Service Commission - Indian Forest Service', shortName: 'UPSC IFS', category: 'UPSC & Civil Services', level: 'Govt', conductedBy: 'UPSC',
    examDate: 'Varies',
    description: 'Recruitment for the Indian Forest Service, focused on scientific and technical knowledge related to forestry.',
    eligibility: 'Bachelor\'s degree with at least one of the subjects: Animal Husbandry & Veterinary Science, Botany, Chemistry, Geology, Mathematics, Physics, Statistics, and Zoology or a Bachelor\'s degree in Agriculture or Forestry.',
    roadmap: 'Specialized preparation in two optional subjects and general knowledge. Exam includes a physical test and walking criteria.'
  },
  {
    id: 'g09', name: 'UPSC Engineering Services Examination', shortName: 'UPSC ESE', category: 'Postgraduate Engineering', level: 'Govt', conductedBy: 'UPSC',
    examDate: 'June/July',
    description: 'Recruitment of Class-I officers for technical and managerial posts in various government departments (e.g., Central Engineering Service).',
    eligibility: 'Bachelor\'s degree in Engineering (B.E./B.Tech).',
    roadmap: 'Requires deep technical knowledge in specific engineering disciplines (Civil, Mechanical, Electrical, Electronics & Telecommunication). Focus on both General Studies/Aptitude and Core Technical Subjects.'
  },
  {
    id: 'g10', name: 'UGC National Eligibility Test', shortName: 'UGC NET', category: 'Teaching & Research', level: 'PG', conductedBy: 'NTA',
    examDate: 'June & December',
    description: 'Eligibility test for Assistant Professor and Junior Research Fellowship (JRF) in Indian universities.',
    eligibility: 'Master\'s Degree in relevant subject with minimum 55% marks.',
    roadmap: 'Two papers: General Aptitude (Paper I) and Subject-specific knowledge (Paper II). Focus on recent research trends and teaching methodologies for Paper I.'
  },
  {
    id: 'l01', name: 'Common Law Admission Test', shortName: 'CLAT', category: 'Law Entrance', level: 'UG', conductedBy: 'Consortium of NLUs',
    examDate: 'December',
    description: 'National-level entrance exam for admission to undergraduate and postgraduate law programs at National Law Universities (NLUs).',
    eligibility: '10+2 or equivalent examination. No upper age limit.',
    roadmap: 'Focus on Legal Reasoning, English, General Knowledge (Current Affairs), Quantitative Techniques, and Logical Reasoning. Time management is crucial due to the reading load.'
  },
  {
    id: 'l02', name: 'All India Law Entrance Test', shortName: 'AILET', category: 'Law Entrance', level: 'UG', conductedBy: 'NLU Delhi',
    examDate: 'December',
    description: 'Entrance test specifically for admission to B.A.LL.B. (Hons.), LL.M., and Ph.D. programs at National Law University, Delhi (NLU Delhi).',
    eligibility: '10+2 or equivalent examination. No upper age limit.',
    roadmap: 'Similar to CLAT but with a different paper pattern and higher focus on critical reasoning.'
  },
  {
    id: 'mgt01', name: 'Common Admission Test', shortName: 'CAT', category: 'Management (MBA)', level: 'PG', conductedBy: 'IIMs',
    examDate: 'November',
    description: 'The premier management entrance exam for admission to IIMs and over 1,200 other top B-Schools in India.',
    eligibility: 'Bachelor\'s degree with at least 50% marks or equivalent CGPA.',
    roadmap: 'Sectional strategy is key: Verbal Ability and Reading Comprehension (VARC), Data Interpretation and Logical Reasoning (DILR), and Quantitative Ability (QA). Consistent mock tests are vital.'
  },
  {
    id: 'mgt02', name: 'Xavier Aptitude Test', shortName: 'XAT', category: 'Management (MBA)', level: 'PG', conductedBy: 'XLRI Jamshedpur',
    examDate: 'January',
    description: 'One of the oldest and most selective management entrance tests, accepted by XLRI and other top B-Schools.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Focuses on Decision Making (DM) section, which is unique. Also tests verbal ability, logical reasoning, and general knowledge. The essay writing section is also important.'
  },
  {
    id: 'prof01', name: 'Chartered Accountancy (Final)', shortName: 'CA Final', category: 'Banking & Finance', level: 'Professional', conductedBy: 'ICAI',
    examDate: 'May & Nov',
    description: 'The final stage of the Chartered Accountancy course, leading to qualification as a CA.',
    eligibility: 'Passed Intermediate/IPCC and completed required practical training (Articleship).',
    roadmap: 'Requires extensive self-study and mastery of advanced accounting, financial, and legal principles. Revision cycles and case study practice are crucial.'
  },
  {
    id: 'prof02', name: 'Company Secretary (Professional)', shortName: 'CS Professional', category: 'Banking & Finance', level: 'Professional', conductedBy: 'ICSI',
    examDate: 'June & Dec',
    description: 'The final stage exam for the Company Secretary course, focusing on corporate governance and compliance.',
    eligibility: 'Passed Executive Programme.',
    roadmap: 'Focus on theoretical knowledge of corporate laws, tax, and governance. Answer writing practice is key.'
  },

  // --- Adding the remaining 30+ exams to meet the 50 minimum requirement and fill categories ---

  // UPSC & Civil Services (Cont.)
  {
    id: 'g11', name: 'UPSC Combined Geo-Scientist Examination', shortName: 'Geo-Scientist', category: 'UPSC & Civil Services', level: 'Govt', conductedBy: 'UPSC',
    examDate: 'Feb/March',
    description: 'Recruitment for posts in Geological Survey of India and Central Ground Water Board.',
    eligibility: 'Master\'s degree in Geology, Applied Geology, or Hydrogeology.',
    roadmap: 'Specialized preparation in Earth Sciences topics like Mineralogy, Petrology, and Structural Geology.'
  },
  {
    id: 'g12', name: 'Central Armed Police Forces (Assistant Commandants)', shortName: 'UPSC CAPF', category: 'Defense & Paramilitary', level: 'Govt', conductedBy: 'UPSC',
    examDate: 'August',
    description: 'Recruitment of Assistant Commandants (Group A) in BSF, CRPF, CISF, ITBP, and SSB.',
    eligibility: 'Bachelor\'s degree and physical/medical standards.',
    roadmap: 'Written test (Paper I: General Ability & Intelligence, Paper II: Essay/Comprehension), Physical Efficiency Test, and Interview.'
  },

  // Banking & Finance (Cont.)
  {
    id: 'g13', name: 'State Bank of India Probationary Officer', shortName: 'SBI PO', category: 'Banking & Finance', level: 'Govt', conductedBy: 'SBI',
    examDate: 'Prelims: Nov, Mains: Dec/Jan',
    description: 'Recruitment of Probationary Officers in the State Bank of India, known for high competition.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Similar to IBPS PO but often with a slightly higher difficulty level in Reasoning and Data Analysis sections. GD/Interview is the final stage.'
  },
  {
    id: 'g14', name: 'IBPS Clerk', shortName: 'IBPS Clerk', category: 'Banking & Finance', level: 'Govt', conductedBy: 'IBPS',
    examDate: 'Prelims: Aug, Mains: Oct',
    description: 'Recruitment of Clerical cadre posts in participating public sector banks.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Speed and high accuracy in Numerical Ability, Reasoning Ability, and English Language are paramount.'
  },

  // SSC & Railways (Cont.)
  {
    id: 'g15', name: 'SSC Combined Higher Secondary Level', shortName: 'SSC CHSL', category: 'SSC & Railways', level: 'Govt', conductedBy: 'SSC',
    examDate: 'May/June',
    description: 'Recruitment for posts like LDC, JSA, PA, and DEO for candidates who have passed 12th grade.',
    eligibility: '12th pass or equivalent.',
    roadmap: 'Covers General Intelligence, English, Quant, and General Awareness. Tier-II includes descriptive writing and skill tests.'
  },
  {
    id: 'g16', name: 'SSC Junior Engineer', shortName: 'SSC JE', category: 'SSC & Railways', level: 'Govt', conductedBy: 'SSC',
    examDate: 'Varies',
    description: 'Recruitment for Junior Engineers (Civil, Mechanical, Electrical, Quantity Surveying, and Contract) in government organizations.',
    eligibility: 'Degree/Diploma in relevant engineering discipline.',
    roadmap: 'Paper I (General Intelligence & Reasoning, General Awareness) and Paper II (Technical Subjects). Technical subjects require solid core engineering knowledge.'
  },
  {
    id: 'g17', name: 'RRB Junior Engineer', shortName: 'RRB JE', category: 'SSC & Railways', level: 'Govt', conductedBy: 'RRB',
    examDate: 'Varies',
    description: 'Recruitment for Junior Engineer positions in Indian Railways across various technical departments.',
    eligibility: 'Degree/Diploma in relevant engineering discipline.',
    roadmap: 'Computer-Based Tests (CBTs) focusing on technical ability, general awareness, and reasoning.'
  },

  // Defense & Paramilitary (Cont.)
  {
    id: 'd01', name: 'National Defence Academy & Naval Academy Examination', shortName: 'NDA', category: 'Defense & Paramilitary', level: 'UG', conductedBy: 'UPSC',
    examDate: 'April & September',
    description: 'Entrance exam for unmarried male and female candidates seeking to join the Army, Navy, and Air Force after 10+2.',
    eligibility: '10+2 pass (Science stream for Air Force/Navy). Age restrictions apply.',
    roadmap: 'Written test (Maths and General Ability Test) followed by a 5-day rigorous SSB interview process.'
  },
  {
    id: 'd02', name: 'Indian Navy Sailors (Artificer Apprentice)', shortName: 'IN AA', category: 'Defense & Paramilitary', level: 'UG', conductedBy: 'Indian Navy',
    examDate: 'Varies',
    description: 'Recruitment of Artificer Apprentices in the Indian Navy.',
    eligibility: '10+2 with 60% or more marks in Maths & Physics and at least one of Chemistry/Biology/Computer Science.',
    roadmap: 'Computer-based exam followed by Physical Fitness Test (PFT) and medical examination.'
  },

  // Law Entrance (Cont.)
  {
    id: 'l03', name: 'Law School Admission Test (India)', shortName: 'LSAT India', category: 'Law Entrance', level: 'UG', conductedBy: 'Pearson VUE',
    examDate: 'Jan & May',
    description: 'Entrance exam for various law colleges in India, focusing on analytical skills and logical reasoning.',
    eligibility: '10+2 or equivalent.',
    roadmap: 'Focuses on four sections: Analytical Reasoning, Logical Reasoning (1 & 2), and Reading Comprehension. Tests critical thinking, not legal knowledge.'
  },
  {
    id: 'l04', name: 'Delhi University LLB Entrance Exam', shortName: 'DU LLB', category: 'Law Entrance', level: 'PG', conductedBy: 'NTA',
    examDate: 'May/June',
    description: 'Entrance test for the three-year LLB course at Delhi University.',
    eligibility: 'Graduate/Post-graduate with 50% marks.',
    roadmap: 'Covers English, General Knowledge, Logical Ability, and Legal Awareness.'
  },

  // Management (MBA) (Cont.)
  {
    id: 'mgt03', name: 'Management Aptitude Test', shortName: 'MAT', category: 'Management (MBA)', level: 'PG', conductedBy: 'AIMA',
    examDate: 'Feb, May, Sept, Dec',
    description: 'A standardized test conducted four times a year for admission to various MBA/PGDM programs across India.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Relatively easier than CAT/XAT. Focuses on Indian and Global Environment, Language Comprehension, Mathematical Skills, Data Analysis & Sufficiency, and Intelligence & Critical Reasoning.'
  },
  {
    id: 'mgt04', name: 'Common Management Admission Test', shortName: 'CMAT', category: 'Management (MBA)', level: 'PG', conductedBy: 'NTA',
    examDate: 'January',
    description: 'National-level exam for admission to management programs approved by AICTE.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Covers Quantitative Techniques & Data Interpretation, Logical Reasoning, Language Comprehension, General Awareness, and Innovation & Entrepreneurship.'
  },
  {
    id: 'mgt05', name: 'Symbiosis National Aptitude Test', shortName: 'SNAP', category: 'Management (MBA)', level: 'PG', conductedBy: 'Symbiosis International University',
    examDate: 'December (multiple attempts)',
    description: 'Entrance test for admission to MBA programs at Symbiosis Institutes.',
    eligibility: 'Bachelor\'s degree with 50% marks.',
    roadmap: 'Known for its speed-based nature and includes Analytical & Logical Reasoning, Quantitative, Data Interpretation & Data Sufficiency, and General English.'
  },

  // Postgraduate Engineering (Cont.)
  {
    id: 'pge01', name: 'IIT Joint Admission Test for Masters', shortName: 'IIT JAM', category: 'Postgraduate Engineering', level: 'PG', conductedBy: 'IITs',
    examDate: 'February',
    description: 'Entrance exam for admission to M.Sc., Joint M.Sc.-Ph.D., M.Sc.-Ph.D. Dual Degree, etc., courses at IITs and IISc.',
    eligibility: 'Bachelor\'s degree in a relevant field.',
    roadmap: 'Subject-specific test in Mathematics, Physics, Chemistry, etc. Requires strong foundation in undergraduate science subjects.'
  },
  {
    id: 'pge02', name: 'National Institute of Design DAT', shortName: 'NID DAT', category: 'Postgraduate Engineering', level: 'PG', conductedBy: 'NID',
    examDate: 'January',
    description: 'Design Aptitude Test for admission to Bachelor of Design (B.Des) and Master of Design (M.Des) programs.',
    eligibility: '10+2 for B.Des; Bachelor\'s degree for M.Des.',
    roadmap: 'Focus on creativity, observation, visualization, and design general knowledge. Includes a studio test and personal interview.'
  },

  // Teaching & Research (Cont.)
  {
    id: 't01', name: 'Council of Scientific and Industrial Research NET', shortName: 'CSIR NET', category: 'Teaching & Research', level: 'PG', conductedBy: 'NTA',
    examDate: 'June & December',
    description: 'National Eligibility Test for Junior Research Fellowship and Lectureship in Science subjects (Life Sciences, Physical Sciences, Chemical Sciences, etc.).',
    eligibility: 'M.Sc. or equivalent degree.',
    roadmap: 'Covers General Aptitude (Part A) and subject-specific advanced scientific content (Part B & C). Requires deep conceptual knowledge.'
  },
  {
    id: 't02', name: 'Central Teacher Eligibility Test', shortName: 'CTET', category: 'Teaching & Research', level: 'Govt', conductedBy: 'CBSE',
    examDate: 'July & December',
    description: 'Minimum qualification for a person to be eligible for appointment as a teacher for classes I to VIII.',
    eligibility: 'B.Ed. degree or equivalent teaching qualification.',
    roadmap: 'Focuses on Child Development & Pedagogy, Language, Mathematics, Environmental Studies, and Social Studies.'
  },

  // Additional Exams for Volume (50+ total)
  {
    id: 'add01', name: 'State Public Service Commission - UPPSC PCS', shortName: 'UPPSC', category: 'UPSC & Civil Services', level: 'Govt', conductedBy: 'UPPSC',
    examDate: 'Varies',
    description: 'Civil services exam for recruitment into various state services in Uttar Pradesh.',
    eligibility: 'Bachelor\'s degree.',
    roadmap: 'Similar structure to UPSC but with a significant focus on UP-specific General Knowledge and current affairs.'
  },
  {
    id: 'add02', name: 'AIIMS INI-CET', shortName: 'INI-CET', category: 'Medical Entrance', level: 'PG', conductedBy: 'AIIMS',
    examDate: 'Jan & July',
    description: 'Combined Entrance Test for admission to PG courses (MD/MS/MCh/DM) at AIIMS and other Institutes of National Importance.',
    eligibility: 'MBBS degree and completion of internship.',
    roadmap: 'Highly clinical and application-based questions, requiring an in-depth understanding of basic and clinical sciences.'
  },
  {
    id: 'add03', name: 'National Aptitude Test in Architecture', shortName: 'NATA', category: 'Engineering Entrance', level: 'UG', conductedBy: 'Council of Architecture (CoA)',
    examDate: 'April/July',
    description: 'National-level test for admission to 5-year B.Arch. programs across India.',
    eligibility: '10+2 with PCM (50% aggregate).',
    roadmap: 'Tests drawing, visualization, aesthetic sensitivity, and architectural awareness. Focus on freehand drawing and design principles.'
  },
  {
    id: 'add04', name: 'Institute of Banking Personnel Selection - Specialist Officer', shortName: 'IBPS SO', category: 'Banking & Finance', level: 'Govt', conductedBy: 'IBPS',
    examDate: 'Dec/Jan',
    description: 'Recruitment of Specialist Officers (IT, Law, Marketing, HR, etc.) in public sector banks.',
    eligibility: 'Degree in a specific field (e.g., B.Tech in IT for IT Officer).',
    roadmap: 'Focus is divided between general aptitude and professional knowledge related to the specialist stream.'
  },
  {
    id: 'add05', name: 'Staff Selection Commission - Multi Tasking Staff', shortName: 'SSC MTS', category: 'SSC & Railways', level: 'Govt', conductedBy: 'SSC',
    examDate: 'Varies',
    description: 'Recruitment of Multi-Tasking Staff (non-technical) in various government departments.',
    eligibility: '10th pass or equivalent.',
    roadmap: 'Focus on General Intelligence, Numerical Aptitude, General English, and General Awareness. Simplest of the SSC exams.'
  },
  {
    id: 'add06', name: 'NABARD Grade A Officer', shortName: 'NABARD Grade A', category: 'Banking & Finance', level: 'Govt', conductedBy: 'NABARD',
    examDate: 'Varies',
    description: 'Recruitment of Assistant Managers in the National Bank for Agriculture and Rural Development.',
    eligibility: 'Bachelor\'s degree in any discipline (specific streams required for Specialist posts).',
    roadmap: 'Requires high focus on Agriculture & Rural Development (ARD) and Economic & Social Issues (ESI).'
  },
  {
    id: 'add07', name: 'ICAR AIEEA (UG/PG)', shortName: 'ICAR AIEEA', category: 'Teaching & Research', level: 'UG', conductedBy: 'NTA',
    examDate: 'June/July',
    description: 'All India Entrance Examination for admission to Bachelor and Master degree programs in Agriculture and allied sciences.',
    eligibility: '10+2 with relevant stream for UG; Bachelor\'s degree for PG.',
    roadmap: 'Subject matter includes Agriculture, Horticulture, Forestry, etc.'
  },
  {
    id: 'add08', name: 'National Defence Academy (Naval Academy)', shortName: 'NA', category: 'Defense & Paramilitary', level: 'UG', conductedBy: 'UPSC',
    examDate: 'April & September',
    description: 'Specific entry stream for candidates wishing to join the Naval Academy after 10+2.',
    eligibility: '10+2 with PCM.',
    roadmap: 'Shares the written exam with NDA, followed by the SSB interview.'
  },
  {
    id: 'add09', name: 'JEE Main Paper 2 (B.Arch/B.Planning)', shortName: 'JEE Main P2', category: 'Engineering Entrance', level: 'UG', conductedBy: 'NTA',
    examDate: 'January & April',
    description: 'Entrance exam for B.Arch and B.Planning courses in NITs and other centrally funded institutions.',
    eligibility: 'Passed 10+2 with Mathematics.',
    roadmap: 'Includes Mathematics, Aptitude Test, and Drawing Test (for B.Arch). Aptitude and drawing skills are critical.'
  },
  {
    id: 'add10', name: 'Medical: JIPMER PG', shortName: 'JIPMER PG', category: 'Medical Entrance', level: 'PG', conductedBy: 'JIPMER',
    examDate: 'Varies',
    description: 'Entrance for admission to various postgraduate medical courses at JIPMER, Puducherry.',
    eligibility: 'MBBS degree and completion of internship.',
    roadmap: 'Focuses on clinical subjects and application-based knowledge in a high-stakes, competitive environment.'
  },
  {
    id: 'add11', name: 'CLAT PG', shortName: 'CLAT PG', category: 'Law Entrance', level: 'PG', conductedBy: 'Consortium of NLUs',
    examDate: 'December',
    description: 'Entrance exam for LL.M. courses offered by National Law Universities.',
    eligibility: 'LL.B. degree.',
    roadmap: 'Tests constitutional law, jurisprudence, and other core legal subjects.'
  },
  {
    id: 'add12', name: 'CAT: NMAT by GMAC', shortName: 'NMAT', category: 'Management (MBA)', level: 'PG', conductedBy: 'GMAC',
    examDate: 'Oct - Dec (multiple attempts)',
    description: 'Management entrance test accepted by NMIMS, XIMB, and other leading B-Schools.',
    eligibility: 'Bachelor\'s degree.',
    roadmap: 'Unique feature of sectional time limits and no negative marking in the first stage. Known for its adaptability.'
  },
  {
    id: 'add13', name: 'SSC Stenographer', shortName: 'SSC Steno', category: 'SSC & Railways', level: 'Govt', conductedBy: 'SSC',
    examDate: 'Varies',
    description: 'Recruitment for Stenographer Grade \'C\' and Grade \'D\' posts.',
    eligibility: '12th pass.',
    roadmap: 'Written exam followed by a skill test in stenography (shorthand).'
  },
  {
    id: 'add14', name: 'BCECE (Bihar Combined Entrance Competitive Examination)', shortName: 'BCECE', category: 'Engineering Entrance', level: 'UG', conductedBy: 'BCECE Board',
    examDate: 'May/June',
    description: 'State-level entrance exam for professional courses in Bihar, including engineering.',
    eligibility: '10+2 or equivalent with relevant subjects.',
    roadmap: 'Focus on Bihar state board syllabus and specific exam patterns.'
  },
  {
    id: 'add15', name: 'Karnataka Common Entrance Test', shortName: 'KCET', category: 'Engineering Entrance', level: 'UG', conductedBy: 'KEA',
    examDate: 'April/May',
    description: 'State-level entrance exam for engineering, medical, and pharmacy courses in Karnataka.',
    eligibility: '10+2 with domicile requirements.',
    roadmap: 'Syllabus based on the Pre-University curriculum of Karnataka.'
  },
  {
    id: 'add16', name: 'AIIMS MBBS', shortName: 'AIIMS UG', category: 'Medical Entrance', level: 'UG', conductedBy: 'AIIMS',
    examDate: 'Now merged with NEET-UG',
    description: 'Historically a separate exam, now admission to AIIMS MBBS is through NEET-UG.',
    eligibility: 'Refer to NEET-UG.',
    roadmap: 'High cutoffs required in NEET-UG for AIIMS seats.'
  },
  {
    id: 'add17', name: 'SBI Clerk', shortName: 'SBI Clerk', category: 'Banking & Finance', level: 'Govt', conductedBy: 'SBI',
    examDate: 'Prelims: June, Mains: July/Aug',
    description: 'Recruitment of Junior Associates (Customer Support & Sales) in the State Bank of India.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Focus on high-speed data interpretation and quick problem-solving across all sections.'
  },
  {
    id: 'add18', name: 'B.Ed. Entrance (Common)', shortName: 'B.Ed. CET', category: 'Teaching & Research', level: 'PG', conductedBy: 'State/Central Universities',
    examDate: 'Varies',
    description: 'Common Entrance Test for admission into Bachelor of Education (B.Ed.) programs.',
    eligibility: 'Bachelor\'s or Master\'s degree.',
    roadmap: 'Tests general awareness, teaching aptitude, general English, and reasoning ability.'
  },
  {
    id: 'add19', name: 'Indian Economic Service (IES)', shortName: 'UPSC IES', category: 'UPSC & Civil Services', level: 'Govt', conductedBy: 'UPSC',
    examDate: 'June',
    description: 'Recruitment for Grade IV officers in the Indian Economic Service.',
    eligibility: 'Post-graduate degree in Economics/Applied Economics/Business Economics/Econometrics.',
    roadmap: 'High-level, theory-heavy exam focusing purely on Economics subjects.'
  },
  {
    id: 'add20', name: 'Defence Research and Development Organization (DRDO) Scientist Entry', shortName: 'DRDO SET', category: 'Defense & Paramilitary', level: 'PG', conductedBy: 'DRDO',
    examDate: 'Varies (often GATE-based)',
    description: 'Recruitment of scientists and engineers in DRDO labs.',
    eligibility: 'B.E./B.Tech or equivalent degree. Often requires a valid GATE score.',
    roadmap: 'Requires deep subject knowledge in the relevant engineering discipline and a high GATE score.'
  },
  {
    id: 'add21', name: 'Common Entrance Examination for Design', shortName: 'CEED', category: 'Postgraduate Engineering', level: 'PG', conductedBy: 'IIT Bombay',
    examDate: 'January',
    description: 'Entrance test for Master of Design (M.Des.) programs at IISc Bangalore, IITs, etc.',
    eligibility: 'Bachelor\'s degree in Engineering, Architecture, or Design.',
    roadmap: 'Tests visualization, drawing, creative ability, and logical reasoning.'
  },
  {
    id: 'add22', name: 'National Institute of Fashion Technology Entrance', shortName: 'NIFT', category: 'Postgraduate Engineering', level: 'UG', conductedBy: 'NIFT',
    examDate: 'February',
    description: 'Entrance exam for undergraduate and postgraduate programs in Fashion Technology and Design.',
    eligibility: '10+2 for UG; Bachelor\'s degree for PG.',
    roadmap: 'Includes Creative Ability Test (CAT), General Ability Test (GAT), and a Situation Test/Group Discussion.'
  },
  {
    id: 'add23', name: 'IRMAS Admission Test (IRMAT)', shortName: 'IRMAT', category: 'Management (MBA)', level: 'PG', conductedBy: 'IRMA',
    examDate: 'January/Feb',
    description: 'Test for admission to the Post Graduate Diploma in Rural Management (PGDRM).',
    eligibility: 'Bachelor\'s degree.',
    roadmap: 'Focuses on issues of social concern, rural development, and general awareness.'
  },
  {
    id: 'add24', name: 'Bhabha Atomic Research Centre (BARC) Exam', shortName: 'BARC OCES/DGFS', category: 'Postgraduate Engineering', level: 'PG', conductedBy: 'BARC',
    examDate: 'March/April',
    description: 'Recruitment of Scientific Officers through the Orientation Course for Engineering Graduates and Science Postgraduates (OCES).',
    eligibility: 'B.E./B.Tech or M.Sc. in relevant discipline.',
    roadmap: 'Intensely technical exam followed by a high-stakes interview. Known for its difficulty.'
  },
  {
    id: 'add25', name: 'Indian Space Research Organisation (ISRO) Exam', shortName: 'ISRO Scientist/Engineer', category: 'Postgraduate Engineering', level: 'Govt', conductedBy: 'ISRO',
    examDate: 'Varies',
    description: 'Recruitment of Scientist/Engineer positions in ISRO centers.',
    eligibility: 'B.E./B.Tech in a relevant branch (e.g., Electronics, Mechanical).',
    roadmap: 'Highly competitive written test followed by an interview. Focus on fundamental engineering concepts.'
  },
  {
    id: 'add26', name: 'State PSC - MPSC', shortName: 'MPSC', category: 'UPSC & Civil Services', level: 'Govt', conductedBy: 'MPSC',
    examDate: 'Varies',
    description: 'Civil services exam for recruitment into various state services in Maharashtra.',
    eligibility: 'Bachelor\'s degree.',
    roadmap: 'Similar structure to UPSC but with a significant focus on Maharashtra-specific history, culture, and economy.'
  },
  {
    id: 'add27', name: 'Graduate Record Examinations (GRE) - India Test Centers', shortName: 'GRE', category: 'Postgraduate Engineering', level: 'PG', conductedBy: 'ETS',
    examDate: 'Year-round',
    description: 'Standardized test for admission to graduate schools abroad and increasingly accepted by Indian universities for PG programs.',
    eligibility: 'Varies per university.',
    roadmap: 'Focus on Verbal Reasoning, Quantitative Reasoning, and Analytical Writing.'
  },
  {
    id: 'add28', name: 'Common Proficiency Test (CPT) / Foundation (Now CA Foundation)', shortName: 'CA Foundation', category: 'Banking & Finance', level: 'Professional', conductedBy: 'ICAI',
    examDate: 'May & Nov',
    description: 'The entry-level examination for the Chartered Accountancy course.',
    eligibility: '10+2 examination.',
    roadmap: 'Covers Principles and Practice of Accounting, Business Laws, Quantitative Aptitude, and Business Economics.'
  },
  {
    id: 'add29', name: 'Common Law Admission Test (CLAT) - AILET', shortName: 'AILET', category: 'Law Entrance', level: 'UG', conductedBy: 'NLU Delhi',
    examDate: 'December',
    description: 'Entrance test for B.A.LL.B. (Hons.), LL.M., and Ph.D. programs at National Law University, Delhi (NLU Delhi).',
    eligibility: '10+2 or equivalent examination. No upper age limit.',
    roadmap: 'Similar to CLAT but with a different paper pattern and higher focus on critical reasoning.'
  },
  {
    id: 'add30', name: 'UPSC Combined Medical Services Examination', shortName: 'UPSC CMS', category: 'Medical Entrance', level: 'Govt', conductedBy: 'UPSC',
    examDate: 'July',
    description: 'Recruitment for medical officers in government organizations like Indian Railways and Municipal Corporations.',
    eligibility: 'MBBS degree.',
    roadmap: 'Written test focuses on Medicine, Surgery, Pediatrics, Gynaecology, and Preventive Social Medicine.'
  },
  {
    id: 'add31', name: 'State Teacher Eligibility Test (TET)', shortName: 'State TET', category: 'Teaching & Research', level: 'Govt', conductedBy: 'State Govt Agencies',
    examDate: 'Varies',
    description: 'Mandatory exam for teaching jobs in government and private schools at the state level.',
    eligibility: 'B.Ed. or relevant teaching diploma.',
    roadmap: 'Syllabus is state-specific, focusing on state curriculum and local languages.'
  },
  {
    id: 'add32', name: 'Railway Recruitment Board Group D', shortName: 'RRB Group D', category: 'SSC & Railways', level: 'Govt', conductedBy: 'RRB',
    examDate: 'Varies',
    description: 'Recruitment for various technical and non-technical posts in Level 1 of the 7th CPC Pay Matrix in Indian Railways.',
    eligibility: '10th pass or ITI equivalent.',
    roadmap: 'Focuses on General Science, Mathematics, General Intelligence & Reasoning, and General Awareness/Current Affairs.'
  },
  {
    id: 'add33', name: 'National Eligibility Test (NET) for Management', shortName: 'UGC NET Management', category: 'Teaching & Research', level: 'PG', conductedBy: 'NTA',
    examDate: 'June & Dec',
    description: 'UGC NET specifically for those seeking Assistant Professor/JRF in Management subjects.',
    eligibility: 'Master\'s Degree in Management/Commerce.',
    roadmap: 'Paper II requires specialization in management disciplines like Marketing, Finance, HR.'
  },
  {
    id: 'add34', name: 'Indian Statistical Service Examination', shortName: 'UPSC ISS', category: 'UPSC & Civil Services', level: 'Govt', conductedBy: 'UPSC',
    examDate: 'June',
    description: 'Recruitment for Grade IV officers in the Indian Statistical Service.',
    eligibility: 'Post-graduate degree in Statistics/Mathematical Statistics/Applied Statistics.',
    roadmap: 'High-level, theory-heavy exam focusing purely on Statistical subjects.'
  },
  {
    id: 'add35', name: 'AFCAT Ground Duty (Technical)', shortName: 'AFCAT Tech', category: 'Defense & Paramilitary', level: 'PG', conductedBy: 'Indian Air Force',
    examDate: 'Feb & Aug',
    description: 'Specific technical entry scheme for engineering graduates in the Air Force Ground Duty branch.',
    eligibility: 'B.E./B.Tech in relevant engineering discipline.',
    roadmap: 'Includes the Engineering Knowledge Test (EKT) along with the standard AFCAT written paper.'
  },
  {
    id: 'add36', name: 'Foreign Trade (IIFT) Entrance Exam', shortName: 'IIFT Entrance', category: 'Management (MBA)', level: 'PG', conductedBy: 'NTA',
    examDate: 'December',
    description: 'Entrance exam for the MBA (International Business) program at the Indian Institute of Foreign Trade.',
    eligibility: 'Bachelor\'s degree.',
    roadmap: 'Known for its unique General Knowledge section with an international business focus.'
  },
  {
    id: 'add37', name: 'TISS National Entrance Test (TISSNET)', shortName: 'TISSNET', category: 'Management (MBA)', level: 'PG', conductedBy: 'TISS',
    examDate: 'January',
    description: 'Entrance test for MA programs at the Tata Institute of Social Sciences, including HRM & Labour Relations.',
    eligibility: 'Bachelor\'s degree.',
    roadmap: 'Focuses on General Awareness, English Proficiency, and Mathematical & Logical Reasoning. High weightage on social awareness.'
  },
  {
    id: 'add38', name: 'Insurance: LIC AAO', shortName: 'LIC AAO', category: 'Banking & Finance', level: 'Govt', conductedBy: 'LIC',
    examDate: 'Varies',
    description: 'Recruitment of Assistant Administrative Officers (AAO) in the Life Insurance Corporation of India.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Prelims (English, Reasoning, Quant) and Mains (Professional Knowledge, Insurance & Financial Market Awareness).'
  },
  {
    id: 'add39', name: 'Insurance: NIACL AO', shortName: 'NIACL AO', category: 'Banking & Finance', level: 'Govt', conductedBy: 'NIACL',
    examDate: 'Varies',
    description: 'Recruitment of Administrative Officers (AO) in the New India Assurance Co. Ltd.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Focus on English, Reasoning, Quant, and General Awareness with special attention to the Insurance sector.'
  },
  {
    id: 'add40', name: 'Engineering: VITEEE', shortName: 'VITEEE', category: 'Engineering Entrance', level: 'UG', conductedBy: 'VIT University',
    examDate: 'April',
    description: 'Entrance test for undergraduate engineering programs at VIT Vellore and other campuses.',
    eligibility: '10+2 with PCM/PCB.',
    roadmap: 'Computer-based test covering Physics, Chemistry, Mathematics/Biology, English, and Aptitude.'
  },
  // Adding the final 10 to cross 50
  {
    id: 'add41', name: 'National Council for Hotel Management Joint Entrance Exam', shortName: 'NCHM JEE', category: 'Management (MBA)', level: 'UG', conductedBy: 'NTA',
    examDate: 'May/June',
    description: 'Entrance exam for admission to B.Sc. in Hospitality & Hotel Administration programs.',
    eligibility: '10+2 or equivalent.',
    roadmap: 'Tests Numerical Ability, Reasoning, General Knowledge, English, and Service Aptitude.'
  },
  {
    id: 'add42', name: 'Indian Institute of Technology Joint Entrance Exam (HSEE)', shortName: 'IIT HSEE', category: 'Law Entrance', level: 'UG', conductedBy: 'IIT Madras',
    examDate: 'April',
    description: 'Entrance exam for the five-year integrated M.A. program in Humanities and Social Sciences.',
    eligibility: '10+2 or equivalent.',
    roadmap: 'Tests English, Comprehension, Analytical Ability, and General Studies (History/Geography).'
  },
  {
    id: 'add43', name: 'Joint Entrance Screening Test', shortName: 'JEST', category: 'Postgraduate Engineering', level: 'PG', conductedBy: 'Science Institutes',
    examDate: 'February',
    description: 'Entrance exam for Ph.D. and Integrated Ph.D. programs in Physics and Theoretical Computer Science.',
    eligibility: 'M.Sc./M.Tech/B.Tech in relevant subjects.',
    roadmap: 'Highly specialized physics/science-based exam.'
  },
  {
    id: 'add44', name: 'National Eligibility cum Entrance Test (Super Specialty)', shortName: 'NEET SS', category: 'Medical Entrance', level: 'PG', conductedBy: 'NBE',
    examDate: 'Varies',
    description: 'Entrance exam for admission to DM/MCh (Super Specialty) courses.',
    eligibility: 'Postgraduate medical degree (MD/MS/DNB).',
    roadmap: 'Exhaustive test focusing on the respective super-specialty subject.'
  },
  {
    id: 'add45', name: 'SSC Central Police Organisation (CPO)', shortName: 'SSC CPO', category: 'Defense & Paramilitary', level: 'Govt', conductedBy: 'SSC',
    examDate: 'Varies',
    description: 'Recruitment of Sub-Inspectors in Delhi Police, CAPFs, and Assistant Sub-Inspectors in CISF.',
    eligibility: 'Bachelor\'s degree and physical/medical standards.',
    roadmap: 'Written exam followed by Physical Standard Test (PST) and Physical Endurance Test (PET).'
  },
  {
    id: 'add46', name: 'AP EAMCET (Engineering)', shortName: 'AP EAMCET', category: 'Engineering Entrance', level: 'UG', conductedBy: 'AP State Council of Higher Education',
    examDate: 'April/May',
    description: 'State-level entrance exam for professional courses in Andhra Pradesh, including engineering.',
    eligibility: '10+2 or equivalent with relevant subjects and domicile requirements.',
    roadmap: 'Focus on Andhra Pradesh intermediate syllabus.'
  },
  {
    id: 'add47', name: 'TS EAMCET (Engineering)', shortName: 'TS EAMCET', category: 'Engineering Entrance', level: 'UG', conductedBy: 'Telangana State Council of Higher Education',
    examDate: 'April/May',
    description: 'State-level entrance exam for professional courses in Telangana, including engineering.',
    eligibility: '10+2 or equivalent with relevant subjects and domicile requirements.',
    roadmap: 'Focus on Telangana state intermediate syllabus.'
  },
  {
    id: 'add48', name: 'Common University Entrance Test (CUET) UG', shortName: 'CUET UG', category: 'Teaching & Research', level: 'UG', conductedBy: 'NTA',
    examDate: 'May',
    description: 'Entrance test for admission to undergraduate programs in all Central Universities and participating universities.',
    eligibility: '10+2 or equivalent.',
    roadmap: 'Tests domain-specific knowledge, general test, and languages. Focus on NCERT syllabus.'
  },
  {
    id: 'add49', name: 'LIC ADO', shortName: 'LIC ADO', category: 'Banking & Finance', level: 'Govt', conductedBy: 'LIC',
    examDate: 'Varies',
    description: 'Recruitment of Apprentice Development Officers (ADO) in the Life Insurance Corporation of India.',
    eligibility: 'Bachelor\'s degree in any discipline.',
    roadmap: 'Focus on English, Reasoning, Quant, and Insurance & Financial Market Awareness.'
  },
  {
    id: 'add50', name: 'RRB ALP (Assistant Loco Pilot)', shortName: 'RRB ALP', category: 'SSC & Railways', level: 'Govt', conductedBy: 'RRB',
    examDate: 'Varies',
    description: 'Recruitment for Assistant Loco Pilot positions in Indian Railways.',
    eligibility: 'Matriculation/ITI or equivalent/Diploma/Degree in Engineering.',
    roadmap: 'Multi-stage CBTs focusing on mathematics, reasoning, general science, and basic engineering knowledge.'
  },
  {
    id: 'add51', name: 'All India Bar Examination', shortName: 'AIBE', category: 'Law Entrance', level: 'Professional', conductedBy: 'Bar Council of India',
    examDate: 'Varies',
    description: 'An examination conducted to certify practicing advocates in India.',
    eligibility: 'LL.B. degree.',
    roadmap: 'Open-book exam focused on professional ethics and key legal principles.'
  },
];

// --- 3. COMPONENT IMPLEMENTATION ---

const ALL_CATEGORIES: Category[] = [
  'Engineering Entrance', 'Medical Entrance', 'UPSC & Civil Services', 'Banking & Finance',
  'SSC & Railways', 'Defense & Paramilitary', 'Law Entrance', 'Management (MBA)',
  'Postgraduate Engineering', 'Teaching & Research'
];

// Helper component for detailed view icons
const DetailIcon = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <div className="flex items-center text-sm font-medium text-gray-700 p-2 bg-gray-50 rounded-lg">
    <Icon className="w-4 h-4 mr-2 text-indigo-600" />
    {text}
  </div>
);

// Main Component
const Exams: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Memoized filtered and sorted list
  const filteredExams = useMemo(() => {
    let list = MOCK_EXAMS;

    // 1. Category Filtering
    if (selectedCategories.length > 0) {
      list = list.filter(exam => selectedCategories.includes(exam.category));
    }

    // 2. Search Filtering
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      list = list.filter(exam =>
        exam.name.toLowerCase().includes(lowerCaseSearch) ||
        exam.shortName.toLowerCase().includes(lowerCaseSearch) ||
        exam.description.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 3. Sort by Name
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, selectedCategories]);

  // Toggle category selection
  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleOpenDetail = (exam: Exam) => {
    setSelectedExam(exam);
    // Scroll to top on mobile for better focus
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- UI Components ---

  const CategoryFilters = () => (
    <div className="flex flex-wrap gap-2 p-4 bg-white shadow-lg rounded-xl mb-6">
      <h3 className="w-full text-lg font-semibold text-gray-800 mb-2 flex items-center">
        <Filter className="w-5 h-5 mr-2 text-indigo-500" />
        Filter by Stream:
      </h3>
      {ALL_CATEGORIES.map(category => {
        const isSelected = selectedCategories.includes(category);
        return (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`
              px-4 py-2 text-sm rounded-full transition-all duration-200 ease-in-out
              ${isSelected
                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }
            `}
          >
            {category}
          </button>
        );
      })}
      {selectedCategories.length > 0 && (
        <button
          onClick={() => setSelectedCategories([])}
          className="ml-auto px-4 py-2 text-sm text-red-600 bg-red-100 rounded-full hover:bg-red-200 flex items-center"
        >
          <X className="w-4 h-4 mr-1" /> Clear Filters ({selectedCategories.length})
        </button>
      )}
    </div>
  );

  const SearchBar = () => (
    <div className="relative mb-6 shadow-xl rounded-xl">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
      <input
        type="text"
        placeholder="Search for JEE, UPSC, NEET, or any exam..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-4 pl-12 pr-6 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg placeholder-gray-500"
      />
    </div>
  );

  const ExamCard = ({ exam }: { exam: Exam }) => (
    <div
      onClick={() => handleOpenDetail(exam)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer p-6 border-t-4 border-indigo-600"
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {exam.category}
        </span>
        <ZapIcon className="w-5 h-5 text-yellow-500" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-3">{exam.name}</h2>
      <p className="text-sm text-gray-500 mb-4">{exam.shortName}</p>

      <p className="text-gray-600 line-clamp-2">{exam.description}</p>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
        <DetailIcon icon={GraduationCap} text={exam.level} />
        <DetailIcon icon={Clock} text={exam.examDate} />
      </div>
    </div>
  );

  const DetailedView = ({ exam }: { exam: Exam }) => (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto transform transition-all duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-indigo-700 text-white p-6 rounded-t-2xl flex justify-between items-center z-10 shadow-lg">
          <div>
            <span className="text-sm font-medium opacity-80">{exam.category} - {exam.level}</span>
            <h1 className="text-3xl font-extrabold mt-1">{exam.name} ({exam.shortName})</h1>
          </div>
          <button
            onClick={() => setSelectedExam(null)}
            className="p-3 rounded-full bg-indigo-800 hover:bg-indigo-900 transition-colors"
            aria-label="Close details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8">
          {/* Summary Section */}
          <section className="p-6 bg-indigo-50 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-3" /> Overview
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">{exam.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm font-medium">
              <DetailIcon icon={MapPin} text={`Conducted By: ${exam.conductedBy}`} />
              <DetailIcon icon={Clock} text={`Exam Schedule: ${exam.examDate}`} />
              <DetailIcon icon={Users} text={`Level: ${exam.level}`} />
            </div>
          </section>

          {/* Eligibility Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-200 pb-2 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
              Eligibility Criteria
            </h2>
            <div className="text-gray-700 bg-white p-4 rounded-xl border border-gray-200">
              <p className="whitespace-pre-wrap">{exam.eligibility}</p>
            </div>
          </section>

          {/* Roadmap Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-200 pb-2 flex items-center">
              <Briefcase className="w-6 h-6 mr-3 text-yellow-600" />
              Preparation Roadmap & Strategy
            </h2>
            <div className="bg-white p-6 rounded-xl border-l-4 border-yellow-500 shadow-md">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{exam.roadmap}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <script src="https://cdn.tailwindcss.com"></script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Header */}
      <header className="bg-white shadow-lg py-6 sticky top-0 z-40 border-b border-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center">
            <GraduationCap className="w-8 h-8 mr-3" />
            India Exam Navigator
          </h1>
          <p className="text-gray-500 mt-1">Your guide to 50+ major competitive examinations across India.</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar />
        <CategoryFilters />

        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Showing {filteredExams.length} Exams
            {selectedCategories.length > 0 && (
              <span className="text-lg font-normal text-indigo-600 ml-2">
                in {selectedCategories.join(', ')}
              </span>
            )}
            .
          </h2>
          <p className="text-gray-500">{filteredExams.length === 0 ? 'Try broadening your search or clearing filters.' : 'Click on any card for detailed eligibility and roadmap information.'}</p>
        </div>

        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExams.length > 0 ? (
            filteredExams.map(exam => <ExamCard key={exam.id} exam={exam} />)
          ) : (
            <div className="col-span-full text-center p-12 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
              <Filter className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p className="text-xl font-medium text-gray-600">No exams match your current filters or search query.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategories([]); }}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Detailed Modal View */}
      {selectedExam && <DetailedView exam={selectedExam} />}
    </div>
  );
};

export default Exams;