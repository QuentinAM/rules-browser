import fetch from 'node-fetch';

export default function GetCardCount(card)
{
    return new Promise((resolve, reject) => {
        fetch('https://api.rules.art/graphql', {
        method: 'POST',
        headers: { 
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Connection': 'keep-alive',
            'DNT': '1',
            'Origin': 'https://api.rules.art'
        },
        body: JSON.stringify({ query: `
                query{
                    cardModel(slug: "${card}"){
                        cardsMintedCount
                    }
                }` 
            }),
        })
        .then(res => res.json())
        .then(res => {
            resolve(res.data.cardModel);
        })
        .catch(err => console.log(err));
    });
}