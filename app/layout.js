import Context from '@/store/context';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainHeader from '@/components/MainHeader';
import LandingCard from '@/components/LandingCard';
import MainFooter from '@/components/MainFooter';
import SideBarCustom from '@/components/SideBarCustom';
import SubTopNav from '@/components/SubTopNav';


export const metadata = {
  title: 'SSLE | Dashboard',
  description: 'Metro | Bus, Rail, Subway, Bike &amp; Micro in Los Angeles'
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <MainHeader />
        <LandingCard />
        <SubTopNav />
        <div className="container">
          <div className="row">
            <SideBarCustom />
            <Context>{children}</Context>
          </div>
        </div>
        <MainFooter />
      </body>
    </html>
  );
}
