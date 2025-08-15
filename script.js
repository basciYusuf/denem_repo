(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function onReady() {
    var loginForm = document.getElementById("loginForm");
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var rememberMeCheckbox = document.getElementById("rememberMe");
    var togglePasswordButton = document.getElementById("togglePassword");
    var formMessage = document.getElementById("formMessage");
    var submitButton = document.getElementById("submitButton");

    var DEMO_USERNAMES = ["demo", "demo@site.com"];
    var DEMO_PASSWORD = "demo123";
    var STORAGE_KEY = "login_demo_username";
    var REMEMBER_KEY = "login_demo_remember";

    try {
      var remembered = localStorage.getItem(REMEMBER_KEY) === "1";
      if (remembered) {
        var savedUsername = localStorage.getItem(STORAGE_KEY) || "";
        if (savedUsername) {
          usernameInput.value = savedUsername;
          rememberMeCheckbox.checked = true;
          passwordInput.focus();
        }
      } else {
        usernameInput.focus();
      }
    } catch (e) {
      // storage may be unavailable; ignore
    }

    togglePasswordButton.addEventListener("click", function handleToggle() {
      var isHidden = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isHidden ? "text" : "password");
      togglePasswordButton.textContent = isHidden ? "Gizle" : "Göster";
      togglePasswordButton.setAttribute("aria-label", isHidden ? "Parolayı gizle" : "Parolayı göster");
      passwordInput.focus();
    });

    loginForm.addEventListener("submit", function handleSubmit(event) {
      event.preventDefault();

      clearMessage();
      setBusy(true);

      var username = String(usernameInput.value || "").trim();
      var password = String(passwordInput.value || "");

      var validationMessage = validateInputs(username, password);
      if (validationMessage) {
        showError(validationMessage);
        setBusy(false);
        return;
      }

      // Simulate server delay
      window.setTimeout(function tryLogin() {
        var isUsernameValid = DEMO_USERNAMES.indexOf(username.toLowerCase()) !== -1;
        var isPasswordValid = password === DEMO_PASSWORD;

        if (isUsernameValid && isPasswordValid) {
          tryStoreRemember(username);
          showSuccess("Giriş başarılı! Yönlendiriliyorsunuz...");
          window.setTimeout(function go() {
            window.location.hash = "#ok";
            setBusy(false);
          }, 700);
        } else {
          showError("Kullanıcı adı veya parola hatalı.");
          setBusy(false);
        }
      }, 600);
    });

    function validateInputs(username, password) {
      if (!username) return "Lütfen kullanıcı adı veya e-posta girin.";
      if (!password) return "Lütfen parolanızı girin.";
      if (password.length < 6) return "Parola en az 6 karakter olmalı.";
      return "";
    }

    function showError(text) {
      formMessage.textContent = text;
      formMessage.classList.remove("message--success");
      formMessage.classList.add("message--error");
    }

    function showSuccess(text) {
      formMessage.textContent = text;
      formMessage.classList.remove("message--error");
      formMessage.classList.add("message--success");
    }

    function clearMessage() {
      formMessage.textContent = "";
      formMessage.classList.remove("message--error");
      formMessage.classList.remove("message--success");
    }

    function setBusy(isBusy) {
      submitButton.setAttribute("aria-busy", isBusy ? "true" : "false");
      submitButton.disabled = isBusy;
    }

    function tryStoreRemember(username) {
      var remember = rememberMeCheckbox.checked;
      try {
        if (remember) {
          localStorage.setItem(STORAGE_KEY, username);
          localStorage.setItem(REMEMBER_KEY, "1");
        } else {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(REMEMBER_KEY, "0");
        }
      } catch (e) {
        // ignore
      }
    }
  });
})();


