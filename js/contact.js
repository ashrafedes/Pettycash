// Contact form submission to hidden Google Form
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSfBxEr1lkgOpsYY1mBLdXYw896sMWK6PQDhgqTbzy-yXspE-g/formResponse";

const ENTRY_IDS = {
  name: "entry.461133583",
  email: "entry.1577520220",
  subject: "entry.654618876",
  message: "entry.461136427",
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Sending...`;

    try {
      const data = new FormData();
      data.append(ENTRY_IDS.name, form.name.value);
      data.append(ENTRY_IDS.email, form.email.value);
      data.append(ENTRY_IDS.subject, form.subject.value || "Contact from Marketing Site");
      data.append(ENTRY_IDS.message, form.message.value);

      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: data,
      });

      document.getElementById("contact-success").classList.remove("hidden");
      document.getElementById("contact-form-fields").classList.add("hidden");
      form.reset();
    } catch (err) {
      console.error(err);
      document.getElementById("contact-error").classList.remove("hidden");
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });

  document.getElementById("send-another")?.addEventListener("click", () => {
    document.getElementById("contact-success").classList.add("hidden");
    document.getElementById("contact-form-fields").classList.remove("hidden");
  });
});
