import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import { DashboardPage } from '../pages/DashboardPage';
import { getEmployeeData } from '../utils/testData';
import { ApiClient } from '../utils/apiClient';

const employee = getEmployeeData();

test.describe('Employee Lifecycle Management', () => {
  test('Create -> Update -> API validate -> Delete -> Logout', async ({ page, request }) => {
    const login = new LoginPage(page);
    const pim = new PimPage(page);
    const dashboard = new DashboardPage(page);
    const api = new ApiClient(request, process.env.REQRES_BASE_URL || 'https://reqres.in', process.env.REQRES_API_KEY);

    await test.step('1. Login', async () => {
      await login.goto();
      await login.login(process.env.ORANGEHRM_USERNAME || 'Admin', process.env.ORANGEHRM_PASSWORD || 'admin123');
      await login.verifyLoggedIn();
    });

    await test.step('2. Add employee from JSON data and upload profile picture', async () => {
      await pim.addEmployee(employee);
      await pim.searchEmployee(employee.employeeId);
      await expect(page.getByRole('row').filter({ hasText: employee.employeeId })).toBeVisible();
    });

    await test.step('3. Edit job title and employment status', async () => {
      await pim.openEmployee(employee.employeeId);
      await pim.updateEmployee(employee.updatedJobTitle, employee.employmentStatus);
      await pim.verifyEmployeeDetails(employee.updatedJobTitle, employee.employmentStatus);
    });

    await test.step('4. Validate employee data through public API simulation', async () => {
      const created = await api.createEmployeeLikeRecord(employee.firstName, employee.lastName, employee.jobTitle);
      expect(created.name).toBe(`${employee.firstName} ${employee.lastName}`);
      expect(created.job).toBe(employee.jobTitle);

      const updated = await api.updateEmployeeLikeRecord(
        created.id,
        `${employee.firstName} ${employee.lastName}`,
        employee.updatedJobTitle
      );
      expect(updated.name).toBe(`${employee.firstName} ${employee.lastName}`);
      expect(updated.job).toBe(employee.updatedJobTitle);
    });

    await test.step('5. Delete employee from UI and validate API delete response', async () => {
      await pim.deleteEmployee(employee.employeeId);
      await pim.verifyEmployeeAbsent(employee.employeeId);

      // ReqRes demo write endpoints return CRUD status responses but anonymous demo writes are not persistent.
      // Therefore the API deletion assertion validates the DELETE contract rather than querying a deleted record.
      const apiRecord = await api.createEmployeeLikeRecord(employee.firstName, employee.lastName, employee.updatedJobTitle);
      await api.deleteEmployeeLikeRecord(apiRecord.id);
    });

    await test.step('6. Logout and verify session is no longer on dashboard', async () => {
      await dashboard.logout();
      await page.reload();
      await expect(page).toHaveURL(/auth\/login/);
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
  });
});
