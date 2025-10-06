"""
Canva Connect API Client
A Python module for interacting with Canva's Connect APIs to create designs and export PDFs.

This module provides authentication, request handling, and error management for the 
Canva API proof-of-concept as part of our marketing one-pager co-creation tool.
"""

import os
import json
import time
import logging
import base64
import requests
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from datetime import datetime, timedelta


class CanvaAPIError(Exception):
    """Base exception for Canva API errors."""
    def __init__(self, message: str, status_code: int = None, response_data: Dict = None):
        self.message = message
        self.status_code = status_code
        self.response_data = response_data
        super().__init__(self.message)


class CanvaRateLimitError(CanvaAPIError):
    """Exception raised when API rate limit is exceeded."""
    pass


class CanvaAuthError(CanvaAPIError):
    """Exception raised for authentication errors."""
    pass


@dataclass
class CanvaDesign:
    """Represents a Canva design object."""
    id: str
    title: str
    url: str
    thumbnail_url: Optional[str] = None
    created_at: Optional[str] = None


@dataclass
class CanvaExport:
    """Represents a Canva export job."""
    job_id: str
    status: str
    url: Optional[str] = None
    download_url: Optional[str] = None


class CanvaClient:
    """
    Client for interacting with Canva Connect APIs.
    
    Handles authentication, rate limiting, and provides methods for:
    - Creating designs from templates or custom layouts
    - Exporting designs to PDF format
    - Managing design elements and content
    """
    
    def __init__(self, api_token: str, base_url: str = "https://api.canva.com/rest"):
        """
        Initialize the Canva API client.
        
        Args:
            api_token: Your Canva Connect API access token
            base_url: Canva API base URL (default: production URL)
        """
        self.api_token = api_token
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json',
        })
        
        # Rate limiting tracking
        self.rate_limit_requests = int(os.getenv('CANVA_RATE_LIMIT_REQUESTS', 100))
        self.rate_limit_period = int(os.getenv('CANVA_RATE_LIMIT_PERIOD', 3600))
        self.request_history: List[datetime] = []
        
        # Setup logging
        log_level = os.getenv('LOG_LEVEL', 'INFO')
        logging.basicConfig(
            level=getattr(logging, log_level),
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
        
    def _check_rate_limit(self) -> None:
        """Check if we're within rate limits before making a request."""
        now = datetime.now()
        cutoff = now - timedelta(seconds=self.rate_limit_period)
        
        # Remove old requests from history
        self.request_history = [req_time for req_time in self.request_history if req_time > cutoff]
        
        if len(self.request_history) >= self.rate_limit_requests:
            raise CanvaRateLimitError(
                f"Rate limit exceeded: {len(self.request_history)} requests in last {self.rate_limit_period} seconds"
            )
        
        self.request_history.append(now)
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[Any, Any]:
        """
        Make an authenticated request to the Canva API with error handling.
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint (without base URL)
            **kwargs: Additional arguments for requests
            
        Returns:
            JSON response data
            
        Raises:
            CanvaAPIError: For API errors
            CanvaAuthError: For authentication errors
            CanvaRateLimitError: For rate limit errors
        """
        self._check_rate_limit()
        
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        self.logger.info(f"Making {method} request to {url}")
        
        try:
            response = self.session.request(method, url, **kwargs)
            self.logger.info(f"Response status: {response.status_code}")
            
            # Handle specific error codes
            if response.status_code == 401:
                raise CanvaAuthError("Authentication failed. Check your API token.", response.status_code)
            elif response.status_code == 429:
                raise CanvaRateLimitError("API rate limit exceeded.", response.status_code)
            elif response.status_code >= 400:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                raise CanvaAPIError(
                    f"API error: {response.status_code} - {error_data.get('message', response.text)}",
                    response.status_code,
                    error_data
                )
            
            return response.json() if response.content else {}
            
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Request failed: {str(e)}")
            raise CanvaAPIError(f"Network error: {str(e)}")
    
    def get_user_profile(self) -> Dict[str, Any]:
        """
        Get the current user's profile information.
        
        Returns:
            User profile data
        """
        return self._make_request('GET', '/v1/user/profile')
    
    def list_designs(self, limit: int = 10) -> List[CanvaDesign]:
        """
        List user's designs.
        
        Args:
            limit: Maximum number of designs to return
            
        Returns:
            List of CanvaDesign objects
        """
        response = self._make_request('GET', f'/v1/designs?limit={limit}')
        designs = []
        
        for design_data in response.get('items', []):
            designs.append(CanvaDesign(
                id=design_data['id'],
                title=design_data.get('title', 'Untitled'),
                url=design_data.get('urls', {}).get('view_url', ''),
                thumbnail_url=design_data.get('thumbnail', {}).get('url'),
                created_at=design_data.get('created_at')
            ))
        
        return designs
    
    def create_design(self, design_data: Dict[str, Any]) -> CanvaDesign:
        """
        Create a new design using the Canva API.
        
        Args:
            design_data: Design specification including type, elements, etc.
            
        Returns:
            CanvaDesign object for the created design
        """
        self.logger.info(f"Creating design with data: {json.dumps(design_data, indent=2)}")
        response = self._make_request('POST', '/v1/designs', json=design_data)
        
        return CanvaDesign(
            id=response['design']['id'],
            title=response['design'].get('title', 'New Design'),
            url=response['design'].get('urls', {}).get('view_url', ''),
            thumbnail_url=response['design'].get('thumbnail', {}).get('url')
        )
    
    def export_design(self, design_id: str, format_type: str = 'pdf', pages: Optional[List[int]] = None) -> CanvaExport:
        """
        Export a design to the specified format using Canva Connect API.
        
        Args:
            design_id: ID of the design to export
            format_type: Export format ('pdf', 'png', 'jpg')
            pages: Optional list of page numbers to export (1-indexed)
            
        Returns:
            CanvaExport object with job details
        """
        export_data = {
            'design_id': design_id,
            'format': {
                'type': format_type
            }
        }
        
        # Add pages if specified
        if pages:
            export_data['format']['pages'] = pages
        
        self.logger.info(f"Exporting design {design_id} as {format_type}")
        response = self._make_request('POST', '/v1/exports', json=export_data)
        
        return CanvaExport(
            job_id=response['job']['id'],
            status=response['job']['status'],
            url=response['job'].get('url')
        )
    
    def get_export_status(self, job_id: str) -> CanvaExport:
        """
        Get the status of an export job.
        
        Args:
            job_id: Export job ID (exportId from create export response)
            
        Returns:
            CanvaExport object with current status and download URLs
        """
        response = self._make_request('GET', f'/v1/exports/{job_id}')
        
        # Get first download URL if available
        download_urls = response['job'].get('urls', [])
        first_url = download_urls[0] if download_urls else None
        
        return CanvaExport(
            job_id=job_id,
            status=response['job']['status'],
            url=first_url,
            download_url=first_url
        )
    
    def wait_for_export(self, job_id: str, timeout: int = 60, poll_interval: int = 2) -> CanvaExport:
        """
        Wait for an export job to complete.
        
        Args:
            job_id: Export job ID
            timeout: Maximum time to wait in seconds
            poll_interval: Time between status checks in seconds
            
        Returns:
            Completed CanvaExport object
            
        Raises:
            CanvaAPIError: If export fails or times out
        """
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            export = self.get_export_status(job_id)
            
            if export.status == 'success':
                self.logger.info(f"Export {job_id} completed successfully")
                return export
            elif export.status == 'failed':
                raise CanvaAPIError(f"Export {job_id} failed")
            
            self.logger.info(f"Export {job_id} status: {export.status}, waiting {poll_interval}s...")
            time.sleep(poll_interval)
        
        raise CanvaAPIError(f"Export {job_id} timed out after {timeout} seconds")
    
    def download_file(self, download_url: str, file_path: str) -> str:
        """
        Download a file from Canva's CDN.
        
        Args:
            download_url: URL to download from
            file_path: Local path to save the file
            
        Returns:
            Path to the downloaded file
        """
        self.logger.info(f"Downloading file to {file_path}")
        
        response = requests.get(download_url, stream=True)
        response.raise_for_status()
        
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        self.logger.info(f"File downloaded successfully: {file_path}")
        return file_path
    
    def upload_asset(
        self,
        file_data: bytes,
        file_name: str,
        asset_type: str = "image"
    ) -> Dict[str, Any]:
        """
        Upload file to Canva as reusable asset using the async job API.
        
        This method creates an asset upload job and returns the job details.
        Use get_asset_upload_job() to check the status and retrieve the asset ID.
        
        Args:
            file_data: Binary file content (PNG, JPEG, etc.)
            file_name: Name for the asset (e.g., "onepager.png")
            asset_type: Type of asset (default: "image")
            
        Returns:
            {
                "job": {
                    "id": "job-uuid",
                    "status": "in_progress" | "success" | "failed",
                    "asset": {  # Only present when status is "success"
                        "id": "asset-uuid",
                        "name": "filename.png",
                        "thumbnail": {...}
                    }
                }
            }
            
        Raises:
            CanvaAPIError: If upload request fails
        """
        self._check_rate_limit()
        
        # Correct endpoint for asset uploads
        endpoint = "/v1/asset-uploads"
        url = f"{self.base_url}{endpoint}"
        
        self.logger.info(f"Uploading asset: {file_name} ({len(file_data)} bytes)")
        
        # Encode filename in Base64 (required for Asset-Upload-Metadata header)
        # Truncate to 50 characters max (Canva requirement)
        truncated_name = file_name[:50] if len(file_name) > 50 else file_name
        name_base64 = base64.b64encode(truncated_name.encode('utf-8')).decode('utf-8')
        
        # Prepare headers according to Canva API docs
        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/octet-stream',
            'Asset-Upload-Metadata': json.dumps({"name_base64": name_base64})
        }
        
        try:
            # Send raw binary data (not multipart/form-data)
            response = requests.post(url, headers=headers, data=file_data)
            
            if response.status_code == 401:
                raise CanvaAuthError("Authentication failed. Check your API token.", response.status_code)
            elif response.status_code == 429:
                raise CanvaRateLimitError("API rate limit exceeded (30 requests/min).", response.status_code)
            elif response.status_code >= 400:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                raise CanvaAPIError(
                    f"Asset upload failed: {response.status_code} - {error_data.get('message', response.text)}",
                    response.status_code,
                    error_data
                )
            
            result = response.json()
            job_id = result.get('job', {}).get('id')
            status = result.get('job', {}).get('status')
            self.logger.info(f"✓ Asset upload job created: {job_id} (status: {status})")
            return result
            
        except requests.exceptions.RequestException as e:
            raise CanvaAPIError(f"Network error during asset upload: {e}")
    
    def get_asset_upload_job(self, job_id: str) -> Dict[str, Any]:
        """
        Get the status of an asset upload job.
        
        Args:
            job_id: Asset upload job ID from upload_asset() response
            
        Returns:
            {
                "job": {
                    "id": "job-uuid",
                    "status": "in_progress" | "success" | "failed",
                    "asset": {  # Only present when status is "success"
                        "id": "asset-uuid",
                        "name": "filename.png",
                        "tags": [],
                        "created_at": 1234567890,
                        "thumbnail": {...}
                    },
                    "error": {  # Only present when status is "failed"
                        "code": "file_too_big" | "import_failed" | "fetch_failed",
                        "message": "Error description"
                    }
                }
            }
            
        Raises:
            CanvaAPIError: If request fails
        """
        response = self._make_request('GET', f'/v1/asset-uploads/{job_id}')
        return response
    
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
        # Check if upload completed immediately (small files often do)
        if initial_response:
            job = initial_response.get('job', {})
            if job.get('status') == 'success':
                asset_id = job.get('asset', {}).get('id')
                if asset_id:
                    self.logger.info(f"✓ Asset upload completed immediately: {asset_id}")
                    return asset_id
        
        self.logger.info("Upload not immediate, polling for completion...")
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            result = self.get_asset_upload_job(job_id)
            job = result.get('job', {})
            status = job.get('status')
            
            if status == 'success':
                asset_id = job.get('asset', {}).get('id')
                if not asset_id:
                    raise CanvaAPIError(f"Asset upload job {job_id} succeeded but no asset ID returned")
                self.logger.info(f"✓ Asset upload completed: {asset_id}")
                return asset_id
            
            elif status == 'failed':
                error = job.get('error', {})
                error_code = error.get('code', 'unknown')
                error_msg = error.get('message', 'Upload failed')
                raise CanvaAPIError(f"Asset upload job {job_id} failed: {error_code} - {error_msg}")
            
            self.logger.info(f"Asset upload job {job_id} status: {status}, waiting {poll_interval}s...")
            time.sleep(poll_interval)
        
        raise CanvaAPIError(f"Asset upload job {job_id} timed out after {timeout} seconds")
    
    def create_design_from_asset(
        self,
        asset_id: str,
        title: str,
        design_type: str = "presentation"
    ) -> Dict[str, Any]:
        """
        Create Canva design containing uploaded asset.
        
        This method creates a new design and imports the specified asset
        as the main content. The asset will be centered and sized appropriately
        within the design canvas.
        
        Args:
            asset_id: UUID of uploaded asset (from upload_asset response)
            title: Design title (shown in Canva UI)
            design_type: Type of design (presentation, document, etc.)
            
        Returns:
            {
                "design": {
                    "id": "design-id",
                    "title": "...",
                    "url": "https://canva.com/design/...",
                    "thumbnail": {...},
                    "created_at": 1234567890,
                    "updated_at": 1234567890
                }
            }
            
        Raises:
            CanvaAPIError: If design creation fails
        """
        self.logger.info(f"Creating design from asset {asset_id}")
        
        payload = {
            "design_type": {
                "type": "preset",
                "name": design_type
            },
            "asset_id": asset_id,
            "title": title
        }
        
        result = self._make_request("POST", "/v1/designs", json=payload)
        self.logger.info(f"✓ Design created: {result.get('design', {}).get('id')}")
        return result


def create_client_from_env() -> CanvaClient:
    """
    Create a CanvaClient instance using environment variables.
    
    Returns:
        Configured CanvaClient instance
        
    Raises:
        ValueError: If required environment variables are missing
    """
    api_token = os.getenv('CANVA_API_TOKEN')
    if not api_token:
        raise ValueError("CANVA_API_TOKEN environment variable is required")
    
    base_url = os.getenv('CANVA_API_BASE_URL', 'https://api.canva.com/rest')
    
    return CanvaClient(api_token, base_url)