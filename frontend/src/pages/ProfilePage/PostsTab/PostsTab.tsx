import React from "react";
import styles from "./PostsTab.module.scss";
import { GoalType } from "../../../types/IGoal";

interface PostsTabProps {
  posts: GoalType[];
  onPostClick: (post: GoalType) => void;
}

const PostsTab: React.FC<PostsTabProps> = ({ posts, onPostClick }) => {
  return (
    <div className={styles.photoGrid}>
      {posts.map((post) => (
        <div
          key={post._id}
          className={styles.photoItem}
          onClick={() => onPostClick(post)}
        >
          <img
            src={`/goalsImg/${post.image}`}
            className={styles.postImage}
            alt={post.name}
          />
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
