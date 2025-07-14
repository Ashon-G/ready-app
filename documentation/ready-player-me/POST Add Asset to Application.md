---
description: >-
  Note: All body parameters need to be inside a 'data' object, as shown in the
  example request at the bottom.
---

# POST - Add Asset to Application

## Use this endpoint to add an asset to an application

<mark style="color:green;">`POST`</mark> `https://api.readyplayer.me/v1/assets/:id/application`

#### Path Parameters

| Name                                 | Type   | Description                             |
| ------------------------------------ | ------ | --------------------------------------- |
| id<mark style="color:red;">\*</mark> | string | The id of the asset you want to update. |

#### Request Body

| Name                                                     | Type    | Description                                                      |
| -------------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| data.applicationId<mark style="color:red;">\*</mark>     | string  | The id of the application you wish to add the asset to.          |
| data.isVisibleInEditor<mark style="color:red;">\*</mark> | boolean | Defines if asset is visible in this application's avatar editor. |

{% tabs %}
{% tab title="201: Created A typical successful response" %}
```json
{
    "data": {
        "id": "640f2b0ed1dbab604a9955d0",
        "type": "outfit",
        "gender": "male",
        "iconUrl": "https://www.example.org/logo.png",
        "modelUrl": "https://www.example.org/model.glb",
        "status": "draft",
        "organizationId": "63a58eb6df136d3df8ce0d74",
        "name": "My new asset",
        "applicationIds": [
            "62cebaa1a04e199829e9277a"
        ],
        "createdAt": "2023-03-13T13:54:22.559Z",
        "updatedAt": "2023-03-13T13:54:22.559Z",
        "publishedAt": "2023-03-13T13:54:22.559Z",
    }
}
```
{% endtab %}

{% tab title="400: Bad Request A validation error" %}
```javascript
{
    "type": "BadRequestError",
    "status": 400,
    "message": "Bad Request",
    "data": {
        "body": [
            {
                "instancePath": "/data",
                "schemaPath": "#/properties/data/required",
                "keyword": "required",
                "params": {
                    "missingProperty": "applicationId"
                },
                "message": "must have required property 'applicationId'"
            }
        ]
    }
}
```
{% endtab %}

{% tab title="403: Forbidden A permissions error" %}
```javascript
{
    "type": "ForbiddenError",
    "status": 403,
    "message": "Cannot execute \"update\" on \"Asset\""
}
```
{% endtab %}
{% endtabs %}

### Example Request Body

```json

{
    "data": {
        "applicationId": "66568e46df136d3df8ce0d74"
    }
}
```

### Example Response

Returns a the whole updated asset in response.

```json
{
    "data": {
        "id": "145064511",
        "name": "jacket-occassionwear-02",
        "organizationId": "6453d11c462434a35b4abe17",
        "listed": true,
        "locked": false,
        "type": "top",
        "gender": "neutral",
        "modelUrl": "https://example.org/jacket-occassionwear-02.glb",
        "iconUrl": "https://example.org/jacket-occassionwear-02.png",
        "applicationIds": [
            "6479be53386e0a8665161420",
            "66568e46df136d3df8ce0d74"
        ],
        "hasApps": true,
        "createdAt": "2023-02-02T14:39:01.026Z",
        "updatedAt": "2023-02-02T14:39:08.656Z"
    }
}
```
