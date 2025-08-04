# Video Editor Portfolio - Deploy Ready

This folder contains all necessary files for deploying to Replit or other hosting platforms.

## 🚀 Quick Deploy to Replit

1. **Create New Replit**:
   - Go to [Replit](https://replit.com)
   - Click "Create Repl"
   - Choose "Import from GitHub" or upload this folder

2. **Setup Environment**:
   - The project will auto-detect Replit environment
   - Videos will automatically use Replit Object Storage

3. **Upload Videos**:
   - Navigate to Object Storage in Replit
   - Create a `videos` folder
   - Upload your video files (1.mp4 to 20.mp4)

4. **Update Storage URL**:
   - Open `.env.production`
   - Replace the storage URL with your actual Replit Object Storage URL
   - Format: `https://storage.googleapis.com/replit-objstore-[your-id]`

5. **Install & Run**:
   ```bash
   npm install
   npm start
   ```

## 📁 Project Structure

```
deploy-ready/
├── src/                  # Source code
│   ├── components/       # React components
│   ├── pages/           # Page components
│   └── utils/           # Utility functions
├── public/              # Static assets
│   └── videos/          # Local video files (for development)
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind CSS config
├── .env.production      # Production environment variables
└── README.md           # This file
```

## 🎥 Video Files

### For Local Development:
- Place videos in `public/videos/` folder
- Name them: 1.mp4, 2.mp4, ... 20.mp4

### For Replit/Production:
- Upload to Replit Object Storage
- Path: `/videos/1.mp4` ... `/videos/20.mp4`
- The app automatically uses cloud storage when deployed

## 🔧 Environment Variables

Edit `.env.production`:
```env
REACT_APP_STORAGE_URL=https://storage.googleapis.com/replit-objstore-[your-id]
REACT_APP_USE_CLOUD_STORAGE=true
```

## 📱 Features

- 20 professional video editing skills showcase
- Smooth scroll-based video transitions
- Custom video player with controls
- Responsive design
- Auto-detect Replit environment
- Cloud storage integration

## 🛠️ Technologies

- React 18 with TypeScript
- Tailwind CSS
- Framer Motion
- Replit Object Storage

## 📝 Customization

1. **Change Videos**: Replace video files in Object Storage
2. **Edit Skills**: Modify `src/pages/PortfolioPage.tsx`
3. **Styling**: Update Tailwind classes or `tailwind.config.js`
4. **Storage URL**: Update in `.env.production`

## 🚨 Important Notes

- Ensure video files are properly compressed (use the compression tools in `/incord` folder)
- Recommended video format: MP4, H.264 codec
- Keep video files under 100MB each for optimal loading
- The app works both locally and on Replit without code changes

## 💡 Tips

- Test locally first with `npm start`
- Use `npm run build` to create optimized production build
- Check browser console for any errors
- Ensure all 20 video files are uploaded