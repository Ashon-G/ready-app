# PUT - Lock asset for a user

## Use this endpoint for locking an unlocked asset for a user

<mark style="color:orange;">`PUT`</mark> `https://api.readyplayer.me/v1/assets/:id/lock`

#### Path Parameters

| Name                               | Type   | Description                          |
| ---------------------------------- | ------ | ------------------------------------ |
| <mark style="color:red;">\*</mark> | String | The id of the asset you want to lock |

#### Request Body

| Name                                          | Type   | Description                                       |
| --------------------------------------------- | ------ | ------------------------------------------------- |
| data.userId<mark style="color:red;">\*</mark> | String | The id of the user you want to lock the asset for |

{% tabs %}
{% tab title="204: No Content If the asset was successfully locked for the user, it would return status 204. No response body is sent" %}

{% endtab %}
{% endtabs %}

### Example Request Body

```json
{
    "data": {
        "userId": "64943d471dc01e086ac887ee"
    }
}
```
