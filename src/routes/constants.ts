import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL, PUBLIC_TEST_USER_EMAIL, PUBLIC_TEST_USER_PASSWORD } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

export const supabaseUrl = PUBLIC_SUPABASE_URL;
export const supabaseKey = PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

if(process.env.NODE_ENV === "development") {
    supabase.auth.signUp({email: PUBLIC_TEST_USER_EMAIL, password: PUBLIC_TEST_USER_PASSWORD}).then(account => {
        console.log("Test user created.", account);
    });

    // Upload a sample file to the bucket
    const file = new File(['Hello, world!'], 'hello.txt', { type: 'text/plain' });
    supabase.storage.from("test-bucket").upload('public/hello.txt', file)
        .catch(error => {
            console.error("Error uploading file:", error);
        })
        .then(data => {
            console.log("File uploaded successfully:", data);
        });
}