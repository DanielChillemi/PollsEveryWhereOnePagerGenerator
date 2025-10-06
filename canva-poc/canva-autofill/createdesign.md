# Create design autofill job

Create an asynchronous job to autofill a design from a brand template with your input information.

<Warning>
  Soon, all brand template IDs will be updated to a new format. If your integration stores brand template IDs, you'll need to migrate to use the new IDs. After we implement this change, you'll have 6 months to migrate before the old IDs are removed.
</Warning>

<Note>
  To use this API, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
</Note>

Starts a new [asynchronous job](https://www.canva.dev/docs/connect/api-requests-responses/#asynchronous-job-endpoints) to autofill a Canva design using a brand template and input data.

To get a list of input data fields, use the [Get brand template dataset
API](https://www.canva.dev/docs/connect/api-reference/brand-templates/get-brand-template-dataset/).

Available data field types to autofill include:

* Images
* Text
* Charts

  WARNING: Chart data fields are a [preview feature](https://www.canva.dev/docs/connect/#preview-apis). There might be unannounced breaking changes to this feature which won't produce a new API version.

<Note>
  For more information on the workflow for using asynchronous jobs, see [API requests and responses](https://www.canva.dev/docs/connect/api-requests-responses/#asynchronous-job-endpoints). You can check the status and get the results of autofill jobs created with this API using the [Get design autofill job API](https://www.canva.dev/docs/connect/api-reference/autofills/get-design-autofill-job/).
</Note>

## HTTP method and URL path

POST https\://api.canva.com/rest/v1/autofills

This operation is rate limited to 10 requests per minute for each user of your integration.

## Authentication and authorization

This endpoint requires a valid access token that acts on behalf of a user.

### Scopes

The access token must have all the following [scopes](/docs/connect/appendix/scopes) (permissions):

* `design:content:write`

## Header parameters

<Prop.List>
  <Prop name="Authorization" type="string" required>
    Provides credentials to authenticate the request, in the form of a `Bearer` token.

    For example: `Authorization: Bearer {token}`
  </Prop>

  <Prop name="Content-Type" type="string" required>
    Indicates the media type of the information sent in the request. This must be set to `application/json`.

    For example: `Content-Type: application/json`
  </Prop>
</Prop.List>

## Body parameters

<Prop.List>
  <Prop name="brand_template_id" type="string" required>
    ID of the input brand template.
  </Prop>

  <Prop name="data" type="object" required>
    Data object containing the data fields and values to autofill.

    <PillAccordion title={<>Properties of <strong>data</strong></>} defaultExpanded={true}>
      <Prop.List>
        <Prop name="<KEY>" type="object of DatasetValues" required>
          The data field to autofill.

          ```json
          {
            "cute_pet_image_of_the_day": {
              "type": "image",
              "asset_id": "Msd59349ff"
            },
            "cute_pet_witty_pet_says": {
              "type": "text",
              "text": "It was like this when I got here!"
            },
            "cute_pet_sales_chart": {
              "type": "chart",
              "chart_data": {
                "rows": [
                  {
                    "cells": [
                      {
                        "type": "string",
                        "value": "Geographic Region"
                      },
                      {
                        "type": "string",
                        "value": "Sales (millions AUD)"
                      },
                      {
                        "type": "string",
                        "value": "Target met?"
                      },
                      {
                        "type": "string",
                        "value": "Date met"
                      }
                    ]
                  },
                  {
                    "cells": [
                      {
                        "type": "string",
                        "value": "Asia Pacific"
                      },
                      {
                        "type": "number",
                        "value": 10.2
                      },
                      {
                        "type": "boolean",
                        "value": true
                      },
                      {
                        "type": "date",
                        "value": 1721944387
                      }
                    ]
                  },
                  {
                    "cells": [
                      {
                        "type": "string",
                        "value": "EMEA"
                      },
                      {
                        "type": "number",
                        "value": 13.8
                      },
                      {
                        "type": "boolean",
                        "value": false
                      },
                      {
                        "type": "date"
                      }
                    ]
                  }
                ]
              }
            }
          }
          ```

          <Tabs>
            <Tab name="image">
              If the data field is an image field.

              <Prop.List>
                <Prop name="type" type="string" required>
                  <Prop.Extras>
                    **Available values:** The only valid value is `image`.
                  </Prop.Extras>
                </Prop>

                <Prop name="asset_id" type="string" required>
                  `asset_id` of the image to insert into the template element.
                </Prop>
              </Prop.List>
            </Tab>

            <Tab name="text">
              If the data field is a text field.

              <Prop.List>
                <Prop name="type" type="string" required>
                  <Prop.Extras>
                    **Available values:** The only valid value is `text`.
                  </Prop.Extras>
                </Prop>

                <Prop name="text" type="string" required>
                  Text to insert into the template element.
                </Prop>
              </Prop.List>
            </Tab>

            <Tab name="chart">
              If the data field is a chart.

              WARNING: Chart data fields are a [preview feature](https://www.canva.dev/docs/connect/#preview-apis). There might be unannounced breaking changes to this feature which won't produce a new API version.

              <Prop.List>
                <Prop name="type" type="string" required>
                  <Prop.Extras>
                    **Available values:** The only valid value is `chart`.
                  </Prop.Extras>
                </Prop>

                <Prop name="chart_data" type="DataTable" required>
                  Tabular data, structured in rows of cells.

                  * The first row usually contains column headers.
                  * Each cell must have a data type configured.
                  * All rows must have the same number of cells.
                  * Maximum of 100 rows and 20 columns.

                  WARNING: Chart data fields are a [preview feature](https://www.canva.dev/docs/connect/#preview-apis). There might be unannounced breaking changes to this feature which won't produce a new API version.

                  <PillAccordion title={<>Properties of <strong>chart_data</strong></>}>
                    <Prop.List>
                      <Prop name="rows" type="DataTableRow[]" required>
                        Rows of data.

                        The first row usually contains column headers.

                        <Prop.Extras>
                          **Maximum items:** `100`
                        </Prop.Extras>

                        <PillAccordion title={<>Properties of <strong>rows</strong></>}>
                          <Prop.List>
                            <Prop name="cells" type="DataTableCell[]" required>
                              Cells of data in row.

                              All rows must have the same number of cells.

                              <Prop.Extras>
                                **Maximum items:** `20`
                              </Prop.Extras>

                              <Tabs>
                                <Tab name="string">
                                  A string tabular data cell.

                                  <Prop.List>
                                    <Prop name="type" type="string" required>
                                      <Prop.Extras>
                                        **Available values:** The only valid value is `string`.
                                      </Prop.Extras>
                                    </Prop>
                                  </Prop.List>
                                </Tab>

                                <Tab name="number">
                                  A number tabular data cell.

                                  <Prop.List>
                                    <Prop name="type" type="string" required>
                                      <Prop.Extras>
                                        **Available values:** The only valid value is `number`.
                                      </Prop.Extras>
                                    </Prop>
                                  </Prop.List>
                                </Tab>

                                <Tab name="boolean">
                                  A boolean tabular data cell.

                                  <Prop.List>
                                    <Prop name="type" type="string" required>
                                      <Prop.Extras>
                                        **Available values:** The only valid value is `boolean`.
                                      </Prop.Extras>
                                    </Prop>
                                  </Prop.List>
                                </Tab>

                                <Tab name="date">
                                  A date tabular data cell.

                                  Specified as a Unix timestamp (in seconds since the Unix Epoch).

                                  <Prop.List>
                                    <Prop name="type" type="string" required>
                                      <Prop.Extras>
                                        **Available values:** The only valid value is `date`.
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
                  </PillAccordion>
                </Prop>
              </Prop.List>
            </Tab>
          </Tabs>
        </Prop>
      </Prop.List>
    </PillAccordion>
  </Prop>

  <Prop name="title" type="string">
    Title to use for the autofilled design.

    If no design title is provided, the autofilled design will have the same title as the brand template.

    <Prop.Extras>
      **Minimum length:** `1`

      **Maximum length:** `255`
    </Prop.Extras>
  </Prop>
</Prop.List>

## Example request

Examples for using the `/v1/autofills` endpoint:

<Tabs storageKey="example.language" disableContentTransition>
  <Tab name="cURL">
    ```sh
    curl --request POST 'https://api.canva.com/rest/v1/autofills' \
    --header 'Authorization: Bearer {token}' \
    --header 'Content-Type: application/json' \
    --data '{
      "brand_template_id": "DAFVztcvd9z",
      "title": "string",
      "data": {
        "cute_pet_image_of_the_day": {
          "type": "image",
          "asset_id": "Msd59349ff"
        },
        "cute_pet_witty_pet_says": {
          "type": "text",
          "text": "It was like this when I got here!"
        },
        "cute_pet_sales_chart": {
          "type": "chart",
          "chart_data": {
            "rows": [
              {
                "cells": [
                  {
                    "type": "string",
                    "value": "Geographic Region"
                  },
                  {
                    "type": "string",
                    "value": "Sales (millions AUD)"
                  },
                  {
                    "type": "string",
                    "value": "Target met?"
                  },
                  {
                    "type": "string",
                    "value": "Date met"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "type": "string",
                    "value": "Asia Pacific"
                  },
                  {
                    "type": "number",
                    "value": 10.2
                  },
                  {
                    "type": "boolean",
                    "value": true
                  },
                  {
                    "type": "date",
                    "value": 1721944387
                  }
                ]
              },
              {
                "cells": [
                  {
                    "type": "string",
                    "value": "EMEA"
                  },
                  {
                    "type": "number",
                    "value": 13.8
                  },
                  {
                    "type": "boolean",
                    "value": false
                  },
                  {
                    "type": "date"
                  }
                ]
              }
            ]
          }
        }
      }
    }'
    ```
  </Tab>

  <Tab name="Node.js">
    ```js
    const fetch = require("node-fetch");

    fetch("https://api.canva.com/rest/v1/autofills", {
      method: "POST",
      headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "brand_template_id": "DAFVztcvd9z",
        "title": "string",
        "data": {
          "cute_pet_image_of_the_day": {
            "type": "image",
            "asset_id": "Msd59349ff"
          },
          "cute_pet_witty_pet_says": {
            "type": "text",
            "text": "It was like this when I got here!"
          },
          "cute_pet_sales_chart": {
            "type": "chart",
            "chart_data": {
              "rows": [
                {
                  "cells": [
                    {
                      "type": "string",
                      "value": "Geographic Region"
                    },
                    {
                      "type": "string",
                      "value": "Sales (millions AUD)"
                    },
                    {
                      "type": "string",
                      "value": "Target met?"
                    },
                    {
                      "type": "string",
                      "value": "Date met"
                    }
                  ]
                },
                {
                  "cells": [
                    {
                      "type": "string",
                      "value": "Asia Pacific"
                    },
                    {
                      "type": "number",
                      "value": 10.2
                    },
                    {
                      "type": "boolean",
                      "value": true
                    },
                    {
                      "type": "date",
                      "value": 1721944387
                    }
                  ]
                },
                {
                  "cells": [
                    {
                      "type": "string",
                      "value": "EMEA"
                    },
                    {
                      "type": "number",
                      "value": 13.8
                    },
                    {
                      "type": "boolean",
                      "value": false
                    },
                    {
                      "type": "date"
                    }
                  ]
                }
              ]
            }
          }
        }
      }),
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
                .uri(URI.create("https://api.canva.com/rest/v1/autofills"))
                .header("Authorization", "Bearer {token}")
                .header("Content-Type", "application/json")
                .method("POST", HttpRequest.BodyPublishers.ofString("{\"brand_template_id\": \"DAFVztcvd9z\", \"title\": \"string\", \"data\": {\"cute_pet_image_of_the_day\": {\"type\": \"image\", \"asset_id\": \"Msd59349ff\"}, \"cute_pet_witty_pet_says\": {\"type\": \"text\", \"text\": \"It was like this when I got here!\"}, \"cute_pet_sales_chart\": {\"type\": \"chart\", \"chart_data\": {\"rows\": [{\"cells\": [{\"type\": \"string\", \"value\": \"Geographic Region\"}, {\"type\": \"string\", \"value\": \"Sales (millions AUD)\"}, {\"type\": \"string\", \"value\": \"Target met?\"}, {\"type\": \"string\", \"value\": \"Date met\"}]}, {\"cells\": [{\"type\": \"string\", \"value\": \"Asia Pacific\"}, {\"type\": \"number\", \"value\": 10.2}, {\"type\": \"boolean\", \"value\": true}, {\"type\": \"date\", \"value\": 1721944387}]}, {\"cells\": [{\"type\": \"string\", \"value\": \"EMEA\"}, {\"type\": \"number\", \"value\": 13.8}, {\"type\": \"boolean\", \"value\": false}, {\"type\": \"date\"}]}]}}}}"))
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
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json"
    }

    data = {
        "brand_template_id": "DAFVztcvd9z",
        "title": "string",
        "data": {
            "cute_pet_image_of_the_day": {
                "type": "image",
                "asset_id": "Msd59349ff"
            },
            "cute_pet_witty_pet_says": {
                "type": "text",
                "text": "It was like this when I got here!"
            },
            "cute_pet_sales_chart": {
                "type": "chart",
                "chart_data": {
                    "rows": [
                        {
                            "cells": [
                                {
                                    "type": "string",
                                    "value": "Geographic Region"
                                },
                                {
                                    "type": "string",
                                    "value": "Sales (millions AUD)"
                                },
                                {
                                    "type": "string",
                                    "value": "Target met?"
                                },
                                {
                                    "type": "string",
                                    "value": "Date met"
                                }
                            ]
                        },
                        {
                            "cells": [
                                {
                                    "type": "string",
                                    "value": "Asia Pacific"
                                },
                                {
                                    "type": "number",
                                    "value": 10.2
                                },
                                {
                                    "type": "boolean",
                                    "value": True
                                },
                                {
                                    "type": "date",
                                    "value": 1721944387
                                }
                            ]
                        },
                        {
                            "cells": [
                                {
                                    "type": "string",
                                    "value": "EMEA"
                                },
                                {
                                    "type": "number",
                                    "value": 13.8
                                },
                                {
                                    "type": "boolean",
                                    "value": False
                                },
                                {
                                    "type": "date"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }

    response = requests.post("https://api.canva.com/rest/v1/autofills",
        headers=headers,
        json=data
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
      Method = HttpMethod.Post,
      RequestUri = new Uri("https://api.canva.com/rest/v1/autofills"),
      Headers =
      {
        { "Authorization", "Bearer {token}" },
      },
      Content = new StringContent(
        "{\"brand_template_id\": \"DAFVztcvd9z\", \"title\": \"string\", \"data\": {\"cute_pet_image_of_the_day\": {\"type\": \"image\", \"asset_id\": \"Msd59349ff\"}, \"cute_pet_witty_pet_says\": {\"type\": \"text\", \"text\": \"It was like this when I got here!\"}, \"cute_pet_sales_chart\": {\"type\": \"chart\", \"chart_data\": {\"rows\": [{\"cells\": [{\"type\": \"string\", \"value\": \"Geographic Region\"}, {\"type\": \"string\", \"value\": \"Sales (millions AUD)\"}, {\"type\": \"string\", \"value\": \"Target met?\"}, {\"type\": \"string\", \"value\": \"Date met\"}]}, {\"cells\": [{\"type\": \"string\", \"value\": \"Asia Pacific\"}, {\"type\": \"number\", \"value\": 10.2}, {\"type\": \"boolean\", \"value\": true}, {\"type\": \"date\", \"value\": 1721944387}]}, {\"cells\": [{\"type\": \"string\", \"value\": \"EMEA\"}, {\"type\": \"number\", \"value\": 13.8}, {\"type\": \"boolean\", \"value\": false}, {\"type\": \"date\"}]}]}}}}",
        Encoding.UTF8,
        "application/json"
      ),
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
    	"strings"
    )

    func main() {
    	payload := strings.NewReader(`{
    	  "brand_template_id": "DAFVztcvd9z",
    	  "title": "string",
    	  "data": {
    	    "cute_pet_image_of_the_day": {
    	      "type": "image",
    	      "asset_id": "Msd59349ff"
    	    },
    	    "cute_pet_witty_pet_says": {
    	      "type": "text",
    	      "text": "It was like this when I got here!"
    	    },
    	    "cute_pet_sales_chart": {
    	      "type": "chart",
    	      "chart_data": {
    	        "rows": [
    	          {
    	            "cells": [
    	              {
    	                "type": "string",
    	                "value": "Geographic Region"
    	              },
    	              {
    	                "type": "string",
    	                "value": "Sales (millions AUD)"
    	              },
    	              {
    	                "type": "string",
    	                "value": "Target met?"
    	              },
    	              {
    	                "type": "string",
    	                "value": "Date met"
    	              }
    	            ]
    	          },
    	          {
    	            "cells": [
    	              {
    	                "type": "string",
    	                "value": "Asia Pacific"
    	              },
    	              {
    	                "type": "number",
    	                "value": 10.2
    	              },
    	              {
    	                "type": "boolean",
    	                "value": true
    	              },
    	              {
    	                "type": "date",
    	                "value": 1721944387
    	              }
    	            ]
    	          },
    	          {
    	            "cells": [
    	              {
    	                "type": "string",
    	                "value": "EMEA"
    	              },
    	              {
    	                "type": "number",
    	                "value": 13.8
    	              },
    	              {
    	                "type": "boolean",
    	                "value": false
    	              },
    	              {
    	                "type": "date"
    	              }
    	            ]
    	          }
    	        ]
    	      }
    	    }
    	  }
    	}`)

    	url := "https://api.canva.com/rest/v1/autofills"
    	req, _ := http.NewRequest("POST", url, payload)
    	req.Header.Add("Authorization", "Bearer {token}")
    	req.Header.Add("Content-Type", "application/json")

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
      CURLOPT_URL => "https://api.canva.com/rest/v1/autofills",
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer {token}',
        'Content-Type: application/json',
      ),
      CURLOPT_POSTFIELDS => json_encode([
        "brand_template_id" => "DAFVztcvd9z",
        "title" => "string",
        "data" => [
          "cute_pet_image_of_the_day" => [
            "type" => "image",
            "asset_id" => "Msd59349ff"
          ],
          "cute_pet_witty_pet_says" => [
            "type" => "text",
            "text" => "It was like this when I got here!"
          ],
          "cute_pet_sales_chart" => [
            "type" => "chart",
            "chart_data" => [
              "rows" => [
                [
                  "cells" => [
                    [
                      "type" => "string",
                      "value" => "Geographic Region"
                    ],
                    [
                      "type" => "string",
                      "value" => "Sales (millions AUD)"
                    ],
                    [
                      "type" => "string",
                      "value" => "Target met?"
                    ],
                    [
                      "type" => "string",
                      "value" => "Date met"
                    ]
                  ]
                ],
                [
                  "cells" => [
                    [
                      "type" => "string",
                      "value" => "Asia Pacific"
                    ],
                    [
                      "type" => "number",
                      "value" => 10.2
                    ],
                    [
                      "type" => "boolean",
                      "value" => true
                    ],
                    [
                      "type" => "date",
                      "value" => 1721944387
                    ]
                  ]
                ],
                [
                  "cells" => [
                    [
                      "type" => "string",
                      "value" => "EMEA"
                    ],
                    [
                      "type" => "number",
                      "value" => 13.8
                    ],
                    [
                      "type" => "boolean",
                      "value" => false
                    ],
                    [
                      "type" => "date"
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ])
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

    url = URI('https://api.canva.com/rest/v1/autofills')
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request['Authorization'] = 'Bearer {token}'
    request['Content-Type'] = 'application/json'
    request.body = <<REQUEST_BODY
    {
      "brand_template_id": "DAFVztcvd9z",
      "title": "string",
      "data": {
        "cute_pet_image_of_the_day": {
          "type": "image",
          "asset_id": "Msd59349ff"
        },
        "cute_pet_witty_pet_says": {
          "type": "text",
          "text": "It was like this when I got here!"
        },
        "cute_pet_sales_chart": {
          "type": "chart",
          "chart_data": {
            "rows": [
              {
                "cells": [
                  {
                    "type": "string",
                    "value": "Geographic Region"
                  },
                  {
                    "type": "string",
                    "value": "Sales (millions AUD)"
                  },
                  {
                    "type": "string",
                    "value": "Target met?"
                  },
                  {
                    "type": "string",
                    "value": "Date met"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "type": "string",
                    "value": "Asia Pacific"
                  },
                  {
                    "type": "number",
                    "value": 10.2
                  },
                  {
                    "type": "boolean",
                    "value": true
                  },
                  {
                    "type": "date",
                    "value": 1721944387
                  }
                ]
              },
              {
                "cells": [
                  {
                    "type": "string",
                    "value": "EMEA"
                  },
                  {
                    "type": "number",
                    "value": 13.8
                  },
                  {
                    "type": "boolean",
                    "value": false
                  },
                  {
                    "type": "date"
                  }
                ]
              }
            ]
          }
        }
      }
    }
    REQUEST_BODY

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

### 400 Bad Request

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
  "code": "bad_request_params",
  "message": "Design title invalid"
}
```

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
  "message": "Not allowed to access brand template with id '{brandTemplateId}'"
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
  "message": "Brand template with id '{brandTemplateId}' not found"
}
```
