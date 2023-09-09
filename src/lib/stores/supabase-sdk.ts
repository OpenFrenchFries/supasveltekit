import type { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js";
import type { StorageClient } from "@supabase/storage-js";
import { getContext, setContext } from "svelte";

export interface SupabaseContext {
	auth?: SupabaseAuthClient;
	storage?: StorageClient;
}

export const contextKey = 'supabase';

export function setSupabaseContext(sdks: SupabaseContext) {
	setContext(contextKey, sdks);
}

/**
 * Get the Firebase SDKs from Svelte context
 */
export function getSupabaseContext(): SupabaseContext {
	return getContext(contextKey);
}
