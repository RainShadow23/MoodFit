import React, { useState } from 'react';
import { ADMIN_PASSWORD_HASH, GUEST_PASSWORD_HASH } from '../constants';

export type UserRole = 'admin' | 'guest';

interface Props {
    onLogin: (role: UserRole) => void;
}

// 브라우저 내장 Web Crypto API로 SHA-256 해시 계산
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const LoginGate: React.FC<Props> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        setIsLoading(true);
        setError('');

        try {
            const hash = await sha256(password);

            if (hash === ADMIN_PASSWORD_HASH) {
                sessionStorage.setItem('moodfit_role', 'admin');
                onLogin('admin');
            } else if (hash === GUEST_PASSWORD_HASH) {
                sessionStorage.setItem('moodfit_role', 'guest');
                onLogin('guest');
            } else {
                setError('비밀번호가 올바르지 않습니다.');
                setPassword('');
            }
        } catch {
            setError('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10 flex flex-col items-center">
                    {/* 로고 아이콘 (심볼) */}
                    <div className="w-24 h-24 mb-4 relative">
                        <img
                            src="/images/logo-icon.png"
                            alt="MoodFit Logo"
                            className="w-full h-full object-contain filter drop-shadow-xl"
                            onError={(e) => {
                                // 이미지 로드 실패 시 기존 이모지 스타일로 폴백
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `<div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg shadow-orange-200"><span class="text-4xl">✨</span></div>`;
                            }}
                        />
                    </div>

                    {/* 로고 텍스트 (이미지) */}
                    <img
                        src="/images/logo-text.png"
                        alt="MoodFit"
                        className="h-10 object-contain mb-2"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            // 텍스트 폴백은 아래 h1 태그가 담당하도록 할 수도 있으나, 여기선 숨기고 h1을 띄우는 방식으로 처리
                        }}
                    />
                    {/* 이미지 실패 시 보여줄 텍스트 (평소엔 숨김 처리 필요하지만, 간단하게 이미지 아래에 둠 - 디자인상 겹칠 수 있으므로 조건부 렌더링이 좋으나 여기선 JS로 처리) */}

                    <p className="text-sm text-gray-500 mt-1 font-medium">AI Personal Lifestyle Coach</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">접속 코드를 입력하세요</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••"
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 text-center text-xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center font-medium animate-pulse">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-base shadow-lg shadow-orange-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '확인 중...' : '입장하기'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    MoodFit © 2026 · Powered by AI
                </p>
            </div>
        </div>
    );
};

export default LoginGate;
