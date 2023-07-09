<!-- 
https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css
https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js
 -->
<script lang="ts">
	import EasyScriptLoader from '@cloudparker/easy-script-loader-svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	export let cropperjsUrl: string =
		'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js';
	export let cropperjsStyleUrl: string =
		'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css';

	export let width: number;
	export let height: number;
	export let file: File;
	export let aspectRatio: number = 0;

	let dispatch = createEventDispatcher();
	let base64ImageUrl: string;

	let cropperContainerRef: HTMLDivElement;
	let imgRef: HTMLImageElement;
	let Cropper: any;
	let cropper: any;

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
		if (cropper) {
			let canvas: HTMLCanvasElement = await cropper.getCroppedCanvas({ width, height });
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

	function handleCropperLoad(ev: CustomEvent) {
		Cropper = ev.detail;
		initCropper();
	}

	function initCropper() {
		if (Cropper && imgRef && base64ImageUrl && !cropper) {
			cropper = new Cropper(imgRef, {
				aspectRatio,
				dragMode: 'move'
			});
		}
	}

	async function prepareBase64Url(..._: any) {
		if (file) {
			base64ImageUrl = await fileToDataURL(file);
		} else {
			base64ImageUrl = '';
		}
		initCropper();
	}

	async function fileToDataURL(file: File): Promise<string> {
		return new Promise((resolve) => {
			var reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.readAsDataURL(file);
		});
	}

	onMount(() => {
		initCropper();
	});

	$: prepareBase64Url(file);
</script>

<EasyScriptLoader
	scriptUrl={cropperjsUrl}
	styleUrl={cropperjsStyleUrl}
	scriptName="Cropper"
	on:load={handleCropperLoad}
/>
<div style="width:{width}px;height:{height}px;">
	<!-- svelte-ignore a11y-img-redundant-alt -->
	<img bind:this={imgRef} src={base64ImageUrl || ''} alt="Image" id="cropper-image" />
</div>

<style>
	img {
		display: block;
		max-width: 100%;
	}
</style>
