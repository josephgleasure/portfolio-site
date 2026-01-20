# Snowy Field Animation - Realistic Density

An animated version of your snowy field image with realistic depth and density distribution.

## Files Included

- `index.html` - The main HTML file with realistic layered snow animation
- `snowy-field-background.jpg` - Your snowy field background image

## How to Run Locally

1. Extract all files to a folder
2. Simply double-click `index.html` to open it in your browser
3. Watch your static image come to life!

## Features

- ✅ Responsive design - works on any screen size
- ✅ **Realistic depth layers** matching your actual image
- ✅ **DENSE background snow** (800 tiny particles) - just like the image!
- ✅ Snow falls only in the sky area (stops at the horizon)
- ✅ Gradually increases from ~140 to 1,130 snowflakes over 30 seconds
- ✅ Natural atmospheric perspective
- ✅ No dependencies - pure HTML/CSS/JavaScript

## Depth Layers (Realistic Distribution)

The animation creates realistic depth perception matching your original image:

### Layer 1 - Far Distance (Background) ❄️❄️❄️❄️❄️
**VERY DENSE - Like atmospheric haze in your image**
- **Size**: 0.3-0.8px radius (tiny dots)
- **Speed**: 0.15-0.3 (very slow drift)
- **Opacity**: 0.3-0.6 (semi-transparent)
- **Count**: Up to **800 snowflakes**
- Creates the dense, distant snow atmosphere you see in the image

### Layer 2 - Middle Distance ❄️❄️
**Moderate density**
- **Size**: 1.0-1.8px radius (small)
- **Speed**: 0.4-0.6 (moderate)
- **Opacity**: 0.5-0.7 (medium)
- **Count**: Up to **250 snowflakes**
- Natural middle ground transition

### Layer 3 - Close/Foreground ❄️
**SPARSE - Only occasional large flakes**
- **Size**: 2.2-4.0px radius (large, visible)
- **Speed**: 0.8-1.4 (fast)
- **Opacity**: 0.7-0.95 (bright and clear)
- **Count**: Up to **80 snowflakes**
- Creates the sense of snow falling close to the viewer

**Total**: Up to 1,130 snowflakes at peak (30 seconds)

## Why This Distribution?

This matches natural snowfall and your image:
- **Distance reduces visibility** - far snow appears as a dense atmospheric haze
- **Perspective** - distant snow moves slowly, close snow moves fast
- **Atmospheric scattering** - background is denser but less distinct
- **Foreground detail** - fewer but more visible large flakes up close

## Customization

Edit the `layers` array in `index.html` to adjust each layer independently.

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

Enjoy your animated snowy scene!
