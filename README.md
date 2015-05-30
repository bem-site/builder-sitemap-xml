# builder-sitemap-xml
Plugin for bs-builder system which creates sitemap.xml file

[![NPM version](http://img.shields.io/npm/v/bs-builder-sitemap-xml.svg?style=flat)](http://www.npmjs.org/package/bs-builder-sitemap-xml)
[![Coveralls branch](https://img.shields.io/coveralls/bem-site/builder-sitemap-xml/master.svg)](https://coveralls.io/r/bem-site/builder-sitemap-xml?branch=master)
[![Travis](https://img.shields.io/travis/bem-site/builder-sitemap-xml.svg)](https://travis-ci.org/bem-site/builder-sitemap-xml)
[![David](https://img.shields.io/david/bem-site/builder-sitemap-xml.svg)](https://david-dm.org/bem-site/builder-sitemap-xml)
[![David](https://img.shields.io/david/dev/bem-site/builder-sitemap-xml.svg)](https://david-dm.org/bem-site/builder-sitemap-xml#info=devDependencies)

Плагин для [bs-builder](https://www.npmjs.com/package/bs-builder-core) предназначенный для генерации файла sitemap.xml.

![GitHub Logo](./logo.png)

## Установка

Пакет устанавливается как обычная npm зависимость
```
$ npm install --save bs-builder-sitemap-xml
```

## Пример использования

Данный плагин необходимо подключать в конец очереди заданий для сборки, после того как
все страницы сайта будут сгенерированы и добавлены в модель. В противном случае
часть страниц не попадет в итоговый sitemap.xml файл и не будет проиндексирована поисковыми роботами.

```
var Builder = require('bs-builder-core').Builder
    coreTasks = require('bs-builder-core').tasks,
    SitemapXmlTask = require('bs-sitemap-xml').tasks.BuildSitemapXML,

    dataPath = './data',
    cachePath = './.builder/cache',
    builder;

builder = Builder.init('debug')
    .addTask(coreTasks.MakeDirectory, { path: cachePath })
    .addTask(coreTasks.MakeDirectory, { path: dataPath })
    .addTask(coreTasks.LoadModelFiles)
    .addTask(coreTasks.MergeModels)
    .addTask(coreTasks.SaveModelFile)
    .addTask(coreTasks.AnalyzeModel)
    ...
    ...
    // подключение задачи сборки для построения файла sitemap.xml
    .addTask(SitemapXmlTask, { hosts: { en: 'http://my.site.en' }}
    //
    .addTask(tasks.SaveDataFile);

builder.run();
```

Параметрами является объект с полем `hosts`. Данный объект в свою очередь представляет собой
конфигурацию хостов сайта для различных локалей, например:
```
{
    en: 'http://my.site.en', // для английского языка
    fr: 'http://my.site.fr', // для французского языка
    de: 'http://my.site.de' // для немецкого языка
    ...
}
```

#### Примечание #1. 

В конфигурации задачи должны быть перечислены все языки которые сконфигурированы для сборщика.

#### Примечание #2.

Если для всех языковых версий хост сайта является общим, то вместо объекта значением поля
`hosts` можно передать строку.

## Тестирование

Запуск тестов с вычислением покрытия кода тестами с помощью инструмента [istanbul](https://www.npmjs.com/package/istanbul):
```
npm test
```

Проверка синтаксиса кода с помощью [jshint](https://www.npmjs.com/package/jshint) и [jscs](https://www.npmjs.com/package/jscs)
```
npm run codestyle
```

Особая благодарность за помощь в разработке:

* Ильченко Николай (http://github.com/tavriaforever)
* Константинова Гела (http://github.com/gela-d)
* Гриненко Владимир (http://github.com/tadatuta)
* Абрамов Андрей (https://github.com/blond)

Разработчик Кузнецов Андрей Серргеевич @tormozz48
Вопросы и предложения присылать по адресу: tormozz48@gmail.com
