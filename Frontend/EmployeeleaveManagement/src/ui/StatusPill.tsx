import type { LeaveStatus } from '../types.ts';

const styles: Record<
    LeaveStatus,
    { label: string; cls: string }
> = {
    PENDING: {
        label: 'Pending',
        cls: 'bg-pending-tint text-pending-ink',
    },
    APPROVED: {
        label: 'Approved',
        cls: 'bg-brand-tint text-accent',
    },
    REJECTED: {
        label: 'Rejected',
        cls: 'bg-danger-tint text-danger',
    },
    CANCELLED: {
        label: 'Cancelled',
        cls: 'bg-surface text-sub',
    },
};

export function StatusPill({
                               status,
                           }: {
    status: LeaveStatus;
}) {
    const s = styles[status] ?? styles.CANCELLED;

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}
        >
      {s.label}
    </span>
    );
}

export function StatusIndicator({ status }: { status: 'PENDING' | 'APPROVED' }) {
    const approved = status === 'APPROVED';
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sub">
      <span aria-hidden className={`size-2 rounded-full ${approved ? 'bg-brand' : 'bg-pending'}`} />
            {approved ? 'Approved' : 'Pending'}
    </span>
    );
}