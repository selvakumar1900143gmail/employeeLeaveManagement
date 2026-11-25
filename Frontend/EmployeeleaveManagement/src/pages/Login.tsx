
import {
    CalendarDays,
    Eye,
    EyeOff,
    Lock,
    Mail,
    List,
    Target,
    LayoutGrid,
    Flag,
} from 'lucide-react';
import { FaUserCircle } from 'react-icons/fa';
import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { isLoggedIn } from '../lib/session';
import { Button } from '../ui/Button';
import { ErrorNote } from '../ui/PageHeader';
import { fieldLabel, inputBase } from '../ui/FormStyle';

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoggedIn()) {
        return <Navigate to="/planner" replace />;
    }

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');
        setIsSubmitting(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            const user = response.data;

            localStorage.setItem('token', user.token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('name', user.name);

            if (user.role === 'MANAGER') {
                navigate('/approvals', { replace: true });
            } else {
                navigate('/my-leaves', { replace: true });
            }
        } catch (error) {
            setError(errMsg(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-white via-blue-50 to-violet-50 flex items-center justify-center px-5 py-10">

            {/* Flowing Background */}

            <div className="absolute -top-32 -right-24 size-96 rounded-full bg-blue-200/40 blur-[100px]" />

            <div className="absolute top-[35%] -left-32 size-96 rounded-full bg-violet-200/40 blur-[110px]" />

            <div className="absolute -bottom-40 right-[20%] size-96 rounded-full bg-cyan-200/40 blur-[110px]" />

            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-[20%] left-0 h-40 w-full rotate-[-8deg] rounded-[100%] border border-blue-200/50 blur-sm" />
                <div className="absolute top-[55%] left-0 h-48 w-full rotate-[8deg] rounded-[100%] border border-violet-200/50 blur-sm" />
            </div>

            <div className="relative w-full max-w-6xl min-h-[650px] flex items-center">

                {/* Floating Icons Background */}

                <div className="absolute inset-0 pointer-events-none">

                    {/* Flag */}

                    <div className="absolute top-[5%] left-[8%] md:top-[24%] md:left-[58%] flex size-11 md:size-12 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg shadow-violet-200/70">
                        <Flag className="size-5 md:size-6" />
                    </div>

                    {/* Grid */}

                    <div className="absolute top-[18%] right-[8%] md:top-[40%] md:right-[30%] flex size-11 md:size-12 items-center justify-center rounded-full bg-orange-400 text-white shadow-lg shadow-orange-200/70">
                        <LayoutGrid className="size-5 md:size-6" />
                    </div>

                    {/* Small Profile */}

                    <div className="absolute top-[48%] left-[1%] md:top-[18%] md:left-[76%] flex size-10 md:size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-md">
                        <FaUserCircle className="size-8 md:size-9" />
                    </div>

                    {/* Main Profile */}

                    <div className="absolute bottom-[12%] right-[3%] md:top-[38%] md:right-[5%] flex size-14 md:size-16 items-center justify-center rounded-full bg-violet-100 text-violet-700 shadow-lg shadow-violet-200/60">
                        <FaUserCircle className="size-10 md:size-12" />
                    </div>

                    {/* List */}

                    <div className="absolute bottom-[4%] left-[18%] md:top-[62%] md:right-[30%] md:left-auto flex size-11 md:size-12 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg shadow-amber-200/70">
                        <List className="size-5 md:size-6" />
                    </div>

                    {/* Target */}

                    <div className="absolute top-[65%] right-[4%] md:bottom-[15%] md:left-[68%] md:top-auto md:right-auto flex size-11 md:size-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200/70">
                        <Target className="size-5 md:size-6" />
                    </div>

                    {/* Menu */}

                    <div className="absolute bottom-[38%] right-[1%] md:top-[12%] md:right-[8%] md:bottom-auto flex size-10 md:size-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                        <List className="size-5 md:size-6" />
                    </div>

                    {/* Floating Dots */}

                    <span className="absolute top-[12%] left-[48%] size-1.5 rounded-full bg-violet-500" />

                    <span className="absolute top-[37%] right-[22%] size-2 rounded-full bg-amber-400" />

                    <span className="absolute bottom-[28%] left-[10%] size-1.5 rounded-full bg-blue-500" />

                    <span className="absolute bottom-[20%] right-[35%] size-2 rounded-full bg-amber-400" />

                    <span className="absolute top-[55%] left-[52%] size-1.5 rounded-full bg-gray-900" />

                </div>

                {/* Login Form */}

                <div className="relative z-10 w-full max-w-md mx-auto md:mx-0 md:ml-[5%] rounded-[28px] border border-white/80 bg-white/75 p-6 sm:p-9 shadow-[0_20px_80px_rgba(99,102,241,0.10)] backdrop-blur-xl">

                    <div className="mb-8">

                        <CalendarDays className="size-9 text-brand mb-7" />

                        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Welcome back! Please enter your details.
                        </p>

                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {error && <ErrorNote>{error}</ErrorNote>}

                        <div>

                            <label htmlFor="email" className={fieldLabel}>
                                Email address
                            </label>

                            <div className="relative mt-2">

                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="username"
                                    required
                                    autoFocus
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className={`${inputBase} pl-10`}
                                />

                            </div>

                        </div>

                        <div>

                            <label htmlFor="password" className={fieldLabel}>
                                Password
                            </label>

                            <div className="relative mt-2">

                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className={`${inputBase} pl-10 pr-11`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((previous) => !previous)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>

                            </div>

                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 w-full"
                        >
                            {isSubmitting ? 'Signing in...' : 'Continue with Email'}
                        </Button>

                    </form>

                    <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Lock className="size-3" />
                        Secure access only
                    </div>

                </div>

            </div>

        </div>
    );
}
