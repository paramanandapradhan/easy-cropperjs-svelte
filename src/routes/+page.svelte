<script lang="ts">
	import { browser } from '$app/environment';
	import EasyCropperjs from '../lib/easy-cropperjs.svelte';
	import { onMount } from 'svelte';

	let image: HTMLImageElement;
	let easyCropperjsRef: EasyCropperjs;
	let clientWidth: number = 0;

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
	<div bind:clientWidth>
		<EasyCropperjs
			bind:this={easyCropperjsRef}
			width={clientWidth}
			height={400}
			{image}
			on:result={handleResult}
		/>
	</div>
	<button on:click={handleCrop} style="margin-top:16px;">Crop</button>
</div>

<style>
</style>
