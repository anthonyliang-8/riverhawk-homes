function submitForm() {
  var firstName = document.getElementById("firstName");
  var lastName = document.getElementById("lastName");
  var email = document.getElementById("email");
  var message = document.getElementById("message");
  var confirmationMessage = document.getElementById("confirmationMessage");

  clearErrorMessages();

  if (firstName.value.trim() === "") {
    displayErrorMessage(firstName, "Please enter your first name.");
  }

  if (lastName.value.trim() === "") {
    displayErrorMessage(lastName, "Please enter your last name.");
  }

  if (email.value.trim() === "") {
    displayErrorMessage(email, "Please enter your email.");
  }

  if (message.value.trim() === "") {
    displayErrorMessage(message, "Please enter your message.");
  }

  if (document.querySelectorAll(".errorMessage").length > 0) {
    return;
  }

  confirmationMessage.style.display = "block";
  confirmationMessage.classList.remove("error");

  firstName.value = "";
  lastName.value = "";
  email.value = "";
  message.value = "";
}

function displayErrorMessage(element, message) {
  var errorMessage = document.createElement("div");
  errorMessage.className = "errorMessage";
  errorMessage.textContent = message;

  element.parentNode.insertBefore(errorMessage, element.nextSibling);
}

function clearErrorMessages() {
  var errorMessages = document.querySelectorAll(".errorMessage");
  errorMessages.forEach(function (errorMessage) {
    errorMessage.parentNode.removeChild(errorMessage);
  });
}

document.querySelectorAll("input, textarea").forEach(function (input) {
  input.addEventListener("input", function () {
    var errorMessage = input.nextElementSibling;
    if (errorMessage && errorMessage.className === "errorMessage") {
      errorMessage.parentNode.removeChild(errorMessage);
    }
  });
});
