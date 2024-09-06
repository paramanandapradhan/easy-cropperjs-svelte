<script lang="ts">
	import EasyScriptLoader from '@cloudparker/easy-script-loader-svelte';

	type PropsType = {
		aspectRatio?: number;
		cropperjsStyleUrl?: string;
		cropperjsUrl?: string;
		file?: File | null;
		height?: number;
		width?: number;
		onReady?: (cropper: any) => void;
		onCrop?: (result: any) => void;
	};

	let {
		aspectRatio = 0,
		cropperjsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js',
		cropperjsStyleUrl = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css',
		file,
		height,
		width,
		onReady,
		onCrop
	}: PropsType = $props();

	let imgRef: HTMLImageElement | null = $state(null);
	let Cropper: any = $state(null);
	let cropper: any = $state(null);

	let base64ImageUrl: string = $state('');

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
			onCrop && onCrop(result);
		}
		return result;
	}

	function handleCropperLoad(lib: any) {
		Cropper = lib;
	}

	function initCropper() {
		if (Cropper && imgRef && base64ImageUrl) {
			cropper = new Cropper(imgRef, {
				aspectRatio,
				dragMode: 'move',
				ready: () => {
					onReady && onReady(cropper);
				}
			});
		}
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

	function handleImageLoad() {
		initCropper();
	}

	async function preppareBase64() {
		if (file && !base64ImageUrl) {
			base64ImageUrl = await fileToDataURL(file);
		}
	}

	$effect(() => {
		return () => {
			cropper && cropper.destroy();
		};
	});

	$effect(() => {
		if (file && !base64ImageUrl) {
			preppareBase64();
		}
	});
</script>

<EasyScriptLoader
	scriptUrl={cropperjsUrl}
	styleUrl={cropperjsStyleUrl}
	scriptName="Cropper"
	onLoad={handleCropperLoad}
/>
<div style="width:100%;height:100%;">
	{#if base64ImageUrl && Cropper}
		<img
			bind:this={imgRef}
			src={base64ImageUrl}
			onload={handleImageLoad}
			alt="CropableResource"
			id="cropper-image"
		/>
	{/if}
</div>

<style>
	img {
		display: block;
		max-width: 100%;
	}
</style>
