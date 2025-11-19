import React from 'react';

function Header() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow">
        Weather Dashboard — God Mode
      </h1>
      <p className="text-blue-200/80 mt-2">
        Manually set the weather and watch the scene react in real time
      </p>
    </div>
  );
}

export default Header;
