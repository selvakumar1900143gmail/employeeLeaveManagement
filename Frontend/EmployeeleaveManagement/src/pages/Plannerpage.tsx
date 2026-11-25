
import { Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CalendarNavigation } from '../components/CalendarNavigation';
import { DayDetail } from '../components/DayDetails';
import { LeaveTimeline } from '../components/LeaveTimeline';
import { StatusFilter } from '../components/StatusFilter';
import { addMonths, toISO } from '../lib/dates';
import { buildMonth } from '../lib/planner';
import { useTeamLeaves } from '../hooks/UseTeamLeaves';
import type { MonthView, StatusFilterValue } from '../types.ts';

// Convert a JavaScript Date into the calendar's month format.
function getMonthView(date: Date): MonthView {
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
    };
}

export default function PlannerPage() {
    // Get team leave information from the custom hook.
    const {
        leaves,
        loading,
        source,
    } = useTeamLeaves();

    // Store today's date when the component first loads.
    const [today] = useState(() => new Date());

    const todayISO = toISO(today);

    // Store the selected status filter.
    const [filter, setFilter] = useState<StatusFilterValue>('ALL');

    // Store the month currently displayed in the calendar.
    const [currentMonth, setCurrentMonth] = useState<MonthView>(
        () => getMonthView(today)
    );

    // Store the date selected by the user.
    const [selectedDate, setSelectedDate] = useState(todayISO);

    // Build the calendar whenever its month, leave data or filter changes.
    const calendarDays = useMemo(() => {
        return buildMonth(
            currentMonth,
            leaves,
            filter,
            todayISO
        );
    }, [currentMonth, leaves, filter, todayISO]);

    // Find the selected day in the current calendar.
    const selectedDay =
        calendarDays.find((day) => day.iso === selectedDate) ??
        calendarDays[0];

    // Check whether the displayed month is the current month.
    const isCurrentMonth =
        currentMonth.year === today.getFullYear() &&
        currentMonth.month === today.getMonth();

    // Change the calendar month and update the selected date.
    const changeMonth = (nextMonth: MonthView) => {
        setCurrentMonth(nextMonth);

        const isTodayMonth =
            nextMonth.year === today.getFullYear() &&
            nextMonth.month === today.getMonth();

        // Select today's date for the current month.
        // For another month, select its first day.
        if (isTodayMonth) {
            setSelectedDate(todayISO);
        } else {
            const firstDay = new Date(
                nextMonth.year,
                nextMonth.month,
                1
            );

            setSelectedDate(toISO(firstDay));
        }
    };

    // Navigate to the previous month.
    const goToPreviousMonth = () => {
        const previousMonth = addMonths(
            currentMonth.year,
            currentMonth.month,
            -1
        );

        changeMonth(previousMonth);
    };

    // Navigate to the next month.
    const goToNextMonth = () => {
        const nextMonth = addMonths(
            currentMonth.year,
            currentMonth.month,
            1
        );

        changeMonth(nextMonth);
    };

    // Return to the current month.
    const goToToday = () => {
        changeMonth(getMonthView(today));
    };

    return (
        <div className="mx-auto max-w-6xl lg:px-8">
            <div className="hidden pt-8 pb-5 lg:block">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Leave planner
                </h1>

                <p className="mt-1 text-sm text-sub">
                    Who is out, and when.
                </p>
            </div>

            {/* Calendar filters and navigation controls. */}
            <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-white px-4 py-3 md:px-6 lg:top-0 lg:px-0">
                <StatusFilter
                    value={filter}
                    onChange={setFilter}
                />

                <CalendarNavigation
                    view={currentMonth}
                    isCurrentMonth={isCurrentMonth}
                    onPrev={goToPreviousMonth}
                    onNext={goToNextMonth}
                    onToday={goToToday}
                />
            </div>

            {/* Display sample data information when live team data
          is not available. */}
            {source === 'sample' && !loading && (
                <p className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2 text-[13px] text-sub md:px-6 lg:mt-4 lg:rounded-md lg:border lg:px-3">
                    <Info className="size-4 shrink-0" aria-hidden />

                    Showing sample data. Live team leave is currently
                    available to managers only.
                </p>
            )}

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:pt-0">
                <div>
                    {loading ? (
                        <p className="px-4 py-10 text-sm text-sub">
                            Loading planner…
                        </p>
                    ) : (
                        <LeaveTimeline
                            days={calendarDays}
                            selectedIso={selectedDay.iso}
                            onSelect={setSelectedDate}
                        />
                    )}
                </div>

                {/* Show selected-day details on larger screens. */}
                <aside className="hidden lg:block">
                    <div className="sticky top-20 rounded-lg border border-line p-4">
                        <DayDetail day={selectedDay} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
