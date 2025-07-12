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

  static async getAvatarGLBUrl(shortCode: string, preview = false): Promise<string> {
    if (preview) {
      return `${API_BASE_V2}/avatars/${shortCode}.glb?preview=true`;
    } else {
      return `${MODEL_BASE}/${shortCode}.glb`;
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
