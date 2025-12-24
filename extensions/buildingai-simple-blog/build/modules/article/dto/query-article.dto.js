'use strict';

var dto = require('@buildingai/dto');
var classValidator = require('class-validator');
var article_entity = require('../../../db/entities/article.entity');

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
class QueryArticleDto extends dto.PaginationDto {
  static {
    __name(this, "QueryArticleDto");
  }
  /**
   * Article title (fuzzy search)
   */
  title;
  /**
   * Article status
   */
  status;
  /**
   * Category ID
   */
  categoryId;
}
_ts_decorate([
  classValidator.IsString(),
  classValidator.IsOptional(),
  _ts_metadata("design:type", String)
], QueryArticleDto.prototype, "title", void 0);
_ts_decorate([
  classValidator.IsEnum(article_entity.ArticleStatus),
  classValidator.IsOptional(),
  _ts_metadata("design:type", typeof article_entity.ArticleStatus === "undefined" ? Object : article_entity.ArticleStatus)
], QueryArticleDto.prototype, "status", void 0);
_ts_decorate([
  classValidator.IsUUID("4"),
  classValidator.IsOptional(),
  _ts_metadata("design:type", String)
], QueryArticleDto.prototype, "categoryId", void 0);

exports.QueryArticleDto = QueryArticleDto;
