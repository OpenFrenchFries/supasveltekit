import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL, PUBLIC_TEST_USER_EMAIL, PUBLIC_TEST_USER_PASSWORD } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = PUBLIC_SUPABASE_URL;
export const supabaseKey = PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {auth: {persistSession: false}});

if(process.env.NODE_ENV === "development") {
    supabase.auth.signUp({email: PUBLIC_TEST_USER_EMAIL, password: PUBLIC_TEST_USER_PASSWORD}).then(account => {
        console.log("Test user created.")

        supabase.auth.signInWithPassword({email: PUBLIC_TEST_USER_EMAIL, password: PUBLIC_TEST_USER_PASSWORD}).then(account => {
            supabase
                .storage
                .createBucket('test-bucket', {
                    public: true,
                }).then(bucket => {
                    console.log("Bucket created.", bucket)
                });
        })

        supabase.auth.signOut().then(() => {
            console.log("Test user signed out.")
        });
    })
}