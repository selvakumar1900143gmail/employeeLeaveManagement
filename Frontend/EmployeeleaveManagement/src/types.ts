
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type PlannerStatus = Extract<LeaveStatus, 'PENDING' | 'APPROVED'|"REJECTED">;
export type StatusFilterValue = 'ALL' | PlannerStatus;

/** Shape returned by /api/leaves/* (see backend Dtos.LeaveResponse). */
export interface LeaveDto {
    id: number;
    employeeName: string;
    leaveType: string;
    startDate: string; // yyyy-mm-dd
    endDate: string;
    days: number;
    reason: string;
    status: LeaveStatus;
    managerComment?: string | null;
    createdAt?: string;
}

export interface LeaveTypeDto { id: number; name: string; annualQuota: number }
export interface BalanceDto { leaveType: string; year: number; quota: number; remainingDays: number }

export interface Employee {
    id: string;
    name: string;
    department?: string; // not provided by the backend yet
}

export interface PlannerLeave {
    id: string;
    employee: Employee;
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
    reason?: string;
    status: PlannerStatus;
}

export interface PlannerDay {
    date: Date;
    iso: string;
    isWeekend: boolean;
    isToday: boolean;
    entries: PlannerLeave[];
}

export interface MonthView { year: number; month: number } // month: 0-11
