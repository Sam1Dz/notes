import '~/styles/globals.css';

import { Provider } from '~/components/provider/base';
import { fontRoboto, fontRobotoMono, fontRobotoSerif } from '~/configs/fonts';

export { metadata } from '~/configs/site';

export default function Root({ children }: React.PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${fontRoboto.variable} ${fontRobotoSerif.variable} ${fontRobotoMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
