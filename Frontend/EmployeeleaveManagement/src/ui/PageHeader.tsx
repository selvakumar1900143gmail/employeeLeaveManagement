import type { ReactNode } from 'react';

export function PageHeader({
                               title,
                               description,
                               action,
                           }: {
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h1>

                {description && (
                    <p className="mt-1 text-sm text-sub">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </div>
    );
}

export function ErrorNote({ children }: { children: ReactNode }) {
    return (
        <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-tint px-3 py-2 text-sm text-danger">
            {children}
        </p>
    );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
    return (
        <div className="rounded-lg border border-dashed border-line px-6 py-12 text-center">
            <p className="font-semibold">{title}</p>
            {children && <p className="mt-1 text-sm text-sub">{children}</p>}
        </div>
    );
}