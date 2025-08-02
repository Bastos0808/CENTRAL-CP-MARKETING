
"use client";

import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseAuthUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
    user: FirebaseAuthUser | null;
    loading: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseAuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
            setUser(fbUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (loading) return;

        const isLoginPage = pathname === '/login';
        const isHomePage = pathname === '/'; // The home page is now the password page

        if (!user && !isLoginPage && !isHomePage) {
            router.push('/login');
        } else if (user && isLoginPage) {
            router.push('/');
        }
    }, [user, loading, router, pathname]);

    const handleLogout = async () => {
        try {
          await signOut(auth);
          toast({
            title: "Logout realizado com sucesso!",
            description: "Você foi desconectado e será redirecionado.",
          });
          router.push('/login');
        } catch (error) {
          toast({
            title: "Erro ao fazer logout",
            description: "Ocorreu um problema ao tentar desconectar. Tente novamente.",
            variant: "destructive",
          });
        }
    };
    
    const value = {
        user,
        loading,
        logout: handleLogout
    };
    
    const isPublicPage = pathname === '/login' || pathname === '/';
    if(loading && !isPublicPage){
        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    

    if ((!user && !isPublicPage)) {
        return null; // or a loading indicator
    }

    if (user && isPublicPage && pathname !== '/') {
        return null; // or a loading indicator
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
