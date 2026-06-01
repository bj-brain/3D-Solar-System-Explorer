// vite.config.js
import { defineConfig, loadEnv } from 'vite';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

function chatProxy(env) {
  return {
    name: 'groq-chat-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        const apiKey = env.GROQ_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'GROQ_API_KEY is not set. Add it to .env and restart the dev server.' }));
          return;
        }

        let body = '';
        for await (const chunk of req) {
          body += chunk;
          if (body.length > 1e5) break;
        }

        let payload;
        try {
          payload = JSON.parse(body || '{}');
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          return;
        }

        const userMessage = (payload?.user_message || '').toString().slice(0, 4000);
        if (!userMessage.trim()) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'user_message is required' }));
          return;
        }

        try {
          const upstream = await fetch(GROQ_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: GROQ_MODEL,
              messages: [
                {
                  role: 'system',
                  content: payload.system_prompt
                    || "You are Cosmo, an expert, enthusiastic space chatbot for a solar system website. Provide comprehensive, thorough, and highly educational answers with accurate scientific facts. Never cut your answers short or leave explanations incomplete. Always format your text beautifully with bullet points or clear sections so it is easy to read."
                },
                { role: 'user', content: userMessage }
              ],
              temperature: 0.5,
              max_tokens: 1000
            })
          });

          const text = await upstream.text();
          let data;
          try { data = JSON.parse(text); } catch { data = { raw: text }; }

          if (!upstream.ok) {
            res.statusCode = upstream.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: data?.error?.message || `Groq request failed with status ${upstream.status}`
            }));
            return;
          }

          const reply = data?.choices?.[0]?.message?.content
            || data?.choices?.[0]?.delta?.content
            || '';

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ response: reply, model: data?.model || GROQ_MODEL }));
        } catch (err) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Proxy error: ${err?.message || String(err)}` }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: { output: { manualChunks: undefined } }
    },
    server: {
      port: 3000,
      open: true
    },
    assetsInclude: ['**/*.jpg', '**/*.png', '**/*.mp3'],
    plugins: [chatProxy(env)]
  };
});
