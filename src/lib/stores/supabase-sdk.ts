import type { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js";
import type { StorageClient } from "@supabase/storage-js";
import { getContext, setContext } from "svelte";

export interface SupabaseContext {
	auth?: SupabaseAuthClient;
	storage?: StorageClient;
}

export interface BucketContext {
	bucketName: string;
	path: string;
}

export const contextKey = 'supabaseContext';
export const bucketContextKey = 'bucketContext';

export function setSupabaseContext(sdks: SupabaseContext) {
	setContext(contextKey, sdks);
}

export function getSupabaseContext(): SupabaseContext {
	return getContext(contextKey);
}

export function setBucketContext(bucketContext: BucketContext) {
	setContext(bucketContextKey, bucketContext);
}

export function getBucketContext(): BucketContext {
	return getContext(bucketContextKey);
}
