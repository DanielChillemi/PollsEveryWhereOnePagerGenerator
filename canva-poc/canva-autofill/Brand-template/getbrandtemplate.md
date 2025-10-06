# Get brand template

Get the metadata for one of the user's brand templates.

<Warning>
  Soon, all brand template IDs will be updated to a new format. If your integration stores brand template IDs, you'll need to migrate to use the new IDs. After we implement this change, you'll have 6 months to migrate before the old IDs are removed.
</Warning>

<Note>
  To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
</Note>

Retrieves the metadata for a brand template.

## HTTP method and URL path

GET https\://api.canva.com/rest/v1/brand-templates/\{brandTemplateId}

This operation is rate limited to 100 requests per minute for each user of your integration.

## Authentication and authorization

This endpoint requires a valid access token that acts on behalf of a user.

### Scopes

The access token must have all the following [scopes](/docs/connect/appendix/scopes) (permissions):

* `brandtemplate:meta:read`

## Header parameters

<Prop.List>
  <Prop name="Authorization" type="string" required>
    Provides credentials to authenticate the request, in the form of a `Bearer` token.

    For example: `Authorization: Bearer {token}`
  </Prop>
</Prop.List>

## Path parameters

<Prop.List>
  <Prop name="brandTemplateId" type="string" required>
    The brand template ID.
  </Prop>
</Prop.List>

## Example request

Examples for using the `/v1/brand-templates/{brandTemplateId}` endpoint:

<Tabs storageKey="example.language" disableContentTransition>
  <Tab name="cURL">
    ```sh
    curl --request GET 'https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}' \
    --header 'Authorization: Bearer {token}'
    ```
  </Tab>

  <Tab name="Node.js">
    ```js
    const fetch = require("node-fetch");

    fetch("https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}", {
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
                .uri(URI.create("https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}"))
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

    response = requests.get("https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}",
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
      RequestUri = new Uri("https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}"),
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
    	url := "https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}"
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
      CURLOPT_URL => "https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}",
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

    url = URI('https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}')
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
  <Prop name="brand_template" type="BrandTemplate" required mode="output">
    An object representing a brand template with associated metadata.

    <PillAccordion title={<>Properties of <strong>brand_template</strong></>} defaultExpanded={true}>
      <Prop.List>
        <Prop name="id" type="string" required mode="output">
          The brand template ID.
        </Prop>

        <Prop name="title" type="string" required mode="output">
          The brand template title, as shown in the Canva UI.
        </Prop>

        <Prop name="view_url" type="string" required mode="output">
          A URL Canva users can visit to view the brand template.
        </Prop>

        <Prop name="create_url" type="string" required mode="output">
          A URL Canva users can visit to create a new design from the template.
        </Prop>

        <Prop name="created_at" type="integer" required mode="output">
          When the brand template was created, as a Unix timestamp
          (in seconds since the Unix Epoch).
        </Prop>

        <Prop name="updated_at" type="integer" required mode="output">
          When the brand template was last updated, as a Unix timestamp
          (in seconds since the Unix Epoch).
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
      </Prop.List>
    </PillAccordion>
  </Prop>
</Prop.List>

### Example response

```json
{
  "brand_template": {
    "id": "DEMzWSwy3BI",
    "title": "Advertisement Template",
    "view_url": "https://www.canva.com/design/DAE35hE8FA4/view",
    "create_url": "https://www.canva.com/design/DAE35hE8FA4/remix",
    "thumbnail": {
      "width": 595,
      "height": 335,
      "url": "https://document-export.canva.com/Vczz9/zF9vzVtdADc/2/thumbnail/0001.png?<query-string>"
    },
    "created_at": 1704110400,
    "updated_at": 1719835200
  }
}
```
