'use client';

import { usePathname } from 'next/navigation';
import MiniDrawer from '@/components/Nav/Nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = pathname !== '/login';

  return showNav ? <MiniDrawer>{children}</MiniDrawer> : <>{children}</>;
}
