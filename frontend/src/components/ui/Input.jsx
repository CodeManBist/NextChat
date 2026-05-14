import React from 'react';

const Input = React.forwardRef(({ className='', placeholder='', icon, ...rest }, ref) => {
  return (
    <div className={`theme-input flex items-center rounded-2xl px-3 ${className}`}> 
      {icon && <div className="text-white/35 mr-2">{icon}</div>}
      <input ref={ref} className="bg-transparent outline-none text-white placeholder:text-white/35 w-full py-2.5" placeholder={placeholder} {...rest} />
    </div>
  );
});

export default Input;
