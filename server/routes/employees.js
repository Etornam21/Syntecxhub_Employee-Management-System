const express = require('express');
const Employee = require('../models/Employee');
const { employeeRules, idRule, handleValidation } = require('../middleware/validate');

const router = express.Router();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// LIST — optional ?search= and ?department=
router.get('/', async (req, res, next) => {
  try {
    const { search, department } = req.query;
    const filter = {};
    if (department && typeof department === 'string') filter.department = department;
    if (search && typeof search === 'string') {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [{ name: rx }, { email: rx }, { role: rx }];
    }
    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

// READ ONE
router.get('/:id', idRule, handleValidation, async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// CREATE
router.post('/', employeeRules, handleValidation, async (req, res, next) => {
  try {
    const { name, email, role, department, salary, dateJoined } = req.body;
    const employee = await Employee.create({ name, email, role, department, salary, dateJoined });
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

// UPDATE
router.put('/:id', idRule, employeeRules, handleValidation, async (req, res, next) => {
  try {
    const { name, email, role, department, salary, dateJoined } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, role, department, salary, dateJoined },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete('/:id', idRule, handleValidation, async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted', id: employee._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
