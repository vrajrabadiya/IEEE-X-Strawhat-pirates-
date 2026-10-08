/**
 * UniPilot - Grounded Campus Knowledge Base (IEEE Hackathon PS-3)
 * Comprehensive, realistic university rules, regulations, and guidelines.
 */

export const CAMPUS_KNOWLEDGE_BASE = `
=== ACADEMIC REGULATIONS 2026 ===
[Academic Regs §4.1] Working Hours: Academic sessions run Monday to Friday from 9:00 AM to 5:00 PM.
[Academic Regs §4.2] Attendance Requirement: A minimum of 75% attendance across lectures, tutorials, and practicals is mandatory to be eligible for end-semester examinations.
[Academic Regs §4.3] Attendance Condonation: Students with attendance between 65% and 74.9% may apply for medical condonation waiver by submitting Form Med-A and authentic medical certificates to the Dean's Office within 3 working days of resumption. Condonation fee is Rs. 500 per subject.
[Academic Regs §4.4] Debarment: Students with attendance strictly below 65% are categorically debarred from sitting for semester examinations and must re-register for the course during remedial cycles.
[Academic Regs §4.5] Makeup Labs: Missed laboratory experiments must be compensated within the same academic cycle with written consent from the Course Faculty and HoD.
[Academic Regs §4.6] Minimum CGPA for Degree: A cumulative grade point average (CGPA) of at least 5.0 with zero outstanding backlogs is mandatory for the award of Bachelor of Technology degrees.
[Academic Regs §4.7] Elective Course Add/Drop: Students may officially add or drop elective courses within the first 10 instructional days of each semester through the Academic ERP portal.

=== EXAMINATION GUIDELINES OCT 2026 ===
[Exam Guidelines §2.1] Hall Ticket Eligibility: Students can download the examination admit card from the university portal only after clearing outstanding library dues, lab breakages, and hostel mess dues.
[Exam Guidelines §2.2] Grading System: Relative grading scale from O (Outstanding, 10 grade points) down to F (Fail, 0 grade points). Minimum passing grade is E (4 grade points).
[Exam Guidelines §2.3] Backlog & Remedial: Remedial supplementary examinations are conducted between semesters. A maximum of 4 backlogs can be carried forward to the subsequent academic year.
[Exam Guidelines §2.4] Re-Evaluation: Students may request re-evaluation of answer scripts within 7 days of result declaration by paying a non-refundable scrutiny fee of Rs. 300 per paper.
[Exam Guidelines §2.5] Malpractice Penalties: Possession of unauthorized paper, digital notes, smartwatches, or mobile phones inside the examination hall attracts immediate confiscation and debarment for a minimum of 2 consecutive examination cycles.
[Exam Guidelines §2.6] Grade Improvement Scheme: Students securing grade D or E in any course may apply to retake the course examination for grade improvement in the immediately succeeding semester.

=== CAMPUS FACILITIES & HOSTEL MANUAL ===
[Hostel Manual §1.1] Curfew Timings: The university main gates and hostel in-time is strictly 9:30 PM.
[Hostel Manual §1.2] Late Gate Pass: Late entry past 9:30 PM requires a digital gate pass approved by the Hostel Warden before 6:00 PM on the same date.
[Hostel Manual §1.3] Overnight Leave: Weekend or overnight home leave requests must be submitted digitally with parental verification 24 hours prior.
[Hostel Manual §1.4] Mess Dining Hours:
- Breakfast: 7:30 AM – 9:00 AM
- Lunch: 12:30 PM – 2:00 PM
- High Tea: 5:00 PM – 6:00 PM
- Dinner: 7:30 PM – 9:30 PM
[Hostel Manual §1.5] Prohibited Electrical Appliances: High-power appliances including electric irons, immersion water heaters, induction cooktops, and air-fryers are prohibited in student rooms. A fine of Rs. 1,000 is levied upon violation.
[Hostel Manual §1.6] Room Allotment & Transfers: Mutual hostel room exchange requests are evaluated solely at the end of the odd semester through the Office of the Chief Warden.

=== IEEE STUDENT BRANCH ACTIVITIES 2026 ===
[IEEE Notice §3.1] IEEE Day Hackathon 2026: An offline 4-hour sprint challenge held at the University Computing Labs. Problem statements cover University Repository (PS1), Career Profile (PS2), and Student Chatbot (PS3).
[IEEE Notice §3.2] IEEE Membership Benefits: Members receive subsidized registration fees for technical workshops, access to IEEE Xplore digital library papers, and preferential slots in global technical symposiums.
[IEEE Notice §3.3] Student Branch Executive Committee: Branch Counselor: Dr. Academic Advisor; Chair: Final Year Lead; Tech Lead: CSE Associate. Official contact: ieee-sb@university.edu.
[IEEE Notice §3.4] Project Showcase & Grants: The IEEE Student Branch allocates competitive micro-grants up to Rs. 15,000 for verified student research prototypes and open-source contributions.
[IEEE Notice §3.5] Volunteering Recognition: Student branch volunteers completing 25+ verified event support hours are awarded IEEE Service Excellence Certificates recognized for co-curricular credits.

=== LIBRARY & DIGITAL RESOURCES ===
[Library Policy §5.1] Book Borrowing Quotas: Undergraduate students are entitled to borrow up to 4 books for 14 calendar days. Postgraduate students and research scholars may borrow up to 6 books for 28 days.
[Library Policy §5.2] Overdue Penalties: An overdue fine of Rs. 5 per day per book applies for the first 7 overdue days, escalating to Rs. 10 per day thereafter.
[Library Policy §5.3] Digital Repositories & Databases: University credentials provide remote federated access to IEEE Xplore, ScienceDirect, ACM Digital Library, and SpringerNature via the University EZProxy service.
[Library Policy §5.4] Discussion Rooms & Reading Hours: The central library main reading hall remains open 24/7 during final examination weeks. Acoustic discussion rooms require prior reservation on the LibCal system.

=== PLACEMENT, INTERNSHIPS & CAREER CELL ===
[Placement Cell §6.1] Eligibility Criteria: Students must possess a minimum CGPA of 6.5 with zero active backlogs to register for Day-1 campus placement drives.
[Placement Cell §6.2] Dream Company Policy: Upon securing an initial campus placement offer exceeding Rs. 10 LPA, a candidate is eligible only for higher-tier Marquee placement drives (offers exceeding Rs. 20 LPA).
[Placement Cell §6.3] Internship NOC: Mandatory summer or semester-long corporate internships require an official No Objection Certificate (NOC) signed jointly by the Head of Department and the Training & Placement Officer.

=== STUDENT WELFARE, HEALTH & GRIEVANCE ===
[Welfare & Ethics §7.1] Anti-Ragging Strict Policy: The university adheres to zero tolerance regarding ragging in any form. Offenses incur immediate expulsion and police FIR under statutory law. 24/7 Helpline: 1800-180-5522.
[Welfare & Ethics §7.2] Internal Complaints Committee (ICC): Confidential grievances regarding sexual harassment or gender discrimination should be addressed to the Presiding Officer via icc-redressal@university.edu.
[Health & Emergency §8.1] 24/7 Health Clinic: The campus health center provides round-the-clock emergency medical first aid, certified doctors, and free basic pharmaceutical supplies.
[Health & Emergency §8.2] Campus Ambulance SOS: Immediate campus medical emergency ambulance can be dispatched via hotlines +91 99999 11222 or Campus Intercom #108.
`;

