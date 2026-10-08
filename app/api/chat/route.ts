import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { findRelevantKnowledge, getFilteredKnowledgeBase } from '@/lib/campusData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.prompt || body.message;
    const { conversationHistory = [] } = body;
    const activeSourceIds: string[] = Array.isArray(body.activeSourceIds)
      ? body.activeSourceIds
      : (Array.isArray(body.activeSources) ? body.activeSources : ['1', '2', '3', '4']);

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'A valid prompt string is required.' },
        { status: 400 }
      );
    }

    const filteredKnowledge = getFilteredKnowledgeBase(activeSourceIds);

    const detectActionType = (text: string): 'waiver' | 'gatepass' | null => {
      const lower = text.toLowerCase();
      if (
        lower.includes('condonation') ||
        lower.includes('med-a') ||
        lower.includes('waiver') ||
        lower.includes('shortage')
      ) {
        return 'waiver';
      }
      if (
        lower.includes('gate pass') ||
        lower.includes('curfew') ||
        lower.includes('late entry') ||
        lower.includes('9:30 pm')
      ) {
        return 'gatepass';
      }
      return null;
    };

    const dynamicSystemInstruction = `
You are UniPilot, the authoritative AI Operating System and grounded campus advisor for the university.
You are running under strict IEEE Hackathon PS-3 Anti-Hallucination and AI Integrity Rules.

STRICT OPERATING PRINCIPLES:
1. FACTUAL GROUNDING: Base your answers ONLY and EXCLUSIVELY on the provided Active Campus Knowledge Base below.
2. CITATION MANDATE: Every policy claim, timing, fee, quota, or regulation MUST be accompanied by its exact bracketed section citation, e.g. [Academic Regs §4.2], [Hostel Manual §1.4], [Exam Guidelines §2.1], [IEEE Notice §3.1].
3. MULTI-INTENT HANDLING: When a question touches multiple policies (e.g. attendance and condonation fees, exams and curfew), break down the answer into clear, distinct subheadings with bullet points.
4. ANTI-HALLUCINATION REFUSAL [Fallback Rule 5]: If a query asks about something NOT specified in the active knowledge base below (or if the relevant document has been deactivated/omitted), you MUST strictly return:
   "Information Unavailable: This query falls outside authorized campus records [Fallback Rule 5]."
5. NO EXTRAPOLATION: Never guess or invent numbers, deadlines, faculty names, or policies.
6. TONE: Professional, supportive, concise, structured, and academically precise.

ACTIVE CAMPUS KNOWLEDGE BASE (Filtered by Active Institutional Documents):
${filteredKnowledge}
`;

    const apiKey = process.env.GEMINI_API_KEY;

    // Deterministic citation extractor
    const extractCitations = (text: string): string[] => {
      const regex = /\[([A-Za-z\s&§0-9.]+)\]/g;
      const matches: string[] = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        if (!matches.includes(match[1])) {
          matches.push(match[1]);
        }
      }
      return matches;
    };

    // If Gemini API Key is configured, use Google GenAI SDK
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_API_KEY_HERE') {
      try {
        const ai = new GoogleGenAI({ apiKey });

        // Build conversation messages
        const formattedHistory = conversationHistory.map((item: { role: string; content: string }) => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content }],
        }));

        const contents = [
          ...formattedHistory,
          { role: 'user', parts: [{ text: message }] },
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction: dynamicSystemInstruction,
            temperature: 0.1, // Low temperature for factual precision
          },
        });

        const replyText = response.text || 'Information Unavailable: This query falls outside authorized campus records [Fallback Rule 5].';
        const citations = extractCitations(replyText);
        const isRefusal = replyText.toLowerCase().includes('information unavailable') ||
          replyText.toLowerCase().includes('fallback rule 5') ||
          replyText.toLowerCase().includes('outside authorized campus');

        const finalReply = isRefusal
          ? 'Information Unavailable: This query falls outside authorized campus records [Fallback Rule 5].'
          : replyText;

        const actionType = isRefusal ? null : detectActionType(finalReply);

        return NextResponse.json({
          reply: finalReply,
          response: finalReply,
          citations: isRefusal ? [] : citations,
          actionType,
          grounded: !isRefusal,
          confidenceScore: isRefusal ? 0.0 : 0.98,
          mode: 'gemini-2.5-flash',
          source: 'Live Gemini Model with Filtered RAG Grounding',
          activeSources: activeSourceIds,
        });
      } catch (geminiError: any) {
        console.error('Gemini API call failed, falling back to deterministic engine:', geminiError?.message || geminiError);
      }
    }

    // Grounded Fallback Engine (Filtered by activeSourceIds)
    const matchedFaqs = findRelevantKnowledge(message, activeSourceIds);

    if (matchedFaqs.length > 0) {
      const topMatch = matchedFaqs[0];
      const additional = matchedFaqs.slice(1, 3);

      let reply = `According to [${topMatch.sectionCode}], ${topMatch.answer}`;
      if (additional.length > 0) {
        reply += `\n\nRelated campus guidelines:\n` + additional.map(a => `• [${a.sectionCode}]: ${a.answer}`).join('\n');
      }

      const citations = [topMatch.sectionCode, ...additional.map(a => a.sectionCode)];
      const actionType = detectActionType(reply);

      return NextResponse.json({
        reply,
        response: reply,
        citations,
        actionType,
        grounded: true,
        confidenceScore: 0.95,
        mode: 'grounded-local-engine',
        source: 'University Knowledge Base (Filtered Grounding Fallback)',
        activeSources: activeSourceIds,
      });
    }

    // Anti-Hallucination Safe Refusal strictly adhering to PS-3 Fallback Rule 5
    const fallbackMessage = 'Information Unavailable: This query falls outside authorized campus records [Fallback Rule 5].';
    return NextResponse.json({
      reply: fallbackMessage,
      response: fallbackMessage,
      citations: [],
      actionType: null,
      grounded: false,
      confidenceScore: 0.0,
      mode: 'grounded-local-engine',
      source: 'UniPilot AI Integrity Guard [PS-3 Fallback Rule 5]',
      activeSources: activeSourceIds,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred processing the query.', details: error?.message },
      { status: 500 }
    );
  }
}
