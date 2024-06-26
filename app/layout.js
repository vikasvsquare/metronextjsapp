import Context from '@/store/context';
import './globals.css';

export const metadata = {
  title: 'SSLE | Dashboard',
  description: 'Metro | Bus, Rail, Subway, Bike &amp; Micro in Los Angeles'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <div className="bg-slate-100">
          <div className="max-w-[1440px] mx-auto bg-white">
            <Context>{children}</Context>
          </div>
        </div>
      </body>
    </html>
  );
}
