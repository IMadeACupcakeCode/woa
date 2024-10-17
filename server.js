const http = require('http');
const fs = require('fs');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();

// Configuração HTTPS
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Conexão com o banco de dados
const db = new sqlite3.Database('rpg.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados', err);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  } 
});

const server = http.createServer(options, (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/personagens') {
    db.all("SELECT * FROM personagens", (err, rows) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
    });
  } else if (req.method === 'POST' && parsedUrl.pathname === '/personagens') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { nome, origem, nivel } = JSON.parse(body);
      db.run("INSERT INTO personagens (nome, origem, nivel) VALUES (?, ?, ?)", [nome, origem, nivel], function(err) {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: this.lastID }));
      });
    });
  } else if (req.method === 'GET' && parsedUrl.pathname === '/poderes') {
    db.all("SELECT * FROM poderes", (err, rows) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
    });
  } else if (req.method === 'POST' && parsedUrl.pathname === '/poderes') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { tipo_poder, dano, raridade, personagem_id } = JSON.parse(body);
      db.run("INSERT INTO poderes (tipo_poder, dano, raridade, personagem_id) VALUES (?, ?, ?, ?)", 
        [tipo_poder, dano, raridade, personagem_id], function(err) {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: this.lastID }));
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
