# HTML DIFF tool

## Setup

### 1. Installing npm modules

```
npm install
```

### 2. Write configuration

To get HTML sources and compare them, write your host and url to ``download.js``.

```
const config = {
  production: 'www.production.com',
  staging: 'www.staging.com',
  url: '/path/to/content'
};
```
