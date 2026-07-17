"""
Generate 120 unique petty cash / cost control articles and upload to Firestore.
Each article has 300+ words, a Pexels image, and EN+AR translations.
"""
import urllib.request, json, urllib.parse, time, random, datetime, re, sys

API_KEY = 'AIzaSyDxnv8IXCDgAwP3acnnfNNFthOdCziOwfg'
PROJECT = 'pattycashsystem'
FIRESTORE_URL = f'https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/blog_articles'

# ── Pexels image pool (finance / business / office themed) ──────────────────
PEXELS_IMAGES = [
    "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386331/pexels-photo-4386331.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386341/pexels-photo-4386341.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386351/pexels-photo-4386351.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386361/pexels-photo-4386361.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386371/pexels-photo-4386371.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386381/pexels-photo-4386381.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386391/pexels-photo-4386391.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386401/pexels-photo-4386401.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386411/pexels-photo-4386411.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386421/pexels-photo-4386421.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386441/pexels-photo-4386441.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386451/pexels-photo-4386451.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386461/pexels-photo-4386461.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386471/pexels-photo-4386471.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386481/pexels-photo-4386481.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386491/pexels-photo-4386491.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386501/pexels-photo-4386501.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386511/pexels-photo-4386511.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386521/pexels-photo-4386521.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386531/pexels-photo-4386531.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386541/pexels-photo-4386541.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386551/pexels-photo-4386551.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386561/pexels-photo-4386561.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386571/pexels-photo-4386571.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386581/pexels-photo-4386581.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386591/pexels-photo-4386591.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386601/pexels-photo-4386601.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386611/pexels-photo-4386611.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386621/pexels-photo-4386621.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386631/pexels-photo-4386631.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386641/pexels-photo-4386641.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386651/pexels-photo-4386651.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386661/pexels-photo-4386661.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386671/pexels-photo-4386671.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386681/pexels-photo-4386681.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386691/pexels-photo-4386691.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386701/pexels-photo-4386701.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386711/pexels-photo-4386711.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386721/pexels-photo-4386721.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386731/pexels-photo-4386731.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386741/pexels-photo-4386741.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386751/pexels-photo-4386751.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386761/pexels-photo-4386761.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386771/pexels-photo-4386771.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386781/pexels-photo-4386781.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386791/pexels-photo-4386791.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386801/pexels-photo-4386801.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386811/pexels-photo-4386811.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386821/pexels-photo-4386821.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386831/pexels-photo-4386831.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386841/pexels-photo-4386841.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386851/pexels-photo-4386851.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386861/pexels-photo-4386861.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386871/pexels-photo-4386871.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386881/pexels-photo-4386881.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386891/pexels-photo-4386891.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386901/pexels-photo-4386901.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386911/pexels-photo-4386911.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386921/pexels-photo-4386921.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386931/pexels-photo-4386931.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386941/pexels-photo-4386941.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386951/pexels-photo-4386951.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386961/pexels-photo-4386961.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386971/pexels-photo-4386971.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386981/pexels-photo-4386981.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4386991/pexels-photo-4386991.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387001/pexels-photo-4387001.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387011/pexels-photo-4387011.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387021/pexels-photo-4387021.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387031/pexels-photo-4387031.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387041/pexels-photo-4387041.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387051/pexels-photo-4387051.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387061/pexels-photo-4387061.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387071/pexels-photo-4387071.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387081/pexels-photo-4387081.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387091/pexels-photo-4387091.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387101/pexels-photo-4387101.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387111/pexels-photo-4387111.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387121/pexels-photo-4387121.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387131/pexels-photo-4387131.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387141/pexels-photo-4387141.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387151/pexels-photo-4387151.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387161/pexels-photo-4387161.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387171/pexels-photo-4387171.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387181/pexels-photo-4387181.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387191/pexels-photo-4387191.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387201/pexels-photo-4387201.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387211/pexels-photo-4387211.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387221/pexels-photo-4387221.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387231/pexels-photo-4387231.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387241/pexels-photo-4387241.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387251/pexels-photo-4387251.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387261/pexels-photo-4387261.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387271/pexels-photo-4387271.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387281/pexels-photo-4387281.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387291/pexels-photo-4387291.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387301/pexels-photo-4387301.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387311/pexels-photo-4387311.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387321/pexels-photo-4387321.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387331/pexels-photo-4387331.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387341/pexels-photo-4387341.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387351/pexels-photo-4387351.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387361/pexels-photo-4387361.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387371/pexels-photo-4387371.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387381/pexels-photo-4387381.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387391/pexels-photo-4387391.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387401/pexels-photo-4387401.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387411/pexels-photo-4387411.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387421/pexels-photo-4387421.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387431/pexels-photo-4387431.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387441/pexels-photo-4387441.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387451/pexels-photo-4387451.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387461/pexels-photo-4387461.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387471/pexels-photo-4387471.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387481/pexels-photo-4387481.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387491/pexels-photo-4387491.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387501/pexels-photo-4387501.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387511/pexels-photo-4387511.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387521/pexels-photo-4387521.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387531/pexels-photo-4387531.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387541/pexels-photo-4387541.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387551/pexels-photo-4387551.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387561/pexels-photo-4387561.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387571/pexels-photo-4387571.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387581/pexels-photo-4387581.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387591/pexels-photo-4387591.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387601/pexels-photo-4387601.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387611/pexels-photo-4387611.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387621/pexels-photo-4387621.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387631/pexels-photo-4387631.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387641/pexels-photo-4387641.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387651/pexels-photo-4387651.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387661/pexels-photo-4387661.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387671/pexels-photo-4387671.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387681/pexels-photo-4387681.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387691/pexels-photo-4387691.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387701/pexels-photo-4387701.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387711/pexels-photo-4387711.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387721/pexels-photo-4387721.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387731/pexels-photo-4387731.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387741/pexels-photo-4387741.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4387751/pexels-photo-4387751.jpeg?auto=compress&cs=tinysrgb&w=800",
]

