# ⚡ Quick Start Guide

Get your Habit Tracker app up and running in 5 minutes!

## 🚀 TL;DR

```bash
# 1. Clone and install
git clone https://github.com/Gee-sus/habit-tracker.git
cd habit-tracker
npm install

# 2. Set up Appwrite (see details below)
# Create project at https://cloud.appwrite.io/

# 3. Create .env file
# Copy your Appwrite credentials

# 4. Start the app
npx expo start
```

## 📝 Detailed Steps

### Step 1: Prerequisites (2 minutes)

Make sure you have:
- ✅ Node.js installed (v16+)
- ✅ npm or yarn
- ✅ Expo Go app on your phone (optional)

**Check versions:**
```bash
node --version  # Should be v16 or higher
npm --version   # Any recent version
```

### Step 2: Clone & Install (1 minute)

```bash
# Clone the repository
git clone https://github.com/Gee-sus/habit-tracker.git

# Navigate to project
cd habit-tracker

# Install dependencies
npm install
```

### Step 3: Appwrite Setup (3 minutes)

#### Option A: Quick Setup (Automated - Coming Soon)
```bash
# Will be available in future version
npm run setup:appwrite
```

#### Option B: Manual Setup

1. **Create Appwrite Project**
   - Go to [cloud.appwrite.io](https://cloud.appwrite.io/)
   - Create new project
   - Copy Project ID

2. **Create Database**
   - Create new database
   - Copy Database ID

3. **Create Collections**
   
   **Collection 1: habits**
   - Attributes: `user_id`, `title`, `description`, `frequency`, `streak_count`, `last_completed`, `created_at`
   - Permissions: Users can CRUD their own documents
   
   **Collection 2: completions**
   - Attributes: `habit_id`, `user_id`, `completed_at`
   - Permissions: Users can Create and Read their own documents

   > 📖 **Detailed guide**: See [APPWRITE_SETUP.md](APPWRITE_SETUP.md) for step-by-step instructions

### Step 4: Configure Environment (1 minute)

Create `.env` file in project root:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_PROJECT_NAME=habit-tracker
EXPO_PUBLIC_DB_ID=your_database_id
EXPO_PUBLIC_HABITS_COLLECTION_ID=your_habits_collection_id
EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID=your_completions_collection_id
```

Replace all `your_*` values with actual IDs from Appwrite Console.

### Step 5: Run the App (30 seconds)

```bash
# Start development server
npx expo start
```

Then choose how to run:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app

## ✅ Verify Setup

### Test Checklist

1. **Sign Up**
   - [ ] Create account with email/password
   - [ ] Automatically redirected to home screen

2. **Create Habit**
   - [ ] Navigate to "Add Habit" tab
   - [ ] Fill in title, description, frequency
   - [ ] Habit appears on home screen

3. **Complete Habit**
   - [ ] Swipe right on a habit
   - [ ] See "Completed!" indicator
   - [ ] Streak count increases

4. **View Streaks**
   - [ ] Navigate to "Streaks" tab
   - [ ] See habit statistics
   - [ ] Stats match your completions

5. **Delete Habit**
   - [ ] Swipe left on a habit
   - [ ] Habit is removed

## 🐛 Common Issues

### Issue: "Cannot connect to Appwrite"
**Solution:**
- Check internet connection
- Verify `.env` values are correct
- Ensure Appwrite project is active

### Issue: "Document with the requested ID could not be found"
**Solution:**
- Double-check collection IDs in `.env`
- Make sure collections exist in Appwrite

### Issue: "Permission denied"
**Solution:**
- Check collection permissions in Appwrite
- Ensure users can read/write their own documents

### Issue: App not updating after .env changes
**Solution:**
```bash
# Clear cache and restart
npx expo start -c
```

## 📚 Next Steps

Once everything is working:

1. **Explore the Code**
   - Check out `app/(tabs)/index.tsx` for main screen
   - Review `lib/auth-context.tsx` for authentication
   - See `lib/appwrite.ts` for backend config

2. **Customize**
   - Change colors in styles
   - Modify frequency options
   - Add new features

3. **Deploy**
   - Set up EAS Build for production builds
   - Submit to App Store / Play Store

## 🆘 Getting Help

- 📖 **Full Documentation**: [README.md](README.md)
- 🔧 **Appwrite Setup**: [APPWRITE_SETUP.md](APPWRITE_SETUP.md)
- 🤝 **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Gee-sus/habit-tracker/issues)

## 🎯 Pro Tips

### Development Tips

```bash
# Clear cache if things seem broken
npx expo start -c

# Check TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint

# Install specific platform dependencies
npx expo install

# Upgrade Expo SDK
npx expo upgrade
```

### Testing Tips

- Test on both iOS and Android if possible
- Try with slow internet to test loading states
- Test with many habits to check performance
- Try edge cases (empty strings, long text, etc.)

### Debugging Tips

```typescript
// Add console logs
console.log('User:', user);

// Check Appwrite Console for:
// - Auth → Users (see created accounts)
// - Database → Collections (see documents)
// - Logs (see API requests)
```

## 📱 Alternative: Use Expo Go

Quick test without emulator:

1. Install Expo Go on your phone
2. Run `npx expo start`
3. Scan QR code
4. App opens instantly!

**Note**: Some features may require a development build.

## 🎉 You're Ready!

That's it! You now have a fully functional habit tracker app. Start building your daily habits and maintaining those streaks! 🔥

---

**Estimated Total Time**: 5-10 minutes

*Questions? Open an issue or check the full documentation.*

