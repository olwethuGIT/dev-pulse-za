import { User } from "../types/user";

export class UserMapper {
  static toUser(dto: any): User {
    return {
      id: dto.Id,
      displayName: dto.DisplayName,
      email: dto.Email,
      token: dto.Token,
      imageUrl: dto.ImageUrl,
    };
  }
}
