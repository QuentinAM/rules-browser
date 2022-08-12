<script lang="ts">
import { goto } from "$app/navigation";


    export let name: string;
    export let pictureUrl: string;
    export let season: string;
    export let slug: string;
    export let cardsMintedCount: string;

    const isCommon: boolean = slug.includes('common');

</script>

<div class="card card-side bg-base-100 shadow-xl w-full">
    <figure><img src={pictureUrl} class="h-52" alt="Movie"></figure>
    <div class="card-body">
        <h2 class="card-title">
            {name}
            {#if isCommon}
                <div class="badge badge-primary">Common</div>
            {:else}
                <div class="badge bg-slate-400 text-black">Platinum</div>
            {/if}
        </h2>
        <div>Saison {season}
            {#if isCommon}
                <p>Last obtained number: #{cardsMintedCount}</p>
            {:else}
                <p>{cardsMintedCount} cards obtained yet !</p>
            {/if}
        </div>
        <div class="card-actions justify-end">
            <button class="btn btn-primary" on:click={() => goto(`/${slug}`)}>View</button>
        </div>
    </div>
</div>