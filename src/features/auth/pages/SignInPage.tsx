import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthCard, Button, SegmentedToggle, TextField, TextLink } from '@/shared/ui';
import { api } from '@/shared/lib/api-client';
import { useAuth } from '@/shared/lib/useAuth';
import type { ApiError, LoginData, LoginRequest, Role } from '@shared/types';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

const roleHome: Record<Role, string> = {
  customer: '/',
  seller: '/seller',
  admin: '/admin',
};

export function SignInPage() {
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
      signIn(data.accessToken, data.user);
      navigate(roleHome[data.user.role], { replace: true });
    } catch (err) {
      const error = err as ApiError;
      setSubmitError(error.message);
    }
  }

  return (
    <AuthCard
      title="Login to Your Account"
      subtitle="Welcome to Elara Platform"
      toggle={
        <SegmentedToggle
          label="Auth mode"
          value="sign-in"
          onChange={(v) => v === 'sign-up' && navigate('/sign-up')}
          options={[
            { value: 'sign-in', label: 'Sign in' },
            { value: 'sign-up', label: 'Sign up' },
          ]}
        />
      }
      footer={<>New to Elara? <TextLink to="/sign-up">Create an account</TextLink></>}
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
