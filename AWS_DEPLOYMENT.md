# AWS Deployment Guide for E-commerce Backend

## 🚀 Quick Deployment Steps

### Step 1: Prepare Your Backend Files

Before deploying to AWS, ensure you have the updated files:
- ✅ `server.js` - Updated with `CLIENT_URL` environment variable
- ✅ `docker-compose.yml` - Updated with `CLIENT_URL` configuration
- ✅ `.env.example` - Template for environment variables

### Step 2: Create `.env` File on AWS Server

SSH into your AWS EC2 instance and create a `.env` file in your backend directory:

```bash
# SSH into your AWS instance
ssh -i your-key.pem ubuntu@13.126.109.53

# Navigate to your backend directory
cd /path/to/your/backend

# Create .env file
nano .env
```

Add the following content to `.env`:

```bash
# IMPORTANT: Set this to your frontend URL
CLIENT_URL=http://localhost:5173

# If your frontend is also deployed, use that URL instead:
# CLIENT_URL=https://your-frontend-domain.com

# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Connection (you're already using MongoDB Atlas)
MONGODB_URI=mongodb+srv://mohit:pal2001@cluster0.yst7ouy.mongodb.net/

# JWT Secret - CHANGE THIS!
JWT_SECRET=your-super-secret-jwt-key-change-this

# Cloudinary (if you're using image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Save and exit**: Press `Ctrl+X`, then `Y`, then `Enter`

### Step 3: Deploy Using Docker Compose

```bash
# Pull latest code (if using git)
git pull origin main

# Stop existing containers
docker-compose down

# Rebuild and start containers
docker-compose up -d --build

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f backend
```

### Step 4: Deploy Without Docker (Alternative)

If you're running Node.js directly without Docker:

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Stop existing process (if using PM2)
pm2 stop all

# Start the application
pm2 start server.js --name ecommerce-backend

# Or without PM2
node server.js
```

### Step 5: Update Frontend Configuration

On your **local machine**, update the frontend `.env`:

```bash
# frontend/.env
VITE_API_BASE_URL=http://13.126.109.53:5000
```

Then restart your frontend dev server:

```bash
cd frontend
npm run dev
```

## 🔍 Verification Steps

1. **Check Backend is Running**:
   ```bash
   curl http://13.126.109.53:5000/api/auth/check-auth
   ```

2. **Test Login Flow**:
   - Login from your frontend
   - Check browser DevTools → Network → Verify cookies are set
   - Refresh the page
   - Should remain logged in ✅

3. **Check Logs for Errors**:
   ```bash
   # With Docker
   docker-compose logs -f backend
   
   # With PM2
   pm2 logs ecommerce-backend
   ```

## 🌐 Different Deployment Scenarios

### Scenario 1: Frontend Local + Backend AWS
```bash
# Backend .env (on AWS)
CLIENT_URL=http://localhost:5173
NODE_ENV=production

# Frontend .env (local)
VITE_API_BASE_URL=http://13.126.109.53:5000
```

### Scenario 2: Both on AWS (Same Server)
```bash
# Backend .env (on AWS)
CLIENT_URL=http://13.126.109.53:3000
NODE_ENV=production

# Frontend .env (on AWS)
VITE_API_BASE_URL=http://13.126.109.53:5000
```

### Scenario 3: Both on AWS (Different Servers/Domains)
```bash
# Backend .env (on AWS)
CLIENT_URL=https://your-frontend.com
NODE_ENV=production

# Frontend .env (on AWS)
VITE_API_BASE_URL=https://api.your-backend.com
```

## ⚠️ Important Security Notes

### 1. Use HTTPS in Production
For production with `NODE_ENV=production`, you MUST use HTTPS because cookies are set with `secure: true` and `sameSite: 'none'`.

**Set up SSL/TLS**:
- Use AWS Certificate Manager (ACM)
- Or use Let's Encrypt with Nginx reverse proxy

### 2. Update Cookie Settings for HTTP (Temporary)
If you can't use HTTPS immediately, temporarily modify `auth.controller.js`:

```javascript
// Line 59 in auth.controller.js
sameSite: isProduction ? 'lax' : 'lax',  // Change 'none' to 'lax'
secure: false,  // Change isProduction to false
```

**⚠️ WARNING**: This is less secure. Use only for testing!

### 3. Change JWT Secret
Never use the default JWT secret in production:

```bash
# Generate a strong secret
openssl rand -base64 32

# Add to .env
JWT_SECRET=<generated-secret>
```

## 🐛 Troubleshooting

### Issue: Still getting "Unauthorized user!"

**Check 1**: Verify CLIENT_URL is set correctly
```bash
# On AWS server
cat .env | grep CLIENT_URL
```

**Check 2**: Restart backend after changing .env
```bash
docker-compose restart backend
# or
pm2 restart ecommerce-backend
```

**Check 3**: Check browser cookies
- Open DevTools → Application → Cookies
- Verify `token` cookie exists for your backend domain

**Check 4**: Check CORS headers
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://13.126.109.53:5000/api/auth/check-auth -v
```

Should return:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

### Issue: Cookies not being sent

**Solution**: Ensure `withCredentials: true` in frontend axios calls (already done in your code)

### Issue: CORS errors in browser console

**Solution**: Double-check CLIENT_URL matches your frontend URL exactly (including protocol and port)

## 📝 Deployment Checklist

- [ ] Updated `server.js` with CLIENT_URL configuration
- [ ] Created `.env` file on AWS server
- [ ] Set correct `CLIENT_URL` in backend `.env`
- [ ] Set correct `VITE_API_BASE_URL` in frontend `.env`
- [ ] Restarted backend service
- [ ] Restarted frontend dev server
- [ ] Tested login flow
- [ ] Tested page refresh (should stay logged in)
- [ ] Checked browser console for errors
- [ ] Verified cookies are being set

## 🔄 Quick Reference Commands

```bash
# On AWS Server
cd /path/to/backend
nano .env                          # Edit environment variables
docker-compose up -d --build       # Rebuild and restart
docker-compose logs -f backend     # View logs
docker-compose ps                  # Check status

# On Local Machine (Frontend)
cd frontend
nano .env                          # Edit environment variables
npm run dev                        # Restart dev server
```

## 📞 Need Help?

If you're still facing issues:
1. Check backend logs: `docker-compose logs -f backend`
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Ensure AWS security groups allow traffic on port 5000
