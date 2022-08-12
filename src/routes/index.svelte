<script lang="ts">
    import { onMount } from "svelte";
    import { allCards } from '$lib/store/utils';
    import Translation from '$lib/components/Translation.svelte';
    import Card from '$lib/components/Card.svelte';

    let loading: boolean = true;
    let query: string = '';
    let shownCards: any[] = [];

    function onQuery(){
        if (query === '')
        {
            shownCards = $allCards;
            return;
        }
        console.log(query);
        shownCards = $allCards.filter(card => Format(card.artist.displayName).includes(Format(query)));
    }

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
            fetch('http://localhost:3000/cards')
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
    })
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><Translation id="home" /></li>
	</ul>
</div>
{#if loading}
    <div class="radial-progress animate-spin text-primary" style="--value:70;"></div>
    <h1>This loading will only happen once to load all data.</h1>
{:else}
    <div class="form-control w-full">
        <label class="label">
            <span class="label-text">Search</span>
            <input class="hidden"/>
        </label>
        <input
            bind:value={query}
            on:input={onQuery}
            placeholder="..."
            type="text"
            class="input input-primary w-full"
        />
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