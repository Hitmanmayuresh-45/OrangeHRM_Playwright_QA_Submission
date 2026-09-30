import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async verifyLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(
      this.page.getByRole('heading', { name: 'Dashboard', exact: true })
    ).toBeVisible();
  }
}