import { formatRange, longDate, plural } from '../lib/dates';
import type { PlannerDay } from '../types.ts';
import { StatusIndicator } from '../ui/StatusPill';
import { EmployeeAvatar } from './EmployeeAvatar';

interface DayDetailProps {
    day: PlannerDay;
}

export function DayDetail({ day }: DayDetailProps) {
    return (
        <div>
            <h3 className="text-sm font-semibold">
                {longDate(day.date)}
            </h3>

            {day.entries.length === 0 ? (
                <p className="mt-2 text-sm text-sub">
                    {day.isWeekend ? 'Weekend.' : 'Nobody is on leave.'}
                </p>
            ) : (
                <>
                    <p className="mt-0.5 text-[13px] text-sub">
                        {day.entries.length === 1
                            ? '1 person'
                            : `${day.entries.length} people`} out
                    </p>

                    <ul className="mt-3 divide-y divide-line">
                        {day.entries.map((leave) => {
                            const { range } = formatRange(
                                leave.startDate,
                                leave.endDate
                            );

                            return (
                                <li
                                    key={leave.id}
                                    className="py-3 first:pt-0 last:pb-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <EmployeeAvatar
                                            name={leave.employee.name}
                                            size="sm"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold leading-tight">
                                                {leave.employee.name}
                                            </p>

                                            {leave.employee.department && (
                                                <p className="truncate text-[13px] text-sub">
                                                    {leave.employee.department}
                                                </p>
                                            )}
                                        </div>

                                        <StatusIndicator status={leave.status} />
                                    </div>

                                    <p className="mt-1.5 pl-10 text-[13px] text-sub">
                                        {leave.leaveType}, {range} (
                                        {plural(leave.days, 'day')})
                                        {leave.reason && (
                                            <span className="block text-faint">
                        {leave.reason}
                      </span>
                                        )}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}