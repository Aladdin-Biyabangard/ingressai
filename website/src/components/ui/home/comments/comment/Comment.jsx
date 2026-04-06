import React from "react";
import Image from "next/image";

import Rating from "@/components/shared/rating/Rating";

import styles from "./comment.module.css";

const Comment = ({ comment }) => {
  return (
    <div className={styles.comment}>
      <Image
        src="/icons/quotes.svg"
        alt="quotes"
        width={30}
        height={30}
        loading="lazy"
      />
      <div className={styles.commentText}>{comment?.text}</div>
      <div className={styles.commentInfo}>
        <div className={styles.commentAuthor}>
          <div className={styles.commentAuthorProfile}>
            <img src={comment?.profile_photo_url} alt={comment?.author_name} />
          </div>
          <div className={styles.commentAuthorName}>{comment?.author_name}</div>
        </div>
        <Rating rating={comment?.rating} height={31} width={20}/>
      </div>
    </div>
  );
};

export default Comment;
