<script lang="ts">
    import { dev } from "$app/env";
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import Translation from '$lib/components/Translation.svelte';
    import { goto } from '$app/navigation';
    import { allCards } from '$lib/store/utils';
    import Favicon from "$lib/assets/favicon.png"

    const cardId = $page.params.cardId;
    const search = $page.params.search;
    let customSearch: boolean = false;
    let artistName : string = '';
    let isCommon: boolean;
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

    function UpdateHistory(query: string){
        // Get history
        let array: any[] = JSON.parse(localStorage.getItem('history') || '[]');
    
        if (customSearch){
            // Move `/${cardId}/${query}` at the top of the history
            const index = array.findIndex(item => item.link === `/${cardId}/${query}`);
            if (index !== -1){
                array.splice(index, 1);
                array.unshift({
                    name: `${artistName} #${query}`,
                    link: `/${cardId}/${query}`
                });
            }
            customSearch = false;
            return;
        }

        if (array.find(h => h.link === `/${cardId}/${query}`)){
            return;
        }

        // If array length is equal to 5 remove the first element
        if (array.length >= 5){
            array.shift();
        }

        array.push({
            name: `${artistName} #${query} ${isCommon ? 'Commune' : 'Platine'}`,
            link: `/${cardId}/${query}`
        });

        // Save history
        localStorage.setItem('history', JSON.stringify(array));
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
                    UpdateHistory(query);
                    fetch(`${dev ? 'http://localhost:3000' : ''}/api/card/${cardId}/${query}`)
                    .then(res => res.json())
                    .then(data => {
                        dataQuery = data;
                        error = false;
                        fetch(`${dev ? 'http://localhost:3000' : ''}/api/user/${dataQuery.owner.user.slug}`)
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
        isCommon = cardId.includes('common');
        cardCount = card.cardsMintedCount;
        pictureUrl = card.pictureUrl;
        artistName = card.artist.displayName;
        
        // Check if search is a number

        if (search == 'search')
        {
            loading = false;
            return;
        }

        if(!isNaN(parseInt(search))){
            // Check if search is a valid number
            if(parseInt(search) > 0 && parseInt(search) <= cardCount){
                customSearch = true;
                query = search;
                OnInputChange();
            }
        }
        else{
            goto(`/${cardId}/search`);
        }
        
        loading = false;
    }

    onMount(() => {

        if ($allCards.length == 0)
        {
            console.log('Fetching cards...');
            fetch(`${dev ? 'http://localhost:3000' : ''}/api/cards`)
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
        <h1><Translation id="loading"/></h1>
    {:else}
        <figure><img src={pictureUrl} class="lg:h-96 h-56" alt="Movie"></figure>
        <div class="card-body">
            <h2 class="card-title">
                {artistName} {validQuery ? `#${query}` : ''}
                {#if isCommon}
                    <div class="badge badge-primary"><Translation id="common"/></div>
                {:else}
                    <div class="badge bg-slate-400 text-black"><Translation id="platinum"/></div>
                {/if}
            </h2>
            <div class="form-control w-full">
                <label class="label">
                    <span class="label-text">
                        <Translation id="search"/> 
                        {#if cardCount !== 0}
                            <span class="text-sm">({cardCount} <Translation id="cards_obtained"/>)</span>
                        {/if}
                    </span>
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
                            <span class="label-text"><Translation id="result"/></span>
                            <input class="hidden"/>
                        </label>
                        <div class="p-3 bg-base-100 shadow-xl w-full rounded border border-primary">
                            {#if error}
                                <div class="text-error"><Translation id="error"/></div>
                            {:else}
                                {#if dataQuery.owner}
                                    <p>
                                        <img class="h-5 inline" src={Favicon} alt=""/>
                                        {dataQuery.owner.user.username} <Translation id="since"/> {new Date(dataQuery.ownerSince).toLocaleString('FR')}
                                    </p>
                                    <div>
                                        <i class="fa-brands fa-discord"></i>
                                        {#if userQuery.discordUser}
                                        <div class="tooltip tooltip-bottom" class:tooltip-success={clipboardCopied} data-tip={clipboardCopied ? 'Copied !' : "Copy"}>
                                            <p class="font-semibold inline hover:underline cursor-pointer" on:click={() => {
                                                clipboardCopied = true;
                                                navigator.clipboard.writeText(`${userQuery.discordUser.username}#${userQuery.discordUser.discriminator}`)
                                            }}>{userQuery.discordUser.username} #{userQuery.discordUser.discriminator}</p>
                                        </div>
                                        {:else}
                                            <p class="text-error inline"><Translation id="not_available"/></p>
                                        {/if}
                                    </div>
                                {/if}
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
            {#if validQuery}
                <a href={`https://rules.art/card/${cardId}/${query}`} target="_blank" class="btn btn-primary w-full">Voir la carte sur Rules</a>
            {/if}
        </div>
    {/if}
</div>