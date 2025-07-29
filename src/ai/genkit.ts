import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY ?? "AIzaSyBL-nMAyZEV-okxM5ki3W4mFt8HJtSNOo4",
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
