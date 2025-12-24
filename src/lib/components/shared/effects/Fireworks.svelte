<!-- Fireworks.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		debug?: boolean;
	}

	let { debug = false }: Props = $props();

	let canvas: HTMLCanvasElement | null = $state(null);
	let shouldRender = $state(false);

	interface ParticleConfig {
		x: number;
		y: number;
		color: string;
	}

	class Particle {
		x: number;
		y: number;
		color: string;
		vx: number;
		vy: number;
		alpha: number;
		decay: number;
		size: number;

		constructor({ x, y, color }: ParticleConfig) {
			this.x = x;
			this.y = y;
			this.color = color;
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 3 + 1;
			this.vx = Math.cos(angle) * speed;
			this.vy = Math.sin(angle) * speed;
			this.alpha = 1;
			this.decay = Math.random() * 0.015 + 0.01;
			this.size = Math.random() * 2 + 1;
		}

		update(): void {
			this.x += this.vx;
			this.y += this.vy;
			this.vy += 0.03;
			this.alpha -= this.decay;
		}

		draw(ctx: CanvasRenderingContext2D): void {
			ctx.save();
			ctx.globalAlpha = this.alpha;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}

	class Firework {
		x: number;
		y: number;
		targetY: number;
		speed: number;
		particles: Particle[];
		exploded: boolean;
		color: string;

		private static readonly COLORS: readonly string[] = [
			'#ff6b6b',
			'#ffd93d',
			'#6bcb77',
			'#4d96ff',
			'#ff85a1',
			'#ffc75f',
			'#845ec2',
			'#00c9a7'
		] as const;

		constructor(canvasWidth: number, canvasHeight: number) {
			this.x = Math.random() * canvasWidth * 0.8 + canvasWidth * 0.1;
			this.y = canvasHeight;
			this.targetY = Math.random() * canvasHeight * 0.4 + canvasHeight * 0.1;
			this.speed = Math.random() * 2 + 3;
			this.particles = [];
			this.exploded = false;
			this.color = Firework.COLORS[Math.floor(Math.random() * Firework.COLORS.length)];
		}

		update(): void {
			if (!this.exploded) {
				this.y -= this.speed;
				if (this.y <= this.targetY) {
					this.explode();
				}
			}

			this.particles = this.particles.filter((p) => p.alpha > 0);
			this.particles.forEach((p) => p.update());
		}

		private explode(): void {
			this.exploded = true;
			const particleCount = Math.floor(Math.random() * 30) + 40;
			for (let i = 0; i < particleCount; i++) {
				this.particles.push(
					new Particle({
						x: this.x,
						y: this.y,
						color: this.color
					})
				);
			}
		}

		draw(ctx: CanvasRenderingContext2D): void {
			if (!this.exploded) {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
				ctx.fill();
			}
			this.particles.forEach((p) => p.draw(ctx));
		}

		isDead(): boolean {
			return this.exploded && this.particles.length === 0;
		}
	}

	onMount(() => {
		const today = new Date();
		const isNewYearsDay = today.getMonth() === 0 && today.getDate() === 1;

		shouldRender = debug || isNewYearsDay;
	});

	$effect(() => {
		if (!shouldRender || !canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let fireworks: Firework[] = [];
		let animationId: number;
		let lastLaunch = 0;

		const resize = (): void => {
			if (!canvas) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resize();
		window.addEventListener('resize', resize);

		const animate = (timestamp: number): void => {
			if (!canvas || !ctx) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (timestamp - lastLaunch > Math.random() * 700 + 800) {
				if (fireworks.length < 4) {
					fireworks.push(new Firework(canvas.width, canvas.height));
				}
				lastLaunch = timestamp;
			}

			fireworks = fireworks.filter((f) => !f.isDead());
			fireworks.forEach((f) => {
				f.update();
				f.draw(ctx);
			});

			animationId = requestAnimationFrame(animate);
		};

		animationId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

{#if shouldRender}
	<div class="pointer-events-none fixed inset-0 z-50">
		<canvas bind:this={canvas} class="h-full w-full"></canvas>
	</div>
{/if}