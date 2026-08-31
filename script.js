document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const phoneInput = document.getElementById("phone");
  const submitBtn = document.getElementById("submitBtn");

  if (!contactForm) return;

  // Phone input mask - only numbers allowed
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
      if (this.value.length > 10) {
        this.value = this.value.substring(0, 10);
      }
    });
  }

  // Toast notification display
  function showToast(title, message) {
    const existingToast = document.querySelector(".custom-toast");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          <i class="fa-solid fa-check"></i>
        </div>
        <div class="toast-text">
          <h4>${title}</h4>
          <p>${message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 6000);
  }

  // Handle Form Submission
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Ethiopian Phone validation check
    const phoneValue = phoneInput ? phoneInput.value.trim() : "";
    const phoneRegex = /^(09|07)\d{8}$/;

    if (!phoneRegex.test(phoneValue)) {
      alert("እባክዎን ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (09... ወይም 07...)");
      return;
    }

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending... / በመላክ ላይ...';

    // 1. የ Form መረጃዎችን በሙሉ በ URLSearchParams መሰብሰብ
    const myForm = e.target;
    const formData = new FormData(myForm);
    const params = new URLSearchParams(formData);

    // 2. Netlify form-name ማረጋገጥ
    params.set("form-name", "contact");

    // 3. መልእክቱ (message) በትክክል መያዙን ማረጋገጥ
    const messageInput = document.getElementById("message");
    if (messageInput) {
      params.set("message", messageInput.value);
    }

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })
      .then((response) => {
        if (response.ok) {
          contactForm.reset();
          submitBtn.className = "btn btn-green btn-full";
          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully! / ተልኳል!';

          showToast(
            "መልዕክትዎ በትክክል ተልኳል!",
            "ስለተገናኙን እናመሰግናለን። በቅርቡ በስልክ ወይም በኢሜይል እንመልስልዎታለን።"
          );

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.className = "btn btn-blue btn-full";
            submitBtn.innerHTML = originalBtnText;
          }, 5000);
        } else {
          throw new Error("Server response was not ok");
        }
      })
      .catch((error) => {
        alert("መልዕክቱን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ ወይም በስልክ ይደውሉልን።");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
  });
});
