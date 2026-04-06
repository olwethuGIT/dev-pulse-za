using System;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class CategoryService(AppDbContext context) : ICategoryService
{
    public void CreateCategory(Category category)
    {
        context.Category.Add(category);
    }

    public async Task<IReadOnlyList<Category>> GetAllCategories()
    {
        return await context.Category.ToListAsync();
    }
}
