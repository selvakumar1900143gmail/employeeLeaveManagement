import { LogOut, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getName, isManager, signOut } from '../lib/session';
import { EmployeeAvatar } from './EmployeeAvatar';
import { bottomBarFor } from './nav';

const tabClass =
    'flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors';

export function BottomNavigation() {
    const { bar, overflow } = bottomBarFor(isManager());
    const [menuOpen, setMenuOpen] = useState(false);

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const employeeName = getName();

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    function handleSignOut() {
        signOut();
        navigate('/login');
    }

    return (
        <>
            {menuOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {menuOpen && (
                <div
                    role="menu"
                    className="fixed right-3 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-50 w-56 rounded-lg border border-line bg-white p-1.5 shadow-sm md:hidden"
                >
                    <div className="flex items-center gap-2.5 px-2.5 py-2">
                        <EmployeeAvatar name={employeeName} size="sm" />
                        <p className="truncate text-sm font-semibold">
                            {employeeName}
                        </p>
                    </div>

                    <div className="my-1 border-t border-line" />

                    {overflow.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            role="menuitem"
                            className="flex h-10 items-center gap-3 rounded-md px-2.5 text-sm font-medium hover:bg-surface"
                        >
                            <Icon className="size-[18px] text-sub" />
                            {label}
                        </NavLink>
                    ))}

                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="flex h-10 w-full items-center gap-3 rounded-md px-2.5 text-sm font-medium hover:bg-surface"
                    >
                        <LogOut className="size-[18px] text-sub" />
                        Sign out
                    </button>
                </div>
            )}

            <nav
                aria-label="Main"
                className="fixed inset-x-0 bottom-0 z-50 flex h-[calc(4rem+env(safe-area-inset-bottom))] border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
            >
                {bar.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `${tabClass} ${isActive ? 'text-accent' : 'text-faint'}`
                        }
                    >
                        <Icon className="size-[22px]" />
                        {label}
                    </NavLink>
                ))}

                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-expanded={menuOpen}
                    aria-haspopup="menu"
                    className={`${tabClass} ${menuOpen ? 'text-accent' : 'text-faint'}`}
                >
                    <MoreHorizontal className="size-[22px]" />
                    More
                </button>
            </nav>
        </>
    );
}