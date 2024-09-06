<script lang="ts">
	import EasyScriptLoader from '@cloudparker/easy-script-loader-svelte';

	type PropsType = {
		outputAspectRatio?: number;
		cropperjsStyleUrl?: string;
		cropperjsUrl?: string;
		file?: File | null;
		onReady?: (cropper: any) => void;
		onCrop?: (result: any) => void;
	};

	let {
		outputAspectRatio = 0,
		cropperjsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js',
		cropperjsStyleUrl = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css',
		file,
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
		outputWidth,
		outputFormat = 'png',
		outputQuality = 1,
		outputType
	}: {
		outputWidth?: number;
		outputFormat?: 'png' | 'jpeg' | 'webp';
		outputQuality?: number;
		outputType?: 'file' | 'base64';
	}) {
		let result: Blob | String | null = null;
		if (cropper) {
			let canvas: HTMLCanvasElement = await cropper.getCroppedCanvas({ width: outputWidth });
			if (canvas) {
				let outmime = mimetypes[outputFormat] || 'image/png';
				if (outputType === 'file') {
					let [filename] = getFileNameAndExt(file?.name);
					result = await new Promise((resolve) => {
						canvas.toBlob(
							(blobData) => {
								if (blobData && file?.name) {
									let newFile = new File([blobData], `${filename}.${outputFormat}`, {
										type: outmime
									});
									resolve(newFile);
								} else {
									resolve(null);
								}
							},
							outmime,
							outputQuality || 1
						);
					});
				} else {
					result = canvas.toDataURL(outmime, outputQuality || 1);
				}
			}
		}
		if (result) {
			onCrop && onCrop(result);
		}
		return result;
	}

	function getFileNameAndExt(name?: string) {
		if (name) {
			const lastDotIndex = name.lastIndexOf('.');
			if (lastDotIndex === -1) {
				return [name, ''];
			}
			const fileName = name.substring(0, lastDotIndex);
			const extension = name.substring(lastDotIndex + 1);
			return [fileName, extension];
		}
		return ['', ''];
	}

	function handleCropperLoad(lib: any) {
		Cropper = lib;
	}

	function initCropper() {
		if (Cropper && imgRef && base64ImageUrl) {
			cropper = new Cropper(imgRef, {
				aspectRatio: outputAspectRatio,
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
<div class="cropper-container">
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
	.cropper-container img {
		display: block;
		max-width: 100%;
	}
	.cropper-container {
		width: 100%;
		height: 100%;
	}
</style>
