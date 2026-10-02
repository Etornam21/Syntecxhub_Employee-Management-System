import { formatDate, formatSalary } from '../constants.js';

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Employee</th>
          <th scope="col">Role</th>
          <th scope="col">Department</th>
          <th scope="col" className="num">Salary</th>
          <th scope="col">Joined</th>
          <th scope="col"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {employees.map((e) => (
          <tr key={e._id}>
            <td data-label="Employee">
              <span className="name">{e.name}</span>
              <span className="email">{e.email}</span>
            </td>
            <td data-label="Role">{e.role}</td>
            <td data-label="Department"><span className={`dept dept-${e.department}`}>{e.department}</span></td>
            <td data-label="Salary" className="num">{formatSalary(e.salary)}</td>
            <td data-label="Joined">{formatDate(e.dateJoined)}</td>
            <td className="row-actions">
              <button className="btn small ghost" onClick={() => onEdit(e)} aria-label={`Edit ${e.name}`}>Edit</button>
              <button className="btn small danger" onClick={() => onDelete(e)} aria-label={`Delete ${e.name}`}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
