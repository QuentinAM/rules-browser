export const manifest = {
	appDir: "_app",
	assets: new Set(["favicon.png","img/template.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		entry: {"file":"_app/immutable/start-0e56cc74.js","imports":["_app/immutable/start-0e56cc74.js","_app/immutable/chunks/index-7b34e3b2.js","_app/immutable/chunks/singletons-eca981c1.js"],"stylesheets":[]},
		nodes: [
			() => import('./server/nodes/0.js'),
			() => import('./server/nodes/1.js'),
			() => import('./server/nodes/3.js'),
			() => import('./server/nodes/2.js')
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				id: "[cardId]/[search]",
				pattern: /^\/([^/]+?)\/([^/]+?)\/?$/,
				names: ["cardId","search"],
				types: [null,null],
				path: null,
				shadow: null,
				a: [0,3],
				b: [1]
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
