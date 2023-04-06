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
    if (!username || !avatar || typeof username !== "string"|| typeof avatar !== "string") {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }
    usuarios.push({ username: username, avatar: avatar });
    res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body;
    const usuario = usuarios.find(user => user.username === username);
    if (!usuario) {
        return res.status(401).send("UNAUTHORIZED");
    }
    if (!username || !tweet || typeof username !== "string"|| typeof tweet !== "string") {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }
    tweets.push({ username: username, tweet: tweet });
    res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
    const tweetsList = [];
    let latestTweets;
    
    if (tweets.length > 10) {
        latestTweets = tweets.slice(-10);
    } else {
        latestTweets = [...tweets];
    }
    
    latestTweets.forEach((tweet) => {
        const usuario = usuarios.find(usuario => usuario.username === tweet.username);
        tweetsList.push({ username: tweet.username, avatar: usuario.avatar, tweet: tweet.tweet });
    });
    res.send(tweetsList);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} `));