import { g as getContext, c as create_ssr_component, b as subscribe, v as validate_component, e as escape, d as add_attribute, f as each } from "../../../_app/immutable/chunks/index-91841fec.js";
import { T as Translation } from "../../../_app/immutable/chunks/Translation-1f5605fa.js";
import { a as allCards } from "../../../_app/immutable/chunks/utils-7635c39d.js";
import { S as Spinner } from "../../../_app/immutable/chunks/spinner-676efbd4.js";
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session,
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function FormatPrice(str) {
  const price = parseInt(str, 16);
  return (price / 1e18).toFixed(2);
}
const U5Bsearchu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_allCards;
  let $page, $$unsubscribe_page;
  $$unsubscribe_allCards = subscribe(allCards, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const cardId = $page.params.cardId;
  $page.params.search;
  let startIndex = 1;
  let artistName = "";
  let query = "";
  let tableQuery = 1;
  let tableQueryAfterValidate = tableQuery;
  let dataQuery = {};
  let max = 0;
  let allRulesCards = [];
  let hideNoDataCards = false;
  let clipboardCopied = false;
  let timeout;
  let timeoutFinished = true;
  function Reset() {
    dataQuery = {};
  }
  function UpdateHistory(query2) {
    let array = JSON.parse(localStorage.getItem("history") || "[]");
    if (array.find((h) => h.link === `/${cardId}/${query2}`)) {
      return;
    }
    if (array.length >= 5) {
      array.shift();
    }
    array.push({
      name: `${artistName} #${query2} ${"Platine"}`,
      link: `/${cardId}/${query2}`
    });
    localStorage.setItem("history", JSON.stringify(array));
  }
  function OnInputChange() {
    clipboardCopied = false;
    {
      Reset();
    }
    if (query.length === 1 || query.length === 2 || query.length === 3 || query.length === 4) {
      if (!isNaN(parseInt(query))) {
        if (parseInt(query) > 0 && parseInt(query) <= max) {
          if (!timeoutFinished) {
            clearTimeout(timeout);
          }
          timeoutFinished = false;
          dataQuery = {};
          timeout = setTimeout(
            () => {
              timeoutFinished = true;
              UpdateHistory(query);
              fetch(`${""}/api/card/${cardId}/${query}`).then((res) => res.json()).then((data) => {
                dataQuery = data;
                fetch(`${""}/api/user/${dataQuery.owner.user.slug}`).then((res) => res.json()).then((data2) => {
                  data2.profile;
                }).catch((err) => {
                });
              }).catch((err) => {
                Reset();
              });
            },
            500
          );
        } else {
          dataQuery = {};
        }
      } else {
        dataQuery = {};
      }
    } else {
      dataQuery = {};
    }
  }
  {
    OnInputChange();
  }
  $$unsubscribe_allCards();
  $$unsubscribe_page();
  return `<div class="${"text-sm breadcrumbs"}"><ul><li><a href="${"/"}">${validate_component(Translation, "Translation").$$render($$result, { id: "home" }, {}, {})}</a></li>
		<li>${escape(cardId)}</li></ul></div>
<div class="${"card card-side bg-base-100 shadow-xl w-full"}">${`<img${add_attribute("src", Spinner, 0)} class="${"animate-spin h-14 m-2"}" alt="${"Loading..."}">
		<h1>${validate_component(Translation, "Translation").$$render($$result, { id: "loading" }, {}, {})}</h1>`}</div>

<div class="${"form-control w-full"}"><label class="${"label cursor-pointer"}"><span class="${"label-text"}">${validate_component(Translation, "Translation").$$render($$result, { id: "hide" }, {}, {})}</span>
		<input type="${"checkbox"}" class="${"checkbox"}"${add_attribute("checked", hideNoDataCards, 1)}></label></div>
<div class="${"form-control w-full"}">
	<label class="${"label"}"><span class="${"label-text"}">${validate_component(Translation, "Translation").$$render($$result, { id: "start_index" }, {}, {})}</span></label>
	<div class="${"form-control"}"><div class="${"input-group"}"><input type="${"number"}" min="${"1"}" placeholder="${"..."}" class="${"input input-primary w-full"}"${add_attribute("value", tableQuery, 0)}>
			<button ${""} class="${"btn btn-success"}">${validate_component(Translation, "Translation").$$render($$result, { id: "validate" }, {}, {})}\xA0<i class="${"fa-solid fa-check"}"></i></button></div></div></div>
<div class="${"w-full overflow-x-auto"}"><table class="${"table w-full"}">
		<thead><tr><th>${validate_component(Translation, "Translation").$$render($$result, { id: "collection" }, {}, {})}</th>
				<th>${validate_component(Translation, "Translation").$$render($$result, { id: "card" }, {}, {})}</th>
				<th>${validate_component(Translation, "Translation").$$render($$result, { id: "since" }, {}, {})}</th>
				<th>Discord <i class="${"fa-brands fa-discord"}"></i></th>
				<th>${validate_component(Translation, "Translation").$$render($$result, { id: "sale" }, {}, {})}</th></tr></thead>
		<tbody>${each(allRulesCards, (card, index) => {
    return `${!card && !hideNoDataCards || index === allRulesCards.length - 1 ? `<tr><td class="${"text-error"}">Pas de donn\xE9e</td>
						<th>${index === allRulesCards.length - 1 ? `<h1>${escape(artistName)} #${escape(index + tableQueryAfterValidate)}
								</h1>` : `${escape(artistName)} #${escape(index + tableQueryAfterValidate)}`}
							${`<div class="${"badge bg-slate-400 text-black"}">${validate_component(Translation, "Translation").$$render($$result, { id: "platinum" }, {}, {})}</div>`}</th>
						<td></td>
						<th></th>
						<th></th>
					</tr>` : `${card ? `<tr><th><div class="${"flex items-center space-x-3"}"><div class="${"avatar"}"><div class="${"mask mask-squircle w-12 h-12"}"><img${add_attribute("src", card.owner.user.profile.pictureUrl, 0)} alt="${"avatar"}">
									</div></div>
								<div><div class="${"tooltip tooltip-bottom link-hover"}" data-tip="${"Profile Rules"}"><a class="${"font-bold flex"}"${add_attribute("href", `https://rules.art/user/${card.owner.user.slug}`, 0)} target="${"_blank"}">${escape(card.owner.user.username)} \xA0
											${card.owner.user.profile.certified ? `<svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 18 18"}" width="${"18px"}"><path d="${"m17.326 10.216-.005.002a1.433 1.433 0 0 0-.506 1.89l.001.001a1.433 1.433 0 0 1-1.217 2.106 1.433 1.433 0 0 0-1.384 1.385 1.433 1.433 0 0 1-2.106 1.216h-.002a1.433 1.433 0 0 0-1.889.506l-.003.004a1.433 1.433 0 0 1-2.43 0l-.004-.005a1.433 1.433 0 0 0-1.889-.506l-.002.001A1.433 1.433 0 0 1 3.785 15.6 1.433 1.433 0 0 0 2.4 14.215a1.433 1.433 0 0 1-1.217-2.106l.001-.002a1.433 1.433 0 0 0-.506-1.889l-.004-.002a1.433 1.433 0 0 1 0-2.432l.005-.002a1.433 1.433 0 0 0 .506-1.89l-.001-.001A1.433 1.433 0 0 1 2.4 3.785 1.433 1.433 0 0 0 3.785 2.4a1.433 1.433 0 0 1 2.106-1.216h.002A1.433 1.433 0 0 0 7.782.678l.002-.004a1.433 1.433 0 0 1 2.432 0l.002.005a1.433 1.433 0 0 0 1.89.506l.001-.001A1.433 1.433 0 0 1 14.215 2.4 1.433 1.433 0 0 0 15.6 3.785a1.433 1.433 0 0 1 1.216 2.106v.002a1.433 1.433 0 0 0 .506 1.889l.004.003a1.433 1.433 0 0 1 0 2.43Z"}" fill="${"#9F04DC"}"></path><path fill="${"#fff"}" d="${"m13.18 7.15-3.66 3.74-1.61 1.6-1.58-1.64-1.51-1.57 1.61-1.61 1.51 1.54 3.67-3.7 1.57 1.64z"}"></path></svg>` : ``}</a>
									</div></div>
							</div></th>
						<th>${index === allRulesCards.length - 1 ? `<h1><a class="${"link link-hover"}" target="${"__blank"}"${add_attribute("href", `https://rules.art/card/${card.slug.substr(0, card.slug.lastIndexOf("-"))}/${index + tableQueryAfterValidate}`, 0)}>${escape(artistName)} #${escape(index + tableQueryAfterValidate)}</a>
								</h1>` : `<a class="${"link link-hover"}" target="${"__blank"}"${add_attribute("href", `https://rules.art/card/${card.slug.substr(0, card.slug.lastIndexOf("-"))}/${index + tableQueryAfterValidate}`, 0)}>${escape(artistName)} #${escape(index + tableQueryAfterValidate)}</a>`}
							${`<div class="${"badge bg-slate-400 text-black"}">${validate_component(Translation, "Translation").$$render($$result, { id: "platinum" }, {}, {})}</div>`}</th>
						<td>${escape(new Date(card.ownerSince).toLocaleString("FR"))}</td>
						<th>${card.owner.user.profile.discordUser ? `<div class="${["tooltip tooltip-bottom", clipboardCopied ? "tooltip-success" : ""].join(" ").trim()}"${add_attribute("data-tip", clipboardCopied ? "Copied !" : "Copy", 0)}><p class="${"font-semibold inline hover:underline cursor-pointer"}">${escape(card.owner.user.profile.discordUser.username)} #${escape(card.owner.user.profile.discordUser.discriminator)}</p>
								</div>` : ``}</th>
						<th>${card.onSale ? `<div class="${"badge bg-orange-700 font-semibold text-white"}">${validate_component(Translation, "Translation").$$render($$result, { id: "sale" }, {}, {})} - ${escape(FormatPrice(card.currentOffer.price))} ETH</div>` : ``}</th>
					</tr>` : ``}`}`;
  })}</tbody></table></div>
${`<div class="${"flex flex-col items-center justify-center"}"><img${add_attribute("src", Spinner, 0)} class="${"animate-spin h-14"}" alt="${"Loading..."}">
		<h1>${validate_component(Translation, "Translation").$$render($$result, { id: "loading_table" }, {}, {})}
			${escape(startIndex)}
			${validate_component(Translation, "Translation").$$render($$result, { id: "to" }, {}, {})}
			${escape(startIndex + 10)}</h1></div>`}`;
});
export {
  U5Bsearchu5D as default
};
