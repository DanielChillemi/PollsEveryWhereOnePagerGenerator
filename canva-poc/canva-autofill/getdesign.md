# Get design autofill job

Get the status and results of an autofill job, including the autofilled design.

<Note>
  To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
</Note>

Get the result of a design autofill job that was created using the [Create design autofill job
API](https://www.canva.dev/docs/connect/api-reference/autofills/create-design-autofill-job/).

You might need to make multiple requests to this endpoint until you get a `success` or `failed` status. For more information on the workflow for using asynchronous jobs, see [API requests and responses](https://www.canva.dev/docs/connect/api-requests-responses/#asynchronous-job-endpoints).

## HTTP method and URL path

GET https\://api.canva.com/rest/v1/autofills/\{jobId}

This operation is rate limited to 60 requests per minute for each user of your integration.

## Authentication and authorization

This endpoint requires a valid access token that acts on behalf of a user.

### Scopes

The access token must have all the following [scopes](/docs/connect/appendix/scopes) (permissions):

* `design:meta:read`

## Header parameters

<Prop.List>
  <Prop name="Authorization" type="string" required>
    Provides credentials to authenticate the request, in the form of a `Bearer` token.

    For example: `Authorization: Bearer {token}`
  </Prop>
</Prop.List>

## Path parameters

<Prop.List>
  <Prop name="jobId" type="string" required>
    The design autofill job ID.
  </Prop>
</Prop.List>

## Example request

Examples for using the `/v1/autofills/{jobId}` endpoint:

<Tabs storageKey="example.language" disableContentTransition>
  <Tab name="cURL">
    ```sh
    curl --request GET 'https://api.canva.com/rest/v1/autofills/{jobId}' \
    --header 'Authorization: Bearer {token}'
    ```
  </Tab>

  <Tab name="Node.js">
    ```js
    const fetch = require("node-fetch");

    fetch("https://api.canva.com/rest/v1/autofills/{jobId}", {
      method: "GET",
      headers: {
        "Authorization": "Bearer {token}",
      },
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

    public class ApiExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.canva.com/rest/v1/autofills/{jobId}"))
                .header("Authorization", "Bearer {token}")
                .method("GET", HttpRequest.BodyPublishers.noBody())
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

    headers = {
        "Authorization": "Bearer {token}"
    }

    response = requests.get("https://api.canva.com/rest/v1/autofills/{jobId}",
        headers=headers
    )
    print(response.json())
    ```
  </Tab>

  <Tab name="C#">
    ```csharp
    using System.Net.Http;

    var client = new HttpClient();
    var request = new HttpRequestMessage
    {
      Method = HttpMethod.Get,
      RequestUri = new Uri("https://api.canva.com/rest/v1/autofills/{jobId}"),
      Headers =
      {
        { "Authorization", "Bearer {token}" },
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
    )

    func main() {
    	url := "https://api.canva.com/rest/v1/autofills/{jobId}"
    	req, _ := http.NewRequest("GET", url, nil)
    	req.Header.Add("Authorization", "Bearer {token}")

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
      CURLOPT_URL => "https://api.canva.com/rest/v1/autofills/{jobId}",
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer {token}',
      ),
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

    url = URI('https://api.canva.com/rest/v1/autofills/{jobId}')
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request['Authorization'] = 'Bearer {token}'

    response = http.request(request)
    puts response.read_body
    ```
  </Tab>
</Tabs>

## Success response

If successful, the endpoint returns a `200` response with a JSON body with the following parameters:

<Prop.List>
  <Prop name="job" type="DesignAutofillJob" required mode="output">
    Details about the autofill job.

    <PillAccordion title={<>Properties of <strong>job</strong></>} defaultExpanded={true}>
      <Prop.List>
        <Prop name="id" type="string" required mode="output">
          ID of the asynchronous job that is creating the design using the provided data.
        </Prop>

        <Prop name="status" type="string" required mode="output">
          Status of the design autofill job.

          <Prop.Extras>
            **Available values:**

            * `in_progress`
            * `success`
            * `failed`
          </Prop.Extras>
        </Prop>

        <Prop name="result" type="DesignAutofillJobResult" mode="output">
          Result of the design autofill job. Only present if job status is `success`.

          <Tabs>
            <Tab name="create_design">
              Design has been created and saved to user's root folder.

              <Prop.List>
                <Prop name="type" type="string" required mode="output">
                  <Prop.Extras>
                    **Available values:** The only valid value is `create_design`.
                  </Prop.Extras>
                </Prop>

                <Prop name="design" type="DesignSummary" required mode="output">
                  Basic details about the design, such as the design's ID, title, and URL.

                  <PillAccordion title={<>Properties of <strong>design</strong></>}>
                    <Prop.List>
                      <Prop name="id" type="string" required mode="output">
                        The design ID.
                      </Prop>

                      <Prop name="urls" type="DesignLinks" required mode="output">
                        A temporary set of URLs for viewing or editing the design.

                        <PillAccordion title={<>Properties of <strong>urls</strong></>}>
                          <Prop.List>
                            <Prop name="edit_url" type="string" required mode="output">
                              A temporary editing URL for the design. This URL is only accessible to the user that made the API request, and is designed to support [return navigation](https://www.canva.dev/docs/connect/return-navigation-guide/) workflows.

                              NOTE: This is not a permanent URL, it is only valid for 30 days.
                            </Prop>

                            <Prop name="view_url" type="string" required mode="output">
                              A temporary viewing URL for the design. This URL is only accessible to the user that made the API request, and is designed to support [return navigation](https://www.canva.dev/docs/connect/return-navigation-guide/) workflows.

                              NOTE: This is not a permanent URL, it is only valid for 30 days.
                            </Prop>
                          </Prop.List>
                        </PillAccordion>
                      </Prop>

                      <Prop name="created_at" type="integer" required mode="output">
                        When the design was created in Canva, as a Unix timestamp (in seconds since the Unix
                        Epoch).
                      </Prop>

                      <Prop name="updated_at" type="integer" required mode="output">
                        When the design was last updated in Canva, as a Unix timestamp (in seconds since the
                        Unix Epoch).
                      </Prop>

                      <Prop name="title" type="string" mode="output">
                        The design title.
                      </Prop>

                      <Prop name="url" type="string" mode="output">
                        URL of the design.
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

                      <Prop name="page_count" type="integer" mode="output">
                        The total number of pages in the design. Some design types don't have pages (for example, Canva docs).
                      </Prop>
                    </Prop.List>
                  </PillAccordion>
                </Prop>
              </Prop.List>
            </Tab>
          </Tabs>
        </Prop>

        <Prop name="error" type="AutofillError" mode="output">
          If the autofill job fails, this object provides details about the error.

          <PillAccordion title={<>Properties of <strong>error</strong></>}>
            <Prop.List>
              <Prop name="code" type="string" required mode="output">
                <Prop.Extras>
                  **Available values:**

                  * `autofill_error`
                  * `thumbnail_generation_error`
                  * `create_design_error`
                </Prop.Extras>
              </Prop>

              <Prop name="message" type="string" required mode="output">
                A human-readable description of what went wrong.
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
    "id": "450a76e7-f96f-43ae-9c37-0e1ce492ac72",
    "status": "in_progress"
  }
}
```

#### Successfully completed job

```json
{
  "job": {
    "id": "450a76e7-f96f-43ae-9c37-0e1ce492ac72",
    "status": "success",
    "result": {
      "type": "create_design",
      "design": {
        "id": "DAFVztcvd9z",
        "title": "My summer holiday",
        "url": "https://www.canva.com/design/DAFVztcvd9z/edit",
        "thumbnail": {
          "width": 595,
          "height": 335,
          "url": "https://document-export.canva.com/Vczz9/zF9vzVtdADc/2/thumbnail/0001.png?<query-string>"
        }
      }
    }
  }
}
```

#### Failed job

```json
{
  "job": {
    "id": "450a76e7-f96f-43ae-9c37-0e1ce492ac72",
    "status": "failed",
    "error": {
      "code": "autofill_error",
      "message": "Error autofilling design from brand template"
    }
  }
}
```

## Error responses

### 403 Forbidden

<Prop.List>
  <Prop name="code" type="string" required mode="output">
    A short string indicating what failed. This field can be used to handle errors programmatically. For a complete list of error codes, see [Error responses](/docs/connect/error-responses/).
  </Prop>

  <Prop name="message" type="string" required mode="output">
    A human-readable description of what went wrong.
  </Prop>
</Prop.List>

#### Example error response

```json
{
  "code": "permission_denied",
  "message": "Calling user was not the creator of the autofill job"
}
```

### 404 Not Found

<Prop.List>
  <Prop name="code" type="string" required mode="output">
    A short string indicating what failed. This field can be used to handle errors programmatically. For a complete list of error codes, see [Error responses](/docs/connect/error-responses/).
  </Prop>

  <Prop name="message" type="string" required mode="output">
    A human-readable description of what went wrong.
  </Prop>
</Prop.List>

#### Example error response

```json
{
  "code": "not_found",
  "message": "Job {jobId} not found"
}
```
