import { AppProvider } from '~/core/providers/app';

export default function Layout({ children }: React.PropsWithChildren) {
  return <AppProvider>{children}</AppProvider>;
}
