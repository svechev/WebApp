const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const argon2 = require('argon2');

const { generateCaptcha, verifyCaptcha } = require('./helpers/captcha.js');
const { createUser } = require('./helpers/db_queries.js');

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

    // handle captcha generation request
    else if (req.method === 'POST' && pathname === '/api/captcha') { 
        const captcha = generateCaptcha(); 
        res.writeHead(200, { 'Content-Type': 'application/json'}); 
        res.end(JSON.stringify(captcha)); 
        return; 
    }

    // handle user register request
    else if (req.method === 'POST' && pathname === '/api/register') {
        let rawBody = '';

        for await (const chunk of req) {
            rawBody += chunk;
        }

        try {
            body = JSON.parse(rawBody);
        } catch {
            console.log("json issue");
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ error: 'Invalid JSON.' }));
            return;
        }

        const { username, email, password, captchaAnswer, captchaChallengeId } = body;
        
        // verify captcha first 
        if (!verifyCaptcha(captchaChallengeId, captchaAnswer) ) { 
            console.log("captcha failed");
            res.writeHead(400, { 'Content-Type': 'application/json' }); 
            res.end(JSON.stringify({ error: 'Invalid CAPTCHA.' })); 
            return; 
        }

        const emailFormat = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordFormat = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9]+$/;
        // check the data again
        if ( username.length < 3 || username.length > 32 || 
            !emailFormat.test(email) || 
            password.length < 8 || !passwordFormat.test(password) ) { 
                console.log("somehow wrong data");
                res.writeHead(400, { 'Content-Type': 'application/json' }); 
                res.end(JSON.stringify({ error: 'incorrect data.' })); 
                return; 
        }

        const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

        try {
            await createUser({ username: username, email: email, password_hash: passwordHash });
            res.writeHead(201, { 'Content-Type': 'application/json' }); 
            res.end(JSON.stringify({ message: 'Registration success!' }));
            return;
        }
        catch (error) {
            console.log("Error with db");
            if (error.code === 'ER_DUP_ENTRY') {
                res.writeHead(400, { 'Content-Type': 'application/json' }); 
                res.end(JSON.stringify({ message: 'Duplicate data!' }));
            }
            else {
                console.log("error code: " + error.code);
                res.writeHead(400, { 'Content-Type': 'application/json' }); 
                res.end(JSON.stringify({ message: 'Registration error!' }));
            }
        }
    }

    else {
        console.log("just didn't enter");
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});