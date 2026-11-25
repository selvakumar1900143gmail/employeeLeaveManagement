import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

import api, { errMsg } from '../api';
import { Button } from '../ui/Button';
import { ErrorNote } from '../ui/PageHeader';
import { fieldLabel, inputBase } from '../ui/FormStyle';

interface Manager {
    id: number;
    name: string;
    email: string;
}

export default function AddEmployee() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [managerId, setManagerId] = useState('');

    const [managers, setManagers] = useState<Manager[]>([]);
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadEmployees() {
            try {
                const response = await api.get('/employees');
                setManagers(response.data);
            } catch (error) {
                setError(errMsg(error));
            }
        }

        loadEmployees();
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            await api.post('/employees', {
                name,
                email,
                password,
                role: 'EMPLOYEE',
                managerId: managerId ? Number(managerId) : null,
            });

            setSuccess('Employee created successfully!');

            setName('');
            setEmail('');
            setPassword('');
            setManagerId('');
        } catch (error) {
            setError(errMsg(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-2xl px-5 py-8">
            <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-brand/10 p-3">
                    <UserPlus className="size-6 text-brand" />
                </div>

                <div>
                    <h1 className="text-2xl font-semibold">
                        Add Employee
                    </h1>

                    <p className="mt-1 text-sm text-sub">
                        Create a new employee account.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-line bg-white p-6 shadow-sm"
            >
                {error && <ErrorNote>{error}</ErrorNote>}

                {success && (
                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div>
                    <label htmlFor="name" className={fieldLabel}>
                        Employee Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter employee name"
                        className={`${inputBase} mt-2`}
                    />
                </div>

                <div>
                    <label htmlFor="email" className={fieldLabel}>
                        Email Address
                    </label>

                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="employee@company.com"
                        className={`${inputBase} mt-2`}
                    />
                </div>

                <div>
                    <label htmlFor="password" className={fieldLabel}>
                        Temporary Password
                    </label>

                    <div className="relative mt-2">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter temporary password"
                            className={`${inputBase} pr-11`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-faint"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="manager" className={fieldLabel}>
                        Assign Manager
                    </label>

                    <select
                        id="manager"
                        value={managerId}
                        onChange={(event) => setManagerId(event.target.value)}
                        className={`${inputBase} mt-2`}
                    >
                        <option value="">
                            Assign yourself as manager
                        </option>

                        {managers.map((manager) => (
                            <option key={manager.id} value={manager.id}>
                                {manager.name} ({manager.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3 pt-3">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Employee'}
                    </Button>

                    <Button
                        type="button"
                        onClick={() => navigate(-1)}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}