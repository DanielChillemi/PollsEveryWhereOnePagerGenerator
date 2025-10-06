# How to Get asset:read Scope in Your Token

## The Problem
Your OAuth token is missing the `asset:read` scope even though it's enabled in your Canva app settings. This is because **the authorization URL must explicitly request the scope** in the `scope` parameter.

## Current Token Scopes
```
✓ profile:read
✓ design:content:read
✓ design:content:write
✓ asset:write
✗ asset:read  ← MISSING!
```

## Why asset:read is Needed
- POST /v1/asset-uploads only needs `asset:write` ✅
- GET /v1/asset-uploads/{jobId} needs `asset:read` ❌
- Your 126KB PNG returned `status: in_progress` (not immediate)
- Must poll job status using GET endpoint
- GET endpoint returns 403 without asset:read scope

## Solution: Regenerate Token with Correct Scopes

### Step 1: Build Authorization URL
Open this URL in your browser (replace YOUR_REDIRECT_URI):

```
https://www.canva.com/api/oauth/authorize?client_id=OC-AZmqoHA23-4k&scope=profile:read%20design:content:read%20design:content:write%20asset:write%20asset:read&response_type=code&redirect_uri=YOUR_REDIRECT_URI&state=with_asset_read
```

**CRITICAL**: Notice the `scope` parameter includes ALL 5 scopes:
- `profile:read`
- `design:content:read`
- `design:content:write`
- `asset:write`
- `asset:read` ← MUST BE EXPLICITLY INCLUDED

### Step 2: Complete OAuth Flow
1. Canva will show permissions screen
2. Approve all permissions
3. You'll be redirected to: `YOUR_REDIRECT_URI?code=AUTHORIZATION_CODE&state=with_asset_read`
4. Copy the `code` parameter value

### Step 3: Exchange Code for Token
Run this PowerShell command (replace placeholders):

```powershell
$clientId = "OC-AZmqoHA23-4k"
$clientSecret = "YOUR_CLIENT_SECRET"  # From Canva app settings
$code = "AUTHORIZATION_CODE_FROM_STEP_2"
$redirectUri = "YOUR_REDIRECT_URI"

$body = @{
    grant_type = "authorization_code"
    code = $code
    redirect_uri = $redirectUri
} | ConvertTo-Json

$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${clientId}:${clientSecret}"))

$response = Invoke-RestMethod -Uri "https://api.canva.com/rest/v1/oauth/token" `
    -Method POST `
    -Headers @{
        "Authorization" = "Basic $auth"
        "Content-Type" = "application/json"
    } `
    -Body $body

Write-Host "`n✓ New Access Token:"
Write-Host $response.access_token
Write-Host "`n✓ Token expires in: $($response.expires_in) seconds"
```

### Step 4: Verify Token Has asset:read
```powershell
$token = "NEW_TOKEN_FROM_STEP_3"
$payload = $token.Split('.')[1]
$padding = '=' * ((4 - ($payload.Length % 4)) % 4)
$decoded = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($payload + $padding))
$json = $decoded | ConvertFrom-Json

Write-Host "Token Scopes:"
$json.scopes | ForEach-Object { Write-Host "  - $_" }

if ($json.scopes -contains "asset:read") {
    Write-Host "`n✅ SUCCESS: asset:read scope is included!"
} else {
    Write-Host "`n❌ ERROR: asset:read scope still missing!"
}
```

### Step 5: Update .env File
```bash
# Edit .env file
CANVA_ACCESS_TOKEN=NEW_TOKEN_WITH_ASSET_READ
```

### Step 6: Test Phase 2.4
```powershell
$env:PYTHONPATH = "."
python backend/tests/test_phase_2_4_quick.py
```

**Expected Output:**
```
✅ Test 1: Rendered 126447 bytes
✅ Test 2: Asset upload job created
✅ Asset upload polling succeeded
✅ Test 3: Design created
✅ Test 4: PDF exported
```

## Why This Happened
The OAuth authorization URL you used previously didn't include `asset:read` in the scope parameter. Canva only grants the scopes explicitly requested in the authorization URL, regardless of what's enabled in app settings.

## Quick Reference

### All Required Scopes for Phase 2.4
```
profile:read          ← User info
design:content:read   ← Read designs
design:content:write  ← Create designs
asset:write          ← Upload assets (POST)
asset:read           ← Poll upload status (GET)
```

### Authorization URL Template
```
https://www.canva.com/api/oauth/authorize?
  client_id={YOUR_CLIENT_ID}
  &scope=profile:read%20design:content:read%20design:content:write%20asset:write%20asset:read
  &response_type=code
  &redirect_uri={YOUR_REDIRECT_URI}
  &state=optional_state
```

## Next Steps
1. Get your CLIENT_SECRET from Canva Developer Portal
2. Choose a REDIRECT_URI (e.g., http://localhost:3000/callback)
3. Follow Steps 1-6 above
4. Once you have the token with asset:read, Phase 2.4 will work! 🎉