# ── 120 article topics ──────────────────────────────────────────────────────
TOPICS = [
    ("petty-cash-fund-setup-guide", "Petty Cash Fund Setup Guide", "petty cash fund", "Setting up a petty cash fund"),
    ("petty-cash-reconciliation-best-practices", "Petty Cash Reconciliation Best Practices", "petty cash reconciliation", "Reconciling petty cash effectively"),
    ("digital-petty-cash-management", "Digital Petty Cash Management", "digital petty cash", "Managing petty cash digitally"),
    ("petty-cash-fraud-prevention-strategies", "Petty Cash Fraud Prevention Strategies", "petty cash fraud", "Preventing petty cash fraud"),
    ("petty-cash-policy-template-guide", "Petty Cash Policy Template Guide", "petty cash policy", "Creating a petty cash policy"),
    ("petty-cash-vs-corporate-cards", "Petty Cash vs Corporate Cards", "petty cash alternatives", "Comparing petty cash and corporate cards"),
    ("petty-cash-auditing-essentials", "Petty Cash Auditing Essentials", "petty cash audit", "Auditing petty cash funds"),
    ("petty-cash-receipt-management-tips", "Petty Cash Receipt Management Tips", "petty cash receipts", "Managing petty cash receipts"),
    ("petty-cash-limits-and-controls", "Petty Cash Limits and Controls", "petty cash limits", "Setting petty cash limits"),
    ("petty-cash-for-small-businesses", "Petty Cash for Small Businesses", "small business petty cash", "Petty cash for small business"),
    ("petty-cash-imprest-system-explained", "Petty Cash Imprest System Explained", "imprest system", "Understanding the imprest system"),
    ("petty-cash-voucher-system-guide", "Petty Cash Voucher System Guide", "petty cash vouchers", "Using petty cash vouchers"),
    ("petty-cash-custodian-responsibilities", "Petty Cash Custodian Responsibilities", "petty cash custodian", "Custodian duties and responsibilities"),
    ("petty-cash-replenishment-process", "Petty Cash Replenishment Process", "petty cash replenishment", "Replenishing petty cash funds"),
    ("petty-cash-software-solutions", "Petty Cash Software Solutions", "petty cash software", "Software for petty cash management"),
    ("petty-cash-security-measures", "Petty Cash Security Measures", "petty cash security", "Securing petty cash funds"),
    ("petty-cash-tracking-methods", "Petty Cash Tracking Methods", "petty cash tracking", "Tracking petty cash transactions"),
    ("petty-cash-disbursement-rules", "Petty Cash Disbursement Rules", "petty cash disbursement", "Rules for petty cash disbursements"),
    ("petty-cash-overspending-prevention", "Petty Cash Overspending Prevention", "petty cash overspending", "Preventing overspending from petty cash"),
    ("petty-cash-for-startups", "Petty Cash for Startups", "startup petty cash", "Petty cash management for startups"),
    ("petty-cash-box-management", "Petty Cash Box Management", "petty cash box", "Managing the physical petty cash box"),
    ("petty-cash-reporting-standards", "Petty Cash Reporting Standards", "petty cash reporting", "Reporting petty cash transactions"),
    ("petty-cash-internal-controls-checklist", "Petty Cash Internal Controls Checklist", "petty cash controls", "Internal controls for petty cash"),
    ("petty-cash-for-nonprofits", "Petty Cash for Nonprofits", "nonprofit petty cash", "Petty cash in nonprofit organizations"),
    ("petty-cash-reconciliation-frequency", "Petty Cash Reconciliation Frequency", "reconciliation frequency", "How often to reconcile petty cash"),
    ("petty-cash-mismanagement-risks", "Petty Cash Mismanagement Risks", "petty cash risks", "Risks of mismanaging petty cash"),
    ("petty-cash-approval-workflow", "Petty Cash Approval Workflow", "petty cash approval", "Approval workflows for petty cash"),
    ("petty-cash-for-remote-teams", "Petty Cash for Remote Teams", "remote petty cash", "Managing petty cash for remote teams"),
    ("petty-cash-vs-expense-reimbursement", "Petty Cash vs Expense Reimbursement", "expense reimbursement", "Petty cash versus reimbursement"),
    ("petty-cash-categorization-guide", "Petty Cash Categorization Guide", "petty cash categories", "Categorizing petty cash expenses"),
    ("petty-cash-monthly-close-process", "Petty Cash Monthly Close Process", "monthly close", "Closing petty cash monthly"),
    ("petty-cash-training-for-staff", "Petty Cash Training for Staff", "staff training", "Training staff on petty cash"),
    ("petty-cash-record-keeping-tips", "Petty Cash Record Keeping Tips", "record keeping", "Keeping petty cash records"),
    ("petty-cash-surge-protection", "Petty Cash Surge Protection", "cash surge protection", "Protecting against petty cash surges"),
    ("petty-cash-for-multi-office-companies", "Petty Cash for Multi-Office Companies", "multi-office petty cash", "Petty cash across multiple offices"),
    ("petty-cash-automation-tools", "Petty Cash Automation Tools", "cash automation", "Automating petty cash processes"),
    ("petty-cash-budget-allocation", "Petty Cash Budget Allocation", "budget allocation", "Allocating petty cash budgets"),
    ("petty-cash-loss-recovery", "Petty Cash Loss Recovery", "cash loss recovery", "Recovering from petty cash losses"),
    ("petty-cash-for-manufacturing-firms", "Petty Cash for Manufacturing Firms", "manufacturing petty cash", "Petty cash in manufacturing"),
    ("petty-cash-for-retail-businesses", "Petty Cash for Retail Businesses", "retail petty cash", "Petty cash in retail operations"),
    ("petty-cash-for-healthcare-clinics", "Petty Cash for Healthcare Clinics", "healthcare petty cash", "Petty cash in healthcare settings"),
    ("petty-cash-for-educational-institutions", "Petty Cash for Educational Institutions", "education petty cash", "Petty cash in schools and universities"),
    ("petty-cash-for-construction-companies", "Petty Cash for Construction Companies", "construction petty cash", "Petty cash on construction sites"),
    ("petty-cash-for-hospitality-industry", "Petty Cash for Hospitality Industry", "hospitality petty cash", "Petty cash in hotels and restaurants"),
    ("petty-cash-for-logistics-companies", "Petty Cash for Logistics Companies", "logistics petty cash", "Petty cash in logistics operations"),
    ("petty-cash-for-law-firms", "Petty Cash for Law Firms", "law firm petty cash", "Petty cash in legal practices"),
    ("petty-cash-for-creative-agencies", "Petty Cash for Creative Agencies", "agency petty cash", "Petty cash in creative agencies"),
    ("petty-cash-for-real-estate-offices", "Petty Cash for Real Estate Offices", "real estate petty cash", "Petty cash in real estate"),
    ("petty-cash-for-event-management", "Petty Cash for Event Management", "event petty cash", "Petty cash for events"),
    ("petty-cash-for-field-operations", "Petty Cash for Field Operations", "field petty cash", "Petty cash for field teams"),
    ("petty-cash-digital-transformation", "Petty Cash Digital Transformation", "digital transformation", "Transforming petty cash digitally"),
    ("petty-cash-mobile-app-management", "Petty Cash Mobile App Management", "mobile petty cash", "Managing petty cash via mobile apps"),
    ("petty-cash-cloud-based-tracking", "Petty Cash Cloud-Based Tracking", "cloud tracking", "Cloud-based petty cash tracking"),
    ("petty-cash-real-time-monitoring", "Petty Cash Real-Time Monitoring", "real-time monitoring", "Real-time petty cash monitoring"),
    ("petty-cash-ai-powered-controls", "Petty Cash AI-Powered Controls", "AI controls", "AI-powered petty cash controls"),
    ("petty-cash-blockchain-transparency", "Petty Cash Blockchain Transparency", "blockchain transparency", "Blockchain for petty cash transparency"),
    ("petty-cash-biometric-security", "Petty Cash Biometric Security", "biometric security", "Biometric security for petty cash"),
    ("petty-cash-iot-enabled-tracking", "Petty Cash IoT-Enabled Tracking", "IoT tracking", "IoT-enabled petty cash tracking"),
    ("petty-cash-expense-categorization-ai", "Petty Cash Expense Categorization AI", "AI categorization", "AI for expense categorization"),
    ("petty-cash-predictive-analytics", "Petty Cash Predictive Analytics", "predictive analytics", "Predictive analytics for petty cash"),
    ("petty-cash-spend-forecasting", "Petty Cash Spend Forecasting", "spend forecasting", "Forecasting petty cash spending"),
    ("petty-cash-anomaly-detection", "Petty Cash Anomaly Detection", "anomaly detection", "Detecting anomalies in petty cash"),
    ("petty-cash-compliance-automation", "Petty Cash Compliance Automation", "compliance automation", "Automating petty cash compliance"),
    ("petty-cash-policy-enforcement-tech", "Petty Cash Policy Enforcement Tech", "policy enforcement", "Technology for policy enforcement"),
    ("petty-cash-digital-audit-trail", "Petty Cash Digital Audit Trail", "audit trail", "Digital audit trails for petty cash"),
    ("petty-cash-contactless-disbursements", "Petty Cash Contactless Disbursements", "contactless payments", "Contactless petty cash disbursements"),
    ("petty-cash-virtual-card-integration", "Petty Cash Virtual Card Integration", "virtual cards", "Virtual cards for petty cash"),
    ("petty-cash-qr-code-receipts", "Petty Cash QR Code Receipts", "QR code receipts", "QR code receipts for petty cash"),
    ("petty-cash-ocr-receipt-scanning", "Petty Cash OCR Receipt Scanning", "OCR scanning", "OCR receipt scanning for petty cash"),
    ("petty-cash-expense-report-automation", "Petty Cash Expense Report Automation", "report automation", "Automating petty cash reports"),
    ("petty-cash-multi-currency-support", "Petty Cash Multi-Currency Support", "multi-currency", "Multi-currency petty cash management"),
    ("petty-cash-tax-deductibility-rules", "Petty Cash Tax Deductibility Rules", "tax deductibility", "Tax rules for petty cash expenses"),
    ("petty-cash-gst-vat-handling", "Petty Cash GST/VAT Handling", "GST VAT handling", "Handling GST/VAT in petty cash"),
    ("petty-cash-year-end-reconciliation", "Petty Cash Year-End Reconciliation", "year-end reconciliation", "Year-end petty cash reconciliation"),
    ("petty-cash-write-off-procedures", "Petty Cash Write-Off Procedures", "write-off procedures", "Writing off petty cash shortages"),
    ("petty-cash-insurance-coverage", "Petty Cash Insurance Coverage", "insurance coverage", "Insuring petty cash funds"),
    ("petty-cash-physical-security-best-practices", "Petty Cash Physical Security Best Practices", "physical security", "Physical security for petty cash"),
    ("petty-cash-segregation-of-duties", "Petty Cash Segregation of Duties", "segregation of duties", "Segregation of duties in petty cash"),
    ("petty-cash-dual-control-requirements", "Petty Cash Dual Control Requirements", "dual control", "Dual control for petty cash"),
    ("petty-cash-surprise-audits-benefits", "Petty Cash Surprise Audits Benefits", "surprise audits", "Benefits of surprise petty cash audits"),
    ("petty-cash-trend-analysis", "Petty Cash Trend Analysis", "trend analysis", "Analyzing petty cash trends"),
    ("petty-cash-benchmarking-metrics", "Petty Cash Benchmarking Metrics", "benchmarking", "Benchmarking petty cash performance"),
    ("petty-cash-cost-reduction-strategies", "Petty Cash Cost Reduction Strategies", "cost reduction", "Reducing costs through petty cash control"),
    ("petty-cash-roi-of-good-controls", "Petty Cash ROI of Good Controls", "ROI of controls", "ROI of good petty cash controls"),
    ("petty-cash-impact-on-profitability", "Petty Cash Impact on Profitability", "profitability impact", "How petty cash affects profitability"),
    ("petty-cash-leakage-prevention", "Petty Cash Leakage Prevention", "leakage prevention", "Preventing petty cash leakage"),
    ("petty-cash-waste-elimination", "Petty Cash Waste Elimination", "waste elimination", "Eliminating waste in petty cash"),
    ("petty-cash-unnecessary-spending-cuts", "Petty Cash Unnecessary Spending Cuts", "spending cuts", "Cutting unnecessary petty cash spending"),
    ("petty-cash-vendor-negotiation-savings", "Petty Cash Vendor Negotiation Savings", "vendor savings", "Saving through vendor negotiations"),
    ("petty-cash-bulk-purchase-optimization", "Petty Cash Bulk Purchase Optimization", "bulk purchases", "Optimizing bulk purchases via petty cash"),
    ("petty-cash-supply-cost-control", "Petty Cash Supply Cost Control", "supply costs", "Controlling supply costs with petty cash"),
    ("petty-cash-office-supply-optimization", "Petty Cash Office Supply Optimization", "office supplies", "Optimizing office supply spending"),
    ("petty-cash-travel-expense-control", "Petty Cash Travel Expense Control", "travel expenses", "Controlling travel expenses via petty cash"),
    ("petty-cash-meal-entertainment-limits", "Petty Cash Meal Entertainment Limits", "meal limits", "Setting meal and entertainment limits"),
    ("petty-cash-mileage-reimbursement-rules", "Petty Cash Mileage Reimbursement Rules", "mileage reimbursement", "Mileage reimbursement from petty cash"),
    ("petty-cash-parking-transport-costs", "Petty Cash Parking Transport Costs", "transport costs", "Managing transport costs via petty cash"),
    ("petty-cash-emergency-fund-best-practices", "Petty Cash Emergency Fund Best Practices", "emergency fund", "Best practices for petty cash emergencies"),
    ("petty-cash-pandemic-lesson-learned", "Petty Cash Pandemic Lessons Learned", "pandemic lessons", "Petty cash lessons from the pandemic"),
    ("petty-cash-crisis-management-strategies", "Petty Cash Crisis Management Strategies", "crisis management", "Managing petty cash during crises"),
    ("petty-cash-economic-downturn-strategies", "Petty Cash Economic Downturn Strategies", "downturn strategies", "Petty cash strategies during downturns"),
    ("petty-cash-inflation-protection", "Petty Cash Inflation Protection", "inflation protection", "Protecting petty cash from inflation"),
    ("petty-cash-currency-exchange-management", "Petty Cash Currency Exchange Management", "currency exchange", "Managing currency exchange in petty cash"),
    ("petty-cash-for-international-operations", "Petty Cash for International Operations", "international operations", "Petty cash for global companies"),
    ("petty-cash-cross-border-compliance", "Petty Cash Cross-Border Compliance", "cross-border compliance", "Cross-border petty cash compliance"),
    ("petty-cash-regulatory-compliance-guide", "Petty Cash Regulatory Compliance Guide", "regulatory compliance", "Regulatory compliance for petty cash"),
    ("petty-cash-sox-compliance-tips", "Petty Cash SOX Compliance Tips", "SOX compliance", "SOX compliance for petty cash"),
    ("petty-cash-gaap-ifrs-treatment", "Petty Cash GAAP IFRS Treatment", "GAAP IFRS", "GAAP and IFRS treatment of petty cash"),
    ("petty-cash-balance-sheet-classification", "Petty Cash Balance Sheet Classification", "balance sheet", "Classifying petty cash on balance sheets"),
    ("petty-cash-cash-flow-impact", "Petty Cash Cash Flow Impact", "cash flow impact", "How petty cash impacts cash flow"),
    ("petty-cash-working-capital-optimization", "Petty Cash Working Capital Optimization", "working capital", "Optimizing working capital via petty cash"),
    ("petty-cash-liquidity-management", "Petty Cash Liquidity Management", "liquidity management", "Managing liquidity through petty cash"),
    ("petty-cash-float-optimization", "Petty Cash Float Optimization", "float optimization", "Optimizing the petty cash float"),
    ("petty-cash-reimbursement-timeliness", "Petty Cash Reimbursement Timeliness", "reimbursement timeliness", "Timely petty cash reimbursements"),
    ("petty-cash-employee-satisfaction-impact", "Petty Cash Employee Satisfaction Impact", "employee satisfaction", "How petty cash affects employee satisfaction"),
    ("petty-cash-transparency-building-trust", "Petty Cash Transparency Building Trust", "transparency trust", "Building trust through petty cash transparency"),
    ("petty-cash-accountability-culture", "Petty Cash Accountability Culture", "accountability culture", "Building accountability via petty cash"),
    ("petty-cash-financial-discipline-benefits", "Petty Cash Financial Discipline Benefits", "financial discipline", "Financial discipline through petty cash"),
    ("petty-cash-cost-consciousness-culture", "Petty Cash Cost Consciousness Culture", "cost consciousness", "Building cost consciousness via petty cash"),
    ("petty-cash-spending-awareness-programs", "Petty Cash Spending Awareness Programs", "spending awareness", "Spending awareness programs for petty cash"),
    ("petty-cash-gamification-of-savings", "Petty Cash Gamification of Savings", "gamification", "Gamifying petty cash savings"),
    ("petty-cash-team-budget-empowerment", "Petty Cash Team Budget Empowerment", "team empowerment", "Empowering teams with petty cash budgets"),
    ("petty-cash-decentralized-vs-centralized", "Petty Cash Decentralized vs Centralized", "decentralized centralized", "Decentralized vs centralized petty cash"),
    ("petty-cash-future-trends-2026", "Petty Cash Future Trends 2026", "future trends", "Future trends in petty cash management"),
    ("petty-cash-cashless-society-adaptation", "Petty Cash Cashless Society Adaptation", "cashless adaptation", "Adapting petty cash for a cashless society"),
    ("petty-cash-digital-wallet-integration", "Petty Cash Digital Wallet Integration", "digital wallets", "Integrating digital wallets with petty cash"),
    ("petty-cash-cryptocurrency-exploration", "Petty Cash Cryptocurrency Exploration", "cryptocurrency", "Exploring cryptocurrency for petty cash"),
    ("petty-cash-smart-contract-automation", "Petty Cash Smart Contract Automation", "smart contracts", "Smart contracts for petty cash automation"),
    ("petty-cash-embedded-finance-solutions", "Petty Cash Embedded Finance Solutions", "embedded finance", "Embedded finance for petty cash"),
    ("petty-cash-open-banking-integration", "Petty Cash Open Banking Integration", "open banking", "Open banking integration for petty cash"),
    ("petty-cash-real-time-payments-future", "Petty Cash Real-Time Payments Future", "real-time payments", "Real-time payments for petty cash"),
    ("petty-cash-sustainability-green-spending", "Petty Cash Sustainability Green Spending", "sustainability", "Sustainable spending via petty cash"),
    ("petty-cash-esg-reporting-impact", "Petty Cash ESG Reporting Impact", "ESG reporting", "ESG reporting and petty cash"),
    ("petty-cash-carbon-footprint-tracking", "Petty Cash Carbon Footprint Tracking", "carbon tracking", "Tracking carbon footprint via petty cash"),
]

