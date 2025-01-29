<script lang="ts">
	import '$styles/app.css';

	import { Cursor } from '$components/shared';
	import Footer from '$components/shared/footer/Footer.svelte';
	import { Navbar } from '$components/shared/navbar';

	let { children } = $props();
</script>

<Cursor />

<Navbar />
{@render children()}
<Footer />
