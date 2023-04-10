import express from "express"
import cors from "cors"

const PORT = 5000;
const usuarios = [];
const tweets = [];
const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;
    if (!username || !avatar || typeof username !== "string" || typeof avatar !== "string") {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }
    usuarios.push({ username: username, avatar: avatar });
    res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
    const user = req.headers.user;
    const { tweet } = req.body;

    const usuario = usuarios.find(u => u.username === user);
    if (!usuario) {
        return res.status(401).send("UNAUTHORIZED");
    }
    if (!user || !tweet || typeof user !== "string" || typeof tweet !== "string") {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }
    tweets.push({ username: user, tweet: tweet });
    res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
    const tweetsList = [];
    let latestTweets;
    const page = req.query.page;

    if (page < 1) {
        res.status(400).send("Informe uma página válida!");
    }

    if (tweets.length > 10 && page) {
        latestTweets = tweets.slice(-10 * page, tweets.length - (10 * (page - 1)));
    } else {
        if (!page) {
            latestTweets = tweets.slice(-10);
        } else {
            latestTweets = [...tweets];
        }
    }

    latestTweets.forEach((tweet) => {
        const usuario = usuarios.find(usuario => usuario.username === tweet.username);
        tweetsList.push({ username: tweet.username, avatar: usuario.avatar, tweet: tweet.tweet });
    });
    res.send(tweetsList);
});

app.get("/tweets/:username", (req, res) => {
    const { username } = req.params;
    const tweetsList = [];
    const userTweets = tweets.filter((t) => t.username === username);
    if (userTweets.length > 0) {
        const usuario = usuarios.find(usuario => usuario.username === username);
        userTweets.forEach((tweet) => {
            tweetsList.push({ username: tweet.username, avatar: usuario.avatar, tweet: tweet.tweet });
        });
    }
    res.send(tweetsList);
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} `));