import React from 'react';

const Input = React.forwardRef(({ className='', placeholder='', icon, ...rest }, ref) => {
  return (
    <div className={`flex items-center bg-[#1a2f4a] rounded-xl px-3 ${className}`}> 
      {icon && <div className="text-gray-400 mr-2">{icon}</div>}
      <input ref={ref} className="bg-transparent outline-none text-white placeholder:text-gray-400 w-full py-2" placeholder={placeholder} {...rest} />
    </div>
  );
});

export default Input;
