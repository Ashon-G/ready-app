# GET - 3D Avatar

Get a 3D avatar `.glb` file with desired performance and configuration settings.
All avatars are hosted at:

```
https://models.readyplayer.me
```

> ✅ Always use `https://models.readyplayer.me` for avatar requests instead of `https://api.readyplayer.me`.

---

## Endpoint

**Get an avatar `.glb` by ID:**

```
GET https://models.readyplayer.me/avatarId.glb
```

---

## Path Parameters

| Name           | Type   | Description                                      |
| -------------- | ------ | ------------------------------------------------ |
| `avatarId.glb` | String | ID of the avatar (must include `.glb` extension) |

---

## Query Parameters

| Name                                   | Type    | Description                                   |
| -------------------------------------- | ------- | --------------------------------------------- |
| `quality`                              | String  | `low`, `medium`, or `high` quality presets    |
| `meshLod` *(Deprecated)*               | Int     | Controls triangle count on equipped assets    |
| `textureSizeLimit`                     | Int     | Upper limit for texture resolution (px)       |
| `textureAtlas`                         | Int     | Generates texture atlas of desired resolution |
| `textureChannels`                      | String  | Comma-separated list of texture channels      |
| `morphTargets`                         | String  | Comma-separated list of morph targets         |
| `useDracoMeshCompression`              | Boolean | Compress with Draco (reduces size)            |
| `useMeshOptCompression` *(Deprecated)* | Boolean | Compress with Mesh Optimization               |
| `useQuantizeMeshOptCompression`        | Boolean | Quantize + Mesh Opt Compression               |
| `pose`                                 | String  | Pose for full-body avatar: `A` or `T`         |
| `useHands`                             | Boolean | Include hands for half-body avatars           |
| `textureFormat`                        | String  | Format all textures: `webp`, `jpeg`, `png`    |
| `lod`                                  | Int     | Control triangle count of entire avatar       |
| `textureQuality`                       | String  | Texture quality: `low`, `medium`, `high`      |

---

## Response Codes

* **`200 OK`**: Model `.glb` returned
* **`404 Not Found`**: Avatar not available

---

## Notes

* Always include `.glb` in the URL, or a 404 will occur.
* Avatar IDs or short codes are returned via `postMessage` from Ready Player Me.
* Default values apply unless parameters are explicitly set.

---

## Examples

### Base Avatar

```
https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb
```

### With LOD and No Texture Atlas

```
https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb?lod=2&textureAtlas=none
```

### Quality Preset Examples

```
?quality=high
?quality=medium
?quality=low
?quality=low&meshLod=0
```

### LOD (Triangle Count)

| Value | Description            |
| ----- | ---------------------- |
| `0`   | No reduction (default) |
| `1`   | 50% triangles          |
| `2`   | 25% triangles          |

### Texture Size Limit

| Min | Max (default) | Note                  |
| --- | ------------- | --------------------- |
| 256 | 1024          | Must be multiple of 2 |

### Texture Quality

| Value    | Description                       |
| -------- | --------------------------------- |
| `low`    | Lower quality for distant avatars |
| `medium` | Default                           |
| `high`   | Full quality for all assets       |

### Texture Atlas

| Value  | Description        |
| ------ | ------------------ |
| `none` | No atlas (default) |
| `256`  | 256×256px atlas    |
| `512`  | 512×512px atlas    |
| `1024` | 1024×1024px atlas  |

### Texture Format

```
?textureFormat=webp
?textureFormat=jpeg
?textureFormat=png
```

> ⚠️ WebP is not fully supported in Unity/Unreal SDKs.

### Texture Channels

```
?textureChannels=baseColor,normal,emissive
```

Available values:

* `baseColor`
* `normal`
* `metallicRoughness`
* `emissive`
* `occlusion`
* `none`

### Morph Targets

```
?morphTargets=ARKit,Oculus Visemes
```

Available values:

* `Default`
* `ARKit`
* `Oculus Visemes`
* Other supported targets

### Pose

```
?pose=A       // Default
?pose=T       // T-pose
```

### Compression Options

* **Draco**

  ```
  ?useDracoMeshCompression=true
  ```

* **MeshOpt**

  ```
  ?useMeshOptCompression=true
  ```

* **Quantize MeshOpt**

  ```
  ?useQuantizeMeshOptCompression=true
  ```

### Hands

```
?useHands=true   // Include hands (default)
?useHands=false  // No hands
```


