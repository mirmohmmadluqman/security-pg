import { Logo } from "@/components/Logo";

export default function Page() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8 p-10 overflow-hidden">
            {/* Abstract Background Blur */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />

            <div className="relative z-10 flex flex-col items-center gap-4">
                <h1 className="text-white/10 text-xs uppercase tracking-[0.5em] font-mono border-b border-white/5 pb-2 mb-10">
                    Logo Architecture Preview
                </h1>

                {/* High Resolution Scale Container */}
                <div className="relative p-20 rounded-full bg-white/[0.02] border border-white/5 shadow-2xl backdrop-blur-3xl group transition-all duration-700 hover:bg-white/[0.05]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="scale-[4.5] transform-gpu transition-transform duration-700 group-hover:scale-[5]">
                        <Logo className="!gap-4" />
                    </div>
                </div>

                <div className="mt-24 space-y-4 text-center">
                    <p className="text-cyan-400 font-mono text-[10px] tracking-wider animate-pulse">
                        STATUS: GLASS_SENTINEL.SVG_ACTIVE
                    </p>
                    <div className="flex gap-2 justify-center">
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-white/40 font-mono">VECTOR_SVG</div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-white/40 font-mono">DYNAMIC_GRADIENTS</div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-white/40 font-mono">HIGH_FIDELITY</div>
                    </div>
                </div>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-white/20" />
            <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-white/20" />
            <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-white/20" />
            <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-white/20" />
        </div>
    );
}
