<script lang="ts">
	import { goto } from '$app/navigation';
	import Translation from './Translation.svelte';
	import Spinner from '$lib/assets/spinner.png';

	export let name: string;
	export let pictureUrl: string;
	export let season: string;
	export let slug: string;
	export let cardsMintedCount: string = '';

	const isCommon: boolean = slug.includes('common');
</script>

<div class="card card-side bg-base-100 shadow-xl w-full">
	<figure><img src={pictureUrl} loading="lazy" class="lg:h-52 h-40" alt="Movie" /></figure>
	<div class="card-body">
		<h2 class="card-title">
			{name}
			{#if isCommon}
				<div class="badge badge-primary"><Translation id="common" /></div>
			{:else}
				<div class="badge bg-slate-400 text-black"><Translation id="platinum" /></div>
			{/if}
		</h2>
		<div>
			Saison {season}
			{#if cardsMintedCount !== ''}
				{#if isCommon}
					<p><Translation id="last_obtained" />: #{cardsMintedCount}</p>
				{:else}
					<p>{cardsMintedCount} <Translation id="already_obtained" />!</p>
				{/if}
			{:else}
				<img src={Spinner} class="animate-spin h-8 mt-1" alt="Loading..." />
			{/if}
		</div>
		<div class="card-actions justify-end">
			<button class="btn btn-primary" on:click={() => goto(`/${slug}/search`)}
				><Translation id="view" /></button
			>
		</div>
	</div>
</div>
