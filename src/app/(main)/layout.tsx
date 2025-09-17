import { AppProvider } from '~/components/provider/app';

export default function Layout({ children }: React.PropsWithChildren) {
  return <AppProvider>{children}</AppProvider>;
}
