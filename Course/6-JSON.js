let fs = require('fs');
const http = require('http');
const url = require('url');


const html = fs.readFileSync('../Template/index.html', 'utf-8')
let products = JSON.parse(fs.readFileSync("../Data/products.json", 'utf-8'));
let productslist = fs.readFileSync('../Template/products-list.html', 'utf-8');
let productsdetail = fs.readFileSync('../Template/products-details.html', 'utf-8');


function replaceHtml(template, product) {
     let output = template.replace('{{%IMAGE%}}', product.productImage);
     output = output.replace('{{%NAME%}}', product.name);
     output = output.replace('{{%MODELNAME%}}', product.modeName);
     output = output.replace('{{%MODELNUMBER%}}', product.modelNumber);
     output = output.replace('{{%SIZE%}}', product.size);
     output = output.replace('{{%CAMERA%}}', product.camera);
     output = output.replace('{{%PRICE%}}', product.price);
     output = output.replace('{{%COLOR%}}', product.color);
     output = output.replace('{{%ID%}}', product.id);
     output = output.replace('{{%ROM%}}', product.ROM);
     output = output.replace('{{%desc%}}', product.Description);

     return output;
}
















// createing a simple web server routes
const server = http.createServer((request, response) => {
     let { query, pathname: path } = url.parse(request.url, true)
     //     console.log(x)
     // let path = request.url;
     if (path === '/' || path.toLocaleLowerCase() === '/home') {
          response.writeHead(200, {
               'Content-Type': 'text/html',
               'my-header': 'hello  world!'
          })
          response.end(html.replace('{{%CONTENT%}}', 'You are in Home Page'))
     }
     else if (path.toLocaleLowerCase() === "/about") {
          response.writeHead(200, {
               'Content-Type': 'text/html',
               'my-header': 'hello  world!'
          })
          response.end(html.replace('{{%CONTENT%}}', 'You are in About Page'))
     }
     else if (path.toLocaleLowerCase() === "/contact") {
          response.writeHead(200, {
               'Content-Type': 'text/html',
               'my-header': 'hello  world!'
          })
          response.end(html.replace('{{%CONTENT%}}', 'You are in Contact Page'))
     }
     // working the json file
     else if (path.toLocaleLowerCase() === '/products') {
          if (!query.id) {
               let productsHtmlArray = products.map((prod)=>{
                    return replaceHtml(productslist, prod);
               })
               let productsResponseHtml = html.replace('{{%CONTENT%}}', productsHtmlArray.join(','));
               response.writeHead(200, { 'Content-Type': 'text/html' });
               response.end(productsResponseHtml);
          } else {
               let product_id = products[query.id]
               let productDetailResponseHtml= replaceHtml(productsdetail, product_id);
               response.end(html.replace('{{%CONTENT%}}', productDetailResponseHtml));
          }
     }
     else {
          response.writeHead(404, {
               'Content-Type': 'text/html',
               'my-header': 'hello  world!'
          })
          response.end(html.replace('{{%CONTENT%}}', 'Error 404: Page not found!'))
     }
});



// start a web server
server.listen(8000, '127.0.0.1', () => {
     console.log("The server is running on the server")
})




