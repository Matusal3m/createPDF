Sistema que cria pdfs com barcodes e o nome dos respectivos itens.

Criei isso quando precisei criar vários códigos de barras e colocar em um Pdf para impressão. Tive uma preguiça muito grande de ir fazendo um por um então fiz isso pra só colocar o código, o nome e criar logo tudo de uma vez.

Faz um tempinho que mexi nele e tô enviando isso pro github depois de já ter criado tudo.

# Passos para poder usar o script:

1. Instale as dependências

```bash
npm install
```

2. Vá para o diretório data/csv e crie o arquivo csv que corresnponderá a lista que você quer.
Já tem alguns arquivos alí que podem servir como exemplo, mas o modelo precisar ser o seguinte:

```csv
code,itemName
1001, Item número um
1002, Item número dois
...
```

E por ai vai. Além disso, se utilizar o diretório csv, ele criará o pdf com o mesmo nome que o arquivo .csv, pode ser bom para sua organização.

3. Agora é so rodar o script.

```bash
node src/index.js
```

Os pdfs sairão no diretorio output e suas imagens serão salvas no diretório data/code-images, se essa opção for ativa dentro do código.

Para mais informações sobre o código em si, leia os códigos.