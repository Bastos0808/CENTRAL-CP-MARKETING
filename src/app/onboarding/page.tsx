
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function OnboardingWelcomePage() {
  return (
    <div className="w-full max-w-2xl">
        <BackButton />
        <Card className="animate-fade-in border-0 bg-transparent shadow-none mt-4">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                    <Rocket className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-4xl font-bold tracking-tight text-primary">Jornada de Integração SDR</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2 max-w-lg mx-auto">
                    Bem-vindo(a) à CP Marketing Digital! Esta jornada foi projetada para fornecer todo o conhecimento fundamental que você precisa para ter sucesso. Vamos começar?
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Link href="/onboarding/culture">
                    <Button size="lg">
                        Iniciar Jornada
                        <Rocket className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}
