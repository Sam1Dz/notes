import { Roboto, Roboto_Mono, Roboto_Serif } from 'next/font/google';

export const fontRoboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const fontRobotoSerif = Roboto_Serif({
  subsets: ['latin'],
  variable: '--font-roboto-serif',
});

export const fontRobotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});
