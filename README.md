
# CAD/CAM Software Marketplace

## Sobre o Projeto

Este é um marketplace especializado na venda de softwares CAD/CAM para profissionais e empresas de engenharia, design e manufatura. Nossa plataforma foi desenvolvida com o objetivo de centralizar o acesso a diversas soluções tecnológicas para o setor industrial, facilitando a aquisição, gestão e utilização de ferramentas essenciais para o desenvolvimento de projetos e manufatura.

A plataforma oferece uma experiência completa tanto para usuários finais quanto para administradores, com foco em usabilidade, segurança e escalabilidade.

### Principais Características

- **Catálogo Abrangente**: Oferecemos um extenso catálogo de softwares CAD/CAM de diversos fabricantes, categorizados para facilitar a busca e comparação.
- **Sistema de Usuários**: Implementamos um sistema robusto de autenticação e gerenciamento de usuários, garantindo segurança nas transações.
- **Painel Administrativo**: Disponibilizamos ferramentas completas para gestão de produtos, usuários e análise de métricas de vendas.
- **Integração com Sistemas de Pagamento**: Estamos desenvolvendo integração com múltiplas plataformas de pagamento para facilitar as transações (em implementação).

## Visão Detalhada da Plataforma

### 1. Arquitetura do Sistema

Nossa plataforma foi desenvolvida utilizando uma arquitetura moderna baseada em componentes, o que permite:

- **Escalabilidade**: Podemos adicionar novos recursos e expandir o sistema conforme necessário.
- **Manutenibilidade**: A estrutura modular facilita a manutenção e atualização do código.
- **Performance**: Utilizamos técnicas de otimização para garantir carregamento rápido e experiência fluida.

A arquitetura do sistema é composta por:

- **Frontend**: Interface de usuário desenvolvida com React e TypeScript.
- **Backend**: API e serviços baseados no Supabase para autenticação, banco de dados e armazenamento.
- **Banco de Dados**: Utilizamos PostgreSQL via Supabase para armazenamento estruturado e relacional dos dados.

### 2. Sistema de Catálogo de Produtos

O catálogo de softwares foi desenvolvido pensando na experiência do usuário, oferecendo:

#### 2.1 Categorização Inteligente

Os produtos são organizados em categorias que refletem os diferentes tipos de softwares:

- **CAD (Computer-Aided Design)**: Softwares para modelagem 2D e 3D, incluindo:
  - Modelagem paramétrica
  - Modelagem direta
  - Modelagem híbrida
  - Desenho técnico
  - Visualização e anotação

- **CAM (Computer-Aided Manufacturing)**: Softwares para programação de máquinas CNC, incluindo:
  - Fresamento 2.5-5 eixos
  - Torneamento
  - Eletro-erosão a fio
  - Fabricação aditiva
  - Simulação de usinagem

- **CNC (Computer Numerical Control)**: Softwares para controle de máquinas CNC, incluindo:
  - Controles de máquinas específicos
  - Simuladores de usinagem
  - Verificadores de código G

#### 2.2 Sistema de Busca e Filtros

Implementamos um sistema avançado de busca com múltiplos filtros:

- **Filtro por categoria**: Permite navegar entre as principais categorias de software.
- **Filtro por fabricante**: Possibilita visualizar produtos de fornecedores específicos.
- **Filtro por preço**: Facilita a busca por produtos dentro do orçamento desejado.
- **Filtro por características técnicas**: Permite comparar recursos específicos entre diferentes softwares.

#### 2.3 Páginas de Detalhes dos Produtos

Cada produto possui uma página detalhada contendo:

- **Descrição completa**: Informação detalhada sobre o software e suas capacidades.
- **Especificações técnicas**: Requisitos de sistema, compatibilidade e informações de versão.
- **Galeria de imagens**: Screenshots mostrando a interface e exemplos de uso.
- **Vídeos demonstrativos**: Tutoriais e demonstrações do software em ação.
- **Documentação técnica**: Manuais e guias de referência disponíveis para download.
- **Reviews e avaliações**: Feedback de outros usuários que adquiriram o produto.

### 3. Sistema de Usuários e Autenticação

