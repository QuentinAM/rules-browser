<script lang="ts">
    import { dev } from "$app/env";
    import { onMount } from "svelte";
    import { allCards } from '$lib/store/utils';
    import Translation from '$lib/components/Translation.svelte';
    import Card from '$lib/components/Card.svelte';
    import { goto } from "$app/navigation";

    let loading: boolean = true;
    let clipboardCopied: boolean = false;
    let query: string = '';
    let shownCards: any[] = [];
    let history: any[] = [];

    let searchByCard: boolean = true;
    let hideNoDataCards: boolean = false;
    let allRulesCards: any[] = [];

    let commonCheck: boolean = true;
    let platinumCheck: boolean = true;

    function onQuery(){
        if (query === '')
        {
            shownCards = $allCards;
            OnCheck();
            return;
        }
        console.log(query);
        shownCards = $allCards.filter(card => {
            if (commonCheck && platinumCheck)
            {
                return Format(card.artist.displayName).includes(Format(query));
            }
            else if (commonCheck && !platinumCheck)
            {
                return Format(card.artist.displayName).includes(Format(query)) && card.slug.includes('common');
            }
            else if (!commonCheck && platinumCheck)
            {
                return Format(card.artist.displayName).includes(Format(query)) && card.slug.includes('platinium');
            }
            return false;
        });
    }

    function OnCheck(){
        if (commonCheck && platinumCheck)
        {
            shownCards = $allCards.filter(card => {
                return Format(card.artist.displayName).includes(Format(query));
            });
        }
        else if (commonCheck && !platinumCheck)
        {
            shownCards = $allCards.filter(card => card.slug.includes('common') && Format(card.artist.displayName).includes(Format(query)));
        }
        else if (!commonCheck && platinumCheck)
        {
            shownCards = $allCards.filter(card => card.slug.includes('platinium') && Format(card.artist.displayName).includes(Format(query)));
        }
        else
        {
            shownCards = [];
        }
    }
    $: commonCheck, platinumCheck, OnCheck();

    function Format(str: string){
        // Remove spaces
        str = str.replace(/\s/g, '');

        // Remove accents
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return str.toLowerCase();
    }

    onMount(() => {
        if ($allCards.length == 0)
        {
            console.log('Fetching cards...');
            fetch(`${dev ? 'http://localhost:3000' : ''}/api/cards`)
            .then(res => res.json())
            .then(data => {
                allCards.set(data);
                shownCards = data;
                loading = false;
            });
        }
        else
        {
            console.log('Cards already fetched.');
            loading = false;
            shownCards = $allCards;
        }
        history = JSON.parse(localStorage.getItem('history') || '[]');
    })
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><Translation id="home" /></li>
	</ul>
</div>
<div>
    <Translation id="description"/>
    <a class="text-primary hover:underline" href="https://rules.art/" target="_blank">Rules</a>
    (s/o <a class="text-primary hover:underline" href="https://github.com/0xChqrles" target="_blank">Chqrles</a>)
