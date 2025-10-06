# Phase 2.4: No-Polling Solution for Fast Uploads

## Discovery

The Canva `/v1/asset-uploads` API can return **immediate success** for small files:

```json
{
  "job": {
    "id": "...",
    "status": "success",  ← Immediate!
    "asset": {
      "id": "Msd59349ff"  ← Asset ID already here
    }
  }
}
```

**This means we don't need `asset:read` scope if the upload completes immediately!**

## Solution: Check POST Response First

### Changes Required

#### 1. Update `wait_for_asset_upload()` in `canva_client.py`

**Location:** Line 435 (the method signature)

**Change the signature to accept the initial response:**

```python
def wait_for_asset_upload(
    self,
    job_id: str,
    initial_response: Optional[Dict[str, Any]] = None,  # NEW parameter
    timeout: int = 60,
    poll_interval: int = 2
) -> str:
```

**Add logic at the start of the method (after docstring, before the while loop):**

```python
def wait_for_asset_upload(
    self,
    job_id: str,
    initial_response: Optional[Dict[str, Any]] = None,
    timeout: int = 60,
    poll_interval: int = 2
) -> str:
    """
    Wait for an asset upload job to complete and return the asset ID.
    
    Args:
        job_id: Asset upload job ID
        initial_response: Optional initial upload response to check for immediate success
        timeout: Maximum time to wait in seconds (default: 60)
        poll_interval: Time between status checks in seconds (default: 2)
        
    Returns:
        Asset ID (string)
        
    Raises:
            CanvaAPIError: If upload fails or times out
    """
    # Check if upload completed immediately (no polling needed!)
    if initial_response:
        job = initial_response.get('job', {})
        status = job.get('status')
        
        if status == 'success':
            asset_id = job.get('asset', {}).get('id')
            if asset_id:
                self.logger.info(f"✓ Asset upload completed immediately: {asset_id}")
                return asset_id
        elif status == 'failed':
            error = job.get('error', {})
            error_code = error.get('code', 'unknown')
            error_msg = error.get('message', 'Upload failed')
            raise CanvaAPIError(f"Asset upload job {job_id} failed immediately: {error_code} - {error_msg}")
    
    # If not immediate success, poll for completion
    self.logger.info(f"Upload not immediate, polling for completion...")
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        # ... rest of existing code ...
```

#### 2. Update `canva_export_service.py`

**Location:** Around line 127 (in the `export_to_canva` method)

**Change this:**

```python
# Step 2: Upload to Canva (async job)
logger.info("Step 2/4: Uploading to Canva...")
upload_result = self.canva_client.upload_asset(
    file_data=image_bytes,
    file_name=f"{self._sanitize_filename(onepager.title)}.png"
)
job_id = upload_result["job"]["id"]
logger.info(f"✓ Asset upload job created: {job_id}")

# Wait for upload to complete
logger.info("Step 2b/4: Waiting for asset upload to complete...")
asset_id = self.canva_client.wait_for_asset_upload(job_id, timeout=60)
logger.info(f"✓ Asset uploaded: {asset_id}")
```

**To this:**

```python
# Step 2: Upload to Canva (async job)
logger.info("Step 2/4: Uploading to Canva...")
upload_result = self.canva_client.upload_asset(
    file_data=image_bytes,
    file_name=f"{self._sanitize_filename(onepager.title)}.png"
)
job_id = upload_result["job"]["id"]
logger.info(f"✓ Asset upload job created: {job_id}")

# Wait for upload to complete (pass initial response to avoid polling if immediate)
logger.info("Step 2b/4: Checking upload status...")
asset_id = self.canva_client.wait_for_asset_upload(
    job_id,
    initial_response=upload_result,  # ← NEW: Pass the upload response
    timeout=60
)
logger.info(f"✓ Asset uploaded: {asset_id}")
```

## Why This Works

1. **Small files (126KB PNG)** likely complete immediately
2. **POST response includes asset** when `status: "success"`
3. **No GET call needed** = No `asset:read` scope required
4. **Fallback to polling** if upload takes longer (would need `asset:read`)

## Testing

After making these changes:

```bash
# Update your .env with the new token
CANVA_ACCESS_TOKEN=eyJraWQiOiIy...

# Run the test
python -m backend.tests.test_phase_2_4_quick
```

**Expected result:**
```
✅ Step 1: Render PNG (126KB)
✅ Step 2: Upload asset (job created)
✅ Step 2b: Asset completed immediately (no polling!)
✅ Step 3: Create design
✅ Step 4: Export PDF
```

## If Upload Still Takes Time

If the upload doesn't complete immediately and you see:
```
Upload not immediate, polling for completion...
```

Then you'll get the 403 error again and will need to:
1. Add `asset:read` to your OAuth scopes
2. Re-authorize to get a new token with that scope

But for a 126KB file, **it should complete immediately**! 🚀

---

**Next Step:** Apply these two changes and run the test!
