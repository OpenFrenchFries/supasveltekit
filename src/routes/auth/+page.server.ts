import type { PageServerLoad } from './$types';
import { SERVICE_ROLE_KEY } from "$env/static/private";
import { PUBLIC_TEST_USER_EMAIL, PUBLIC_TEST_USER_PASSWORD, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";

export const load = (async () => {
    if(process.env.NODE_ENV === "test") {
        const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY, {auth: {persistSession: false}});
        
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: PUBLIC_TEST_USER_EMAIL,
            password: PUBLIC_TEST_USER_PASSWORD,
            user_metadata: { name: 'Test User' }
        })
        console.log(data, error);
    }
    return {};
}) satisfies PageServerLoad;