Implementamos um sistema completo de gerenciamento de usuários utilizando o Supabase, que oferece:

#### 3.1 Autenticação Segura

- **Registro de usuários**: Processo simplificado de criação de conta com validação.
- **Login seguro**: Autenticação com email/senha com proteção contra ataques.
- **Recuperação de senha**: Sistema automatizado de redefinição de senha.

#### 3.2 Perfis de Usuário

Cada usuário possui um perfil completo que inclui:

- **Informações pessoais**: Nome, contato, empresa.
- **Histórico de compras**: Registro de todas as transações realizadas.
- **Licenças adquiridas**: Gerenciamento das licenças de software compradas.
- **Preferências**: Configurações personalizadas para a experiência na plataforma.

#### 3.3 Níveis de Acesso

O sistema implementa diferentes níveis de acesso:

- **Usuário padrão**: Acesso a compras e gerenciamento de seus próprios produtos.
- **Administrador**: Acesso completo ao painel administrativo e gestão da plataforma.

### 4. Sistema de Compras e Licenciamento

Desenvolvemos um sistema completo para aquisição e gerenciamento de licenças:

#### 4.1 Carrinho de Compras

- **Adição de múltiplos produtos**: Possibilidade de adquirir vários softwares em uma única transação.
- **Cálculo automático de impostos**: Implementação de cálculos de impostos conforme a região.
- **Cupons de desconto**: Suporte a promoções e descontos especiais.
- **Checkout simplificado**: Processo de finalização de compra otimizado.

#### 4.2 Sistemas de Licenciamento

Oferecemos suporte a diversos modelos de licenciamento:

- **Licenças perpétuas**: Acesso permanente ao software após a compra.
- **Assinaturas**: Modelos baseados em pagamentos recorrentes (mensal/anual).
- **Licenças flutuantes**: Compartilhamento de licenças em redes corporativas.
- **Licenças educacionais**: Opções especiais para instituições de ensino.

#### 4.3 Entrega Digital

O sistema gerencia a entrega dos produtos de forma digital:

- **Downloads seguros**: Links protegidos para download dos softwares.
- **Chaves de ativação**: Geração e entrega segura de licenças e chaves.
- **Atualizações**: Gestão de atualizações e novas versões disponíveis.

### 5. Painel Administrativo

O painel administrativo é uma ferramenta completa para gestão da plataforma:

#### 5.1 Dashboard Analítico

- **Métricas de vendas**: Visualização de dados de vendas em tempo real.
- **Análise de usuários**: Informações sobre aquisição e comportamento dos usuários.
- **Tendências de mercado**: Análise das categorias e produtos mais procurados.
- **Relatórios personalizados**: Geração de relatórios específicos conforme necessidade.

#### 5.2 Gestão de Produtos

- **Cadastro de produtos**: Interface intuitiva para adicionar novos softwares.
- **Edição em massa**: Capacidade de atualizar múltiplos produtos simultaneamente.
- **Gestão de categorias**: Organização e reorganização do catálogo.
- **Controle de estoque digital**: Monitoramento de licenças disponíveis.

#### 5.3 Gestão de Usuários

- **Visualização de usuários**: Lista completa com filtros e busca.
- **Edição de perfis**: Capacidade de modificar informações quando necessário.
- **Gestão de permissões**: Controle de níveis de acesso ao sistema.
- **Histórico de atividades**: Registro de ações realizadas pelos usuários.

#### 5.4 Configurações do Sistema

- **Personalização da plataforma**: Ajustes de aparência e comportamento.
- **Integração com serviços externos**: Configuração de APIs e serviços de terceiros.
- **Políticas de segurança**: Definição de regras de acesso e proteção.
- **Configurações de backup**: Programação de backups automáticos.

## Tecnologias Utilizadas

Nossa plataforma foi desenvolvida utilizando um stack moderno de tecnologias:

### Frontend

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Tailwind CSS**: Framework CSS utilitário para desenvolvimento rápido e consistente.
- **Shadcn UI**: Biblioteca de componentes UI para React baseada em Radix UI.
- **React Router**: Biblioteca de roteamento para aplicações React.
- **Tanstack Query**: Biblioteca para gerenciamento de estado assíncrono e caching.
- **Zod**: Biblioteca de validação de esquemas para TypeScript.
- **Lucide React**: Conjunto de ícones SVG para React.

