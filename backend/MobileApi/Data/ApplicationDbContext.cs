using Microsoft.EntityFrameworkCore;
using MobileApi.Models;

namespace MobileApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Khai báo các Bảng (Tables) sẽ có trong Database
    public DbSet<User> Users { get; set; }
    public DbSet<HabitTemplate> HabitTemplates { get; set; }
    public DbSet<OrbitInstance> OrbitInstances { get; set; }
    public DbSet<MissionTask> MissionTasks { get; set; }
    public DbSet<BusyTime> BusyTimes { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<UserIntegration> UserIntegrations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Thiết lập tính duy nhất (Unique) cho Email của User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}
