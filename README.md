# About JavaScript Blog Sample

This repository holds the sample source code for a basic JavaScript implementation of a blog site powered by Oracle Content Management.

Please see the complete [tutorial](https://www.oracle.com/pls/topic/lookup?ctx=cloud&id=oce-javascript-blog-sample) and the live [demo](https://headless.mycontentdemo.com/samples/oce-javascript-blog-sample).

## Installation

Run the following to install the dependencies needed by this sample:

```shell
npm install
```

## Running the project

> **NOTE:** If you need to use a proxy to reach the internet then define an oce_https_proxy environment variable:

```shell
export oce_https_proxy=\<scheme\>://\<proxyhost\>:\<port\>
```

To build this project:

```shell
npm run build
```

and then open [http://localhost:8080](http://localhost:8080)

You can then host the contents of the *src* folder on any web server.

To run using the embedded server code:

```shell
npm run start
```

and then open [http://localhost:8080/oce-javascript-blog-sample/index.html](http://localhost:8080/oce-javascript-blog-sample/index.html)

## Images

Sample images may be downloaded from [https://www.oracle.com/middleware/technologies/content-experience-downloads.html](https://www.oracle.com/middleware/technologies/content-experience-downloads.html) under a separate license.  These images are provided for reference purposes only and may not hosted or redistributed by you.

## Contributing

This project welcomes contributions from the community. Before submitting a pull
request, please [review our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security
vulnerability disclosure process.

## License

Copyright (c) 2020, 2021 Oracle and/or its affiliates and released under the
[Universal Permissive License (UPL)](https://oss.oracle.com/licenses/upl/), Version 1.0
