
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import LoginForm from '@/components/login-form';


export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-primary">
                    CP Marketing
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Acesse sua conta para continuar.
                </p>
                </header>
                <LoginForm />
            </div>
        </main>
    );
}
