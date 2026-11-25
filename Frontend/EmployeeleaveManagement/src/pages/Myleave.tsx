
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    Send,
    XCircle,
    type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { formatRange, plural } from '../lib/dates';
import type { LeaveDto } from '../types.ts';
import { ButtonLink } from '../ui/Button';
import {
    EmptyState,
    ErrorNote,
    PageHeader,
} from "../ui/PageHeader.tsx";
import { StatusPill } from '../ui/StatusPill';

// Reusable component for displaying leave statistics.
function Stat({
                  icon: Icon,
                  label,
                  value,
                  tone,
              }: {
    icon: LucideIcon;
    label: string;
    value: number;
    tone: string;
}) {
    return (
        <div className="bg-white p-4">
            <Icon aria-hidden className={`size-[18px] ${tone}`} />

            <p className="mt-2 text-[13px] text-sub">
                {label}
            </p>

            <p className="text-2xl font-semibold leading-tight">
                {value}
            </p>
        </div>
    );
}

export default function MyLeaves() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveDto[] | null>(
        null
    );

    const [error, setError] = useState('');

    // Fetch the current employee's leave requests.
    const loadLeaves = useCallback(async () => {
        try {
            const response = await api.get<LeaveDto[]>('/leaves/my');

            setLeaveRequests(response.data);
            setError('');
        } catch (error) {
            setError(errMsg(error));
        }
    }, []);

    useEffect(() => {
        loadLeaves();
    }, [loadLeaves]);

    // Cancel a leave request after getting user confirmation.
    const handleCancel = async (leaveId: number) => {
        const confirmed = window.confirm(
            'Cancel this leave request?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.put(`/leaves/${leaveId}/cancel`);

            setError('');

            // Refresh the leave list to show the updated status.
            await loadLeaves();
        } catch (error) {
            setError(errMsg(error));
        }
    };

    // Count requests based on their current status.
    const getStatusCount = (status: string) => {
        return (
            leaveRequests?.filter((leave) => leave.status === status).length ?? 0
        );
    };

    // Display the newest leave requests first.
    const sortedLeaves = leaveRequests
        ? [...leaveRequests].sort((first, second) =>
            second.startDate.localeCompare(first.startDate)
        )
        : [];

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 lg:px-8 lg:py-8">
            <PageHeader
                title="My leaves"
                description="View your leave requests and their status."
                action={
                    <ButtonLink to="/apply">
                        <Send className="size-4" aria-hidden />
                        Apply for leave
                    </ButtonLink>
                }
            />

            {error && <ErrorNote>{error}</ErrorNote>}

            {leaveRequests === null && !error && (
                <p className="text-sm text-sub">
                    Loading your requests…
                </p>
            )}

            {leaveRequests?.length === 0 && (
                <EmptyState title="No leave requests yet">
                    Requests you submit will appear here.
                </EmptyState>
            )}

            {leaveRequests && leaveRequests.length > 0 && (
                <>
                    {/* Summary of the employee's leave requests. */}
                    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
                        <Stat
                            icon={CalendarDays}
                            label="Total requests"
                            value={leaveRequests.length}
                            tone="text-sub"
                        />

                        <Stat
                            icon={Clock}
                            label="Pending"
                            value={getStatusCount('PENDING')}
                            tone="text-pending-ink"
                        />

                        <Stat
                            icon={CheckCircle2}
                            label="Approved"
                            value={getStatusCount('APPROVED')}
                            tone="text-accent"
                        />

                        <Stat
                            icon={XCircle}
                            label="Rejected"
                            value={getStatusCount('REJECTED')}
                            tone="text-danger"
                        />
                    </div>

                    {/* List of leave requests sorted by start date. */}
                    <ul className="mt-6 divide-y divide-line border-y border-line">
                        {sortedLeaves.map((leave) => {
                            const { range, year } = formatRange(
                                leave.startDate,
                                leave.endDate
                            );

                            // Only pending and approved requests can be cancelled
                            // from this page.
                            const canCancel =
                                leave.status === 'PENDING' ||
                                leave.status === 'APPROVED';

                            return (
                                <li
                                    key={leave.id}
                                    className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 py-4 sm:grid-cols-[110px_1fr_auto_100px] sm:items-center"
                                >
                                    <div className="col-span-2 sm:col-span-1">
                                        <p className="text-sm font-semibold">
                                            {range}
                                        </p>

                                        <p className="text-[13px] text-sub">
                                            {year}
                                        </p>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold">
                                            {leave.leaveType}{' '}
                                            <span className="font-normal text-sub">
                        · {plural(leave.days, 'day')}
                      </span>
                                        </p>

                                        <p className="truncate text-[13px] text-sub">
                                            {leave.reason}
                                        </p>

                                        {leave.managerComment && (
                                            <p className="text-[13px] text-sub">
                                                Manager: {leave.managerComment}
                                            </p>
                                        )}
                                    </div>

                                    <div className="justify-self-end">
                                        <StatusPill status={leave.status} />
                                    </div>

                                    <div className="col-span-2 sm:col-span-1 sm:text-right">
                                        {canCancel && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancel(leave.id)}
                                                className="text-sm font-semibold text-accent hover:underline"
                                            >
                                                Cancel request
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}
