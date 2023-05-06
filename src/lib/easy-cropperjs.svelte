<script lang="ts" context="module">
	declare var window: any;
	declare var Cropper: any;
</script>

<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { createEventDispatcher, onMount } from 'svelte';
	import watchWindowValue from '@cloudparker/easy-window-watcher';

	export let height: number;
	export let width: number;
	export let image: HTMLImageElement;
	export let aspectRatio: number = 0;
	export let cropperUrl: string = 'https://unpkg.com/cropperjs@2.0.0-beta.2/dist/cropper.min.js';

	let cropper: any;
	let cropperCanvas: any;
	let cropperSelection: any;
	let dispatch = createEventDispatcher();
	let mimetypes = {
		png: 'image/png',
		jpeg: 'image/jpeg',
		webp: 'image/webp'
	};

	export async function crop({
		width,
		height,
		format = 'png',
		quality = 1,
		blob = false
	}: {
		width?: number;
		height?: number;
		format?: 'png' | 'jpeg' | 'webp';
		quality?: number;
		blob?: boolean;
	}) {
		let result: Blob | String | null = null;
		if (cropperSelection) {
			let canvas: HTMLCanvasElement = await cropperSelection.$toCanvas({ width, height });
			if (canvas) {
				if (blob) {
					result = await new Promise((resolve) => {
						canvas.toBlob(
							(blobData) => {
								resolve(blobData);
							},
							mimetypes[format] || 'image/png',
							quality || 1
						);
					});
				} else {
					result = canvas.toDataURL(mimetypes[format] || 'image/png', quality || 1);
				}
			}
		}
		if (result) {
			dispatch('crop', result);
		}
		return result;
	}

	function init() {
		if (Cropper) {
			cropper = new Cropper.default(image, {
				container: '.cropper-container'
			});
			cropperCanvas = cropper.getCropperCanvas();
			cropperSelection = cropper.getCropperSelection();
			updateCropper();

			dispatch('cropper', cropper);
		}
	}

	function updateCropper(..._: any) {
		console.log(cropperCanvas);

		if (cropperCanvas) {
			cropperCanvas.style.width = `${width}px`;
			cropperCanvas.style.height = `${height}px`;
		}
		if (cropperSelection) {
			if (aspectRatio) {
				cropperSelection.initialAspectRatio = aspectRatio;
				cropperSelection.aspectRatio = aspectRatio;
			}

			cropperSelection.$center();
		}
	}

	onMount(() => {
		if (BROWSER) {
			watchWindowValue('Cropper').then((Cropper: any) => {
				console.log(Cropper);
				init();
			});
		}
	});

	$: updateCropper(width, height);
</script>

<svelte:head>
	{#if BROWSER && !window['Cropper']}
		<script src={cropperUrl} type="text/javascript"></script>
	{/if}
</svelte:head>

<div class="cropper-container" style="width:{width}px; height:{height}px;" />

<style>
	.cropper-container {
	}
</style>
