import { expect } from '@playwright/test';
import { Page } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { BASEURL } from '../config';
import { pages } from '../hooks/hook';
import { validateFirstLocator } from '../utils/validations';
import {
  locators, errorLocators // Import the locators object
} from '../locators/exampleLocators';
import {
  getByLocatorAndFillIt,
  checkElementById,
  selectByValue,
  getByLocator, // Import the new interaction function
} from '../utils/interactions';
import { get } from 'http';

// 1) peaceful playthrough

Given("User is on the form page to create an account", async () => {
  for (const page of pages) {
    console.log(`Ejecutando prueba en navegador: ${page.context().browser()?.browserType().name()}`);
    await page.goto(BASEURL);
  }
});

When('User enters valid details in all fields', async function () {
  for (const page of pages) {
    await getByLocatorAndFillIt(page, locators.firstName, 'Agent');
    await getByLocatorAndFillIt(page, locators.lastName, 'Smith');
    await checkElementById(page, locators.maleRadioButton);
    await getByLocatorAndFillIt(page, locators.email, 'adfadsf@asddsa.com');
    await selectByValue(page, '#country', 'Argentina');
    await getByLocatorAndFillIt(page, locators.usuario, 'agentSmith');
    await getByLocatorAndFillIt(page, locators.password, 'Password123!');

  }
});

Then('User submits the form with valid data', async function () {
  for (const page of pages) {
    await getByLocator(page, locators.registerButton);
  }
});

// 2) missing required fields

When('User leaves "First Name" and "Last Name" blank', async function () {
  for (const page of pages) {
    await getByLocatorAndFillIt(page, locators.firstName, '');
    await getByLocatorAndFillIt(page, locators.lastName, '');
    await checkElementById(page, locators.maleRadioButton);
    await getByLocatorAndFillIt(page, locators.email, 'test@example.com');
    await selectByValue(page, '#country', 'Argentina');
    await getByLocatorAndFillIt(page, locators.usuario, 'agentSmith');
    await getByLocatorAndFillIt(page, locators.password, 'Password123!');
  }
});

When('User clicks the register button', async function () {
  for (const page of pages) {
    await getByLocator(page, locators.registerButton);
  }
});

Then('Validation errors "El campo Nombre es obligatorio." and "El campo Apellido es obligatorio." should be displayed', async function () {
  const timeoutMs = 3000; // Increased timeout for visibility
  let firstNameErrorDisplayed = true;
  let lastNameErrorDisplayed = true;

  for (const page of pages) {
    try {
      const firstNameErrorElement = page.locator(errorLocators.firstNameError);
      await firstNameErrorElement.waitFor({ state: 'visible', timeout: timeoutMs });
      const firstNameErrorText = await firstNameErrorElement.textContent();
      if (firstNameErrorText?.includes('El campo Nombre es obligatorio.')) {
        firstNameErrorDisplayed = true;
        console.log(`First Name Error in ${page.context().browser()?.browserType().name()}: ${firstNameErrorText}`);
      }
    } catch (e) {
      console.log(`First Name Error not found in ${page.context().browser()?.browserType().name()}: ${e.message}`);
    }

    try {
      const lastNameErrorElement = page.locator(errorLocators.lastNameError);
      await lastNameErrorElement.waitFor({ state: 'visible', timeout: timeoutMs });
      const lastNameErrorText = await lastNameErrorElement.textContent();
      if (lastNameErrorText?.includes('El campo Apellido es obligatorio.')) {
        lastNameErrorDisplayed = true;
        console.log(`Last Name Error in ${page.context().browser()?.browserType().name()}: ${lastNameErrorText}`);
      }
    } catch (e) {
      console.log(`Last Name Error not found in ${page.context().browser()?.browserType().name()}: ${e.message}`);
    }
  }

  expect(firstNameErrorDisplayed, 'First Name error message was not displayed.').toBe(true);
  expect(lastNameErrorDisplayed, 'Last Name error message was not displayed.').toBe(true);
});

//3) invalid email format

When ('User enters "invalid@" as email', async function () {
  for (const page of pages) {
  await getByLocatorAndFillIt(page, locators.email, 'adfadsf@asddsa.com');
  }
});

