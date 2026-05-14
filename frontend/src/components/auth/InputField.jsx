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
      <label className="block text-sm text-white/70 mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="theme-input w-full rounded-2xl px-4 py-3"
      />
    </div>
  );
};

export default InputField;