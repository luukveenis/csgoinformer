/* This code is borrowed from tutorialspoint in their Javascript form
 * validation tutorial.
 * The code can be found here:
 * http://www.tutorialspoint.com/javascript/javascript_form_validations.htm
 */
function validateGeneralForm() {
  nameField = document.generalForm.name;
  emailField = document.generalForm.email;
  messageField = document.generalForm.message;

  if(nameField.value.length < 3) {
    alert("Please provide your full first and last name!");
    return false;
  }

  if(emailField.value == "") {
    alert( "Please provide your email!" );
    return false;
  }

  if(messageField.value == "")
  {
    alert( "Please tell us how we can help you!");
    return false;
  }
  return true;
}
