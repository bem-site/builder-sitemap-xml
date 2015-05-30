var mockFs = require('mock-fs'),
    should = require('should'),
    Config = require('bs-builder-core/lib/config'),
    Model = require('bs-builder-core/lib/model/model'),
    BuildSiteMapXML = require('../../lib/tasks/build-sitemap-xml');

describe('BuildSiteMapXML', function () {
    var config, task;

    beforeEach(function () {
        mockFs({
            data: {}
        });

        config = new Config('debug');
        config.setLanguages(['en', 'ru']);
    });

    afterEach(function () {
        mockFs.restore();
    });

    it('should return valid task name', function () {
        BuildSiteMapXML.getName().should.equal('build sitemap xml');
    });

    describe('_getHosts', function () {
        var hosts = { en: 'https://my.site.com', ru: 'https://my.site.ru' };
        it('should throw error if hosts were not set', function () {
            task = new BuildSiteMapXML(config, {});
            (function () {return task['_getHosts'](); }).should.throw('Hosts undefined');
        });

        it('should make host object in case of string param', function () {
            task = new BuildSiteMapXML(config, { hosts: 'https://my.site.com' });
            should.deepEqual(task['_getHosts'](), {
                en: 'https://my.site.com',
                ru: 'https://my.site.com'
            });
        });
    });

    describe('_getDefaultSearchParams', function () {
        it('should return valid default search parameters', function () {
            task = new BuildSiteMapXML(config, {});
            should.deepEqual(BuildSiteMapXML._getDefaultSearchParams(), { changefreq: 'weekly', priority: 0.5 });
        });
    });

    describe('_getSiteMapXmlFilePath', function () {
        it('should return valid sitemap.xml file path', function () {
            task = new BuildSiteMapXML(config, {});
            task['_getSiteMapXmlFilePath']().indexOf('data/sitemap.xml').should.above(-1);
        });
    });

    describe('_buildSiteMapModel', function () {
        var hosts = { en: 'https://my.site.com', ru: 'https://my.site.ru' },
            assert = function (input, expected) {
                var model = new Model();
                model.setPages(input);
                var result = task._buildSiteMapModel(model, hosts, config.getLanguages());
                should.deepEqual(result, expected);
            };

        it('should omit page lang item if lang version does not exists', function () {
            assert([
                    {
                        url: '/url1',
                        en: { published: true }
                    }
                ],
                [
                    {
                        loc: 'https://my.site.com/url1',
                        changefreq: 'weekly',
                        priority: 0.5
                    }
                ]);
        });

        it('should omit page lang item if lang version does not published', function () {
            assert([
                    {
                        url: '/url1',
                        en: { published: false },
                        ru: { published: true }
                    }
                ],
                [
                    {
                        loc: 'https://my.site.ru/url1',
                        changefreq: 'weekly',
                        priority: 0.5
                    }
                ]);
        });

        it('override search params', function () {
            assert([
                    {
                        url: '/url1',
                        search: {
                            changefreq: 'daily',
                            priority: 1.0
                        },
                        en: { published: true },
                        ru: { published: true }
                    }
                ],
                [
                    {
                        loc: 'https://my.site.com/url1',
                        changefreq: 'daily',
                        priority: 1.0
                    },
                    {
                        loc: 'https://my.site.ru/url1',
                        changefreq: 'daily',
                        priority: 1.0
                    }
                ]);
        });
    });
});
