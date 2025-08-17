@Smoke
Feature: Filling a form in Formulario de QArmy

  Background:
        Given User is on the form page to create an account

  # 1. Happy path - all valid data
  Scenario: User fills the form with valid data
    When User enters valid details in all fields
    Then User submits the form with valid data

  # 2. Invalid registration without first name and last name
  Scenario: User attempts to register without first name and last name
    When User leaves "First Name" and "Last Name" blank
    And User clicks the register button
    Then Validation errors "El campo Nombre es obligatorio." and "El campo Apellido es obligatorio." should be displayed

  # 3. Invalid email format
  Scenario: User enters an invalid email
    When User enters "invalid@" as email
    And User fills all other fields with valid data
    And User submits the form with invalid email
    Then An error message should be displayed for invalid email format

  # 4. Dropdown and radio button selection
  Scenario: User selects country and different gender
    When User fills all the fields with valid data
    And User selects "Female" as gender
    And User selects "Chile" as country
    Then The selected options should be correctly applied and submited

  # 5. Invalid password format
  Scenario: User enters an invalid password format
    When User enters "123123" as a password
    And User fills all other fields with valid data
    And User submits the form with invalid password
    Then An error message should be displayed for invalid password format

  
