
import {
    CalendarDays,
    HeartPulse,
    Star,
    type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import type { BalanceDto } from '../types.ts';
import {
    EmptyState,
    ErrorNote,
    PageHeader,
} from '../ui/PageHeader.tsx';

// Select an icon based on the leave type.
function getLeaveIcon(leaveType: string): LucideIcon {
    const type = leaveType.toLowerCase();

    if (type.includes('sick') || type.includes('medical')) {
        return HeartPulse;
    }

    if (type.includes('personal')) {
        return Star;
    }

    return CalendarDays;
}

export default function Balance() {
    const [leaveBalances, setLeaveBalances] = useState<BalanceDto[] | null>(
        null
    );

    const [error, setError] = useState('');

    // Fetch the employee's leave balance from the backend.
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await api.get<BalanceDto[]>('/leaves/balance');

                setLeaveBalances(response.data);
            } catch (error) {
                setError(errMsg(error));
            }
        };

        fetchBalance();
    }, []);

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 lg:px-8 lg:py-8">
            <PageHeader
                title="Leave balance"
                description="Your current leave balance for this year."
            />

            {error && <ErrorNote>{error}</ErrorNote>}

            {leaveBalances === null && !error && (
                <p className="text-sm text-sub">Loading your balance…</p>
            )}

            {leaveBalances?.length === 0 && (
                <EmptyState title="No balance available">
                    Your allowances will appear here once they're set up.
                </EmptyState>
            )}

            {leaveBalances && leaveBalances.length > 0 && (
                <ul className="divide-y divide-line rounded-lg border border-line">
                    {leaveBalances.map((balance) => {
                        const Icon = getLeaveIcon(balance.leaveType);

                        // Calculate the percentage of leave days remaining.
                        const percentageRemaining =
                            balance.quota > 0
                                ? Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        (balance.remainingDays / balance.quota) * 100
                                    )
                                )
                                : 0;

                        const isLowBalance = percentageRemaining <= 20;

                        const usedDays = balance.quota - balance.remainingDays;

                        return (
                            <li
                                key={balance.leaveType}
                                className="grid gap-x-8 gap-y-3 p-4 sm:grid-cols-[240px_1fr] sm:items-center sm:p-5"
                            >
                                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-tint text-accent">
                    <Icon className="size-5" aria-hidden />
                  </span>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            {balance.leaveType}
                                        </p>

                                        <p className="text-[13px] text-sub">
                                            {usedDays} of {balance.quota} days used
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm">
                    <span className="text-lg font-semibold">
                      {balance.remainingDays}
                    </span>

                                        <span className="text-sub">
                      {' '}/ {balance.quota} days left
                    </span>
                                    </p>

                                    <div
                                        role="progressbar"
                                        aria-label={`${balance.leaveType} days left`}
                                        aria-valuemin={0}
                                        aria-valuemax={balance.quota}
                                        aria-valuenow={balance.remainingDays}
                                        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface"
                                    >
                                        <div
                                            className={`h-full rounded-full ${
                                                isLowBalance ? 'bg-pending' : 'bg-brand'
                                            }`}
                                            style={{ width: `${percentageRemaining}%` }}
                                        />
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
