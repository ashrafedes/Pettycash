// Help center page dynamic content
function section(title, body) {
  return `
    <div class="border border-slate-200 rounded-2xl overflow-hidden">
      <button data-faq-toggle class="w-full flex items-center justify-between px-5 py-4 text-start font-semibold text-slate-800 hover:bg-slate-50 transition-colors bg-slate-50">
        <span>${title}</span>
        <svg data-faq-icon width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="hidden px-5 py-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100">${body}</div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const hc = t("helpCenter");
  const title = document.querySelector("[data-i18n='helpCenter.title']");
  const subtitle = document.querySelector("[data-i18n='helpCenter.subtitle']");
  if (title) title.textContent = hc.title;
  if (subtitle) subtitle.textContent = hc.subtitle;

  const sectionsEl = document.getElementById("help-sections");
  if (!sectionsEl) return;

  const introBody = [
    `${hc.intro.whatIs} ${getLang() === "ar" ? "نظام إدارة الصندوق الصغير هو نظام إلكتروني سحابي متكامل مصمم للشركات الصغيرة والمتوسطة." : "Petty Cash Management System is a cloud-based electronic system designed for small and medium companies."}`,
    `\n${hc.intro.whyNeed}\n${getLang() === "ar" ? "لإدارة المصروفات اليومية والعهود النقدية بكفاءة وشفافية." : "To manage daily expenses and cash advances efficiently and transparently."}`,
    `\n${hc.intro.problems}\n${getLang() === "ar" ? "• فقدان الفواتير الورقية\n• تأخير في استرداد المبالغ\n• عدم وضوح الرصيد\n• صعوبة التتبع والرقابة\n• أخطاء في الحسابات\n• تراكم الأوراق" : "• Lost paper receipts\n• Delayed reimbursements\n• Unclear balance\n• Difficulty tracking and controlling\n• Accounting errors\n• Paper buildup"}`,
    `\n${hc.intro.solutions}\n${getLang() === "ar" ? "• صور الفواتير مرفقة رقمياً\n• الموافقة بنقرة واحدة\n• رؤية الرصيد الفورية\n• رقابة كاملة في الوقت الفعلي\n• حسابات تلقائية دقيقة\n• أرشيف رقمي قابل للبحث" : "• Receipts attached digitally\n• One-tap approval\n• Instant balance view\n• Full real-time control\n• Accurate automatic accounting\n• Searchable digital archive"}`
  ].join("");

  const featuresBody = [
    `${hc.features.cloud}: ${getLang() === "ar" ? "وصول من أي مكان وأي وقت" : "Access from anywhere, anytime"}`,
    `\n${hc.features.pwa}: ${getLang() === "ar" ? "تطبيق ويب متقدم يعمل على الهاتف" : "Progressive web app for mobile"}`,
    `\n${hc.features.languages}: ${getLang() === "ar" ? "العربية، الإنجليزية، الأوردو، الهندية" : "Arabic, English, Urdu, Hindi"}`,
    `\n${hc.features.security}: ${getLang() === "ar" ? "مصادقة آمنة وتشفير البيانات" : "Secure authentication and data encryption"}`,
    `\n${hc.features.plans}: ${getLang() === "ar" ? "مجاني، أساسي، Pro، Premium" : "Free, Basic, Pro, Premium"}`
  ].join("");

  const usersBody = [
    `${hc.users.manager}: ${getLang() === "ar" ? "يضيف الموظفين ويوزع الأرصدة ويوافق على المصروفات." : "Adds employees, distributes balances, and approves expenses."}`,
    `\n${hc.users.employee}: ${getLang() === "ar" ? "يقدم المصروفات ويرفع الفواتير ويراقب رصيده." : "Submits expenses, uploads receipts, and monitors balance."}`,
    `\n${hc.users.superAdmin}: ${getLang() === "ar" ? "يملك صلاحيات إدارية شاملة على النظام." : "Has full administrative privileges over the system."}`
  ].join("");

  const setupBody = [
    `1. ${hc.setup.step1}`,
    `\n2. ${hc.setup.step2}`,
    `\n3. ${hc.setup.step3}`,
    `\n4. ${hc.setup.step4}`,
    `\n5. ${hc.setup.step5}`
  ].join("");

  const dashboardBody = [
    `${hc.dashboard.totalBalance}: ${getLang() === "ar" ? "إجمالي الأرصدة المتاحة لجميع الموظفين" : "Total available balances for all employees"}`,
    `\n${hc.dashboard.totalExpenses}: ${getLang() === "ar" ? "إجمالي المصروفات المسجلة" : "Total recorded expenses"}`,
    `\n${hc.dashboard.pending}: ${getLang() === "ar" ? "المصروفات بانتظار الموافقة" : "Expenses waiting for approval"}`,
    `\n${hc.dashboard.employees}: ${getLang() === "ar" ? "عدد الموظفين النشطين" : "Number of active employees"}`
  ].join("");

  const expensesBody = [
    `${hc.expenses.pendingStatus}: ${getLang() === "ar" ? "مصروفات بانتظار قرار المدير" : "Expenses awaiting manager decision"}`,
    `\n${hc.expenses.approvedStatus}: ${getLang() === "ar" ? "مصروفات تم اعتمادها وتخصيمها من الرصيد" : "Expenses approved and deducted from balance"}`,
    `\n${hc.expenses.rejectedStatus}: ${getLang() === "ar" ? "مصروفات تم رفضها مع إمكانية إعادة التقديم" : "Expenses rejected and can be resubmitted"}`,
    `\n${hc.expenses.howToApprove}: ${getLang() === "ar" ? "افتح المصروف من لوحة التحكم وانقر 'موافق'." : "Open the expense from dashboard and click 'Approve'."}`
  ].join("");

  const mobileBody = [
    `${hc.mobile.android}: ${getLang() === "ar" ? "افتح الموقع في Chrome ثم اختر 'إضافة إلى الشاشة الرئيسية'." : "Open the site in Chrome then choose 'Add to Home screen'."}`,
    `\n${hc.mobile.ios}: ${getLang() === "ar" ? "افتح الموقع في Safari ثم اختر 'مشاركة' و'إضافة إلى الشاشة الرئيسية'." : "Open the site in Safari, tap Share, then 'Add to Home Screen'."}`,
    `\n${hc.mobile.benefits}: ${getLang() === "ar" ? "وصول سريع، إشعارات فورية، تجربة مثل التطبيق الأصلي." : "Quick access, instant notifications, native-like experience."}`
  ].join("");

  const securityBody = [
    `${hc.security.auth}: ${getLang() === "ar" ? "تسجيل الدخول بكلمة مرور قوية، تسجيل خروج تلقائي." : "Login with strong password, automatic logout."}`,
    `\n${hc.security.dataSec}: ${getLang() === "ar" ? "تخزين آمن على Google Firebase مع تشفير ونسخ احتياطي." : "Secure storage on Google Firebase with encryption and backups."}`,
    `\n${hc.security.tips}: ${getLang() === "ar" ? "لا تشارك كلمة المرور. استخدم بريداً رسمياً للشركة." : "Don't share your password. Use a company email."}`
  ].join("");

  const faqBody = [
    `${hc.faq.getStarted}\n${hc.faq.getStartedAnswer}`,
    `\n${hc.faq.free}\n${hc.faq.freeAnswer}`,
    `\n${hc.faq.submitExpense}\n${hc.faq.submitExpenseAnswer}`,
    `\n${hc.faq.arabic}\n${hc.faq.arabicAnswer}`,
    `\n${hc.faq.mobile}\n${hc.faq.mobileAnswer}`,
    `\n${hc.faq.addBalance}\n${hc.faq.addBalanceAnswer}`
  ].join("\n");

  sectionsEl.innerHTML = [
    section(hc.intro.title, introBody),
    section(hc.features.title, featuresBody),
    section(hc.users.title, usersBody),
    section(hc.setup.title, setupBody),
    section(hc.dashboard.title, dashboardBody),
    section(hc.expenses.title, expensesBody),
    section(hc.mobile.title, mobileBody),
    section(hc.security.title, securityBody),
    section(hc.faq.title, faqBody)
  ].join("");

  initFAQs();
});
