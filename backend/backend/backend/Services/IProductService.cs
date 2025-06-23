using backend.Model;
using backend.Dto;


namespace backend.Services
{
    public interface IProductService
    {
        Task<PagedResult<Product>> GetProductsAsync(int page, int limit, string? search, string? category);
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(CreateProduct createDto);
        Task<Product?> UpdateProductAsync(int id, UpdateProduct updateDto);
        Task<bool> DeleteProductAsync(int id);
    }

}
