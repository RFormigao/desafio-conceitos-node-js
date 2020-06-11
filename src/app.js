const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID' });
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get('/repositories', (request, response) => {
  response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (title) {
    repositories[repositoryIndex]['title'] = title;
  }

  if (url) {
    repositories[repositoryIndex]['url'] = url;
  }

  if (techs) {
    repositories[repositoryIndex]['techs'] = techs;
  }

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
  const repository = repositories[repositoryIndex];

  repository.likes = repository.likes + 1;

  return response.status(201).json(repository);
});

module.exports = app;
