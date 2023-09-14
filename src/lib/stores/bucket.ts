import { readable } from 'svelte/store';
import type { StorageClient, FileObject} from '@supabase/storage-js';

type BucketFilesList = {
    data: FileObject[] | [];
    error: Error | null;
};
  
interface BucketFilesListStore {
    subscribe: (cb: (value: BucketFilesList) => void) => void | (() => void);
}

export function bucketFilesListStore(storage: StorageClient, bucketName: string, path: string = ''): BucketFilesListStore {  

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

	const { subscribe } = readable<BucketFilesList>({data: [], error: null}, (set) => {
		storage
			.from(bucketName)
			.list(path)
			.then(({ data, error }) => {
            	set({ data: data ?? [], error });
        });
	});

	return {
		subscribe
	};
}
