const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const connection = require('./database/database');
const Question = require('./database/Question');
const Answer = require('./database/Answer');

// Database
connection
  .authenticate()
  .then(() => {
    console.log('Conexção com o Banco de Dados feita com sucesso!');
  })
  .catch((err) => {
    console.log(err);
  });

// Config: Utilização do EJS
app.set('view engine', 'ejs');

// Config: Arquivos estáticos
app.use(express.static('public'));

// Config: body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rotas
app.get("/", (req, res) => {
  Question
    .findAll({ raw: true, order: [['id', 'DESC']] })
    .then(questions => {
      res.render("index", { questions: questions });
    });
});

app.get("/page-ask", (req, res) => {
  res.render("page-ask");
});

app.post("/save-ask", (req, res) => {

  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  Question.create({
    titulo: titulo,
    decricao: descricao
  }).then(() => {
    res.redirect("/");
  });

});

app.get("/page-ask/:id", (req, res) => {

  const id = req.params.id;

  Question
    .findOne({ where: { id: id } })
    .then(question => {
      if (question != undefined) {

        Answer
          .findAll({
            where: { perguntaId: pergunta.id },
            order: [['id', 'DESC']]
          })
          .then(answer => {
            res.render("question", {
              question: question,
              answer: answer
            })
          });

      } else {
        res.redirect("/");
      }
    });
});

app.post("/answer", () => {

  const corpo = req.body.corpo;
  const perguntaId = req.body.perguntaId

  Answer.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect("/page-ask/" + perguntaId);
  });

});

app.listen(3000, () => {
  console.log("Servidor iniciado!");
});