export interface FAQItem {
  id: string;
  category: 'Academic' | 'Examinations' | 'Hostel' | 'IEEE Branch' | 'Library' | 'Placements' | 'Health & Safety';
  sectionCode: string;
  question: string;
  answer: string;
  keywords: string[];
}

export const CAMPUS_FAQS: FAQItem[] = [
  {
    id: 'acad-hours',
    category: 'Academic',
    sectionCode: 'Academic Regs §4.1',
    question: 'What are the daily academic working hours?',
    answer: 'Academic sessions run Monday to Friday from 9:00 AM to 5:00 PM.',
    keywords: ['working hours', 'timings', 'class timings', 'schedule', 'college hours'],
  },
  {
    id: 'acad-attendance',
    category: 'Academic',
    sectionCode: 'Academic Regs §4.2',
    question: 'What is the minimum mandatory attendance requirement?',
    answer: 'A minimum of 75% attendance across lectures, tutorials, and practicals is mandatory to be eligible for end-semester examinations.',
    keywords: ['attendance', '75 percent', 'attendance requirement', 'mandatory attendance'],
  },
  {
    id: 'acad-condonation',
    category: 'Academic',
    sectionCode: 'Academic Regs §4.3',
    question: 'How can a student apply for medical attendance condonation?',
    answer: 'Students with attendance between 65% and 74.9% may apply for medical condonation waiver by submitting Form Med-A and authentic medical certificates to the Dean\'s Office within 3 working days of resumption. Condonation fee is Rs. 500 per subject.',
    keywords: ['condonation', 'medical certificate', 'med-a', 'medical waiver', 'short attendance'],
  },
  {
    id: 'acad-debarment',
    category: 'Academic',
    sectionCode: 'Academic Regs §4.4',
    question: 'What happens if attendance drops below 65%?',
    answer: 'Students with attendance strictly below 65% are categorically debarred from sitting for semester examinations and must re-register for the course during remedial cycles.',
    keywords: ['debarred', 'below 65', 'debarment', 're-register', 'course repeat'],
  },
  {
    id: 'acad-makeuplabs',
    category: 'Academic',
    sectionCode: 'Academic Regs §4.5',
    question: 'What is the procedure for making up missed lab experiments?',
    answer: 'Missed laboratory experiments must be compensated within the same academic cycle with written consent from the Course Faculty and HoD.',
    keywords: ['makeup lab', 'missed lab', 'practical', 'lab compensation'],
  },
  {
    id: 'acad-cgpa-degree',
    category: 'Academic',
    sectionCode: 'Academic Regs §4.6',
    question: 'What is the minimum CGPA required for degree conferral?',
    answer: 'A cumulative grade point average (CGPA) of at least 5.0 with zero outstanding backlogs is mandatory for the award of Bachelor of Technology degrees.',
    keywords: ['minimum cgpa', 'degree eligibility', 'pass criteria', 'graduation'],
  },
  {
    id: 'exam-hallticket',
    category: 'Examinations',
    sectionCode: 'Exam Guidelines §2.1',
    question: 'How and when can I download my examination hall ticket?',
    answer: 'Students can download the examination admit card from the university portal only after clearing outstanding library dues, lab breakages, and hostel mess dues.',
    keywords: ['hall ticket', 'admit card', 'clearance', 'dues', 'exam portal'],
  },
  {
    id: 'exam-grading',
    category: 'Examinations',
    sectionCode: 'Exam Guidelines §2.2',
    question: 'What grading scale does the university follow?',
    answer: 'Relative grading scale from O (Outstanding, 10 grade points) down to F (Fail, 0 grade points). Minimum passing grade is E (4 grade points).',
    keywords: ['grading system', 'grade points', 'passing marks', 'scale', 'grade o'],
  },
  {
    id: 'exam-backlog',
    category: 'Examinations',
    sectionCode: 'Exam Guidelines §2.3',
    question: 'How many backlogs are allowed to carry forward to the next year?',
    answer: 'Remedial supplementary examinations are conducted between semesters. A maximum of 4 backlogs can be carried forward to the subsequent academic year.',
    keywords: ['backlog', 'remedial', 'supplementary', 'carry forward backlogs', 'arrears'],
  },
  {
    id: 'exam-reeval',
    category: 'Examinations',
    sectionCode: 'Exam Guidelines §2.4',
    question: 'How can I apply for re-evaluation of my exam papers?',
    answer: 'Students may request re-evaluation of answer scripts within 7 days of result declaration by paying a non-refundable scrutiny fee of Rs. 300 per paper.',
    keywords: ['re-evaluation', 'reevaluation', 'rechecking', 'scrutiny', 'answer script'],
  },
  {
    id: 'exam-malpractice',
    category: 'Examinations',
    sectionCode: 'Exam Guidelines §2.5',
    question: 'What are the consequences of examination malpractice?',
    answer: 'Possession of unauthorized paper, digital notes, smartwatches, or mobile phones inside the examination hall attracts immediate confiscation and debarment for a minimum of 2 consecutive examination cycles.',
    keywords: ['malpractice', 'cheating', 'phone in exam', 'unfair means', 'ufr'],
  },
  {
    id: 'hostel-curfew',
    category: 'Hostel',
    sectionCode: 'Hostel Manual §1.1',
    question: 'What is the hostel gate curfew timing?',
    answer: 'The university main gates and hostel in-time is strictly 9:30 PM.',
    keywords: ['curfew', 'gate timing', 'in time', 'hostel timing', 'night closing'],
  },
  {
    id: 'hostel-latepass',
    category: 'Hostel',
    sectionCode: 'Hostel Manual §1.2',
    question: 'How do I obtain a late entry pass past curfew?',
    answer: 'Late entry past 9:30 PM requires a digital gate pass approved by the Hostel Warden before 6:00 PM on the same date.',
    keywords: ['late pass', 'gate pass', 'late entry', 'warden permission'],
  },
  {
    id: 'hostel-overnight',
    category: 'Hostel',
    sectionCode: 'Hostel Manual §1.3',
    question: 'What is the process for weekend or overnight home leave?',
    answer: 'Weekend or overnight home leave requests must be submitted digitally with parental verification 24 hours prior.',
    keywords: ['night out', 'home leave', 'overnight pass', 'parent verification', 'weekend leave'],
  },
  {
    id: 'hostel-mess',
    category: 'Hostel',
    sectionCode: 'Hostel Manual §1.4',
    question: 'What are the hostel mess timings for meals?',
    answer: 'Breakfast: 7:30 AM – 9:00 AM; Lunch: 12:30 PM – 2:00 PM; High Tea: 5:00 PM – 6:00 PM; Dinner: 7:30 PM – 9:30 PM.',
    keywords: ['mess timings', 'breakfast', 'lunch', 'dinner', 'food hours', 'canteen'],
  },
  {
    id: 'hostel-appliances',
    category: 'Hostel',
    sectionCode: 'Hostel Manual §1.5',
    question: 'Are electric heaters or irons allowed in hostel rooms?',
    answer: 'High-power appliances including electric irons, immersion water heaters, induction cooktops, and air-fryers are prohibited in student rooms. A fine of Rs. 1,000 is levied upon violation.',
    keywords: ['heaters', 'electric iron', 'appliances', 'kettle', 'induction', 'prohibited items'],
  },
  {
    id: 'ieee-hackathon',
    category: 'IEEE Branch',
    sectionCode: 'IEEE Notice §3.1',
    question: 'What is the IEEE Day Hackathon 2026 format and focus?',
    answer: 'An offline 4-hour sprint challenge held at the University Computing Labs. Problem statements cover University Repository (PS1), Career Profile (PS2), and Student Chatbot (PS3).',
    keywords: ['ieee hackathon', 'ps-3', 'ps-1', 'ps-2', 'problem statement', 'hackathon rules'],
  },
  {
    id: 'ieee-benefits',
    category: 'IEEE Branch',
    sectionCode: 'IEEE Notice §3.2',
    question: 'What benefits do IEEE student members receive?',
    answer: 'Members receive subsidized registration fees for technical workshops, access to IEEE Xplore digital library papers, and preferential slots in global technical symposiums.',
    keywords: ['ieee benefits', 'xplore', 'discount', 'membership', 'symposium'],
  },
  {
    id: 'ieee-execom',
    category: 'IEEE Branch',
    sectionCode: 'IEEE Notice §3.3',
    question: 'Who are the IEEE Student Branch leaders and what is their contact?',
    answer: 'Branch Counselor: Dr. Academic Advisor; Chair: Final Year Lead; Tech Lead: CSE Associate. Official contact: ieee-sb@university.edu.',
    keywords: ['ieee contact', 'chair', 'execom', 'counselor', 'email'],
  },
  {
    id: 'ieee-grants',
    category: 'IEEE Branch',
    sectionCode: 'IEEE Notice §3.4',
    question: 'Does the IEEE Student Branch provide funding for student projects?',
    answer: 'The IEEE Student Branch allocates competitive micro-grants up to Rs. 15,000 for verified student research prototypes and open-source contributions.',
    keywords: ['project funding', 'grants', 'research funds', 'micro grant', 'hardware funding'],
  },
  {
    id: 'lib-quota',
    category: 'Library',
    sectionCode: 'Library Policy §5.1',
    question: 'How many books can a student issue from the central library?',
    answer: 'Undergraduate students are entitled to borrow up to 4 books for 14 calendar days. Postgraduate students and research scholars may borrow up to 6 books for 28 days.',
    keywords: ['library books', 'book quota', 'borrow books', 'issue limit'],
  },
  {
    id: 'lib-fine',
    category: 'Library',
    sectionCode: 'Library Policy §5.2',
    question: 'What is the fine for overdue library books?',
    answer: 'An overdue fine of Rs. 5 per day per book applies for the first 7 overdue days, escalating to Rs. 10 per day thereafter.',
    keywords: ['library fine', 'late fee', 'overdue fee', 'book fine'],
  },
  {
    id: 'lib-xplore',
    category: 'Library',
    sectionCode: 'Library Policy §5.3',
    question: 'How do students access IEEE Xplore and scientific journals remotely?',
    answer: 'University credentials provide remote federated access to IEEE Xplore, ScienceDirect, ACM Digital Library, and SpringerNature via the University EZProxy service.',
    keywords: ['ieee xplore', 'research papers', 'ezproxy', 'remote library', 'sciencedirect'],
  },
  {
    id: 'place-cgpa',
    category: 'Placements',
    sectionCode: 'Placement Cell §6.1',
    question: 'What is the minimum eligibility for Day-1 campus placement drives?',
    answer: 'Students must possess a minimum CGPA of 6.5 with zero active backlogs to register for Day-1 campus placement drives.',
    keywords: ['placement eligibility', 'day 1', 'cgpa for placement', 'tpo criteria'],
  },
  {
    id: 'place-dream',
    category: 'Placements',
    sectionCode: 'Placement Cell §6.2',
    question: 'What is the university\'s "Dream Company" placement policy?',
    answer: 'Upon securing an initial campus placement offer exceeding Rs. 10 LPA, a candidate is eligible only for higher-tier Marquee placement drives (offers exceeding Rs. 20 LPA).',
    keywords: ['dream offer', 'one offer rule', 'marquee', 'placement policy', 'multiple offers'],
  },
  {
    id: 'place-noc',
    category: 'Placements',
    sectionCode: 'Placement Cell §6.3',
    question: 'How do I obtain a No Objection Certificate (NOC) for an internship?',
    answer: 'Mandatory summer or semester-long corporate internships require an official No Objection Certificate (NOC) signed jointly by the Head of Department and the Training & Placement Officer.',
    keywords: ['internship noc', 'noc letter', 'summer internship', 'training and placement'],
  },
  {
    id: 'welfare-antiragging',
    category: 'Health & Safety',
    sectionCode: 'Welfare & Ethics §7.1',
    question: 'What is the university anti-ragging policy and helpline?',
    answer: 'The university adheres to zero tolerance regarding ragging in any form. Offenses incur immediate expulsion and police FIR under statutory law. 24/7 Helpline: 1800-180-5522.',
    keywords: ['anti-ragging', 'ragging helpline', 'complaint', 'zero tolerance'],
  },
  {
    id: 'welfare-icc',
    category: 'Health & Safety',
    sectionCode: 'Welfare & Ethics §7.2',
    question: 'How do I report harassment or gender discrimination?',
    answer: 'Confidential grievances regarding sexual harassment or gender discrimination should be addressed to the Presiding Officer via icc-redressal@university.edu.',
    keywords: ['icc', 'harassment', 'internal complaints', 'safety', 'grievance'],
  },
  {
    id: 'health-emergency',
    category: 'Health & Safety',
    sectionCode: 'Health & Emergency §8.2',
    question: 'What is the campus emergency ambulance hotline number?',
    answer: 'Immediate campus medical emergency ambulance can be dispatched via hotlines +91 99999 11222 or Campus Intercom #108.',
    keywords: ['ambulance', 'emergency contact', 'medical emergency', 'sos hotline', 'doctor'],
  },
];

