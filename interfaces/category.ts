export interface Category {
  _id?: string;
  name: string;
  icon?: string;
}

export function instanceofCategory(object: any) {
  return 'name' in object;
}
