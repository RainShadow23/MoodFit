/// <reference types="vite/client" />

declare const __GOOGLE_KEY__: string;

// Cloudflare Pages Functions Types
type PagesFunction<Env = unknown, Params extends string = any, Data extends Record<string, unknown> = Record<string, unknown>> = (
    context: EventContext<Env, Params, Data>
) => Promise<Response> | Response;

interface EventContext<Env, Params extends string, Data> {
    request: Request;
    functionPath: string;
    waitUntil: (promise: Promise<any>) => void;
    passThroughOnException: () => void;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    env: Env;
    params: Params extends string ? Record<Params, string> : Record<string, never>;
    data: Data;
}