const ACAD_REGS_BLOCK = `=== ACADEMIC REGULATIONS 2026 ===
[Academic Regs §4.1] Working Hours: Academic sessions run Monday to Friday from 9:00 AM to 5:00 PM.
[Academic Regs §4.2] Attendance Requirement: A minimum of 75% attendance across lectures, tutorials, and practicals is mandatory to be eligible for end-semester examinations.
[Academic Regs §4.3] Attendance Condonation: Students with attendance between 65% and 74.9% may apply for medical condonation waiver by submitting Form Med-A and authentic medical certificates to the Dean's Office within 3 working days of resumption. Condonation fee is Rs. 500 per subject.
[Academic Regs §4.4] Debarment: Students with attendance strictly below 65% are categorically debarred from sitting for semester examinations and must re-register for the course during remedial cycles.
[Academic Regs §4.5] Makeup Labs: Missed laboratory experiments must be compensated within the same academic cycle with written consent from the Course Faculty and HoD.
[Academic Regs §4.6] Minimum CGPA for Degree: A cumulative grade point average (CGPA) of at least 5.0 with zero outstanding backlogs is mandatory for the award of Bachelor of Technology degrees.
[Academic Regs §4.7] Elective Course Add/Drop: Students may officially add or drop elective courses within the first 10 instructional days of each semester through the Academic ERP portal.`;

