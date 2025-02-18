import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  // 서버 컴포넌트에서 현재 URL을 가져오기 위해 헤더에 x-url 추가
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}
