import { useEffect, useRef } from 'react';
import { weekdayShort } from '../lib/dates';
import type { PlannerDay } from '../types.ts';
import { DayDetail } from './DayDetails';
import { LeaveEntry } from './LeaveEntry';

interface LeaveTimelineProps {
    days: PlannerDay[];
    selectedIso: string;
    onSelect: (iso: string) => void;
}

export function LeaveTimeline({
                                  days,
                                  selectedIso,
                                  onSelect,
                              }: LeaveTimelineProps) {
    const selectedDayRef = useRef<HTMLLIElement>(null);
    const isFirstScroll = useRef(true);

    useEffect(() => {
        const selectedElement = selectedDayRef.current;

        if (!selectedElement) return;

        selectedElement.scrollIntoView({
            block: isFirstScroll.current ? 'center' : 'start',
            behavior: 'auto',
        });

        isFirstScroll.current = false;
    }, [days[0]?.iso]);

    return (
        <ol className="border-y border-line">
            {days.map((day) => {
                const isSelected = day.iso === selectedIso;
                const hasLeaves = day.entries.length > 0;

                return (
                    <li
                        key={day.iso}
                        ref={isSelected ? selectedDayRef : undefined}
                        className={`scroll-mt-40 border-b border-line last:border-b-0 lg:scroll-mt-20 ${
                            isSelected
                                ? 'bg-brand-tint/60'
                                : day.isWeekend
                                    ? 'bg-surface/70'
                                    : 'hover:bg-surface/50'
                        }`}
                    >
                        <div className="flex">
                            <button
                                type="button"
                                onClick={() => onSelect(day.iso)}
                                aria-pressed={isSelected}
                                aria-label={`${day.date.getDate()} ${weekdayShort(day.date)}, ${day.entries.length} on leave`}
                                className="relative flex w-16 shrink-0 cursor-pointer flex-col items-center py-2.5 focus-visible:outline-offset-[-2px]"
                            >
                                {isSelected && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-y-0 left-0 w-0.5 bg-brand"
                                    />
                                )}

                                <span
                                    className={`flex size-8 items-center justify-center rounded-full text-[15px] font-semibold ${
                                        day.isToday ? 'bg-accent text-white' : ''
                                    }`}
                                >
                  {day.date.getDate()}
                </span>

                                <span className="mt-0.5 text-[11px] font-medium text-faint">
                  {weekdayShort(day.date)}
                </span>
                            </button>

                            <div
                                className={`min-w-0 flex-1 pr-4 ${
                                    hasLeaves ? 'py-1' : 'min-h-14'
                                }`}
                            >
                                {day.entries.map((leave, index) => (
                                    <div
                                        key={leave.id}
                                        className={
                                            index > 0
                                                ? 'border-t border-line/70'
                                                : ''
                                        }
                                    >
                                        <LeaveEntry leave={leave} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isSelected && (
                            <div className="border-t border-line/70 bg-white px-4 py-3 pl-16 lg:hidden">
                                <DayDetail day={day} />
                            </div>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}