import { c as create_ssr_component, b as subscribe, e as escape } from "./index-91841fec.js";
import { l as language } from "./utils-7635c39d.js";
const Translation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_language;
  $$unsubscribe_language = subscribe(language, (value) => value);
  let { id } = $$props;
  let word;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  $$unsubscribe_language();
  return `${escape(word)}`;
});
export {
  Translation as T
};
