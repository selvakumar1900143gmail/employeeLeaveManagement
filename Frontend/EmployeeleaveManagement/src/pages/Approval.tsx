
import { Check, Clock, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { EmployeeAvatar } from '../components/EmployeeAvatar';
import { formatRange, plural } from '../lib/dates';
import type { LeaveDto } from '../types.ts';
import { Button } from '../ui/Button';
import { EmptyState, ErrorNote, PageHeader } from '../ui/PageHeader.tsx';
import { StatusPill } from '../ui/StatusPill';
import { inputBase } from '../ui/FormStyle.ts';

export default function Approvals() {
    // Pending requests are initially null because data has not loaded yet.
    const [pendingRequests, setPendingRequests] = useState<LeaveDto[] | null>(null);

    const [teamHistory, setTeamHistory] = useState<LeaveDto[]>([]);

    // Store manager comments separately for each leave request.
    const [comments, setComments] = useState<Record<number, string>>({});

    const [error, setError] = useState('');

    // Fetch pending requests and team history together.
    const loadRequests = useCallback(async () => {
        try {
            const [pendingResponse, teamResponse] = await Promise.all([
                api.get<LeaveDto[]>('/leaves/pending'),
                api.get<LeaveDto[]>('/leaves/team'),
            ]);

            setPendingRequests(pendingResponse.data);

            // Keep only requests that have already been decided.
            const completedRequests = teamResponse.data.filter(
                (leave) => leave.status !== 'PENDING'
            );

            setTeamHistory(completedRequests);
            setError('');
        } catch (error) {
            setError(errMsg(error));
        }
    }, []);

    // Load requests when the component first renders.
    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    // Approve or reject a leave request.
    const handleDecision = async (
        leaveId: number,
        action: 'approve' | 'reject'
    ) => {
        try {
            const managerComment = comments[leaveId] || null;

            await api.put(`/leaves/${leaveId}/${action}`, {
                comment: managerComment,
            });

            setError('');

            // Refresh the list after making a decision.
            await loadRequests();
        } catch (error) {
            setError(errMsg(error));
        }
    };

    // Update the comment belonging to a particular request.
    const handleCommentChange = (leaveId: number, value: string) => {
        setComments((previousComments) => ({
            ...previousComments,
            [leaveId]: value,
        }));
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-8 lg:py-8">
            <PageHeader
                title="Pending approvals"
                description="Review and approve leave requests from your team."
                action={
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3 py-1 text-sm font-medium text-accent">
            <Clock className="size-4" aria-hidden />
                        {pendingRequests?.length ?? 0} awaiting review
          </span>
                }
            />

            {error && <ErrorNote>{error}</ErrorNote>}

            {pendingRequests === null && !error && (
                <p className="text-sm text-sub">Loading requests…</p>
            )}

            {pendingRequests?.length === 0 && (
                <EmptyState title="You're all caught up">
                    No leave requests are waiting for your review.
                </EmptyState>
            )}

            {pendingRequests && pendingRequests.length > 0 && (
                <section aria-labelledby="review-h">
                    <h2 id="review-h" className="mb-2 text-base font-semibold">
                        Requests to review
                    </h2>

                    <ul className="divide-y divide-line border-y border-line">
                        {pendingRequests.map((leave) => {
                            const { range, year } = formatRange(
                                leave.startDate,
                                leave.endDate
                            );

                            return (
                                <li
                                    key={leave.id}
                                    className="grid gap-x-5 gap-y-3 py-4 md:grid-cols-2 xl:grid-cols-[190px_1fr_1fr_minmax(160px,1fr)_auto] xl:items-center"
                                >
                                    <div className="flex items-center gap-3">
                                        <EmployeeAvatar name={leave.employeeName} />

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">
                                                {leave.employeeName}
                                            </p>

                                            <p className="text-[13px] text-sub">
                                                Request #{leave.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            {leave.leaveType}
                                        </p>

                                        <p className="text-[13px] text-sub">
                                            {range} {year} · {plural(leave.days, 'day')}
                                        </p>
                                    </div>

                                    <div className="text-sm">
                                        <span className="text-sub">Reason: </span>
                                        {leave.reason}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`comment-${leave.id}`}
                                            className="sr-only"
                                        >
                                            Manager comment
                                        </label>

                                        <input
                                            id={`comment-${leave.id}`}
                                            placeholder="Add a comment (optional)"
                                            value={comments[leave.id] ?? ''}
                                            onChange={(event) =>
                                                handleCommentChange(leave.id, event.target.value)
                                            }
                                            className={`${inputBase} h-9`}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleDecision(leave.id, 'approve')}
                                        >
                                            <Check className="size-4" aria-hidden />
                                            Approve
                                        </Button>

                                        <Button
                                            variant="danger"
                                            onClick={() => handleDecision(leave.id, 'reject')}
                                        >
                                            <X className="size-4" aria-hidden />
                                            Reject
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            {teamHistory.length > 0 && (
                <section aria-labelledby="history-heading" className="mt-10">
                    <h2
                        id="history-heading"
                        className="mb-2 text-base font-semibold"
                    >
                        Team history
                    </h2>

                    <div className="overflow-x-auto rounded-lg border border-line">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-surface text-[13px] text-sub">
                            <tr>
                                {['Employee', 'Leave type', 'From – To', 'Duration', 'Status'].map(
                                    (heading) => (
                                        <th
                                            key={heading}
                                            scope="col"
                                            className="px-4 py-2.5 font-medium"
                                        >
                                            {heading}
                                        </th>
                                    )
                                )}
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-line">
                            {teamHistory.map((leave) => {
                                const { range, year } = formatRange(
                                    leave.startDate,
                                    leave.endDate
                                );

                                return (
                                    <tr key={leave.id}>
                                        <td className="px-4 py-3">
                        <span className="flex items-center gap-2.5">
                          <EmployeeAvatar
                              name={leave.employeeName}
                              size="sm"
                          />
                            {leave.employeeName}
                        </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            {leave.leaveType}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3">
                                            {range} {year}
                                        </td>

                                        <td className="px-4 py-3">
                                            {plural(leave.days, 'day')}
                                        </td>

                                        <td className="px-4 py-3">
                                            <StatusPill status={leave.status} />
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}
