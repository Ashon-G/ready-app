# GET - List Assets

## List Assets

<mark style="color:blue;">`GET`</mark> `https://api.readyplayer.me/v1/assets`

Use this endpoint to fetch a paginated list of assets. With query parameters, you control the order, the number of assets you want per page, and the selected page.

#### Query Parameters

| Name           | Type         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| order          | string       | <p>The properties you would like to order the list by. You can specify multiple properties by adding the query param multiple times. </p><p></p><p>By default the order is ascending.</p><p>If want the descending one, prepend field value with <code>-</code> </p><p>Sortable fields:</p><p><code>name</code>, <code>updatedAt</code>,<code>hasApps</code>,<code>locked</code></p><p></p><p>Example:</p><p><code>?order=-name&#x26;order=locked</code></p> |
| limit          | number       | <p>The amount of documents you want to fetch per page.<br>Default: <code>20</code><br>Max: <code>100</code></p>                                                                                                                                                                                                                                                                                                                                              |
| page           | number       | The page of documents you would like to fetch.                                                                                                                                                                                                                                                                                                                                                                                                               |
| name           | string       | <p>Filter to find assets by their name. Looks for partial matches.<br></p>                                                                                                                                                                                                                                                                                                                                                                                   |
| organizationId | string       | Filter to find assets by organizationId                                                                                                                                                                                                                                                                                                                                                                                                                      |
| type           | string(enum) | <p>Filter to find assets by their type. Supports multiple values.</p><p></p><p>Allowed values can be found from <a href="../asset-entity-properties#type-enum-string">asset properties page</a>.<br><br>Example: </p><p><code>?type=outfit&#x26;type=top</code></p>                                                                                                                                                                                          |
| gender         | string(enum) | <p>Filter to find assets by their gender. Supports multiple values.</p><p></p><p>Allowed values can be found from <a href="../asset-entity-properties#gender-enum-string">asset properties page</a>.<br><br>Example: <code>?gender=male</code><br><code>&#x26;gender=neutral</code></p>                                                                                                                                                                      |
| ids            | string       | <p>Filter to find assets by Ids.</p><p></p><p>Example: <br><code>?ids=12345&#x26;ids=54321</code> </p>                                                                                                                                                                                                                                                                                                                                                       |
| applicationIds | string       | <p>Filter to find assets that are available in specific applications.</p><p></p><p>Example: <br><code>?applicationIds=12345</code><br><code>&#x26;applicationIds=54321</code> </p>                                                                                                                                                                                                                                                                           |

#### Headers

| Name                                       | Type   | Description                                        |
| ------------------------------------------ | ------ | -------------------------------------------------- |
| X-APP-ID<mark style="color:red;">\*</mark> | string | the applicationId you are fetching the assets for. |

{% tabs %}
{% tab title="200: OK A typical success response" %}
{% hint style="info" %}
Asset properties descriptions can be found at the [entity properties page](asset-entity-properties)
{% endhint %}

```json
{
    "data": [
        {
           "id": "145064511",
            "name": "jacket-occassionwear-02",
            "organizationId": "6453d11c462434a35b4abe17",
            "locked": false,
            "type": "top",
            "gender": "neutral",
            "modelUrl": "https://example.org/jacket-occassionwear-02.glb",
            "iconUrl": "https://example.org/jacket-occassionwear-02.png",
            "applications": [
                {
                     "id": "6479be53386e0a8665161420",
                     "organizationId": "62a58eb4df136d4df8ce0d74",
                     "isVisibleInEditor": true,
                     "masculineOrder": 1,
                     "feminineOrder": 2
                }
            ],
            "hasApps": true,
            "createdAt": "2023-02-02T14:39:01.026Z",
            "updatedAt": "2023-02-02T14:39:08.656Z"
        }
    ],
    "pagination": {
        "totalDocs": 1,
        "limit": 10,
        "totalPages": 1,
        "page": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "prevPage": 0,
        "nextPage": 0
    }
}
```
{% endtab %}
{% endtabs %}

### Example Request

{% hint style="warning" %}
Make sure not to forget the required `X-APP-ID` header
{% endhint %}

```
https://api.readyplayer.me/v1/assets?order=name&order=-updatedAt&limit=10&page=1
```
