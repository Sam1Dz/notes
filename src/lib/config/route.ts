import type { ComponentType } from 'react';

import { LuArchive, LuFileText, LuTrash2 } from 'react-icons/lu';

interface Route {
  label: string;
  href: '/' | '/archived' | '/trash';
  icon: ComponentType;
}

export const routes: Route[] = [
  {
    label: 'Notes',
    href: '/',
    icon: LuFileText,
  },
  {
    label: 'Archived',
    href: '/archived',
    icon: LuArchive,
  },
  {
    label: 'Trash',
    href: '/trash',
    icon: LuTrash2,
  },
];
