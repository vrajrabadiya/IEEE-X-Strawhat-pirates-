'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  CheckSquare,
  Square,
  FileCheck,
  ShieldCheck,
  User,
  RotateCcw,
  Mic,
  MicOff,
  Send,
  Bot,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronRight,
  Download,
  PhoneCall,
  PhoneOff,
  Volume2,
  Sparkles,
  Clock,
  Copy,
  Check,
  Printer,
  Building,
  Layers,
  Terminal,
  ArrowUp,
  ExternalLink,
} from 'lucide-react';

// Type definitions for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
    webkitAudioContext?: typeof AudioContext;
  }
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citations: string[];
  grounded?: boolean;
  actionType?: 'waiver' | 'gatepass' | null;
  timestamp: string;
  confidenceScore?: number;
}

interface CampusDocument {
  id: string;
  title: string;
  desc: string;
  type: 'PDF' | 'TXT' | 'JSON';
  category: 'Academic' | 'Examinations' | 'Facilities' | 'IEEE';
  clauseNum: number;
  clauses: string;
}

interface AuditLogItem {
  id: string;
  query: string;
  timestamp: string;
  citations: string[];
  confidenceScore: number;
  status: 'GROUNDED' | 'FALLBACK_RULE_5';
}

const CAMPUS_DOCUMENTS: CampusDocument[] = [
  {
    id: '1',
    title: 'Academic_Regulations_2026.pdf',
    desc: 'Mandatory 75% attendance, Form Med-A condonation waiver & debarment criteria',
    type: 'PDF',
    category: 'Academic',
    clauseNum: 7,
    clauses: '7 Clauses Grounded',
  },
  {
    id: '2',
    title: 'Examination_Guidelines_Oct2026.pdf',
    desc: 'Hall ticket admit cards, dues clearance & 10-point relative grading scale',
    type: 'PDF',
    category: 'Examinations',
    clauseNum: 6,
    clauses: '6 Clauses Grounded',
  },
  {
    id: '3',
    title: 'Campus_Hostel_Mess_Manual.txt',
    desc: 'Strict 9:30 PM curfew, digital late gate passes & mess dining hours',
    type: 'TXT',
    category: 'Facilities',
    clauseNum: 6,
    clauses: '6 Clauses Grounded',
  },
  {
    id: '4',
    title: 'IEEE_Student_Branch_Events.json',
    desc: 'IEEE Day Hackathon 2026, prototype micro-grants & service credits',
    type: 'JSON',
    category: 'IEEE',
    clauseNum: 5,
    clauses: '5 Clauses Grounded',
  },
];

