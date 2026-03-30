using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dto;

public class RegisterDto
{
    [Required]
    public string DisplayName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    [MinLength(4)]
    public string Password { get; set; } = "";
    [Required]
    public bool SubscribeToNewsletter { get; set; } = true;
}
