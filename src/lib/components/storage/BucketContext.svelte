<script lang="ts">
	import { setBucketContext } from '$lib/stores/supabase-sdk.js';
	
	export let bucketName: string;
	export let path: string = '';

	setBucketContext({ bucketName, path });
</script>

<slot/>