### Backend

- **Supabase**: Plataforma de backend-as-a-service que inclui:
  - **Autenticação**: Sistema completo de autenticação e gerenciamento de sessões.
  - **Banco de Dados PostgreSQL**: Banco de dados relacional para armazenamento.
  - **Storage**: Sistema de armazenamento para arquivos e mídia.
  - **Functions**: Functions-as-a-service para lógica de backend.
  - **Realtime**: Subscrições em tempo real para dados.

### DevOps e Deployment

- **Git**: Sistema de controle de versão para gerenciamento de código.
- **Vite**: Build tool e bundler para desenvolvimento rápido.
- **npm**: Gerenciador de pacotes para dependências JavaScript.
- **ESLint**: Ferramenta de linting para manter qualidade de código.

## Estrutura do Projeto

A estrutura do projeto foi organizada de forma a facilitar a manutenção e escalabilidade:

```
/
├── public/               # Arquivos estáticos públicos
├── src/                  # Código-fonte da aplicação
│   ├── components/       # Componentes reutilizáveis
│   │   ├── cart/         # Componentes relacionados ao carrinho
│   │   ├── home/         # Componentes da página inicial
│   │   ├── layout/       # Componentes de layout (Header, Footer)
│   │   └── ui/           # Componentes de interface (Shadcn)
│   ├── context/          # Contextos React (Auth, Cart)
│   ├── hooks/            # Hooks personalizados
│   ├── integrations/     # Integrações com serviços externos
│   │   └── supabase/     # Cliente e tipos do Supabase
│   ├── lib/              # Bibliotecas e utilitários
│   ├── pages/            # Componentes de página
│   │   └── Admin/        # Páginas do painel administrativo
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Ponto de entrada da aplicação
├── supabase/             # Configurações do Supabase
├── README.md             # Documentação do projeto
└── ...                   # Arquivos de configuração (vite, tailwind, etc.)
```

## Como Acessar

A plataforma oferece diferentes fluxos de acesso conforme o tipo de usuário:

### Acesso para Usuários Comuns

Para acessar a plataforma como usuário regular:

1. Acesse a página inicial da aplicação.
2. Clique no botão "Entrar" localizado no menu superior direito.
3. Na página de autenticação, você pode:
   - Criar uma nova conta preenchendo o formulário de registro.
   - Fazer login com suas credenciais existentes (email e senha).
4. Após autenticado, você terá acesso a:
   - Catálogo completo de produtos com opções de compra.
   - Seu perfil de usuário para gerenciar informações pessoais.
   - Histórico de compras e licenças adquiridas.
   - Área de downloads para acessar os softwares comprados.

### Acesso Administrativo

Para acessar o painel administrativo:

1. Navegue até a página de login da aplicação clicando em "Entrar".
2. Na tela de login, selecione a aba "Administrador".
3. Clique no botão "Entrar como Administrador".

**Credenciais de Administrador**:
- Email: `admin@cadcamsoft.com.br`
- Senha: `admin123456`

Após autenticar-se como administrador, você será redirecionado para o painel administrativo, onde poderá:

- Visualizar estatísticas gerais da plataforma.
- Gerenciar o catálogo de produtos (adicionar, editar, remover).
- Acessar relatórios de vendas e atividades.
- Configurar integrações com serviços externos.
- Gerenciar usuários e permissões.

## Funcionalidades Detalhadas

### 1. Página Inicial

A página inicial foi projetada para proporcionar uma visão geral da plataforma e direcionar os usuários para as áreas de interesse:

- **Hero Banner**: Apresenta os destaques da plataforma e promoções atuais.
- **Categorias em Destaque**: Exibe as principais categorias de software disponíveis.
- **Produtos em Destaque**: Mostra os softwares mais populares ou em promoção.
- **Seção de Testemunhos**: Feedback de clientes satisfeitos com a plataforma.
- **Seção de Parceiros**: Exibe os principais fabricantes parceiros.
- **Call-to-Action**: Convida os usuários a explorar o catálogo ou registrar-se.

