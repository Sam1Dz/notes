import '~/styles/globals.css';

import {
  fontRoboto,
  fontRobotoMono,
  fontRobotoSerif,
} from '~/core/config/fonts';
import { BaseProvider } from '~/core/providers/base';

export { metadata } from '~/core/config/site';

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
