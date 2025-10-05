# Authentication UI - Testing Guide

## Overview
This guide provides step-by-step instructions for testing the complete authentication flow of the Marketing One-Pager Co-Creation tool.

## Prerequisites

### Backend Running
```bash
# From project root
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Verify backend is running:**
- Open http://localhost:8000/docs
- Should see FastAPI interactive documentation
- Test endpoints: /api/v1/auth/signup, /api/v1/auth/login, /api/v1/auth/me

### Frontend Running
```bash
# From project root
cd frontend
npm run dev
```

**Verify frontend is running:**
- Open http://localhost:5173 (or port shown in terminal)
- Should redirect to /login automatically if not authenticated

---

## Test Scenarios

### 1. New User Signup Flow

#### Steps:
1. Navigate to http://localhost:5173
2. Should auto-redirect to `/login`
3. Click "Sign up" link at bottom of form
4. Should navigate to `/signup`

#### Fill Signup Form:
- **Full Name**: `Test User`
- **Email**: `test@example.com`
- **Password**: `password123` (minimum 8 characters)

#### Expected Behavior:
- ✅ Form validation shows required field indicators
- ✅ Submit button shows "Creating Account..." during submission
- ✅ Success toast: "Account created! Signing you in..."
- ✅ Auto-login after signup
- ✅ Second toast: "Welcome back! Signed in as test@example.com"
- ✅ Redirect to `/dashboard`
- ✅ Dashboard shows user profile (name, email, join date)

#### Error Cases to Test:
- **Empty fields**: Should show "Full name is required", "Email is required", "Password is required"
- **Invalid email**: Should show "Please enter a valid email address"
- **Short password**: Should show "Password must be at least 8 characters"
- **Duplicate email**: Try signup again with same email → Should show "This email is already registered. Please sign in instead."

---

### 2. Existing User Login Flow

#### Steps:
1. If on dashboard, click "Sign Out" button
2. Should redirect to `/login` with toast: "Signed out. Come back soon!"
3. Fill login form:
   - **Email**: `test@example.com`
   - **Password**: `password123`

#### Expected Behavior:
- ✅ Submit button shows "Signing In..." during submission
- ✅ Success toast: "Welcome back! Signed in as test@example.com"
- ✅ Redirect to `/dashboard`
- ✅ User profile displays correctly

#### Error Cases to Test:
- **Wrong password**: Should show "Login failed. Please check your credentials."
- **Non-existent email**: Should show same error (security best practice)
- **Empty fields**: Should show validation errors inline

---

### 3. Protected Route Access

#### Test Unauthenticated Access:
1. Open browser in incognito/private mode
2. Try to access http://localhost:5173/dashboard directly
3. **Expected**: Should redirect to `/login` immediately

#### Test Authenticated Access:
1. Login as test@example.com
2. Try to access `/login` or `/signup` routes
3. **Expected**: Should redirect to `/dashboard` (already authenticated)

---

### 4. Session Persistence

#### Test Token Storage:
1. Login as test@example.com
2. Close browser tab
3. Open new tab to http://localhost:5173
4. **Expected**: Should redirect to `/dashboard` automatically (tokens in localStorage)

#### Test Logout Clears Session:
1. On dashboard, click "Sign Out"
2. Open new tab to http://localhost:5173
3. **Expected**: Should redirect to `/login` (tokens cleared)

---

### 5. UI/UX Validation

#### Poll Everywhere Branding Check:
- ✅ Login page: Gradient background (#007ACC to #1568B8)
- ✅ Forms: White card with rounded corners (12px border-radius)
- ✅ Buttons: Primary gradient on hover with smooth transitions
- ✅ Typography: Source Sans Pro font family
- ✅ Colors: Primary blue (#007ACC) for links and accents
- ✅ Input focus states: Blue border with shadow

#### Responsive Design:
- Test on mobile viewport (375px width)
- Test on tablet viewport (768px width)
- Test on desktop viewport (1440px width)
- **Expected**: Layout should adapt properly at all breakpoints

#### Accessibility:
- **Keyboard Navigation**: Tab through all form fields and buttons
- **Focus Indicators**: Clear visual focus on inputs and buttons
- **Required Fields**: Asterisk (*) indicator on labels
- **Error Messages**: Red color with clear text below inputs
- **ARIA Labels**: Screen reader compatible

---

## Developer Tools Inspection

### Browser DevTools Console
- **No errors** should appear during normal flow
- **No TypeScript errors** (once dependencies installed)
- **Network tab**: Check API requests
  - POST /api/v1/auth/signup → 201 Created
  - POST /api/v1/auth/token → 200 OK (login)
  - GET /api/v1/auth/me → 200 OK (user profile)

### localStorage Inspection
1. Open DevTools → Application tab → Local Storage
2. After login, should see:
   - `access_token`: JWT token string
   - `refresh_token`: JWT token string
   - `auth-storage`: Zustand state with user object

### React DevTools (if installed)
- Check Zustand store: `authStore` should have user, tokens, isAuthenticated
- Check React Query: `currentUser` query should be cached

---

## Common Issues & Troubleshooting

### Issue: Backend not responding
**Solution**: Ensure backend is running on port 8000
```bash
cd backend
uvicorn main:app --reload
```

### Issue: CORS errors
**Solution**: Backend should already have CORS configured for localhost:5173
If not, check backend/main.py for CORS middleware

### Issue: "Cannot find module" TypeScript errors
**Solution**: Install all dependencies
```bash
cd frontend
npm install
```

### Issue: Toast notifications not showing
**Solution**: Check main.tsx includes `<Toaster />` component inside ChakraProvider

### Issue: Routing not working
**Solution**: Ensure App.tsx is wrapped with `<BrowserRouter>`

### Issue: Auth state not persisting
**Solution**: Check localStorage for auth-storage key, verify authStore.ts initialization

---

## Manual Test Checklist

- [ ] Backend API docs accessible at http://localhost:8000/docs
- [ ] Frontend loads at http://localhost:5173
- [ ] Signup with new user succeeds
- [ ] Signup form validation works (empty fields, invalid email, short password)
- [ ] Auto-login after signup works
- [ ] Login with existing user succeeds
- [ ] Login form validation works
- [ ] Wrong credentials show error message
- [ ] Dashboard displays user profile correctly
- [ ] Logout button clears session and redirects
- [ ] Protected route redirects unauthenticated users
- [ ] Session persists across browser tabs
- [ ] Toast notifications appear for all actions
- [ ] Poll Everywhere branding visible (gradient, colors, fonts)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No console errors during normal flow
- [ ] Keyboard navigation works properly

---

## Next Steps After Testing

Once all tests pass:
1. ✅ Mark todo #12 as completed
2. Document any bugs or issues discovered
3. Create GitHub issue for any UI polish needed
4. Move to next phase: Brand Kit UI implementation
5. Consider adding automated tests (Jest, React Testing Library)

---

## Test Results Documentation

Document your test results here:

**Date**: _________  
**Tester**: _________

| Test Scenario | Status | Notes |
|--------------|--------|-------|
| New User Signup | ⬜ Pass / ⬜ Fail | |
| Existing User Login | ⬜ Pass / ⬜ Fail | |
| Protected Routes | ⬜ Pass / ⬜ Fail | |
| Session Persistence | ⬜ Pass / ⬜ Fail | |
| UI/UX Branding | ⬜ Pass / ⬜ Fail | |
| Responsive Design | ⬜ Pass / ⬜ Fail | |
| Accessibility | ⬜ Pass / ⬜ Fail | |
| Error Handling | ⬜ Pass / ⬜ Fail | |

**Critical Issues Found**: _________

**Minor Issues Found**: _________

**Overall Status**: ⬜ Ready for Next Phase / ⬜ Needs Fixes
