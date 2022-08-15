<script lang="ts">
    import { dev } from "$app/env";
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import Translation from '$lib/components/Translation.svelte';
    import { goto } from '$app/navigation';
    import { allCards } from '$lib/store/utils';
    import Favicon from "$lib/assets/favicon.png";
    import viewport from "$lib/viewport";
    import Spinner from '$lib/assets/spinner.png';

    const cardId = $page.params.cardId;
    const search = $page.params.search;
    let startIndex: number = 1;
    let customSearch: boolean = false;
    let artistName : string = '';
    let isCommon: boolean;
    let loading: boolean = true;
    let fetchingCards: boolean = true;

    let query: string = '';
    let tableQuery: number = 1;
    let tableQueryAfterValidate: number = tableQuery;
    let validatedTableQuery: boolean = false;

    let validQuery: boolean = false;
    let dataQuery: any = {};
    let userQuery: any = {};
    let cardCount: number = 0;
    let allRulesCards: any[] = [];
    let hideNoDataCards: boolean = false;

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

    function OnInputTableChange(){
        if (!isNaN(parseInt(`${tableQuery}`))){
            startIndex = tableQuery;
            tableQueryAfterValidate = tableQuery;
            allRulesCards = [];
            FetchNextRulesCards();
        }
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

    function FetchNextRulesCards(){
        fetchingCards = true;
        console.log(`Fetching ${cardId} from ${startIndex} to ${startIndex + 10}`);
        fetch(`${dev ? 'http://localhost:3000' : ''}/api/card_range/${cardId}/${startIndex}`)
        .then(res => res.json())
        .then(data => {
            allRulesCards = [...allRulesCards, ...data];
            startIndex += 10;
            fetchingCards = false;
        })
        .catch(err => {
            console.log(err);
        });
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
                loading = false;

                let tempArray: any[] = $allCards;

                for (let i = 0; i < $allCards.length; i++){
                    fetch(`${dev ? 'http://localhost:3000' : ''}/api/card_count/${$allCards[i].slug}`)
                    .then(res => res.json())
                    .then(data => {
                        tempArray[i].cardsMintedCount = data.cardsMintedCount;
                        if (i === $allCards.length - 1){
                            allCards.set(tempArray);
                        }
                    })
                    .catch(err => console.log(err));
                }
            });
        }
        else
        {
            console.log('Cards already fetched.');
            Setup();
        }

        console.log(`Fetching ${cardId} from ${startIndex} to ${startIndex + 10}`);
        fetch(`${dev ? 'http://localhost:3000' : ''}/api/card_range/${cardId}/${startIndex}`)
        .then(res => res.json())
        .then(data => {
            allRulesCards = data;
            startIndex += 10;
            fetchingCards = false;
        })
        .catch(err => {
            console.log(err);
        });
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
        <img src={Spinner} class="animate-spin h-14 m-2" alt="Loading..." />
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
                        type="number"
                        min="1"
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
                <a href={`https://rules.art/card/${cardId}/${query}`} target="_blank" class="btn btn-primary w-full"><Translation id="see_card"/></a>
            {/if}
        </div>
    {/if}
</div>

<div class="form-control w-full">
    <label class="label cursor-pointer">
        <span class="label-text"><Translation id="hide"/></span> 
        <input type="checkbox" bind:checked={hideNoDataCards} class="checkbox" />
    </label>
</div>
<div class="form-control w-full">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
      <span class="label-text"><Translation id="start_index"/></span>
    </label>
    <div class="form-control">
        <div class="input-group">
            <input 
                type="number"
                bind:value={tableQuery}
                min="1"
                placeholder="..." 
                class="input input-primary w-full"
                on:keydown={(e) => {
                    if (e.key === 'Enter'){
                        validatedTableQuery = true;
                        OnInputTableChange();
                    }
                }}
                on:input={() => validatedTableQuery = false}
            />
            <button disabled={validatedTableQuery} class="btn btn-success"><Translation id="validate"/>&nbsp;<i class="fa-solid fa-check"></i></button>
        </div>
    </div>
</div>
<div class="w-full overflow-x-auto">
    <table class="table w-full">
        <!-- head -->
        <thead>
            <tr>
            <th><Translation id="collection"/></th>
            <th><Translation id="card"/></th>
            <th><Translation id="since"/></th>
            <th>Discord <i class="fa-brands fa-discord"></i></th>
            </tr>
        </thead>
        <tbody>
            {#each allRulesCards as card, index}
                {#if (!card && !hideNoDataCards) || index === allRulesCards.length - 1}
                    <tr>
                        <td class="text-error">Pas de donnée</td>
                        <th>
                            {#if index === allRulesCards.length - 1}
                                <h1 use:viewport
                                on:enterViewport={() => FetchNextRulesCards()}
                                on:exitViewport={() => {}}>{artistName} #{index + tableQueryAfterValidate}</h1>
                            {:else}
                                {artistName} #{index + tableQueryAfterValidate}
                            {/if}
                            {#if isCommon}
                                <div class="badge badge-primary"><Translation id="common"/></div>
                            {:else}
                                <div class="badge bg-slate-400 text-black"><Translation id="platinum"/></div>
                            {/if}
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
                            {#if index === allRulesCards.length - 1}
                                <h1 use:viewport
                                    on:enterViewport={() => FetchNextRulesCards()}
                                    on:exitViewport={() => {}}
                                >
                                    {artistName} #{index + tableQueryAfterValidate}
                                </h1>
                            {:else}
                                {artistName} #{index + tableQueryAfterValidate}
                            {/if}
                            {#if isCommon}
                                <div class="badge badge-primary"><Translation id="common"/></div>
                            {:else}
                                <div class="badge bg-slate-400 text-black"><Translation id="platinum"/></div>
                            {/if}
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
{#if fetchingCards}
    <div class="flex flex-col items-center justify-center">
        <img src={Spinner} class="animate-spin h-14" alt="Loading..." />
        <h1><Translation id="loading_table"/> {startIndex} <Translation id="to"></Translation> {startIndex + 10}</h1>
    </div>
{/if}