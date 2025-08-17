import { register } from "module";

export const locators = {
  
  // Form fields (using IDs)
  firstName: '#firstName',
  lastName: '#lastName',
  email: '#email',
  usuario: '#username',
  maleRadioButton: 'sexoM',
  femaleRadioButton: 'sexoF',
  countryDropdown: '#country',
  password: '#password',
  registerButton: '#btnRegister',

  // phoneNumber: '#Phno',
  // addressLine1: '#Addl1',
  // addressLine2: '#Addl2',
  // state: '#state',
  // postalcode: '#postalcode',
};
export const placeholderLocators = {
  register: '#btnRegister',

};

export const errorLocators = {

  firstNameError: '#firstNameError',
  lastNameError: '#lastNameError',
  emailError: '#emailError',
  passwordError: '#passwordError',

};