TOPICS = TOPICS[:120]
assert len(TOPICS) == 120, f"Expected 120 topics, got {len(TOPICS)}"

# ── Content generation ──────────────────────────────────────────────────────

INTROS = [
    "Effective petty cash management is a cornerstone of sound financial governance for any organization. When small expenses are tracked diligently, the cumulative impact on company cost control can be transformative. Many businesses overlook petty cash because individual transactions seem insignificant, yet over months and years these small outflows add up to substantial amounts that can erode profit margins if left unchecked.",
    "Controlling petty cash effectively requires more than just keeping a box of money in a drawer. It demands a systematic approach that combines clear policies, disciplined record-keeping, and regular oversight. Companies that implement robust petty cash controls consistently report better cost management outcomes and reduced financial leakage across their operations.",
    "Petty cash may appear to be a minor component of corporate finance, but its impact on overall cost control is far greater than most managers realize. Every dollar that leaves the petty cash fund without proper documentation represents a potential gap in financial accountability. By establishing strong controls around these small expenses, organizations can build a culture of fiscal responsibility that extends to all areas of spending.",
    "The relationship between petty cash discipline and company-wide cost control is direct and measurable. When employees understand that even small expenses are monitored and must be justified, they develop a mindset of financial awareness that permeates their approach to all business expenditures. This cultural shift is one of the most powerful yet underappreciated benefits of good petty cash management.",
    "Many organizations treat petty cash as an afterthought, assuming that the small amounts involved do not warrant serious attention. This assumption is dangerous. Without proper controls, petty cash funds become a source of untracked spending, missing receipts, and unexplained shortages that can signal deeper problems in financial governance. Good petty cash management is not just about the money in the box—it is about the financial culture it represents.",
]

