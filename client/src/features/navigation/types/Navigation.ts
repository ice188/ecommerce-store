export interface Navigation {
  categories: {
    id: string;
    name: string;
    href: string;
    featured: {
      id: number;
      name: string;
      href: string;
      price: string;
      imageSrc: string;
      imageAlt: string;
      rating: number;
      reviews: number;
    }[];
  }[];
  pages: {
    name: string;
    href: string;
  }[];
}

export const defaultNavigation: Navigation = {
  categories: [
    {
      id: "new-arrival",
      name: "New Arrival",
      href: "/new",
      featured: [],
    },
    {
      id: "popular",
      name: "Popular",
      featured: [],
      href: "/popular",
    },
  ],
  pages: [{ name: "Blog", href: "#" }],
};
