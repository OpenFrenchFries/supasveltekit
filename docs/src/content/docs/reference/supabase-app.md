---
title: Supabase App
description: How to use the Supabase App component.
---

The `SupabaseApp` component is used to wrap your app and provide the Supabase client to the rest of your app.

## Usage
    
```svelte
<script lang="ts">
    import { supabase } from "$lib/supabase";
    import { SupabaseApp } from "supasvelte";
</script>

<SupabaseApp {supabase}>
    <!-- Your components here -->
</SupabaseApp>
```