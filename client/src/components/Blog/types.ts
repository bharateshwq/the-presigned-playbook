export interface BlogCard {
  title: string;
  description: string;
  tags: string[] | [];
  link: string;
  redirectId?: string;
}

export interface BlogCardList extends BlogCard {
  image: {
    url: string;
    alt: string;
    loading?: "eager" | "lazy";
  };
}
