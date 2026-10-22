import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthCard, Button, SegmentedToggle, TextField, TextLink } from '@/shared/ui';
import { cx } from '@/shared/lib/cx';
import { api } from '@/shared/lib/api-client';
import { setPendingRole } from '@/shared/lib/auth-helpers';
import type { ApiError, RegisterSellerData, RegisterSellerRequest } from '@shared/types';

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});
type FormValues = z.infer<typeof schema>;

export function SellerSignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', email: '', phone: '', password: '',
      street: '', city: '', state: '', country: '', postalCode: '',
    },
    mode: 'onBlur',
  });

  async function handleNext() {
    // Validate only step 1 fields before advancing
    const valid = await form.trigger(['name', 'email', 'phone', 'password']);
    if (valid) {
      setSubmitError(null);
      setStep(2);
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const body: RegisterSellerRequest = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        country: values.country,
        postalCode: values.postalCode,
      },
    };
    try {
      const data = await api.post<RegisterSellerData>('/auth/register-seller', body);
      setPendingRole('seller', data.user.email);
      navigate('/confirm-email', { replace: true });
    } catch (err) {
      const error = err as ApiError;
      setSubmitError(error.message);
      // Stay on current step so the user can fix and retry
    }
  }

  return (
    <AuthCard
      title="Become a seller"
      subtitle="Sign up to start working with Elara"
      toggle={
        <SegmentedToggle
          label="Seller auth mode"
          value="sign-up"
          onChange={(v) => v === 'sign-in' && navigate('/seller/sign-in')}
          options={[
            { value: 'sign-in', label: 'Sign in' },
            { value: 'sign-up', label: 'Sign up' },
          ]}
        />
      }
      footer={<>Already a seller? <TextLink to="/seller/sign-in">Sign in</TextLink></>}
    >
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={cx('h-2 w-12 rounded-pill', step >= 1 ? 'bg-ink' : 'bg-line')} />
        <div className={cx('h-2 w-12 rounded-pill', step >= 2 ? 'bg-ink' : 'bg-line')} />
      </div>

      {submitError && (
        <div role="alert" className="rounded-pill border border-danger bg-white px-5 py-3 text-body2 text-danger">
          {submitError}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <TextField
              label="Full name"
              autoComplete="name"
              disabled={form.formState.isSubmitting}
              error={form.formState.errors.name?.message}
              {...form.register('name')}
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              disabled={form.formState.isSubmitting}
              error={form.formState.errors.email?.message}
              {...form.register('email')}
            />
            <TextField
              label="Phone"
              type="tel"
              autoComplete="tel"
              disabled={form.formState.isSubmitting}
              error={form.formState.errors.phone?.message}
              {...form.register('phone')}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              disabled={form.formState.isSubmitting}
              error={form.formState.errors.password?.message}
              {...form.register('password')}
            />
            <Button
              type="button"
              fullWidth
              onClick={handleNext}
              disabled={form.formState.isSubmitting}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <TextField
                  label="Street"
                  autoComplete="address-line1"
                  disabled={form.formState.isSubmitting}
                  error={form.formState.errors.street?.message}
                  {...form.register('street')}
                />
              </div>
              <TextField
                label="City"
                autoComplete="address-level2"
                disabled={form.formState.isSubmitting}
                error={form.formState.errors.city?.message}
                {...form.register('city')}
              />
              <TextField
                label="State"
                autoComplete="address-level1"
                disabled={form.formState.isSubmitting}
                error={form.formState.errors.state?.message}
                {...form.register('state')}
              />
              <TextField
                label="Country"
                autoComplete="country-name"
                disabled={form.formState.isSubmitting}
                error={form.formState.errors.country?.message}
                {...form.register('country')}
              />
              <TextField
                label="Postal code"
                autoComplete="postal-code"
                disabled={form.formState.isSubmitting}
                error={form.formState.errors.postalCode?.message}
                {...form.register('postalCode')}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={form.formState.isSubmitting}
              >
                Back
              </Button>
              <Button
                type="submit"
                fullWidth
                loading={form.formState.isSubmitting}
              >
                Create account
              </Button>
            </div>
          </div>
        )}
      </form>
    </AuthCard>
  );
}
