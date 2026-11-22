export interface Task {
  id: string;
  text: string;
  ownerId: string;
}

export interface User {
  id: string;
  name: string;
  profileImageUrl: string;
}