SECTIONS = [
    ("Why Petty Cash Control Matters for Cost Management",
     "Controlling petty cash is fundamentally about preventing the slow drip of unmonitored expenses that quietly drain company resources. When every small purchase is documented, categorized, and reviewed, finance teams gain a complete picture of organizational spending. This visibility allows leaders to identify patterns, spot inefficiencies, and make informed decisions about where to cut costs without disrupting operations. Companies that maintain tight petty cash controls often discover that small adjustments—such as negotiating better rates with frequently used vendors or eliminating redundant purchases—yield savings that compound significantly over time."),

    ("Building a Culture of Financial Accountability",
     "The way an organization handles petty cash sends a powerful message to employees about its overall attitude toward financial discipline. When petty cash is managed with the same rigor as larger expenditures, employees learn that every dollar matters. This mindset spreads naturally throughout the organization, leading to more thoughtful spending decisions at every level. Teams begin to question whether purchases are truly necessary, seek out more cost-effective alternatives, and take ownership of their departmental budgets. Over time, this cultural transformation can reduce overall operating costs by a meaningful margin."),

    ("Key Controls Every Petty Cash System Needs",
     "A well-designed petty cash system incorporates several layers of control that work together to prevent misuse and ensure accuracy. First, a designated custodian should be solely responsible for the fund, creating clear accountability. Second, every disbursement must be supported by a receipt or voucher, no matter how small the amount. Third, the fund should be reconciled at regular intervals—weekly or monthly—and any discrepancies investigated immediately. Fourth, surprise audits should be conducted periodically to deter fraud and verify that controls are functioning as intended. Finally, the fund should have a clearly defined maximum balance and per-transaction limit to prevent excessive accumulation."),

    ("The Cost of Poor Petty Cash Management",
     "When petty cash controls are weak or nonexistent, the consequences extend far beyond the immediate loss of a few dollars. Unreconciled funds create accounting inaccuracies that distort financial statements and complicate audit processes. Missing receipts make it impossible to claim tax deductions, effectively increasing the company's tax burden. More seriously, a lax petty cash environment can embolden employees to escalate fraudulent behavior, leading to larger and more damaging losses. The reputational damage from discovered fraud can also undermine trust among investors, partners, and stakeholders, creating long-term consequences that far exceed the original financial loss."),

    ("Technology and the Modernization of Petty Cash",
     "The digital transformation of petty cash management has revolutionized how organizations control small expenses. Modern petty cash software provides real-time visibility into fund balances, automatic categorization of transactions, and instant reconciliation against receipts captured via smartphone cameras. Cloud-based platforms enable finance teams to monitor petty cash across multiple locations from a single dashboard, eliminating the blind spots that plague traditional paper-based systems. By adopting these technologies, companies can dramatically reduce the administrative burden of petty cash management while simultaneously strengthening controls and improving audit readiness."),

    ("Measuring the Impact of Good Petty Cash Controls",
     "Organizations that implement strong petty cash controls can measure their impact through several key metrics. The most direct measure is the reduction in unexplained shortages and discrepancies during reconciliation. Another important indicator is the percentage of disbursements supported by valid receipts, which should approach one hundred percent in a well-controlled system. Companies can also track the trend of petty cash spending over time, normalized for business activity, to determine whether controls are actually constraining unnecessary purchases. When these metrics improve, the positive effects typically cascade into broader cost management performance, as the financial discipline cultivated at the petty cash level influences decision-making throughout the organization."),

    ("Practical Steps to Strengthen Your Petty Cash System",
     "Improving petty cash management does not require complex reforms. Start by writing a clear petty cash policy that defines permissible expenses, transaction limits, and documentation requirements. Assign a single custodian and a backup who are both trained on proper procedures. Implement a standard voucher form that captures the date, amount, purpose, and recipient for every disbursement. Schedule regular reconciliation sessions and document the results. Conduct unannounced audits at least quarterly. Transition to a digital tracking tool when feasible, as the efficiency gains and improved visibility typically justify the investment. Most importantly, communicate to all employees that petty cash is a shared resource that must be managed responsibly."),

    ("Long-Term Benefits of Disciplined Petty Cash Management",
     "The long-term benefits of maintaining disciplined petty cash controls extend well beyond the immediate savings from reduced waste and fraud. Organizations with strong financial governance tend to attract more favorable terms from lenders and investors, who view robust internal controls as a sign of operational maturity. Employees who work in an environment where financial discipline is valued develop professional habits that enhance their contribution to the organization. The data generated from well-tracked petty cash spending can also inform strategic decisions, such as identifying opportunities for bulk purchasing or highlighting departments that may need additional budget oversight. Ultimately, good petty cash management is an investment in the financial health and sustainability of the entire organization."),
]

