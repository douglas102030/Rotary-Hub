#!/bin/bash

# Script de inicialização para o Rotary Club HUB Projects - macOS
# Este script configura e inicia o ambiente de desenvolvimento

echo "🚀 Iniciando o Rotary Club HUB Projects..."
echo "================================================"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Este não é o diretório do projeto. Por favor, execute este script no diretório raiz do projeto."
    exit 1
fi

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Erro: Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Erro: npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm detectados"

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependências instaladas com sucesso!"
    else
        echo "❌ Erro ao instalar dependências"
        exit 1
    fi
else
    echo "✅ Dependências já instaladas"
fi

# Verificar se o banco de dados existe
if [ ! -f "local.db" ]; then
    echo "💾 Criando banco de dados local..."
    # O banco será criado automaticamente na primeira execução
    echo "✅ Banco de dados pronto"
fi

echo "🚀 Iniciando servidor de desenvolvimento..."
echo "Acesse: http://localhost:3000"

# Iniciar o servidor Next.js
npm run dev