const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

const eventosFilePath = path.join(__dirname, 'eventos.json');

// Função para ler os eventos do arquivo JSON
const getEventos = () => {
    const data = fs.readFileSync(eventosFilePath, 'utf8');
    return JSON.parse(data);
};

// Função para escrever os eventos no arquivo JSON
const saveEventos = (eventos) => {
    fs.writeFileSync(eventosFilePath, JSON.stringify(eventos, null, 2), 'utf8');
};

// Obter todos os eventos
app.get('/api/eventos', (req, res) => {
    const eventos = getEventos();
    res.status(200).send(eventos);
});

// Obter um evento por ID
app.get('/api/eventos/:id', (req, res) => {
    const eventos = getEventos();
    const evento = eventos.find(e => e.id === parseInt(req.params.id));
    if (!evento) {
        return res.status(404).send('Evento não encontrado');
    }
    res.status(200).send(evento);
});

// Criar um novo evento
app.post('/api/eventos', (req, res) => {
    const eventos = getEventos();
    const novoEvento = {
        id: eventos.length + 1,
        ...req.body
    };
    eventos.push(novoEvento);
    saveEventos(eventos);
    res.status(201).send(novoEvento);
});

// Atualizar um evento por ID
app.patch('/api/eventos/:id', (req, res) => {
    const eventos = getEventos();
    const eventoIndex = eventos.findIndex(e => e.id === parseInt(req.params.id));
    if (eventoIndex === -1) {
        return res.status(404).send('Evento não encontrado');
    }
    Object.assign(eventos[eventoIndex], req.body);
    saveEventos(eventos);
    res.status(200).send(eventos[eventoIndex]);
});

// Deletar um evento por ID
app.delete('/api/eventos/:id', (req, res) => {
    const eventos = getEventos();
    const eventoIndex = eventos.findIndex(e => e.id === parseInt(req.params.id));
    if (eventoIndex === -1) {
        return res.status(404).send('Evento não encontrado');
    }
    const eventoDeletado = eventos.splice(eventoIndex, 1);
    saveEventos(eventos);
    res.status(200).send(eventoDeletado);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
