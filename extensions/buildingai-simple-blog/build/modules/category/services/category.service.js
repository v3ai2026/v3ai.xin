'use strict';

var base = require('@buildingai/base');
var typeorm$1 = require('@buildingai/db/@nestjs/typeorm');
var typeorm = require('@buildingai/db/typeorm');
var errors = require('@buildingai/errors');
var common = require('@nestjs/common');
var category_entity = require('../../../db/entities/category.entity');

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
function _ts_param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
__name(_ts_param, "_ts_param");
class CategoryService extends base.BaseService {
  static {
    __name(this, "CategoryService");
  }
  categoryRepository;
  /**
   * Constructor
   */
  constructor(categoryRepository) {
    super(categoryRepository), this.categoryRepository = categoryRepository;
  }
  /**
   * Create a category
   *
   * @param createCategoryDto DTO for creating a category
   * @returns Created category
   */
  async createCategory(createCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name
      }
    });
    if (existingCategory) {
      throw errors.HttpErrorFactory.badRequest("A category with the same name already exists");
    }
    const categoryData = {
      ...createCategoryDto,
      sort: createCategoryDto.sort ?? 0
    };
    return super.create(categoryData);
  }
  /**
   * Query category list
   *
   * @param queryCategoryDto DTO for querying categories
   * @returns Category list
   */
  async list(queryCategoryDto) {
    const { name } = queryCategoryDto;
    const where = {};
    if (name) {
      where.name = typeorm.Like(`%${name}%`);
    }
    return this.categoryRepository.find({
      where,
      order: {
        sort: "DESC",
        createdAt: "DESC"
      }
    });
  }
  /**
   * Update a category by id
   *
   * @param id Category id
   * @param updateCategoryDto DTO for updating a category
   * @returns Updated category
   */
  async updateCategoryById(id, updateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: {
        id
      }
    });
    if (!category) {
      throw errors.HttpErrorFactory.notFound(`Category ${id} does not exist`);
    }
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: {
          name: updateCategoryDto.name
        }
      });
      if (existingCategory && existingCategory.id !== id) {
        throw errors.HttpErrorFactory.badRequest("A category with the same name already exists");
      }
    }
    return super.updateById(id, updateCategoryDto);
  }
  /**
   * Increment category article count
   *
   * @param id Category id
   * @param count Increment value, default 1
   */
  async incrementArticleCount(id, count = 1) {
    const category = await this.categoryRepository.findOne({
      where: {
        id
      }
    });
    if (!category) {
      throw errors.HttpErrorFactory.notFound(`Category ${id} does not exist`);
    }
    category.incrementArticleCount(count);
    await this.categoryRepository.save(category);
  }
  /**
   * Decrement category article count
   *
   * @param id Category id
   * @param count Decrement value, default 1
   */
  async decrementArticleCount(id, count = 1) {
    const category = await this.categoryRepository.findOne({
      where: {
        id
      }
    });
    if (!category) {
      throw errors.HttpErrorFactory.notFound(`Category ${id} does not exist`);
    }
    category.decrementArticleCount(count);
    await this.categoryRepository.save(category);
  }
  /**
   * Batch delete categories
   *
   * @param ids Category ids
   * @returns void
   */
  async batchDelete(ids) {
    const categories = await this.categoryRepository.find({
      where: {
        id: typeorm.In(ids)
      }
    });
    const usedCategories = categories.filter((category) => category.hasArticles());
    if (usedCategories.length > 0) {
      throw errors.HttpErrorFactory.badRequest(`Cannot delete, the following categories are in use: ${usedCategories.map((c) => c.name).join(", ")}`);
    }
    await this.deleteMany(ids);
  }
}
CategoryService = _ts_decorate([
  common.Injectable(),
  _ts_param(0, typeorm$1.InjectRepository(category_entity.Category)),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof typeorm.Repository === "undefined" ? Object : typeorm.Repository
  ])
], CategoryService);

exports.CategoryService = CategoryService;
