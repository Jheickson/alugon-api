# API do sistema AlugON

Esta API foi desenvolvida com Node.js, Express e MySQL para espaços de alugaveis

link do frontend: https://github.com/correaisaac/alugon-app

## Objetivo

Aqui ficara a API que fara a conexão do FrontEnd com o BackEnd

## Como executar a API

### Configuração do HTTPS Local

Siga os passos abaixo para executar a API com HTTPS em ambiente de desenvolvimento:

### 1. Use o git clone para clonar o projeto

```bash
git clone https://github.com/correaisaac/alugon-api.git
```

### 2. Abra o diretorio api
```bash
cd api
```

### 3. Gerar Certificados SSL Autoassinados
Execute o script para criar os certificados necessários:

```bash
# Use o git bash para executar os proximos comandos

# Navegue até a pasta /api
cd api

# Dê permissão de execução ao script (Linux/macOS)
chmod +x generate-cert.sh

# Execute o script (funciona no Git Bash do Windows também)
./generate-cert.sh
```

Isso criará a pasta `ssl/` com os arquivos:
- `server.key` (chave privada)
- `server.cert` (certificado)

*Nota: Em produção, use certificados de uma autoridade confiável (ex: Let's Encrypt).*

---

### 4. Instalar Dependências
```bash
npm install
```

---

### 5. Iniciar o Servidor HTTPS
```bash
npm run dev
```

A API estará acessível em:  
**URL Base:** https://localhost:3333  
**Documentação Swagger:** https://localhost:3333/api-docs

---

### ⚠️ Aviso de Certificado Autoassinado
Seu navegador ou cliente HTTP (ex: Postman) exibirá um aviso de segurança.  
Para prosseguir em **localhost**:
- **Chrome/Firefox**: Clique em "Avançado" > "Continuar para o site".
- **Postman**: Desative a verificação SSL em `Settings > SSL/TLS > OFF`.

---

### 🛠️ Script generate-cert.sh (Para Referência)
```bash
#!/bin/bash

SSL_DIR="./ssl"

mkdir -p $SSL_DIR

openssl req -nodes -new -x509 -keyout "$SSL_DIR/server.key" -out "$SSL_DIR/server.cert" -days 365 \
  -subj "/C=BR/ST=Estado/L=Cidade/O=MinhaEmpresa/OU=TI/CN=localhost"

echo "Certificados gerados em: $SSL_DIR/"
```

