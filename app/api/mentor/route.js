import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Rule-based mentor responses
function generateMentorResponse(profile, question) {
  const { priority_skills, unpriority_skills, xp, level, language } = profile
  
  const responses = {
    roadmap: `Based on your current progress (Level ${level}, ${xp} XP), here's your personalized roadmap:

1. **Priority Skills**: Focus on ${priority_skills?.slice(0, 3).join(', ')}
   - Complete foundational lessons first
   - Practice daily for 30 minutes
   - Build small projects

2. **Next Steps**: 
   - Reach Level ${level + 1} by earning ${500 - (xp % 500)} more XP
   - Unlock advanced lessons in your priority areas
   - Start exploring ${unpriority_skills?.[0] || 'new skills'}

3. **Career Paths**:
   ${priority_skills?.includes('python') ? '- Python Developer\n   - Data Scientist\n' : ''}
   ${priority_skills?.includes('web-development') ? '- Full Stack Developer\n   - Frontend Engineer\n' : ''}
   ${priority_skills?.includes('data-science') ? '- Data Analyst\n   - ML Engineer\n' : ''}

Keep learning consistently! 🚀`,

    skills: `Your skill analysis:

**Strengths**: ${priority_skills?.join(', ')}
**Areas to explore**: ${unpriority_skills?.join(', ')}

**Recommendations**:
- Master one skill at a time
- Build projects to apply knowledge
- Join communities for peer learning
- Practice coding daily

**Missing Skills** (based on industry trends):
- Problem Solving & Algorithms
- Version Control (Git)
- Communication Skills
- Project Management

Focus on depth over breadth! 💪`,

    motivation: `You're doing great! 🌟

**Your Progress**:
- Level: ${level}
- XP: ${xp}
- Skills Learning: ${(priority_skills?.length || 0) + (unpriority_skills?.length || 0)}

**Keep Going**:
- Consistency beats intensity
- Small daily progress compounds
- Every expert was once a beginner
- Your future self will thank you

Remember: "The expert in anything was once a beginner." - Helen Hayes

You've got this! 💪`,

    default: `Great question! Here's my advice:

Based on your profile:
- Level: ${level}
- Focus Areas: ${priority_skills?.slice(0, 2).join(', ')}

**My Suggestion**:
1. Continue with your priority skills
2. Complete at least one lesson daily
3. Practice through the game section
4. Build small projects to apply learning

**Pro Tips**:
- Learn in your language (${language}) for better understanding
- Take breaks to avoid burnout
- Join study groups or communities
- Track your progress regularly

Need more specific guidance? Ask me about roadmaps, skills, or career paths! 🎯`
  }

  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('roadmap') || lowerQuestion.includes('path') || lowerQuestion.includes('plan')) {
    return responses.roadmap
  } else if (lowerQuestion.includes('skill') || lowerQuestion.includes('learn') || lowerQuestion.includes('missing')) {
    return responses.skills
  } else if (lowerQuestion.includes('motivat') || lowerQuestion.includes('help') || lowerQuestion.includes('stuck')) {
    return responses.motivation
  } else {
    return responses.default
  }
}

export async function POST(request) {
  try {
    const { user_id, question } = await request.json()

    if (!user_id || !question) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check user tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_tokens')
      .select('tokens')
      .eq('user_id', user_id)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (tokenData.tokens < 1) {
      return NextResponse.json(
        { need_payment: true, message: 'Insufficient tokens' },
        { status: 402 }
      )
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    // Generate response (rule-based for now)
    const response = generateMentorResponse(profile, question)

    // Deduct token
    await supabase
      .from('user_tokens')
      .update({ tokens: tokenData.tokens - 1, updated_at: new Date().toISOString() })
      .eq('user_id', user_id)

    // Save mentor request
    await supabase
      .from('mentor_requests')
      .insert({
        user_id,
        prompt: question,
        response,
        tokens_used: 1
      })

    return NextResponse.json({
      response,
      tokens_remaining: tokenData.tokens - 1
    })
  } catch (error) {
    console.error('Mentor API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
