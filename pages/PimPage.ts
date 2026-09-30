import { expect, Page } from '@playwright/test';
import { EmployeeData } from '../utils/testData';

export class PimPage {
  constructor(private readonly page: Page) {}

  // OPEN PIM
  

  private async openPim(): Promise<void> {
    await this.page
      .getByRole('link', { name: 'PIM' })
      .click();

    await expect(
      this.page,
      'PIM page should be displayed'
    ).toHaveURL(/pim/);
  }


  // ADD EMPLOYEE
  

  async addEmployee(data: EmployeeData): Promise<void> {
    await this.openPim();

    await this.page
      .getByRole('link', { name: 'Add Employee' })
      .click();

    await expect(
      this.page,
      'Add Employee page should be displayed'
    ).toHaveURL(/pim\/addEmployee/);

    // First Name
    await this.page
      .getByPlaceholder('First Name')
      .fill(data.firstName);

    // Last Name
    await this.page
      .getByPlaceholder('Last Name')
      .fill(data.lastName);

    // Employee ID
    const employeeIdInput = this.page
      .locator('.oxd-input-group')
      .filter({
        has: this.page.getByText('Employee Id', {
          exact: true
        })
      })
      .locator('input');

    await expect(
      employeeIdInput,
      'Employee ID input should be available'
    ).toHaveCount(1);

    await employeeIdInput.fill(data.employeeId);

    // Profile Picture
    await this.page
      .locator('input[type="file"]')
      .setInputFiles(data.profilePicture);

    // Save
    await this.page
      .getByRole('button', {
        name: 'Save',
        exact: true
      })
      .click();

    // Verify successful save
    await expect(
      this.page.getByText(/successfully saved/i),
      'Employee should be saved successfully'
    ).toBeVisible({
      timeout: 15000
    });
  }

  
  // SEARCH EMPLOYEE
  

  async searchEmployee(employeeId: string): Promise<void> {
    await this.page.goto(
      '/web/index.php/pim/viewEmployeeList'
    );

    await expect(
      this.page,
      'Employee List page should be displayed'
    ).toHaveURL(/pim\/viewEmployeeList/);

    const employeeIdInput = this.page
      .locator('.oxd-input-group')
      .filter({
        has: this.page.getByText('Employee Id', {
          exact: true
        })
      })
      .locator('input');

    await expect(
      employeeIdInput,
      'Employee ID search field should be available'
    ).toHaveCount(1);

    await employeeIdInput.fill(employeeId);

    const searchButton = this.page.locator(
      'button.oxd-button--secondary',
      {
        hasText: 'Search'
      }
    );

    await expect(
      searchButton,
      'Search button should be visible'
    ).toBeVisible({
      timeout: 10000
    });

    await searchButton.click();

  
    await this.page.waitForLoadState('networkidle');

    
    await this.page.waitForTimeout(500);
  }

  
  // OPEN EMPLOYEE
  

  async openEmployee(employeeId: string): Promise<void> {
    await this.searchEmployee(employeeId);

    const row = this.page
      .getByRole('row')
      .filter({
        hasText: employeeId
      });

    await expect(
      row,
      `Employee ${employeeId} should appear in search results`
    ).toBeVisible({
      timeout: 15000
    });

    await row
      .locator('button')
      .first()
      .click();

    await expect(
      this.page,
      'Employee details page should open'
    ).toHaveURL(/pim\/viewPersonalDetails/);
  }

  
  // OPEN JOB TAB
  

  private async openJobTab(): Promise<void> {
    const jobTab = this.page
      .locator('.orangehrm-tabs-item')
      .filter({
        hasText: 'Job'
      })
      .first();

    await expect(
      jobTab,
      'Job tab should be available'
    ).toBeVisible({
      timeout: 10000
    });

    await jobTab.click();

    await expect(
      this.page
        .locator('.oxd-form')
        .getByText('Job Title', {
          exact: true
        }),
      'Job Title field should be displayed'
    ).toBeVisible({
      timeout: 10000
    });

    
    await expect(
      this.page.locator('.oxd-form-loader'),
      'OrangeHRM form should finish loading'
    ).toBeHidden({
      timeout: 15000
    });
  }

  
  // SELECT CUSTOM DROPDOWN
  

  private async selectCustomDropdown(
    label: string,
    option: string
  ): Promise<void> {
    const group = this.page
      .locator('.oxd-input-group')
      .filter({
        has: this.page.getByText(label, {
          exact: true
        })
      })
      .first();

    await expect(
      group,
      `${label} field should be available`
    ).toBeVisible({
      timeout: 10000
    });

    // Wait for OrangeHRM loading overlay
    await expect(
      this.page.locator('.oxd-form-loader'),
      'OrangeHRM form should finish loading'
    ).toBeHidden({
      timeout: 15000
    });

    const dropdown = group
      .locator('.oxd-select-text')
      .first();

    await expect(
      dropdown,
      `${label} dropdown should be visible`
    ).toBeVisible({
      timeout: 10000
    });

    await dropdown.click();

    const options = this.page.locator(
      '.oxd-select-option'
    );

    await expect(
      options.first(),
      `${label} dropdown options should appear`
    ).toBeVisible({
      timeout: 10000
    });

    console.log(
      `Available ${label} options:`,
      await options.allTextContents()
    );

    const optionLocator = options
      .filter({
        hasText: option
      })
      .first();

    await expect(
      optionLocator,
      `${option} should be available in ${label} dropdown`
    ).toBeVisible({
      timeout: 10000
    });

    await optionLocator.click();
  }

  
  // UPDATE EMPLOYEE
  

