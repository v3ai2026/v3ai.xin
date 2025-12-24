'use strict';

var typeorm = require('@buildingai/db/@nestjs/typeorm');
var common = require('@nestjs/common');
var category_entity = require('../../db/entities/category.entity');
var category_controller = require('./controllers/console/category.controller');
var category_web_controller = require('./controllers/web/category.web.controller');
var category_service = require('./services/category.service');

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
class CategoryModule {
  static {
    __name(this, "CategoryModule");
  }
}
CategoryModule = _ts_decorate([
  common.Module({
    imports: [
      typeorm.TypeOrmModule.forFeature([
        category_entity.Category
      ])
    ],
    controllers: [
      category_controller.CategoryController,
      category_web_controller.CategoryWebController
    ],
    providers: [
      category_service.CategoryService
    ],
    exports: [
      category_service.CategoryService
    ]
  })
], CategoryModule);

exports.CategoryModule = CategoryModule;
