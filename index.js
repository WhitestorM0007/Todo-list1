const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// API to get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'todos', 'tasks.json'), 'utf8');
        const tasks = JSON.parse(data);
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.post('/api/tasks', async (req, res) => {
    try {
        const { task } = req.body;

        const data = await fs.readFile(path.join(__dirname, 'todos', 'tasks.json'), 'utf8');
        let tasks = JSON.parse(data);

        // Find the highest ID in the existing tasks
        const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;

        tasks.push({ id: maxId + 1, task });

        await fs.writeFile(path.join(__dirname, 'todos', 'tasks.json'), JSON.stringify(tasks, null, 2));

        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// API to update a task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const { task } = req.body;

        const data = await fs.readFile(path.join(__dirname, 'todos', 'tasks.json'), 'utf8');
        let tasks = JSON.parse(data);

        tasks = tasks.map(t => (t.id === taskId ? { ...t, task } : t));

        await fs.writeFile(path.join(__dirname, 'todos', 'tasks.json'), JSON.stringify(tasks, null, 2));

        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// API to delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);

        const data = await fs.readFile(path.join(__dirname, 'todos', 'tasks.json'), 'utf8');
        let tasks = JSON.parse(data);

        tasks = tasks.filter(t => t.id !== taskId);

        await fs.writeFile(path.join(__dirname, 'todos', 'tasks.json'), JSON.stringify(tasks, null, 2));

        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on Port:${PORT}`);
});
