import Link from 'next/link';

import { Database, LogOut } from 'lucide-react';
import { Button } from './button';
import { signOut, useSession } from 'next-auth/react';

export const HeaderActions = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center gap-2">
      {session?.user?.role.toLowerCase() === 'admin' && (
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin" className="cursor-pointer">
            <Database className="text-primary size-4" />
          </Link>
        </Button>
      )}
      <Button variant="outline" size="icon" onClick={handleLogout} className="cursor-pointer">
        <LogOut className="size-4 text-red-500" />
      </Button>
    </div>
  );
};
