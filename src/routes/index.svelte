<script lang="ts">
	import { dev } from '$app/env';
	import { onMount } from 'svelte';
	import { allCards } from '$lib/store/utils';
	import Translation from '$lib/components/Translation.svelte';
	import Card from '$lib/components/Card.svelte';
	import { slide, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import Spinner from '$lib/assets/spinner.png';

	let loading: boolean = true;
	let clipboardCopied: boolean = false;
	let query: string = '';
	let shownCards: any[] = [];
	let history: any[] = [];

	let searchByCard: boolean = true;
	let validatedDigit: boolean = false;
	let hideNoDataCards: boolean = false;
	let filters: string = 'Filters';
	let allRulesCards: any[] = [];

	let commonCheck: boolean = true;
	let platinumCheck: boolean = true;
	let halloweenCheck: boolean = true;

	function onQuery() {
		if (query === '') {
			shownCards = $allCards;
			OnCheck();
			return;
		}

		if (!searchByCard) {
			validatedDigit = false;
		} else {
			shownCards = $allCards.filter((card) => {
				return (
					Format(card.artist.displayName).includes(Format(query)) 
					&& ((commonCheck && card.slug.includes('common'))
					|| (platinumCheck && card.slug.includes('platinium'))
					|| (halloweenCheck && card.slug.includes('halloween')))
				);
			});
		}
	}

	function OnSearchByDigit() {
		if (query === '') {
			allRulesCards = [];
			return;
		}

		// Check if query is a number
		if (!isNaN(parseInt(query))) {
			if ($allCards) {
				validatedDigit = true;
				allRulesCards = [];
				$allCards.forEach((card) => {
					fetch(`${dev ? 'http://localhost:3000' : ''}/api/card_infos/${card.slug}/${query}`)
						.then((res) => res.json())
						.then((data) => {
							const obj = Object.assign(data, {
								name: `${card.artist.displayName} #${query}`,
								slug: card.slug,
								found: true
							});
							allRulesCards = [obj].concat(allRulesCards);
						})
						.catch((err) => {
							const obj = {
								name: `${card.artist.displayName} #${query}`,
								slug: card.slug,
								found: false
							};
							allRulesCards = [...allRulesCards, obj];
						});
				});
			}
		}
	}

	function FormatSale(str: string){
		const price = parseInt(str);
		return (price / 1000000000000000000).toFixed(6);
	}

	function FormatPrice(str: string){
		// Hexa to decimal
		const price = parseInt(str, 16);

		// Wei to ETH
		return (price / 1000000000000000000).toFixed(6);
	}

	function OnCheck() {
		if (!commonCheck && !platinumCheck && !halloweenCheck)
		{
			shownCards = [];
		}
		else
		{
			shownCards = $allCards.filter((card) => {
				return (
					Format(card.artist.displayName).includes(Format(query)) 
					&& ((commonCheck && card.slug.includes('common'))
					|| (platinumCheck && card.slug.includes('platinium'))
					|| (halloweenCheck && card.slug.includes('halloween')))
				);
			});
		}
	}

	// Only in serch by digit
	function OnFilters(){
		if (filters == 'None')
		{

		}
		else if (filters == 'Card')
		{
			// Sort by slug
			allRulesCards = allRulesCards.sort((a, b) => {
				if (a.slug < b.slug) {
					return -1;
				}
				if (a.slug > b.slug) {
					return 1;
				}
				return 0;
			});
		}
		else
		{
			// Sort by slug
			allRulesCards = allRulesCards.sort((a, b) => {
				const aSlug = a.slug.split('-').pop();
				const bSlug = b.slug.split('-').pop();
				if (aSlug < bSlug) {
					return -1;
				}
				if (aSlug > bSlug) {
					return 1;
				}
				return 0;
			});
		}
	}

	$: commonCheck, platinumCheck, halloweenCheck, OnCheck();
	$: filters, OnFilters();

	function Format(str: string) {
		// Remove spaces
		str = str.replace(/\s/g, '');

		// Remove accents
		str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

		return str.toLowerCase();
	}

	onMount(() => {
		if ($allCards.length == 0) {
			console.log('Fetching cards...');
			fetch(`${dev ? 'http://localhost:3000' : ''}/api/cards`)
				.then((res) => res.json())
				.then((data) => {
					allCards.set(data);
					shownCards = data;
					loading = false;
				});
		} else {
			console.log('Cards already fetched.');
			loading = false;
			shownCards = $allCards;
		}
		history = JSON.parse(localStorage.getItem('history') || '[]');
	});
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><Translation id="home" /></li>
	</ul>
</div>
<div>
	<a class="text-primary hover:underline" href="https://rules.art" target="_blank"
		>Rules</a
	>
	<Translation id="description" />
	(s/o
	<a class="text-primary hover:underline" href="https://github.com/0xChqrles" target="_blank"
		>Chqrles</a
	>)
	<Translation id="by" />
	<a class="text-primary hover:underline" href="https://quentinam.fr" target="_blank"
		>QuentinAM</a
	>
</div>
{#if loading}
	<img src={Spinner} class="animate-spin h-20" alt="Loading..." />
	<h1><Translation id="loading" /></h1>
{:else}
	<div class="form-control w-full">
		<label class="label">
			<span class="label-text"><Translation id="search" /></span>
			<input class="hidden" />
		</label>
		<div class="form-control w-full">
			<div class="input-group">
				<input
					bind:value={query}
					on:input={onQuery}
					on:keydown={(e) => {
						if (e.key === 'Enter' && !searchByCard) {
							OnSearchByDigit();
						}
					}}
					placeholder="..."
					type="text"
					class="input input-primary w-full"
				/>
				{#if searchByCard}
					<select class="select select-primary">
						<option disabled selected>Historique</option>
						{#each history.reverse() as h}
							<option on:click={() => goto(`${h.link}`)}>{h.name}</option>
						{/each}
					</select>
				{:else}
					<button
						on:click={OnSearchByDigit}
						disabled={validatedDigit}
						class="btn btn-success border border-primary"
						><Translation id="validate" />&nbsp;<i class="fa-solid fa-check" /></button
					>
				{/if}
			</div>
		</div>
	</div>
	<div class="flex lg:flex-row flex-col space-x-2 w-full">
		<div class="form-control space-x-2">
			<label class="label cursor-pointer">
				<span class="label-text"><Translation id="common" />&nbsp;</span>
				<input type="checkbox" bind:checked={commonCheck} class="checkbox checkbox-primary" />
			</label>
		</div>
		<div class="form-control space-x-2 ">
			<label class="label cursor-pointer">
				<span class="label-text"><Translation id="platinum" />&nbsp;</span>
				<input type="checkbox" bind:checked={platinumCheck} class="checkbox" />
			</label>
		</div>
		<div class="form-control space-x-2 ">
			<label class="label cursor-pointer">
				<span class="label-text">Halloween&nbsp;</span>
				<input type="checkbox" bind:checked={halloweenCheck} class="checkbox checkbox-warning" />
			</label>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer">
				<span class="label-text"
					><Translation id="search_by" />
					<span class:font-semibold={!searchByCard}><Translation id="number" /></span>/<span
						class:font-semibold={searchByCard}><Translation id="card" /></span
					>&nbsp;</span
				>
				<input type="checkbox" bind:checked={searchByCard} class="toggle" />
			</label>
		</div>
		{#if !searchByCard}
			<div class="form-control" transition:scale>
				<label class="label cursor-pointer">
					<span class="label-text"><Translation id="hide" />&nbsp;</span>
					<input type="checkbox" bind:checked={hideNoDataCards} class="checkbox" />
				</label>
			</div>
			<select bind:value={filters} class="select w-full max-w-xs">
				<option value="Filters" disabled selected>Filtres</option>
				<option value="Scarcity">Rareté</option>
				<option value="Card">Carte</option>
			</select>
		{/if}
	</div>
	{#if searchByCard}
		<div class="w-full space-y-3" transition:slide>
			{#each shownCards as card}
				<Card
					name={card.artist.displayName}
					pictureUrl={card.pictureUrl}
					season={card.season}
					slug={card.slug}
					cardsMintedCount={card.cardsMintedCount}
					cardsOnSaleCount={card.cardsOnSaleCount}
					lowestAsk={FormatPrice(card.lowestAsk)}
					averageSale={FormatSale(card.averageSale)}
					maxSupply={card.scarcity.maxSupply}
				/>
			{/each}
		</div>
	{:else}
		<div class="w-full overflow-x-auto">
			<table class="table w-full">
				<!-- head -->
				<thead>
					<tr>
						<th><Translation id="collection" /></th>
						<th><Translation id="card" /></th>
						<th><Translation id="since" /></th>
						<th>Discord <i class="fa-brands fa-discord" /></th>
						<th><Translation id="sale" /></th>
					</tr>
				</thead>
				<tbody>
					{#each allRulesCards as card, index}
						{#if !card.found && !hideNoDataCards}
							<tr>
								<th class="text-error"><Translation id="no_data" /></th>
								<th>
									{card.name}
									{#if card.slug.includes("halloween")}
											<div class="badge text-black bg-orange-400 badge-primary">Halloween</div>
									{:else if card.slug.includes("common")}
										<div class="badge badge-primary"><Translation id="common" /></div>
									{:else}
										<div class="badge bg-slate-400 text-black"><Translation id="platinum" /></div>
									{/if}
								</th>
								<td />
								<th />
								<th></th>
							</tr>
						{:else if card.found && card.owner && (commonCheck && card.slug.includes("common") || platinumCheck && card.slug.includes("platinium") || halloweenCheck && card.slug.includes("halloween"))}
							<tr>
								<th>
									<div class="flex items-center space-x-3">
										<div class="avatar">
											<div class="mask mask-squircle w-12 h-12">
												<img src={card.owner.user.profile.pictureUrl} alt="avatar" />
											</div>
										</div>
										<div>
											<div class="tooltip tooltip-bottom link-hover" data-tip="Profile Rules">
												<a
													class="font-bold flex"
													href={`https://rules.art/user/${card.owner.user.slug}`}
													target="_blank"
												>
													{card.owner.user.username} &nbsp;
													{#if card.owner.user.profile.certified}
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18px"
															><path
																d="m17.326 10.216-.005.002a1.433 1.433 0 0 0-.506 1.89l.001.001a1.433 1.433 0 0 1-1.217 2.106 1.433 1.433 0 0 0-1.384 1.385 1.433 1.433 0 0 1-2.106 1.216h-.002a1.433 1.433 0 0 0-1.889.506l-.003.004a1.433 1.433 0 0 1-2.43 0l-.004-.005a1.433 1.433 0 0 0-1.889-.506l-.002.001A1.433 1.433 0 0 1 3.785 15.6 1.433 1.433 0 0 0 2.4 14.215a1.433 1.433 0 0 1-1.217-2.106l.001-.002a1.433 1.433 0 0 0-.506-1.889l-.004-.002a1.433 1.433 0 0 1 0-2.432l.005-.002a1.433 1.433 0 0 0 .506-1.89l-.001-.001A1.433 1.433 0 0 1 2.4 3.785 1.433 1.433 0 0 0 3.785 2.4a1.433 1.433 0 0 1 2.106-1.216h.002A1.433 1.433 0 0 0 7.782.678l.002-.004a1.433 1.433 0 0 1 2.432 0l.002.005a1.433 1.433 0 0 0 1.89.506l.001-.001A1.433 1.433 0 0 1 14.215 2.4 1.433 1.433 0 0 0 15.6 3.785a1.433 1.433 0 0 1 1.216 2.106v.002a1.433 1.433 0 0 0 .506 1.889l.004.003a1.433 1.433 0 0 1 0 2.43Z"
																fill="#9F04DC"
															/><path
																fill="#fff"
																d="m13.18 7.15-3.66 3.74-1.61 1.6-1.58-1.64-1.51-1.57 1.61-1.61 1.51 1.54 3.67-3.7 1.57 1.64z"
															/></svg
														>
													{/if}
												</a>
											</div>
										</div>
									</div>
								</th>
								<th>
									<a class="link link-hover" target="__blank" href={`https://rules.art/card/${card.slug.substr(0, card.slug.lastIndexOf("-"))}/${query}`}>{card.name}</a>
									{#if card.slug.includes("halloween")}
											<div class="badge text-black bg-orange-400 badge-primary">Halloween</div>
									{:else if card.slug.includes("common")}
										<div class="badge badge-primary"><Translation id="common" /></div>
									{:else}
										<div class="badge bg-slate-400 text-black"><Translation id="platinum" /></div>
									{/if}
								</th>
								<td>{card.ownerSince ? new Date(card.ownerSince).toLocaleString('FR') : ''}</td>
								<th>
									{#if card.owner && card.owner.user.profile.discordMember}
										{#if card.owner.user.profile.discordMember.username !== null && card.owner.user.profile.discordMember.discriminator !== null}
											<div
												class="tooltip tooltip-bottom"
												class:tooltip-success={clipboardCopied}
												data-tip={clipboardCopied ? 'Copied !' : 'Copy'}
											>
												<p
													class="font-semibold inline hover:underline cursor-pointer"
													on:click={() => {
														clipboardCopied = true;
														navigator.clipboard.writeText(
															`${card.owner.user.profile.discordMember.username}#${card.owner.user.profile.discordMember.discriminator}`
														);
													}}
												>
													{card.owner.user.profile.discordMember.username} #{card.owner.user.profile
														.discordMember.discriminator}
												</p>
											</div>
										{/if}
									{/if}
								</th>
								<th>
									{#if card.onSale}
										<div class="badge bg-orange-700 text-white font-semibold"><Translation id="sale" /> - {FormatPrice(card.currentOffer.price)} ETH</div>
									{/if}
								</th>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{/if}
