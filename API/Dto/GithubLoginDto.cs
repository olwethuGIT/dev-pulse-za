using System;
using System.Text.Json.Serialization;

namespace API.Dto;

public class GithubLoginDto
{
    [JsonPropertyName("id")]
    public required long Id { get; set; }
    [JsonPropertyName("email")]
    public string Email { get; set; }
    [JsonPropertyName("name")]
    public required string Name { get; set; }
    [JsonPropertyName("login")]
    public required string Login { get; set; }
    [JsonPropertyName("avatar_url")]
    public required string AvatarUrl { get; set; }
}

public class GithubEmailsDto
{
    public bool Primary { get; set; }
    public string Email { get; set; }
    public bool Verified { get; set; }
}
