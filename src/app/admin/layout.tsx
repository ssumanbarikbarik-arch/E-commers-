
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ADMIN_EMAIL = 'rraghabbarik@gmail.com';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      // Wait until user is loaded
      return;
    }

    if (!user) {
      // If no user, redirect to login
      router.push('/login');
      return;
    }

    if (user.email !== ADMIN_EMAIL) {
      // If user is not admin, redirect to home
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <p>Loading or checking permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
