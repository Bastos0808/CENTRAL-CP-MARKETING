
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function OnboardingWelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 text-center">
        <Card className="w-full max-w-2xl animate-fade-in">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                    <Rocket className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-4xl font-bold tracking-tight text-primary">Jornada de Integração SDR</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                    Bem-vindo(a) à CP Marketing Digital! Esta jornada foi projetada para fornecer todo o conhecimento fundamental que você precisa para ter sucesso. Vamos começar?
                </CardDescription>
            </CardHeader>
            <CardContent>
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
