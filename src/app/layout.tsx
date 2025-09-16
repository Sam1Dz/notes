import '~/styles/globals.css';

import { ThemeProvider } from '~/components/theme-provider';
import { fontRoboto, fontRobotoMono, fontRobotoSerif } from '~/configs/fonts';

export { metadata } from '~/configs/site';

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="id">
      <body
        className={`${fontRoboto.variable} ${fontRobotoSerif.variable} ${fontRobotoMono.variable} antialiased`}
      >
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
