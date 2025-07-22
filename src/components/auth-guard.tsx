
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (loading) return;

        const isLoginPage = pathname === '/login';

        if (!user && !isLoginPage) {
            router.push('/login');
        } else if (user && isLoginPage) {
            router.push('/');
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    // Se não estiver logado e tentando acessar a página de login, mostre a página de login.
    if (!user && pathname === '/login') {
        return <>{children}</>;
    }

    // Se estiver logado e não estiver na página de login, mostre o conteúdo.
    if (user && pathname !== '/login') {
        return <>{children}</>;
    }

    // Para outros casos (como redirecionamento), não renderize nada para evitar piscar de conteúdo.
    return null;
}
