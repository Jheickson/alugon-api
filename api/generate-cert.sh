#!/bin/bash

SSL_DIR="./ssl"

mkdir -p "$SSL_DIR"

# Comando corrigido para evitar conflito com caminhos do Windows
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout "$SSL_DIR/server.key" \
  -out "$SSL_DIR/server.cert" \
  -days 365 \
  -subj "//C=BR\ST=Estado\L=Cidade\O=MinhaEmpresa\OU=TI\CN=localhost"

echo "Certificados gerados em: $SSL_DIR/"