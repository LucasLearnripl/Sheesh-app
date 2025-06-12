# Adding Your Logo to Sheesh

Follow these steps to add your logo to the Sheesh application:

## 1. Prepare Your Logo Files

Create your logo in multiple formats and sizes:
- **SVG format** (recommended for best scalability): `logo.svg`
- **PNG format** with transparent background: `logo.png`
- **ICO format** for favicon: `favicon.ico`
- **Apple touch icon**: `apple-touch-icon.png` (180x180px)

## 2. Add Logo Files to the Public Directory

Place your logo files in the `client/public/` directory:
```
client/public/
├── logo.svg
├── logo.png
├── favicon.ico
└── apple-touch-icon.png
```

## 3. Update the Navbar Component

Replace the current logo placeholder in `client/src/components/Navbar.tsx`:

**Current code:**
```jsx
<div className="w-8 h-8 bg-gradient-sheesh rounded-lg flex items-center justify-center">
  <span className="text-white font-bold text-lg">S</span>
</div>
```

**Replace with:**
```jsx
<div className="w-8 h-8 flex items-center justify-center">
  <img src="/logo.svg" alt="Sheesh Logo" className="w-8 h-8" />
</div>
```

## 4. Update the Home Page Feature Cards (Optional)

If you want to use your logo in the feature card icons, replace the icon divs in `client/src/pages/HomePage.tsx`:

**Current code:**
```jsx
<div className="w-16 h-16 bg-gradient-sheesh group-hover:bg-white rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300">
  <Upload className="w-8 h-8 text-white group-hover:text-primary transition-colors duration-300" />
</div>
```

**Replace with (for logo variant):**
```jsx
<div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
  <img src="/logo.svg" alt="Sheesh" className="w-12 h-12" />
</div>
```

## 5. Update Favicon References in HTML

The `client/index.html` already includes favicon references. Make sure your files match these names:
- `favicon.ico` - Standard favicon
- `favicon.svg` - SVG favicon
- `apple-touch-icon.png` - Apple touch icon

## 6. Logo Specifications

For best results, ensure your logo:
- **SVG**: Scalable vector format, works at any size
- **Navbar size**: Should work well at 32x32px (w-8 h-8)
- **Feature cards**: Should work well at 48x48px (w-12 h-12) if used
- **Colors**: Should work on both light and gradient backgrounds
- **Transparency**: PNG/SVG should have transparent backgrounds

## 7. Alternative: Logo with Text

If your logo includes text or you want to replace the "Sheesh" text entirely:

```jsx
<Link to="/" className="flex items-center space-x-2">
  <img src="/logo.svg" alt="Sheesh" className="h-10" />
  {/* Remove or keep the text based on your logo design */}
</Link>
```

## 8. Test Your Logo

After adding your logo files:
1. Start the development server: `npm run start`
2. Check the navbar logo appears correctly
3. Test on different screen sizes
4. Verify favicon appears in browser tab
5. Check mobile bookmark icon (apple-touch-icon)

Your logo should now be integrated throughout the Sheesh application!