</div>
{#if loading}
    <div class="radial-progress animate-spin text-primary" style="--value:70;"></div>
    <h1><Translation id="loading"/></h1>
{:else}
    <div class="form-control w-full">
        <label class="label">
            <span class="label-text"><Translation id="search"/></span>
            <input class="hidden"/>
        </label>
        <div class="form-control">
            <div class="input-group">
                <input
                    bind:value={query}
                    on:input={onQuery}
                    placeholder="..."
                    type="text"
                    class="input input-primary w-full"
                />
                <select class="select select-primary">
                    <option disabled selected>Historique</option>
                    {#each history.reverse() as h}
                        <option on:click={() => goto(`${h.link}`)}>{h.name}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>
    <div class="flex flex-row space-x-2 w-full">
        <div class="form-control space-x-2" >
            <label class="label cursor-pointer">
            <span class="label-text"><Translation id="common"/>&nbsp;</span> 
                <input type="checkbox" bind:checked={commonCheck} class="checkbox checkbox-primary" />
            </label>
        </div>
        <div class="form-control space-x-2 ">
            <label class="label cursor-pointer">
            <span class="label-text"><Translation id="platinum"/>&nbsp;</span> 
            <input type="checkbox" bind:checked={platinumCheck} class="checkbox" />
            </label>
        </div>
        <div class="form-control">
            <label class="label cursor-pointer">
                <span class="label-text">Chercher par carte/numéro&nbsp;</span> 
                <input type="checkbox" bind:checked={searchByCard} class="toggle"/>
            </label>
        </div>
        {#if !searchByCard}
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Masquer les cartes sans donnée&nbsp;</span> 
                    <input type="checkbox" bind:checked={hideNoDataCards} class="checkbox"/>
                </label>
            </div>
        {/if}
    </div>
    {#if searchByCard}
        {#each shownCards as card}
            <Card
                name={card.artist.displayName}
                pictureUrl={card.pictureUrl}
                season={card.season}
                slug={card.slug}
                cardsMintedCount={card.cardsMintedCount}
            />
        {/each}
    {:else}
        <div class="w-full overflow-x-auto">
            <table class="table w-full">
            <!-- head -->
            <thead>
                <tr>
                <th>Collectionneur</th>
                <th>Carte</th>
                <th>Depuis</th>
                <th>Discord <i class="fa-brands fa-discord"></i></th>
                </tr>
            </thead>
            <tbody>
                {#each allRulesCards as card, index}
                    {#if !card && !hideNoDataCards}
                        <tr>
                            <td class="text-error">Pas de donnée</td>
                            <th>
                                <!-- {artistName} #{index + 1} -->
                                <!-- {#if isCommon}
                                    <div class="badge badge-primary"><Translation id="common"/></div>
                                {:else}
                                    <div class="badge bg-slate-400 text-black"><Translation id="platinum"/></div>
                                {/if} -->
                            </th>
                            <td></td>
                            <th></th>
                        </tr>
                    {:else if card}
                        <tr>
                            <td>
                            <div class="flex items-center space-x-3">
                                <div class="avatar">
                                    <div class="mask mask-squircle w-12 h-12">
                                        <img src={card.owner.user.profile.pictureUrl} alt="avatar" />
                                    </div>
                                </div>
                                <div>
                                    <div class="tooltip tooltip-bottom link-hover" data-tip="Profile Rules">
                                        <a class="font-bold flex" href={`https://rules.art/user/${card.owner.user.slug}`} target="_blank">
                                            {card.owner.user.username} &nbsp;
                                            {#if card.owner.user.profile.certified}
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18px"><path d="m17.326 10.216-.005.002a1.433 1.433 0 0 0-.506 1.89l.001.001a1.433 1.433 0 0 1-1.217 2.106 1.433 1.433 0 0 0-1.384 1.385 1.433 1.433 0 0 1-2.106 1.216h-.002a1.433 1.433 0 0 0-1.889.506l-.003.004a1.433 1.433 0 0 1-2.43 0l-.004-.005a1.433 1.433 0 0 0-1.889-.506l-.002.001A1.433 1.433 0 0 1 3.785 15.6 1.433 1.433 0 0 0 2.4 14.215a1.433 1.433 0 0 1-1.217-2.106l.001-.002a1.433 1.433 0 0 0-.506-1.889l-.004-.002a1.433 1.433 0 0 1 0-2.432l.005-.002a1.433 1.433 0 0 0 .506-1.89l-.001-.001A1.433 1.433 0 0 1 2.4 3.785 1.433 1.433 0 0 0 3.785 2.4a1.433 1.433 0 0 1 2.106-1.216h.002A1.433 1.433 0 0 0 7.782.678l.002-.004a1.433 1.433 0 0 1 2.432 0l.002.005a1.433 1.433 0 0 0 1.89.506l.001-.001A1.433 1.433 0 0 1 14.215 2.4 1.433 1.433 0 0 0 15.6 3.785a1.433 1.433 0 0 1 1.216 2.106v.002a1.433 1.433 0 0 0 .506 1.889l.004.003a1.433 1.433 0 0 1 0 2.43Z" fill="#9F04DC"></path><path fill="#fff" d="m13.18 7.15-3.66 3.74-1.61 1.6-1.58-1.64-1.51-1.57 1.61-1.61 1.51 1.54 3.67-3.7 1.57 1.64z"></path></svg>
                                            {/if}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            </td>
                            <th>
                                <!-- {artistName} #{index + 1}
                                {#if isCommon}
                                    <div class="badge badge-primary"><Translation id="common"/></div>
                                {:else}
                                    <div class="badge bg-slate-400 text-black"><Translation id="platinum"/></div>
                                {/if} -->
                            </th>
                            <td>{new Date(card.ownerSince).toLocaleString('FR')}</td>
                            <th>
                                {#if card.owner.user.profile.discordUser}
                                    <div class="tooltip tooltip-bottom" class:tooltip-success={clipboardCopied} data-tip={clipboardCopied ? 'Copied !' : "Copy"}>
                                        <p class="font-semibold inline hover:underline cursor-pointer" on:click={() => {
                                            clipboardCopied = true;
                                            navigator.clipboard.writeText(`${card.owner.user.profile.discordUser.username}#${card.owner.user.profile.discordUser.discriminator}`)
                                        }}>{card.owner.user.profile.discordUser.username} #{card.owner.user.profile.discordUser.discriminator}</p>
                                    </div>
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