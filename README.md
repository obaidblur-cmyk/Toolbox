# Toolbox
`npm install && npm run dev`. Copy `.env.example` to `.env.local` and set your domain and AdSense IDs. Deploy by importing the repo into Vercel.
To add a tool: add an entry to `lib/tools.ts`, a component in `components/tools/`, and register it in `components/ToolRunner.tsx`.
