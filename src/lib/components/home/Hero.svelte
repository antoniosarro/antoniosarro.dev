<script lang="ts">
	import { OptimizedImage } from '$lib/components/shared';

	let zoom = $state(false);
	let rotationX = $state(0);
	let rotationY = $state(0);

	function onMouseEnter(e: MouseEvent) {
		zoom = true;
		let img = e.target as HTMLImageElement;
		rotationY = 13 * ((e.offsetX - img.clientHeight / 2) / img.clientWidth);
		rotationX = -13 * ((e.offsetY - img.clientWidth / 2) / img.clientHeight);
	}

	function onMouseLeave() {
		zoom = false;
		rotationY = 0;
		rotationX = 0;
	}
</script>

<div class="profile-container z-10 hidden xl:block">
	<div
		class="w-[22rem] min-w-[14rem] overflow-hidden rounded-[48px]"
		style:transform="perspective(500px) {zoom ? 'scale(1.05)' : ''} rotateX({rotationX}deg) rotateY({rotationY}deg)"
		role="img"
		aria-label="Profile picture"
		onmousemove={onMouseEnter}
		onmouseleave={onMouseLeave}
	>
		<OptimizedImage
			src="/images/misc/profile.webp"
			alt="Antonio Sarro profile picture"
			class="size-full object-cover"
			eager={true}
		/>
	</div>
</div>

<style>
	.profile-container {
		> div {
			transition:
				width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
				transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		}
	}
</style>
