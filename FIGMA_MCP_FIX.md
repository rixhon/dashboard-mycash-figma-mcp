# Correção do Figma MCP - Passo a Passo

## ✅ Status Atual
- ✅ Porta 3845 está aberta
- ✅ Figma Desktop está rodando
- ✅ Arquivo mcp.json configurado corretamente
- ❌ Recursos MCP não estão disponíveis

## 🔧 Solução: Habilitar MCP Server no Figma

### Passo 1: Abrir o Arquivo no Figma Desktop
1. Abra o Figma Desktop (já está rodando ✅)
2. Abra o arquivo do projeto:
   ```
   https://www.figma.com/design/FXiR2jaCHBmqoXUmIs5viA/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=42-3097
   ```

### Passo 2: Ativar Dev Mode
1. No Figma Desktop, pressione **`Shift + D`**
2. Ou clique no ícone **"Dev Mode"** na barra superior
3. O painel lateral direito deve aparecer (indicando Dev Mode ativo)

### Passo 3: Habilitar MCP Server
1. No painel **Dev Mode** (lateral direita)
2. **IMPORTANTE**: Não selecione nenhum elemento (clique em área vazia)
3. Procure pela seção **"MCP"** ou **"MCP Server"**
4. Clique em **"Enable MCP Server"** ou **"Enable desktop MCP server"**
5. O servidor deve iniciar e mostrar a URL: `http://127.0.0.1:3845/mcp`

### Passo 4: Reiniciar Cursor IDE
**CRÍTICO**: Após habilitar o MCP Server no Figma:
1. Feche **completamente** o Cursor IDE
2. Reabra o Cursor IDE
3. Isso permite que o Cursor reconheça o servidor MCP recém-habilitado

### Passo 5: Verificar Conexão
Após reiniciar o Cursor, os recursos MCP devem estar disponíveis.

## 🔍 Verificação Visual no Figma

Quando o MCP Server estiver habilitado corretamente:
- ✅ No painel Dev Mode, você verá "MCP Server: Enabled" ou similar
- ✅ A URL `http://127.0.0.1:3845/mcp` deve estar visível
- ✅ Pode haver um indicador verde ou status "Active"

## ⚠️ Problemas Comuns

### "Não vejo a opção MCP no Dev Mode"
**Solução**:
- Certifique-se de que **nada está selecionado** (clique em área vazia)
- Verifique se está usando a versão mais recente do Figma Desktop
- Tente fechar e reabrir o Dev Mode (`Shift + D` duas vezes)

### "MCP Server não inicia"
**Solução**:
- Feche e reabra o Figma Desktop
- Verifique se a porta 3845 não está sendo usada por outro processo
- Tente desabilitar e reabilitar o MCP Server

### "Cursor não reconhece o servidor após reiniciar"
**Solução**:
- Verifique se o arquivo `mcp.json` está no local correto: `C:\Users\Michel\.cursor\mcp.json`
- Confirme que a URL está correta: `http://127.0.0.1:3845/mcp`
- Tente reiniciar o Cursor novamente

## 📝 Checklist Final

Antes de testar novamente, confirme:
- [ ] Figma Desktop está rodando
- [ ] Arquivo do projeto está aberto no Figma
- [ ] Dev Mode está ativo (`Shift + D`)
- [ ] Nada está selecionado no Figma
- [ ] MCP Server está habilitado no painel Dev Mode
- [ ] Cursor IDE foi reiniciado após habilitar o MCP

## 🎯 Próximo Passo

Após seguir todos os passos acima:
1. Avise quando tiver habilitado o MCP Server no Figma
2. Avise quando tiver reiniciado o Cursor
3. Testaremos novamente a conexão
