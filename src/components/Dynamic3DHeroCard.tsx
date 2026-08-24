import React, { useState } from 'react';
import {
  Globe2,
  Cpu,
  Layers,
  Play,
  Pause,
  RotateCw,
  Sparkles,
  Radio,
  Zap,
} from 'lucide-react';
import { ThreeNeuralGlobe, type VisualMode } from './ThreeNeuralGlobe';

interface Dynamic3DHeroCardProps {
  totalReach?: number;
  engagementScore?: number;
}

export const Dynamic3DHeroCard: React.FC<Dynamic3DHeroCardProps> = ({
  totalReach = 32000,
  engagementScore = 78,
}) => {
  const [mode, setMode] = useState<VisualMode>('globe');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const toggleSpeed = () => {
    if (!isRotating) {
      setIsRotating(true);
      setSpeedMultiplier(1);
    } else if (speedMultiplier === 1) {
      setSpeedMultiplier(2.2);
    } else {
      setIsRotating(false);
      setSpeedMultiplier(0);
    }
  };

  return (
    <div className="relative glass rounded-3xl border border-white/[0.08] p-5 shadow-2xl overflow-hidden group">
      {/* Dynamic Background Cyber Glow Gradient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                3D Neural Audience Lattice & Reach Topology
              </h3>
              <span className="text-[10px] px-2 py-0.2 rounded-full font-mono font-bold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                Three.js WebGL
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hardware-accelerated 3D vector physics modeling audience propagation across 4 networks.
            </p>
          </div>
        </div>

        {/* 3D Visual Mode Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/[0.06]">
          <button
            onClick={() => setMode('globe')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              mode === 'globe'
                ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Globe2 className="w-3 h-3 text-indigo-400" />
            <span>Audience Globe</span>
          </button>

          <button
            onClick={() => setMode('neural')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              mode === 'neural'
                ? 'bg-pink-600/30 text-white border border-pink-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Cpu className="w-3 h-3 text-pink-400" />
            <span>Neural Lattice</span>
          </button>

          <button
            onClick={() => setMode('orbit')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              mode === 'orbit'
                ? 'bg-cyan-600/30 text-white border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Multi-Orbit</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area with Live Stats Overlay */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 items-center min-h-[240px] pt-2">
        {/* Left Stats Column */}
        <div className="lg:col-span-4 space-y-2.5 z-10">
          <div className="p-3 bg-black/40 rounded-2xl border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Audience Nodes:</span>
              <strong className="text-white font-mono">{mode === 'neural' ? '450 Particles' : '250 Nodes'}</strong>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Active Orbits:</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" title="LinkedIn" />
                <span className="w-2 h-2 rounded-full bg-sky-400" title="Twitter" />
                <span className="w-2 h-2 rounded-full bg-pink-500" title="Instagram" />
                <span className="w-2 h-2 rounded-full bg-indigo-500" title="Facebook" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Propagation Velocity:</span>
              <span className="text-emerald-400 font-mono font-bold text-[11px]">
                {speedMultiplier === 0 ? 'Paused' : speedMultiplier > 1 ? 'High (2.2x)' : 'Real-time (1.0x)'}
              </span>
            </div>
          </div>

          {/* Quick Interaction Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSpeed}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors"
            >
              {isRotating ? (
                speedMultiplier > 1 ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-pink-400" />
                    <span>Turbo 2.2x</span>
                  </>
                ) : (
                  <>
                    <RotateCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span>Normal 1x</span>
                  </>
                )
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>60 FPS</span>
            </div>
          </div>
        </div>

        {/* Center/Right 3D Canvas */}
        <div className="lg:col-span-8 h-[240px] sm:h-[260px] relative flex items-center justify-center cursor-grab active:cursor-grabbing">
          <ThreeNeuralGlobe
            mode={mode}
            speedMultiplier={isRotating ? speedMultiplier : 0}
            interactive={true}
          />
          {/* Subtle cursor tip overlay */}
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono pointer-events-none bg-black/40 px-2 py-0.5 rounded-lg border border-white/[0.04]">
            Drag / Move mouse to rotate 3D model
          </div>
        </div>
      </div>
    </div>
  );
};
