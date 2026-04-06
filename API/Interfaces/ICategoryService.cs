using API.Entities;

namespace API.Interfaces;

public interface ICategoryService
{
    void CreateCategory(Category category);
    Task<IReadOnlyList<Category>> GetAllCategories();
}
