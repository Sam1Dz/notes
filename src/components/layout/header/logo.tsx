'use client';

import { NotepadTextIcon } from 'lucide-react';

import { cn } from '~/libs/utils';

interface HeaderLogoProps {
  className?: string;
}

export function HeaderLogo({ className }: HeaderLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <NotepadTextIcon size={32} />
      <span className="text-2xl">Notes</span>
    </div>
  );
}
