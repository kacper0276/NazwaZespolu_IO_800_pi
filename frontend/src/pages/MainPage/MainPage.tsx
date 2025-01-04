import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./MainPage.module.scss";
import CommentsModal from "../../components/Modals/CommentsModal/CommentsModal";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { t } from "i18next";

const posts = [
  {
    id: 1,
    images: ["https://via.placeholder.com/400x500"],
    title: "Friendly Fire turns 10!",
    likes: 924,
    comments: 27,
    author: "John Doe",
  },
  {
    id: 2,
    images: [
      "https://via.placeholder.com/400x500",
      "https://via.placeholder.com/400x500",
    ],
    title: "Legendary Update 2.3!",
    likes: 1120,
    comments: 34,
    author: "Jane Smith",
  },
  {
    id: 3,
    images: [
      "https://via.placeholder.com/400x500",
      "https://via.placeholder.com/400x500",
      "https://via.placeholder.com/400x500",
    ],
    title: "Come and Visit us",
    likes: 169,
    comments: 10,
    author: "Alice Johnson",
  },
  {
    id: 4,
    images: ["https://via.placeholder.com/400x500"],
    title: "Hello!",
    likes: 15435345,
    comments: 2,
    author: "Bob Williams",
  },
];
const Post: React.FC<{ post: (typeof posts)[0] }> = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if ((event.target as HTMLElement).classList.contains(styles.icon)) {
      if (!liked) {
        setLikes(likes + 1);
      } else {
        setLikes(likes - 1);
      }
      setLiked(!liked);

      setBouncing(true);
      setTimeout(() => setBouncing(false), 400);
    }
  };

  const sampleComments = Array.from({ length: 30 }, (_, i) => ({
    author: `User${i + 1}`,
    text: `This is comment number ${
      i + 1
    }. Great post! Very great Thank you for posting Nice nice nice`,
  }));

  return (
    <div className={`${styles.post} mb-4`}>
      <div className={`${styles.postCard} card`}>
        {post.images.length > 1 ? (
          <div
            id={`carousel-${post.id}`}
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img src={image} className="d-block w-100" alt={post.title} />
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target={`#carousel-${post.id}`}
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target={`#carousel-${post.id}`}
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        ) : (
          <img src={post.images[0]} className="card-img-top" alt={post.title} />
        )}
<div className="card-body">
  <h5 className="card-title">{post.title}</h5>
  <p className="card-text">
    <small>Posted by {post.author}</small>
  </p>
  <div className="card-text">  {/* Zmieniono <p> na <div> */}
    <div className={styles.reactionContainer}>
      <span className={styles["like-button"]} onClick={handleLike}>
        <span
          className={`${styles.icon} ${bouncing ? styles.bounce : ""} ${
            liked ? styles.colored : styles.grey
          }`}
        >
          {liked ? "🌳" : "🌱"}
        </span>{" "}
        {likes} Treeactions
      </span>
      <span
        className={styles.commentsContainer}
        onClick={() => setShowComments(true)}
      >
        💬 {post.comments} comments
      </span>
    </div>
  </div>
</div>
      </div>
      <CommentsModal
        show={showComments}
        onClose={() => setShowComments(false)}
        comments={sampleComments}
      />
    </div>
  );
};

const MainPage: React.FC = () => {
  useWebsiteTitle(t("main-page"));

  return (
    <div className={`${styles.homepage} container-fluid`}>
      <div className="row justify-content-center mx-0">
        <div className="col-md-8">
          <div className={styles.postsContainer}>
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
