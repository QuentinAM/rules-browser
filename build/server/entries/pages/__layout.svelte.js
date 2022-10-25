import { c as create_ssr_component, v as validate_component } from "../../_app/immutable/chunks/index-91841fec.js";
import { l as language } from "../../_app/immutable/chunks/utils-7635c39d.js";
const app = "";
const LanguageSelector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let languageSelected;
  {
    language.set(languageSelected);
  }
  return `${``}`;
});
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"navbar bg-base-100"}"><div class="${"flex-1"}"><a class="${"btn btn-ghost normal-case text-xl"}" href="${"/"}">Rules browser</a></div>
	<div class="${"flex-none"}"><a class="${"link link-hover"}" href="${"https://github.com/QuentinAM/rules-browser/tree/main"}" target="${"_blank"}">Github <i class="${"fa-brands fa-github"}"></i></a>
		
		<div class="${"divider divider-horizontal"}"></div>
		${validate_component(LanguageSelector, "LanguageSelector").$$render($$result, {}, {}, {})}</div></div>`;
});
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}
<div class="${"min-h-screen bg-base-200 flex justify-center"}"><div class="${"flex flex-col items-center space-y-4 mt-4 w-[95%] mx-6 lg:w-2/3 lg:mx-0"}">${slots.default ? slots.default({}) : ``}</div></div>`;
});
export {
  _layout as default
};
