import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase/v1';

export const ai = genkit({
  plugins: [
    firebase(), // Handles auth and telemetry in production
    googleAI(),   
  ],
  enableTracingAndMetrics: true,
});
