# Lensrift — Complete Setup Guide

Welcome to Lensrift! This guide will help you get your photography portfolio live in minutes.

## 📋 Prerequisites

- A GitHub account (free at github.com)
- A Vercel account (free at vercel.com)
- A Google Drive account with your photos/videos

## 🚀 Setup in 5 Minutes

### Step 1: Prepare Your GitHub Repository

1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Name it `lensrift` (or your preference)
   - Description: "Photography Portfolio"
   - Make it **Public**
   - Click "Create repository"

2. **Clone the repository locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lensrift.git
   cd lensrift
   ```

3. **Copy all project files into this folder:**
   - `index.html`
   - `styles.css`
   - `script.js`
   - `data.js`
   - `README.md`
   - `vercel.json`
   - `package.json`
   - `.gitignore`

4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: Lensrift portfolio"
   git push origin main
   ```

### Step 2: Deploy to Vercel

1. **Visit Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in or create a free account
   - Click "New Project"

2. **Import your GitHub repository:**
   - Select your `lensrift` repository
   - Click "Import"
   - Framework preset: Select "Other"
   - Click "Deploy"

3. **Vercel deploys automatically:**
   - Wait for deployment to complete (usually 30 seconds)
   - You'll get a live URL like `https://lensrift.vercel.app`
   - 🎉 Your portfolio is live!

### Step 3: Add Your Photos to Google Drive

1. **Organize your photos:**
   - Create a folder in Google Drive for your portfolio
   - Upload your images/videos here

2. **Make files shareable:**
   - Right-click each file
   - Click "Share"
   - Change to "Anyone with the link"
   - Copy the link

3. **Extract File IDs:**
   - Your shared link looks like:
     ```
     https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view?usp=sharing
     ```
   - The File ID is: `1aBcDeFgHiJkLmNoPqRsTuVwXyZ`

### Step 4: Update Your Gallery

1. **Edit `data.js` in your GitHub repository:**
   - Click on `data.js` in your repository
   - Click the edit button (pencil icon)
   - Add new entries to the `galleryData` array:

   ```javascript
   {
       title: "Your Photo Title",
       type: "image",  // or "video"
       url: "https://drive.google.com/uc?export=view&id=YOUR_FILE_ID"
   }
   ```

2. **Commit your changes:**
   - Scroll down and click "Commit changes"
   - Add a message like "Update gallery with new photos"
   - Click "Commit"

3. **Vercel auto-deploys:**
   - Your website automatically updates
   - New photos appear in the gallery
   - Check your live URL to see changes

## 🎨 Customization

### Change the Title and Subtitle

In `index.html`, find the hero section:

```html
<h1 class="hero-title">Lensrift</h1>
<p class="hero-subtitle">Capturing moments, crafting stories</p>
```

Change to your preferred text. Commit and push!

### Update About Section

In `index.html`, find the about section:

```html
<p class="about-text">
    Welcome to Lensrift — a minimalist photography portfolio...
</p>
```

Replace with your biography. Then commit and push.

### Change Colors

In `styles.css`, find the `:root` section:

```css
:root {
    --color-black: #000000;
    --color-white: #ffffff;
    --color-dark-gray: #1d1d1d;
    --color-medium-gray: #6e6e73;
    --color-light-gray: #f5f5f7;
}
```

Update any color values. Vercel will rebuild automatically.

### Change Photographer Name

In `index.html`, find:

```html
<span class="info-value">Rinaltra Nabasa S</span>
```

Update with your name.

In the footer:

```html
<p class="footer-note">Portfolio by Rinaltra Nabasa S</p>
```

Update here too.

## 📸 Adding Content - Quick Reference

### Quick Steps to Add a Photo:

1. **Upload to Google Drive**
   - Right-click → Share → "Anyone with the link"

2. **Get the File ID**
   - From shared link: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`

3. **Add to data.js**
   ```javascript
   {
       title: "Photo Name",
       type: "image",
       url: "https://drive.google.com/uc?export=view&id=FILE_ID"
   }
   ```

4. **Commit and push**
   - Done! Vercel updates automatically

## 🎯 Best Practices

### Image Optimization
- Keep images under 5MB for fast loading
- Use JPEG for photos, PNG for graphics
- Resize large images before uploading

### Organization
- Keep all photos in one Google Drive folder
- Use consistent naming: `photo-1`, `photo-2`, etc.
- Document File IDs somewhere safe

### Managing Data.js
- Keep the array organized
- Use consistent formatting
- Comment your additions:
  ```javascript
  // Landscape Photos
  {
      title: "Mountain View",
      type: "image",
      url: "https://drive.google.com/uc?export=view&id=..."
  },
  ```

## 🔧 Troubleshooting

### Photo not showing?

1. **Check the URL format:**
   ```
   https://drive.google.com/uc?export=view&id=CORRECT_FILE_ID
   ```

2. **Verify file is shared:**
   - Right-click file in Google Drive
   - Click "Share"
   - Ensure "Anyone with the link" is selected

3. **Clear your browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Website shows old photos?

1. **Hard refresh your browser**
   - `Ctrl+Shift+R` or `Cmd+Shift+R`

2. **Check GitHub for latest changes**
   - Go to your repository
   - Verify changes are there

3. **Check Vercel deployment**
   - Go to your Vercel project
   - Verify latest deployment succeeded

### Vercel deployment failed?

1. **Check the build logs:**
   - Go to Vercel → Your Project
   - Click on failed deployment
   - Look at build logs for errors

2. **Verify file syntax:**
   - Ensure `data.js` is valid JavaScript
   - No extra commas in arrays
   - All URLs are strings

3. **Commit valid changes:**
   ```bash
   git add data.js
   git commit -m "Fix gallery data"
   git push
   ```

## 📞 Getting Help

### Check These First
1. Verify URLs are in correct format
2. Ensure all files are shared
3. Hard refresh your browser
4. Check browser console for errors (F12)

### Common Issues

**Images blurry?**
- Upload higher resolution images to Google Drive

**Slow loading?**
- Compress images to reduce file size
- Check internet connection

**Layout looks broken?**
- Try a different browser
- Clear browser cache
- Check on mobile device

## 🎓 Learning Resources

### Understanding the Code

**index.html** - Page structure
**styles.css** - All styling and layout
**script.js** - Gallery interactions
**data.js** - Your content configuration

### Useful Links
- [Google Drive Help](https://support.google.com/drive)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Guides](https://guides.github.com)
- [MDN Web Docs](https://developer.mozilla.org)

## ✅ Checklist for Going Live

- [ ] Create GitHub account
- [ ] Create GitHub repository
- [ ] Push Lensrift files to GitHub
- [ ] Create Vercel account
- [ ] Deploy to Vercel
- [ ] Verify website is live
- [ ] Upload photos to Google Drive
- [ ] Share photos ("Anyone with the link")
- [ ] Get File IDs from shared links
- [ ] Update `data.js` with photo URLs
- [ ] Commit and push changes
- [ ] Verify photos appear on live site
- [ ] Customize title and about section
- [ ] Share your portfolio URL!

## 🚀 You're Ready!

Your portfolio is now live and ready to showcase your work!

**Next Steps:**
1. Share your Vercel URL with others
2. Continue adding photos
3. Update your about section
4. Customize colors and fonts
5. Enjoy your minimalist portfolio!

---

**Need help?** Check README.md for full documentation.
