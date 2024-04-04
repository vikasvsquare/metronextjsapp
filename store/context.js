'use client';
import { createContext, useState } from 'react';
export const Sidebar_data = createContext(null);

function Context({ children }) {
    const [sideBarData, setSideBarData] = useState();

    return (
        <Sidebar_data.Provider value={{ sideBarData, setSideBarData }}>
            {children}
        </Sidebar_data.Provider>
    );
}

export default Context;
