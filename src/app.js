const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkIdExist(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({'error': 'Id not found'});
  }

  return next();
}
app.use("/repositories/:id", checkIdExist);

app.get("/repositories", (_request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id == id);

  const { url, title, techs } = request.body;

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    title,
    techs,
    url
  };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id == id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id == id);

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
