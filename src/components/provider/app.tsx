'use client';

import React from 'react';

import { LayoutHeader } from '../layout/header';
import { SidebarProvider } from '../ui/sidebar';

export function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider className="flex-col">
      <LayoutHeader />
      {children}
    </SidebarProvider>
  );
}
