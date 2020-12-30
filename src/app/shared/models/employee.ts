export interface Image {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  image: Image;
  jobTitle: string;
  departmentId: number;
  department?: string;
}