const EXAM_GUIDES_BLOCK = `=== EXAMINATION GUIDELINES OCT 2026 ===
[Exam Guidelines §2.1] Hall Ticket Eligibility: Students can download the examination admit card from the university portal only after clearing outstanding library dues, lab breakages, and hostel mess dues.
[Exam Guidelines §2.2] Grading System: Relative grading scale from O (Outstanding, 10 grade points) down to F (Fail, 0 grade points). Minimum passing grade is E (4 grade points).
[Exam Guidelines §2.3] Backlog & Remedial: Remedial supplementary examinations are conducted between semesters. A maximum of 4 backlogs can be carried forward to the subsequent academic year.
[Exam Guidelines §2.4] Re-Evaluation: Students may request re-evaluation of answer scripts within 7 days of result declaration by paying a non-refundable scrutiny fee of Rs. 300 per paper.
[Exam Guidelines §2.5] Malpractice Penalties: Possession of unauthorized paper, digital notes, smartwatches, or mobile phones inside the examination hall attracts immediate confiscation and debarment for a minimum of 2 consecutive examination cycles.
[Exam Guidelines §2.6] Grade Improvement Scheme: Students securing grade D or E in any course may apply to retake the course examination for grade improvement in the immediately succeeding semester.`;

const HOSTEL_MANUAL_BLOCK = `=== CAMPUS FACILITIES & HOSTEL MANUAL ===
[Hostel Manual §1.1] Curfew Timings: The university main gates and hostel in-time is strictly 9:30 PM.
[Hostel Manual §1.2] Late Gate Pass: Late entry past 9:30 PM requires a digital gate pass approved by the Hostel Warden before 6:00 PM on the same date.
[Hostel Manual §1.3] Overnight Leave: Weekend or overnight home leave requests must be submitted digitally with parental verification 24 hours prior.
[Hostel Manual §1.4] Mess Dining Hours:
- Breakfast: 7:30 AM – 9:00 AM
- Lunch: 12:30 PM – 2:00 PM
- High Tea: 5:00 PM – 6:00 PM
- Dinner: 7:30 PM – 9:30 PM
[Hostel Manual §1.5] Prohibited Electrical Appliances: High-power appliances including electric irons, immersion water heaters, induction cooktops, and air-fryers are prohibited in student rooms. A fine of Rs. 1,000 is levied upon violation.
[Hostel Manual §1.6] Room Allotment & Transfers: Mutual hostel room exchange requests are evaluated solely at the end of the odd semester through the Office of the Chief Warden.`;

