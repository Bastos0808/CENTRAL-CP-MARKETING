
import { BackButton } from '@/components/ui/back-button';
import MindMap from '@/components/mind-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Waypoints } from 'lucide-react';


export default function MetodoModusPage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Visão Geral do CP MÖDUS
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            O mapa mental estratégico que guia nossas operações.
          </p>
        </header>
        <div className="max-w-6xl mx-auto">
             <Card>
                <CardHeader>
                    <div className='flex items-center gap-3'>
                        <Waypoints className='h-6 w-6 text-primary' />
                        <CardTitle>CP MÖDUS</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <MindMap />
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
