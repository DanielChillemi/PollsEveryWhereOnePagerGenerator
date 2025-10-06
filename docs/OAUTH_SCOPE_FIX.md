# OAuth Scope Issue Resolution

## Problem Summary

The Phase 2.4 test failed with:
```
403 - Missing scopes: [asset:read]
```

## Root Cause

Your current Canva access token was generated **without** the `asset:read` scope in the OAuth authorization request. Even though you have `asset:read` enabled in your Canva app settings, the token itself doesn't include this permission.

### Why This Matters

As Canva's documentation states:

> When enabling and using scopes, you must be explicit.
> 
> For example, the `asset:write` scope doesn't grant `asset:read` permissions. To get both read and write permissions for assets, you must enable both scopes in your integration settings, **and request both scopes during the authorization process**.

## Required Scopes for Phase 2.4

```
profile:read              ✅ User profile access
design:content:read       ✅ Read designs
design:content:write      ✅ Create/modify designs
asset:write              ✅ Upload assets
asset:read               ❌ MISSING - Read asset metadata (needed for job polling)
```

## Solution Options

### Option 1: Use the Helper Script (Recommended) ⭐

We've created a script to automate the token regeneration:

```bash
python -m backend.scripts.regenerate_canva_token
```

**What it does:**
1. Builds the correct OAuth URL with all 5 required scopes
2. Guides you through the authorization process
3. Exchanges the authorization code for a new token
4. Verifies that `asset:read` is included
5. Provides the new token to update in `.env`

**Steps:**
1. Make sure `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, and `CANVA_REDIRECT_URI` are in your `.env`
2. Run the script
3. Follow the prompts
4. Update `.env` with the new token
5. Re-run the test

### Option 2: Manual Authorization

If you prefer to do it manually:

**Step 1: Build the authorization URL**

```
https://www.canva.com/api/oauth/authorize?
  client_id=YOUR_CLIENT_ID
  &scope=profile:read%20design:content:read%20design:content:write%20asset:write%20asset:read
  &response_type=code
  &redirect_uri=YOUR_REDIRECT_URI
  &state=regenerate_token
```

Replace:
- `YOUR_CLIENT_ID` with your actual client ID
- `YOUR_REDIRECT_URI` with your callback URL (URL-encoded)

**Step 2: Authorize in browser**

1. Open the URL in your browser
2. Log in to Canva if needed
3. Approve the permissions (you'll see the new `asset:read` permission)
4. Copy the authorization code from the callback URL

**Step 3: Exchange code for token**

```bash
curl -X POST https://api.canva.com/rest/v1/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

**Step 4: Update .env**

```bash
CANVA_ACCESS_TOKEN=the_new_token_from_response
```

## Verification

After updating your token, verify it includes the correct scopes:

```bash
curl -X GET https://api.canva.com/rest/v1/oauth/token/info \
  -H "Authorization: Bearer YOUR_NEW_TOKEN"
```

Check that the response includes `asset:read` in the `scopes` array.

## Testing

Once your token is updated:

```bash
# Re-run the Phase 2.4 integration test
python -m backend.tests.test_phase_2_4_quick
```

**Expected result:**
```
✓ Step 1: Render to PNG (126KB)
✓ Step 2: Upload asset (job created)
✓ Step 2b: Wait for upload (asset ID retrieved)  ← This should now work
✓ Step 3: Create design (design ID + URL)
✓ Step 4: Export to PDF (download URL)
```

## Important Notes

### Token Expiration

Canva access tokens expire after **4 hours**. When the token expires:

1. You'll get `401 Unauthorized` errors
2. You'll need to regenerate the token using the same process
3. Or implement refresh token logic (recommended for production)

### Scope Permissions

You can verify your Canva app's enabled scopes at:
https://www.canva.com/developers/apps/YOUR_APP_ID/settings

Make sure `asset:read` is checked in the app settings **before** running the authorization flow.

### Development vs Production

For production, implement proper OAuth flow with:
- Refresh tokens for auto-renewal
- Secure token storage (database, not .env)
- Token expiration handling
- User-specific tokens (not shared)

## Troubleshooting

### "Missing scopes: [asset:read]" persists

- Verify you updated the `.env` file with the **new** token
- Restart your backend server to reload environment variables
- Check that the token was generated with the correct scope (use token info endpoint)

### Authorization URL doesn't show asset:read permission

- Ensure `asset:read` is enabled in your Canva app settings
- Wait a few minutes after enabling the scope
- Try clearing browser cache/cookies for canva.com

### Token exchange fails

- Verify your `client_id` and `client_secret` are correct
- Check that the redirect URI matches exactly (including http/https, port, path)
- Make sure the authorization code hasn't expired (use within 10 minutes)

## References

- **Canva OAuth Documentation**: https://www.canva.dev/docs/connect/authentication/oauth-flows/
- **Available Scopes**: https://www.canva.dev/docs/connect/appendix/scopes/
- **Asset Upload API**: https://www.canva.dev/docs/connect/api-reference/assets/create-asset-upload-job/
- **Token Info Endpoint**: https://www.canva.dev/docs/connect/api-reference/oauth/get-token-info/

---

**Next Step:** Run the helper script to get your updated token! 🚀

```bash
python -m backend.scripts.regenerate_canva_token
```
