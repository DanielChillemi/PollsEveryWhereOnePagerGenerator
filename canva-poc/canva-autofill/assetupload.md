# Create asset upload job

Create an asynchronous job to upload an asset.

Starts a new [asynchronous job](https://www.canva.dev/docs/connect/api-requests-responses/#asynchronous-job-endpoints) to upload an asset to the user's content library. Supported file types for assets are listed in the [Assets API overview](https://www.canva.dev/docs/connect/api-reference/assets/).

The request format for this endpoint is an `application/octet-stream` body of bytes. Attach
information about the upload using an `Asset-Upload-Metadata` header.

<Note>
  For more information on the workflow for using asynchronous jobs, see [API requests and responses](https://www.canva.dev/docs/connect/api-requests-responses/#asynchronous-job-endpoints). You can check the status and get the results of asset upload jobs created with this API using the [Get asset upload job API](https://www.canva.dev/docs/connect/api-reference/assets/get-asset-upload-job/).
</Note>

## HTTP method and URL path

POST https\://api.canva.com/rest/v1/asset-uploads

This operation is rate limited to 30 requests per minute for each user of your integration.

## Authentication and authorization

This endpoint requires a valid access token that acts on behalf of a user.

### Scopes

The access token must have all the following [scopes](/docs/connect/appendix/scopes) (permissions):

* `asset:write`

## Header parameters

<Prop.List>
  <Prop name="Authorization" type="string" required>
    Provides credentials to authenticate the request, in the form of a `Bearer` token.

    For example: `Authorization: Bearer {token}`
  </Prop>

  <Prop name="Content-Type" type="string" required>
    Indicates the media type of the information sent in the request. This must be set to `application/octet-stream`.

    For example: `Content-Type: application/octet-stream`
  </Prop>

  <Prop name="Asset-Upload-Metadata" type="AssetUploadMetadata" required>
    Metadata for the asset being uploaded.

    <PillAccordion title={<>Properties of <strong>Asset-Upload-Metadata</strong></>}>
      <Prop.List>
        <Prop name="name_base64" type="string" required>
          The asset's name, encoded in Base64.

          The maximum length of an asset name in Canva (unencoded) is 50 characters.

          Base64 encoding allows names containing emojis and other special
          characters to be sent using HTTP headers.
          For example, "My Awesome Upload 🚀" Base64 encoded
          is `TXkgQXdlc29tZSBVcGxvYWQg8J+agA==`.

          <Prop.Extras>
            **Minimum length:** `1`
          </Prop.Extras>
        </Prop>
      </Prop.List>
    </PillAccordion>
  </Prop>
</Prop.List>

## Body parameters

Binary of the asset to upload.

## Example request

Examples for using the `/v1/asset-uploads` endpoint:

<Tabs storageKey="example.language" disableContentTransition>
  <Tab name="cURL">
    ```sh
    curl --request POST 'https://api.canva.com/rest/v1/asset-uploads' \
    --header 'Authorization: Bearer {token}' \
    --header 'Content-Type: application/octet-stream' \
    --header 'Asset-Upload-Metadata: { "name_base64": "TXkgQXdlc29tZSBVcGxvYWQg8J+agA==" }' \
    --data-binary '@/path/to/file'
    ```
  </Tab>

  <Tab name="Node.js">
    ```js
    const fetch = require("node-fetch");
    const fs = require("fs");

    fetch("https://api.canva.com/rest/v1/asset-uploads", {
      method: "POST",
      headers: {
        "Asset-Upload-Metadata": JSON.stringify({ "name_base64": "TXkgQXdlc29tZSBVcGxvYWQg8J+agA==" }),
        "Authorization": "Bearer {token}",
        "Content-Length": fs.statSync("/path/to/file").size,
        "Content-Type": "application/octet-stream",
      },
      body: fs.createReadStream("/path/to/file"),
    })
      .then(async (response) => {
        const data = await response.json();
        console.log(data);
      })
      .catch(err => console.error(err));
    ```
  </Tab>

  <Tab name="Java">
    ```java
    import java.io.IOException;
    import java.net.URI;
    import java.net.http.*;
    import java.nio.file.Paths;

    public class ApiExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.canva.com/rest/v1/asset-uploads"))
                .header("Authorization", "Bearer {token}")
                .header("Content-Type", "application/octet-stream")
                .header("Asset-Upload-Metadata", "{ \"name_base64\": \"TXkgQXdlc29tZSBVcGxvYWQg8J+agA==\" }")
                .method("POST", HttpRequest.BodyPublishers.ofFile(Paths.get("/path/to/file")))
                .build();

            HttpResponse<String> response = HttpClient.newHttpClient().send(
                request,
                HttpResponse.BodyHandlers.ofString()
            );
            System.out.println(response.body());
        }
    }
    ```
  </Tab>

  <Tab name="Python">
    ```py
    import requests
    import json

    headers = {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/octet-stream",
        "Asset-Upload-Metadata": json.dumps({ "name_base64": "TXkgQXdlc29tZSBVcGxvYWQg8J+agA==" })
    }

    with open("/path/to/file", "rb") as file:
        response = requests.post("https://api.canva.com/rest/v1/asset-uploads",
            headers=headers,
            data=file
        )
        print(response.json())
    ```
  </Tab>

  <Tab name="C#">
    ```csharp
    using System.Net.Http;
    using System.Net.Http.Headers;

    var client = new HttpClient();
    var request = new HttpRequestMessage
    {
      Method = HttpMethod.Post,
      RequestUri = new Uri("https://api.canva.com/rest/v1/asset-uploads"),
      Headers =
      {
        { "Authorization", "Bearer {token}" },
        { "Asset-Upload-Metadata", "{ \"name_base64\": \"TXkgQXdlc29tZSBVcGxvYWQg8J+agA==\" }" },
      },
      Content = new StreamContent(File.OpenRead("/path/to/file"))
      {
        Headers =
        {
          ContentType = new MediaTypeHeaderValue("application/octet-stream"),
        }
      },
    };

    using (var response = await client.SendAsync(request))
    {
      response.EnsureSuccessStatusCode();
      var body = await response.Content.ReadAsStringAsync();
      Console.WriteLine(body);
    };
    ```
  </Tab>

  <Tab name="Go">
    ```go
    package main

    import (
    	"fmt"
    	"io"
    	"net/http"
    	"os"
    )

    func main() {
    	payload, _ := os.Open("/path/to/file")
    	defer payload.Close()

    	url := "https://api.canva.com/rest/v1/asset-uploads"
    	req, _ := http.NewRequest("POST", url, payload)
    	req.Header.Add("Authorization", "Bearer {token}")
    	req.Header.Add("Content-Type", "application/octet-stream")
    	req.Header.Add("Asset-Upload-Metadata", "{ \"name_base64\": \"TXkgQXdlc29tZSBVcGxvYWQg8J+agA==\" }")

    	res, _ := http.DefaultClient.Do(req)
    	defer res.Body.Close()
    	body, _ := io.ReadAll(res.Body)
    	fmt.Println(string(body))
    }
    ```
  </Tab>

  <Tab name="PHP">
    ```php
    $curl = curl_init();
    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://api.canva.com/rest/v1/asset-uploads",
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer {token}',
        'Content-Type: application/octet-stream',
        'Asset-Upload-Metadata: { "name_base64": "TXkgQXdlc29tZSBVcGxvYWQg8J+agA==" }',
      ),
      CURLOPT_POSTFIELDS => file_get_contents("/path/to/file")
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if (empty($err)) {
      echo $response;
    } else {
      echo "Error: " . $err;
    }
    ```
  </Tab>

  <Tab name="Ruby">
    ```ruby
    require 'net/http'
    require 'uri'

    url = URI('https://api.canva.com/rest/v1/asset-uploads')
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request['Authorization'] = 'Bearer {token}'
    request['Content-Type'] = 'application/octet-stream'
    request['Asset-Upload-Metadata'] = '{ "name_base64": "TXkgQXdlc29tZSBVcGxvYWQg8J+agA==" }'
    request.body = File.read('/path/to/file')

    response = http.request(request)
    puts response.read_body
    ```
  </Tab>
</Tabs>

## Success response

If successful, the endpoint returns a `200` response with a JSON body with the following parameters:

<Prop.List>
  <Prop name="job" type="AssetUploadJob" required mode="output">
    The status of the asset upload job.

    <PillAccordion title={<>Properties of <strong>job</strong></>} defaultExpanded={true}>
      <Prop.List>
        <Prop name="id" type="string" required mode="output">
          The ID of the asset upload job.
        </Prop>

        <Prop name="status" type="string" required mode="output">
          Status of the asset upload job.

          <Prop.Extras>
            **Available values:**

            * `failed`
            * `in_progress`
            * `success`
          </Prop.Extras>
        </Prop>

        <Prop name="error" type="AssetUploadError" mode="output">
          If the upload fails, this object provides details about the error.

          <PillAccordion title={<>Properties of <strong>error</strong></>}>
            <Prop.List>
              <Prop name="code" type="string" required mode="output">
                A short string indicating why the upload failed. This field can be used to handle errors
                programmatically.

                <Prop.Extras>
                  **Available values:**

                  * `file_too_big`
                  * `import_failed`
                  * `fetch_failed`
                </Prop.Extras>
              </Prop>

              <Prop name="message" type="string" required mode="output">
                A human-readable description of what went wrong.
              </Prop>
            </Prop.List>
          </PillAccordion>
        </Prop>

        <Prop name="asset" type="Asset" mode="output">
          The asset object, which contains metadata about the asset.

          <PillAccordion title={<>Properties of <strong>asset</strong></>}>
            <Prop.List>
              <Prop name="type" type="string" required mode="output">
                Type of an asset.

                <Prop.Extras>
                  **Available values:**

                  * `image`
                  * `video`
                </Prop.Extras>
              </Prop>

              <Prop name="id" type="string" required mode="output">
                The ID of the asset.
              </Prop>

              <Prop name="name" type="string" required mode="output">
                The name of the asset.
              </Prop>

              <Prop name="tags" type="string[]" required mode="output">
                The user-facing tags attached to the asset.
                Users can add these tags to their uploaded assets, and they can search their uploaded
                assets in the Canva UI by searching for these tags. For information on how users use
                tags, see the
                [Canva Help Center page on asset tags](https://www.canva.com/help/add-edit-tags/).
              </Prop>

              <Prop name="created_at" type="integer" required mode="output">
                When the asset was added to Canva, as a Unix timestamp (in seconds since the Unix
                Epoch).
              </Prop>

              <Prop name="updated_at" type="integer" required mode="output">
                When the asset was last updated in Canva, as a Unix timestamp (in seconds since the
                Unix Epoch).
              </Prop>

              <Prop name="owner" type="TeamUserSummary" required mode="output">
                Metadata for the user, consisting of the User ID and Team ID.

                <PillAccordion title={<>Properties of <strong>owner</strong></>}>
                  <Prop.List>
                    <Prop name="user_id" type="string" required mode="output">
                      The ID of the user.
                    </Prop>

                    <Prop name="team_id" type="string" required mode="output">
                      The ID of the user's Canva Team.
                    </Prop>
                  </Prop.List>
                </PillAccordion>
              </Prop>

              <Prop name="thumbnail" type="Thumbnail" mode="output">
                A thumbnail image representing the object.

                <PillAccordion title={<>Properties of <strong>thumbnail</strong></>}>
                  <Prop.List>
                    <Prop name="width" type="integer" required mode="output">
                      The width of the thumbnail image in pixels.
                    </Prop>

                    <Prop name="height" type="integer" required mode="output">
                      The height of the thumbnail image in pixels.
                    </Prop>

                    <Prop name="url" type="string" required mode="output">
                      A URL for retrieving the thumbnail image.
                      This URL expires after 15 minutes. This URL includes a query string
                      that's required for retrieving the thumbnail.
                    </Prop>
                  </Prop.List>
                </PillAccordion>
              </Prop>

              <Prop name="import_status" type="ImportStatus" deprecated mode="output">
                The import status of the asset.

                <PillAccordion title={<>Properties of <strong>import_status</strong></>}>
                  <Prop.List>
                    <Prop name="state" type="string" required mode="output">
                      State of the import job for an uploaded asset.

                      <Prop.Extras>
                        **Available values:**

                        * `failed`
                        * `in_progress`
                        * `success`
                      </Prop.Extras>
                    </Prop>

                    <Prop name="error" type="ImportError" deprecated mode="output">
                      If the import fails, this object provides details about the error.

                      <PillAccordion title={<>Properties of <strong>error</strong></>}>
                        <Prop.List>
                          <Prop name="message" type="string" required mode="output">
                            A human-readable description of what went wrong.
                          </Prop>

                          <Prop name="code" type="string" required mode="output">
                            A short string indicating why the upload failed. This field can be used to handle errors programmatically.

                            <Prop.Extras>
                              **Available values:**

                              * `file_too_big`
                              * `import_failed`
                            </Prop.Extras>
                          </Prop>
                        </Prop.List>
                      </PillAccordion>
                    </Prop>
                  </Prop.List>
                </PillAccordion>
              </Prop>
            </Prop.List>
          </PillAccordion>
        </Prop>
      </Prop.List>
    </PillAccordion>
  </Prop>
</Prop.List>

### Example responses

#### In progress job

```json
{
  "job": {
    "id": "e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8",
    "status": "in_progress"
  }
}
```

#### Successfully completed job

```json
{
  "job": {
    "id": "e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8",
    "status": "success",
    "asset": {
      "id": "Msd59349ff",
      "name": "My Awesome Upload",
      "tags": [
        "image",
        "holiday",
        "best day ever"
      ],
      "created_at": 1377396000,
      "updated_at": 1692928800,
      "thumbnail": {
        "width": 595,
        "height": 335,
        "url": "https://document-export.canva.com/Vczz9/zF9vzVtdADc/2/thumbnail/0001.png?<query-string>"
      }
    }
  }
}
```

#### Failed job

```json
{
  "job": {
    "id": "e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8",
    "status": "failed",
    "error": {
      "code": "file_too_big",
      "message": "Failed to import because the file is too big"
    }
  }
}
```
