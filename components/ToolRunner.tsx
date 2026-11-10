'use client';
import dynamic from 'next/dynamic';
const map: Record<string, React.ComponentType> = {
  'json-formatter': dynamic(() => import('./tools/JsonTool')),
  'word-counter': dynamic(() => import('./tools/CounterTool')),
  'base64-encoder-decoder': dynamic(() => import('./tools/Base64Tool')),
  'password-hash-generator': dynamic(() => import('./tools/PasswordHashTool')),
  'text-case-converter': dynamic(() => import('./tools/CaseTool')),
};
export default function ToolRunner({ slug }: { slug: string }) { const C = map[slug]; return C ? <C /> : null; }
