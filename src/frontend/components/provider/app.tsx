'use client';

import * as React from 'react';

import { LayoutHeader } from '../layout/header';
import { LayoutSidebar } from '../layout/sidebar';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';

export function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider className="flex-col">
      <LayoutHeader />

      <div className="flex flex-row">
        <LayoutSidebar />
        <SidebarInset className="p-6">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