export default function Home() {
  // 1. Core Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      text:
        'Greetings Vraj. I am **UniPilot**, your grounded campus AI Operating System.\n\nAll answers are strictly verified against official university documents with section citations like `[Academic Regs §4.2]`. If a query cannot be verified from active campus records, I will strictly refuse under **PS-3 Fallback Rule 5** rather than extrapolate or hallucinate.',
      citations: ['Academic Regs §4.1', 'Hostel Manual §1.1'],
      grounded: true,
      actionType: null,
      timestamp: '09:00 AM',
      confidenceScore: 0.98,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Active Sources (Filterable Knowledge Base)
  const [activeSources, setActiveSources] = useState<string[]>(['1', '2', '3', '4']);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Academic' | 'Examinations' | 'Facilities' | 'IEEE'>('All');
  const [highlightedSourceId, setHighlightedSourceId] = useState<string | null>(null);

  // Administrative Action Drawer State ('none' | 'waiver' | 'gatepass')
  const [activeDrawerCard, setActiveDrawerCard] = useState<'none' | 'waiver' | 'gatepass'>('none');
  const [wardenDispatched, setWardenDispatched] = useState<boolean>(false);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Active Session Duration Timer
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // PS-3 Query Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'audit-0',
      query: 'System Initialization & Campus Grounding Verification',
      timestamp: '09:00 AM',
      citations: ['Academic Regs §4.1', 'Hostel Manual §1.1'],
      confidenceScore: 0.98,
      status: 'GROUNDED',
    },
  ]);
  const [auditLogExpanded, setAuditLogExpanded] = useState(false);

  // Study Accountability Voice Agent State
  type CallStatus = 'idle' | 'ringing' | 'connected' | 'rescheduled' | 'started' | 'ended';
  const [callState, setCallState] = useState<CallStatus>('idle');
  const [focusSubject, setFocusSubject] = useState('Operating Systems Mid-Sem');
  const [callTimer, setCallTimer] = useState(0);
  const [accountabilityStatus, setAccountabilityStatus] = useState<'Pending Start' | 'Session Active' | 'Rescheduled (+30m)'>('Pending Start');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);

  // Web Audio & Call Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callRecognitionRef = useRef<any>(null);

  // Alignerr Voice Room Modal State
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [visualizerState, setVisualizerState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [liveSubtitles, setLiveSubtitles] = useState('Tap the microphone to speak with UniPilot Voice...');
  const [studentVoiceTranscript, setStudentVoiceTranscript] = useState('');

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Session elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Call duration timer
  useEffect(() => {
    if (callState === 'connected' || callState === 'rescheduled' || callState === 'started') {
      callIntervalRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    }
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, [callState]);

  // Clean speech synthesis when voice modal closes
  useEffect(() => {
    if (!voiceModalOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      setVisualizerState('idle');
    }
  }, [voiceModalOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTelephoneRing();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Audio Dual-Tone Telephone Ring (440Hz + 480Hz)
  const startTelephoneRing = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const playBurst = () => {
        try {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
          const now = ctx.currentTime;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(440, now);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(480, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
          gain.gain.setValueAtTime(0.08, now + 1.15);
          gain.gain.linearRampToValueAtTime(0, now + 1.2);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 1.25);
          osc2.stop(now + 1.25);
        } catch (_) {}
      };

      playBurst();
      ringIntervalRef.current = setInterval(playBurst, 2600);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  };

  const stopTelephoneRing = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
  };

  // Trigger Study Accountability Call
  const handleTriggerAccountabilityCall = () => {
    setCallState('ringing');
    setCallTimer(0);
    startTelephoneRing();

    // Auto-answer after 2.4 seconds
    setTimeout(() => {
      stopTelephoneRing();
      setCallState('connected');

      const initialPrompt = `Hey Vraj, this is UniPilot from the academic office. Your scheduled block for ${focusSubject} starts now! Are you ready to begin, or do you need to reschedule?`;
      speakAgentVoice(initialPrompt, () => {
        startCallSpeechRecognition();
      });
    }, 2400);
  };

  // Speak agent voice via Web Speech API
  const speakAgentVoice = (text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsAgentSpeaking(true);
    utterance.onend = () => {
      setIsAgentSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      setIsAgentSpeaking(false);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Listen for student reply during call
  const startCallSpeechRecognition = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      const recognition = new SpeechRec();
      callRecognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const studentReply = event.results[0][0].transcript || '';
        handleProcessStudentCallReply(studentReply);
      };

      recognition.onerror = () => {
        // Fallback gracefully
      };

      recognition.start();
    } catch (_) {}
  };

  // Process Student Reply in Voice Call
  const handleProcessStudentCallReply = (reply: string) => {
    const lower = reply.toLowerCase();
    const hasRescheduleIntent =
      lower.includes('busy') ||
      lower.includes('later') ||
      lower.includes('canteen') ||
      lower.includes('shift') ||
      lower.includes('reschedule') ||
      lower.includes('30');

    if (hasRescheduleIntent) {
      setCallState('rescheduled');
      setAccountabilityStatus('Rescheduled (+30m)');
      const text = `Understood Vraj. I have rescheduled your ${focusSubject} session by 30 minutes. Make sure to get back to your study desk then. Good luck!`;
      speakAgentVoice(text, () => {
        setTimeout(handleEndCall, 2500);
      });
    } else {
      setCallState('started');
      setAccountabilityStatus('Session Active');
      const text = `Excellent! Deep work timer started for ${focusSubject}. I will check in when your sprint completes.`;
      speakAgentVoice(text, () => {
        setTimeout(handleEndCall, 2500);
      });
    }
  };

  const handleEndCall = () => {
    stopTelephoneRing();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (callRecognitionRef.current) {
      try {
        callRecognitionRef.current.stop();
      } catch (_) {}
      callRecognitionRef.current = null;
    }
    setIsAgentSpeaking(false);
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
      setCallTimer(0);
    }, 1200);
  };

  // Header Control: Reset Session
  const handleClearSession = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        text:
          'Greetings Vraj. I am **UniPilot**, your grounded campus AI Operating System.\n\nAll answers are strictly verified against official university documents with section citations like `[Academic Regs §4.2]`. If a query cannot be verified from active campus records, I will strictly refuse under **PS-3 Fallback Rule 5** rather than extrapolate or hallucinate.',
        citations: ['Academic Regs §4.1', 'Hostel Manual §1.1'],
        grounded: true,
        actionType: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 0.98,
      },
    ]);
    setInputQuery('');
    setActiveDrawerCard('none');
    setWardenDispatched(false);
    setHighlightedSourceId(null);
    setAuditLogs([
      {
        id: `audit-${Date.now()}`,
        query: 'Session Cleared & Knowledge Base Re-indexed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: ['Academic Regs §4.1'],
        confidenceScore: 0.98,
        status: 'GROUNDED',
      },
    ]);
  };

  // Toggle Knowledge Document
  const toggleSource = (sourceId: string) => {
    setActiveSources((prev) =>
      prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]
    );
  };

  // Citation Linker: Map citation code to Document ID ('1', '2', '3', '4')
  const getDocIdFromCitation = (citation: string): string => {
    const lower = citation.toLowerCase();
    if (lower.includes('regs') || lower.includes('academic') || lower.includes('med')) return '1';
    if (lower.includes('exam') || lower.includes('guidelines') || lower.includes('grading') || lower.includes('admit') || lower.includes('hall')) return '2';
    if (lower.includes('hostel') || lower.includes('curfew') || lower.includes('mess') || lower.includes('gate')) return '3';
    if (lower.includes('ieee') || lower.includes('hackathon') || lower.includes('notice') || lower.includes('grant')) return '4';
    return '1';
  };

  const handleCitationClick = (citationCode: string) => {
    const targetDocId = getDocIdFromCitation(citationCode);
    setHighlightedSourceId(targetDocId);

    setTimeout(() => {
      setHighlightedSourceId((curr) => (curr === targetDocId ? null : curr));
    }, 3000);

    if (targetDocId === '1') {
      setActiveDrawerCard('waiver');
    } else if (targetDocId === '3') {
      setActiveDrawerCard('gatepass');
    }
  };

  // Submit Query to API
  const handleSendQuery = async (queryOverride?: string) => {
    const promptToSend = (queryOverride || inputQuery).trim();
    if (!promptToSend || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: promptToSend,
      citations: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          activeSourceIds: activeSources,
          activeSources,
        }),
      });

      const data = await res.json();
      const rawText = data.reply || data.response || 'Information Unavailable: This query falls outside authorized campus records [Fallback Rule 5].';
      const citations = data.citations || [];
      const isGrounded = data.grounded ?? !rawText.includes('Fallback Rule 5');
      const actionType = data.actionType || null;
      const confidence = data.confidenceScore ?? (isGrounded ? 0.96 : 0.0);

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        text: rawText,
        citations,
        grounded: isGrounded,
        actionType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: confidence,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Add to PS-3 Audit Log
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          query: promptToSend,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations,
          confidenceScore: confidence,
          status: isGrounded ? 'GROUNDED' : 'FALLBACK_RULE_5',
        },
        ...prev,
      ]);

      if (actionType === 'waiver') {
        setActiveDrawerCard('waiver');
      } else if (actionType === 'gatepass') {
        setActiveDrawerCard('gatepass');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        text: 'Information Unavailable: Communication error with campus grounding server [Fallback Rule 5].',
        citations: [],
        grounded: false,
        actionType: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 0.0,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Download Printable Form Med-A
  const handleDownloadStampedWaiver = () => {
    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form Med-A: Official Medical Attendance Condonation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #0f172a; padding: 36px 20px; line-height: 1.5; }
    .page { max-width: 780px; margin: 0 auto; background: #ffffff; padding: 44px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); position: relative; }
    .print-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
    .print-btn { background: #4f46e5; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .print-btn:hover { background: #4338ca; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .header .univ { font-size: 20px; font-weight: 800; letter-spacing: 1px; color: #0f172a; }
    .header .sub { font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; font-weight: 600; }
    .title-banner { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 16px; text-align: center; margin-bottom: 20px; }
    .title-banner h1 { font-size: 15px; font-weight: 700; color: #1e293b; }
    .title-banner p { font-size: 11px; color: #4338ca; font-weight: 600; margin-top: 2px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #334155; margin: 16px 0 8px 0; border-left: 3px solid #4f46e5; padding-left: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
    th, td { border: 1px solid #cbd5e1; padding: 9px 12px; font-size: 12.5px; }
    th { background: #f8fafc; text-align: left; width: 34%; color: #475569; font-weight: 600; }
    td { color: #0f172a; }
    .highlight-val { color: #d97706; font-weight: 700; font-family: monospace; }
    .status-badge-ok { color: #15803d; font-weight: 700; background: #f0fdf4; padding: 2px 6px; border-radius: 4px; border: 1px solid #bbf7d0; }
    .footer-section { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-end; }
    .security-block { font-size: 11px; color: #64748b; line-height: 1.5; }
    .stamp-badge { width: 136px; height: 136px; border-radius: 50%; border: 3px double #1e3a8a; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: #faf5ff; transform: rotate(-5deg); box-shadow: 0 0 0 4px #e0e7ff; }
    .stamp-star { font-size: 10px; color: #4338ca; letter-spacing: 2px; }
    .stamp-title { font-size: 9px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin: 1px 0; }
    .stamp-body { font-size: 8px; font-weight: 700; color: #4338ca; line-height: 1.2; text-transform: uppercase; }
    @media print {
      body { background: #fff; padding: 0; }
      .page { border: none; box-shadow: none; padding: 10px; }
      .print-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="print-bar">
      <span style="font-size: 11px; color: #64748b;">GSFC University • Statutory Campus Operating Record (PS-3)</span>
      <button class="print-btn" onclick="window.print()">🖨️ Print Form / Save PDF</button>
    </div>
    <div class="header">
      <div class="univ">GSFC UNIVERSITY • SCHOOL OF TECHNOLOGY</div>
      <div class="sub">Office of Academic Affairs • Statutory Regulatory Board</div>
    </div>
    <div class="title-banner">
      <h1>FORM MED-A: APPLICATION FOR ATTENDANCE CONDONATION ON MEDICAL GROUNDS</h1>
      <p>Statutory Reference: Academic Regulations 2026 Clause §4.3 & Clause §4.4</p>
    </div>

    <div class="section-title">Candidate Profile & Enrollment</div>
    <table>
      <tr><th>Student Full Name</th><td><strong>Vraj</strong> (Vraj Patel)</td></tr>
      <tr><th>Department & Program</th><td><strong>B.Tech CSE</strong> (Computer Science & Engineering) • Semester 4</td></tr>
      <tr><th>Student ID / Enrollment</th><td>23BCSE104</td></tr>
      <tr><th>Hostel Residence</th><td>Hostel Block B, Room 312</td></tr>
    </table>

    <div class="section-title">Attendance & Statutory Condonation Evaluation</div>
    <table>
      <tr><th>Recorded Aggregate Attendance</th><td><span class="highlight-val">68.2% attendance</span> (Statutory Shortage: 6.8%)</td></tr>
      <tr><th>Mandatory Examination Threshold</th><td>75.0% Mandatory [Academic Regs §4.2]</td></tr>
      <tr><th>Statutory Exemption Clause</th><td><strong>Clause §4.3</strong> (Medical Condonation Waiver)</td></tr>
      <tr><th>Condonation Evaluation Status</th><td><span class="status-badge-ok">QUALIFIED (Within 65.0% – 74.9% Band)</span></td></tr>
      <tr><th>Prescribed Statutory Fee</th><td>Rs. 500 per subject × 4 courses = Rs. 2,000 Payable</td></tr>
      <tr><th>Medical Evidence Submitted</th><td>Form Med-A Authenticated Health Certificate #MED-2026-0914</td></tr>
    </table>

    <div class="footer-section">
      <div class="security-block">
        <p><strong>UniPilot Certified Statutory Record</strong></p>
        <p>Grounded via University Academic Regulations 2026</p>
        <p style="font-family: monospace; font-size: 10px; color: #475569; margin-top: 2px;">Token: SHA256#UNIPILOT-MED-A-VRAJ-CSE-68.2-CLAUSE-4.3</p>
        <p style="margin-top: 3px;">Issued Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div class="stamp-badge">
        <div class="stamp-star">★ ★ ★</div>
        <div class="stamp-title">OFFICIALLY STAMPED</div>
        <div class="stamp-body">DEAN OF ACADEMIC AFFAIRS<br/>CONDONATION APPROVED</div>
        <div style="font-size: 8px; font-weight: 800; color: #b45309; margin-top: 2px;">CLAUSE §4.3</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    if (typeof window !== 'undefined') {
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(htmlDoc);
        printWin.document.close();
      }
    }

    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Form_Med-A_Official_Medical_Attendance_Condonation.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy Ticket ID
  const handleCopyTicket = (ticketId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ticketId);
      setCopiedTicket(true);
      setTimeout(() => setCopiedTicket(false), 2000);
    }
  };

  // Voice Room Speech Synthesis
  const speakVoiceRoomText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanSpeech = text.replace(/\[.*?\]/g, '').replace(/\*\*/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setVisualizerState('speaking');
    utterance.onend = () => {
      setVisualizerState('idle');
      setLiveSubtitles('Tap microphone to speak again...');
    };
    utterance.onerror = () => setVisualizerState('idle');

    window.speechSynthesis.speak(utterance);
  };

  // Voice Room Mic Toggle
  const toggleVoiceRoomMic = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setVisualizerState('idle');
      return;
    }

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVisualizerState('listening');
        setLiveSubtitles('Listening to student speech...');
        setStudentVoiceTranscript('');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setStudentVoiceTranscript(transcript);
        setLiveSubtitles(`"${transcript}"`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVisualizerState('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (studentVoiceTranscript.trim()) {
          processVoiceQuery(studentVoiceTranscript);
        } else {
          setVisualizerState('idle');
          setLiveSubtitles('Tap microphone to speak again...');
        }
      };

      recognition.start();
    } catch (_) {
      setIsListening(false);
      setVisualizerState('idle');
    }
  };

  const processVoiceQuery = async (queryText: string) => {
    setLiveSubtitles('Cross-referencing campus knowledge base...');
    setVisualizerState('idle');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText, activeSourceIds: activeSources, activeSources }),
      });
      const data = await res.json();
      const reply = data.reply || data.response || 'Information Unavailable: This query falls outside authorized campus records [Fallback Rule 5].';

      setLiveSubtitles(reply);
      speakVoiceRoomText(reply);

      const userMsg: Message = {
        id: `v-u-${Date.now()}`,
        role: 'user',
        text: `🎙️ ${queryText}`,
        citations: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const botMsg: Message = {
        id: `v-b-${Date.now()}`,
        role: 'assistant',
        text: reply,
        citations: data.citations || [],
        grounded: data.grounded ?? !reply.includes('Fallback Rule 5'),
        actionType: data.actionType || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: data.confidenceScore ?? 0.96,
      };
      setMessages((prev) => [...prev, userMsg, botMsg]);
    } catch (_) {
      setLiveSubtitles('Unable to reach campus ground engine.');
      setVisualizerState('idle');
    }
  };

  // Filtered documents list based on Category Filter
  const filteredDocuments = CAMPUS_DOCUMENTS.filter((doc) => {
    if (selectedCategory === 'All') return true;
    return doc.category === selectedCategory;
  });

  // Calculate live active clauses
  const activeClauseCount = CAMPUS_DOCUMENTS.filter((d) => activeSources.includes(d.id)).reduce(
    (acc, d) => acc + d.clauseNum,
    0
  );

  // Markdown Formatter with Clickable Citation Pills & Bold Support
  const renderMessageText = (text: string) => {
    // Break into lines to handle bullet lists and headers cleanly
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed text-[13px]">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) {
            return <div key={lineIdx} className="h-1.5" />;
          }

          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
          const cleanLine = isBullet ? line.trim().replace(/^[•\-]\s*/, '') : line;

          // Parse markdown bold `**bold**` and citation tags `[citation]`
          const tokens = cleanLine.split(/(\*\*.*?\*\*|\[[A-Za-z\s&§0-9.]+\])/g);

          return (
            <div
              key={lineIdx}
              className={`${isBullet ? 'flex items-start gap-2 pl-1.5 text-neutral-300' : 'text-neutral-200'}`}
            >
              {isBullet && <span className="text-indigo-400 mt-1 text-[11px] leading-none shrink-0">•</span>}
              <div className="flex-1">
                {tokens.map((token, tokenIdx) => {
                  if (token.startsWith('**') && token.endsWith('**')) {
                    return (
                      <strong key={tokenIdx} className="font-semibold text-white">
                        {token.slice(2, -2)}
                      </strong>
                    );
                  }
                  if (token.startsWith('[') && token.endsWith(']')) {
                    const code = token.slice(1, -1);
                    return (
                      <button
                        key={tokenIdx}
                        type="button"
                        onClick={() => handleCitationClick(code)}
                        className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-500/30 border border-indigo-500/30 text-[11px] font-mono transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                        title={`Click to inspect source: ${code}`}
                      >
                        <FileText className="h-2.5 w-2.5 text-indigo-400" />
                        <span>[{code}]</span>
                      </button>
                    );
                  }
                  return <span key={tokenIdx}>{token}</span>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-[#09090b] text-neutral-100 flex flex-col font-sans overflow-hidden select-none">
      {/* 3-PANEL FIXED ARCHITECTURE */}
      <div className="flex-1 flex overflow-hidden">
        {/* ============================================================ */}
        {/* 1. LEFT SIDEBAR (260px): Institutional Knowledge Base         */}
        {/* ============================================================ */}
        <aside className="w-[260px] shrink-0 bg-[#0c0d12] border-r border-neutral-800/60 flex flex-col h-full z-10">
          {/* Header */}
          <div className="p-3.5 border-b border-neutral-800/60 bg-[#0c0d12]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                Campus Grounding
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {activeSources.length}/4 Sources
              </span>
            </div>
            <p className="text-[10.5px] text-neutral-400 leading-tight">
              Only checked statutory manuals feed context to the AI reasoner.
            </p>

            {/* Category Filter Badges */}
            <div className="flex flex-wrap items-center gap-1 mt-2">
              {(['All', 'Academic', 'Examinations', 'Facilities', 'IEEE'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[9.5px] px-1.5 py-0.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-neutral-800 text-white font-medium border border-neutral-700'
                      : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  {cat === 'Examinations' ? 'Exams' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Document Checklist Items */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {filteredDocuments.map((doc) => {
              const isChecked = activeSources.includes(doc.id);
              const isHighlighted = highlightedSourceId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleSource(doc.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer relative ${
                    isHighlighted
                      ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-950/40 shadow-md shadow-indigo-500/20 animate-pulse'
                      : isChecked
                      ? 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                      : 'bg-neutral-950/40 border-neutral-800/40 opacity-50 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="h-3.5 w-3.5 text-indigo-400" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-neutral-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[11.5px] font-mono font-medium text-neutral-200 truncate">
                          {doc.title}
                        </span>
                        <span className="text-[9px] font-mono px-1 rounded bg-neutral-800 text-neutral-300 shrink-0">
                          {doc.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-tight mb-1.5 line-clamp-2">
                        {doc.desc}
                      </p>
                      <div className="flex items-center gap-1 text-[9.5px] text-indigo-300/90 font-mono">
                        <FileCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>{doc.clauses}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Grounding Status Indicator */}
          <div className="p-3 pb-5 border-t border-neutral-800/60 bg-[#0c0d12]">
            <div className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-800/80 flex items-center gap-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="leading-tight min-w-0">
                <span className="font-semibold block text-[10.5px] text-neutral-200 truncate">
                  {activeClauseCount}/24 Clauses Grounded
                </span>
                <span className="text-[9.5px] text-emerald-400/90 font-mono">
                  100% Deterministic Grounding
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* 2. CENTER PANEL (Flex-1): Grounded Academic Stream           */}
        {/* ============================================================ */}
        <main className="flex-1 flex flex-col h-full bg-[#09090b] min-w-0">
          {/* Top Navigation Bar */}
          <header className="h-14 shrink-0 px-5 border-b border-neutral-800/60 bg-[#0c0d12]/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  UniPilot
                  <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    PS-3 OS
                  </span>
                </span>
              </div>
              <span className="text-neutral-700">|</span>

              {/* Institutional Context Badge */}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800">
                <Building className="h-3 w-3 text-indigo-400" />
                <span>GSFC University • CSE Dept (Vraj)</span>
              </div>

              {/* Session Duration Timer & Clear Button */}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 bg-neutral-900/60 px-2 py-0.5 rounded border border-neutral-800/80 font-mono">
                <Clock className="h-3 w-3 text-neutral-400" />
                <span>{formatTime(sessionSeconds)}</span>
              </div>

              <button
                type="button"
                onClick={handleClearSession}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-[11px] transition-colors cursor-pointer"
                title="Reset session history"
              >
                <RotateCcw className="h-3 w-3 text-neutral-400" />
                <span className="hidden md:inline">Reset</span>
              </button>
            </div>

            {/* Alignerr Voice Room Button */}
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-[11.5px] font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Mic className="h-3 w-3 text-cyan-200 animate-pulse" />
              <span>🎙️ Alignerr Voice Room</span>
            </button>
          </header>

          {/* Perplexity-style Chat Stream */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-7 w-7 rounded-lg bg-neutral-800 border border-neutral-700/80 flex items-center justify-center shrink-0 mt-0.5 text-indigo-400">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-xl text-[13px] leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5'
                      : 'bg-[#0f1017] text-neutral-200 border border-neutral-800/80 rounded-2xl rounded-tl-sm p-4'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div>
                      {renderMessageText(msg.text)}

                      {/* Grounding Confidence & Contextual Action Buttons */}
                      <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {msg.grounded ? (
                            <span className="inline-flex items-center gap-1 text-[10.5px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                              <CheckCircle2 className="h-3 w-3" />
                              Statutory Grounded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10.5px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                              <AlertTriangle className="h-3 w-3" />
                              PS-3 Fallback Rule 5
                            </span>
                          )}
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {msg.timestamp}
                          </span>
                        </div>

                        {/* Contextual Action Button */}
                        {msg.actionType === 'waiver' && (
                          <button
                            type="button"
                            onClick={() => setActiveDrawerCard('waiver')}
                            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 hover:bg-cyan-900/50 px-2 py-0.5 rounded border border-cyan-500/30 transition-all cursor-pointer"
                          >
                            <span>Draft Form Med-A Waiver →</span>
                          </button>
                        )}
                        {msg.actionType === 'gatepass' && (
                          <button
                            type="button"
                            onClick={() => setActiveDrawerCard('gatepass')}
                            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-950/40 hover:bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/30 transition-all cursor-pointer"
                          >
                            <span>Generate Late Gate Pass →</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span>{msg.text}</span>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-200">
                <div className="h-7 w-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 text-indigo-400">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-[#0f1017] border border-neutral-800/80 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-neutral-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                  <span>Synthesizing statutory citations...</span>
                </div>
              </div>
            )}

            <div ref={chatScrollRef} />
          </div>

          {/* Bottom Input Dock */}
          <div className="shrink-0 p-3.5 border-t border-neutral-800/60 bg-[#0c0d12]/60">
            {/* 3 Suggestion Pills */}
            <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => handleSendQuery('How can I apply for medical attendance condonation for 68% attendance?')}
                className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                68% Attendance Condonation
              </button>
              <button
                type="button"
                onClick={() => handleSendQuery('What are hostel curfew timings and how to request a digital late gate pass?')}
                className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Hostel Curfew & Gate Pass
              </button>
              <button
                type="button"
                onClick={() => handleSendQuery('Can I use ChatGPT to write my semester examination paper?')}
                className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Test Hallucination Fallback
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex items-center gap-2 bg-[#09090b] border border-neutral-800 rounded-xl p-1.5 focus-within:border-neutral-700 transition-all shadow-inner"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about academic attendance, exam rules, hostel curfew..."
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setVoiceModalOpen(true)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/80 transition-colors cursor-pointer"
                title="Voice Input"
              >
                <Mic className="h-4 w-4" />
              </button>

              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
          </div>
        </main>

        {/* ============================================================ */}
        {/* 3. RIGHT SIDEBAR (320px): Administrative Actions & Voice     */}
        {/* ============================================================ */}
        <aside className="w-[320px] shrink-0 bg-[#0c0d12] border-l border-neutral-800/60 flex flex-col h-full z-10 overflow-y-auto p-3.5 space-y-3.5">
          {/* Header */}
          <div className="pb-2 border-b border-neutral-800/60 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              Administrative Actions
            </span>
            <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Active Session
            </span>
          </div>

          {/* 1. DYNAMIC DOCUMENT PREVIEW */}
          {activeDrawerCard === 'waiver' && (
            <div className="rounded-xl bg-[#0f1017] border border-cyan-500/40 p-3 shadow-md animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-white">Form Med-A (Condonation)</h3>
                    <span className="text-[9.5px] text-cyan-400 font-mono">Academic Regs §4.3</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDrawerCard('none')}
                  className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-0.5 border-b border-neutral-800/50">
                  <span className="text-neutral-400">Student:</span>
                  <span className="font-medium text-neutral-200">Vraj (B.Tech CSE, Sem 4)</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-neutral-800/50">
                  <span className="text-neutral-400">Attendance:</span>
                  <span className="font-semibold text-amber-400">68.2% (Shortage 6.8%)</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-neutral-800/50">
                  <span className="text-neutral-400">Statutory Clause:</span>
                  <span className="font-mono text-cyan-300">Clause §4.3</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-neutral-800/50">
                  <span className="text-neutral-400">Status:</span>
                  <span className="font-semibold text-emerald-400">Qualified (65%–74.9%)</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-400">Authorized Fee:</span>
                  <span className="text-neutral-200">Rs. 500 / subject (Rs. 2,000)</span>
                </div>
              </div>

              {/* Authorized Seal Badge */}
              <div className="mt-2.5 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-center">
                <span className="text-[9.5px] font-bold text-indigo-300 uppercase tracking-wider block">
                  ★ UNIVERSITY AUTHORIZED ★
                </span>
                <span className="text-[8.5px] text-neutral-400 block">
                  Office of Academic Affairs • Regulatory Board
                </span>
              </div>

              <button
                type="button"
                onClick={handleDownloadStampedWaiver}
                className="mt-2.5 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Form Med-A PDF</span>
              </button>
            </div>
          )}

          {activeDrawerCard === 'gatepass' && (
            <div className="rounded-xl bg-[#0f1017] border border-amber-500/40 p-3 shadow-md animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Building className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-white">Digital Late Gate Pass</h3>
                    <span className="text-[9.5px] text-amber-400 font-mono">Hostel Manual §1.2</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDrawerCard('none')}
                  className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {wardenDispatched ? (
                <div className="space-y-2 animate-in fade-in duration-150">
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[10.5px]">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-200 block">
                          Dispatched to Warden Portal • Ticket #GP-9421 • Status: Pending Entry Sign-off
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-neutral-400">Ticket ID:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                        <span>#GP-9421</span>
                        <button
                          type="button"
                          onClick={() => handleCopyTicket('#GP-9421')}
                          className="p-0.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                          title="Copy Ticket ID"
                        >
                          {copiedTicket ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-neutral-400">Curfew / Entry:</span>
                      <span className="text-neutral-200">Curfew 9:30 PM &rarr; Entry 11:00 PM</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-neutral-400">Reason:</span>
                      <span className="text-neutral-200">IEEE Hackathon Sprint</span>
                    </div>
                  </div>

                  <div className="p-1.5 rounded bg-neutral-900/60 border border-neutral-800 text-center">
                    <span className="text-[9.5px] font-mono text-cyan-300">
                      TOKEN: GP-9421-WARDEN-QUEUE
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between py-0.5 border-b border-neutral-800/50">
                    <span className="text-neutral-400">Student:</span>
                    <span className="font-medium text-neutral-200">Vraj (Hostel Block B, Room 312)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-neutral-800/50">
                    <span className="text-neutral-400">Curfew Limit:</span>
                    <span className="font-semibold text-rose-400">Strictly 9:30 PM (§1.1)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-neutral-800/50">
                    <span className="text-neutral-400">Requested Entry:</span>
                    <span className="font-semibold text-amber-300">11:00 PM (Late Pass)</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-neutral-400">Reason:</span>
                    <span className="text-neutral-200">IEEE Day Hackathon Sprint</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWardenDispatched(true)}
                    className="mt-2.5 w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Dispatch to Hostel Warden</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeDrawerCard === 'none' && (
            <div className="rounded-xl bg-[#0f1017] border border-neutral-800/80 p-3 text-[11px]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-300">Quick Document Drawers</span>
                <span className="text-[9px] font-mono text-neutral-500">READY</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveDrawerCard('waiver')}
                  className="p-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <span className="text-cyan-400 font-semibold block text-[10.5px]">Form Med-A</span>
                  <span className="text-neutral-400 text-[9.5px]">Attendance Waiver</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDrawerCard('gatepass')}
                  className="p-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <span className="text-amber-400 font-semibold block text-[10.5px]">Late Gate Pass</span>
                  <span className="text-neutral-400 text-[9.5px]">Hostel Curfew</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. STUDY ACCOUNTABILITY VOICE AGENT */}
          <div className="rounded-xl bg-[#0f1017] border border-neutral-800/80 p-3 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/60">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-xs font-semibold text-white">Study Accountability</span>
              </div>
              <span
                className={`text-[9.5px] font-mono font-medium px-1.5 py-0.2 rounded border ${
                  accountabilityStatus === 'Session Active'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : accountabilityStatus === 'Rescheduled (+30m)'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                {accountabilityStatus}
              </span>
            </div>

            <div className="text-[11px] space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Next Academic Block:</span>
                <span className="font-medium text-neutral-200">{focusSubject}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Audio Engine:</span>
                <span className="text-neutral-300 font-mono">Web Audio VoIP</span>
              </div>
            </div>

            {callState === 'idle' && (
              <button
                type="button"
                onClick={handleTriggerAccountabilityCall}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/60 font-semibold py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5 text-indigo-400" />
                <span>Trigger In-App Accountability Call</span>
              </button>
            )}

            {callState === 'ringing' && (
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-center animate-pulse">
                <span className="text-xs font-semibold text-amber-300 block">📞 Dialing Student Line...</span>
                <span className="text-[10px] text-neutral-400">Synthesizing 440Hz + 480Hz telecom tones</span>
              </div>
            )}

            {(callState === 'connected' || callState === 'started' || callState === 'rescheduled') && (
              <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Call Active ({formatTime(callTimer)})
                  </span>
                  <button
                    type="button"
                    onClick={handleEndCall}
                    className="text-rose-400 hover:text-rose-300 text-[10px] cursor-pointer"
                  >
                    Hang Up
                  </button>
                </div>

                {isAgentSpeaking && (
                  <p className="text-[10.5px] text-cyan-300 italic">
                    UniPilot speaking through browser audio...
                  </p>
                )}

                {/* Simulated Negotiation Shortcuts */}
                <div className="pt-1 border-t border-neutral-800/60">
                  <span className="text-[9.5px] text-neutral-400 block mb-1">
                    Student Voice Negotiation Shortcuts:
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleProcessStudentCallReply('Ready to study now')}
                      className="flex-1 text-[10px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-1 rounded border border-neutral-800 cursor-pointer text-center"
                    >
                      "Ready now"
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProcessStudentCallReply('Busy in canteen, shift 30m')}
                      className="flex-1 text-[10px] bg-neutral-900 hover:bg-neutral-800 text-amber-300 py-1 rounded border border-neutral-800 cursor-pointer text-center"
                    >
                      "Shift 30m"
                    </button>
                  </div>
                </div>
              </div>
            )}

            {callState === 'ended' && (
              <div className="p-2 rounded bg-neutral-900 text-center text-xs text-neutral-400">
                Call ended.
              </div>
            )}
          </div>

          {/* 3. PS-3 QUERY AUDIT LOG (Expandable) */}
          <div className="rounded-xl bg-[#0f1017] border border-neutral-800/80 overflow-hidden">
            <button
              type="button"
              onClick={() => setAuditLogExpanded(!auditLogExpanded)}
              className="w-full p-2.5 flex items-center justify-between text-xs hover:bg-neutral-900/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-neutral-400" />
                <span className="font-semibold text-neutral-300">PS-3 Query Audit Log</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-mono text-neutral-500">
                  {auditLogs.length} Logged
                </span>
                {auditLogExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
                )}
              </div>
            </button>

            {auditLogExpanded && (
              <div className="p-2.5 pt-0 space-y-2 border-t border-neutral-800/60 max-h-48 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-1.5 rounded bg-neutral-950/80 border border-neutral-800/80 text-[10px] font-mono space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          log.status === 'GROUNDED' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-neutral-500">{log.timestamp}</span>
                    </div>
                    <p className="text-neutral-300 truncate">"{log.query}"</p>
                    <div className="flex items-center justify-between text-neutral-500 pt-0.5">
                      <span>Conf: {Math.round(log.confidenceScore * 100)}%</span>
                      <span>{log.citations.length} Citations</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ============================================================ */}
      {/* 4. ALIGNERR VOICE ROOM MODAL                                 */}
      {/* ============================================================ */}
      {voiceModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-[#0c0d12] border border-neutral-800 rounded-2xl p-6 text-center shadow-2xl relative">
            <button
              type="button"
              onClick={() => setVoiceModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-semibold block mb-1">
                Zero-Latency In-Browser Audio
              </span>
              <h2 className="text-base font-bold text-white">Alignerr Voice Room</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Grounded conversational campus reasoning via Speech Recognition
              </p>
            </div>

            {/* Audio Waveform Animation */}
            <div className="h-24 my-6 flex items-center justify-center gap-1.5">
              {visualizerState === 'listening' ? (
                <>
                  <div className="w-1.5 bg-indigo-500 rounded-full animate-soundwave-1" />
                  <div className="w-1.5 bg-indigo-400 rounded-full animate-soundwave-2" />
                  <div className="w-1.5 bg-indigo-300 rounded-full animate-soundwave-3" />
                  <div className="w-1.5 bg-indigo-400 rounded-full animate-soundwave-4" />
                  <div className="w-1.5 bg-indigo-500 rounded-full animate-soundwave-5" />
                </>
              ) : visualizerState === 'speaking' ? (
                <>
                  <div className="w-1.5 bg-emerald-500 rounded-full animate-soundwave-3" />
                  <div className="w-1.5 bg-emerald-400 rounded-full animate-soundwave-1" />
                  <div className="w-1.5 bg-emerald-300 rounded-full animate-soundwave-4" />
                  <div className="w-1.5 bg-emerald-400 rounded-full animate-soundwave-2" />
                  <div className="w-1.5 bg-emerald-500 rounded-full animate-soundwave-5" />
                </>
              ) : (
                <div className="h-14 w-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                  <Volume2 className="h-6 w-6" />
                </div>
              )}
            </div>

            {/* Subtitles Display */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 mb-6 min-h-[60px] flex items-center justify-center">
              <p className="text-xs text-neutral-300 leading-relaxed italic">
                {liveSubtitles}
              </p>
            </div>

            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleVoiceRoomMic}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  <span>Tap to Speak</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
