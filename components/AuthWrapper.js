"use client";

import { usePathname } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import LandingCard from '@/components/LandingCard';
import MainFooter from '@/components/MainFooter';
import SideBarCustom from '@/components/SideBarCustom';
import SubTopNav from '@/components/SubTopNav';
import LoginPage from './LoginPage';
import { SessionProvider } from 'next-auth/react';
import '@/app/custom.css';
import SideBarCustomNew from './SideBarCustomNew';
import DashboardCards from './DashboardCards';
import DashboardToggleMap from './DashboardToggleMap';

export default function AuthWrapper({ children }) {
    const pathName = usePathname();
    const [statType, transportType] = pathName.substring(1).split('/');
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
            // <SessionProvider>
            //     <MainHeader />
            //     <div className="container">
            //         <div className="row">
            //             <SideBarCustom />
            //             {children}
            //         </div>
            //     </div>
            //     <MainFooter />
            // </SessionProvider>

            <SessionProvider>
                <div className="container-fluid w-100 p-0">
                    <div className="container-fluid d-flex w-100vw bg-red">
                        <SideBarCustomNew />
                        <div className="w-100 MainContainer d-flex flex-column h-100">
                            {/* <DashboardCards /> */}
                            {/* <LandingCard /> */}
                            <div className="container-fluid">

                                <div className="container-fluid">
                                    <div className="row">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <MainFooter />
            </SessionProvider>
        );
    }

    return (
        <>
            <SessionProvider>
                <div className="metro__mobile-header container-fluid w-100 p-0">
                    <MainHeader />
                </div>
                <div className="container-fluid w-100 p-0">
                    <div className="container-fluid d-flex w-100vw bg-red">
                        <SideBarCustomNew />
                        <div className="w-100 MainContainer d-flex flex-column h-100">
                            <div className='row'>
                                <div className='col-md-12'>
                                    <DashboardCards />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                            <div className="container-fluid">
                                {statType === 'crime' ? (
                                    <DashboardToggleMap />
                                ) : null}
                                {/* <SubTopNav /> */}
                                    <div className="row px-3">
                                        <div className='col-md-12'>
                                        {children}
                                        </div>
                                    </div>
                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <MainFooter />
            </SessionProvider>
        </>
    );
}
