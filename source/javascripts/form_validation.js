/* This code is borrowed from tutorialspoint in their Javascript form
 * validation tutorial.
 * The code can be found here:
 * http://www.tutorialspoint.com/javascript/javascript_form_validations.htm
 */
function validateGeneralForm() {
  nameField = document.generalForm.name;
  emailField = document.generalForm.email;
  messageField = document.generalForm.message;
  noErrors = true;

  if(nameField.value.length < 3) {
    nameField.className += " form-field-error";
    noErrors = false;
  }

  if(emailField.value == "") {
    emailField.className += " form-field-error";
    noErrors = false;
  }

  if(messageField.value == "")
  {
    messageField.className += " form-field-error";
    noErrors = false;
  }
  return noErrors;
}
