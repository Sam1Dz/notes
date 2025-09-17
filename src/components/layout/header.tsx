'use client';

import { NotepadText, Search } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Input } from '~/components/ui/shadcn-studio/input';

export function LayoutHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6">
      <div className="flex cursor-default items-center gap-2">
        <NotepadText size={32} />
        <span className="text-2xl">Notes</span>
      </div>

      <Input
        classNames={{
          container: 'max-w-3xl',
          input: 'h-8',
        }}
        placeholder='Search notes (e.g., "meeting", "project")'
        startIcon={Search}
        type="text"
      />

      <Avatar className="cursor-pointer">
        <AvatarImage
          alt="@shadcn"
          src="https://avatars.githubusercontent.com/u/36542547?v=4"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </header>
  );
}
