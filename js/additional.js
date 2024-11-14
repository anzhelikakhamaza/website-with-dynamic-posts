function createElement(tag, className = "", content = "") {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (content) element.innerHTML = content;
  return element;
}

function createPostElement(post) {
  const postItem = createElement("li", "post-list-item");
  const postTitle = createElement("h4", "post-title", post.title);
  const postContent = createElement("p", "post-text", post.body);

  postItem.append(postTitle, postContent);

  const commentSection = createElement("div", "comment-section");

  const commentFormContainer = createCommentForm(post.id, commentSection);
  postItem.appendChild(commentFormContainer);

  postItem.appendChild(commentSection);

  showComments(post.id, commentSection);

  return postItem;
}

function showComments(postId, commentSection) {
  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then((response) => response.json())
    .then((comments) => {
      comments.forEach((comment) => {
        const commentContainer = createCommentElement(comment);
        commentSection.appendChild(commentContainer);
      });
    })
    .catch((error) => console.error("Error fetching comments:", error));
}

function createCommentElement(comment) {
  const commentContainer = createElement("div", "comment");
  const commentAuthor = createElement(
    "p",
    "comment-author",
    `Author: ${comment.name}`
  );
  const commentEmail = createElement(
    "p",
    "comment-email",
    `Email: ${comment.email}`
  );
  const commentBody = createElement("p", "comment-text", comment.body);

  commentContainer.append(commentAuthor, commentEmail, commentBody);
  return commentContainer;
}

function createCommentForm(postId, commentSection) {
  const commentAuthorInput = createElement("input", "comment-author-input");
  commentAuthorInput.placeholder = "Author Name";

  const commentEmailInput = createElement("input", "comment-email-input");
  commentEmailInput.placeholder = "Email";

  const commentBodyInput = createElement("textarea", "comment-body-input");
  commentBodyInput.placeholder = "Comment";

  const submitCommentButton = createElement(
    "button",
    "submit-comment-button",
    "Add Comment"
  );

  const commentFormContainer = createElement("div", "comment-form-container");

  commentFormContainer.append(
    commentAuthorInput,
    commentEmailInput,
    commentBodyInput,
    submitCommentButton
  );

  submitCommentButton.addEventListener("click", () => {
    const newCommentData = {
      postId: postId,
      name: commentAuthorInput.value,
      email: commentEmailInput.value,
      body: commentBodyInput.value,
    };

    pushTheComment(postId, newCommentData, commentSection);

    commentAuthorInput.value = "";
    commentEmailInput.value = "";
    commentBodyInput.value = "";
  });

  return commentFormContainer;
}

function pushTheComment(postId, commentData, commentSection) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(commentData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then(() => {
      fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then((response) => response.json())
        .then((comments) => console.log(comments))
        .catch((error) => console.error("Error fetching comments:", error));
    })
    .catch((error) => console.error("Error posting comment:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");

  openThePost(id);
});

function openThePost(id) {
  fetch(`https://jsonplaceholder.typicode.com/posts/?id=${id}`)
    .then((response) => response.json())
    .then((posts) => {
      if (posts.length === 0) {
        console.error("Post not found");
        return;
      }
      const postList = document.querySelector(".post-list");
      const postElement = createPostElement(posts[0]);
      postList.appendChild(postElement);
    })
    .catch((error) => console.error("Error fetching posts:", error));
}
