import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const apiPlugin = () => ({
  name: 'iris-api-middleware',
  configureServer(server: any) {
    server.middlewares.use('/api/health', (_req: any, res: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'healthy', dev: true, system: 'IRIS Retail Dev Server' }));
    });
    server.middlewares.use('/api/chat', (req: any, res: any) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          try {
            const { message } = JSON.parse(body || '{}');
            const lower = (message || '').toLowerCase();
            let reply = '';
            let targetProductId;
            if (lower.includes('colgate') || lower.includes('toothpaste') || lower.includes('brush')) {
              reply = 'Colgate MaxFresh Peppermint 150g is in Aisle 7, Shelf B (Eye Level, Bin 12). Today it has a 20% discount (₹115 instead of ₹145). Walking distance from your cart is ~45 meters.';
              targetProductId = 'prod-colgate-maxfresh';
            } else if (lower.includes('butter') || lower.includes('amul') || lower.includes('ghee')) {
              reply = 'Amul Pasteurised Butter 500g is at Dairy Chiller Vault 1, Shelf 1 (₹275). Amul Pure Ghee 1L Tin is right next to you at Aisle 4, Bay 2 (₹575, ₹65 FLAT OFF today!).';
              targetProductId = 'prod-amul-ghee';
            } else if (lower.includes('rice') || lower.includes('basmati')) {
              reply = 'India Gate Basmati Rice Classic 1kg is in Aisle 1, Shelf C, Bin 03 at ₹195 (Unit rate ₹19.50/100g). For maximum savings, the 5kg bag is ₹890 (₹17.80/100g).';
              targetProductId = 'prod-india-gate-rice';
            } else if (lower.includes('offer') || lower.includes('deal') || lower.includes('discount')) {
              reply = 'Today we have 42 active Electronic Shelf Deals! Highlight deals: Surf Excel 2L Liquid (35% OFF in Aisle 11), Colgate MaxFresh (20% OFF in Aisle 7), and Maggi 12-pack (18% OFF in Aisle 3).';
            } else if (lower.includes('baby') || lower.includes('diaper')) {
              reply = 'Baby diapers and care items are located in Aisle 12, Shelf B. Pampers All Round Protection (Medium 64s) has 15% OFF at ₹849.';
              targetProductId = 'prod-pampers-diapers';
            } else {
              reply = 'I found matching items in our Koramangala store inventory. Would you like me to plot turn-by-turn walking route from your current cart (#BC-882 at Aisle 4) or flash the physical shelf LED tag?';
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply, targetProductId, source: 'vite-dev-middleware' }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
