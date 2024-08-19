import { SessionProvider } from 'next-auth/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainHeader from '@/components/MainHeader';
import LandingCard from '@/components/LandingCard';
import MainFooter from '@/components/MainFooter';
import SideBarCustom from '@/components/SideBarCustom';
import SubTopNav from '@/components/SubTopNav';
import AuthWrapper from '@/components/AuthWrapper';


export const metadata = {
  title: 'SSLE | Dashboard',
  description: 'Metro | Bus, Rail, Subway, Bike &amp; Micro in Los Angeles'
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
      <body>
      <AuthWrapper>
      {children}
      </AuthWrapper>
      </body>
    </html>
  );
}
