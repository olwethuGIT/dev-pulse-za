using System;
using API.Entities;
using API.Interfaces;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<AppUser?> GetMemberByIdAsync(string id)
    {
        return await context.Users.FindAsync(id);
    }

    public Task<IReadOnlyList<AppUser>> GetMembersAsync()
    {
        throw new NotImplementedException();
    }
}
