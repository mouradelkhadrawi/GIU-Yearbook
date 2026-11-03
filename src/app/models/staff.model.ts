export interface StaffMember {
  id: number;
  name: string;
  department: string;
  role: string;
  bio: string;
  quote: string;
  /** Path to the portrait, relative to the /public folder. */
  photo: string;
  featured: boolean;
}