const express = require('express');
const app = express();
const Task = require('./models/Task');
const Category = require('./models/Category');
const sequelize = require('./config/database');
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API!');
});


app.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the category.' });
  }
});


app.post('/tasks', async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;
    
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const task = await Task.create({ title, description, categoryId });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'An error occurred while creating the task.' });
  }
});

app.get('/tasks', async (req, res) => {
  const { categoryId } = req.query;  

  try {
    let tasks;
    if (categoryId) {
      tasks = await Task.findAll({
        where: { deleted: false, categoryId },
        include: Category,  
      });
    } else {
      tasks = await Task.findAll({
        where: { deleted: false },
        include: Category,  
      });
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching tasks.' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, deleted: false }, include: Category });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or deleted' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the task.' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const { title, description, completed, categoryId } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }
      task.categoryId = categoryId;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the task.' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.deleted = true;
    await task.save();
    res.status(200).json({ message: 'Task marked as deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the task.' });
  }
});

app.post('/tasks/restore/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task || task.deleted === false) {
      return res.status(404).json({ error: 'Task not found or already active' });
    }

    task.deleted = false;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while restoring the task.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.sync(); 
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error('Failed to sync database:', err);
  }
});
