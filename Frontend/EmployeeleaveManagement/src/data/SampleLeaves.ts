
import type { Employee, PlannerLeave, PlannerStatus } from '../types.ts';
import { addDays, isWeekend, toISO } from '../lib/dates';

const employees: Employee[] = [
    { id: 'e1', name: 'James Lankins', department: 'Sales & Marketing' },
    { id: 'e2', name: 'Beth Owens', department: 'Accounts' },
    { id: 'e3', name: 'Priya Balan', department: 'Engineering' },
    { id: 'e4', name: 'Rahul Kumar', department: 'Engineering' },
    { id: 'e5', name: 'Divya Sharma', department: 'People Operations' },
    { id: 'e6', name: 'Tomás Herrera', department: 'Customer Support' },
    { id: 'e7', name: 'Amara Okafor', department: 'Finance' },
    { id: 'e8', name: 'Lena Fischer', department: 'Design' },
    { id: 'e9', name: 'Marcus Webb', department: 'Sales & Marketing' },
    { id: 'e10', name: 'Hannah Cole', department: 'Legal' },
    { id: 'e11', name: 'Wei Zhang', department: 'Engineering' },
    { id: 'e12', name: 'Sophie Laurent', department: 'Customer Support' },
];

type LeaveSample = [
    number,
    string,
    PlannerStatus,
    number,
    number,
    string
];

const leaveSamples: LeaveSample[] = [
    [0, 'Annual leave', 'APPROVED', 2, 3, 'Family trip'],
    [1, 'Sick leave', 'APPROVED', 3, 1, 'Fever'],
    [2, 'Annual leave', 'APPROVED', 8, 5, 'Travel'],
    [3, 'Personal leave', 'PENDING', 9, 2, 'Personal work'],
    [4, 'Annual leave', 'APPROVED', 14, 4, 'Family function'],
    [5, 'Sick leave', 'APPROVED', 15, 2, 'Medical appointment'],
    [6, 'Annual leave', 'PENDING', 20, 3, 'Out of town'],
    [7, 'Personal leave', 'APPROVED', 22, 1, 'Moving house'],
    [8, 'Annual leave', 'PENDING', 22, 6, 'Holiday'],
    [9, 'Annual leave', 'APPROVED', 27, 2, 'Long weekend'],
    [10, 'Sick leave', 'PENDING', 28, 1, 'Dental surgery'],
    [11, 'Annual leave', 'APPROVED', 34, 5, 'Travel'],
    [0, 'Personal leave', 'PENDING', 40, 2, 'Wedding'],
    [3, 'Annual leave', 'APPROVED', 42, 8, 'Year-end break'],
    [5, 'Annual leave', 'APPROVED', 43, 4, 'Family visit'],
    [7, 'Annual leave', 'PENDING', 48, 3, 'Holiday'],
];

function getNextWorkingDay(date: Date): Date {
    while (isWeekend(date)) {
        date = addDays(date, 1);
    }

    return date;
}

export function buildSampleLeaves(now = new Date()): PlannerLeave[] {
    const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    return leaveSamples.map(
        ([employeeIndex, leaveType, status, offset, days, reason], index) => {
            const startDate = getNextWorkingDay(
                addDays(monthStart, offset)
            );

            let endDate = startDate;
            let remainingDays = days - 1;

            while (remainingDays > 0) {
                endDate = addDays(endDate, 1);

                if (!isWeekend(endDate)) {
                    remainingDays--;
                }
            }

            return {
                id: `sample-${index}`,
                employee: employees[employeeIndex],
                leaveType,
                startDate: toISO(startDate),
                endDate: toISO(endDate),
                days,
                reason,
                status,
            };
        }
    );
}
