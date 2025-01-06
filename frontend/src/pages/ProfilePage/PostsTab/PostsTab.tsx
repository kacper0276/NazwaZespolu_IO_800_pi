import React from "react";
import styles from "./PostsTab.module.scss";

interface Post {
  id: number;
  images: string[];
  title: string;
  likes: number;
  comments: number;
  author: string;
}

interface PostsTabProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const PostsTab: React.FC<PostsTabProps> = ({ posts, onPostClick }) => {
  return (
    <div className={styles.photoGrid}>
      {posts.map((post) => (
        <div
          key={post.id}
          className={styles.photoItem}
          onClick={() => onPostClick(post)}
        >
          <img src={post.images[0]} className={styles.postImage} alt={post.title} />
          {post.images.length > 1 && (
            <div className={styles.multiImageIndicator}>
              <i className="bi bi-images"></i>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostsTab;
