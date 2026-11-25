import type { PlannerLeave } from '../types.ts';
import { StatusIndicator } from '../ui/StatusPill';
import { EmployeeAvatar } from './EmployeeAvatar';

interface LeaveEntryProps {
    leave: PlannerLeave;
}

export function LeaveEntry({ leave }: LeaveEntryProps) {
    const { employee } = leave;

    return (
        <div className="flex items-center gap-3 py-2">
            <EmployeeAvatar name={employee.name} />

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-tight">
                    {employee.name}
                </p>

                <p className="truncate text-[13px] text-sub">
                    {employee.department ?? leave.leaveType}
                </p>
            </div>

            <StatusIndicator status={leave.status} />
        </div>
    );
}