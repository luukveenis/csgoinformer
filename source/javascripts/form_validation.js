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
      // Sets the error class name styling
      nameField.className += " form-field-error";
      // Display an error message to the user
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
document.querySelector("#form-general").addEventListener("submit", function(event) {
  /* If validations fail, prevent the form from submitting and return focus
   * to the first errored field */
  if (!FormValidations.validateGeneralForm(event)) {
    event.preventDefault();
    document.querySelector(".form-field-error").focus();
    return false;
  }
  return true;
});

/* When the user fills out errored fields, we should remove the error messages
 * until they attempt to submit the form again */
for (let element of document.querySelectorAll(".form-control")) {
  element.addEventListener("change", function(event) {
    el = event.target;
    el.className = el.className.replace("form-field-error", "");
    el.nextElementSibling.innerHTML = "";
  });
}
