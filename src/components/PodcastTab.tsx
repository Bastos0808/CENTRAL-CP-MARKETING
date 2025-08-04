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
  
  const renderPodcastCard = (podcastId: keyof PodcastData, title: string) => {
    const data = podcastData[podcastId];
    if (!data) return null;

    return (
      <Card key={podcastId} className="bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline flex items-center text-primary">
              <Mic className="mr-3 h-6 w-6" />
              {title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`${podcastId}-done`}
                checked={data.done}
                onCheckedChange={(checked) => onPodcastCheck(podcastId, !!checked)}
                className="h-6 w-6 rounded-md border-2 border-primary"
              />
              <Label htmlFor={`${podcastId}-done`} className="text-base font-normal cursor-pointer">
                Feito
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.guests.map((guest, index) => (
            <div key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${podcastId}-guest-${index}`} className="text-base font-medium">
                    Convidado {index + 1}
                  </Label>
                  <Input
                    id={`${podcastId}-guest-${index}`}
                    value={guest.guestName}
                    onChange={(e) => onPodcastChange(podcastId, index, 'guestName', e.target.value)}
                    className="mt-2 h-12 text-lg bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                    placeholder="Nome..."
                  />
                </div>
                <div>
                  <Label htmlFor={`${podcastId}-insta-${index}`} className="text-base font-medium">
                    Instagram
                  </Label>
                  <Input
                    id={`${podcastId}-insta-${index}`}
                    value={guest.instagram}
                    onChange={(e) => onPodcastChange(podcastId, index, 'instagram', e.target.value)}
                    className="mt-2 h-12 text-lg bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                    placeholder="@usuario"
                  />
                </div>
              </div>
              {index < data.guests.length - 1 && <Separator className="mt-4 bg-border/50" />}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderPodcastCard("podcast1", "Episódio de Podcast 1")}
      {renderPodcastCard("podcast2", "Episódio de Podcast 2")}
      {renderPodcastCard("podcast3", "Episódio de Podcast 3")}
      {renderPodcastCard("podcast4", "Episódio de Podcast 4")}
    </div>
  );
}
