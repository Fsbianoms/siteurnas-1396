# Mapa eleitoral 2026 — Design

Site web de consulta das 643 seções selecionadas. Plano e visual aprovados: painel simples, claro, verde, tabela e mapa por município. Sem login, sem coleta adicional e sem novas análises.

## Identidade
- Fundo #f6f8f5; superfícies brancas; tinta #1e322b; verde principal #174e42; verde claro #eaf2ed; borda #dde5df.
- Acento âmbar #a87526 identifica a minoria de casos com Lula até 5 votos, sem representar um partido.
- Poppins para títulos e corpo; números tabulares; títulos sem excesso de peso. Fontes locais em public/fonts.
- Cabeçalho compacto, margem 32px, largura máxima 1500px. Linhas divisórias, poucos cartões, raio 12px nas superfícies principais.

## Página
- /: cabeçalho com marca, Explorar, Sobre os dados e baixar XLSX; título e 4 números de cobertura; barra de busca e filtros.
- Área principal: mapa à esquerda, detalhe da seção à direita; tabela paginada abaixo. No celular, elementos empilhados.
- Pontos mostram municípios (não endereço da urna). Clicar no município filtra suas seções. Clicar na linha da tabela abre comparação no painel.
- Detalhe: códigos completos, comparação de Lula e Flavio, votos de todos os candidatos 1T, brancos/nulos e links TSE por turno.
- Links oficiais explicitam TOTAL DA ZONA. Nenhum link promete resultado individual da seção.
- Modal de metodologia explicita recorte de 643 seções, critério original 2T, limitações e fontes cartográficas.
- Verde indica Flavio com até 5 votos no 2T; âmbar, Lula com até 5. Sem linguagem de fraude.

## Arquitetura
- Web React + Leaflet. Dados imutáveis preservados da última planilha.
- API oRPC election.list retorna as 643 seções e catálogo de candidatos. Sem novas tabelas no banco.
- Hook em queries/election.ts; componentes em web/components/election; página composição em pages/index.tsx.
- Dataset tipado gerado em api/data/elections.ts, com coordenadas municipais casadas por UF e nome normalizado; nenhuma coordenada inventada.
- XLSX e fontes em packages/web/public. Mapa-base OpenStreetMap com atribuição; coordenadas de kelvins/municipios-brasileiros. CARTO foi descartado porque os mosaicos exibiam exigência de chave; OpenStreetMap foi verificado visualmente.

## Verificação
Build, lint e navegação em navegador: filtros, tabela, seleções, popup, links de ambos turnos, download, responsividade e integridade das 643 chaves/votos.