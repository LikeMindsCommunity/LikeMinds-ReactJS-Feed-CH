export interface MemberState {
  createdAt: number;
  editRequired: boolean;
  member: {
    customTitle: string;
    id: number;
    imageUrl: string;
    isGuest: boolean;
    isOwner: boolean;
    name: string;
    organisationName: string | null;
    state: number;
    updatedAt: number;
    userUniqueId: string;
  };
  memberRights: MemberRight[];
  state: number;
  toolState: number;
}
export interface MemberRight {
  id: number;
  isLocked: boolean;
  isSelected: boolean;
  state: number;
  title: string;
  subTitle?: string;
}
