import { c as create_ssr_component, b as subscribe, v as validate_component, d as add_attribute } from "../../_app/immutable/chunks/index-91841fec.js";
import { a as allCards } from "../../_app/immutable/chunks/utils-7635c39d.js";
import { T as Translation } from "../../_app/immutable/chunks/Translation-1f5605fa.js";
import { S as Spinner } from "../../_app/immutable/chunks/spinner-676efbd4.js";
function Format(str) {
  str = str.replace(/\s/g, "");
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return str.toLowerCase();
}
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $allCards, $$unsubscribe_allCards;
  $$unsubscribe_allCards = subscribe(allCards, (value) => $allCards = value);
  let query = "";
  function OnCheck() {
    {
      $allCards.filter((card) => {
        return Format(card.artist.displayName).includes(Format(query));
      });
    }
  }
  {
    OnCheck();
  }
  $$unsubscribe_allCards();
  return `<div class="${"text-sm breadcrumbs"}"><ul><li>${validate_component(Translation, "Translation").$$render($$result, { id: "home" }, {}, {})}</li></ul></div>
<div><a class="${"text-primary hover:underline"}" href="${"https://rules.art"}" target="${"_blank"}">Rules</a>
	${validate_component(Translation, "Translation").$$render($$result, { id: "description" }, {}, {})}
	(s/o
	<a class="${"text-primary hover:underline"}" href="${"https://github.com/0xChqrles"}" target="${"_blank"}">Chqrles</a>)
	${validate_component(Translation, "Translation").$$render($$result, { id: "by" }, {}, {})}
	<a class="${"text-primary hover:underline"}" href="${"https://quentinam.fr"}" target="${"_blank"}">QuentinAM</a></div>
${`<img${add_attribute("src", Spinner, 0)} class="${"animate-spin h-20"}" alt="${"Loading..."}">
	<h1>${validate_component(Translation, "Translation").$$render($$result, { id: "loading" }, {}, {})}</h1>`}`;
});
export {
  Routes as default
};
