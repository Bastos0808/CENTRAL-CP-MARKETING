import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {defineConfig} from 'genkit';

export const ai = genkit(
  defineConfig({
    plugins: [
      googleAI({
        apiKey: process.env.GEMINI_API_KEY,
      }),
    ],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
  })
);
