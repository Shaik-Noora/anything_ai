const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    let query;

    // Admin can see all tasks, users see only theirs
    if (req.user.role === 'admin') {
      query = Task.find().populate('user', 'name email');
    } else {
      query = Task.find({ user: req.user.id });
    }

    const tasks = await query;
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      status,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Make sure user owns task or is admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('User not authorized');
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Make sure user owns task or is admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('User not authorized');
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Make sure user owns task or is admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('User not authorized');
    }

    await task.deleteOne();

    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
