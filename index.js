const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

// Criando Middleware de check de projeto existente
function checkProjectExists(req,res,next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if(!project) {
        return res.status(400).json({ error: `Não existe projeto.`});
    }

    return next();
}

// Criando Middleware de Log

function logCheck( req,res,next ) {
    console.count("Número de requisições");

    return next();
}

server.use(logCheck);



// Criando ID, titulo e tarefas
server.post('/projects' , (req,res) => {
    const { id, title} = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
})

// Listando todos os ID, títulos e tarefas
server.get('/projects', (req,res) =>{
    return res.json(projects);
})


// Listando apenas 1 ID, título e tarefa
server.get('/projects/:id', checkProjectExists, (req,res) =>{
    const { id } = req.params;

    return res.json(projects[id]);
})

// Alterando apenas as tarefas
server.put('/projects/:id', checkProjectExists, (req,res) =>{
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
})

// Deletando uma tarefa
server.delete('/projects/:id', (req,res) => {
    const { id } = req.params;

    const projectID = projects.findIndex(p => p.id == id);

    projects.splice(projectID, 1);

    return res.send();
})

// Adicionando uma Tarefa a uma rota 
server.post('/projects/:id/tasks',checkProjectExists, (req,res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
})

server.listen(3003);