# Configuração do Figma MCP — Guia Completo

## 📋 Status Atual

✅ **Configuração atualizada** no `mcp.json`:
- Servidor Desktop: `http://127.0.0.1:3845/mcp` (prioritário)
- Servidor Remoto: `https://mcp.figma.com/mcp` (backup)

❌ **Recursos ainda não disponíveis** - Requer configuração adicional

---

## 🚀 Passo a Passo para Configurar MCP Desktop

### 1. Instalar Figma Desktop App
- Se ainda não tiver: https://www.figma.com/downloads/
- Instalar e fazer login com sua conta Figma

### 2. Abrir o Arquivo do Projeto
- Abra o Figma Desktop
- Acesse: https://www.figma.com/design/FXiR2jaCHBmqoXUmIs5viA/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=42-3096
- Ou abra o arquivo diretamente no app

### 3. Ativar Dev Mode
- **Atalho**: Pressione `Shift+D` no Figma Desktop
- **Ou**: Clique no ícone "Dev Mode" no topo da interface
- O Dev Mode deve estar ativo (barra lateral direita aparece)

### 4. Habilitar MCP Server Desktop
- No Dev Mode, procure pela seção "MCP" ou "MCP Server"
- Clique em **"Enable desktop MCP server"** ou similar
- O servidor deve iniciar na porta `3845`

### 5. Verificar se o Servidor Está Rodando
- O servidor deve estar ativo em `http://127.0.0.1:3845/mcp`
- Você pode verificar no terminal ou nas configurações do Figma

### 6. Reiniciar o Cursor
- Após habilitar o MCP server no Figma, **reinicie o Cursor IDE**
- Isso permite que o Cursor reconheça o novo servidor MCP

### 7. Verificar Recursos
- Após reiniciar, os recursos do Figma devem aparecer
- Teste acessando variáveis, componentes, etc.

---

## 🔧 Configuração Alternativa: MCP Remoto

Se o MCP Desktop não funcionar, tente o servidor remoto:

### Requisitos:
- Conta Figma com plano **Professional**, **Organization** ou **Enterprise**
- Seat tipo **"Dev"** ou **"Full"** (não "View" ou "Collab")

### Configuração:
1. Verifique seu plano Figma em: https://www.figma.com/settings
2. Se tiver plano adequado, o servidor remoto deve funcionar automaticamente
3. Pode ser necessário autenticação adicional

---

## ✅ Verificação de Sucesso

Após configurar, você deve conseguir:
- ✅ Listar recursos MCP do Figma
- ✅ Acessar variáveis do design system
- ✅ Ver componentes e frames
- ✅ Obter tokens de cor, espaçamento, tipografia

---

## 🐛 Troubleshooting

### Problema: "No MCP resources found"
**Soluções:**
1. Verifique se o Figma Desktop está rodando
2. Confirme que o Dev Mode está ativo (`Shift+D`)
3. Verifique se o MCP server está habilitado no Dev Mode
4. Reinicie o Cursor IDE
5. Verifique se a porta 3845 não está bloqueada pelo firewall

### Problema: Servidor não inicia
**Soluções:**
1. Feche e reabra o Figma Desktop
2. Tente desabilitar e reabilitar o MCP server
3. Verifique se há atualizações do Figma Desktop
4. Consulte a documentação oficial: https://developers.figma.com/docs/figma-mcp-server/

### Problema: Acesso negado no servidor remoto
**Soluções:**
1. Verifique seu plano Figma
2. Confirme que você tem permissões adequadas
3. Tente usar o servidor Desktop ao invés do remoto

---

## 📚 Links Úteis

- Documentação oficial: https://developers.figma.com/docs/figma-mcp-server/
- Guia de instalação: https://developers.figma.com/docs/figma-mcp-server/local-server-installation/
- Guia do servidor remoto: https://help.figma.com/hc/en-us/articles/35281350665623

---

## 🎯 Próximos Passos

1. **Siga os passos acima** para configurar o MCP Desktop
2. **Reinicie o Cursor** após habilitar o servidor
3. **Teste novamente** listando os recursos MCP
4. **Avise quando estiver pronto** para continuarmos com o PROMPT 1

---

**Nota**: Se preferir, podemos continuar sem o MCP do Figma usando a descrição do design que você já forneceu. O MCP é útil mas não é obrigatório para a implementação.