const IEEE_EVENTS_BLOCK = `=== IEEE STUDENT BRANCH ACTIVITIES 2026 ===
[IEEE Notice §3.1] IEEE Day Hackathon 2026: An offline 4-hour sprint challenge held at the University Computing Labs. Problem statements cover University Repository (PS1), Career Profile (PS2), and Student Chatbot (PS3).
[IEEE Notice §3.2] IEEE Membership Benefits: Members receive subsidized registration fees for technical workshops, access to IEEE Xplore digital library papers, and preferential slots in global technical symposiums.
[IEEE Notice §3.3] Student Branch Executive Committee: Branch Counselor: Dr. Academic Advisor; Chair: Final Year Lead; Tech Lead: CSE Associate. Official contact: ieee-sb@university.edu.
[IEEE Notice §3.4] Project Showcase & Grants: The IEEE Student Branch allocates competitive micro-grants up to Rs. 15,000 for verified student research prototypes and open-source contributions.
[IEEE Notice §3.5] Volunteering Recognition: Student branch volunteers completing 25+ verified event support hours are awarded IEEE Service Excellence Certificates recognized for co-curricular credits.`;

export const DOCUMENT_SECTIONS: Record<string, string> = {
  '1': ACAD_REGS_BLOCK,
  acad_regs: ACAD_REGS_BLOCK,
  '2': EXAM_GUIDES_BLOCK,
  exam_guides: EXAM_GUIDES_BLOCK,
  '3': HOSTEL_MANUAL_BLOCK,
  hostel_manual: HOSTEL_MANUAL_BLOCK,
  '4': IEEE_EVENTS_BLOCK,
  ieee_events: IEEE_EVENTS_BLOCK,
};

