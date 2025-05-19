'use client';

import Image from 'next/image';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoginFormProps } from '@/interfaces/login';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logo } from '@/assets';
import { useTranslation } from 'react-i18next';

export function LoginForm({ className, onSubmit }: LoginFormProps) {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t('components.login-form.title')}</h1>
                <p className="text-muted-foreground text-balance">{t('components.login-form.description')}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('components.login-form.email')}</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('components.login-form.password')}</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    {t('components.login-form.forgot-password')}
                  </a>
                </div>
                <Input id="password" type="password" placeholder="********" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                {t('components.login-form.login')}
              </Button>
            </div>
          </form>
          <div className="relative hidden border-l md:block">
            <Image src={logo} alt="Login" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