### 2. Catálogo de Softwares

O catálogo foi implementado com foco na experiência de busca e descoberta:

- **Layout Responsivo**: Adaptação automática a diferentes tamanhos de tela.
- **Cards de Produto**: Apresentação visual com informações essenciais.
- **Sistema de Filtros**: Filtros dinâmicos por categoria, preço e fabricante.
- **Paginação**: Carregamento otimizado para grandes volumes de produtos.
- **Ordenação**: Opções de ordenação por relevância, preço e novidades.
- **Visualização Rápida**: Preview dos detalhes sem sair da página de listagem.

### 3. Página de Detalhes do Produto

Cada produto possui uma página dedicada com informações completas:

- **Galeria de Imagens**: Carrossel de screenshots e imagens do software.
- **Descrição Detalhada**: Informações completas sobre recursos e funcionalidades.
- **Especificações Técnicas**: Requisitos de sistema e compatibilidade.
- **Opções de Licenciamento**: Diferentes modalidades disponíveis.
- **Recursos Relacionados**: Documentação, vídeos e material de apoio.
- **Produtos Similares**: Sugestões de alternativas ou complementos.
- **Botão de Compra**: Adição direta ao carrinho com seleção de licença.

### 4. Carrinho de Compras

O sistema de carrinho foi desenvolvido para proporcionar uma experiência de checkout fluida:

- **Resumo de Itens**: Lista clara dos produtos selecionados.
- **Ajuste de Quantidades**: Modificação das quantidades diretamente no carrinho.
- **Cálculo Automático**: Atualização instantânea de valores e descontos.
- **Persistência**: Salvamento automático do carrinho entre sessões.
- **Checkout Simplificado**: Processo otimizado com mínimo de etapas.
- **Opções de Pagamento**: Múltiplas formas de pagamento disponíveis.
- **Confirmação**: Resumo final antes da conclusão da compra.

### 5. Área do Usuário

Cada usuário possui uma área personalizada para gerenciar sua conta:

- **Dashboard**: Visão geral das atividades recentes e licenças.
- **Perfil**: Gerenciamento de informações pessoais e preferências.
- **Histórico de Compras**: Registro detalhado de todas as transações.
- **Licenças**: Visualização e gerenciamento de licenças adquiridas.
- **Downloads**: Acesso aos instaladores e arquivos relacionados.
- **Suporte**: Canal de comunicação para solicitação de assistência.
- **Preferências**: Configurações de notificações e comunicações.

### 6. Painel Administrativo

O painel administrativo oferece ferramentas completas para gestão da plataforma:

#### 6.1 Dashboard Administrativo

- **Métricas em Tempo Real**: Visualização de KPIs importantes.
- **Gráficos Interativos**: Representação visual de dados de vendas e usuários.
- **Alertas**: Notificações sobre eventos importantes no sistema.
- **Resumo Financeiro**: Visão consolidada de receitas e transações.

#### 6.2 Gestão de Produtos

- **Listagem Completa**: Visualização de todos os produtos cadastrados.
- **Formulário de Produto**: Interface intuitiva para adição e edição.
- **Upload de Imagens**: Sistema para gerenciamento de mídia dos produtos.
- **Controle de Versões**: Gerenciamento de diferentes versões de software.
- **Controle de Disponibilidade**: Ativação/desativação de produtos no catálogo.

#### 6.3 Gestão de Usuários

- **Listagem de Usuários**: Visualização de todos os usuários registrados.
- **Detalhes de Usuário**: Informações completas de perfil e atividades.
- **Edição de Permissões**: Controle de níveis de acesso ao sistema.
- **Log de Atividades**: Registro detalhado de ações realizadas.

#### 6.4 Relatórios

- **Relatórios de Vendas**: Análise detalhada de transações e receitas.
- **Relatórios de Usuários**: Informações sobre aquisição e comportamento.
- **Relatórios de Produtos**: Análise de desempenho e popularidade.
- **Exportação**: Opções para exportar dados em diferentes formatos.

#### 6.5 Configurações do Sistema

