
"use client"

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Home, Wand2, CheckCircle, Circle, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import { createContext, useContext, useState, useEffect } from "react";

const steps = [
    { path: "/onboarding/culture", name: "Cultura" },
    { path: "/onboarding/solutions", name: "Soluções" },
    { path: "/onboarding/icp", name: "Cliente Ideal (ICP)" },
    { path: "/onboarding/process", name: "Processo SDR" },
];

interface OnboardingContextType {
    isStepCompleted: boolean;
    setStepCompleted: (isCompleted: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within an OnboardingLayout");
    }
    return context;
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isStepCompleted, setStepCompleted] = useState(false);

  const isWelcomePage = pathname === '/onboarding';

  // Reinicia o estado de conclusão sempre que a rota muda para uma que não seja uma subpágina.
  useEffect(() => {
     const isMenuPage = pathname === '/onboarding/solutions' || 
                       pathname === '/onboarding/icp' || 
                       pathname === '/onboarding/process';

    // Se for uma página de menu, ela já está "completa" por padrão.
    if (isMenuPage) {
      setStepCompleted(true);
    } else {
       const isSubPage = steps.some(step => pathname.startsWith(step.path) && pathname !== step.path);
       // As subpáginas são consideradas "completas" ao carregar para não travar a navegação.
       // As páginas principais (como culture) precisam de interação para completar.
       if (isSubPage) {
           setStepCompleted(true);
       } else {
           setStepCompleted(false);
       }
    }
  }, [pathname]);

  if (isWelcomePage) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-background/30">
          {children}
      </div>
    )
  }

  const findCurrentStepIndex = (currentPath: string) => {
    let bestMatch = -1;
    let maxLength = -1;

    for (let i = 0; i < steps.length; i++) {
        if (currentPath.startsWith(steps[i].path)) {
            if (steps[i].path.length > maxLength) {
                maxLength = steps[i].path.length;
                bestMatch = i;
            }
        }
    }
    return bestMatch;
  };

  const currentIndex = findCurrentStepIndex(pathname);
  const isSubPage = currentIndex !== -1 && pathname !== steps[currentIndex].path;

  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  return (
    <OnboardingContext.Provider value={{ isStepCompleted, setStepCompleted }}>
        <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">

                <div className="flex justify-start">
                   <BackButton />
                </div>
                
                <header className="my-8 text-center">
                    <nav className="flex justify-center items-center gap-4 sm:gap-8">
                        {steps.map((step, index) => {
                            const isActive = currentIndex === index;
                            const isCompleted = currentIndex > index;

                            return (
                            <Link href={step.path} key={step.name} className="flex flex-col items-center gap-2 group">
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all",
                                    isActive ? "border-primary bg-primary/10" : "border-muted-foreground/30 group-hover:border-primary/50",
                                    isCompleted ? "border-green-500 bg-green-500/10 text-green-500" : ""
                                )}>
                                    {isCompleted ? <CheckCircle className="h-5 w-5"/> : <Circle className={cn("h-3 w-3 transition-all", isActive ? "text-primary fill-current" : "text-muted-foreground/30 group-hover:text-primary/50")}/>}
                                </div>
                                <span className={cn(
                                    "text-xs sm:text-sm font-medium transition-all",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                                    isCompleted ? "text-green-500" : ""
                                )}>
                                    {step.name}
                                </span>
                            </Link>
                            )
                        })}
                    </nav>
                </header>
                
                <main className="flex-1 flex flex-col">{children}</main>

                <footer className="mt-12 border-t pt-6 flex items-center justify-between">
                    <div>
                         {/* O botão "Voltar" padrão do navegador sempre funciona aqui */}
                         {isSubPage ? (
                           null // Em subpáginas, o BackButton no header é suficiente e mais intuitivo
                         ) : prevStep ? (
                            <Link href={prevStep.path} passHref>
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Anterior
                                </Button>
                            </Link>
                         ) : (
                              <Link href="/onboarding" passHref>
                                <Button variant="outline">
                                    <Home className="mr-2 h-4 w-4" />
                                    Início do Onboarding
                                </Button>
                            </Link>
                         )}
                    </div>
                    <div>
                       {/* Oculta o botão "Próximo" nas subpáginas */}
                       {!isSubPage && nextStep ? (
                            <Button asChild disabled={!isStepCompleted}>
                                <Link href={nextStep.path}>
                                    {isStepCompleted ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                                    Próximo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : !isSubPage && ( // Mostra o botão final apenas se não for subpágina e for a última etapa
                            <Button asChild disabled={!isStepCompleted}>
                                <Link href="/ferramentas">
                                    Ir para Ferramentas
                                    <Wand2 className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    </OnboardingContext.Provider>
  );
}
