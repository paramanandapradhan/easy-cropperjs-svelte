# easy-cropperjs-svelte
Use cropper js in svelte through CDN cropperjs library.

# Install 
```sh
npm i @cloudparker/easy-cropperjs-svelte --save-dev
```

# Screenshot

<img src="https://raw.githubusercontent.com/paramanandapradhan/easy-cropperjs-svelte/main/static/screenshot.webp" width="300" alt="Picture">

# Usage
```ts
<script lang="ts">
	import { BROWSER } from 'esm-env';
	import EasyCropperjs from '@cloudparker/easy-cropperjs-svelte';
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
		if (BROWSER) {
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
            aspectRatio={9/16}
			{image}
			on:result={handleResult}
		/>
	</div>
	<button on:click={handleCrop}>Crop</button>
</div>


```
