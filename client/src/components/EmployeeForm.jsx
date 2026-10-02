import { useEffect, useRef, useState } from 'react';
import { DEPARTMENTS, toInputDate } from '../constants.js';

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = { name: '', email: '', role: '', department: '', salary: '', dateJoined: '' };

function validate(v) {
  const e = {};
  const name = v.name.trim();
  if (!name) e.name = 'Enter the employee’s name';
  else if (name.length < 2) e.name = 'Name must be at least 2 characters';
  else if (name.length > 80) e.name = 'Name must be 80 characters or fewer';

  if (!v.email.trim()) e.email = 'Enter an email address';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Enter a valid email address, like name@company.com';

  if (!v.role.trim()) e.role = 'Enter a role';
  else if (v.role.trim().length > 80) e.role = 'Role must be 80 characters or fewer';

  if (!v.department) e.department = 'Choose a department';

  if (v.salary === '' || v.salary === null) e.salary = 'Enter a salary';
  else if (Number.isNaN(Number(v.salary)) || Number(v.salary) <= 0) e.salary = 'Salary must be greater than 0';

  if (!v.dateJoined) e.dateJoined = 'Choose the date they joined';
  else if (v.dateJoined > today()) e.dateJoined = 'Date joined cannot be in the future';
  return e;
}

export default function EmployeeForm({ employee, onSubmit, onCancel }) {
  const editing = Boolean(employee);
  const [values, setValues] = useState(
    employee ? { ...employee, salary: String(employee.salary), dateJoined: toInputDate(employee.dateJoined) } : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const firstRef = useRef(null);

  useEffect(() => firstRef.current?.focus(), []);

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role.trim(),
        department: values.department,
        salary: Number(values.salary),
        dateJoined: values.dateJoined,
      });
    } catch (err) {
      // Server-side errors (e.g. duplicate email) land on the matching field
      if (err.errors && Object.keys(err.errors).length) setErrors(err.errors);
      setFormError(err.message);
      setSaving(false);
    }
  };

  const field = (id, label, input) => (
    <div className={`field ${errors[id] ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {input}
      {errors[id] && <p className="field-error" id={`${id}-err`}>{errors[id]}</p>}
    </div>
  );

  const common = (id) => ({
    id,
    value: values[id],
    onChange: set(id),
    'aria-invalid': errors[id] ? 'true' : undefined,
    'aria-describedby': errors[id] ? `${id}-err` : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 id="form-title">{editing ? 'Edit employee' : 'Add employee'}</h2>
      {formError && <p className="form-error" role="alert">{formError}</p>}

      <div className="grid">
        {field('name', 'Full name', <input {...common('name')} ref={firstRef} type="text" autoComplete="off" />)}
        {field('email', 'Email', <input {...common('email')} type="email" autoComplete="off" />)}
        {field('role', 'Role', <input {...common('role')} type="text" placeholder="e.g. Backend developer" />)}
        {field(
          'department',
          'Department',
          <select {...common('department')}>
            <option value="">Choose…</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        )}
        {field('salary', 'Monthly salary (GHS)', <input {...common('salary')} type="number" inputMode="decimal" min="0" step="any" />)}
        {field('dateJoined', 'Date joined', <input {...common('dateJoined')} type="date" max={today()} />)}
      </div>

      <div className="actions">
        <button type="button" className="btn ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Add employee'}
        </button>
      </div>
    </form>
  );
}
