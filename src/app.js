const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query

    const results = title 
        ? repositories.filter(repository => repository.title.includes(title))
        : repositories

    return response.json(results)

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
  }

  repositories.push(repository)
  console.log(repository)
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params
  

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Repository not exists" })
  }

  const { likes } = repositories[repositoryIndex]

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository
  
  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Repository not exists" })
  }

  repositories.splice(repositoryIndex,1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Repository not exists" })
  }

  repositories.map(repository => {
    if(repository.id === id){
      repository.likes= repository.likes +1
      return response.json(repository)
    }
  })

});

module.exports = app;
