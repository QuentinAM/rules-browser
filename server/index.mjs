import express from 'express';
import cors from 'cors';
import GetAllCardModels from './routes/cards.mjs';
import GetCardById from './routes/card.mjs';
import User from './routes/user.mjs';

const app = express();
app.use(cors());
app.get('/cards', async (req, res) => {
    const allCardsModels = await GetAllCardModels();
    res.send(allCardsModels);
});
app.get('/card/:card/:id', async (req, res) => {
    const card = req.params.card;
    const id = req.params.id;
    const cardById = await GetCardById(card, id);
    res.send(cardById);
});
app.get('/user/:slug', async (req, res) => {
    const slug = req.params.slug;
    const user = await User(slug);
    res.send(user);
});
app.listen(3000, () => console.log('Listening on port 3000!'));