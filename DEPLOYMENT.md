# Deployment Guide

## Backend Deployment (Vercel)

1. **Build the project locally to test:**

   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Deploy to Vercel:**

   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel --prod`
   - Set root directory to: `backend`

3. **Set Environment Variables in Vercel:**
   - NODE_ENV=production
   - Any other env vars you need

## Frontend Deployment (Vercel)

1. **Update the backend URL:**

   - After backend is deployed, copy the Vercel URL
   - Update `frontend/.env.production` with the backend URL
   - Remove the `http://` prefix, just use the domain

2. **Deploy to Vercel:**
   - Create new Vercel project
   - Set root directory to: `frontend`
   - Vercel will auto-detect Vite configuration

## Notes

- Backend uses Socket.IO - Vercel might have limitations
- If WebSockets don't work, we'll need to modify the approach
- Monitor the deployment logs for any issues

## Testing

After both are deployed:

1. Visit the frontend URL
2. Try creating a game
3. Check browser console for WebSocket connection errors
4. Check Vercel function logs for backend errors
