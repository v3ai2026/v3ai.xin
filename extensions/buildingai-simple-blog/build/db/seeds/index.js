'use strict';

var article_seeder = require('./seeders/article.seeder');
var category_seeder = require('./seeders/category.seeder');

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
async function getSeeders() {
  return [
    new category_seeder.CategorySeeder(),
    new article_seeder.ArticleSeeder()
  ];
}
__name(getSeeders, "getSeeders");

exports.getSeeders = getSeeders;
