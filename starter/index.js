const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceIt = require('./Modules/replaceTemp');

// const ans=fs.readFileSync('./txt/input.txt' , 'utf-8');
// console.log(ans);
// const text= `This is what we know about this fruit till now : ${ans}..`
// fs.writeFileSync('./txt/output.txt' , text);

// fs.readFile('./txt/start.txt','utf-8',(err, data1)=>{
//     console.log(data1);
//    fs.readFile(`/txt/output.txt`,'utf-8',(err, data2)=>{
//     console.log(data2);
//      fs.writeFile(`/txt/final1.txt`,`${data2}\${data1}`,(err)=>{
//         console.log('Your file is written');
//       })
//   })
// });
// console.log('File will be read no matter what');

// const replaceIt=(temp,prod)=>{
//   let output=temp.replace(/{%PRODUCTNAME%}/g,prod.productName);
//   output=output.replace(/{%IMAGE%}/g,prod.image);
//   output=output.replace(/{%PRICE%}/g,prod.price);
//   output=output.replace(/{%FROM%}/g,prod.from);
//   output=output.replace(/{%NUTRIENTS%}/g,prod.nutrients);
//   output=output.replace(/{%QUANTITY%}/g,prod.quantity);
//   output=output.replace(/{%DESCRIPTION%}/g,prod.description);
//   output=output.replace(/{%ID%}/g,prod.id);

//   if (!prod.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');

//   return output;
// }

const data = fs.readFileSync('./dev-data/data.json', 'UTF-8');
const dataObj = JSON.parse(data);
const tempCard = fs.readFileSync('./templates/template-card.html', 'UTF-8');
const tempOver = fs.readFileSync('./templates/template-overview.html', 'UTF-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'UTF-8');

const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slug);
//Server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    let newCards = dataObj.map((el) => replaceIt(tempCard, el)).join('');
    const output = tempOver.replace('{%PRODUCT_CARDS%}', newCards);
    res.end(output);
  }

  //Product Page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    let Product = dataObj[query.id];
    let output = replaceIt(tempProduct, Product);
    res.end(output);
  }

  //Api
  else if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);
  }

  //Ending
  else {
    res.writeHead(404, {
      'content-type': 'text/HTML',
    });
    res.end('<h1>This page is not loaded ..</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Your server is listening on the port 8000');
});

// console.log("this is done");
