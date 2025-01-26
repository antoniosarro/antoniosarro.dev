<script lang="ts">
	import { Cursor } from '$components/shared';
	import Footer from '$components/shared/footer/Footer.svelte';
	import { Navbar } from '$components/shared/navbar';
	import '$styles/app.css';
	let { children } = $props();
</script>

<Cursor />

<Navbar />
{@render children()}
<Footer />
