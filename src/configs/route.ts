import type { ComponentType } from 'react';

import { ArchiveIcon, FileTextIcon, Trash2Icon } from 'lucide-react';

interface Route {
  label: string;
  href: '/' | '/archived' | '/trash';
  icon: ComponentType;
}

export const routes: Route[] = [
  {
    label: 'Notes',
    href: '/',
    icon: FileTextIcon,
  },
  {
    label: 'Archived',
    href: '/archived',
    icon: ArchiveIcon,
  },
  {
    label: 'Trash',
    href: '/trash',
    icon: Trash2Icon,
  },
];
