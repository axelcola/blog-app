'use client'

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <span className="font-medium">{session?.user?.name || 'Guest'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;