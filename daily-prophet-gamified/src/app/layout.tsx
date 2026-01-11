import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import ToastContainer from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'Daily Prophet Gamified',
  description: 'Sistema de gestao de conteudo Instagram',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
