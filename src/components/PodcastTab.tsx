
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import type { PodcastData } from "@/lib/types";

export type { PodcastData };

interface PodcastTabProps {
  podcastData?: PodcastData;
  onPodcastChange: (podcastId: keyof PodcastData, guestIndex: number, field: 'guestName' | 'instagram', value: string) => void;
  onPodcastCheck: (podcastId: keyof PodcastData, checked: boolean) => void;
}

export function PodcastTab({ podcastData, onPodcastChange, onPodcastCheck }: PodcastTabProps) {
  
  if (!podcastData) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }
  
  const podcastConfigs = [
      { id: 'podcast1', title: 'Episódio 1 - SAÚDE E ESTÉTICA', guestCount: 2 },
      { id: 'podcast2', title: 'EPISÓDIO 2 - EMPRESÁRIO', guestCount: 1 },
      { id: 'podcast3', title: 'EPISÓDIO 3 - GERAL', guestCount: 3 },
      { id: 'podcast4', title: 'EPISÓDIO 4 - GERAL', guestCount: 3 },
      { id: 'podcast5', title: 'EPISÓDIO 5 - GERAL', guestCount: 3 },
  ] as const;

  const renderPodcastCard = (config: typeof podcastConfigs[number]) => {
    const data = podcastData[config.id];
    if (!data) return null;

    return (
      <Card key={config.id} className="bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline flex items-center text-primary">
              <Mic className="mr-3 h-6 w-6" />
              {config.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`${config.id}-done`}
                checked={data.done}
                onCheckedChange={(checked) => onPodcastCheck(config.id, !!checked)}
                className="h-6 w-6 rounded-md border-2 border-primary"
              />
              <Label htmlFor={`${config.id}-done`} className="text-base font-normal cursor-pointer">
                Feito
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: config.guestCount }).map((_, index) => (
            <div key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${config.id}-guest-${index}`} className="text-base font-medium">
                    Convidado {index + 1}
                  </Label>
                  <Input
                    id={`${config.id}-guest-${index}`}
                    value={data.guests[index]?.guestName || ''}
                    onChange={(e) => onPodcastChange(config.id, index, 'guestName', e.target.value)}
                    className="mt-2 h-12 text-lg bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                    placeholder="Nome..."
                  />
                </div>
                <div>
                  <Label htmlFor={`${config.id}-insta-${index}`} className="text-base font-medium">
                    Instagram
                  </Label>
                  <Input
                    id={`${config.id}-insta-${index}`}
                    value={data.guests[index]?.instagram || ''}
                    onChange={(e) => onPodcastChange(config.id, index, 'instagram', e.target.value)}
                    className="mt-2 h-12 text-lg bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                    placeholder="@usuario"
                  />
                </div>
              </div>
              {index < config.guestCount - 1 && <Separator className="mt-4 bg-border/50" />}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {podcastConfigs.map(config => renderPodcastCard(config))}
    </div>
  );
}
