import fs from 'fs';
import path from 'path';

export type EmployeeData = {
  firstName: string;
  lastName: string;
  employeeId: string;
  jobTitle: string;
  employmentStatus: string;
  updatedJobTitle: string;
  profilePicture: string;
};

export function getEmployeeData(): EmployeeData {
  const file = path.resolve(__dirname, '../data/employee.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf-8')) as EmployeeData;
  const timestamp = Date.now().toString().slice(-6);
  return {
    ...data,
    employeeId: data.employeeId.replace('${timestamp}', timestamp),
    profilePicture: path.resolve(__dirname, '..', data.profilePicture)
  };
}
