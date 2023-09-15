import { readable } from 'svelte/store';
import type { StorageClient, FileObject, Bucket} from '@supabase/storage-js';

type BucketFilesList = {
    data: FileObject[] | [];
    error: Error | null;
};

type BucketsList = {
    data: Bucket[] | [];
    error: Error | null;
};

interface BucketFilesListStore {
    subscribe: (cb: (value: BucketFilesList) => void) => void | (() => void);
}

export function bucketFilesListStore(storage: StorageClient, bucketName: string, path = ''): BucketFilesListStore {  

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

interface BucketsListStore {
    subscribe: (cb: (value: BucketsList) => void) => void | (() => void);
}

export function bucketsListStore(storage: StorageClient): BucketsListStore {  

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

	const { subscribe } = readable<BucketsList>({data: [], error: null}, (set) => {
		storage
			.listBuckets()
			.then(({ data, error }) => {
				set({ data: data ?? [], error });
        });
	});

	return {
		subscribe
	};
}
