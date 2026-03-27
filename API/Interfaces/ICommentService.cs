using API.Entities;

namespace API.Interfaces;

public interface ICommentService
{
    Task<Comment> CreateComment(Comment comment);
    Task<IReadOnlyList<Comment>> GetCommentsByArticleIdAsync(string articleId);
    Task<Comment?> GetCommentByIdAsync(string commentId);
    void UpdateComment(Comment comment);
    void DeleteComment(Comment comment);
    Task<bool> SaveAllChangesAsync();
}
