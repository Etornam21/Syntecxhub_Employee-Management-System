import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEmployee, deleteEmployee, listEmployees, updateEmployee } from './api.js';
import { DEPARTMENTS, formatSalary } from './constants.js';
import EmployeeForm from './components/EmployeeForm.jsx';
import EmployeeTable from './components/EmployeeTable.jsx';
import Modal from './components/Modal.jsx';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [department, setDepartment] = useState('');
  const [formFor, setFormFor] = useState(null); // null = closed, {} = new, employee = edit
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      setEmployees(await listEmployees({ search: debounced, department }));
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debounced, department]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const payroll = useMemo(() => employees.reduce((sum, e) => sum + e.salary, 0), [employees]);

  const handleSave = async (data) => {
    if (formFor?._id) {
      await updateEmployee(formFor._id, data);
      setToast('Changes saved');
    } else {
      await createEmployee(data);
      setToast('Employee added');
    }
    setFormFor(null);
    load();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(toDelete._id);
      setToast('Employee deleted');
      setToDelete(null);
      load();
    } catch (err) {
      setToast(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtering = Boolean(debounced || department);

  return (
    <div className="page">
      <header className="masthead">
        <div>
          <h1>People</h1>
          <p className="summary">
            {loading && !employees.length ? 'Loading…' : (
              <>{employees.length} {employees.length === 1 ? 'employee' : 'employees'} · {formatSalary(payroll)} monthly payroll</>
            )}
          </p>
        </div>
        <button className="btn primary" onClick={() => setFormFor({})}>Add employee</button>
      </header>

      <div className="toolbar">
        <div className="search">
          <label htmlFor="search" className="sr-only">Search employees</label>
          <input id="search" type="search" placeholder="Search by name, email or role" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <label htmlFor="dept-filter" className="sr-only">Filter by department</label>
          <select id="dept-filter" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <main aria-busy={loading}>
        {loadError ? (
          <div className="state error" role="alert">
            <p>{loadError}</p>
            <button className="btn ghost" onClick={load}>Try again</button>
          </div>
        ) : loading && !employees.length ? (
          <div className="state"><p>Loading employees…</p></div>
        ) : employees.length === 0 ? (
          <div className="state">
            {filtering ? (
              <>
                <p>No employees match your search.</p>
                <button className="btn ghost" onClick={() => { setSearch(''); setDepartment(''); }}>Clear filters</button>
              </>
            ) : (
              <>
                <p>No employees yet. Add the first person to get started.</p>
                <button className="btn primary" onClick={() => setFormFor({})}>Add employee</button>
              </>
            )}
          </div>
        ) : (
          <EmployeeTable employees={employees} onEdit={setFormFor} onDelete={setToDelete} />
        )}
      </main>

      <Modal open={formFor !== null} onClose={() => setFormFor(null)} labelledBy="form-title">
        <EmployeeForm
          key={formFor?._id || 'new'}
          employee={formFor?._id ? formFor : null}
          onSubmit={handleSave}
          onCancel={() => setFormFor(null)}
        />
      </Modal>

      <Modal open={Boolean(toDelete)} onClose={() => !deleting && setToDelete(null)} labelledBy="del-title">
        {toDelete && (
          <div className="confirm">
            <h2 id="del-title">Delete {toDelete.name}?</h2>
            <p>This removes their record permanently. You can’t undo this.</p>
            <div className="actions">
              <button className="btn ghost" onClick={() => setToDelete(null)} disabled={deleting}>Keep employee</button>
              <button className="btn danger-solid" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete employee'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <div className="toast" role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
