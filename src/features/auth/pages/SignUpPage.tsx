import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthCard, Button, SegmentedToggle, TextField, TextLink } from '@/shared/ui';
import { api } from '@/shared/lib/api-client';
import { setPendingRole } from '@/shared/lib/auth-helpers';
import type { ApiError, RegisterCustomerData, RegisterCustomerRequest } from '@shared/types';

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

export function SignUpPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', email: '', phone: '', password: '',
      street: '', city: '', state: '', country: '', postalCode: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const body: RegisterCustomerRequest = {
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
      const data = await api.post<RegisterCustomerData>('/auth/register', body);
      setPendingRole('customer', data.user.email);
      navigate('/confirm-email', { replace: true });
    } catch (err) {
      const error = err as ApiError;
      setSubmitError(error.message);
    }
  }

  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Sign up to get started"
      toggle={
        <SegmentedToggle
          label="Auth mode"
          value="sign-up"
          onChange={(v) => v === 'sign-in' && navigate('/sign-in')}
          options={[
            { value: 'sign-in', label: 'Sign in' },
            { value: 'sign-up', label: 'Sign up' },
          ]}
        />
      }
      footer={<>Already have an account? <TextLink to="/sign-in">Sign in</TextLink></>}
    >
      {submitError && (
        <div role="alert" className="rounded-pill border border-danger bg-white px-5 py-3 text-body2 text-danger">
          {submitError}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
        <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
          Sign up
        </Button>
      </form>
    </AuthCard>
  );
}
