# Quick OAuth Token Regeneration Guide

Since your environment variables might not be fully set up, here's the **manual** way to regenerate your Canva token with the `asset:read` scope.

## Step 1: Get Your App Credentials

You need these values from your Canva app settings:
- **Client ID**: Found at https://www.canva.com/developers/apps/YOUR_APP_ID/settings
- **Client Secret**: Found in the same place (keep this secret!)
- **Redirect URI**: The callback URL you configured (e.g., `http://localhost:8000/api/v1/canva/callback`)

## Step 2: Build the Authorization URL

Replace the placeholders in this URL:

```
https://www.canva.com/api/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=profile:read%20design:content:read%20design:content:write%20asset:write%20asset:read&response_type=code&redirect_uri=YOUR_REDIRECT_URI&state=regenerate_token
```

**Replace:**
- `YOUR_CLIENT_ID` with your actual client ID
- `YOUR_REDIRECT_URI` with your callback URL (URL-encoded if it has special characters)

**Example:**
```
https://www.canva.com/api/oauth/authorize?client_id=OC-ABC123&scope=profile:read%20design:content:read%20design:content:write%20asset:write%20asset:read&response_type=code&redirect_uri=http://localhost:8000/api/v1/canva/callback&state=regenerate_token
```

## Step 3: Authorize in Your Browser

1. **Open the URL** from Step 2 in your browser
2. **Log in to Canva** (if not already logged in)
3. **Review the permissions** - you should see:
   - View your profile information
   - Read your designs
   - Create and edit designs
   - Upload assets ← Existing
   - **View your assets** ← NEW (asset:read)
4. **Click "Authorize"**
5. **Copy the callback URL** from your browser's address bar

The callback URL will look like:
```
http://localhost:8000/api/v1/canva/callback?code=ABCD1234567890XYZ&state=regenerate_token
```

## Step 4: Extract the Authorization Code

From the callback URL, copy the `code` parameter value.

Example: If the URL is:
```
http://localhost:8000/api/v1/canva/callback?code=ABCD1234567890XYZ&state=regenerate_token
```

The code is: `ABCD1234567890XYZ`

## Step 5: Exchange Code for Token

Run this PowerShell command (replace placeholders):

```powershell
$body = @{
    grant_type = "authorization_code"
    code = "YOUR_AUTH_CODE"
    client_id = "YOUR_CLIENT_ID"
    client_secret = "YOUR_CLIENT_SECRET"
    redirect_uri = "YOUR_REDIRECT_URI"
}

$response = Invoke-RestMethod -Uri "https://api.canva.com/rest/v1/oauth/token" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"

Write-Host "✅ Token received!"
Write-Host ""
Write-Host "Access Token:"
Write-Host $response.access_token
Write-Host ""
Write-Host "Scopes:"
Write-Host $response.scope
Write-Host ""
Write-Host "Expires in: $($response.expires_in) seconds ($([math]::Round($response.expires_in / 3600, 1)) hours)"
```

**Replace:**
- `YOUR_AUTH_CODE` with the code from Step 4
- `YOUR_CLIENT_ID` with your client ID
- `YOUR_CLIENT_SECRET` with your client secret
- `YOUR_REDIRECT_URI` with your redirect URI

## Step 6: Update Your .env File

Copy the access token from the output and update your `.env` file:

```bash
CANVA_ACCESS_TOKEN=the_new_token_from_response
```

**Important:** This token expires in **4 hours**, so you'll need to regenerate it periodically.

## Step 7: Verify and Test

1. **Restart your backend** if it's running
2. **Run the test:**
   ```bash
   python -m backend.tests.test_phase_2_4_quick
   ```

3. **Expected result:**
   ```
   ✓ Step 1: Render to PNG (126KB)
   ✓ Step 2: Upload asset (job created)
   ✓ Step 2b: Wait for upload (asset ID retrieved) ← Should work now!
   ✓ Step 3: Create design (design ID + URL)
   ✓ Step 4: Export to PDF (download URL)
   ```

## Alternative: Using cURL

If you prefer cURL:

```bash
curl -X POST https://api.canva.com/rest/v1/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

## Troubleshooting

### "Invalid client_id"
- Double-check your client ID from Canva app settings
- Make sure there are no extra spaces or quotes

### "Invalid redirect_uri"
- The redirect URI must **exactly match** what's configured in your Canva app
- Check for trailing slashes, http vs https, port numbers

### "Invalid authorization code"
- Authorization codes expire after 10 minutes
- Make sure you haven't already used this code
- Generate a new one by starting from Step 2 again

### "Token doesn't include asset:read"
- Make sure your Canva app has `asset:read` enabled in settings
- Wait a few minutes after enabling the scope
- Clear browser cookies for canva.com and try again

## Quick Reference

**Required Scopes (space-separated):**
```
profile:read design:content:read design:content:write asset:write asset:read
```

**URL-encoded (for authorization URL):**
```
profile:read%20design:content:read%20design:content:write%20asset:write%20asset:read
```

---

**Need help?** Check `docs/OAUTH_SCOPE_FIX.md` for detailed troubleshooting.
