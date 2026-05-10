using System.ComponentModel.DataAnnotations;
using MobileApi.Enums;

namespace MobileApi.DTOs.Requests;

public class UpdateHabitRequest : IValidatableObject
{
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public HabitType? Type { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? RecurrenceRule { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext context)
    {
        if (StartDate.HasValue && EndDate.HasValue && EndDate <= StartDate)
            yield return new ValidationResult("EndDate must be after StartDate", [nameof(EndDate)]);
    }
}