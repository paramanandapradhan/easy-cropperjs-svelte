<script lang="ts">
	import EasyCropperjs from '../lib/easy-cropperjs.svelte';

	let easyCropperjsRef: EasyCropperjs | null = $state(null);

	let clientWidth: number = $state(0);
	let file: File | null = $state(null);

	async function handleCrop() {
		let data = await easyCropperjsRef?.crop({
			outputWidth: 300,
			outputFormat: 'webp',
			outputQuality: 0.6,
			outputType: 'file'
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

	async function init() {
		file = await getFile('/sky-1.webp');
	}

	$effect(() => {
		init();
	});
</script>

<div>
	<h1>Easy Cropperjs Svelte Demo</h1>
	<div style="height: 500px;">
		{#if file}
			<EasyCropperjs
				bind:this={easyCropperjsRef}
				outputAspectRatio={1}
				{file}
				onCrop={handleCropResult}
			/>
		{/if}
	</div>
	<button onclick={handleCrop} style="margin-top:16px;">Crop</button>
</div>
