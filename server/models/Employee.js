const mongoose = require('mongoose');

const DEPARTMENTS = ['Engineering', 'Design', 'Finance', 'HR', 'Marketing', 'Operations', 'Sales', 'Support'];

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name must be 80 characters or fewer'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [80, 'Role must be 80 characters or fewer'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: { values: DEPARTMENTS, message: 'Choose a valid department' },
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [1, 'Salary must be greater than 0'],
    },
    dateJoined: {
      type: Date,
      required: [true, 'Date joined is required'],
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
module.exports.DEPARTMENTS = DEPARTMENTS;
