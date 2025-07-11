Here's a clean and organized `agents.md` file for integrating the Ready Player Me API in an **Expo** app:

---

# `agents.md` – Ready Player Me API Integration Guide (Expo)

This document outlines the step-by-step process for integrating Ready Player Me into your Expo app, allowing users to create anonymous accounts, generate and customize avatars, and fetch them as GLB models.

---

## Credentials

API Key:
sk_live_dMg2ABIyW9-9HziFR53S_5FtUzbY937eS6wF 

Subdomain:
arcadia-next.readyplayer.me

App ID:
683c0f07d8f16f5cf857a864

Org ID:
683c0f06108eae0090c2b319

---

## 🔐 1. Create Anonymous User

### Endpoint

```
POST https://api.readyplayer.me/v1/users
```

### Request Body

```json
{
  "data": {
    "applicationId": "[your-app-id]"
  }
}
```

### Response

* Returns:

  * `user.id`
  * `user.token`

---

## 🎭 2. Create a Default Avatar

### Step 2.1: Get All Templates

**Endpoint**

```
GET https://api.readyplayer.me/v2/avatars/templates
```

**Headers**

```
Authorization: Bearer [token]
```

---

### Step 2.2: Create Draft Avatar From Template

**Endpoint**

```
POST https://api.readyplayer.me/v2/avatars/templates/[template-id]
```

**Headers**

```
Authorization: Bearer [token]
```

**Request Body**

```json
{
  "partner": "[subdomain]",
  "bodyType": "fullbody"
}
```

**Response**

* Returns `avatar.id`

---

### Step 2.3: Fetch Draft Avatar as GLB

**Endpoint**

```
GET https://api.readyplayer.me/v2/avatars/[avatar-id].glb?preview=true
```

**Response**

* Returns GLB binary

---

### Step 2.4: Save Draft Avatar

**Endpoint**

```
PUT https://api.readyplayer.me/v2/avatars/[avatar-id]
```

**Headers**

```
Authorization: Bearer [token]
```

---

## 🧰 3. Fetch Equipable Assets

**Endpoint**

```
GET https://api.readyplayer.me/v1/assets?filter=usable-by-user-and-app&filterApplicationId=[app-id]&filterUserId=[user-id]
```

**Headers**

```
Authorization: Bearer [token]
X-APP-ID: [app-id]
```

**Response**

* Array of asset objects with fields like:

  * `id`
  * `type`
  * `gender`
  * `iconUrl`

---

## 🎒 4. Equip Asset to Draft Avatar

**Endpoint**

```
PATCH https://api.readyplayer.me/v2/avatars/[avatar-id]
```

**Request Body Example**

```json
{
  "outfit": "[asset-id]"
}
```

**Response**

* Returns updated `avatar.assets`

---

## 💾 5. Save Updated Avatar

**Endpoint**

```
PUT https://api.readyplayer.me/v2/avatars/[avatar-id]
```

**Headers**

```
Authorization: Bearer [token]
```

---

## 📦 6. Fetch Final Saved Avatar

**Endpoint**

```
GET https://models.readyplayer.me/[avatar-id].glb
```

---

## 🔄 Optional: Merge Anonymous User to RPM Account

### Step 1: Request Login Code

**Endpoint**

```
POST https://api.readyplayer.me/v1/auth/request-login-code
```

**Body**

```json
{
  "email": "[user@example.com]"
}
```

---

### Step 2: Login and Merge

**Endpoint**

```
POST https://api.readyplayer.me/v1/auth/login
```

**Body**

```json
{
  "code": "[login-code]",
  "id": "[anonymous-user-id]" // optional
}
```

---

## ⚠️ Notes

* Always securely store the `token` on the client (e.g., AsyncStorage).
* Token never expires but **cannot** be recovered if lost (anonymous sessions).
* GLB files can be displayed using Three.js + `expo-gl` + `expo-three`.

---

## SDK Wrapper

---
Here’s a clean, reusable **Ready Player Me SDK wrapper** for your **Expo app**, written in **TypeScript**. It centralizes all Ready Player Me API interactions into a single module with easy-to-use methods.

---

### 📁 File: `lib/ReadyPlayerMe.ts`

```ts
// lib/ReadyPlayerMe.ts

const API_BASE_V1 = "https://api.readyplayer.me/v1";
const API_BASE_V2 = "https://api.readyplayer.me/v2";
const MODEL_BASE = "https://models.readyplayer.me";

export interface RPMUser {
  id: string;
  token: string;
}

export interface AvatarTemplate {
  id: string;
  gender: string;
  imageUrl: string;
}

export interface Asset {
  id: string;
  type: string;
  iconUrl: string;
  gender: string;
}

export default class ReadyPlayerMe {
  static async createAnonymousUser(appId: string): Promise<RPMUser> {
    const res = await fetch(`${API_BASE_V1}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { applicationId: appId } }),
    });

    const json = await res.json();
    return {
      id: json.data.id,
      token: json.data.token,
    };
  }

  static async getTemplates(token: string): Promise<AvatarTemplate[]> {
    const res = await fetch(`${API_BASE_V2}/avatars/templates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    return json.data;
  }

  static async createDraftAvatar(
    token: string,
    templateId: string,
    partner: string
  ): Promise<string> {
    const res = await fetch(
      `${API_BASE_V2}/avatars/templates/${templateId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partner,
          bodyType: "fullbody",
        }),
      }
    );

    const json = await res.json();
    return json.data.id;
  }

  static async saveAvatar(token: string, avatarId: string) {
    const res = await fetch(`${API_BASE_V2}/avatars/${avatarId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    return json.data;
  }

  static async getAvatarGLBUrl(avatarId: string, preview = false): Promise<string> {
    if (preview) {
      return `${API_BASE_V2}/avatars/${avatarId}.glb?preview=true`;
    } else {
      return `${MODEL_BASE}/${avatarId}.glb`;
    }
  }

  static async getAssets(
    appId: string,
    userId: string,
    token: string
  ): Promise<Asset[]> {
    const url = `${API_BASE_V1}/assets?filter=usable-by-user-and-app&filterApplicationId=${appId}&filterUserId=${userId}`;
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-APP-ID": appId,
      },
    });

    const json = await res.json();
    return json.data;
  }

  static async equipAsset(
    token: string,
    avatarId: string,
    asset: { [key: string]: string }
  ) {
    const res = await fetch(`${API_BASE_V2}/avatars/${avatarId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asset),
    });

    const json = await res.json();
    return json.data;
  }
}
```

---

### ✅ Example Usage

```ts
import ReadyPlayerMe from "./lib/ReadyPlayerMe";

const initAvatarFlow = async () => {
  const appId = "your-app-id";
  const partner = "your-subdomain";

  const user = await ReadyPlayerMe.createAnonymousUser(appId);
  const templates = await ReadyPlayerMe.getTemplates(user.token);
  const avatarId = await ReadyPlayerMe.createDraftAvatar(user.token, templates[0].id, partner);

  const glbUrl = await ReadyPlayerMe.getAvatarGLBUrl(avatarId, true);
  console.log("Preview GLB:", glbUrl);

  await ReadyPlayerMe.saveAvatar(user.token, avatarId);
  const finalGLB = await ReadyPlayerMe.getAvatarGLBUrl(avatarId);
  console.log("Saved Avatar:", finalGLB);
};
```


