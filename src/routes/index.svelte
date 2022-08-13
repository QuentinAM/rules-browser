<script lang="ts">
    import { dev } from "$app/env";
    import { onMount } from "svelte";
    import { allCards } from '$lib/store/utils';
    import Translation from '$lib/components/Translation.svelte';
    import Card from '$lib/components/Card.svelte';
    import { goto } from "$app/navigation";

    let loading: boolean = true;
    let query: string = '';
    let shownCards: any[] = [];
    let history: any[] = [];

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
    </div>
    {#each shownCards as card}
        <Card
            name={card.artist.displayName}
            pictureUrl={card.pictureUrl}
            season={card.season}
            slug={card.slug}
            cardsMintedCount={card.cardsMintedCount}
        />
    {/each}
{/if}