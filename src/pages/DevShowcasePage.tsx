import { useState } from 'react';
import {
  AuthCard,
  Button,
  SegmentedToggle,
  TextField,
  TextLink,
  TokenInput,
  useToast,
} from '@/shared/ui';

export function DevShowcasePage() {
  const toast = useToast();
  const [toggle, setToggle] = useState('sign-in');

  return (
    <div className="min-h-screen p-8 bg-surface space-y-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-title font-semibold text-ink">Component Showcase</h1>
          <p className="mt-2 text-body1 text-ink-secondary">
            Live preview of every UI kit component built from Figma. Verify against Figma frames at /dev.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-h6 font-semibold text-ink">Button</h2>
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-line bg-white p-6">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button loading>Primary loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="rounded-card border border-line bg-white p-6">
            <Button fullWidth>Full width primary</Button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-h6 font-semibold text-ink">TextField</h2>
          <div className="grid grid-cols-2 gap-4 rounded-card border border-line bg-white p-6">
            <TextField label="Email" type="email" placeholder="you@example.com" />
            <TextField label="Password" type="password" />
            <TextField label="Full name" placeholder="Jane Doe" />
            <TextField label="Email" error="This field is required" />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-h6 font-semibold text-ink">TokenInput</h2>
          <div className="rounded-card border border-line bg-white p-6">
            <TokenInput label="Email confirmation token" />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-h6 font-semibold text-ink">TextLink</h2>
          <div className="rounded-card border border-line bg-white p-6">
            <TextLink to="/sign-in">Go to sign in</TextLink>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-h6 font-semibold text-ink">SegmentedToggle</h2>
          <div className="rounded-card border border-line bg-white p-6">
            <SegmentedToggle
              label="Auth mode"
              value={toggle}
              onChange={setToggle}
              options={[
                { value: 'sign-in', label: 'Sign in' },
                { value: 'sign-up', label: 'Sign up' },
              ]}
            />
            <p className="mt-3 text-body2 text-ink-secondary">Selected: {toggle}</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-h6 font-semibold text-ink">AuthCard</h2>
          <AuthCard
            title="Welcome back"
            subtitle="Sign in to continue to Elara"
            toggle={
              <SegmentedToggle
                label="Auth mode"
                value={toggle}
                onChange={setToggle}
                options={[
                  { value: 'sign-in', label: 'Sign in' },
                  { value: 'sign-up', label: 'Sign up' },
                ]}
              />
            }
            footer={<>New to Elara? <TextLink to="/sign-up">Create an account</TextLink></>}
          >
            <TextField label="Email" type="email" />
            <TextField label="Password" type="password" />
            <Button fullWidth type="submit">Sign in</Button>
          </AuthCard>
        </section>

        <section className="space-y-3">
          <h2 className="text-h6 font-semibold text-ink">Toast</h2>
          <div className="flex gap-3 rounded-card border border-line bg-white p-6">
            <Button variant="outline" onClick={() => toast.success('Saved successfully')}>Success toast</Button>
            <Button variant="outline" onClick={() => toast.error('Something went wrong')}>Error toast</Button>
            <Button variant="outline" onClick={() => toast.show('Just so you know', 'info')}>Info toast</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
