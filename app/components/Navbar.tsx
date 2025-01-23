'use client'

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link 
            href="/Home"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/my-notes"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            My notes
          </Link>
        </div>

        <div className="flex items-center">
          <span className="text-gray-700 font-medium">
            {session?.user?.name || 'Guest'}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;