import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SERVICE_ROLE_KEY } from '$env/static/private';
import type { PageServerLoad } from './$types.js';


export const load = (async () => {
    const supabase = createClient(PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY, {auth: {persistSession: false}});
    const bucketList = await supabase.storage.listBuckets();
    const bucketName = 'test-bucket';
    if (!bucketList?.data?.some(bucket => bucket.name === bucketName)) {
        const bucket = await supabase.storage.createBucket(bucketName, { public: true });
        console.log(`Bucket ${bucketName} created.`, bucket);
    } else {
        console.log(`Bucket ${bucketName} already exists.`);
    }

    // Upload a sample file to the bucket
    const file = new File(['Hello, world!'], 'hello.txt', { type: 'text/plain' });
    const { data, error } = await supabase.storage.from(bucketName).upload('public/hello.txt', file);
    if (error) {
        console.error('Error uploading file:', error);
    } else {
        console.log('File uploaded successfully:', data);
    }

    return {};
}) satisfies PageServerLoad;