import { readable } from 'svelte/store';
import type { StorageClient, Bucket} from '@supabase/storage-js';

type BucketList = {
    data: Bucket[] | [];
    error: Error | null;
};
  
interface BucketListStore {
    subscribe: (cb: (value: BucketList) => void) => void | (() => void);
}

export function bucketListStore(storage: StorageClient): BucketListStore {  

	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: [], error: null });
		return {
			subscribe
		};
	}

	//If the auth is not initialized, return a dummy store
	if (!storage) {
		console.warn(
			'Storage is not initialized. Did you forget to create a `supabase` instance?'
		);
		const { subscribe } = readable({ data: [], error: new Error('Storage is not initialized') });
		return {
			subscribe
		};
	}

	const { subscribe } = readable<BucketList>({data: [], error: null}, (set) => {
		storage.listBuckets().then(({ data, error }) => {
            set({ data: data ?? [], error });
        });
	});

	return {
		subscribe
	};
}
