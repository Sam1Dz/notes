'use client';

import { Menu, NotepadText, Search } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/shadcn-studio/button';
import { Input } from '~/components/ui/shadcn-studio/input';

export function LayoutHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6">
      <div className="flex flex-1 items-center gap-16">
        <div className="flex items-center gap-2">
          <Button className="cursor-pointer" size="icon" variant="ghost">
            <Menu />
          </Button>

          <NotepadText size={32} />
          <span className="text-2xl">Notes</span>
        </div>

        <Input
          classNames={{
            container: 'max-w-xl hidden lg:block',
            input: 'h-8',
          }}
          placeholder='Search notes (e.g., "meeting", "project")'
          startIcon={Search}
          type="text"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button className="lg:hidden" size="icon" variant="ghost">
          <Search />
        </Button>
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
