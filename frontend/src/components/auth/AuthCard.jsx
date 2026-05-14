import React from "react";

const AuthCard = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLink,
}) => {
  return (
    <div className="theme-shell min-h-screen flex items-center justify-center px-4 py-8">
      <div className="theme-panel-strong w-full max-w-md rounded-[28px] p-8 sm:p-9">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            NextChat
          </h1>

          <h2 className="text-white text-2xl font-semibold mt-4 tracking-tight">
            {title}
          </h2>

          <p className="theme-text-muted text-sm mt-2 leading-6">
            {subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {children}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10"></div>

          <span className="text-xs text-white/35 tracking-[0.25em] uppercase">
            OR CONTINUE WITH
          </span>

          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button className="theme-button-secondary rounded-2xl py-3 transition">
            Google
          </button>

          <button className="theme-button-secondary rounded-2xl py-3 transition">
            GitHub
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-white/55 text-sm mt-8 leading-6">
          {footerText}{" "}
             <a href={footerLink} className="text-white/75 hover:text-white hover:underline transition">
             {footerLinkText}
           </a>
        </p>
      </div>
    </div>
  );
};

export default AuthCard;