# Backend Task for HackerBay (using NodeJS)

This is a short project in fulfillment of preliminary requirements for the role of a software developer in HackerBay. This task focuses on showcasing backend skills by building a simple REST API using NodeJS. A live demo version is available [here](https://hackerbay-utils-app.herokuapp.com), with swagger docs [here](https://hackerbay-utils-app.herokuapp.com/docs).

## REST API features

The REST API comprises 4 endpoints (2 unprotected/public and 2 protected endpoints). This README assumes the project is being run locally on `http://localhost`. Replace this with the appropriate server base url where applicable. All requests are logged daily in separate log files in the `logs` folder at the application root.

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

- If the raw thumbnail image is needed the `raw?true` query parameter is appended to the request and the response body of the request contains the raw thumbnail image

Sample Raw Thumbnail Request:

```
POST http://localhost/utils/create-thumbnail
Authorization: Bearer `JWT-token`
body: { imageUrl: "https://abc.xyz/some-image-url?raw=true" }
```

Sample Raw Thumbnail Response:

```
STATUS 200
BODY: <Image Buffer>
```

## Response Formats

All responses both successful and error responses, with the exception of the raw thumbnail image are returned as JSON objects with a fixed format

### Success Response

```
STATUS: 200
BODY
{
  status: "success"
  message: "An optional human-readable message describing the operation carried out"
  data: "An object containing returned data"
}

```

### Error Response

```
STATUS: 400 or 500
BODY
{
  status: "error"
  error: "A human-readable message describing the error that occured"
  errors: "An optional array of all errors encoutered e.g validation errors"
}

```

## Local Development

First, setup the following environment variables locally, preferrably through a `.env` file. Although reasonable default values for the environment variables have been provided, you can specify custom values in your `.env` file or local environment. A sample .env file has been provided which can be easily renamed and populated.

- PORT: The port the server should listen on (default: 5000)
- JWT_SECRET: An abritary string used in signing JWT tokens for authentication

### Installation

- After cloning this repository, run `npm install` to install all dependencies
### Testing

The project is tested using the mocha/chai test suite. 
- Run `npm run test` to run all tests and view code coverage report.
- Run `npm run test:lint` to lint the code before running tests. 

### Linting

Code consistency and linting is powered by a combination of ESLint and prettier. 
- Run `npm run lint` to lint/format the source code
- Run `npm run lint:fix` to lint/format and fix all auto-fixable errors

### Running

### Running on Development Machine
This project is built using latest ES standards and supports ES6 modules. In development `babel-node` transpiles/builds the source files and runs the application using `nodemon` for hot reloads. In production, however, using `babel-node` is discouraged, so the code is first compiled via the `babel` CLI and then run by the `node` server. The following scripts are available
- Run `npm run dev` to run application in development with hot reload
- Run `npm run start` to build and run the application in production mode (implies `npm run build && npm run start:built`)
- Run `npm run build` to build the source files only, into the `build` folder
- Run `npm run start:built` to run existing built source files from the `build` folder

### Running the Dockerized Image

The built docker image of this application is available in the dockerhub reposoitory at 
```
daveok12/hackerbay-node-task:latest
``` 
or you could build the image locally with the provided `Dockerfile`. Even though default environment variables have been defined, containers should be ideally be run with the `--env-file` option, specifying the path to the `.env` file and publishing the corresponding ports (`--publish <local-port>:<image-port>`). For Example

```
  docker container run --env-file .env --publish 5000:5000 <image-name-here>
```