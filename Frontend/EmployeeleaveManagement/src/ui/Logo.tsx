import { CalendarDays } from 'lucide-react';

export function Logo() {
    return (
        <span className="inline-flex items-center gap-2 text-[17px] font-semibold tracking-tight">
      <CalendarDays
          aria-hidden
          className="size-5 text-brand"
          strokeWidth={2.25}
      />
      LeaveEase
    </span>
    );
}