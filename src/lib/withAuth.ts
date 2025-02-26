import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/auth-utils';

type HandlerFunction = (req: NextRequest) => Promise<NextResponse>;

// 인증이 필요한 핸들러를 위한 미들웨어
export function withAuth(handler: HandlerFunction): HandlerFunction {
  return async function (req: NextRequest) {
    // 각 요청마다 동적으로 authOptions를 가져옴
    const authOptions = await getAuthOptions();

    // 동적 authOptions로 세션 확인
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorize' }, { status: 401 });
    }

    // 모든 인증 확인 통과, 원래 핸들러 실행
    return handler(req);
  };
}
