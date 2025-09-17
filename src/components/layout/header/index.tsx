'use client';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { SidebarTrigger } from '~/components/ui/sidebar';

import { HeaderLogo } from './logo';
import { HeaderSearch } from './search';

export function LayoutHeader() {
  return (
    <header className="bg-background z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4 lg:gap-26">
        <div className="flex flex-1 items-center gap-2 md:flex-0">
          <SidebarTrigger className="cursor-pointer" />
          <HeaderLogo className="hidden md:flex" />
          <HeaderSearch className="md:hidden" />
        </div>

        <HeaderSearch className="hidden md:block" />
      </div>

      <div className="flex items-center gap-2">
        <Avatar className="cursor-pointer">
          <AvatarImage
            alt="@shadcn"
            src="https://avatars.githubusercontent.com/u/36542547?v=4"
          />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
