import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthCard, Button, SegmentedToggle, TextField, TextLink } from '@/shared/ui';
import { api } from '@/shared/lib/api-client';
import { useAuth } from '@/shared/lib/auth-store';
import type { ApiError, LoginData, LoginRequest } from '@shared/types';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export function SellerSignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      const data = await api.post<LoginData>('/auth/login', values as LoginRequest);
      // Backend may return role='seller' OR a different role if email belongs to
      // a customer/admin. Only route to /seller if role matches; otherwise bounce
      // to the role's actual home.
      signIn(data.accessToken, data.user);
      const home = data.user.role === 'seller' ? '/seller'
        : data.user.role === 'admin' ? '/admin'
        : '/';
      navigate(home, { replace: true });
    } catch (err) {
      const error = err as ApiError;
      setSubmitError(error.message);
    }
  }

  return (
    <AuthCard
      title="Seller sign in"
      subtitle="Sign in to your seller account"
      toggle={
        <SegmentedToggle
          label="Seller auth mode"
          value="sign-in"
          onChange={(v) => v === 'sign-up' && navigate('/seller/sign-up')}
          options={[
            { value: 'sign-in', label: 'Sign in' },
            { value: 'sign-up', label: 'Sign up' },
          ]}
        />
      }
      footer={<>Want to sell on Elara? <TextLink to="/seller/sign-up">Become a seller</TextLink></>}
    >
      {submitError && (
        <div role="alert" className="rounded-pill border border-danger bg-white px-5 py-3 text-body2 text-danger">
          {submitError}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          disabled={form.formState.isSubmitting}
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          disabled={form.formState.isSubmitting}
          error={form.formState.errors.password?.message}
          {...form.register('password')}
        />
        <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
