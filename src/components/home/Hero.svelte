<script lang="ts">
	import profile from '$lib/assets/profile.png';

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

<div class="profile-container z-10 hidden lg:block">
	<img
		onmousemove={onMouseEnter}
		onmouseleave={onMouseLeave}
		src={profile}
		alt="profile pic"
		class="w-[22rem] min-w-[14rem] rounded-[48px]"
		style:transform="perspective(500px) {zoom ? 'scale(1.05)' : ''} rotateX({rotationX}deg) rotateY({rotationY}deg)"
	/>
</div>

<style>
	.profile-container {
		img {
			transition:
				width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
				transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		}
	}
</style>
