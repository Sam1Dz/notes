import '~/styles/globals.css';

import { BaseProvider } from '~/components/providers/base';
import {
  fontRoboto,
  fontRobotoMono,
  fontRobotoSerif,
} from '~/lib/config/fonts';

export { metadata } from '~/lib/config/site';

export default function Root({ children }: React.PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${fontRoboto.variable} ${fontRobotoSerif.variable} ${fontRobotoMono.variable} antialiased`}
      >
        <BaseProvider>{children}</BaseProvider>
      </body>
    </html>
  );
}
