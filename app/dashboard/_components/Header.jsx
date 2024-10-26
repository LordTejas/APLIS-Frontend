'use client';

import { logout } from '@/actions/auth';
import useSession from '@/app/hooks/useSession';

const Header = () => {

  const { session } = useSession();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">
        {session?.user?.role === 'TEACHER' ? 'Teacher Dashboard' : 'Student Dashboard'}
      </h1>
      <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
        Logout
      </button>
    </header>
  );
};

export default Header;

