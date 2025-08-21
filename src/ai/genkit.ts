import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [
    firebase(), // Adicionado para autenticação automática em produção
    googleAI(),   // A chave de API não é mais necessária aqui
  ],
  enableTracingAndMetrics: true,
});
