using System;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Data;
using API.Dto;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Options;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(AppDbContext context, ITokenService tokenService, IConfiguration config) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await EmailExists(registerDto.Email)) return BadRequest("Email taken");

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            Email = registerDto.Email,
            DisplayName = registerDto.DisplayName,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        // ToDto comes from Extensions
        return user.ToDto(tokenService);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        if (loginDto.Password == null) return BadRequest("Use Google login");

        var user = await context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == loginDto.Email.ToLower());

        if (user == null) return Unauthorized("Invalid email address.");

        if (user.PasswordHash == null || user.PasswordSalt == null)
        {
            return BadRequest("This account uses Google login.");
        }

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password.");
        }

        return user.ToDto(tokenService);
    }

    [HttpPost("google")]
    public async Task<ActionResult<UserDto>> GoogleLogin(GoogleLoginDto googleLoginDto)
    {
        var payload = await GoogleJsonWebSignature.ValidateAsync(googleLoginDto.Token);

        var email = payload.Email;
        var name = payload.Name;
        var googleId = payload.Subject;

        // Check if user exists
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());

        if (user == null)
        {
            user = new AppUser
            {
                Email = email,
                DisplayName = name,
                GoogleId = googleId,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();
        }
        else
        {
            if (user.GoogleId == null) return BadRequest("Please use a different login");
        }

        return user.ToDto(tokenService);
    }

    [HttpGet("github")]
    public async Task<ActionResult<string>> GithubLogin(string code)
    {
        // 1. Exchange code for access token
        var token = await ExchangeCodeForToken(code);

        if (token == null) return BadRequest("Failed to login with Github");

        // 2. Get GitHub user
        var gitHubUser = await GetGitHubUser(token);

        // 3. Find or create user
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == gitHubUser.Email);

        if (user == null)
        {
            user = new AppUser
            {
                Email = gitHubUser.Email,
                DisplayName = gitHubUser.Name,
                GitHubId = gitHubUser.Id,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();
        }
        else
        {
            if (user.GitHubId == null) return BadRequest("Please use a different login");
        }

        // 4. Create your JWT
        var jwtUser = user.ToDto(tokenService);
        var json = JsonSerializer.Serialize(jwtUser);
        var encoded = Uri.EscapeDataString(json);

        // 5. Redirect back to Angular
        return Redirect($"http://localhost:4200/auth/callback?token={encoded}");
    }

    private async Task<bool> EmailExists(string email)
    {
        return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
    }

    private async Task<string?> ExchangeCodeForToken(string code)
    {
        var client = new HttpClient();

        var request = new HttpRequestMessage(HttpMethod.Post,
            "https://github.com/login/oauth/access_token");

        request.Headers.Add("Accept", "application/json");

        request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            { "client_id", config["GitHub:ClientId"]! },
            { "client_secret", config["GitHub:ClientSecret"]! },
            { "code", code }
        });

        var response = await client.SendAsync(request);
        var json = await response.Content.ReadAsStringAsync();

        var obj = JsonSerializer.Deserialize<JsonElement>(json);

        return obj.GetProperty("access_token").GetString();
    }

    private async Task<GithubLoginDto?> GetGitHubUser(string accessToken)
    {

        var client = new HttpClient();

        client.DefaultRequestHeaders.Add("User-Agent", "Dev-Pulse-ZA");
        client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", accessToken);

        var profileResponse = await client.GetStringAsync("https://api.github.com/user");
        var profile = JsonSerializer.Deserialize<GithubLoginDto>(profileResponse);

        // 2. Get emails
        var emailResponse = await client.GetStringAsync("https://api.github.com/user/emails");
        var emails = JsonSerializer.Deserialize<List<GithubEmailsDto>>(emailResponse, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }!);

        var primaryEmail = emails?
        .FirstOrDefault(e => e.Primary && e.Verified)?.Email
        ?? emails?.FirstOrDefault(e => e.Verified)?.Email;


        return new GithubLoginDto
        {
            Id = profile.Id,
            Login = profile.Login,
            Name = profile.Name,
            AvatarUrl = profile.AvatarUrl,
            Email = primaryEmail
        };
    }
}
