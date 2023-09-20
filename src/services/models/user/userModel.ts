export interface User {
  id: number;
  name: string;
  imageUrl: string;
  userUniqueId: string;
  sdkClientInfo: {
    community: number;
    user: number;
    userUniqueId: string;
    uuid: string;
  };
  uuid: string;
  isGuest: boolean;
  isDeleted: boolean;
  customTitle: string;
  questionAnswers: any; // Define a specific type if needed
}
