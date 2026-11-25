
export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function isLoggedIn(): boolean {
    return Boolean(getToken());
}

export function isManager(): boolean {
    return localStorage.getItem('role') === 'MANAGER';
}

export function getName(): string {
    return localStorage.getItem('name') ?? '';
}

export function signOut(): void {
    localStorage.clear();
}

export function initials(name: string): string {
    const nameParts = name.trim().split(/\s+/).filter(Boolean);

    if (nameParts.length === 0) {
        return '?';
    }

    const firstInitial = nameParts[0][0];

    const lastInitial =
        nameParts.length > 1
            ? nameParts[nameParts.length - 1][0]
            : '';

    return (firstInitial + lastInitial).toUpperCase();
}
