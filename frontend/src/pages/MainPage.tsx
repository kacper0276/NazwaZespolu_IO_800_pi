import React from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./MainPage.module.scss";

const posts = [
  {
    id: 1,
    image: "https://via.placeholder.com/400x500",
    title: "Friendly Fire turns 10!",
    likes: 924,
    comments: 27,
    author: "John Doe",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/400x500",
    title: "Legendary Update 2.3!",
    likes: 1120,
    comments: 34,
    author: "Jane Smith",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/400x500",
    title: "Come and Visit us",
    likes: 169,
    comments: 10,
    author: "Alice Johnson",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/400x500",
    title: "Hello!",
    likes: 15435345,
    comments: 2,
    author: "Bob Williams",
  },
];

const Post: React.FC<{ post: (typeof posts)[0] }> = ({ post }) => (
  <div className={`${styles.post} card mb-4`}>
    <img src={post.image} className="card-img-top" alt={post.title} />
    <div className="card-body">
      <h5 className="card-title">{post.title}</h5>
      <p className="card-text">
        <small className="text-muted">Posted by {post.author}</small>
      </p>
      <p className="card-text">
        <span>❤️ {post.likes} likes</span> ·{" "}
        <span>💬 {post.comments} comments</span>
      </p>
    </div>
  </div>
);

const MainPage: React.FC = () => (
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

export default MainPage;
