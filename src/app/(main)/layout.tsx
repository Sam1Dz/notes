import { AppProvider } from '~/frontend/components/provider/app';

export default function Layout({ children }: React.PropsWithChildren) {
  return <AppProvider>{children}</AppProvider>;
}