AR_INTROS = [
    "إدارة النقدية الصغيرة بشكل فعال هي ركيزة من ركائز الحوكمة المالية السليمة لأي منظمة. عندما يتم تتبع النفقات الصغيرة بجدية، فإن التأثير التراكمي على مراقبة تكاليف الشركة يمكن أن يكون تحويلياً. تتجاهل العديد من الشركات النقدية الصغيرة لأن المعاملات الفردية تبدو غير مهمة، ولكن على مدى أشهر وسنوات تتراكم هذه التدفقات الصغيرة لتشكل مبالغ كبيرة يمكن أن تآكل هوامش الربح إذا تُركت دون رقابة.",
    "يتطلب التحكم الفعال في النقدية الصغيرة أكثر من مجرد الاحتفاظ بصندوق نقود في درج. إنه يتطلب نهجاً منهجياً يجمع بين السياسات الواضحة، وحفظ السجلات المنضبط، والإشراف المنتظم. تؤكد الشركات التي تطبق ضوابط قوية على النقدية الصغيرة باستمرار نتائج أفضل في إدارة التكاليف وتقليل التسرب المالي عبر عملياتها.",
    "قد تبدو النقدية الصغيرة مكوناً ثانوياً في تمويل الشركات، ولكن تأثيرها على مراقبة التكاليف بشكل عام أكبر بكثير مما يدركه معظم المديرين. كل دولار يغادر صندوق النقدية الصغيرة دون وثائق مناسبة يمثل فجوة محتملة في المساءلة المالية. من خلال إنشاء ضوابط قوية حول هذه النفقات الصغيرة، يمكن للمنظمات بناء ثقافة مسؤولية مالية تمتد إلى جميع مجالات الإنفاق.",
]

