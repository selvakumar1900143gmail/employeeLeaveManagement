import type { StatusFilterValue } from '../types.ts';

const filterOptions: {
    value: StatusFilterValue;
    label: string;
}[] = [
    {
        value: 'ALL',
        label: 'All',
    },
    {
        value: 'PENDING',
        label: 'Pending',
    },
    {
        value: 'APPROVED',
        label: 'Approved',
    },
];

interface StatusFilterProps {
    value: StatusFilterValue;
    onChange: (value: StatusFilterValue) => void;
}

export function StatusFilter({
                                 value,
                                 onChange,
                             }: StatusFilterProps) {
    return (
        <div
            role="radiogroup"
            aria-label="Filter by status"
            className="flex gap-1.5"
        >
            {filterOptions.map((option) => {
                const isActive = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onChange(option.value)}
                        className={`h-8 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                            isActive
                                ? 'border-accent bg-accent text-white'
                                : 'border-line bg-white text-sub hover:bg-surface hover:text-ink'
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}