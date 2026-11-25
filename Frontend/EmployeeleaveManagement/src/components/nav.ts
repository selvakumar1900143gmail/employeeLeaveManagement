import {
    CalendarCheck,
    CalendarRange,
    FilePlus2,
    Hourglass,
    Inbox,
    type LucideIcon,
} from 'lucide-react';

export interface NavItem {
    to: string;
    label: string;
    icon: LucideIcon;
    managerOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    {
        to: '/my-leaves',
        label: 'My leave',
        icon: CalendarCheck,
    },
    {
        to: '/planner',
        label: 'Planner',
        icon: CalendarRange,
    },
    {
        to: '/apply',
        label: 'Apply',
        icon: FilePlus2,
    },
    {
        to: '/balance',
        label: 'Balance',
        icon: Hourglass,
    },
    {
        to: '/approvals',
        label: 'Requests',
        icon: Inbox,
        managerOnly: true,
    },
];

export function navFor(isManager: boolean) {
    return NAV_ITEMS.filter(
        (item) => !item.managerOnly || isManager
    );
}

export function bottomBarFor(isManager: boolean) {
    const visiblePaths = isManager
        ? ['/my-leaves', '/planner', '/approvals', '/apply']
        : ['/my-leaves', '/planner', '/apply', '/balance'];

    const navigationItems = navFor(isManager);

    const bottomItems = visiblePaths
        .map((path) =>
            navigationItems.find((item) => item.to === path)
        )
        .filter((item): item is NavItem => Boolean(item));

    const overflowItems = navigationItems.filter(
        (item) => !visiblePaths.includes(item.to)
    );

    return {
        bar: bottomItems,
        overflow: overflowItems,
    };
}