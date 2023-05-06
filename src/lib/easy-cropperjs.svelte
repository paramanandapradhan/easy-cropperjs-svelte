<script lang="ts" context="module">
	declare var window: any;
</script>

<script lang="ts">
	import { browser } from '$app/environment';
</script>

<svelte:head>
	{#if browser && !window['Cropper']}
		<script src="https://unpkg.com/cropperjs@next"></script>
	{/if}
</svelte:head>

<div >
</div>
