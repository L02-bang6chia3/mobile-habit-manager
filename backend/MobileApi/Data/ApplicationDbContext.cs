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
    public DbSet<UserPreference> UserPreferences { get; set; }
    public DbSet<ChatConversation> ChatConversations { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<UserPreference>(e =>
        {
            e.HasIndex(p => p.UserId).IsUnique();
            e.HasOne<User>().WithOne().HasForeignKey<UserPreference>(p => p.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<HabitTemplate>(e =>
        {
            e.HasOne<User>().WithMany().HasForeignKey(h => h.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MissionTask>(e =>
        {
            e.HasOne<HabitTemplate>().WithMany().HasForeignKey(t => t.HabitTemplateId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrbitInstance>(e =>
        {
            e.HasOne<User>().WithMany().HasForeignKey(o => o.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne<HabitTemplate>().WithMany().HasForeignKey(o => o.HabitId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne<MissionTask>().WithMany().HasForeignKey(o => o.MissionTaskId).OnDelete(DeleteBehavior.SetNull).IsRequired(false);
            // Scheduler queries windows by user + time range
            e.HasIndex(o => new { o.UserId, o.TimeStart, o.TimeEnd });
        });

        modelBuilder.Entity<BusyTime>(e =>
        {
            e.HasOne<User>().WithMany().HasForeignKey(b => b.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(b => new { b.UserId, b.StartTime, b.EndTime });
        });

        modelBuilder.Entity<UserIntegration>(e =>
        {
            e.HasOne<User>().WithMany().HasForeignKey(ui => ui.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ChatConversation>(e =>
        {
            e.HasOne<User>().WithMany().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(c => new { c.UserId, c.LastMessageAt });
        });

        modelBuilder.Entity<ChatMessage>(e =>
        {
            e.HasOne<ChatConversation>().WithMany().HasForeignKey(m => m.ConversationId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(m => new { m.ConversationId, m.CreatedAt });
        });
    }
}
