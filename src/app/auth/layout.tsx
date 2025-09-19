import * as React from 'react';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {children}
    </div>
  );
}