AR_SECTIONS = [
    ("لماذا تعتبر مراقبة النقدية الصغيرة مهمة لإدارة التكاليف",
     "التحكم في النقدية الصغيرة هو في جوهره منع التسرب البطيء للنفقات غير المراقبة التي تستنزف موارد الشركة بهدوء. عندما يتم توثيق كل عملية شراء صغيرة وتصنيفها ومراجعتها، تحصل فرق المالية على صورة كاملة عن إنفاق المنظمة. تتيح هذه الرؤية للقادة تحديد الأنماط واكتشاف أوجه القصور واتخاذ قرارات مستنيرة حول أين تقليل التكاليف دون تعطيل العمليات."),

    ("بناء ثقافة المساءلة المالية",
     "الطريقة التي تتعامل بها المنظمة مع النقدية الصغيرة ترسل رسالة قوية للموظفين عن موقفها العام تجاه الانضباط المالي. عندما تُدار النقدية الصغيرة بنفس الصرامة التي تُدار بها النفقات الأكبر، يتعلم الموظفون أن كل دولار مهم. ينتشر هذا العقل بشكل طبيعي في جميع أنحاء المنظمة، مما يؤدي إلى قرارات إنفاق أكثر تفكيراً في كل مستوى."),

    ("الضوابط الرئيسية التي يحتاجها كل نظام نقدية صغيرة",
     "يجب أن يتضمن نظام النقدية الصغيرة المصمم جيداً عدة طبقات من الضوابط التي تعمل معاً لمنع سوء الاستخدام وضمان الدقة. أولاً، يجب أن يكون أمين صندوق معين مسؤولاً وحيداً عن الصندوق. ثانياً، يجب أن تدعم كل صرفية بإيصال أو قسيمة. ثالثاً، يجب تسوية الصندوق على فترات منتظمة. رابعاً، يجب إجراء تدقيقات مفاجئة دورياً. أخيراً، يجب أن يكون للصندوق حد أقصى واضح للميزانية وحد لكل معاملة."),

    ("تكلفة ضعف إدارة النقدية الصغيرة",
     "عندما تكون ضوابط النقدية الصغيرة ضعيفة أو غير موجودة، فإن العواقب تمتد إلى ما هو أبعد من الخسارة المباشرة لبضعة دولارات. تخلق الصناديق غير المسوية عدم دقة محاسبية تشوه القوائم المالية وتعقد عمليات التدقيق. الإيصالات المفقودة تجعل من المستحيل المطالبة بخصومات ضريبية، مما يزيد العبء الضريبي للشركة فعلياً."),

    ("التكنولوجيا وتحديث النقدية الصغيرة",
     "أحدث التحول الرقمي لإدارة النقدية الصغيرة ثورة في كيفية تحكم المنظمات في النفقات الصغيرة. توفر برامج النقدية الصغيرة الحديثة رؤية في الوقت الفعلي لأرصدة الصناديق، وتصنيفاً تلقائياً للمعاملات، وتسوية فورية مقابل الإيصالات الملتقطة عبر كاميرات الهواتف الذكية."),

    ("قياس تأثير الضوابط الجيدة للنقدية الصغيرة",
     "يمكن للمنظمات التي تطبق ضوابط قوية على النقدية الصغيرة قياس تأثيرها من خلال عدة مقاييس رئيسية. أكثر مقياس مباشر هو انخفاض النقص غير المبرر والتباينات أثناء التسوية. مؤشر مهم آخر هو نسبة المدفوعات المدعومة بإيصالات صالحة، والتي يجب أن تقترب من مئة بالمائة في نظام مضبوط جيداً."),

    ("خطوات عملية لتعزيز نظام النقدية الصغيرة الخاص بك",
     "تحسين إدارة النقدية الصغيرة لا يتطلب إصلاحات معقدة. ابدأ بكتابة سياسة واضحة للنقدية الصغيرة تحدد النفقات المسموح بها وحدود المعاملات ومتطلبات التوثيق. عين أمين صندوق واحد وبدائل مدربين على الإجراءات الصحيحة. نفذ نموذج قسيمة قياسي لكل صرفية. جدول جلسات تسوية منتظمة."),

    ("الفوائد طويلة المدى لإدارة النقدية الصغيرة المنضبطة",
     "تمتد الفوائد طويلة المدى للحفاظ على ضوابط منضبطة للنقدية الصغيرة إلى ما هو أبعد من المدخرات المباشرة من تقليل الهدر والاحتيال. تميل المنظمات ذات الحوكمة المالية القوية إلى جذب شروط أكثر ملاءمة من المقرضين والمستثمرين. الموظفون الذين يعملون في بيئة تُقدر فيها الانضباط المالي يطورون عادات مهنية تعزز مساهمتهم في المنظمة."),
]


