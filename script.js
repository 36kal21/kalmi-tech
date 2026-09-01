
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("phone");

  // Phone input mask - allows only numbers and caps at 10 digits
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
      if (this.value.length > 10) {
        this.value = this.value.substring(0, 10);
      }
    });
  }
});
