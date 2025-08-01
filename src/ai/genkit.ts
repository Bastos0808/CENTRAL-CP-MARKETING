import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY ?? "AIzaSyBL-nMAyZEV-okxM5ki3W4mFt8HJtSNOo4",
      defaultGenerationOptions: {
        model: 'gemini-1.5-pro-latest',
      },
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
