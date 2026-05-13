using System.ComponentModel.DataAnnotations;

namespace MobileApi.DTOs.Requests;

public class UpdateUserRequest
{
    [MaxLength(100)]
    public string? Username { get; set; }
    public string? Avatar { get; set; }
    public DateTime? Birthday { get; set; }
}