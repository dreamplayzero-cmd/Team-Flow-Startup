import React from 'react';
import { motion } from 'framer-motion';
import luxuryMarbleBg from '../../assets/luxury_marble_bg.png';

interface LoginPageProps {
    onLogin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return (
        <div className="bg-white text-gray-900 min-h-screen w-full flex flex-col relative overflow-x-hidden font-body selection:bg-stitch-primary/10">
            {/* Background Pattern - Fixed to cover entire screen */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <img
                    className="w-full h-full object-cover opacity-30 scale-100"
                    alt="Luxury marble background"
                    src={luxuryMarbleBg}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/60 to-stitch-primary/5"></div>
            </div>

            <main className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center py-12 px-6 md:px-12 lg:px-16 xl:px-24">
                {/* Brand Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif-luxury font-black tracking-tighter text-black leading-none sensible-long-shadow">
                        Youth Startup Flow
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-px bg-white/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(52,46,46,0.2)] border border-white/80"
                >
                    {/* Left Panel: Primary Founder Access */}
                    <div className="md:col-span-7 bg-white/20 backdrop-blur-md p-10 md:p-16 lg:p-24 flex flex-col justify-center relative overflow-hidden group">
                        {/* Interactive Background Glow */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-stitch-primary/10 rounded-full blur-[100px] transition-all duration-1000 group-hover:scale-150"></div>

                        <div className="max-w-xl relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-full bg-stitch-primary flex items-center justify-center text-white shadow-lg shadow-stitch-primary/20">
                                    <span className="material-symbols-outlined text-xl">verified_user</span>
                                </div>
                                <span className="font-st-headline font-bold text-sm tracking-[0.1em] text-stitch-primary uppercase">우선 입장</span>
                            </div>

                            <h2 className="text-4xl lg:text-5xl font-st-headline font-extrabold text-stitch-primary mb-8 leading-[1.1]">인증된 창업자를 위한 <br />전략적 즉시 입장</h2>
                            <p className="text-stitch-on-surface-variant text-lg lg:text-xl mb-12 leading-relaxed font-light opacity-80">수동 인증 단계를 건너뛰세요. 보안 생체 인식 또는 하드웨어 키 링크를 사용하여 StarterMap 대시보드에 즉시 접속할 수 있습니다.</p>

                            <button
                                onClick={onLogin}
                                className="group w-full md:w-fit min-w-[280px] py-6 px-10 rounded-xl bg-stitch-primary text-white font-st-headline font-bold text-xl flex items-center justify-between gap-6 transition-all duration-500 hover:bg-stitch-primary-container hover:shadow-2xl hover:translate-y-[-2px] active:translate-y-[1px]"
                            >
                                <span>창업자 빠른 접속</span>
                                <span className="material-symbols-outlined transition-transform duration-500 group-hover:translate-x-2">bolt</span>
                            </button>

                            <div className="mt-12 flex flex-wrap items-center gap-6 text-[12px] font-bold text-stitch-on-surface-variant/50 uppercase tracking-[0.15em]">
                                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">lock</span> 암호화됨</span>
                                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">memory</span> AI 인증됨</span>
                                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">speed</span> 즉시 연결</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Standard Login */}
                    <div className="md:col-span-5 bg-white/30 backdrop-blur-xl p-10 md:p-14 lg:p-20 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/20">
                        <div className="mb-12">
                            <h3 className="text-sm font-st-headline font-bold text-stitch-on-surface uppercase tracking-[0.2em] mb-3">직접 로그인</h3>
                            <div className="h-1 w-12 bg-stitch-primary"></div>
                        </div>

                        <form
                            className="space-y-8"
                            onSubmit={(e) => {
                                e.preventDefault();
                                onLogin?.();
                            }}
                        >
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-stitch-on-surface-variant/80 uppercase tracking-[0.1em] ml-1">회사 이메일</label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-stitch-surface-container-lowest border border-stitch-outline-variant/10 rounded-xl px-5 py-4 text-stitch-on-surface placeholder:text-stitch-outline-variant/40 focus:ring-2 focus:ring-stitch-primary/10 focus:border-stitch-primary/30 transition-all text-base outline-none shadow-sm"
                                        placeholder="executive@startermap.ai"
                                        type="email"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[11px] font-black text-stitch-on-surface-variant/80 uppercase tracking-[0.1em]">보안 코드</label>
                                    <a className="text-[11px] font-bold text-stitch-primary/60 hover:text-stitch-primary transition-colors" href="#">계정 복구</a>
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full bg-stitch-surface-container-lowest border border-stitch-outline-variant/10 rounded-xl px-5 py-4 text-stitch-on-surface placeholder:text-stitch-outline-variant/40 focus:ring-2 focus:ring-stitch-primary/10 focus:border-stitch-primary/30 transition-all text-base outline-none shadow-sm"
                                        placeholder="••••••••••••"
                                        type="password"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-1">
                                <div className="relative flex items-center">
                                    <input
                                        className="peer w-5 h-5 rounded border-stitch-outline-variant/20 bg-stitch-surface-container-highest text-stitch-primary focus:ring-offset-0 focus:ring-2 focus:ring-stitch-primary/10 cursor-pointer appearance-none transition-all checked:bg-stitch-primary"
                                        id="remember"
                                        type="checkbox"
                                    />
                                    <span className="material-symbols-outlined absolute pointer-events-none text-white text-base opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">check</span>
                                </div>
                                <label className="text-sm font-bold text-stitch-on-surface-variant/70 cursor-pointer select-none" htmlFor="remember">로그인 상태 유지</label>
                            </div>

                            <button
                                className="w-full py-5 rounded-xl bg-stitch-surface-container-highest text-stitch-on-surface font-st-headline font-bold text-base tracking-[0.05em] hover:bg-stitch-surface-container-high hover:shadow-md transition-all duration-300"
                                type="submit"
                            >
                                로그인하기
                            </button>

                            <div className="relative flex items-center py-6">
                                <div className="flex-grow border-t border-stitch-outline-variant/20"></div>
                                <span className="flex-shrink mx-6 text-[11px] font-black text-stitch-on-surface-variant/30 uppercase tracking-[0.3em]">또는</span>
                                <div className="flex-grow border-t border-stitch-outline-variant/20"></div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#FEE500] text-[#000000] font-st-headline font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] shadow-sm">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.315 6.091l-1.09 4.004c-.06.223.067.46.284.529.06.019.122.029.183.029.16 0 .31-.097.37-.258l1.455-2.14c.243.03.49.047.74.047 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"></path>
                                    </svg>
                                    <span>카카오로 시작하기</span>
                                </button>
                                <button className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white border border-stitch-outline-variant/20 text-stitch-on-surface font-st-headline font-bold text-base transition-all hover:bg-stitch-background active:scale-[0.98] shadow-sm">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                    </svg>
                                    <span>구글로 시작하기</span>
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-10">
                            <p className="text-[12px] text-stitch-on-surface-variant/60 leading-relaxed font-medium">허가된 인원만 접근 가능합니다. <br />모든 접속은 StarterMap 보안 프로토콜에 따라 모니터링됩니다.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Links */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 flex flex-wrap justify-center gap-x-16 gap-y-4"
                >
                    <a className="text-[11px] font-st-headline font-bold uppercase tracking-[0.3em] text-stitch-primary/40 hover:text-stitch-primary transition-colors" href="#">개인정보 보호 체계</a>
                    <a className="text-[11px] font-st-headline font-bold uppercase tracking-[0.3em] text-stitch-primary/40 hover:text-stitch-primary transition-colors" href="#">거버넌스 표준</a>
                    <a className="text-[11px] font-st-headline font-bold uppercase tracking-[0.3em] text-stitch-primary/40 hover:text-stitch-primary transition-colors" href="#">지원 엔진</a>
                </motion.footer>
            </main>

            {/* Decorative Corner Element */}
            <div className="fixed bottom-0 right-0 p-12 z-0 hidden md:block opacity-30">
                <div className="w-64 h-64 bg-stitch-primary/5 rounded-full blur-[120px] absolute -bottom-16 -right-16"></div>
                <div className="relative border-r border-b border-stitch-primary/10 w-32 h-32 flex items-end justify-end p-4">
                    <span className="text-[11px] font-st-headline font-black text-stitch-primary/20 tracking-[0.1em] uppercase rotate-90 origin-bottom-right translate-x-3">StarterMap.v2.6_ENTERPRISE</span>
                </div>
            </div>
        </div>
    );
};
