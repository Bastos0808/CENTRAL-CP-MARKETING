import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY, // Garante que a chave seja lida exclusivamente do ambiente
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