- **Configurações Gerais**: Ajustes básicos da plataforma.
- **Integrações**: Configuração de serviços externos (pagamentos, marketing).
- **Emails Automáticos**: Personalização de templates e triggers.
- **Segurança**: Configurações de políticas de acesso e proteção.

## Fluxos de Usuário

A plataforma foi projetada para oferecer fluxos intuitivos para diferentes cenários de uso:

### 1. Fluxo de Compra

1. **Descoberta**: O usuário navega pelo catálogo ou utiliza a busca.
2. **Análise**: Visualização da página de detalhes do produto.
3. **Decisão**: Seleção do tipo de licença e adição ao carrinho.
4. **Revisão**: Verificação dos itens no carrinho e ajustes se necessário.
5. **Checkout**: Preenchimento de informações de pagamento.
6. **Confirmação**: Recebimento de confirmação da compra.
7. **Entrega**: Acesso imediato às licenças e downloads.

### 2. Fluxo de Cadastro e Login

1. **Acesso**: O usuário acessa a página de autenticação.
2. **Registro**: Preenchimento do formulário com informações básicas.
3. **Verificação**: Confirmação do email para ativação da conta.
4. **Complemento**: Preenchimento opcional de informações adicionais de perfil.
5. **Acesso**: Utilização das credenciais para login no sistema.

### 3. Fluxo Administrativo

1. **Autenticação**: Login com credenciais administrativas.
2. **Navegação**: Acesso ao painel de controle com métricas.
3. **Gestão**: Utilização das ferramentas para administrar a plataforma.
4. **Análise**: Revisão de relatórios e métricas de desempenho.
5. **Configuração**: Ajustes e personalizações do sistema.

## Modelo de Dados

O sistema utiliza um modelo de dados relacional implementado no PostgreSQL via Supabase:

### Tabelas Principais

1. **products**: Armazena informações dos softwares disponíveis.
   - id: Identificador único (UUID)
   - name: Nome do produto
   - description: Descrição detalhada
   - price: Valor base do produto
   - category: Categoria principal (CAD/CAM/CNC)
   - manufacturer: Fabricante do software
   - image_url: URL da imagem principal
   - software_version: Versão atual do software
   - requirements: Requisitos técnicos
   - created_at: Data de criação do registro
   - updated_at: Data da última atualização

2. **profiles**: Informações complementares dos usuários.
   - id: Identificador único (UUID, referência a auth.users)
   - first_name: Nome do usuário
   - last_name: Sobrenome do usuário
   - company: Empresa (opcional)
   - phone: Telefone de contato (opcional)
   - role: Função do usuário no sistema
   - created_at: Data de criação do perfil
   - updated_at: Data da última atualização

3. **orders**: Registro das compras realizadas.
   - id: Identificador único (UUID)
   - user_id: Referência ao usuário comprador
   - total: Valor total da compra
   - payment_status: Status do pagamento
   - invoice_url: URL da fatura/nota fiscal
   - created_at: Data da compra
   - updated_at: Data da última atualização

4. **order_items**: Itens individuais de cada compra.
   - id: Identificador único (UUID)
   - order_id: Referência à ordem principal
   - product_id: Referência ao produto adquirido
   - quantity: Quantidade de licenças
   - price: Preço unitário no momento da compra
   - created_at: Data de registro

5. **licenses**: Licenças geradas para os produtos adquiridos.
   - id: Identificador único (UUID)
   - user_id: Referência ao usuário proprietário
   - product_id: Referência ao produto
   - license_key: Chave de licença gerada
   - is_active: Status de atividade da licença
   - expiry_date: Data de expiração (para assinaturas)
   - created_at: Data de geração da licença
   - updated_at: Data da última atualização

6. **downloads**: Registro de downloads disponíveis.
   - id: Identificador único (UUID)
   - product_id: Referência ao produto
   - file_url: URL do arquivo para download
   - access_count: Contador de acessos
   - created_at: Data de disponibilização
   - updated_at: Data da última atualização

### Relacionamentos

- Um **usuário** pode ter múltiplos **pedidos**.
- Um **pedido** contém múltiplos **itens de pedido**.
- Um **item de pedido** refere-se a um único **produto**.
- Um **usuário** pode ter múltiplas **licenças**.
- Um **produto** pode ter múltiplos **downloads** associados.

