export const DEPARTMENTS = ['Engineering', 'Design', 'Finance', 'HR', 'Marketing', 'Operations', 'Sales', 'Support'];

export const formatSalary = (n) =>
  new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 }).format(n);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const toInputDate = (d) => new Date(d).toISOString().slice(0, 10);
