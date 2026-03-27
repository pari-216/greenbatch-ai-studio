import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, LogIn, UserPlus } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen green-gradient-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle animated circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-foreground/5 animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary-foreground/5 animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-fade-in">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center mb-8">
          <FlaskConical className="w-10 h-10 text-primary-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-4 tracking-tight">
          GreenBatch AI
        </h1>

        {/* Tagline */}
        <p className="text-xl text-primary-foreground/80 mb-3 font-medium">
          Predict. Optimize. Eliminate Waste.
        </p>

        {/* Description */}
        <p className="text-primary-foreground/60 mb-12 max-w-md text-sm">
          Enterprise Manufacturing Intelligence Platform for Pharmaceutical Excellence
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-foreground/15 border border-primary-foreground/25 text-primary-foreground font-semibold hover:bg-primary-foreground/25 transition-all duration-200 backdrop-blur-sm"
          >
            <LogIn className="w-5 h-5" />
            Login
          </button>
          <button
            onClick={() => navigate('/create-account')}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all duration-200"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-primary-foreground/40 text-xs">
        Secure Enterprise Platform • AI-Powered Insights
      </p>
    </div>
  );
};

export default LandingPage;
