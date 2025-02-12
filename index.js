const express = require('express');
const app = express();
const Task = require('./models/Task');
const Category = require('./models/Category');
const sequelize = require('./config/database');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { generateToken, comparePasswords } = require('./auth');
const { authenticateUser } = require('./middleware/authMiddleware');

require('dotenv').config();




app.use(express.json());

app.post('register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required'});
        }



        const existingUser = await User.findOne({ where: { email } });
        if(existingUser) {
            return res.status(400).json({ error: 'User with this email exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({ username, email, password: hashedPassword });

        const token = generateToken(user);

        res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email }});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error registering user'});
    }
})


// POST LOGIN
app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const token = generateToken(user);
  
      res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error logging in user' });
    }
  });
  


// Post / categories

app.post('/categories', authenticateUser, async (req, res) => {
    try {
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }
  
      const category = await Category.create({ name, userId: req.user.id });  
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the category.' });
    }
  });
  


  app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API!');
});


app.post('/categories', authenticateUser, async (req, res) => {
    try {
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }
  
      const category = await Category.create({ name, userId: req.user.id });  
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the category.' });
    }
  });
  
  app.post('/tasks', authenticateUser, async (req, res) => {
    try {
      const { title, description, categoryId } = req.body;
  
      const category = await Category.findOne({ where: { id: categoryId, userId: req.user.id } });
      if (!category) {
        return res.status(400).json({ error: 'Invalid category ID or unauthorized access' });
      }
  
      const task = await Task.create({ title, description, categoryId, userId: req.user.id });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
