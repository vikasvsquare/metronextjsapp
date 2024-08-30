"use client";

import { usePathname } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import LandingCard from '@/components/LandingCard';
import MainFooter from '@/components/MainFooter';
import SideBarCustom from '@/components/SideBarCustom';
import SubTopNav from '@/components/SubTopNav';
import LoginPage from './LoginPage';
import { SessionProvider } from 'next-auth/react';
export default function AuthWrapper({ children }) {
    const pathName = usePathname();
    console.log(pathName)
    if (pathName === '/login') {
        return (
            <html lang="en">
                <body>
                    <LoginPage />
                </body>
            </html>
        );
    }
    if (pathName === '/glossary') {
        return (
            <SessionProvider>
                <MainHeader />
                <div className="container">
                    <div className="row">
                        <SideBarCustom />
                        {children}
                    </div>
                </div>
                <MainFooter />
            </SessionProvider>
        );
    }


    return (
        <>
            <SessionProvider>
                <MainHeader />
                <LandingCard />
                <SubTopNav />
                <div className="container">
                    <div className="row">
                        <SideBarCustom />
                        {children}
                    </div>
                </div>
                <MainFooter />
            </SessionProvider>
        </>
    );
}
