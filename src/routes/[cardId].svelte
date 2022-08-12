<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import Translation from '$lib/components/Translation.svelte';
    import { goto } from '$app/navigation';
    import { allCards } from '$lib/store/utils';

    const cardId = $page.params.cardId;
    let artistName : string = '';
    let loading: boolean = true;

    let query: string = '';
    let validQuery: boolean = false;
    let dataQuery: any = {};
    let userQuery: any = {};
    let cardCount: number = 0;

    let pictureUrl: string = '';
    let clipboardCopied: boolean = false;
    let error: boolean = false;

    function Reset(){
        dataQuery = {};
        userQuery = {};
    }

    function OnInputChange(){
        clipboardCopied = false;
        if (query === '')
        {
            Reset();
            error = false;
        }

        // Check if query contains 1, 2, 3 or 4 digit
        if(query.length === 1 || query.length === 2 || query.length === 3 || query.length === 4){
            // Check if query is a number
            if(!isNaN(parseInt(query))){
                // Check if query is a valid number
                if(parseInt(query) > 0 && parseInt(query) <= cardCount){
                    validQuery = true;
                    fetch(`http://localhost:3000/card/${cardId}/${query}`)
                    .then(res => res.json())
                    .then(data => {
                        dataQuery = data;
                        error = false;
                        fetch(`http://localhost:3000/user/${dataQuery.owner.user.slug}`)
                        .then(res => res.json())
                        .then(data => {
                            userQuery = data.profile;
                        })
                        .catch(err => {
                            userQuery = {};
                        });
                    })
                    .catch(err => {
                        Reset();
                        error = true;
                    });
                }
                else {
                    validQuery = false;
                }
            }
            else{
                validQuery = false;
            }
        }
        else{
            validQuery = false;
        }
    }

    function Setup(){
        const card = $allCards.find(card => card.slug === cardId);
        cardCount = card.cardsMintedCount;
        pictureUrl = card.pictureUrl;
        artistName = card.artist.displayName;
        loading = false;
    }

    onMount(() => {

        if ($allCards.length == 0)
        {
            console.log('Fetching cards...');
            fetch('http://localhost:3000/cards')
            .then(res => res.json())
            .then(data => {
                allCards.set(data);
                Setup();
            });
        }
        else
        {
            console.log('Cards already fetched.');
            Setup();
        }
    })
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><a on:click|preventDefault={() => goto('/')} href='/'><Translation id="home" /></a></li>
		<li>{cardId}</li>
	</ul>
</div>
<div class="card card-side bg-base-100 shadow-xl w-full">
    {#if loading}
        <div class="radial-progress animate-spin text-primary" style="--value:70;"></div>
        <h1>This loading will only happen once to load all data.</h1>
    {:else}
        <figure><img src={pictureUrl} class="h-80" alt="Movie"></figure>
        <div class="card-body">
            <h2 class="card-title">{artistName} {validQuery ? `#${query}` : ''}</h2>
            <div class="form-control w-full">
                <label class="label">
                    <span class="label-text">Search {cardCount !== 0 ? `(${cardCount} cards obtained)` : ''}</span>
                    <input class="hidden"/>
                </label>
                <div class="tooltip tooltip-bottom " class:tooltip-open={!validQuery && query !== ''}  data-tip="Accept only number">
                    <input
                        bind:value={query}
                        on:input={OnInputChange}
                        placeholder="..."
                        type="text"
                        class="input input-primary w-full"
                    />
                </div>
                
            </div>
            {#if error || dataQuery.owner}
                <div class="card-actions justify-end">
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text">Result</span>
                            <input class="hidden"/>
                        </label>
                        <div class="p-3 bg-base-100 shadow-xl w-full rounded border border-primary">
                            {#if error}
                                <div class="text-error">Error, card might not have an owner</div>
                            {:else}
                                {#if dataQuery.owner}
                                    <p>{dataQuery.owner.user.username} since {new Date(dataQuery.ownerSince).toLocaleString('FR')}</p>
                                    <div>
                                        <i class="fa-brands fa-discord"></i>
                                        {#if userQuery.discordUser}
                                        <div class="tooltip tooltip-bottom" class:tooltip-success={clipboardCopied} data-tip={clipboardCopied ? 'Copied !' : "Copy"}>
                                            <p class="font-semibold inline hover:underline cursor-pointer" on:click={() => {
                                                clipboardCopied = true;
                                                navigator.clipboard.writeText(`${userQuery.discordUser.username} #${userQuery.discordUser.discriminator}`)
                                            }}>{userQuery.discordUser.username} #{userQuery.discordUser.discriminator}</p>
                                        </div>
                                        {:else}
                                            <p class="text-error inline">Not available</p>
                                        {/if}
                                    </div>
                                {/if}
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>