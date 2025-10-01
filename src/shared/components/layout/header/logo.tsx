'use client';

import { LuNotepadText } from 'react-icons/lu';

import { cn } from '~/shared/utils/common/class-merger';

interface HeaderLogoProps {
  className?: string;
}

export function HeaderLogo({ className }: HeaderLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LuNotepadText size={32} />
      <span className="text-2xl">Notes</span>
    </div>
  );
}
