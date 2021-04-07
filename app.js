const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const port = 3000;
let reqURL;

app.use(express.text());

app.use((req, res, next) => {
    reqURL = req.originalUrl;
    next();
});

app.get('/', (req, res) => {
    res.send("aqui não");
})

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '/favicon.ico'));
});

app.get('*', (req, res) => {
    let fullPath = `.${reqURL}`;
    const fileContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                        * {
                            border: 0;
                            margin: 0;
                            padding: 0;
                            height: 100%;
                        }
                    </style>
                </head>
                <body>
                    <textarea style="width: 100%; resize:none; box-sizing: border-box;"></textarea>
                    <script>
                        let text = document.getElementsByTagName('textarea')[0];

                        text.addEventListener('change', () => {
                        fetch(window.location.href, {method: 'POST', body: text.value})
                            .then(console.log('ola mundo'));
                        });
                    </script>
                </body>
                </html>
                `
    if(!fs.existsSync(fullPath)){
        fs.mkdir(fullPath, err => {
            if(err){ 
                throw err;
            } else {
                
                fs.appendFile(`${fullPath}/index.html`, fileContent, err => {
                    if (err) throw err;
                    res.sendFile(path.join(__dirname + `${reqURL}/index.html`));
                });
                
            }
        });
    } else {
        if(!fs.existsSync(`${fullPath}/index.html`)){
            fs.appendFile(`${fullPath}/index.html`, fileContent, err => {
                if (err) throw err;
                res.sendFile(path.join(__dirname + `${reqURL}/index.html`));
            });
        }
        res.sendFile(path.join(__dirname + `${reqURL}/index.html`));
    }
});


app.post('*', (req, res) => {
    let fullPath = `.${reqURL}/index.html`;
    const fileContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            * {
                border: 0;
                margin: 0;
                padding: 0;
                height: 100%;
            }

            textarea {
                display: flex;
                flex-direction: column; 
            }
        </style>
    </head>
    <body>
        <textarea style="width: 100%; height: 100vh; resize:none; box-sizing: border-box">${req.body}</textarea>
        <script>
                        let text = document.getElementsByTagName('textarea')[0];

                        text.addEventListener('change', () => {
                        fetch(window.location.href, {method: 'POST', body: text.value})
                            .then(console.log('ola mundo'));
                        });
        </script>
    </body>
    </html>
    `
    fs.writeFile(fullPath, fileContent, err => {
        if (err) throw err;
        res.status(201).send();
    });
    
});

app.listen(port, () => {
    console.log("app listening at port " + port);
});