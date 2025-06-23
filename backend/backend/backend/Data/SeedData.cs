using backend.Model;


namespace backend.Data
{
    public static class SeedData
    {
        public static void Initialize(ApplicationDbContext context)
        {
            if (context.Products.Any())
            {
                return; // DB has been seeded
            }

            var products = new List<Product>
            {
                new Product
                {
                    Name = "iPhone 15 Pro",
                    Description = "Latest Apple iPhone with advanced camera system and A17 Pro chip",
                    Price = 999.99m,
                    Category = "Electronics",
                    Stock = 25,
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new Product
                {
                    Name = "Samsung Galaxy S24",
                    Description = "Flagship Android smartphone with AI features",
                    Price = 849.99m,
                    Category = "Electronics",
                    Stock = 18,
                    CreatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new Product
                {
                    Name = "Nike Air Max 270",
                    Description = "Comfortable running shoes with Max Air cushioning",
                    Price = 129.99m,
                    Category = "Sports",
                    Stock = 45,
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new Product
                {
                    Name = "The Great Gatsby",
                    Description = "Classic American novel by F. Scott Fitzgerald",
                    Price = 12.99m,
                    Category = "Books",
                    Stock = 100,
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new Product
                {
                    Name = "Levi's 501 Jeans",
                    Description = "Classic straight-fit denim jeans",
                    Price = 79.99m,
                    Category = "Clothing",
                    Stock = 30,
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new Product
                {
                    Name = "KitchenAid Stand Mixer",
                    Description = "Professional-grade stand mixer for baking",
                    Price = 349.99m,
                    Category = "Home",
                    Stock = 12,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Product
                {
                    Name = "MacBook Pro 14\"",
                    Description = "Apple laptop with M3 chip for professionals",
                    Price = 1999.99m,
                    Category = "Electronics",
                    Stock = 8,
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Product
                {
                    Name = "Adidas Ultraboost 22",
                    Description = "High-performance running shoes with Boost midsole",
                    Price = 179.99m,
                    Category = "Sports",
                    Stock = 22,
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Product
                {
                    Name = "Harry Potter Collection",
                    Description = "Complete set of Harry Potter books",
                    Price = 89.99m,
                    Category = "Books",
                    Stock = 50,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new Product
                {
                    Name = "Cotton T-Shirt",
                    Description = "Basic cotton t-shirt in various colors",
                    Price = 19.99m,
                    Category = "Clothing",
                    Stock = 75,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
