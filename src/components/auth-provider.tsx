
"use client";

import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseAuthUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';

interface AppUser extends FirebaseAuthUser {
    role?: 'admin' | 'estrategia' | 'podcast' | 'comercial';
}

interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                // User is signed in, now fetch their role from Firestore
                const userDocRef = doc(db, 'users', fbUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUser({ ...fbUser, role: userData.role || 'comercial' });
                } else {
                    // Default role if no document is found
                    setUser({ ...fbUser, role: 'comercial' }); 
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

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
    
    const isPublicPage = pathname === '/login';
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

    if (user && isPublicPage) {
        return null; // or a loading indicator
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
