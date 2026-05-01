import React from 'react';
import Input from './Input';

const SearchInput = ({ value, onChange, placeholder='Search', className='' }) => {
  return (
    <div className={className}>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>}
      />
    </div>
  );
}

export default SearchInput;
