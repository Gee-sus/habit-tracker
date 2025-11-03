# 🚀 Appwrite Setup Guide

This guide will walk you through setting up Appwrite backend for the Habit Tracker app.

## 📋 Prerequisites

- An Appwrite account (sign up at [cloud.appwrite.io](https://cloud.appwrite.io/))
- Basic understanding of databases and collections

## 🏗️ Step-by-Step Setup

### 1. Create a New Project

1. Log in to [Appwrite Console](https://cloud.appwrite.io/)
2. Click **"Create Project"**
3. Enter project name: `Habit Tracker` (or your preferred name)
4. Click **"Create"**
5. **Save your Project ID** - you'll need it for the `.env` file

### 2. Configure Platform (Optional but Recommended)

1. Go to **Settings** → **Platforms**
2. Click **"Add Platform"**
3. Select your platform type:
   - **iOS App**: Add bundle ID (e.g., `com.yourname.habittracker`)
   - **Android App**: Add package name (e.g., `com.yourname.habittracker`)
   - **Web App**: Add hostname (e.g., `localhost`)

### 3. Create Database

1. Navigate to **Databases** in the left sidebar
2. Click **"Create Database"**
3. Enter database name: `habit-tracker-db`
4. Click **"Create"**
5. **Save your Database ID** - you'll need it for the `.env` file

### 4. Create "habits" Collection

1. Inside your database, click **"Create Collection"**
2. Enter collection name: `habits`
3. Collection ID: Use default or custom (save this ID!)
4. Click **"Create"**

#### Add Attributes to "habits" Collection

Click **"Attributes"** tab and add the following:

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| `user_id` | String | 255 | ✅ Yes | - | ❌ No |
| `title` | String | 255 | ✅ Yes | - | ❌ No |
| `description` | String | 1000 | ✅ Yes | - | ❌ No |
| `frequency` | String | 50 | ✅ Yes | `daily` | ❌ No |
| `streak_count` | Integer | - | ✅ Yes | `0` | ❌ No |
| `last_completed` | DateTime | - | ✅ Yes | - | ❌ No |
| `created_at` | DateTime | - | ✅ Yes | - | ❌ No |

**Important**: Click **"Create"** after each attribute and wait for it to be created before adding the next one.

#### Set Permissions for "habits" Collection

1. Go to **Settings** tab in the collection
2. Scroll to **Permissions** section
3. Click **"Add Role"**
4. Configure permissions:

   **For Create:**
   - Role: `Users`
   - Permissions: `Create`

   **For Read, Update, Delete:**
   - Role: `Users` (User level)
   - Permissions: `Read`, `Update`, `Delete`
   - This ensures users can only access their own habits

#### Create Indexes (Optional - for better performance)

1. Go to **Indexes** tab
2. Click **"Create Index"**
3. Create index on `user_id`:
   - Key: `user_id_index`
   - Type: `Key`
   - Attributes: `user_id` (Ascending)

### 5. Create "completions" Collection

1. Go back to your database
2. Click **"Create Collection"**
3. Enter collection name: `completions`
4. Collection ID: Use default or custom (save this ID!)
5. Click **"Create"**

#### Add Attributes to "completions" Collection

Click **"Attributes"** tab and add:

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| `habit_id` | String | 255 | ✅ Yes | - | ❌ No |
| `user_id` | String | 255 | ✅ Yes | - | ❌ No |
| `completed_at` | DateTime | - | ✅ Yes | - | ❌ No |

#### Set Permissions for "completions" Collection

1. Go to **Settings** tab
2. Configure permissions:
   - **Create**: `Users`
   - **Read**: `Users` (User level)
   - **Note**: Users should NOT be able to update or delete completions

#### Create Indexes

Create these indexes for better query performance:

1. **user_id_index**
   - Key: `user_id_index`
   - Type: `Key`
   - Attributes: `user_id` (Ascending)

2. **habit_id_index**
   - Key: `habit_id_index`
   - Type: `Key`
   - Attributes: `habit_id` (Ascending)

3. **completed_at_index**
   - Key: `completed_at_index`
   - Type: `Key`
   - Attributes: `completed_at` (Descending)

### 6. Enable Authentication

1. Go to **Auth** in the left sidebar
2. Make sure **Email/Password** is enabled (it should be by default)
3. Configure settings:
   - **Session Length**: 365 days (or your preference)
   - **Password History**: 0 (or as needed)
   - **Password Dictionary**: Enable if desired

### 7. Configure Security (Recommended)

1. Go to **Settings** → **Security**
2. Configure rate limits if needed
3. Enable **Two-Factor Authentication** for your account
4. Review and set appropriate limits for your use case

### 8. Get Your Credentials

Collect all the following values:

```
Project Endpoint: https://cloud.appwrite.io/v1
Project ID: [from project settings]
Database ID: [from database settings]
Habits Collection ID: [from habits collection settings]
Completions Collection ID: [from completions collection settings]
```

### 9. Create .env File

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_actual_project_id
EXPO_PUBLIC_APPWRITE_PROJECT_NAME=habit-tracker
EXPO_PUBLIC_DB_ID=your_actual_database_id
EXPO_PUBLIC_HABITS_COLLECTION_ID=your_actual_habits_collection_id
EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID=your_actual_completions_collection_id
```

Replace all placeholder values with your actual IDs from Appwrite.

## ✅ Verify Setup

### Test Authentication

1. Start your app: `npx expo start`
2. Try to sign up with a test email
3. Check Appwrite Console → **Auth** → **Users** to see if the user was created

### Test Database Operations

1. Create a test habit in the app
2. Check Appwrite Console → **Databases** → **habits** to see if the document was created
3. Complete the habit to test the completions collection

## 🐛 Troubleshooting

### Common Issues

**Error: "AppwriteException: User (role: guests) missing scope (account)"**
- Solution: Make sure you're signed in to the app

**Error: "AppwriteException: Invalid document structure"**
- Solution: Check that all required attributes are set correctly in Appwrite Console
- Verify attribute names match exactly (they are case-sensitive)

**Error: "AppwriteException: Document with the requested ID could not be found"**
- Solution: Verify your Database ID and Collection IDs are correct in `.env`

**Data not appearing in the app**
- Solution: Check collection permissions - make sure users can read their own documents
- Verify the `user_id` attribute is being set correctly

**Real-time updates not working**
- Solution: Appwrite Realtime should work automatically with the free tier
- Check your internet connection
- Restart the development server

### Check Your Setup

Run through this checklist:

- [ ] Project created in Appwrite Console
- [ ] Database created
- [ ] "habits" collection created with all attributes
- [ ] "completions" collection created with all attributes
- [ ] Permissions set correctly for both collections
- [ ] All IDs copied to `.env` file
- [ ] `.env` file is in the project root
- [ ] Development server restarted after creating `.env`

## 📞 Need Help?

- **Appwrite Docs**: [appwrite.io/docs](https://appwrite.io/docs)
- **Appwrite Discord**: [appwrite.io/discord](https://appwrite.io/discord)
- **GitHub Issues**: [Create an issue](https://github.com/Gee-sus/habit-tracker/issues)

## 🎉 Next Steps

Once setup is complete:

1. Restart your development server
2. Test creating, completing, and deleting habits
3. Check the Streaks screen
4. Explore the app!

---

**Note**: If you're using Appwrite self-hosted instead of cloud, replace `https://cloud.appwrite.io/v1` with your self-hosted instance URL.

