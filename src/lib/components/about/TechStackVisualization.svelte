<script lang="ts">
	import { hardSkills } from '$lib/data/hardSkills';
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface Node {
		id: string;
		label: string;
		category: string;
		categoryOrder: number;
		icon: any;
		href: string;
		x: number;
		y: number;
		vx: number;
		vy: number;
		connections: string[];
	}

	interface Connection {
		source: string;
		target: string;
	}

	// --- Configuration ---
	const connectionMap: Record<string, string[]> = {
		Svelte: ['Typescript', 'Tailwind CSS', 'NodeJs'],
		Typescript: ['Svelte', 'NodeJs', 'React', 'NextJs', 'Express'],
		React: ['Typescript', 'NextJs', 'Tailwind CSS'],
		NextJs: ['React', 'Typescript', 'NodeJs'],
		NodeJs: ['Typescript', 'Express', 'Postgresql', 'MySQL', 'Redis'],
		Express: ['NodeJs', 'Typescript', 'Postgresql', 'MySQL'],
		Golang: ['Postgresql', 'MySQL', 'Redis', 'Docker'],
		Postgresql: ['Golang', 'NodeJs', 'Docker'],
		MySQL: ['Golang', 'NodeJs', 'Docker'],
		Redis: ['Golang', 'NodeJs', 'Docker'],
		Docker: ['Linux', 'AWS', 'Golang', 'NodeJs'],
		Linux: ['Docker', 'Bash', 'Git'],
		AWS: ['Docker', 'Golang', 'NodeJs'],
		Git: ['Linux', 'Docker'],
		Bash: ['Linux', 'Git'],
		'.NET': ['Postgresql', 'MySQL', 'Docker'],
		SQLite: ['NodeJs', 'Golang'],
		'Tailwind CSS': ['Svelte', 'React', 'NextJs']
	};

	const categoryColors: Record<string, string> = {
		Languages: '#f67e82',
		Databases: '#8b5cf6',
		Frameworks: '#10b981',
		Tools: '#f59e0b'
	};

	const categoryHierarchy: Record<string, number> = {
		Languages: 1,
		Frameworks: 2,
		Databases: 3,
		Tools: 4
	};

	// --- State ---
	let container: HTMLDivElement;
	let width = $state(800);
	let height = $state(500);
	let nodes = $state<Node[]>([]);
	let connections = $state<Connection[]>([]);

	let hoveredNode = $state<string | null>(null);
	let hoveredTreeNode = $state<string | null>(null);
	let selectedNode = $state<string | null>(null);
	let draggedNode = $state<string | null>(null);
	let dragOffset = $state({ x: 0, y: 0 });
	let hasDragged = $state(false);

	// Physics Constants
	const REPULSION_STRENGTH = 3000;
	const ATTRACTION_STRENGTH = 0.01;
	const CENTER_GRAVITY = 0.001;
	const DAMPING = 0.88;
	const IDEAL_LINK_DISTANCE = 140;
	const MIN_DISTANCE = 90;
	const NODE_RADIUS = 32;

	// --- Helpers ---

	function getTreeSet(): Set<string> {
		if (!selectedNode) return new Set();

		const set = new Set<string>();
		set.add(selectedNode);

		connections.forEach((c) => {
			if (c.source === selectedNode) set.add(c.target);
			if (c.target === selectedNode) set.add(c.source);
		});

		return set;
	}

	function getOrganizedTreeNodes() {
		if (!selectedNode) return { root: null, children: [] };

		const treeSet = getTreeSet();
		const treeNodes = nodes.filter((n) => treeSet.has(n.id));
		const rootNode = treeNodes.find((n) => n.id === selectedNode);

		if (!rootNode) return { root: null, children: [] };

		const neighbors = treeNodes.filter((n) => n.id !== selectedNode);

		const sortedChildren = neighbors.sort((a, b) => {
			if (a.categoryOrder !== b.categoryOrder) {
				return a.categoryOrder - b.categoryOrder;
			}
			return a.label.localeCompare(b.label);
		});

		return { root: rootNode, children: sortedChildren };
	}

	// --- Initialization ---
	function initializeNodes() {
		const allNodes: Node[] = [];
		const allConnections: Connection[] = [];
		const totalItems = hardSkills.reduce((acc, cat) => acc + cat.items.length, 0);
		let itemIndex = 0;

		hardSkills.forEach((category) => {
			category.items.forEach((item) => {
				const angle = (itemIndex / totalItems) * Math.PI * 2;
				const radius = Math.min(width, height) * 0.3;

				allNodes.push({
					id: item.title,
					label: item.title,
					category: category.key,
					categoryOrder: categoryHierarchy[category.key] || 99,
					icon: item.icon,
					href: item.href,
					x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
					y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
					vx: 0,
					vy: 0,
					connections: connectionMap[item.title] || []
				});
				itemIndex++;
			});
		});

		const connectionSet = new SvelteSet<string>();
		allNodes.forEach((node) => {
			node.connections.forEach((targetId) => {
				const key = [node.id, targetId].sort().join('|');
				if (!connectionSet.has(key) && allNodes.find((n) => n.id === targetId)) {
					connectionSet.add(key);
					allConnections.push({
						source: node.id,
						target: targetId
					});
				}
			});
		});

		nodes = allNodes;
		connections = allConnections;
	}

	// --- Tree Layout Logic ---
	function getTreePositions() {
		if (!selectedNode) return null;

		const treeMap = new Map<string, { x: number; y: number }>();
		const { root, children } = getOrganizedTreeNodes();

		if (!root) return null;

		const sidebarWidth = 260;
		const startX = width - sidebarWidth + 70;
		const startY = 60;

		treeMap.set(root.id, { x: startX, y: startY });

		let currentY = startY + 80;
		const itemHeight = 52;

		children.forEach((node) => {
			treeMap.set(node.id, {
				x: startX + 30,
				y: currentY
			});
			currentY += itemHeight;
		});

		return treeMap;
	}

	// --- Simulation ---
	function simulate() {
		if (nodes.length === 0) return;

		const centerX = width / 2;
		const centerY = height / 2;
		const nodeMap = new Map(nodes.map((n) => [n.id, n]));

		const treePositions = getTreePositions();
		const nodesInTree = treePositions ? new Set(treePositions.keys()) : new Set();

		nodes = nodes.map((node) => {
			if (draggedNode === node.id) return node;

			if (treePositions && treePositions.has(node.id)) {
				const target = treePositions.get(node.id)!;
				const lerpFactor = 0.2;
				const newX = node.x + (target.x - node.x) * lerpFactor;
				const newY = node.y + (target.y - node.y) * lerpFactor;
				return { ...node, x: newX, y: newY, vx: 0, vy: 0 };
			}

			let fx = 0;
			let fy = 0;

			fx += (centerX - node.x) * CENTER_GRAVITY;
			fy += (centerY - node.y) * CENTER_GRAVITY;

			nodes.forEach((other) => {
				if (other.id === node.id) return;
				if (nodesInTree.has(other.id)) return;

				const dx = node.x - other.x;
				const dy = node.y - other.y;
				let distSq = dx * dx + dy * dy;
				let dist = Math.sqrt(distSq);
				if (dist < 1) dist = 1;

				if (dist < MIN_DISTANCE * 4) {
					const force = REPULSION_STRENGTH / (distSq || 1);
					fx += (dx / dist) * force;
					fy += (dy / dist) * force;
				}

				const collisionRadius = NODE_RADIUS * 2.2;
				if (dist < collisionRadius) {
					const overlap = collisionRadius - dist;
					const nudgeForce = overlap * 0.5;
					fx += (dx / dist) * nudgeForce;
					fy += (dy / dist) * nudgeForce;
				}
			});

			connections
				.filter((c) => c.source === node.id || c.target === node.id)
				.forEach((conn) => {
					const otherId = conn.source === node.id ? conn.target : conn.source;
					if (nodesInTree.has(otherId)) return;

					const other = nodeMap.get(otherId);
					if (!other) return;

					const dx = other.x - node.x;
					const dy = other.y - node.y;
					const dist = Math.sqrt(dx * dx + dy * dy) || 1;
					const displacement = dist - IDEAL_LINK_DISTANCE;
					const force = displacement * ATTRACTION_STRENGTH;

					fx += (dx / dist) * force;
					fy += (dy / dist) * force;
				});

			let newVx = (node.vx + fx) * DAMPING;
			let newVy = (node.vy + fy) * DAMPING;

			const maxVel = 8;
			const vel = Math.sqrt(newVx * newVx + newVy * newVy);
			if (vel > maxVel) {
				newVx = (newVx / vel) * maxVel;
				newVy = (newVy / vel) * maxVel;
			}

			if (Math.abs(newVx) < 0.01) newVx = 0;
			if (Math.abs(newVy) < 0.01) newVy = 0;

			const padding = 60;
			let newX = node.x + newVx;
			let newY = node.y + newVy;

			if (selectedNode && newX > width - 260) {
				newX = width - 260 - 20;
				newVx *= -0.5;
			}

			if (newX < padding) {
				newX = padding;
				newVx *= -0.5;
			}
			if (newX > width - padding) {
				newX = width - padding;
				newVx *= -0.5;
			}
			if (newY < padding) {
				newY = padding;
				newVy *= -0.5;
			}
			if (newY > height - padding) {
				newY = height - padding;
				newVy *= -0.5;
			}

			return { ...node, x: newX, y: newY, vx: newVx, vy: newVy };
		});
	}

	function calculateLineCoordinates(source: Node, target: Node) {
		const dx = target.x - source.x;
		const dy = target.y - source.y;
		const angle = Math.atan2(dy, dx);
		const offset = 32;

		return {
			x1: source.x + Math.cos(angle) * offset,
			y1: source.y + Math.sin(angle) * offset,
			x2: target.x - Math.cos(angle) * offset,
			y2: target.y - Math.sin(angle) * offset
		};
	}

	// --- Interaction Handlers ---

	function handleNodeMouseDown(nodeId: string, e: MouseEvent) {
		const treeSet = getTreeSet();
		const isInTree = treeSet.has(nodeId);

		if (isInTree) return;

		e.preventDefault();
		e.stopPropagation();
		const node = nodes.find((n) => n.id === nodeId);
		if (!node || !container) return;

		const rect = container.getBoundingClientRect();
		dragOffset = {
			x: e.clientX - rect.left - node.x,
			y: e.clientY - rect.top - node.y
		};
		draggedNode = nodeId;
		hasDragged = false;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!draggedNode || !container) return;

		const rect = container.getBoundingClientRect();
		const x = e.clientX - rect.left - dragOffset.x;
		const y = e.clientY - rect.top - dragOffset.y;

		const padding = 50;
		const clampedX = Math.max(padding, Math.min(width - padding, x));
		const clampedY = Math.max(padding, Math.min(height - padding, y));

		nodes = nodes.map((node) =>
			node.id === draggedNode ? { ...node, x: clampedX, y: clampedY, vx: 0, vy: 0 } : node
		);
		hasDragged = true;
	}

	function handleMouseUp() {
		draggedNode = null;
	}

	function handleNodeClick(nodeId: string, href: string, e: MouseEvent) {
		e.stopPropagation();

		const treeSet = getTreeSet();
		const isInTree = treeSet.has(nodeId);

		if (isInTree) {
			window.open(href, '_blank');
			return;
		}

		if (!hasDragged) {
			selectedNode = selectedNode === nodeId ? null : nodeId;
		}
	}

	function handleContainerClick() {
		selectedNode = null;
	}

	function handleDoubleClick(nodeId: string, href: string, e: MouseEvent) {
		e.stopPropagation();

		const treeSet = getTreeSet();
		const isInTree = treeSet.has(nodeId);

		if (!isInTree) {
			window.open(href, '_blank');
		}
	}

	// --- Styling & Visibility Logic ---

	function isConnectionVisible(conn: Connection): boolean {
		if (!selectedNode) return true;

		const treeSet = getTreeSet();
		const sourceInTree = treeSet.has(conn.source);
		const targetInTree = treeSet.has(conn.target);

		if (sourceInTree && targetInTree) return false;
		if (!sourceInTree && !targetInTree) return true;
		return false;
	}

	function getNodeState(nodeId: string) {
		const treeSet = getTreeSet();
		const isInTree = treeSet.has(nodeId);

		if (selectedNode) {
			if (isInTree) {
				return 'static-tree';
			}

			if (hoveredNode) {
				const hoveredInTree = treeSet.has(hoveredNode);

				if (hoveredInTree) return 'normal';

				if (nodeId === hoveredNode) return 'active';

				const isRelated = connections.some(
					(c) =>
						(c.source === hoveredNode && c.target === nodeId) ||
						(c.target === hoveredNode && c.source === nodeId)
				);

				if (isRelated && !treeSet.has(hoveredNode)) return 'related';

				return 'unrelated';
			}

			return 'normal';
		}

		if (!hoveredNode) return 'normal';

		if (nodeId === hoveredNode) return 'active';

		const isRelated = connections.some(
			(c) =>
				(c.source === hoveredNode && c.target === nodeId) ||
				(c.target === hoveredNode && c.source === nodeId)
		);

		if (isRelated) return 'related';
		return 'unrelated';
	}

	function getConnectionOpacity(conn: Connection): number {
		if (!isConnectionVisible(conn)) return 0;

		const treeSet = getTreeSet();
		const sourceInTree = treeSet.has(conn.source);
		const targetInTree = treeSet.has(conn.target);

		if (selectedNode && sourceInTree && targetInTree) {
			return 0.6;
		}

		if (!hoveredNode) return 0.2;

		if (selectedNode && treeSet.has(hoveredNode)) return 0.2;

		const isConnectedToHovered = conn.source === hoveredNode || conn.target === hoveredNode;

		return isConnectedToHovered ? 0.8 : 0.05;
	}

	function getConnectionColor(conn: Connection): string {
		const treeSet = getTreeSet();

		if (selectedNode && treeSet.has(conn.source) && treeSet.has(conn.target)) {
			const selectedNodeData = nodes.find((n) => n.id === selectedNode);
			return selectedNodeData ? categoryColors[selectedNodeData.category] : 'var(--foreground)';
		}

		if (hoveredNode && (!selectedNode || !treeSet.has(hoveredNode))) {
			if (conn.source === hoveredNode || conn.target === hoveredNode) {
				const neighborId = conn.source === hoveredNode ? conn.target : conn.source;
				const neighborNode = nodes.find((n) => n.id === neighborId);
				return neighborNode ? categoryColors[neighborNode.category] : 'var(--foreground)';
			}
		}

		return 'var(--foreground)';
	}

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				width = entry.contentRect.width;
				height = Math.max(450, Math.min(600, entry.contentRect.width * 0.55));
			}
			initializeNodes();
		});

		resizeObserver.observe(container);
		initializeNodes();
		const interval = setInterval(simulate, 20);

		return () => {
			resizeObserver.disconnect();
			clearInterval(interval);
		};
	});
