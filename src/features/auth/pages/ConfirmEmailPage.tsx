import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthCard, Button, TokenInput } from '@/shared/ui';
import { api } from '@/shared/lib/api-client';
import { clearPendingRole, getPendingRole } from '@/shared/lib/auth-helpers';
import type { ApiError, ConfirmEmailResponse } from '@shared/types';

type ConfirmState = 'idle' | 'confirming' | 'success' | 'error';

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get('token');
  const [state, setState] = useState<ConfirmState>(tokenFromUrl ? 'confirming' : 'idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const lastConfirmedRef = useRef<string | null>(null);

  const confirmToken = useCallback(async (token: string) => {
    setState('confirming');
    setErrorMessage(null);
    try {
      await api.post<ConfirmEmailResponse>('/auth/confirm-email', { token });
      setState('success');
    } catch (err) {
      const error = err as ApiError;
      setErrorMessage(error.message);
      setState('error');
    }
  }, []);

  useEffect(() => {
    if (!tokenFromUrl) return;
    if (lastConfirmedRef.current === tokenFromUrl) return;
    lastConfirmedRef.current = tokenFromUrl;
    void confirmToken(tokenFromUrl);
  }, [tokenFromUrl, confirmToken]);

  function onPasteSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = tokenInput.trim();
    if (!token) return;
    void confirmToken(token);
  }

  if (state === 'success') {
    const role = getPendingRole();
    const signInHref = role === 'seller' ? '/seller/sign-in' : '/sign-in';
    return (
      <AuthCard
        title="Your email is confirmed"
        subtitle="You can now sign in to your account."
      >
        <Button
          fullWidth
          onClick={() => {
            clearPendingRole();
            navigate(signInHref);
          }}
        >
          Sign in
        </Button>
      </AuthCard>
    );
  }

  // state === 'idle' | 'confirming' | 'error' — form is visible in all three
  return (
    <AuthCard
      title="Check your email"
      subtitle="We sent you an email with a confirmation link. Click it, or paste the token from the email below. Check your spam folder."
    >
      {state === 'error' && errorMessage && (
        <div role="alert" className="rounded-pill border border-danger bg-white px-5 py-3 text-body2 text-danger">
          {errorMessage}
        </div>
      )}
      <form onSubmit={onPasteSubmit} className="flex flex-col gap-5">
        <TokenInput
          label="Confirmation token"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          disabled={state === 'confirming'}
        />
        <Button type="submit" fullWidth loading={state === 'confirming'}>
          Confirm
        </Button>
      </form>
    </AuthCard>
  );
}
