# Destalhes do desenvolvimento

## Organização e execução
O sistema foi dsesenvolvimento com os requisitos primários em mente, sem adicionar muito conteúdo adicional na plataforma.

### Front end
A estrutura do front end foi dividida em controllers, services e views para encapsular o acesso à API e facilitar o desenvolvimento escalável.
Para facilitar a reutilização de módulos foi criada uma pasta para conter componentes menores e uma pasta para layouts que possam ser reaproveitados em diversas páginas do sistema.

O formulário de envio foi pensado para que pudesse ser usado sem a necessidade de upload de PDF, tornando isso um aspecto opcional. Caso haja envio do arquivo, no entanto, ele é enviado junto do formulário para ser salvo num vokume do back end do sistema a fim de ser visualizado posteriormente.
A listagem de currículos cadastrados tem uma interface simples e um link fácil para o PDF enviado, caso tenha sido enviado.
Todas as operações são realizadas a partir de chamadas de API, isolando completamente a interface das operações.

### Back end e banco de dados
O backend possui uma estrutura com controllers e services separados do roteamento, tornando cada parte individualmente escalável.
Uma atenção maior foi dada ao registro de arquivos recebidos e lidos a partir da API para evitar download de arquivos indevidos ou fora da pasta "storage".

O banco de dados foi preenchido com auxílio do Prisma, que criou as tabelas a partir do arquivo [schema.prisma](backend\prisma\schema.prisma). Novas migrations também podem ser realizadas, facilitando a estruturação das tabelas.
O acesso aos dados ocorre por meio do Prisma ORM, que evita casos comuns de injeção SQL e facilita o tratamento e consulta de dados no back end.


## Assistência de IA no desenvolvimento
O uso de LLMs foi utilizado para:
- Estrutura inicial do projeto, minimizando tempo de instalação de ferramentas e bibliotecas manualmente.
- Estilização do sistema, pois é a parte que mais demandaria tempo para desenvolver.
- Atividades repetitivas: autocomplete foi utilizado para criar loops, alterar variáveis, corrigir imports, etc.
- Criação dos testes via Jest: outro ponto que poderia levar algum tempo de desenvolvimento e foi simplificado com uso de IA.

Nem todas as sugestões de IA foram inteiramente úteis, algumas tendo que ser descartadas por incluírem práticas ruins de modelagem ou gerarem conflitos.

### LLMs utilizados:
- GPT, a partir do Codex: para geração de estrutura e estilização.
- Copilot: para autocomplete e sugestões de código.

## Tempo aproximado de desenvolvimento
O tempo de desenvolvimento não foi contado por tempo corrido, mas estima-se que levou cerca de 5 horas incluindo revisões e escrita do [README](README.md) e [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md).

## Melhorias para o sistema
Como descrito anteriormente, o sistema possui somente e estritamente o que foi solicitado pelo cliente. Posteriormente, seria possível incluir:

- Filtro de currículos por palavras-chave ou por cargo;
- Adição de extratores de conteúdo do PDF a partir de IA para um retorno mais eficiente;
- Reformulação da estilização para o formato da empresa;
- Opção de exclusão e edição dos currículos disponível para o usuário;
- Paginação das consultas;
- Agregação de currículos enviados por um usuário diversas vezes (consulta a partir de e-mail, por exemplo);
- Marca de "Currículo visto" para facilitar o gerenciamento dos cadastros;