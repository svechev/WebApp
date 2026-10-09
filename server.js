const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const PORT = 8000;
const pages = { 
    '/register': 'register.html', 
    '/login': 'login.html', 
    '/home': 'home.html', 
    '/edit': 'edit.html' 
};
const contentTypes = { 
    '.css': 'text/css', 
    '.js': 'text/javascript'
}


const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const fileExtension = path.extname(pathname);
    console.log("pathname requested: " + pathname);

    // handle browser request for html page
    if (req.method === 'GET' && pages[pathname]) { 
        const filePath = pages[pathname];
        fs.readFile(filePath, (err, data) => { 
            if (err) { 
                res.writeHead(500, { 'Content-Type': 'text/plain' }); 
                res.end('Internal Server Error'); 
                return; 
            } 
            
            res.writeHead(200, { 'Content-Type': 'text/html' }); 
            res.end(data); });
            return; 
        }

    // handle requests for CSS styles and js scripts
    else if (req.method === 'GET' && contentTypes[fileExtension]) { 
        const contentType = contentTypes[fileExtension]; 
        fs.readFile(pathname.slice(1), (err, data) => { 
            if (err) { 
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found'); 
                return; 
            } 
            res.writeHead(200, { 'Content-Type': contentType }); 
            res.end(data); }); 
            return; 
        }

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});