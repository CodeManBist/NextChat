import React from "react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#18241D] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-400"
      />
    </div>
  );
};

export default InputField;