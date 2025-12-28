<script lang="ts">
	interface TreeNode {
		name: string;
		type: 'file' | 'directory';
		children: TreeNode[];
	}

	interface Props {
		structure: string;
		title?: string;
	}

	let { structure, title }: Props = $props();

	function parseStructure(input: string): TreeNode[] {
		const lines = input
			.split(/[;\n]/)
			.map((line) => line.trimEnd())
			.filter((line) => line.trim());

		if (lines.length === 0) return [];

		const root: TreeNode[] = [];
		const stack: { node: TreeNode; depth: number }[] = [];

		for (const line of lines) {
			const trimmed = line.trimStart();
			const depth = line.length - trimmed.length;

			const isDirectory = trimmed.endsWith('/');
			const name = isDirectory ? trimmed.slice(0, -1) : trimmed;

			const node: TreeNode = {
				name,
				type: isDirectory ? 'directory' : 'file',
				children: []
			};

			while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
				stack.pop();
			}

			if (stack.length === 0) {
				root.push(node);
			} else {
				stack[stack.length - 1].node.children.push(node);
			}

			if (isDirectory) {
				stack.push({ node, depth });
			}
		}

		return root;
	}

	function getFileIcon(name: string): string {
		const lowerName = name.toLowerCase();
		const ext = name.split('.').pop()?.toLowerCase();

		const specialFiles: Record<string, string> = {
			dockerfile: '🐳',
			'docker-compose.yml': '🐳',
			'docker-compose.yaml': '🐳',
			'compose.yml': '🐳',
			'compose.yaml': '🐳',
			'.gitignore': '🙈',
			'.env': '🔐',
			'.env.local': '🔐',
			'.env.example': '🔐',
			'package.json': '📦',
			'package-lock.json': '📦',
			'pnpm-lock.yaml': '📦',
			'yarn.lock': '📦',
			'tsconfig.json': '📘',
			'svelte.config.js': '🔶',
			'vite.config.ts': '⚡',
			'vite.config.js': '⚡',
			readme: '📖',
			'readme.md': '📖',
			license: '📜',
			'license.md': '📜',
			makefile: '⚙️'
		};

		if (specialFiles[lowerName]) {
			return specialFiles[lowerName];
		}

		const extIcons: Record<string, string> = {
			ts: '📘',
			tsx: '📘',
			js: '📒',
			jsx: '📒',
			svelte: '🔶',
			vue: '💚',
			css: '🎨',
			scss: '🎨',
			sass: '🎨',
			less: '🎨',
			html: '🌐',
			json: '📋',
			yaml: '📋',
			yml: '📋',
			toml: '📋',
			md: '📝',
			mdx: '📝',
			txt: '📄',
			env: '🔐',
			sh: '⚙️',
			bash: '⚙️',
			zsh: '⚙️',
			fish: '⚙️',
			py: '🐍',
			go: '🔵',
			rs: '🦀',
			sql: '🗃️',
			graphql: '🔮',
			gql: '🔮',
			png: '🖼️',
			jpg: '🖼️',
			jpeg: '🖼️',
			gif: '🖼️',
			svg: '🖼️',
			webp: '🖼️',
			avif: '🖼️',
			ico: '🖼️',
			woff: '🔤',
			woff2: '🔤',
			ttf: '🔤',
			otf: '🔤',
			eot: '🔤',
			mp3: '🎵',
			wav: '🎵',
			mp4: '🎬',
			webm: '🎬',
			zip: '📦',
			tar: '📦',
			gz: '📦',
			rar: '📦',
			'7z': '📦',
			lock: '🔒',
			log: '📃',
			xml: '📰',
			csv: '📊',
			nix: '❄️'
		};

		return extIcons[ext || ''] || '📄';
	}

	const nodes = $derived(parseStructure(structure));
</script>

{#snippet renderNode(node: TreeNode, isLast: boolean, prefix: string)}
	{@const connector = isLast ? '└── ' : '├── '}
	{@const icon = node.type === 'directory' ? '📁' : getFileIcon(node.name)}

	<div class="flex items-center leading-relaxed whitespace-pre">
		<span class="text-accent/60 select-none">{prefix}{connector}</span>
		<span class="mr-2 text-base">{icon}</span>
		<span
			class={node.type === 'directory'
				? 'text-primary font-semibold'
				: 'text-foreground/90'}>
			{node.name}
		</span>
	</div>

	{#if node.children.length > 0}
		{@const newPrefix = prefix + (isLast ? '    ' : '│   ')}
		{#each node.children as child, i (child.name + i)}
			{@render renderNode(child, i === node.children.length - 1, newPrefix)}
		{/each}
	{/if}
{/snippet}

<div
	class="border-elevation-one bg-background my-4 overflow-hidden rounded-lg border font-mono text-sm">
	{#if title}
		<div
			class="border-elevation-one bg-elevation-one/30 flex items-center gap-2 border-b px-4 py-2">
			<span class="text-base">📂</span>
			<span class="text-foreground font-semibold">{title}</span>
		</div>
	{/if}
	<div class="px-4 py-3">
		{#each nodes as node, i (node.name + i)}
			{@render renderNode(node, i === nodes.length - 1, '')}
		{/each}
	</div>
</div>