## Segurança e Performance

A plataforma foi desenvolvida com foco em segurança e performance:

### Segurança

- **Autenticação Segura**: Implementação de práticas modernas de autenticação via Supabase.
- **Proteção contra XSS e CSRF**: Medidas preventivas contra ataques comuns.
- **Row-Level Security**: Políticas de acesso a dados no nível do banco de dados.
- **Validação de Dados**: Verificação rigorosa de entradas de usuário.
- **HTTPS**: Toda comunicação é criptografada via SSL/TLS.
- **Sanitização de Inputs**: Prevenção contra injeção SQL e outros ataques.

### Performance

- **Code Splitting**: Carregamento sob demanda de componentes para reduzir o tempo inicial.
- **Lazy Loading**: Carregamento preguiçoso de imagens e recursos pesados.
- **Caching**: Utilização de estratégias de cache para recursos frequentes.
- **Otimização de Imagens**: Compressão e dimensionamento adequado.
- **Minificação**: Redução do tamanho de arquivos JavaScript e CSS.
- **Paginação**: Carregamento eficiente de grandes conjuntos de dados.

## Roadmap de Desenvolvimento

A plataforma está em constante evolução, com as seguintes melhorias planejadas:

### Curto Prazo (Próximos 3 meses)

- **Integração com Provedores de Pagamento**: Implementação de gateways como MercadoPago e PayPal.
- **Sistema de Avaliações**: Permitir que usuários avaliem produtos e compartilhem experiências.
- **Melhorias de UX/UI**: Refinamentos na interface baseados em feedback de usuários.
- **Sistema de Notificações**: Alertas em tempo real para usuários e administradores.

### Médio Prazo (6-12 meses)

- **Aplicativo Mobile**: Desenvolvimento de versão para dispositivos móveis.
- **Marketplace de Extensões**: Permitir que desenvolvedores ofereçam plugins e extensões.
- **Sistema de Afiliados**: Programa para parceiros divulgarem produtos com comissão.
- **Integração com CRMs**: Conectividade com sistemas de gestão de relacionamento com clientes.

### Longo Prazo (12+ meses)

- **Plataforma de Treinamento**: Cursos e tutoriais integrados para software CAD/CAM.
- **Comunidade de Usuários**: Fóruns e espaços de compartilhamento de conhecimento.
- **Marketplace Internacional**: Expansão para atendimento global com múltiplos idiomas.
- **Inteligência Artificial**: Recomendações personalizadas e suporte automatizado.

## Desenvolvimento

Para desenvolvedores que desejam contribuir ou executar o projeto localmente:

### Requisitos

- Node.js (versão 14.x ou superior)
- npm (versão 6.x ou superior)
- Git

### Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd cadcam-marketplace
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione as variáveis necessárias (consulte `.env.example`)

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse o projeto em seu navegador:
   O servidor de desenvolvimento será iniciado em `http://localhost:5173`.

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a versão de produção do projeto.
- `npm run preview`: Visualiza a versão de produção localmente.
- `npm run lint`: Executa a verificação de linting no código.
- `npm run test`: Executa os testes automatizados (quando implementados).

### Padrões de Código

O projeto segue práticas modernas de desenvolvimento:

- **Componentes Funcionais**: Utilização de React Hooks para gerenciamento de estado.
- **TypeScript**: Tipagem estática para maior segurança e autocompleção.
- **ESLint/Prettier**: Formatação consistente e detecção de problemas.
- **Atomic Design**: Organização de componentes seguindo princípios de design atômico.

## Contribuições

Contribuições para o projeto são bem-vindas. Para contribuir:

1. Faça um fork do repositório.
2. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Faça commit de suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para o branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Contato

Para dúvidas, sugestões ou suporte técnico:

- Email: contato@cadcamsoft.com.br
- Telefone: (11) 3456-7890
- Site: https://www.cadcamsoft.com.br

## Agradecimentos

Agradecemos a todos os desenvolvedores, designers e testadores que contribuíram para este projeto, bem como às tecnologias de código aberto que tornaram possível o desenvolvimento desta plataforma.

---

## Como Funciona o Cadastro e Login para Cada Tipo de Usuário

