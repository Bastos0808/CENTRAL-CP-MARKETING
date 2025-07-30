
"use client"

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Home, Wand2, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";

const steps = [
    { path: "/onboarding/culture", name: "Cultura" },
    { path: "/onboarding/solutions", name: "Soluções" },
    { path: "/onboarding/icp", name: "Cliente Ideal (ICP)" },
    { path: "/onboarding/process", name: "Processo SDR" },
    { path: "/onboarding/modus", name: "Mödus" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const currentIndex = steps.findIndex(step => pathname.startsWith(step.path));
  const isWelcomePage = pathname === '/onboarding';

  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">

            <div className="flex justify-start">
               <BackButton />
            </div>

            {isWelcomePage ? (
                <main className="flex-1 flex flex-col justify-center items-center">
                    {children}
                </main>
            ) : (
                <>
                 <header className="my-8 text-center">
                    <nav className="flex justify-center items-center gap-4 sm:gap-8">
                       {steps.map((step, index) => {
                           const isActive = pathname.startsWith(step.path);
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
                        {prevStep ? (
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
                                    Início
                                </Button>
                            </Link>
                        )}
                    </div>
                    <div>
                        {nextStep ? (
                            <Link href={nextStep.path} passHref>
                                <Button>
                                    Próximo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/ferramentas" passHref>
                                <Button>
                                    Ir para Ferramentas
                                    <Wand2 className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </footer>
                </>
            )}
        </div>
    </div>
  );
}
