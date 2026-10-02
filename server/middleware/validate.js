const { body, param, validationResult } = require('express-validator');
const { DEPARTMENTS } = require('../models/Employee');

const employeeRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),
  body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail({ gmail_remove_dots: false }),
  body('role').trim().notEmpty().withMessage('Role is required').isLength({ max: 80 }).withMessage('Role must be 80 characters or fewer'),
  body('department').isIn(DEPARTMENTS).withMessage('Choose a valid department'),
  body('salary').isFloat({ gt: 0 }).withMessage('Salary must be greater than 0').toFloat(),
  body('dateJoined')
    .isISO8601().withMessage('Enter a valid date')
    .custom((v) => new Date(v) <= new Date()).withMessage('Date joined cannot be in the future'),
];

const idRule = [param('id').isMongoId().withMessage('Invalid employee id')];

// Turns express-validator results into { message, errors: { field: message } }
function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = {};
  result.array().forEach((e) => {
    if (!errors[e.path]) errors[e.path] = e.msg;
  });
  return res.status(400).json({ message: 'Please fix the highlighted fields', errors });
}

module.exports = { employeeRules, idRule, handleValidation };