export function getFilteredKnowledgeBase(activeSourceIds?: string[]): string {
  if (!activeSourceIds || activeSourceIds.length === 0) {
    return 'INFORMATION UNAVAILABLE: All campus documents have been deselected by the user. Refuse to answer.';
  }
  const seenBlocks = new Set<string>();
  const blocks: string[] = [];
  for (const id of activeSourceIds) {
    const text = DOCUMENT_SECTIONS[id];
    if (text && !seenBlocks.has(text)) {
      seenBlocks.add(text);
      blocks.push(text);
    }
  }
  return blocks.length > 0 ? blocks.join('\n\n') : 'INFORMATION UNAVAILABLE: No matching active documents.';
}

const STOP_WORDS = new Set([
  'what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how',
  'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did',
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of',
  'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'then', 'once', 'here',
  'there', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'can', 'will', 'just', 'should', 'now', 'tell', 'give',
  'please', 'detail', 'details', 'about', 'time', 'timings'
]);

/**
 * Fast deterministic grounding search across FAQs & regulations with active source filtering
 */
export function findRelevantKnowledge(query: string, activeSourceIds?: string[]): FAQItem[] {
  const q = query.toLowerCase();
  const rawTokens = q.replace(/[^a-z0-9\s§.-]/g, ' ').split(/\s+/).filter(t => t.length > 1);
  const meaningfulTokens = rawTokens.filter(t => !STOP_WORDS.has(t));
  const tokensToUse = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

  const allowedCategories: Record<string, string> = {
    '1': 'Academic',
    acad_regs: 'Academic',
    '2': 'Examinations',
    exam_guides: 'Examinations',
    '3': 'Hostel',
    hostel_manual: 'Hostel',
    '4': 'IEEE Branch',
    ieee_events: 'IEEE Branch',
  };

  const allowedCategoryList = activeSourceIds
    ? activeSourceIds.map((id) => allowedCategories[id]).filter(Boolean)
    : Object.values(allowedCategories);

  // Score across all campus knowledge
  const allScored = CAMPUS_FAQS.map(faq => {
    let score = 0;
    const qLower = faq.question.toLowerCase();
    const aLower = faq.answer.toLowerCase();
    const sLower = faq.sectionCode.toLowerCase();
    const keywords = faq.keywords.map(k => k.toLowerCase());

    if (qLower.includes(q) || aLower.includes(q)) score += 15;

    for (const token of tokensToUse) {
      if (sLower.includes(token)) score += 8;
      if (keywords.some(k => k.includes(token))) score += 6;
      if (qLower.includes(token)) score += 4;
      if (aLower.includes(token)) score += 1;
    }
    return { faq, score };
  });

  // Check top global match: if top match belongs to a deselected category, strictly do not hallucinate/refuse
  const topGlobalMatch = [...allScored].sort((a, b) => b.score - a.score)[0];
  if (topGlobalMatch && topGlobalMatch.score >= 4) {
    if (!allowedCategoryList.includes(topGlobalMatch.faq.category)) {
      return [];
    }
  }

  // Filter only to allowed categories
  const sourceFiltered = allScored
    .filter(item => allowedCategoryList.includes(item.faq.category) && item.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.faq);

  return sourceFiltered;
}

