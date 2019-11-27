using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Club> Clubs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>()
            .HasData
            (
                new Value { Id = 1, Name = "Niro" },
                new Value { Id = 2, Name = "Gaz" },
                new Value { Id = 3, Name = "Em" },
                new Value { Id = 4, Name = "Ralf" },
                new Value { Id = 5, Name = "Rags" }
            );
        }
    }
}