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

    // FormData መፍጠር
    const formData = new FormData(contactForm);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
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
