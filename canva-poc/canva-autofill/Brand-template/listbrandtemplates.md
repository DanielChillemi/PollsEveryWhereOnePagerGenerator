# List brand templates

List all the user's brand templates.

<Warning>
  Soon, all brand template IDs will be updated to a new format. If your integration stores brand template IDs, you'll need to migrate to use the new IDs. After we implement this change, you'll have 6 months to migrate before the old IDs are removed.
</Warning>

<Note>
  To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
</Note>

Get a list of the [brand templates](https://www.canva.com/help/publish-team-template/) the user has access to.

## HTTP method and URL path

GET https\://api.canva.com/rest/v1/brand-templates

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

## Query parameters

<Prop.List>
  <Prop name="query" type="string">
    Lets you search the brand templates available to the user using a search term or terms.
  </Prop>

  <Prop name="continuation" type="string">
    If the success response contains a continuation token, the user has access to more
    brand templates you can list. You can use this token as a query parameter and retrieve
    more templates from the list, for example
    `/v1/brand-templates?continuation={continuation}`.
    To retrieve all the brand templates available to the user, you might need to make
    multiple requests.
  </Prop>

  <Prop name="ownership" type="string">
    Filter the list of brand templates based on the user's ownership of the brand templates.

    <Prop.Extras>
      **Default value:** `any`

      **Available values:**

      * `any`: Owned by and shared with the user.
      * `owned`: Owned by the user.
      * `shared`: Shared with the user.
    </Prop.Extras>
  </Prop>

  <Prop name="sort_by" type="string">
    Sort the list of brand templates.

    <Prop.Extras>
      **Default value:** `relevance`

      **Available values:**

      * `relevance`: Sort results using a relevance algorithm.
      * `modified_descending`: Sort results by the date last modified in descending order.
      * `modified_ascending`: Sort results by the date last modified in ascending order.
      * `title_descending`: Sort results by title in descending order.
      * `title_ascending`: Sort results by title in ascending order
    </Prop.Extras>
  </Prop>

  <Prop name="dataset" type="string">
    Filter the list of brand templates based on the brand templates' dataset definitions.
    Brand templates with dataset definitions are mainly used with the [Autofill APIs](https://www.canva.dev/docs/connect/api-reference/autofills/).

    <Prop.Extras>
      **Default value:** `any`

      **Available values:**

      * `any`: Brand templates with and without dataset definitions.
      * `non_empty`: Brand templates with one or more data fields defined.
    </Prop.Extras>
  </Prop>
</Prop.List>

## Example request

Examples for using the `/v1/brand-templates` endpoint:

<Tabs storageKey="example.language" disableContentTransition>
  <Tab name="cURL">
    ```sh
    curl --request GET 'https://api.canva.com/rest/v1/brand-templates' \
    --header 'Authorization: Bearer {token}'
    ```
  </Tab>

  <Tab name="Node.js">
    ```js
    const fetch = require("node-fetch");

    fetch("https://api.canva.com/rest/v1/brand-templates", {
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
                .uri(URI.create("https://api.canva.com/rest/v1/brand-templates"))
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

    response = requests.get("https://api.canva.com/rest/v1/brand-templates",
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
      RequestUri = new Uri("https://api.canva.com/rest/v1/brand-templates"),
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
    	url := "https://api.canva.com/rest/v1/brand-templates"
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
      CURLOPT_URL => "https://api.canva.com/rest/v1/brand-templates",
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

    url = URI('https://api.canva.com/rest/v1/brand-templates')
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
  <Prop name="items" type="BrandTemplate[]" required mode="output">
    The list of brand templates.

    <PillAccordion title={<>Properties of <strong>items</strong></>} defaultExpanded={true}>
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

  <Prop name="continuation" type="string" mode="output">
    If the success response contains a continuation token, the user has access to more
    brand templates you can list. You can use this token as a query parameter and retrieve
    more templates from the list, for example
    `/v1/brand-templates?continuation={continuation}`.
    To retrieve all the brand templates available to the user, you might need to make
    multiple requests.
  </Prop>
</Prop.List>

### Example response

```json
{
  "continuation": "RkFGMgXlsVTDbMd:MR3L0QjiaUzycIAjx0yMyuNiV0OildoiOwL0x32G4NjNu4FwtAQNxowUQNMMYN",
  "items": [
    {
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
  ]
}
```