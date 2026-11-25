import { initials } from '../lib/session';

const avatarSizes = {
    sm: 'size-7 text-[11px]',
    md: 'size-9 text-xs',
    lg: 'size-11 text-sm',
} as const;

interface EmployeeAvatarProps {
    name: string;
    size?: keyof typeof avatarSizes;
}

export function EmployeeAvatar({
                                   name,
                                   size = 'md',
                               }: EmployeeAvatarProps) {
    return (
        <span
            aria-hidden="true"
            className={`inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-surface font-semibold text-sub ${avatarSizes[size]}`}
        >
      {initials(name)}
    </span>
    );
}