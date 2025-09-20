'use client';

import { LuNotepadText } from 'react-icons/lu';

export function AuthLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
        <LuNotepadText className="text-primary-foreground h-8 w-8" />
      </div>
      <span className="font-serif text-2xl">Notes</span>
    </div>
  );
}
