
import type {
    LeaveDto,
    MonthView,
    PlannerDay,
    PlannerLeave,
    StatusFilterValue,
} from '../types.ts';

import {
    daysInMonth,
    isWeekend,
    toISO,
} from './dates';


export function fromDto(leave: LeaveDto): PlannerLeave | null {
    if (
        leave.status !== 'PENDING' &&
        leave.status !== 'APPROVED' &&
        leave.status !== 'REJECTED'
    ) {
        return null;
    }

    return {
        id: String(leave.id),

        employee: {
            id: leave.employeeName,
            name: leave.employeeName,
        },

        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        days: leave.days,
        reason: leave.reason,
        status: leave.status,
    };
}


export function buildMonth(
    view: MonthView,
    leaves: PlannerLeave[],
    filter: StatusFilterValue,
    todayISO: string
): PlannerDay[] {
    const filteredLeaves = leaves.filter((leave) => {
        return filter === 'ALL' || leave.status === filter;
    });

    const totalDays = daysInMonth(view.year, view.month);

    return Array.from({ length: totalDays }, (_, index) => {
        const date = new Date(
            view.year,
            view.month,
            index + 1
        );

        const isoDate = toISO(date);
        const weekend = isWeekend(date);

        const dayEntries = weekend
            ? []
            : filteredLeaves
                .filter((leave) => {
                    return (
                        leave.startDate <= isoDate &&
                        isoDate <= leave.endDate
                    );
                })
                .sort((first, second) => {
                    return first.employee.name.localeCompare(
                        second.employee.name
                    );
                });

        return {
            date,
            iso: isoDate,
            isWeekend: weekend,
            isToday: isoDate === todayISO,
            entries: dayEntries,
        };
    });
}
