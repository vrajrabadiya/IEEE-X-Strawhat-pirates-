import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentName = body.studentName || 'Vraj';
    const taskReason = body.subject || body.taskReason || 'Operating Systems Mid-Sem';
    const phoneNumber = body.phoneNumber || '+919876543210';

    const vapiApiKey = process.env.VAPI_API_KEY;

    // If VAPI_API_KEY is not defined or is placeholder, gracefully return simulated mode
    if (!vapiApiKey || vapiApiKey.trim() === '' || vapiApiKey === 'YOUR_VAPI_KEY') {
      return NextResponse.json({
        success: true,
        mode: 'simulated',
        message: 'Running in zero-cost live simulation mode',
        callDetails: {
          studentName,
          taskReason,
          phoneNumber,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Live Telephony Outbound Call via Vapi API
    try {
      const response = await fetch('https://api.vapi.ai/call/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${vapiApiKey}`,
        },
        body: JSON.stringify({
          customer: {
            number: phoneNumber,
            name: studentName,
          },
          assistant: {
            firstMessage: `Hey ${studentName}, this is UniPilot from the academic office. Your scheduled block for ${taskReason} starts now! Are you ready to begin, or do you need to shift the time?`,
            model: {
              provider: 'openai',
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `You are UniPilot, an empathetic academic companion calling ${studentName}. Remind them their scheduled study session for ${taskReason} starts now. Ask if they are ready or need to reschedule. If they want to shift, negotiate 15 or 30 minutes, confirm warmly, and end the call. Keep responses under 2 sentences.`,
                },
              ],
            },
            voice: 'jennifer-playht',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('Vapi Telephony API call returned non-200, falling back to simulated mode:', errorText);
        return NextResponse.json({
          success: true,
          mode: 'simulated',
          message: 'Running in zero-cost live simulation mode (Telephony fallback)',
          error: errorText,
          callDetails: {
            studentName,
            taskReason,
            phoneNumber,
            timestamp: new Date().toISOString(),
          },
        });
      }

      const data = await response.json();
      return NextResponse.json({
        success: true,
        mode: 'telephony',
        data,
      });
    } catch (apiError: any) {
      console.warn('Vapi telephony request error, gracefully returning simulated mode:', apiError?.message || apiError);
      return NextResponse.json({
        success: true,
        mode: 'simulated',
        message: 'Running in zero-cost live simulation mode',
        callDetails: {
          studentName,
          taskReason,
          phoneNumber,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error: any) {
    console.error('Trigger call route error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
