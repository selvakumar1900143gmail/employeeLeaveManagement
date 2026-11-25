import { LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getName, isManager, signOut } from '../lib/session';
import { Logo } from '../ui/Logo';
import { EmployeeAvatar } from './EmployeeAvatar';
import { navFor } from './nav';

export function Header() {
    const navigate = useNavigate();

    const employeeName = getName();
    const navigationItems = navFor(isManager());

    function handleSignOut() {
        signOut();
        navigate('/login');
    }

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-6 border-b border-line bg-white px-4 md:px-6 lg:hidden">
            <NavLink to="/planner" aria-label="LeaveEase home">
                <Logo />
            </NavLink>

            <nav
                aria-label="Main"
                className="hidden h-full flex-1 items-stretch gap-1 md:flex"
            >
                {navigationItems.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `relative flex items-center px-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? 'text-accent after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-brand'
                                    : 'text-sub hover:text-ink'
                            }`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 md:ml-0">
                <EmployeeAvatar name={employeeName} size="sm" />

                <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-sub hover:bg-surface hover:text-ink"
                >
                    <LogOut className="size-4" />
                    <span className="hidden sm:inline">
            Sign out
          </span>
                </button>
            </div>
        </header>
    );
}