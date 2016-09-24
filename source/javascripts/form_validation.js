/* This code is borrowed from tutorialspoint in their Javascript form
 * validation tutorial.
 * The code can be found here:
 * http://www.tutorialspoint.com/javascript/javascript_form_validations.htm
 */
(function(){
  FormValidations = {
    /* Function that validates general contact form fields: name, email and message */
    validateForm: function(form) {
      nameField = form.name;
      emailField = form.email;
      messageField = form.message;
      steamIdField = form.steam_id;
      verificationCodeField = form.verification_code;
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

      if (steamIdField && steamIdField.value == "") {
        steamIdField.className += " form-field-error";
        steamIdField.nextElementSibling.innerHTML = "Please tell us how we can help you";
        noErrors = false;
      }

      if (verificationCodeField && verificationCodeField.value == "") {
        verificationCodeField.className += " form-field-error";
        verificationCodeField.nextElementSibling.innerHTML = "Please tell us how we can help you";
        noErrors = false;
      }
      return noErrors;
    }
  }

  var generalForm = document.querySelector("#form-general");
  var playerForm = document.querySelector("#form-player");

  /* Binds a listener to the submit event on the general contact form, which
   * then calls our validator when the form is submitted.
   */
  if (generalForm) {
    generalForm.addEventListener("submit", function(event) {
      /* If validations fail, prevent the form from submitting and return focus
       * to the first errored field */
      if (!FormValidations.validateForm(event.target)) {
        event.preventDefault();
        document.querySelector(".form-field-error").focus();
        return false;
      }
      return true;
    });
  }

  /* Binds a listener to the submit event on the player contact form, which calls
   * both the general and player form validators.
   */
  if (playerForm) {
    document.querySelector("#form-player").addEventListener("submit", function(event) {
      if (!FormValidations.validateForm(event.target)) {
        event.preventDefault();
        document.querySelector(".form-field-error").focus();
        return false;
      }
      return true;
    });
  }

  /* When the user fills out errored fields, we should remove the error messages
   * until they attempt to submit the form again */
  for (let element of document.querySelectorAll(".form-control")) {
    element.addEventListener("change", function(event) {
      el = event.target;
      el.className = el.className.replace("form-field-error", "");
      el.nextElementSibling.innerHTML = "";
    });
  }
})();
