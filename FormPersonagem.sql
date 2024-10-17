-- Criar tabela de personagens
CREATE TABLE IF NOT EXISTS personagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    origem TEXT NOT NULL,
    nivel INTEGER NOT NULL
);

-- Criar tabela de poderes
CREATE TABLE IF NOT EXISTS poderes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_poder TEXT NOT NULL,
    dano INTEGER NOT NULL,
    raridade TEXT NOT NULL,
    personagem_id INTEGER,
    FOREIGN KEY(personagem_id) REFERENCES personagens(id)
);

-- Inserir dados de exemplo para personagens
INSERT INTO personagens (nome, origem, nivel) VALUES 
('Aragorn', 'Gondor', 10),
('Gandalf', 'Valinor', 20),
('Legolas', 'Floresta das Trevas', 15),
('Frodo', 'Condado', 5),
('Gimli', 'Erebor', 12);

-- Inserir dados de exemplo para poderes
INSERT INTO poderes (tipo_poder, dano, raridade, personagem_id) VALUES 
('Espada Longa', 10, 'Comum', 1),
('Magia de Fogo', 30, 'Raro', 2),
('Arco Élfico', 15, 'Incomum', 3),
('Anel do Poder', 5, 'Lendário', 4),
('Machado de Batalha', 20, 'Incomum', 5),
('Cura', 0, 'Raro', 2),
('Furtividade', 0, 'Comum', 4),
('Visão Élfica', 0, 'Incomum', 3);

-- Criar índices para melhorar o desempenho das consultas
CREATE INDEX idx_personagens_nome ON personagens(nome);
CREATE INDEX idx_poderes_tipo ON poderes(tipo_poder);
CREATE INDEX idx_poderes_personagem ON poderes(personagem_id);

-- Visualizar dados inseridos
SELECT 'Personagens:' AS '';
SELECT * FROM personagens;

SELECT 'Poderes:' AS '';
SELECT * FROM poderes;

-- Exemplo de consulta para listar personagens com seus poderes
SELECT 'Personagens e seus poderes:' AS '';
SELECT p.nome, p.origem, p.nivel, GROUP_CONCAT(po.tipo_poder, ', ') AS poderes
FROM personagens p
LEFT JOIN poderes po ON p.id = po.personagem_id
GROUP BY p.id;