@echo off
echo 🚀 Jarvis Scheduler - Quick Deploy Script
echo.

echo 📦 Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please check for errors.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

echo 🌐 Deploying to Vercel...
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Deployment failed! Please check your Vercel setup.
    echo.
    echo 💡 Make sure you have:
    echo    - Vercel CLI installed: npm install -g vercel
    echo    - Logged in: vercel login
    echo    - Set environment variables in Vercel dashboard
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment successful!
echo 🌐 Your website is now live!
echo.
echo 📋 Next steps:
echo    1. Set up Supabase database (see HOSTING_SETUP.md)
echo    2. Add OpenAI API key to Vercel environment variables
echo    3. Configure Google OAuth (optional)
echo.
pause

