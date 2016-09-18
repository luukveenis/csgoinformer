/* This code is borrowed from tutorialspoint in their Javascript form
 * validation tutorial.
 * The code can be found here:
 * http://www.tutorialspoint.com/javascript/javascript_form_validations.htm
 */
window.FormValidations = {

  /* Function that validates general contact form fields: name, email and message */
  validateGeneralForm: function(event) {
    form = event.target;
    nameField = form.name;
    emailField = form.email;
    messageField = form.message;
    noErrors = true;

    /* A name must have at least a first and last name separated by a space, so
     * it cannot be shorter than 3 characters */
    if(nameField.value.length < 3) {
      nameField.className += " form-field-error";
      nameField.nextElementSibling.innerHTML = "Please provide your full first and last name";
      noErrors = false;
    }

    /* Email cannot be left blank */
    if(emailField.value == "") {
      emailField.className += " form-field-error";
      emailField.nextElementSibling.innerHTML = "Please provide your email address";
      noErrors = false;
    }

    /* Message cannot be left blank */
    if(messageField.value == "")
    {
      messageField.className += " form-field-error";
      messageField.nextElementSibling.innerHTML = "Please tell us how we can help you";
      noErrors = false;
    }
    event.preventDefault;
    return noErrors;
  }
}

/* Binds a listener to the submit event on the general contact form, which
 * then calls our validator when the form is submitted.
 */
document.querySelector("#generalForm").addEventListener("submit", function(event) {
  /* If validations fail, prevent the form from submitting and return focus
   * to the first errored field */
  if (!FormValidations.validateGeneralForm(event)) {
    event.preventDefault();
    document.querySelector(".form-field-error").focus();
    return false;
  }
  return true;
});
