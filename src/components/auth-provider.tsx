
"use client";

import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseAuthUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { type User } from '@/lib/user';


interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseAuthUser | null;
    loading: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);
            if (fbUser) {
                // Fetch additional user data from Firestore
                const userDocRef = doc(db, 'users', fbUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUser({ uid: fbUser.uid, ...userDocSnap.data() } as User);
                } else {
                    // Handle case where user exists in Auth but not in Firestore
                    setUser({ uid: fbUser.uid, email: fbUser.email } as User) // Default user object
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
        firebaseUser,
        loading,
        logout: handleLogout
    };
    
    if (loading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    const isLoginPage = pathname === '/login';

    if (!user && isLoginPage) {
        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }
    
    if (user && !isLoginPage) {
        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

    return null;
}
