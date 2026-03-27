using API.Entities;

namespace API.Interfaces;

public interface IMemberRepository
{
    Task<IReadOnlyList<AppUser>> GetMembersAsync();
    Task<AppUser?> GetMemberByIdAsync(string id);
}
