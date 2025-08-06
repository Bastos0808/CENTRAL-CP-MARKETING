
import { BackButton } from "@/components/ui/back-button";
import TrafficReportGenerator from "@/components/traffic-report-generator";

export default function ReportGeneratorPage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Gerador de Relatórios de Tráfego Pago
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Selecione um cliente, forneça os dados de performance e deixe a IA criar uma análise completa.
          </p>
        </header>
        <div className="max-w-4xl mx-auto">
         <TrafficReportGenerator />
        </div>
      </div>
    </main>
  );
}
