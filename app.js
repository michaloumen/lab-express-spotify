require("dotenv").config(); //para não ficar publico o numero do id e do secret

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

//a gente não coloca credenciais porque qualquer um que ver nosso repositório vai ver. Daí usa essa biblioteca do dotend para conseguir mudar o jeito que isso é exibido no código. e daí cria o '.env' e coloca as credenciais dentro desse arquivo somente. Lembrar de não deixar com espaço
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
// A gente precisa gerar uma token a partir de .clientCredentialsGrant
//essa token a gente usa sempre que vamos pegar artistas, músicas...
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});

//query é um pedido de informação, dado, consulta ou solicitar uma requisição
//o que é esse data? kkk
app.get("/artist-search", async (req, res) => {
  const { artistName } = req.query;

  try {
    const {
      body: {
        artists: { items },
      },
    } = await spotifyApi.searchArtists(artistName);

    response.render("artist-search-results", { items });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
