# Ready App

This project demonstrates an Expo + Firebase setup with CPX Research surveys.

## CPX Research Setup

1. Obtain your **App ID** and **Secure Hash** from the [CPX publisher portal](https://publisher.cpx-research.com/).
2. Add them under the `cpx` key in `app.json`:

```json
{
  "expo": {
    "extra": {
      "cpx": {
        "appId": "26024",
        "secureHash": "giPTmdFjOauZKOwkAFAmrMCGXm276sMu"
      }
    }
  }
}
```

3. When calling the API, build the URL using the parameters described in the CPX documentation. The helper in `lib/cpx.ts` does this automatically, including computing the MD5 hash and sending optional demographic information.

The URL will look like:

```
https://live-api.cpx-research.com/api/get-surveys.php?app_id=APP_ID&ext_user_id=USER_ID&subid_1=&subid_2=&output_method=api&ip_user=IP&user_agent=AGENT&limit=12&secure_hash=HASH&main_info=true&birthday_day=DD&birthday_month=MM&birthday_year=YYYY&gender=G&user_country_code=CC&zip_code=ZIP
```

Replace each placeholder with your values. The secure hash is computed as `md5(userId + '-' + SECURE_HASH)`.
