import express from 'express';
import  {JSONFilePreset} from 'lowdb/node';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const defaultData = { alunos: [{id: 1, nome: "Paulo", curso: "EI", ano: 2001}] };
const db = await JSONFilePreset('src/db/alunos.json', defaultData);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static('src/public/'));


// get all cars
app.get('/alunos', async (req, res) => {
    await db.read();
    res.json(db.data.alunos);
});

// obter aluno com o id especificado
app.get('/alunos/:id', async(req, res) => {
  await db.read();
  const aluno = db.data.alunos.find(aluno => aluno.id === parseInt(req.params.id));
  if(aluno) {
    res.json(aluno);
  } else {
    res.status(404).send("aluno nao encontrado");
  }
})

// criar um aluno
app.post('/alunos', async (req, res) => {
  await db.read();
  const newAluno = {
    id: newId(db),
    nome: req.body.nome,
    curso: req.body.curso,
    ano: req.body.ano
  };
  db.data.alunos.push(newAluno);
  await db.write();
  res.status(201).json(newAluno);
});

// atualizar um aluno
app.put('/alunos/:id', async (req, res) => {
  await db.read();
  const index = db.data.alunos.findIndex(aluno => aluno.id === parseInt(req.params.id));
  if(index !== -1) { 
    db.data.alunos[index] = {
      id: parseInt(req.params.id),
      nome: req.body.nome,
      curso: req.body.curso,
      ano: req.body.ano
    };
    await db.write();
    res.json(db.data.alunos[index]);
  } else {
    res.status(404).send("Aluno nao encontrado");
  }
});


app.delete('/alunos/:id', async (req, res) => {
  await db.read();
  const index = db.data.alunos.findIndex(aluno => aluno.id === parseInt(req.params.id));
  if(index !== -1) { 
    db.data.alunos.splice(index, 1);
    await db.write();
    res.status(204).send("Aluno removido");
  } else {
    res.status(404).send("Aluno nao encontrado");
  }
});

function newId(db) {
  return db.data.alunos.length + 1;
}

app.get("/", (req, res) => {  
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/public/about.html");
});

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/public/docs.html");
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



