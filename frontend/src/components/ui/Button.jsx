import React from 'react';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  ghost: 'bg-transparent hover:bg-[#1a3a5c] text-gray-300',
  success: 'bg-[#1ecf8b] hover:bg-[#17b97a] text-black'
};

const sizes = {
  sm: 'px-2 py-1 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-lg'
};

const Button = ({ variant='primary', size='md', children, className='', icon, ...rest }) => {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  return (
    <button className={`${v} ${s} ${className} inline-flex items-center gap-2 justify-center`} {...rest}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export default Button;
