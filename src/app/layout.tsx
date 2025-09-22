import '~/frontend/styles/globals.css';

import { fontRoboto, fontRobotoMono, fontRobotoSerif } from '~/configs/fonts';
import { Provider } from '~/frontend/components/provider/base';

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
