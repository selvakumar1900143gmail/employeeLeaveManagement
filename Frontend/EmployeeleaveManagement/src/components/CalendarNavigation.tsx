import { ChevronLeft, ChevronRight } from 'lucide-react';
import { monthLabel } from '../lib/dates';
import type { MonthView } from '../types.ts';

interface CalendarNavigationProps {
    view: MonthView;
    isCurrentMonth: boolean;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
}

const arrowButton =
    'inline-flex size-8 items-center justify-center rounded-md text-sub transition-colors hover:bg-surface hover:text-ink';

export function CalendarNavigation({
                                       view,
                                       isCurrentMonth,
                                       onPrev,
                                       onNext,
                                       onToday,
                                   }: CalendarNavigationProps) {
    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                onClick={onPrev}
                className={arrowButton}
                aria-label="Previous month"
            >
                <ChevronLeft className="size-5" />
            </button>

            <h2
                aria-live="polite"
                className="min-w-36 text-center text-[15px] font-semibold"
            >
                {monthLabel(view.year, view.month)}
            </h2>

            <button
                type="button"
                onClick={onNext}
                className={arrowButton}
                aria-label="Next month"
            >
                <ChevronRight className="size-5" />
            </button>

            {!isCurrentMonth && (
                <button
                    type="button"
                    onClick={onToday}
                    className="ml-1 h-8 rounded-md px-2.5 text-sm font-medium text-accent hover:bg-brand-tint"
                >
                    Today
                </button>
            )}
        </div>
    );
}