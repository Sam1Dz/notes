'use client';

import * as React from 'react';

import { LayoutHeader } from '~/shared/components/layout/header';
import { LayoutSidebar } from '~/shared/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '~/shared/components/ui/sidebar';

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
