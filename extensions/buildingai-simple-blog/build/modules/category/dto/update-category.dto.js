'use strict';

var classValidator = require('class-validator');

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
class UpdateCategoryDto {
  static {
    __name(this, "UpdateCategoryDto");
  }
  /**
   * Category name
   */
  name;
  /**
   * Category description
   */
  description;
  /**
   * Sort order
   */
  sort;
}
_ts_decorate([
  classValidator.IsString({
    message: "Category name must be a string"
  }),
  classValidator.IsOptional(),
  classValidator.Length(1, 100, {
    message: "Category name length must be between 1 and 100 characters"
  }),
  _ts_metadata("design:type", String)
], UpdateCategoryDto.prototype, "name", void 0);
_ts_decorate([
  classValidator.IsString({
    message: "Category description must be a string"
  }),
  classValidator.IsOptional(),
  _ts_metadata("design:type", String)
], UpdateCategoryDto.prototype, "description", void 0);
_ts_decorate([
  classValidator.IsInt({
    message: "Sort order must be an integer"
  }),
  classValidator.Min(0, {
    message: "Sort order must be greater than or equal to 0"
  }),
  classValidator.IsOptional(),
  _ts_metadata("design:type", Number)
], UpdateCategoryDto.prototype, "sort", void 0);

exports.UpdateCategoryDto = UpdateCategoryDto;