  async updateEmployee(
    jobTitle: string,
    employmentStatus: string
  ): Promise<void> {
    await this.openJobTab();

    // Update Job Title
    await this.selectCustomDropdown(
      'Job Title',
      jobTitle
    );

    // Update Employment Status
    await this.selectCustomDropdown(
      'Employment Status',
      employmentStatus
    );

    // Save
    await this.page
      .getByRole('button', {
        name: 'Save',
        exact: true
      })
      .click();

    // Verify update
    await expect(
      this.page.getByText(/successfully updated/i),
      'Employee job details should be updated successfully'
    ).toBeVisible({
      timeout: 15000
    });
  }

  
  // VERIFY UPDATED EMPLOYEE DETAILS
  

  async verifyEmployeeDetails(
    jobTitle: string,
    employmentStatus: string
  ): Promise<void> {
    const jobGroup = this.page
      .locator('.oxd-input-group')
      .filter({
        has: this.page.getByText('Job Title', {
          exact: true
        })
      })
      .first();

    const statusGroup = this.page
      .locator('.oxd-input-group')
      .filter({
        has: this.page.getByText(
          'Employment Status',
          {
            exact: true
          }
        )
      })
      .first();

    await expect(
      jobGroup.locator('.oxd-select-text'),
      'Updated Job Title should be displayed'
    ).toContainText(jobTitle);

    await expect(
      statusGroup.locator('.oxd-select-text'),
      'Updated Employment Status should be displayed'
    ).toContainText(employmentStatus);
  }

  
  // DELETE EMPLOYEE
  

  async deleteEmployee(employeeId: string): Promise<void> {
    // Search employee first
    await this.searchEmployee(employeeId);

    // Locate employee row
    const row = this.page
      .getByRole('row')
      .filter({
        hasText: employeeId
      });

    // Employee must exist before deletion
    await expect(
      row,
      `Employee ${employeeId} should exist before deletion`
    ).toBeVisible({
      timeout: 15000
    });

    
    // OrangeHRM uses a custom checkbox.
    // Do NOT use:
    //
    // input[type="checkbox"].check()
    //
    // because the visible checkbox wrapper intercepts clicks.
    // -------------------------------------------------------

    const checkbox = row.locator(
      '.oxd-checkbox-wrapper .oxd-checkbox-input'
    );

    await expect(
      checkbox,
      `Employee ${employeeId} checkbox should be visible`
    ).toBeVisible({
      timeout: 10000
    });

    // Select employee
    await checkbox.click();

    
    // Click Delete Selected
   

    const deleteSelectedButton = this.page.getByRole(
      'button',
      {
        name: /delete selected/i
      }
    );

    await expect(
      deleteSelectedButton,
      'Delete Selected button should be visible'
    ).toBeVisible({
      timeout: 10000
    });

    await deleteSelectedButton.click();

  
    // Confirm deletion
  

    const confirmDeleteButton = this.page.getByRole(
      'button',
      {
        name: /Yes, Delete/i
      }
    );

    await expect(
      confirmDeleteButton,
      'Delete confirmation button should be visible'
    ).toBeVisible({
      timeout: 10000
    });

    await confirmDeleteButton.click();

    
    // Verify successful deletion notification
   

    await expect(
      this.page.getByText(/successfully deleted/i),
      'Employee should be deleted successfully'
    ).toBeVisible({
      timeout: 15000
    });
  }

  // VERIFY EMPLOYEE IS DELETED
 

  async verifyEmployeeAbsent(
    employeeId: string
  ): Promise<void> {
    // Navigate directly to Employee List
    await this.page.goto(
      '/web/index.php/pim/viewEmployeeList'
    );

    await expect(
      this.page,
      'Employee List page should be displayed'
    ).toHaveURL(/pim\/viewEmployeeList/);

    // Employee ID search field
    const employeeIdInput = this.page
      .locator('.oxd-input-group')
      .filter({
        has: this.page.getByText('Employee Id', {
          exact: true
        })
      })
      .locator('input');

    await expect(
      employeeIdInput,
      'Employee ID search field should be available'
    ).toHaveCount(1);

    // Search deleted employee
    await employeeIdInput.fill(employeeId);

    const searchButton = this.page.locator(
      'button.oxd-button--secondary',
      {
        hasText: 'Search'
      }
    );

    await expect(
      searchButton,
      'Search button should be visible'
    ).toBeVisible({
      timeout: 10000
    });

    await searchButton.click();

    // Wait for search request/rendering
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(1000);

  
    // Verify employee row does NOT exist.
    // This is more reliable than checking only:
    // "No Records Found"
    

    const employeeRow = this.page
      .getByRole('row')
      .filter({
        hasText: employeeId
      });

    await expect(
      employeeRow,
      `Employee ${employeeId} should not appear after deletion`
    ).toHaveCount(0, {
      timeout: 15000
    });

    // Optional informational check
    const noRecordsMessage = this.page.getByText(
      /no records found/i
    );

    if (await noRecordsMessage.count() > 0) {
      console.log(
        `No Records Found displayed for deleted employee ${employeeId}`
      );
    } else {
      console.log(
        `Employee ${employeeId} row is absent after deletion`
      );
    }
  }
}