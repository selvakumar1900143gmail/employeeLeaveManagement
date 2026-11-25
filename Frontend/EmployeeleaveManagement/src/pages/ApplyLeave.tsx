
import { Info } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { countWorkdays, plural, toISO } from '../lib/dates';
import type { LeaveTypeDto } from '../types.ts';
import { Button } from '../ui/Button';
import { ErrorNote, PageHeader } from '../ui/PageHeader.tsx';
import { fieldLabel, inputBase } from '../ui/FormStyle.ts';

const MAX_REASON = 500;

export default function ApplyLeave() {
    const navigate = useNavigate();

    // Get today's date for the date inputs.
    const today = toISO(new Date());

    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeDto[]>([]);

    const [form, setForm] = useState({
        leaveTypeId: '',
        startDate: today,
        endDate: today,
        reason: '',
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load available leave types when the page opens.
    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await api.get<LeaveTypeDto[]>('/leave-types');

                setLeaveTypes(response.data);

                // Select the first leave type automatically.
                if (response.data.length > 0) {
                    setForm((previousForm) => ({
                        ...previousForm,
                        leaveTypeId: String(response.data[0].id),
                    }));
                }
            } catch (error) {
                setError(errMsg(error));
            }
        };

        fetchLeaveTypes();
    }, []);

    // Update the form whenever the user changes an input.
    const handleChange =
        (field: keyof typeof form) =>
            (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                const value = event.target.value;

                setForm((previousForm) => ({
                    ...previousForm,
                    [field]: value,

                    // If the start date moves beyond the end date,
                    // automatically update the end date.
                    ...(field === 'startDate' && previousForm.endDate < value
                        ? { endDate: value }
                        : {}),
                }));
            };

    // Calculate working days without counting weekends.
    const workingDays = countWorkdays(form.startDate, form.endDate);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');
        setIsSubmitting(true);

        try {
            await api.post('/leaves', {
                ...form,
                leaveTypeId: Number(form.leaveTypeId),
            });

            // Move to the user's leave history after submission.
            navigate('/my-leaves');
        } catch (error) {
            setError(errMsg(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 lg:px-8 lg:py-8">
            <PageHeader
                title="Apply for leave"
                description="Fill in the details below to submit your leave request."
            />

            <form onSubmit={handleSubmit} className="rounded-lg border border-line">
                <div className="space-y-5 p-5">
                    {error && <ErrorNote>{error}</ErrorNote>}

                    <div>
                        <label htmlFor="type" className={fieldLabel}>
                            Leave type
                        </label>

                        <select
                            id="type"
                            required
                            value={form.leaveTypeId}
                            onChange={handleChange('leaveTypeId')}
                            className={inputBase}
                        >
                            {leaveTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="start" className={fieldLabel}>
                                Start date
                            </label>

                            <input
                                id="start"
                                type="date"
                                required
                                min={today}
                                value={form.startDate}
                                onChange={handleChange('startDate')}
                                className={inputBase}
                            />
                        </div>

                        <div>
                            <label htmlFor="end" className={fieldLabel}>
                                End date
                            </label>

                            <input
                                id="end"
                                type="date"
                                required
                                min={form.startDate || today}
                                value={form.endDate}
                                onChange={handleChange('endDate')}
                                className={inputBase}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reason" className={fieldLabel}>
                            Reason for leave
                        </label>

                        <textarea
                            id="reason"
                            required
                            rows={4}
                            maxLength={MAX_REASON}
                            value={form.reason}
                            onChange={handleChange('reason')}
                            placeholder="Briefly explain why you need this time off."
                            className={`${inputBase} h-auto resize-y py-2.5 leading-relaxed`}
                        />

                        <p className="mt-1 text-right text-xs text-faint">
                            {form.reason.length}/{MAX_REASON}
                        </p>
                    </div>
                </div>

                <p className="flex items-start gap-2 border-t border-line bg-brand-tint px-5 py-3 text-[13px] text-accent">
                    <Info aria-hidden className="mt-0.5 size-4 shrink-0" />

                    <span>
            This request covers{' '}
                        <strong>{plural(workingDays, 'working day')}</strong>.
            Weekends aren't counted, and the days are held from your
            balance until your manager decides.
          </span>
                </p>

                <div className="flex justify-end border-t border-line p-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || workingDays === 0}
                    >
                        {isSubmitting ? 'Submitting…' : 'Submit leave request'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
