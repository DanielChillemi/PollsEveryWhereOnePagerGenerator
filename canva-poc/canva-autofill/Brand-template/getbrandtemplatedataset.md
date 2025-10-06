# Get brand template dataset

Check if you can autofill a brand template and what information you can autofill.

<Warning>
  Soon, all brand template IDs will be updated to a new format. If your integration stores brand template IDs, you'll need to migrate to use the new IDs. After we implement this change, you'll have 6 months to migrate before the old IDs are removed.
</Warning>

<Note>
  To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
</Note>

Gets the dataset definition of a brand template. If the brand
template contains autofill data fields, this API returns an object with the data field
names and the type of data they accept.

Available data field types include:

* Images
* Text
* Charts

You can autofill a brand template using the [Create a design autofill job
API](https://www.canva.dev/docs/connect/api-reference/autofills/create-design-autofill-job/).

WARNING: Chart data fields are a [preview feature](https://www.canva.dev/docs/connect/#preview-apis). There might be unannounced breaking changes to this feature which won't produce a new API version.

## HTTP method and URL path

GET https\://api.canva.com/rest/v1/brand-templates/\{brandTemplateId}/dataset

This operation is rate limited to 100 requests per minute for each user of your integration.

## Authentication and authorization

This endpoint requires a valid access token that acts on behalf of a user.

### Scopes

The access token must have all the following [scopes](/docs/connect/appendix/scopes) (permissions):

* `brandtemplate:content:read`

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

Examples for using the `/v1/brand-templates/{brandTemplateId}/dataset` endpoint:

<Tabs storageKey="example.language" disableContentTransition>
  <Tab name="cURL">
    ```sh
    curl --request GET 'https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}/dataset' \
    --header 'Authorization: Bearer {token}'
    ```
  </Tab>

  <Tab name="Node.js">
    ```js
    const fetch = require("node-fetch");

    fetch("https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}/dataset", {
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
                .uri(URI.create("https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}/dataset"))
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

    response = requests.get("https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}/dataset",
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
      RequestUri = new Uri("https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}/dataset"),
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
    	url := "https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}/dataset"
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
      CURLOPT_URL => "https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}/dataset",
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

    url = URI('https://api.canva.com/rest/v1/brand-templates/{brandTemplateId}/dataset')
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
  <Prop name="dataset" type="object" mode="output">
    The dataset definition for the brand template. The dataset definition contains the data inputs available for use with the
    [Create design autofill job API](https://www.canva.dev/docs/connect/api-reference/autofills/create-design-autofill-job/).

    <PillAccordion title={<>Properties of <strong>dataset</strong></>} defaultExpanded={true}>
      <Prop.List>
        <Prop name="<KEY>" type="object of DataFields" mode="output" required>
          A named data field that can be autofilled in the brand template.

          ```json
          {
            "cute_pet_image_of_the_day": {
              "type": "image"
            },
            "cute_pet_witty_pet_says": {
              "type": "text"
            },
            "cute_pet_sales_chart": {
              "type": "chart"
            }
          }
          ```

          <Tabs>
            <Tab name="image">
              An image for a brand template. You can autofill the brand template with an image by providing its `asset_id`.

              <Prop.List>
                <Prop name="type" type="string" required mode="output">
                  <Prop.Extras>
                    **Available values:** The only valid value is `image`.
                  </Prop.Extras>
                </Prop>
              </Prop.List>
            </Tab>

            <Tab name="text">
              Some text for a brand template. You can autofill the brand template with this value.

              <Prop.List>
                <Prop name="type" type="string" required mode="output">
                  <Prop.Extras>
                    **Available values:** The only valid value is `text`.
                  </Prop.Extras>
                </Prop>
              </Prop.List>
            </Tab>

            <Tab name="chart">
              Chart data for a brand template. You can autofill the brand template with tabular data.

              WARNING: Chart data fields are a [preview feature](https://www.canva.dev/docs/connect/#preview-apis). There might be unannounced breaking changes to this feature which won't produce a new API version.

              <Prop.List>
                <Prop name="type" type="string" required mode="output">
                  <Prop.Extras>
                    **Available values:** The only valid value is `chart`.
                  </Prop.Extras>
                </Prop>
              </Prop.List>
            </Tab>
          </Tabs>
        </Prop>
      </Prop.List>
    </PillAccordion>
  </Prop>
</Prop.List>

### Example response

```json
{
  "dataset": {
    "cute_pet_image_of_the_day": {
      "type": "image"
    },
    "cute_pet_witty_pet_says": {
      "type": "text"
    },
    "cute_pet_sales_chart": {
      "type": "chart"
    }
  }
}
```
