import { Outlet } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { Header } from './Header';
import { SidebarNavigation } from './SideBarNavigation';

export function AppShell() {
    return (
        <div className="min-h-dvh">
            <SidebarNavigation />

            <div className="lg:pl-60">
                <Header />

                <main className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
                    <Outlet />
                </main>
            </div>

            <BottomNavigation />
        </div>
    );
}