def slugify(text):
    s = text.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '-', s)
    s = s.strip('-')
    return s


def generate_content(title, topic_phrase, context_phrase, idx):
    """Generate 300+ word article content."""
    intro = INTROS[idx % len(INTROS)]

    # Pick 4 sections, rotating based on index
    section_indices = [(idx + j) % len(SECTIONS) for j in range(4)]
    sections = [SECTIONS[si] for si in section_indices]

    # Build content
    parts = [f"## {title}\n"]
    parts.append(intro + "\n")

    for heading, body in sections:
        parts.append(f"## {heading}\n")
        parts.append(body + "\n")

    # Closing paragraph
    closings = [
        f"In conclusion, effective {topic_phrase} is not merely an administrative task but a strategic lever for cost control. Organizations that prioritize disciplined management of small expenses create a ripple effect that strengthens their entire financial framework. The practices and habits developed through proper {context_phrase.lower()} translate into broader operational efficiency, better resource allocation, and a more resilient financial structure. By investing attention and resources into this often-overlooked area, companies position themselves for sustainable growth and long-term profitability.",
        f"Ultimately, the way a company manages its {topic_phrase} reflects its broader commitment to financial excellence. The discipline applied to small expenses sets the standard for all financial interactions within the organization. When leaders demonstrate that every transaction matters, employees respond with greater care and accountability. This alignment between policy and practice is what transforms {context_phrase.lower()} from a routine function into a genuine competitive advantage. Companies that recognize this connection and act on it will continue to outperform peers who dismiss petty cash as too small to matter.",
        f"The evidence is clear: organizations that excel at {topic_phrase} achieve better cost control outcomes across the board. The mechanisms of control—documentation, reconciliation, audit, and review—create a framework that catches errors early, deters misuse, and generates valuable data for decision-making. As businesses face increasing pressure to optimize every line of their budgets, the ability to manage small expenses with precision becomes not just a best practice but a necessity. Those who master {context_phrase.lower()} will find that the benefits extend far beyond the petty cash box, influencing the financial health of the entire enterprise.",
    ]
    parts.append(closings[idx % len(closings)] + "\n")

    content = "\n".join(parts)

    # Ensure 300+ words
    word_count = len(content.split())
    if word_count < 300:
        # Add extra paragraph
        parts.append(f"Furthermore, organizations should regularly review and update their {topic_phrase} procedures to adapt to changing business conditions. What works today may not be sufficient tomorrow, especially as companies grow, expand into new markets, or adopt new technologies. Continuous improvement of petty cash processes ensures that controls remain effective and relevant. Training programs should be refreshed periodically to reinforce expectations and introduce new tools or techniques. By treating petty cash management as an evolving discipline rather than a static policy, companies can maintain strong controls that grow with their needs.\n")
        content = "\n".join(parts)

    return content


def generate_ar_content(title, topic_phrase, idx):
    """Generate Arabic content."""
    intro = AR_INTROS[idx % len(AR_INTROS)]

    section_indices = [(idx + j) % len(AR_SECTIONS) for j in range(4)]
    sections = [AR_SECTIONS[si] for si in section_indices]

    parts = [f"## {title}\n"]
    parts.append(intro + "\n")

    for heading, body in sections:
        parts.append(f"## {heading}\n")
        parts.append(body + "\n")

    closings = [
        f"في الختام، إدارة {topic_phrase} بفعالية ليست مجرد مهمة إدارية بل رافعة استراتيجية لمراقبة التكاليف. المنظمات التي تعطي أولوية للإدارة المنضبطة للنفقات الصغيرة تخلق تأثيراً متعاقباً يعزز إطارها المالي بأكمله.",
        f"في النهاية، الطريقة التي تدير بها الشركة {topic_phrase} تعكس التزامها الأوسع بالتميز المالي. الانضباط المطبق على النفقات الصغيرة يضع المعيار لجميع التفاعلات المالية داخل المنظمة.",
        f"الأدلة واضحة: المنظمات التي تتفوق في {topic_phrase} تحقق نتائج أفضل في مراقبة التكاليف عبر المجالات. آليات الرقابة - التوثيق والتسوية والتدقيق والمراجعة - تخلق إطاراً يكتشف الأخطاء مبكراً ويردع سوء الاستخدام.",
    ]
    parts.append(closings[idx % len(closings)] + "\n")

    return "\n".join(parts)


def generate_summary(title, topic_phrase):
    summaries = [
        f"Discover how effective {topic_phrase} helps businesses reduce waste, improve financial control, and build a culture of cost consciousness that drives long-term profitability.",
        f"Learn practical strategies for {topic_phrase} that strengthen company cost control, prevent financial leakage, and create measurable savings across your organization.",
        f"Explore how disciplined {topic_phrase} transforms small expense management into a powerful tool for company-wide cost reduction and financial accountability.",
        f"Understand the critical role of {topic_phrase} in building robust cost control systems that protect company resources and improve bottom-line performance.",
        f"Find out how implementing strong {topic_phrase} practices can reduce unnecessary spending, enhance transparency, and deliver sustainable cost savings for your business.",
    ]
    return summaries[hash(title) % len(summaries)]


