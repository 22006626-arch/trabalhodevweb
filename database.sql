CREATE TABLE IF NOT EXISTS gemeos_salvos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    detalhes TEXT,
    data_descoberta TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
