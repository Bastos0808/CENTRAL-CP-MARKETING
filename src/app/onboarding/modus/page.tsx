

"use client";

import MindMap from "@/components/mind-map";
import { useEffect } from "react";
import { useOnboarding } from "../layout";


export default function ModusPage() {
    const { setStepCompleted } = useOnboarding();

    useEffect(() => {
        // Considera a etapa completa assim que o usuário chega nela
        setStepCompleted(true);
    }, [setStepCompleted]);

  return (
    <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
            O <strong>Mödus</strong> é o nosso sistema nervoso central. É a metodologia que guia desde o diagnóstico de um cliente até a execução de cada conteúdo. Use este mapa mental para consultar e aprofundar seu conhecimento sobre nossa forma de gerar resultados.
        </p>

        <MindMap />
    </div>
  );
}
