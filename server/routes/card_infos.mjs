import fetch from 'node-fetch';

export default function GetCardByIdInfos(card, id) {
	return new Promise((resolve, reject) => {
		fetch('https://api.rules.art/graphql', {
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
                    card(slug: "${card}-${id}"){
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
		})
			.then((res) => res.json())
			.then((res) => {
				resolve(res.data.card);
			})
			.catch((err) => {
				console.log(err);
			});
	});
}
