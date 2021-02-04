# Backend Task for HackerBay Interview (using NodeJS)

This is a short project in fulfillment of preliminary requirements for the role of a software developer in HackerBay. This task focuses on showcasing backend skills by building a simple REST API using NodeJS.

## REST API features

The REST API comprises 4 endpoints (2 unprotected/public and 2 protected endpoints). This README assumes the project is being run locally on `http://localhost`. Replace this with the appropriate server base url where applicable.

### Documentation Endpoint

The `documentation` endpoint is a `Swagger` powered OpenAPI documentation. The endpoint provides a detailed specification of the available endpoints. The documentation is available by making a `GET` request to the `/docs` endpoint. Ideally, the rendered documentation should instead be viewed through a browser by visiting `http://localhost/docs`.

### Login Endpoint

The `Login` endpoint provides a signed JSON web token (JWT) which is required to access the protected endpoints. To obtain a JWT requires making a `POST` request to the `/login` endpoint with request body(JSON) containing an arbritary `username` and `password`.

Sample Request:

```
POST http://localhost/login
body: { username: "johnDoe", password: "123456" }
```

Sample Response:

```
STATUS 200
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoidWJGWE0wWWEiLCJpYXQiOjE2MTIzOTE0ODIsImV4cCI6MTYxMjQ3Nzg4Mn0.W_-jSKdt6OyxTL9hGNu9rRKhQdZ3Hs1_TjtERGDHwo4"
  },
  "status": "success"
}
```

### JSON Patch Endpoint

The `Json Patch` endpoint provides a utility to "JSON Patch" a provided `JSON` object using `JSON Patch` operator(s). This requires making a `POST` request to the `/utils/json-patch` endpoint, with a vaild JWT `Bearer token`, a request body containing a valid JSON object, `jsonObject` and a valid JSON patch array, `jsonPatch`.

Sample Request:

```
POST http://localhost/utils/json-patch
Authorization: Bearer `JWT-token`
body: { jsonObject: {
          "baz": "qux",
          "foo": "bar"
        },
        jsonPatch: [
          { "op": "replace", "path": "/baz", "value": "boo" },
          { "op": "add", "path": "/hello", "value": ["world"] },
          { "op": "remove", "path": "/foo" }
        ]
      }
```

Sample Response:

```
STATUS 200
{
  data: {
    "document": {
      "baz": "boo",
      "hello": ["world"]
    }
  },
  status: "success"
}
```

### Create Thumbnail Endpoint

The `Create Thumbnail` endpoint provides a utility to generate a thumbnail from an image Url. This requires making a `POST` request to the `/utils/create-thumbnail` endpoint with a vaild JWT `Bearer token`, a request body containing a valid image url, `imageUrl`. The default response is a JSON object with the thumbnail as a `Base64` string in the `data` property. When a query parameter, `?raw=true` is passed, the raw thumbnail image is returned instead. 

Sample Default Request:

```
POST http://localhost/utils/create-thumbnail
Authorization: Bearer `JWT-token`
body: { imageUrl: "https://abc.xyz/some-image-url" }
```

Sample Response:

```
STATUS 200
{
  data: {
    base64Thumbnail: "ahdhgj767XOZX9oucxozljAUxu8aooasxcsc...."
  },
  status: "success"
}
```

- If the raw thumbnail image is needed the `raw?true` query parameter is appended to the request

Sample Raw Thumbnail Request:

```
POST http://localhost/utils/create-thumbnail
Authorization: Bearer `JWT-token`
body: { imageUrl: "https://abc.xyz/some-image-url?raw=true" }
```

Sample Raw Thumbnail Response:

```
STATUS 200
{
  data: {
    base64Thumbnail: "ahdhgj767XOZX9oucxozljAUxu8aooasxcsc...."
  },
  status: "success"
}
```
