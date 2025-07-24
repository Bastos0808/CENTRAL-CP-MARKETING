
"use client";

import { useRouter } from 'next/navigation';
import { Button } from './button';
import { ArrowLeft } from 'lucide-react';

export const BackButton = () => {
    const router = useRouter();

    return (
        <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-4"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
        </Button>
    )
}
