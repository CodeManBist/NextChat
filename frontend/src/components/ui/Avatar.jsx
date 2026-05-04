import React from "react";

const Avatar = ({ 
  name, 
  imageUrl, 
  size = "md", 
  className = "",
  isGroup = false 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  const getInitials = (text) => {
    if (!text) return "U";
    return text
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  // Group avatar with gradient background
  if (isGroup) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shrink-0 ${className}`}
      >
        {getInitials(name)}
      </div>
    );
  }

  // User avatar
  return (
    <img
      src={`https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`}
      alt={name}
      className={`${sizeClasses[size]} rounded-full object-cover shrink-0 ${className}`}
    />
  );
};

export default Avatar;