A plataforma conta com 3 tipos principais de usuário: **Administrador**, **Vendedor** e **Cliente Comum**. O fluxo de criação e habilitação de conta difere para cada perfil, garantindo segurança e controle apropriado. Veja abaixo como funciona o processo para cada tipo e o caminho correto para cadastro e uso:

### 1. Cadastro de Cliente

**Quem pode se cadastrar:** Qualquer pessoa interessada em adquirir licenças ou soluções da plataforma.

**Como funciona:**
- Acesse a página inicial e clique em **Entrar**.
- Escolha “Criar conta”.
- Preencha os dados solicitados (nome, e-mail, senha, telefone e endereço completo).
- Após criar a conta, você **receberá um código de verificação no e-mail cadastrado** (verifique também a pasta de spam).
- Acesse o painel/página de verificação, digite o código do e-mail para ativar sua conta.
- Só após essa verificação a conta é habilitada para compras.

**Obs:** A senha é armazenada de modo seguro (hash) e seu e-mail precisa ser único.

---

### 2. Cadastro de Vendedor

**Quem pode cadastrar:** Apenas administradores autenticados podem cadastrar novos vendedores.

**Como funciona:**
- Administrador faz login normalmente.
- No painel administrativo, acesse a seção de gerenciamento/cadastro de vendedores.
- Preencha os dados do novo vendedor: Nome da Loja, CNPJ, E-mail, Senha, Nome do Responsável.
- O vendedor será cadastrado e já pode acessar o sistema utilizando o e-mail/senha definidos.
- O e-mail precisa ser único e a senha é armazenada de modo seguro (hash).
- O perfil do vendedor é vinculado à tabela `vendedor_profiles` e recebe permissões adequadas.

**Obs:** Vendedores NÃO podem se cadastrar sozinhos, apenas pelo administrador.

---

### 3. Cadastro de Administrador

**Quem pode cadastrar:** Essa rota/função é protegida e requer um token especial para cadastro. Apenas para uso interno ou onboarding inicial manual.

**Como funciona:**
- O endpoint de cadastro de admin é protegido por um token secreto (`ADMIN_SIGNUP_TOKEN`), adicionado nas variáveis de ambiente.
- Para criar um novo admin, envie (via API ou painel apropriado) nome, e-mail e senha junto ao token especial no header de autorização.
- O e-mail precisa ser único.
- Recomenda-se restringir o uso desse cadastro a situações controladas.

**Acesso Rápido:**  
Após criado, o administrador pode usar as credenciais na tela de login escolhendo a opção “Entrar como Administrador”.

---

## Resumo dos Fluxos e Observações

- **Confirmação de e-mail:** Apenas para usuários do tipo Cliente, via código recebido após cadastro.
- **Admins e Vendedores:** Criados via painel/admin, sem necessidade de código de confirmação por padrão.
- **Senhas:** Sempre protegidas por hash seguro.
- **E-mails únicos:** O sistema não permite registro de e-mails duplicados.
- **Recuperação de Senha:** Opção disponível para clientes via tela de login.

---

## Passo a Passo para Cadastro

### **Cliente**
1. Acesse a página inicial > Entrar > Criar conta.
2. Preencha nome, e-mail, senha e dados de endereço.
3. Confirme o código enviado no e-mail.
4. Pronto! Conta ativa para compras/licenças.

### **Vendedor**
1. Administrador faz login.
2. No painel, abra a seção de gerenciamento/cadastro de vendedores.
3. Preencha dados da nova loja/vendedor.
4. Envie o cadastro; vendedor já poderá logar.

### **Administrador**
1. Executar endpoint protegido com token especial.
2. Informar nome, e-mail e senha.
3. Administrador recém-cadastrado pode acessar a área admin pelo painel.

---

## Dúvidas Frequentes

- **Como redefinir senha?** Opção disponível na tela de login.
- **Onde vejo minhas licenças e compras?** No painel/área do usuário autenticado, após login.
- **Como saber meu tipo de perfil?** O painel mostra de acordo com suas permissões (área admin, área vendedor ou usuário comum).

---

© 2025 AIA Digital Tools. Todos os direitos reservados.
