import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = 'AIzaSyBL59rl_vcXEseZToVQwUVl82HPESLHmys';5 

export async function POST(request: NextRequest) {
  try {
    const { style, text } = await request.json();

    if (!style || !text) {
      return NextResponse.json(
        { error: '입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    const styleMap: Record<string, string> = {
      '1': '감성적',
      '2': '현실적',
      '3': '창의적',
      '4': '허세형',
    };

    const selectedStyleName = styleMap[style] || '일반적으로';

    console.log(style, selectedStyleName)
    const prompt = `너는 변명 생성 AI야. 사용자가 입력한 기본 변명 내용을 바탕으로, 다음 네 가지 스타일 중 ${selectedStyleName}에 맞게 변명을 만들어줘.

    ${text}의 내용을 기반으로 생성해줘

스타일:
1. 감성적 — 따뜻하고 공감 가며, 마음의 상태를 솔직하게 드러내는 말투
   예: "요즘 너무 지쳐서 아침에 눈을 못 떴어… 미안해."
2. 현실적 — 상황을 있는 그대로 명확하게 설명하는 말투
   예: "버스 놓쳐서 15분 걸어왔어… 다 땀 됨."
3. 창의적 — 재치 있고 기발한 상상력을 발휘하는 말투
   예: "엘리베이터에 갇혔다가 구조되고 나왔어… 영화같지?"
4. 허세형 — 자신감 있고 허세 가득한 말투
   예: "오늘 인터뷰 촬영 있다고 착각해서 스튜디오 갔다 왔어."

사용법:
- 입력: 사용자가 변명으로 쓴 짧은 문장이나 상황 설명
- 출력: 선택한 스타일에 맞게 변형하거나 확장한 자연스러운 변명 문장

예시 입력: "늦어서 미안해"
예시 출력(감성적): "요즘 좀... 마음이 그렇잖아… 그래서 늦었어 미안해."
예시 출력(창의적): "길에 갑자기 외계인이 나타나서 탈출하느라 늦었어. 미안해!"
예시 출력(오류): 올바른 내용을 입력해주세요 (사유)

---

반환은 무조건 생성된 문장만 출력해줘

${style}에 맞는 창의적이고 자연스러운 변명 한 문장 이상을 출력해줘.

`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const geminiData = await geminiRes.json();
    const generatedExcuse =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
      '변명 생성에 실패했습니다.';

    return NextResponse.json({
      generatedExcuse,
      originalText: text,
      style: selectedStyleName,
    });

  } catch (error) {
    console.error('변명 생성 오류:', error);
    return NextResponse.json(
      { error: '변명 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
