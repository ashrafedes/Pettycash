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
  const data = window.PettyCash?.t ? window.PettyCash.t("contact") : {
    title: "Contact Us",
    subtitle: "We are here to help.",
    subject: "Subject",
    email: "Email",
    name: "Your Name",
    message: "Your Message",
    send: "Send Message",
    sent: "Message sent! We will reply soon.",
    emailAddress: "ashrafede@gmail.com"
  };

  const title = document.querySelector("[data-i18n='contact.title']");
  const subtitle = document.querySelector("[data-i18n='contact.subtitle']");
  const emailEl = document.getElementById("contact-email");

  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (emailEl) emailEl.textContent = data.emailAddress;

  document.querySelectorAll("[data-i18n='contact.name']").forEach(el => { if (el.placeholder === "") el.placeholder = data.name; else el.textContent = data.name; });
  document.querySelectorAll("[data-i18n='contact.email']").forEach(el => { if (el.placeholder === "") el.placeholder = data.email; else el.textContent = data.email; });
  document.querySelectorAll("[data-i18n='contact.subject']").forEach(el => { if (el.placeholder === "") el.placeholder = data.subject; else el.textContent = data.subject; });
  document.querySelectorAll("[data-i18n='contact.message']").forEach(el => { if (el.placeholder === "") el.placeholder = data.message; else el.textContent = data.message; });

  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  const spinner = document.getElementById("btn-spinner");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (status) {
      status.className = "text-sm text-slate-500";
      status.textContent = "...";
    }
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = "...";
    if (spinner) spinner.classList.remove("hidden");

    try {
      const formData = new FormData(form);
      const payload = new URLSearchParams();
      payload.append(ENTRY_IDS.name, formData.get("name"));
      payload.append(ENTRY_IDS.email, formData.get("email"));
      payload.append(ENTRY_IDS.subject, formData.get("subject"));
      payload.append(ENTRY_IDS.message, formData.get("message"));

      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });

      if (status) {
        status.className = "text-sm text-green-600 font-medium";
        status.textContent = data.sent;
      }
      form.reset();
    } catch (err) {
      console.error(err);
      if (status) {
        status.className = "text-sm text-red-600 font-medium";
        status.textContent = window.PettyCash?.getLang() === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Please try again.";
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = data.send;
      if (spinner) spinner.classList.add("hidden");
    }
  });
});
