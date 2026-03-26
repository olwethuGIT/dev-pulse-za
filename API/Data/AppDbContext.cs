using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
    public DbSet<Article> Articles { get; set; }
    public DbSet<ArticleLike> ArticleLikes { get; set; }
    public DbSet<Comment> Comments { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<ArticleLike>()
            .HasKey(al => new { al.UserId, al.ArticleId });

        modelBuilder.Entity<ArticleLike>()
            .HasOne(al => al.User)
            .WithMany(u => u.LikedArticles)
            .HasForeignKey(al => al.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ArticleLike>()
            .HasOne(al => al.Article)
            .WithMany(a => a.Likes)
            .HasForeignKey(al => al.ArticleId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.ParentComment)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Restrict); // ⚠️ important
    }
}