def generate_ar_summary(topic_phrase):
    return f"اكتشف كيف تساعد إدارة {topic_phrase} بفعالية الشركات في تقليل الهدر وتحسين الرقابة المالية وبناء ثقافة الوعي بالتكاليف التي تدفع الربحية طويلة المدى."


def generate_keywords(title):
    words = re.findall(r'[a-z]+', title.lower())
    base_kw = ["petty", "cash", "cost", "control", "management", "business", "expenses", "financial"]
    combined = list(dict.fromkeys(words + base_kw))[:10]
    return combined


def generate_ar_keywords(title):
    base = ["النقدية", "الصغيرة", "التكاليف", "الرقابة", "الإدارة", "الشركات", "النفقات", "المالية"]
    return base[:10]


def build_firestore_doc(article):
    """Build Firestore REST API document format."""
    def sval(v):
        return {"stringValue": v}
    def intval(v):
        return {"integerValue": str(v)}
    def boolval(v):
        return {"booleanValue": v}
    def arrval(lst):
        return {"arrayValue": {"values": [sval(x) for x in lst]}}
    def mapval(m):
        return {"mapValue": {"fields": m}}

    en = article["translations"]["en"]
    ar = article["translations"]["ar"]

    fields = {
        "slug": sval(article["slug"]),
        "date": sval(article["date"]),
        "readTime": intval(article["readTime"]),
        "image": sval(article["image"]),
        "published": boolval(True),
        "translations": mapval({
            "en": mapval({
                "title": sval(en["title"]),
                "summary": sval(en["summary"]),
                "content": sval(en["content"]),
                "metaTitle": sval(en["metaTitle"]),
                "metaDescription": sval(en["metaDescription"]),
                "keywords": arrval(en["keywords"]),
            }),
            "ar": mapval({
                "title": sval(ar["title"]),
                "summary": sval(ar["summary"]),
                "content": sval(ar["content"]),
                "metaTitle": sval(ar["metaTitle"]),
                "metaDescription": sval(ar["metaDescription"]),
                "keywords": arrval(ar["keywords"]),
            }),
            "hi": mapval({
                "title": sval(""),
                "summary": sval(""),
                "content": sval(""),
                "metaTitle": sval(""),
                "metaDescription": sval(""),
                "keywords": arrval([]),
            }),
            "ur": mapval({
                "title": sval(""),
                "summary": sval(""),
                "content": sval(""),
                "metaTitle": sval(""),
                "metaDescription": sval(""),
                "keywords": arrval([]),
            }),
        }),
    }
    return {"fields": fields}


def get_existing_slugs():
    """Fetch existing slugs from Firestore to avoid duplicates."""
    params = {'key': API_KEY, 'pageSize': 300}
    slugs = set()
    url = FIRESTORE_URL + '?' + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=60) as resp:
            data = json.loads(resp.read().decode())
        for doc in data.get('documents', []):
            f = doc.get('fields', {})
            if 'slug' in f and 'stringValue' in f['slug']:
                slugs.add(f['slug']['stringValue'])
        token = data.get('nextPageToken')
        while token:
            params['pageToken'] = token
            url = FIRESTORE_URL + '?' + urllib.parse.urlencode(params)
            with urllib.request.urlopen(url, timeout=60) as resp:
                data = json.loads(resp.read().decode())
            for doc in data.get('documents', []):
                f = doc.get('fields', {})
                if 'slug' in f and 'stringValue' in f['slug']:
                    slugs.add(f['slug']['stringValue'])
            token = data.get('nextPageToken')
    except Exception as e:
        print(f"Warning: could not fetch existing slugs: {e}")
    return slugs


def upload_article(doc):
    """Upload a single article to Firestore."""
    url = FIRESTORE_URL + '?key=' + API_KEY
    payload = json.dumps(doc).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def main():
    print("Fetching existing slugs from Firestore...")
    existing_slugs = get_existing_slugs()
    print(f"Found {len(existing_slugs)} existing articles in Firestore")

    # Generate articles
    articles = []
    base_date = datetime.date(2026, 7, 15)

    for i, (slug, title, topic_phrase, context_phrase) in enumerate(TOPICS):
        if slug in existing_slugs:
            print(f"  SKIP (exists): {slug}")
            continue

        date = (base_date - datetime.timedelta(days=i)).isoformat()
        image = PEXELS_IMAGES[i % len(PEXELS_IMAGES)]

        en_content = generate_content(title, topic_phrase, context_phrase, i)
        ar_title = f"إدارة {topic_phrase}"  # Simplified Arabic title
        ar_content = generate_ar_content(ar_title, topic_phrase, i)
        en_summary = generate_summary(title, topic_phrase)
        ar_summary = generate_ar_summary(topic_phrase)
        en_keywords = generate_keywords(title)
        ar_keywords = generate_ar_keywords(title)

        word_count = len(en_content.split())
        print(f"  [{i+1}/120] {slug} ({word_count} words)")

        article = {
            "slug": slug,
            "date": date,
            "readTime": max(3, word_count // 200),
            "image": image,
            "published": True,
            "translations": {
                "en": {
                    "title": title,
                    "summary": en_summary,
                    "content": en_content,
                    "metaTitle": f"{title} | Petty Cash",
                    "metaDescription": en_summary,
                    "keywords": en_keywords,
                },
                "ar": {
                    "title": ar_title,
                    "summary": ar_summary,
                    "content": ar_content,
                    "metaTitle": f"{ar_title} | صندوق العهدة",
                    "metaDescription": ar_summary,
                    "keywords": ar_keywords,
                },
            },
        }
        articles.append(article)

    print(f"\nGenerated {len(articles)} new articles to upload")

    # Upload
    success = 0
    failed = 0
    for i, article in enumerate(articles):
        doc = build_firestore_doc(article)
        try:
            result = upload_article(doc)
            success += 1
            if (i + 1) % 10 == 0:
                print(f"  Uploaded {i+1}/{len(articles)} articles...")
            time.sleep(0.3)  # Rate limiting
        except Exception as e:
            print(f"  FAILED: {article['slug']} - {e}")
            failed += 1
            time.sleep(1)

    print(f"\nDone! {success} uploaded, {failed} failed out of {len(articles)} new articles.")
    return success, failed


if __name__ == '__main__':
    main()
