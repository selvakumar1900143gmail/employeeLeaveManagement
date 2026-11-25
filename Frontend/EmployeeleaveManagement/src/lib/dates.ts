
const padNumber = (value: number) => String(value).padStart(2, '0');

export function toISO(date: Date): string {
    const year = date.getFullYear();
    const month = padNumber(date.getMonth() + 1);
    const day = padNumber(date.getDate());

    return `${year}-${month}-${day}`;
}

export function parseISO(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);

    return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + days
    );
}

export function isWeekend(date: Date): boolean {
    const day = date.getDay();

    return day === 0 || day === 6;
}

export function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

export function addMonths(
    year: number,
    month: number,
    difference: number
) {
    const updatedDate = new Date(year, month + difference, 1);

    return {
        year: updatedDate.getFullYear(),
        month: updatedDate.getMonth(),
    };
}

const createFormatter = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', options);

const monthYearFormatter = createFormatter({
    month: 'long',
    year: 'numeric',
});

const weekdayFormatter = createFormatter({
    weekday: 'short',
});

const longDateFormatter = createFormatter({
    weekday: 'long',
    day: 'numeric',
    month: 'long',
});

const shortMonthFormatter = createFormatter({
    month: 'short',
});

export function monthLabel(year: number, month: number): string {
    return monthYearFormatter.format(new Date(year, month, 1));
}

export function weekdayShort(date: Date): string {
    return weekdayFormatter.format(date);
}

export function longDate(date: Date): string {
    return longDateFormatter.format(date);
}

export function formatRange(startISO: string, endISO: string) {
    const startDate = parseISO(startISO);
    const endDate = parseISO(endISO);

    const sameMonth =
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear();

    let range: string;

    if (startISO === endISO) {
        range = `${startDate.getDate()} ${shortMonthFormatter.format(startDate)}`;
    } else if (sameMonth) {
        range = `${startDate.getDate()}–${endDate.getDate()} ${shortMonthFormatter.format(endDate)}`;
    } else {
        range = `${startDate.getDate()} ${shortMonthFormatter.format(startDate)} – ${endDate.getDate()} ${shortMonthFormatter.format(endDate)}`;
    }

    return {
        range,
        year: String(endDate.getFullYear()),
    };
}

export function countWorkdays(
    startISO: string,
    endISO: string
): number {
    if (!startISO || !endISO || endISO < startISO) {
        return 0;
    }

    let workingDays = 0;

    for (
        let currentDate = parseISO(startISO);
        toISO(currentDate) <= endISO;
        currentDate = addDays(currentDate, 1)
    ) {
        if (!isWeekend(currentDate)) {
            workingDays++;
        }
    }

    return workingDays;
}

export function plural(count: number, word: string): string {
    return `${count} ${word}${count === 1 ? '' : 's'}`;
}
