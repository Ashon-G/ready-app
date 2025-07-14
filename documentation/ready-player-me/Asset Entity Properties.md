---
description: >-
  This is where you can discover all the attributes associated with an asset
  entity and understand their respective definitions.
---

# Asset Entity Properties

Properties

While you might encounter additional properties in the responses from the asset entity APIs, please note that only the properties outlined here are officially supported by us.

<details>

<summary>Id - <code>string</code></summary>

Automatically generated numeric Identifier of an asset.&#x20;

</details>

<details>

<summary>Name - <code>string</code></summary>

The name of an asset.

</details>

<details>

<summary>OrganizationId - <code>string</code></summary>

The Id of the asset owner organization.

</details>

<details>

<summary>Locked - <code>boolean</code></summary>

A boolean value which when set to `true`  requires the asset to be unlocked for specific user before it is usable by them.

</details>

<details>

<summary>Type - <code>enum (string)</code></summary>

Defines which body part of the avatar this asset belongs to.\
\
Possible values:

* `beard`
* `bottom`
* `eye`
* `eyebrows`
* `eyeshape`
* `facemask`
* `faceshape`
* `facewear`
* `footwear`
* `glasses`
* `hair`
* `headwear`
* `lipshape`
* `noseshape`
* `outfit`
* `shirt`
* `top`
* `costume`&#x20;

</details>

<details>

<summary>Gender - <code>enum (string)</code></summary>

Defines which avatar genders are supported for this asset.\
\
Possible values:

* `male`
* `female`
* `neutral` - asset supports both male & female avatars

</details>

<details>

<summary>ModelUrl* - <code>string</code></summary>

The URL where you can find the GLB model for the asset. \
\
NB: This field is available only for the assets that you can see in your Ready Player Me Studio asset manager.

</details>

<details>

<summary>IconUrl - <code>string</code></summary>

The URL where you can find the icon for the asset.

</details>

<details>

<summary>Applications - <code>ApplicationAssetRelation[]</code></summary>

Array of application-asset relations\
\
NB: Only returns the relations for applications that belong to the asset owner organization.



**Properties**:\
\
`id`: Id of the application

`organizationId`: Application owner organization ID

`isVisibleInEditor`: boolean which defines if the asset is visible in provided applications avatar editor

`masculineOrder`: for male/neutral assets, defines the asset order in avatar editor for specified application

`feminineOrder`: for female/neutral assets, defines the asset order in avatar editor for specified application

</details>

<details>

<summary>HasApps - <code>boolean</code></summary>

A boolean value indicating if this asset is available in any applications or not.

</details>

<details>

<summary>CreatedAt - <code>string</code></summary>

Datetime when this asset was created.

</details>

<details>

<summary>UpdatedAt - <code>string</code></summary>

Datetime when this asset was last updated.

</details>



### Example Entity

```json
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
             "organizationId": "6453d11c462434a35b4abe17",
             "isVisibleInEditor": true,
             "masculineOrder": 1,
             "feminineOrder": 2
        }
    ],
    "hasApps": true,
    "createdAt": "2023-02-02T14:39:01.026Z",
    "updatedAt": "2023-02-02T14:39:08.656Z"
}
```
