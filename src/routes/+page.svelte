<script lang="ts">
	import { browser } from '$app/environment';
	import EasyCropperjs from '$lib';
	import { onMount } from 'svelte';

	let image: HTMLImageElement;
	let easyCropperjsRef: EasyCropperjs;

	function handleCrop() {
		easyCropperjsRef.crop({ width: 300, format: 'png', quality: 0.8, blob: false });
	}

	function handleResult(ev: CustomEvent) {
		let base64ImageUrl: string = ev.detail;
		// User base64ImageUrl
	}

	onMount(() => {
		if (browser) {
			image = new Image();
			image.src = '/wallpaper.jpg';
			image.alt = 'Picture';
		}
	});
</script>

<div>
	<h1>Easy Cropperjs Svelte Demo</h1>
	<div>
		<EasyCropperjs
			bind:this={easyCropperjsRef}
			width={500}
			height={400}
			{image}
			on:result={handleResult}
		/>
	</div>
	<button on:click={handleCrop}>Crop</button>
</div>
