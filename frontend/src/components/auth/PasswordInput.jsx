import React, { useState } from "react";

const PasswordInput = ({
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-white/70">
          Password
        </label>

        <button
          type="button"
          className="text-xs text-white/55 hover:text-white transition"
        >
          Forgot Password?
        </button>
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={value}
          onChange={onChange}
          className="theme-input w-full rounded-2xl px-4 py-3 pr-12"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3 text-white/40 hover:text-white transition"
        >
          👁
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;