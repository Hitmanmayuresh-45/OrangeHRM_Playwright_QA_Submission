import { expect, Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  // =========================================================
  // LOGOUT
  // =========================================================

  async logout(): Promise<void> {
    // After employee deletion verification, the browser may
    // still be on the PIM Employee List page.
    // Navigate to Dashboard before logging out.
    await this.page.goto(
      '/web/index.php/dashboard/index'
    );

    // Verify Dashboard is loaded
    await expect(
      this.page,
      'Dashboard should be displayed before logout'
    ).toHaveURL(/dashboard\/index/, {
      timeout: 15000
    });

    await expect(
      this.page.getByRole('heading', {
        name: 'Dashboard',
        exact: true
      }),
      'Dashboard heading should be visible'
    ).toBeVisible({
      timeout: 15000
    });

    // =======================================================
    // OPEN USER PROFILE MENU
    // =======================================================

    const userMenu = this.page.locator(
      '.oxd-userdropdown-tab'
    );

    await expect(
      userMenu,
      'User profile menu should be visible'
    ).toBeVisible({
      timeout: 15000
    });

    await userMenu.click();

    // =======================================================
    // CLICK LOGOUT
    // =======================================================

    const logoutOption = this.page.getByRole(
      'menuitem',
      {
        name: 'Logout'
      }
    );

    await expect(
      logoutOption,
      'Logout option should be visible'
    ).toBeVisible({
      timeout: 10000
    });

    await logoutOption.click();

    // =======================================================
    // VERIFY LOGIN PAGE
    // =======================================================

    await expect(
      this.page,
      'User should be redirected to login page after logout'
    ).toHaveURL(/auth\/login/, {
      timeout: 15000
    });

    await expect(
      this.page.getByRole('button', {
        name: 'Login'
      }),
      'Login button should be visible after logout'
    ).toBeVisible({
      timeout: 10000
    });
  }
}