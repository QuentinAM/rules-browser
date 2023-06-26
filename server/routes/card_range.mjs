import fetch from 'node-fetch';

export default function GetCardByRange(slug, start) {
	const end = parseInt(start) + 10;
	let resArray = [];

	return new Promise(async (resolve, reject) => {
		for (let i = start; i < end; i++) {
			const res = await fetch('https://api.rules.art/graphql', {
				method: 'POST',
				headers: {
					'Accept-Encoding': 'gzip, deflate, br',
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Connection: 'keep-alive',
					DNT: '1',
					Origin: 'https://api.rules.art'
				},
				body: JSON.stringify({
					query: `
                    query{
                        card(slug: "${slug}-${i}"){
							slug,
                            owner{
                                user{
                                    username,
                                    slug,
                                    profile{
                                        pictureUrl,
                                        certified,
                                        discordMember{
                                            discriminator,
                                            username
                                        }
                                    }
                                }
                            }
                        }
                    }`
				})
			});
			const data = await res.json();
			resArray.push(data.data.card);

			if (i === end - 1) {
				resolve(resArray);
			}
		}
	});
}
