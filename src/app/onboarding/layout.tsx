
"use client"

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Home } from "lucide-react";
import Link from "next/link";

const steps = [
    { path: "/onboarding/culture", name: "Cultura" },
    { path: "/onboarding/solutions", name: "Soluções" },
    { path: "/onboarding/icp", name: "Cliente Ideal (ICP)" },
    { path: "/onboarding/process", name: "Processo SDR" },
    { path: "/onboarding/schedule", name: "Rotina Diária" },
    { path: "/onboarding/ai-tool", name: "Ferramenta de IA" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const currentIndex = steps.findIndex(step => step.path === pathname);
  const isWelcomePage = currentIndex === -1;

  if (isWelcomePage) {
    return <div className="flex-1 flex flex-col">{children}</div>;
  }

  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
        <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                Etapa {currentIndex + 1}: {steps[currentIndex].name}
            </h1>
            <div className="w-full bg-muted rounded-full h-2.5 mt-4">
                <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
                ></div>
            </div>
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
                    <Link href="/" passHref>
                        <Button>
                            Finalizar
                            <CheckCircle className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                )}
            </div>
        </footer>
    </div>
  );
}
