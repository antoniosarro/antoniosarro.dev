<script lang="ts">
	import Pre from '../blueprints/pre.svelte';

	let {
		title,
		language,
		html,
		showLineNumbers,
		maxDigits
	}: {
		title?: string;
		language?: string;
		html: string;
		showLineNumbers?: boolean;
		maxDigits?: number;
	} = $props();
</script>

<Pre {title} {language} {showLineNumbers} {maxDigits}>
	<code
		data-line-numbers={showLineNumbers ? '' : undefined}
		data-language={language}
		data-theme="material-theme"
		style="display: grid;"
		data-line-numbers-max-digits={maxDigits}
	>
		{@html html}
	</code>
</Pre>
