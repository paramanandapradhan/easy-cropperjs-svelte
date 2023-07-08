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
	export let cropperjsUrl: string = 'https://unpkg.com/cropperjs@2.0.0-beta.2/dist/cropper.min.js';

	export let cropper: any = null;
	export let cropperCanvas: any = null;
	export let cropperSelection: any = null;
	export let cropperImage: any = null;
	export let cropperHandle: any = null;
	export let cropperShade: any = null;

	let cropperRef: HTMLDivElement;
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
				container: cropperRef
			});
			cropperCanvas = cropper.getCropperCanvas();
			cropperSelection = cropper.getCropperSelection();
			cropperImage = cropper.getCropperImage();
			cropperHandle = cropper.container.querySelector('cropper-handle');
			cropperShade = cropper.container.querySelector('cropper-shade');
			updateCropper();
			dispatch('cropper', cropper);
		}
	}

	function updateCropper(..._: any) {
		// console.log('updateCropper', aspectRatio, cropperCanvas);
		let selectionSize = 0.8;
		aspectRatio = aspectRatio || 0;
		if (cropperCanvas) {
			cropperCanvas.style.width = `${width}px`;
			cropperCanvas.style.height = `${height}px`;
		}

		if (cropperSelection) {
			cropperSelection.initialCoverage = selectionSize;
			if (aspectRatio) {
				cropperSelection.initialAspectRatio = aspectRatio || 0;
				cropperSelection.aspectRatio = aspectRatio || 0;
			}
			cropperSelection.$render();
			if (aspectRatio > 1) {
				cropperSelection.width = width * selectionSize;
			} else if (aspectRatio > 0) {
				cropperSelection.width = height * 0.8 * aspectRatio;
				cropperSelection.y = height / 2 - cropperSelection.height / 2;
			} else {
				cropperSelection.width = width * 0.8;
				cropperSelection.height = height * 0.8;
			}
		}

		if (cropperSelection) {
			cropperSelection.$center();
			cropperSelection.y = height / 2 - cropperSelection.height / 2;
			cropperSelection.$center();
			cropperSelection.$render();
		}
		if (cropperShade) {
			cropperShade.y = height / 2 - cropperSelection.height / 2;
			cropperShade.$render();
		}
		if (cropperHandle) {
			cropperHandle.action = 'none';
		}

		if (cropperImage) {
			cropperImage.style.width = `${width}px`;
			cropperImage.style.height = `${height}px`;
			cropperImage.$center('contain');
		}
	}

	onMount(() => {
		if (BROWSER) {
			watchWindowValue('Cropper').then((Cropper: any) => {
				dispatch('load', Cropper);
				init();
			});
		}
	});

	$: updateCropper(width, height);
</script>

<svelte:head>
	{#if BROWSER && !window['Cropper'] && cropperjsUrl}
		<script src={cropperjsUrl} type="text/javascript"></script>
	{/if}
</svelte:head>

<div bind:this={cropperRef} class="cropper-container" style="width:{width}px; height:{height}px;" />

<style>
</style>
