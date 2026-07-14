# Petty Cash Static Website

A static HTML/CSS/JS marketing website for the Petty Cash Management System, designed for easy deployment on Render.com Static Sites.

## What's Included

- Static HTML pages: Home, Features, Pricing, About, Contact, Blog, Help
- Bilingual support: English and Arabic with language switcher and RTL layout
- Shared navbar and footer loaded via vanilla JavaScript
- Tailwind CSS via CDN (no build step required)
- Contact form submits to a hidden Google Form
- Blog articles fetched from Firebase Firestore
- Live visitor counter via Firebase Firestore
- All 4 pricing plans: Free, Basic, Pro, Premium
- Responsive design
- Favicon support

## Deploy on Render

1. Push this repository to GitHub.
2. In your Render dashboard, click **New +** → **Static Site**.
3. Connect your GitHub repository.
4. Use the following settings:
   - **Branch**: `main`
   - **Build Command**: leave empty
   - **Publish Directory**: `./`
5. Click **Create Static Site**.

## Local Preview

You can open any HTML file directly in your browser, or use a simple static server:

```bash
# Python 3
python -m http.server 8000

# Or use npx serve
npx serve .
```

Then visit `http://localhost:8000`.

## Project Structure

```
.
├── index.html        # Home page
├── features.html     # Features page
├── pricing.html      # Pricing page
├── about.html        # About page
├── contact.html      # Contact page with Google Form integration
├── help.html         # Help center
├── blog.html         # Blog placeholder
├── css/
│   └── styles.css    # Custom styles
├── js/
│   ├── main.js         # Navbar, footer, language switcher, FAQ toggles
│   ├── translations.js # English and Arabic content
│   ├── firebase.js     # Firebase config and helpers
│   ├── home.js         # Home page dynamic sections
│   ├── features.js     # Features page content
│   ├── pricing.js      # Pricing cards
│   ├── about.js        # About page content
│   ├── contact.js      # Google Form submission
│   ├── help.js         # Help center sections
│   └── blog.js         # Blog articles from Firebase
├── images/
│   └── favicon.png   # Site favicon
├── render.yaml       # Render static site configuration
└── README.md
```

## Notes

- This is a static version of the main Petty Cash marketing site.
- The contact form uses a hidden Google Form endpoint.
- Links to the actual app point to `https://pattycashsystem.web.app`.
