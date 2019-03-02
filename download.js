const client = require('cheerio-httpcli');
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');

const config = {
    production: '',
    staging: '',
    url: '',
};


function run() {
  // production mode
  checkAndWrite(config.production + config.url, 'lhs.html');

  // staging mode
  // checkAndWrite(config.staging + config.url, 'rhs.html');
}


function checkAndWrite(targetUrl, file) {

  client.fetch(targetUrl)
  .then(function(res) {
    return checkOGPProperties(res);
  })
  .then(function(res) {
    const body = res.$.html();
    fs.writeFile(file, body, function(err) {
      if (err) {
        reject(new Error(err));
      }
      console.log(`The ${file} has been saved.`);
    })
  })
  .catch(function(err) {
    console.log('Error',err);
  })
}


function checkOGPProperties(response) {
  const ogUrl = response.$('meta[property="og:url"]').attr('content');
  const ogImage = response.$('meta[property="og:image"]').attr('content');

  const checkOgUrl = new Promise(function(resolve, reject) {
    const re = /.*\/$/;
    if (re.test(ogUrl)) {
      resolve("og:url => o");
    } else {
      resolve("og:url => x");
    }
  })

  const checkOgImage = new Promise(function(resolve, reject) {
    if (ogImage !== undefined) {
      const u = url.parse(ogImage);

      if (u.host === config.staging) {
        ogImage = config.staging + u.pathname;
      }

      if (u.protocol === 'http:') {
        http.get(ogImage, function(res) {
          const { statusCode } = res;
          if (statusCode === 200) {
            resolve("og:image => o");
          } else {
            resolve("og:image => x");
          }
        })
      } else if (u.protocol === 'https:') {
        https.get(ogImage, function(res) {
          const { statusCode } = res;
          if (statusCode === 200) {
            resolve("og:image => o");
          } else {
            resolve("og:image => x");
          }
        })
      } else {
        resolve('og:image => Invalid protocol');
      }
    } else {
      resolve('og:image => no image');
    }
  })

  return Promise.all([checkOgUrl, checkOgImage])
  .then(function(val) {
    console.log(val);
    return response;
  })
  .catch(function(err) {
    return err;
  })

}


// entry method
run();
