
"use client";

import { analyzeChannel } from "@/ai/flows/channel-analyzer-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Link as LinkIcon, ThumbsUp, ThumbsDown, Target, Search, Copy, PlusCircle, Trash2, Bot } from "lucide-react";
import { useState } from "react";
import { ChannelAnalysisOutput } from "@/ai/schemas/channel-analyzer-schemas";
import { Textarea } from "./ui/textarea";

interface AnalysisTrack {
    id: string;
    url: string;
    isLoading: boolean;
    analysis: ChannelAnalysisOutput | null;
}

export default function ChannelAnalyzer() {
    const [tracks, setTracks] = useState<AnalysisTrack[]>([{ id: crypto.randomUUID(), url: '', isLoading: false, analysis: null }]);
    const { toast } = useToast();

    const handleAnalyze = async (trackId: string) => {
        const trackIndex = tracks.findIndex(t => t.id === trackId);
        if (trackIndex === -1) return;

        const trackToAnalyze = tracks[trackIndex];
        if (!trackToAnalyze.url || !trackToAnalyze.url.startsWith('http')) {
            toast({
                title: "URL Inválida",
                description: "Por favor, insira uma URL válida (ex: https://...).",
                variant: "destructive",
            });
            return;
        }

        updateTrack(trackId, { isLoading: true, analysis: null });

        try {
            const result = await analyzeChannel({ channelUrl: trackToAnalyze.url });
            updateTrack(trackId, { analysis: result, isLoading: false });
            toast({
                title: "Análise Concluída!",
                description: "A IA analisou o canal e gerou o diagnóstico.",
            });
        } catch (error) {
            console.error("Error analyzing channel:", error);
            updateTrack(trackId, { isLoading: false });
            toast({
                title: "Erro na Análise",
                description: "Não foi possível analisar o canal. Verifique a URL e tente novamente.",
                variant: "destructive",
            });
        }
    };

    const updateTrack = (id: string, updates: Partial<AnalysisTrack>) => {
        setTracks(currentTracks =>
            currentTracks.map(track =>
                track.id === id ? { ...track, ...updates } : track
            )
        );
    };
    
    const handleFieldChange = (trackId: string, field: keyof ChannelAnalysisOutput, index: number, value: string) => {
       const trackIndex = tracks.findIndex(t => t.id === trackId);
       if(trackIndex === -1 || !tracks[trackIndex].analysis) return;

       const updatedAnalysis = { ...tracks[trackIndex].analysis! };
       const updatedValues = [...(updatedAnalysis[field] as string[])];
       updatedValues[index] = value;
       
       (updatedAnalysis[field] as string[]) = updatedValues;

       updateTrack(trackId, { analysis: updatedAnalysis });
    };

    const handleHookChange = (trackId: string, value: string) => {
       const trackIndex = tracks.findIndex(t => t.id === trackId);
       if(trackIndex === -1 || !tracks[trackIndex].analysis) return;

       const updatedAnalysis = { ...tracks[trackIndex].analysis!, hook: value };
       updateTrack(trackId, { analysis: updatedAnalysis });
    };

    const addField = (trackId: string, field: 'strengths' | 'weaknesses') => {
        const trackIndex = tracks.findIndex(t => t.id === trackId);
        if(trackIndex === -1 || !tracks[trackIndex].analysis) return;

        const updatedAnalysis = { ...tracks[trackIndex].analysis! };
        (updatedAnalysis[field] as string[]).push('');

        updateTrack(trackId, { analysis: updatedAnalysis });
    };

    const removeField = (trackId: string, field: 'strengths' | 'weaknesses', index: number) => {
        const trackIndex = tracks.findIndex(t => t.id === trackId);
        if(trackIndex === -1 || !tracks[trackIndex].analysis) return;

        const updatedAnalysis = { ...tracks[trackIndex].analysis! };
        (updatedAnalysis[field] as string[]).splice(index, 1);

        updateTrack(trackId, { analysis: updatedAnalysis });
    };


    const addTrack = () => {
        setTracks(currentTracks => [...currentTracks, { id: crypto.randomUUID(), url: '', isLoading: false, analysis: null }]);
    };

    const removeTrack = (id: string) => {
        setTracks(currentTracks => currentTracks.filter(track => track.id !== id));
    };
    
    const copyAnalysis = (track: AnalysisTrack) => {
        if (!track.analysis) return;
        const textToCopy = `
Análise Estratégica de Canal
URL: ${track.url}

--- PONTOS FORTES ---
${track.analysis.strengths.map(s => `- ${s}`).join('\n')}

--- PONTOS FRACOS (Oportunidades) ---
${track.analysis.weaknesses.map(w => `- ${w}`).join('\n')}

--- GANCHO DE PROSPECÇÃO ---
${track.analysis.hook}
        `.trim();

        navigator.clipboard.writeText(textToCopy);
        toast({
            title: "Análise Copiada!",
            description: "O diagnóstico do canal foi copiado."
        })
    };

    return (
        <div className="space-y-6">
            {tracks.map((track, index) => (
                <Card key={track.id}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Trilha de Análise #{index + 1}</CardTitle>
                            {tracks.length > 1 && (
                                <Button variant="ghost" size="icon" onClick={() => removeTrack(track.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                        <CardDescription>Insira a URL de uma plataforma (Instagram, Site, LinkedIn) para gerar um diagnóstico específico.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                             <div className="relative flex-1">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="https://www.instagram.com/prospect"
                                    value={track.url}
                                    onChange={(e) => updateTrack(track.id, { url: e.target.value })}
                                    className="pl-10"
                                    disabled={track.isLoading}
                                />
                             </div>
                            <Button onClick={() => handleAnalyze(track.id)} disabled={track.isLoading || !track.url}>
                                {track.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                {track.isLoading ? "Analisando..." : "Analisar"}
                            </Button>
                             {track.analysis && (
                                <Button variant="outline" size="icon" onClick={() => copyAnalysis(track)}>
                                    <Copy className="h-4 w-4"/>
                                </Button>
                            )}
                        </div>
                        
                         {track.isLoading ? (
                            <div className="text-center text-muted-foreground p-8 flex flex-col items-center">
                                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                                <p>A IA está visitando o canal...</p>
                            </div>
                        ) : track.analysis ? (
                           <div className="w-full space-y-6 text-sm pt-4 border-t">
                               <div className="space-y-2">
                                    <h3 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2 mb-2"><ThumbsUp /> Pontos Fortes</h3>
                                    <div className="space-y-2">
                                    {track.analysis.strengths.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <Input value={item} onChange={e => handleFieldChange(track.id, 'strengths', i, e.target.value)} className="bg-green-500/10 border-green-500/20"/>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeField(track.id, 'strengths', i)}><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    ))}
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => addField(track.id, 'strengths')}><PlusCircle className="mr-2 h-4 w-4"/> Adicionar Ponto Forte</Button>
                               </div>
                               <div className="space-y-2">
                                    <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-2"><ThumbsDown /> Pontos Fracos (Dores)</h3>
                                    <div className="space-y-2">
                                        {track.analysis.weaknesses.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <Input value={item} onChange={e => handleFieldChange(track.id, 'weaknesses', i, e.target.value)} className="bg-red-500/10 border-red-500/20"/>
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeField(track.id, 'weaknesses', i)}><Trash2 className="h-4 w-4"/></Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => addField(track.id, 'weaknesses')}><PlusCircle className="mr-2 h-4 w-4"/> Adicionar Ponto Fraco</Button>
                               </div>
                               <div className="space-y-2">
                                    <h3 className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-2"><Target /> Gancho de Prospecção</h3>
                                    <Textarea 
                                        value={track.analysis.hook} 
                                        onChange={e => handleHookChange(track.id, e.target.value)}
                                        className="bg-blue-500/10 border-blue-500/20 min-h-[100px]"
                                    />
                               </div>
                           </div>
                        ) : (
                             <div className="text-center text-muted-foreground p-8">
                                <Bot className="h-10 w-10 mx-auto mb-4"/>
                                <p>A análise do canal aparecerá aqui.</p>
                            </div>
                        )}

                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-center">
                <Button variant="secondary" onClick={addTrack}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar outro canal para análise
                </Button>
            </div>
        </div>
    );
}
