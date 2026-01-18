# Diagnóstico e Correção do Figma MCP

## Status Atual
- ✅ Porta 3845 está aberta e acessível
- ❌ Servidor retorna erro 400 (Bad Request)
- ❌ Nenhum recurso MCP disponível
- ❌ Figma Desktop não está rodando (verificado)

## Passos para Corrigir

### 1. Abrir Figma Desktop
1. Abra o aplicativo Figma Desktop
2. Faça login com sua conta Figma
3. Abra o arquivo do projeto:
   - URL: https://www.figma.com/design/FXiR2jaCHBmqoXUmIs5viA/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=42-3097

### 2. Ativar Dev Mode
1. No Figma Desktop, pressione `Shift + D`
2. Ou clique no ícone "Dev Mode" na barra superior
3. O painel lateral direito deve aparecer (Dev Mode ativo)

### 3. Habilitar MCP Server
1. No painel Dev Mode (lateral direita)
2. Com NADA selecionado, procure pela seção "MCP"
3. Clique em **"Enable MCP Server"** ou **"Enable desktop MCP server"**
4. O servidor deve iniciar e mostrar a URL: `http://127.0.0.1:3845/mcp`

### 4. Verificar Configuração no Cursor
O arquivo `mcp.json` já está configurado corretamente:
```json
{
  "mcpServers": {
    "Figma": {
      "url": "http://127.0.0.1:3845/mcp",
      "headers": {}
    }
  }
}
```

### 5. Reiniciar Cursor IDE
Após habilitar o MCP server no Figma:
1. Feche completamente o Cursor IDE
2. Reabra o Cursor IDE
3. Isso permite que o Cursor reconheça o servidor MCP

### 6. Testar Conexão
Após reiniciar, teste listando os recursos:
- Os recursos do Figma devem aparecer
- Variáveis, componentes, frames devem estar acessíveis

## Troubleshooting

### Erro 400 (Bad Request)
**Causa**: Servidor MCP não está habilitado no Figma ou Dev Mode não está ativo
**Solução**: 
1. Certifique-se de que o Dev Mode está ativo (`Shift + D`)
2. Habilite o MCP Server no painel Dev Mode
3. Verifique se o arquivo do projeto está aberto no Figma

### Nenhum recurso encontrado
**Causa**: Cursor não reconheceu o servidor MCP
**Solução**:
1. Reinicie o Cursor IDE completamente
2. Verifique se o Figma Desktop está rodando
3. Confirme que o MCP Server está habilitado no Figma

### Porta 3845 não acessível
**Causa**: Firewall bloqueando ou servidor não iniciado
**Solução**:
1. Verifique se o MCP Server está habilitado no Figma
2. Verifique configurações de firewall do Windows
3. Tente desabilitar e reabilitar o MCP Server no Figma

## Próximos Passos

1. **Siga os passos 1-3 acima** para habilitar o MCP no Figma
2. **Reinicie o Cursor IDE** após habilitar
3. **Avise quando estiver pronto** para testarmos novamente