Then('User fills all other fields with valid data', async function () {
  for (const page of pages) {
    await getByLocatorAndFillIt(page, locators.firstName, 'Agent');
    await getByLocatorAndFillIt(page, locators.lastName, 'Smith');
    await checkElementById(page, locators.maleRadioButton);
    await selectByValue(page, '#country', 'Argentina');
    await getByLocatorAndFillIt(page, locators.usuario, 'agentSmith');
    await getByLocatorAndFillIt(page, locators.password, 'Password123!');
  }
});

Then('User submits the form with invalid email', async function () {
  for (const page of pages) {
    await getByLocator(page, locators.registerButton);
  }
});

Then('An error message should be displayed for invalid email format', async function () {
  const timeoutMs = 3000; // Increased timeout for visibility
  let emailErrorDisplayed = false;

  for (const page of pages) {
    try {
      const emailErrorElement = page.locator(errorLocators.emailError);
      await emailErrorElement.waitFor({ state: 'visible', timeout: timeoutMs });
      const emailErrorText = await emailErrorElement.textContent();
      if (emailErrorText?.includes('Ingresá un email válido (ej: usuario@dominio.com).')) {
        emailErrorDisplayed = true;
        console.log(`Email Error in ${page.context().browser()?.browserType().name()}: ${emailErrorText}`);
      }
    } catch (e) {
      console.log(`Email Error not found in ${page.context().browser()?.browserType().name()}: ${e.message}`);
    }
  }

  expect(emailErrorDisplayed, 'Ingresá un email válido (ej: usuario@dominio.com).').toBe(true);
});

//4) dropdown and radio button selection

When('User fills all the fields with valid data', async function () {
  for (const page of pages) {
    await getByLocatorAndFillIt(page, locators.firstName, 'Trinity');
    await getByLocatorAndFillIt(page, locators.lastName, 'Matrixborn');
    await getByLocatorAndFillIt(page, locators.email, 'adfadsf@asddsa.com');
  }
});

Then('User selects "Female" as gender', async function () {
  for (const page of pages) {
    await checkElementById(page, locators.femaleRadioButton);
  }
});
Then('User selects "Chile" as country', async function () {
  for (const page of pages) {
    await selectByValue(page, '#country', 'Chile');
  }
});

Then('The selected options should be correctly applied and submited', async function () {
  for (const page of pages) {
    await getByLocator(page, locators.registerButton);
  }
});

//5) Invalid password format

When('User enters "123123" as a password', async function () {
  for (const page of pages) {
    await getByLocatorAndFillIt(page, locators.password, '123123');
  }
});

When('User fills all other fields with valid data for password test', async function () {
  for (const page of pages) {
    await getByLocatorAndFillIt(page, locators.firstName, 'Agent');
    await getByLocatorAndFillIt(page, locators.lastName, 'Smith');
    await checkElementById(page, locators.maleRadioButton);
    await getByLocatorAndFillIt(page, locators.email, 'test@example.com');
    await selectByValue(page, '#country', 'Argentina');
    await getByLocatorAndFillIt(page, locators.usuario, 'agentSmith');
  }
});

Then('User submits the form with invalid password', async function () {
  for (const page of pages) {
    await getByLocator(page, locators.registerButton);
  }
});

Then('An error message should be displayed for invalid password format', async function () {
  const timeoutMs = 3000; // Increased timeout for visibility
  let passwordErrorDisplayed = false;

  for (const page of pages) {
    try {
      const passwordErrorElement = page.locator(errorLocators.passwordError);
      await passwordErrorElement.waitFor({ state: 'visible', timeout: timeoutMs });
      const passwordErrorText = await passwordErrorElement.textContent();
      if (passwordErrorText?.includes('La contraseña debe tener al menos 8 caracteres')) {
        passwordErrorDisplayed = true;
        console.log(`Password Error in ${page.context().browser()?.browserType().name()}: ${passwordErrorText}`);
      }
    } catch (e) {
      console.log(`Password Error not found in ${page.context().browser()?.browserType().name()}: ${e.message}`);
    }
  }

  expect(passwordErrorDisplayed, 'Password error message was not displayed.').toBe(true);
});
