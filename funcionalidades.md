# funcionalidades.md - Especificação de Funcionalidades do Sistema

## 1. Alternador de Tema (Dark / Light Mode)
- **CSS Variables**: Transição harmônica entre Modo Escuro (`#1E1E28`, cards `#2A2A38`) e Modo Claro (`#EDEDED`, secundárias `#606085` e `#9B9E97`).
- **Persistência**: Gravação em `localStorage` da escolha do usuário com fallback para o sistema operacional (`prefers-color-scheme`).

## 2. Header Flutuante em Pill (DriveBerry)
- Menu em cápsula flutuante arredondada, centralizado no topo com desfoque de fundo (`backdrop-filter`).
- Navegação suave para as seções `#sobre`, `#projetos` e `#contato`.
- Destaque em tempo real do link correspondente à seção visível.
- Menu mobile responsivo em gaveta arredondada.

## 3. Micro-interações do Cursor (Immersive-G)
- Cursor interativo customizado em JavaScript e CSS com ponto focal e anel de rastreamento com interpolação suave (lerp).
- Reação ao passar sobre links, botões e cards de projetos (expansão magnética e blend mode).
- Otimizado para desativar automaticamente em dispositivos sensíveis ao toque (touch).

## 4. Galeria Completa dos 10 Projetos (DriveBerry / Immersive-G)
1. **Task List**: https://github.com/ClaraGrigolon/tasklist
2. **Slider**: https://github.com/ClaraGrigolon/slider-2a
3. **Clima**: https://github.com/ClaraGrigolon/clima-2a
4. **Locação**: https://github.com/ClaraGrigolon/locacao-2a
5. **Spyware Site**: https://github.com/ClaraGrigolon/Spyware-site
6. **Simulador Mega Sena**: https://github.com/ClaraGrigolon/Simulador-de-mega-sena
7. **Formulário de Inscrição**: https://github.com/ClaraGrigolon/Formulario-de-inscricao
8. **GLPI System**: https://github.com/ClaraGrigolon/GLPI
9. **GLPI Samsung**: https://github.com/ClaraGrigolon/GLPI-Samsung
10. **LoginX**: https://github.com/ClaraGrigolon/LoginX
- Efeitos: Micro-interação 3D (tilt no mousemove), iluminação de borda com a paleta `#CE2F2F` e `#F5BB8D`, tags tecnológicas e botão "Ver no GitHub".
- Botão "Ver perfil completo no GitHub" apontando para https://github.com/ClaraGrigolon.

## 5. Seção de Contato e Validação
- Formulário validado com checagem dinâmica e toast de sucesso.
- Dados diretos: E-mail (`29091@raphaeldisanto.com.br`) e WhatsApp (`(19) 99666-3917`).
