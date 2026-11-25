import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'danger';

const base =
    'inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3.5 text-sm font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
    primary: 'bg-accent text-white hover:bg-accent-strong',
    secondary: 'border border-line bg-white text-ink hover:bg-surface',
    danger: 'border border-danger/40 bg-white text-danger hover:bg-danger-tint',
};

export const buttonClass = (variant: Variant = 'primary', extra = '') =>
    `${base} ${variants[variant]} ${extra}`;

export function Button({
                           variant = 'primary',
                           className = '',
                           ...rest
                       }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
    return (
        <button
            type="button"
            className={buttonClass(variant, className)}
            {...rest}
        />
    );
}

export function ButtonLink({
                               variant = 'primary',
                               className = '',
                               ...rest
                           }: LinkProps & { variant?: Variant }) {
    return (
        <Link className={buttonClass(variant, className)} {...rest} />
    );
}