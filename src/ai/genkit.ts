import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY ?? "AIzaSyC7f7CDPD-VQF8kHupEOEUAXqXHgXe_fwI",
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
