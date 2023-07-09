<script lang="ts">
	import { browser } from '$app/environment';
	import EasyCropperjs from '../lib/easy-cropperjs.svelte';
	import { onMount } from 'svelte';

	let easyCropperjsRef: EasyCropperjs;
	let clientWidth: number = 0;
	let file: File;

	async function handleCrop() {
		let data = await easyCropperjsRef.crop({
			width: 300,
			format: 'png',
			quality: 0.6,
			blob: true
		});
		console.log('crop', data);
	}

	function handleCropResult(ev: CustomEvent) {
		let base64ImageUrl: string = ev.detail;
		// Use base64ImageUrl
	}

	async function getFile(url: string) {
		var fileName = url.split('/').pop() || 'file.png';
		let blob = await (await fetch(url)).blob();
		var file = new File([blob], fileName, { type: blob.type });
		return file;
	}

	onMount(async () => {
		if (browser) {
			file = await getFile('/sky-1.webp');
		}
	});
</script>

<div>
	<h1>Easy Cropperjs Svelte Demo</h1>
	<div bind:clientWidth>
		<EasyCropperjs
			bind:this={easyCropperjsRef}
			width={clientWidth}
			height={600}
			aspectRatio={1}
			{file}
			on:crop={handleCropResult}
		/>
	</div>
	<button on:click={handleCrop} style="margin-top:16px;">Crop</button>
</div>

<style>
</style>
