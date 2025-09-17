import '~/styles/globals.css';

import { Provider } from '~/components/provider/base';
import { fontRoboto, fontRobotoMono, fontRobotoSerif } from '~/configs/fonts';

export { metadata } from '~/configs/site';

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="id">
      <body
        className={`${fontRoboto.variable} ${fontRobotoSerif.variable} ${fontRobotoMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
