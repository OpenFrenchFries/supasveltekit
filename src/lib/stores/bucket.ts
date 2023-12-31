import { readable } from 'svelte/store';
import type { StorageClient, FileObject, Bucket, FileOptions } from '@supabase/storage-js';

type BucketFilesList = {
	data: FileObject[] | [];
	error: Error | null;
};

type BucketsList = {
	data: Bucket[] | [];
	error: Error | null;
};

type BucketsDownloadURL = {
	data: string | null;
	error: Error | null;
};

type UploadedFile = {
	data: string | null;
	error: Error | null;
};

interface BucketFilesListStore {
	subscribe: (cb: (value: BucketFilesList) => void) => void | (() => void);
}

export function bucketFilesListStore(
	storage: StorageClient,
	bucketName: string,
	path = ''
): BucketFilesListStore {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: [], error: null });
		return {
			subscribe
		};
	}

	//If the storage is not initialized, return a dummy store
	if (!storage) {
		console.warn('Storage is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = readable({ data: [], error: new Error('Storage is not initialized') });
		return {
			subscribe
		};
	}

	const { subscribe } = readable<BucketFilesList>({ data: [], error: null }, (set) => {
		storage
			.from(bucketName)
			.list(path)
			.then(({ data, error }) => {
				set({ data: data ?? [], error });
			})
			.catch((error) => {
				set({ data: [], error });
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
		console.warn('Storage is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = readable({ data: [], error: new Error('Storage is not initialized') });
		return {
			subscribe
		};
	}

	const { subscribe } = readable<BucketsList>({ data: [], error: null }, (set) => {
		storage
			.listBuckets()
			.then(({ data, error }) => {
				set({ data: data ?? [], error });
			})
			.catch((error) => {
				set({ data: [], error });
			});
	});

	return {
		subscribe
	};
}

interface DownloadURLStore {
	subscribe: (cb: (value: BucketsDownloadURL) => void) => void | (() => void);
}

/**
 * Download URL Store
 * @param storage Supabase Storage Client
 * @param bucket Bucket name
 * @param path File path
 * @param validity Validity in seconds
 * @returns A store with the download URL
 */
export function downloadURLStore(
	storage: StorageClient,
	bucket: string,
	path: string,
	validity = 60
): DownloadURLStore {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: null, error: null });
		return {
			subscribe
		};
	}

	//If the auth is not initialized, return a dummy store
	if (!storage) {
		console.warn('Storage is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = readable({ data: null, error: new Error('Storage is not initialized') });
		return {
			subscribe
		};
	}

	const { subscribe } = readable<BucketsDownloadURL>({ data: null, error: null }, (set) => {
		storage
			.from(bucket)
			.createSignedUrl(path, validity)
			.then(({ data, error }) => {
				set({ data: data?.signedUrl ?? null, error });
			})
			.catch((error) => {
				set({ data: null, error });
			});
	});

	return {
		subscribe
	};
}

export interface UploaderStore {
	subscribe: (cb: (value: UploadedFile) => void) => void | (() => void);
}

export function uploadStore(
	storage: StorageClient,
	bucketName: string,
	path: string,
	file?: File | null,
	options?: FileOptions
): UploaderStore {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: null, error: null });
		return {
			subscribe
		};
	}

	//If the auth is not initialized, return a dummy store
	if (!storage) {
		console.warn('Storage is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = readable({ data: null, error: new Error('Storage is not initialized') });
		return {
			subscribe
		};
	}

	if (!file) {
		const { subscribe } = readable({ data: null, error: new Error('No file provided') });
		return {
			subscribe
		};
	}

	const { subscribe } = readable<UploadedFile>({ data: null, error: null }, (set) => {
		storage
			.from(bucketName)
			.upload(path + file.name, file, options)
			.then(({ data, error }) => {
				set({ data: data?.path ?? null, error });
			})
			.catch((error) => {
				set({ data: null, error });
			});
	});

	return {
		subscribe
	};
}