</script>

<svelte:window onmouseup={handleMouseUp} onmousemove={handleMouseMove} />

<div
	bind:this={container}
	class="relative w-full overflow-hidden rounded-xl border border-elevation-one bg-background"
	style="height: {height}px"
	role="img"
	aria-label="Interactive tech stack visualization"
	onclick={handleContainerClick}
>
	<!-- Background graph connections -->
	<svg class="pointer-events-none absolute inset-0 h-full w-full">
		{#each connections as conn (conn.source + '-' + conn.target)}
			{@const sourceNode = nodes.find((n) => n.id === conn.source)}
			{@const targetNode = nodes.find((n) => n.id === conn.target)}

			{#if sourceNode && targetNode && isConnectionVisible(conn)}
				{@const coords = calculateLineCoordinates(sourceNode, targetNode)}
				<line
					x1={coords.x1}
					y1={coords.y1}
					x2={coords.x2}
					y2={coords.y2}
					stroke={getConnectionColor(conn)}
					stroke-width={selectedNode ? 2 : 1.5}
					opacity={getConnectionOpacity(conn)}
					class="transition-all duration-300"
				/>
			{/if}
		{/each}
	</svg>

	<!-- Sidebar panel -->
	<div
		class="absolute top-0 right-0 bottom-0 z-10 w-64 overflow-hidden border-l border-elevation-one backdrop-blur-sm transition-transform duration-500 ease-in-out"
		style="transform: translateX({selectedNode
			? '0%'
			: '100%'}); background-color: rgba(var(--background, 0, 0, 0), 0.95);"
		onclick={(e) => e.stopPropagation()}
	>
		{#if selectedNode}
			{@const { root, children } = getOrganizedTreeNodes()}
			{#if root}
				{@const rootColor = categoryColors[root.category]}
				{@const isRootHovered = hoveredTreeNode === root.id}

				<div class="flex h-full flex-col p-4">
					<!-- Root node -->
					<button
						class="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200"
						style="background-color: {isRootHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};"
						onmouseenter={() => (hoveredTreeNode = root.id)}
						onmouseleave={() => (hoveredTreeNode = null)}
						onclick={() => window.open(root.href, '_blank')}
					>
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 bg-background transition-all duration-200"
							style="
                                border-color: {rootColor};
                                box-shadow: 0 0 20px {rootColor}40;
                            "
						>
							<root.icon class="h-6 w-6" style="color: {rootColor}" />
						</div>
						<div class="flex min-w-0 flex-1 flex-col">
							<span
								class="truncate text-sm font-semibold transition-all duration-200"
								style="color: {rootColor}"
							>
								{root.label}
							</span>
							<span class="text-muted-foreground text-xs">{root.category}</span>
						</div>
						<svg
							class="h-4 w-4 shrink-0 transition-all duration-200"
							style="
                                opacity: {isRootHovered ? 1 : 0};
                                transform: translateX({isRootHovered ? '0' : '-0.5rem'});
                                color: {rootColor};
                            "
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</button>

					<!-- Divider -->
					<div class="my-3 flex items-center gap-2 px-2">
						<div
							class="h-px flex-1"
							style="background: linear-gradient(to right, {rootColor}60, transparent)"
						></div>
						<span class="text-muted-foreground text-xs">Connected</span>
						<div
							class="h-px flex-1"
							style="background: linear-gradient(to left, {rootColor}60, transparent)"
						></div>
					</div>

					<!-- Children list with tree lines -->
					<div class="relative flex-1 overflow-y-auto">
						<!-- Vertical tree line -->
						<div
							class="absolute top-0 left-6 w-0.5 rounded-full transition-all duration-300"
							style="
                                background: linear-gradient(to bottom, {rootColor}60, {rootColor}20);
                                height: {children.length * 48 - 24}px;
                            "
						></div>

						<!-- Child nodes -->
						<div class="flex flex-col gap-1">
							{#each children as child (child.id)}
								{@const childColor = categoryColors[child.category]}
								{@const isHovered = hoveredTreeNode === child.id}

								<button
									class="group relative flex w-full items-center gap-3 rounded-lg py-2 pr-3 pl-4 text-left transition-all duration-200"
									style="background-color: {isHovered
										? 'rgba(255, 255, 255, 0.05)'
										: 'transparent'};"
									onmouseenter={() => (hoveredTreeNode = child.id)}
									onmouseleave={() => (hoveredTreeNode = null)}
									onclick={() => window.open(child.href, '_blank')}
								>
									<!-- Horizontal branch line -->
									<div
										class="absolute left-6 h-0.5 w-4 rounded-full transition-all duration-200"
										style="background-color: {isHovered ? childColor : rootColor}40;"
									></div>

									<!-- Node dot on the line -->
									<div
										class="absolute left-5 h-2.5 w-2.5 rounded-full border-2 bg-background transition-all duration-200"
										style="
                                            border-color: {isHovered ? childColor : rootColor}80;
                                            box-shadow: {isHovered
											? `0 0 8px ${childColor}60`
											: 'none'};
                                        "
									></div>

									<div
										class="ml-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200"
										style="
                                            border-color: {isHovered
											? childColor
											: 'var(--elevation-one)'};
                                            background-color: {isHovered
											? childColor + '10'
											: 'var(--background)'};
                                            box-shadow: {isHovered
											? `0 0 12px ${childColor}30`
											: 'none'};
                                        "
									>
										<child.icon
											class="h-4 w-4 transition-colors duration-200"
											style="color: {isHovered ? childColor : 'var(--foreground)'}"
										/>
									</div>

									<div class="flex min-w-0 flex-1 flex-col">
										<span
											class="truncate text-sm transition-all duration-200"
											style="
                                                color: {isHovered
												? childColor
												: 'var(--foreground)'};
                                                font-weight: {isHovered ? 500 : 400};
                                            "
										>
											{child.label}
										</span>
										<span
											class="text-xs transition-opacity duration-200"
											style="
                                                opacity: {isHovered ? 1 : 0};
                                                color: {childColor}80;
                                            "
										>
											{child.category}
										</span>
									</div>

									<svg
										class="h-3.5 w-3.5 shrink-0 transition-all duration-200"
										style="
                                            opacity: {isHovered ? 1 : 0};
                                            transform: translateX({isHovered ? '0' : '-0.5rem'});
                                            color: {childColor};
                                        "
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
										/>
									</svg>
								</button>
							{/each}
						</div>
					</div>

					<!-- Footer hint -->
					<div class="mt-auto border-t border-elevation-one pt-3">
						<p class="text-muted-foreground text-center text-xs">
							Click to visit • Click outside to close
						</p>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Background graph nodes -->
	{#each nodes as node (node.id)}
		{@const Icon = node.icon}
		{@const state = getNodeState(node.id)}
		{@const isActive = state === 'active'}
		{@const isRelated = state === 'related'}
		{@const isUnrelated = state === 'unrelated'}
		{@const isDragging = draggedNode === node.id}
		{@const isInTree = getTreeSet().has(node.id)}

		{#if !isInTree}
			<button
				class="absolute flex flex-col items-center gap-1 transition-all duration-300 ease-out will-change-transform"
				style="
			left: {node.x}px; 
			top: {node.y}px; 
			z-index: {isActive || isDragging ? 50 : isRelated ? 40 : 1};
			transform: translate(-50%, -50%) scale({isActive
					? 1.15
					: isRelated
						? 1.05
						: isUnrelated
							? 0.9
							: 1});
			cursor: {isDragging ? 'grabbing' : 'grab'};
		"
				onmouseenter={() => (hoveredNode = node.id)}
				onmouseleave={() => (hoveredNode = null)}
				onmousedown={(e) => handleNodeMouseDown(node.id, e)}
				onclick={(e) => handleNodeClick(node.id, node.href, e)}
				ondblclick={(e) => handleDoubleClick(node.id, node.href, e)}
			>
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl border-2 bg-background transition-all duration-200"
					style="
				border-color: {isActive || isRelated ? categoryColors[node.category] : 'var(--elevation-one)'};
				box-shadow: {isActive
						? `0 0 0 3px ${categoryColors[node.category]}40, 0 4px 20px ${categoryColors[node.category]}50`
						: isRelated
							? `0 4px 12px ${categoryColors[node.category]}30`
							: 'none'};
				opacity: {isUnrelated ? 0.3 : 1};
				filter: {isUnrelated ? 'blur(1px) grayscale(1)' : 'none'};
			"
				>
					<Icon
						class="h-6 w-6 transition-colors duration-200"
						style="color: {isActive || isRelated
							? categoryColors[node.category]
							: 'var(--foreground)'}"
					/>
				</div>
				<span
					class="rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap backdrop-blur-sm transition-all duration-200"
					style="
				color: {isActive || isRelated ? categoryColors[node.category] : 'var(--foreground)'};
				background-color: rgba(var(--background, 0, 0, 0), 0.9);
				opacity: {isUnrelated ? 0.4 : 1};
			"
				>
					{node.label}
				</span>
			</button>
		{/if}
	{/each}

	<!-- Legend -->
	<div
		class="absolute bottom-4 left-4 flex flex-wrap gap-3 rounded-lg border border-elevation-one p-2 backdrop-blur-sm transition-opacity duration-300"
		style="
        opacity: {selectedNode ? 0.2 : 1};
        background-color: rgba(var(--background, 0, 0, 0), 0.9);
    "
	>
		{#each hardSkills as category (category.key)}
			<div class="flex items-center gap-1.5">
				<span class="h-3 w-3 rounded-full" style="background-color: {categoryColors[category.key]}"
				></span>
				<span class="text-xs font-medium">{category.key}</span>
			</div>
		{/each}
	</div>

	<!-- Instructions -->
	<div
		class="text-muted-foreground absolute top-4 left-4 z-50 rounded-lg border border-elevation-one px-3 py-1.5 text-xs backdrop-blur-sm"
		style="background-color: rgba(var(--background, 0, 0, 0), 0.9);"
	>
		Drag nodes • Click to select • Double-click to visit
	</div>
</div>
