export type Post = {
    _id: string;
    content: string;
    userId: {
      firstName: string;
      lastName: string;
    };
    likes: string[];
    imageUrl?: string;
    link?: string;
  };
  