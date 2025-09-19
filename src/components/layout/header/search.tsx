import { LuSearch } from 'react-icons/lu';

import { Input } from '~/components/ui/shadcn-studio/input';
import { cn } from '~/libs/utils';

interface HeaderSearchProps {
  className?: string;
}

export function HeaderSearch({ className }: HeaderSearchProps) {
  return (
    <Input
      classNames={{
        container: cn('max-w-3xl md:max-w-xl', className),
        input: 'h-8',
      }}
      placeholder='Search notes (e.g., "meeting", "project")'
      startIcon={LuSearch}
      type="text"
    />
  );
}
