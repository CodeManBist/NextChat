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
    <div className="min-h-screen bg-[#07111B] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#101A13] border border-green-900/30 rounded-2xl p-8 shadow-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">
            SecureChat
          </h1>

          <h2 className="text-white text-2xl font-semibold mt-4">
            {title}
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            {subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {children}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-700"></div>

          <span className="text-xs text-gray-500">
            OR CONTINUE WITH
          </span>

          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button className="border border-gray-700 rounded-lg py-3 text-gray-300 hover:bg-[#18241D] transition">
            Google
          </button>

          <button className="border border-gray-700 rounded-lg py-3 text-gray-300 hover:bg-[#18241D] transition">
            GitHub
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          {footerText}{" "}
          <a
            href={footerLink}
            className="text-green-400 hover:underline"
          >
            {footerLinkText}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthCard;