import React from "react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="relative bg-white shadow px-4 py-3 flex items-center">
  <button
    onClick={toggleSidebar}
    className="text-gray-700 focus:outline-none md:hidden"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
  <h2 className="mx-auto font-semibold text-lg">Dashboard</h2>
</header>

  );
};

export default Header;
