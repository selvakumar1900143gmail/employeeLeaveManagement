import {LogOut, UserPlus} from 'lucide-react';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import { getName, isManager, signOut } from '../lib/session';
import { Logo } from '../ui/Logo';
import { EmployeeAvatar } from './EmployeeAvatar';
import { navFor } from './nav';

export function SidebarNavigation() {
    const navigate = useNavigate();

    const employeeName = getName();
    const manager = isManager();
    const navigationItems = navFor(manager);

    function handleSignOut() {
        signOut();
        navigate('/login');
    }

    return (
        <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-white lg:flex">
            <div className="flex h-16 items-center px-5">
                <Logo />
            </div>

            <nav
                aria-label="Main"
                className="flex-1 space-y-0.5 px-3 py-2"
            >
                {navigationItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-brand-tint text-accent'
                                    : 'text-sub hover:bg-surface hover:text-ink'
                            }`
                        }
                    >
                        <Icon className="size-[18px]" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-line p-3">
                <div className="flex items-center gap-3 px-2 py-1.5">
                    <EmployeeAvatar name={employeeName} />

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold leading-tight">
                            {employeeName}
                        </p>

                        <p className="text-xs text-sub">
                            {manager ? 'Manager' : 'Employee'}
                        </p>
                    </div>
                </div>
                {manager && (
                    <Link
                        to="/add-employee"
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-white hover:opacity-90"
                    >
                        <UserPlus className="size-4" />
                        Add Employee
                    </Link>
                )}

                <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1 flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-sub hover:bg-surface hover:text-ink"
                >
                    <LogOut className="size-[18px]" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}