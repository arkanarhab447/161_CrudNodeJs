const express = require('express');
const router = express.Router();

let todos = []; // Initialize an empty array to store todos

// GET all todos
router.get('/', (req, res) => {
    res.json(todos);
});

// POST a new todo
router.post('/', (req, res) => {
    const newTodo = {
        id: todos.length + 1,
        task: req.body.task,
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// DELETE a todo by ID
router.delete('/:id', (req, res) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0]; // Corrected the splice method
    res.status(200).json({ message: `Tugas '${deletedTodo.task}' telah dihapus` });
});

// PUT (update) a todo by ID
router.put('/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }
    todo.task = req.body.task || todo.task;

    res.status(200).json({
        message: `Tugas dengan ID ${todo.id} telah diperbarui`,
        updatedTodo: todo
    });
});

module.exports = router;