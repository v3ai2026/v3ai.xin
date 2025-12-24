'use strict';

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
class CreateArticleDto {
  static {
    __name(this, "CreateArticleDto");
  }
  /**
   * Article title
   */
  title;
  /**
   * Article summary
   */
  summary;
  /**
   * Article content
   */
  content;
  /**
   * Cover image URL
   */
  cover;
  /**
   * Article status
   */
  status;
  /**
   * Sort order
   */
  sort;
  /**
   * Category ID
   */
  categoryId;
}
_ts_decorate([
  classValidator.IsString({
    message: "Article title must be a string"
  }),
  classValidator.Length(1, 200, {
    message: "Article title length must be between 1 and 200 characters"
  }),
  _ts_metadata("design:type", String)
], CreateArticleDto.prototype, "title", void 0);
_ts_decorate([
  classValidator.IsString({
    message: "Article summary must be a string"
  }),
  classValidator.IsOptional(),
  _ts_metadata("design:type", String)
], CreateArticleDto.prototype, "summary", void 0);
_ts_decorate([
  classValidator.IsString({
    message: "Article content must be a string"
  }),
  _ts_metadata("design:type", String)
], CreateArticleDto.prototype, "content", void 0);
_ts_decorate([
  classValidator.IsString({
    message: "Cover image URL must be a string"
  }),
  classValidator.IsOptional(),
  classValidator.Length(0, 500, {
    message: "Cover image URL length must not exceed 500 characters"
  }),
  _ts_metadata("design:type", String)
], CreateArticleDto.prototype, "cover", void 0);
_ts_decorate([
  classValidator.IsEnum(article_entity.ArticleStatus, {
    message: "Article status must be a valid enum value"
  }),
  classValidator.IsOptional(),
  _ts_metadata("design:type", typeof article_entity.ArticleStatus === "undefined" ? Object : article_entity.ArticleStatus)
], CreateArticleDto.prototype, "status", void 0);
_ts_decorate([
  classValidator.IsInt({
    message: "Sort order must be an integer"
  }),
  classValidator.Min(0, {
    message: "Sort order must be greater than or equal to 0"
  }),
  classValidator.IsOptional(),
  _ts_metadata("design:type", Number)
], CreateArticleDto.prototype, "sort", void 0);
_ts_decorate([
  classValidator.IsUUID("4", {
    message: "Category ID must be a valid UUID"
  }),
  classValidator.IsOptional(),
  _ts_metadata("design:type", String)
], CreateArticleDto.prototype, "categoryId", void 0);

exports.CreateArticleDto = CreateArticleDto;
