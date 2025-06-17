import React from 'react';

const Loading = () => {
  return (
    <div className='min-h-svh flex items-center justify-center'>
      <div className='spinner'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
