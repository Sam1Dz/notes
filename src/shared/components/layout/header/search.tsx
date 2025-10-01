import { LuSearch } from 'react-icons/lu';

import { Input } from '~/shared/components/ui/shadcn-studio/input';
import { cn } from '~/shared/utils/common/class-merger';

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
