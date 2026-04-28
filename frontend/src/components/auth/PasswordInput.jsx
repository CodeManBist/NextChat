import React, { useState } from "react";

const PasswordInput = ({
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-gray-300">
          Password
        </label>

        <button
          type="button"
          className="text-xs text-green-400"
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
          className="w-full bg-[#18241D] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-400"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3 text-gray-400"
        >
          👁
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;