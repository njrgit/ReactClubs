using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options) { }

        public DbSet<Value> Values { get; set; }
        public DbSet<Club> Clubs { get; set; }
        public DbSet<UserClub> UserClubs { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> Followings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name = "Niro" },
                    new Value { Id = 2, Name = "Gaz" },
                    new Value { Id = 3, Name = "Em" },
                    new Value { Id = 4, Name = "Ralf" },
                    new Value { Id = 5, Name = "Rags" }
                );

            builder.Entity<UserClub>(x => x.HasKey(uc => new { uc.AppUserId, uc.ClubId }));

            builder.Entity<UserClub>().HasOne(u => u.AppUser)
                .WithMany(c => c.UserClubs)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserClub>().HasOne(c => c.Club)
                .WithMany(u => u.UserClubs)
                .HasForeignKey(c => c.ClubId);

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new { k.ObserverId, k.TargetId });

                b.HasOne(o => o.Observer)
                .WithMany(f => f.Followings)
                .HasForeignKey(o => o.ObserverId)
                .OnDelete(DeleteBehavior.Restrict);


                b.HasOne(o => o.Target)
                .WithMany(f => f.Followers)
                .HasForeignKey(o => o.TargetId)
                .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}