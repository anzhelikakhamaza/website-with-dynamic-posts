function createElement(tag, className = "", content = "") {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (content) element.innerHTML = content;
  return element;
}

fetch("https://jsonplaceholder.typicode.com/posts")
  .then((response) => response.json())
  .then((posts) => {
    const list = document.querySelector(".post-list");

    posts.forEach((postItem) => {
      const post = createPostElement(postItem);
      list.appendChild(post);
    });
  })
  .catch((error) => console.error("Error fetching posts:", error));

function createPostElement(postItem) {
  const post = createElement("li", "post-list-item");
  const postTitle = createElement("h4", "post-title", postItem.title);
  const postText = createElement("p", "post-text", postItem.body);
  const showCommentsButton = createElement(
    "a",
    "show-comments",
    "Show Comments"
  );
  const hideCommentsButton = createElement(
    "a",
    "hide-comments",
    "Hide Comments"
  );

  hideCommentsButton.style.display = "none";

  post.append(postTitle, postText, showCommentsButton, hideCommentsButton);

  const commentSection = createElement("div", "comment-section");
  post.appendChild(commentSection);

  showCommentsButton.addEventListener("click", () =>
    showComments(
      postItem.id,
      commentSection,
      showCommentsButton,
      hideCommentsButton
    )
  );
  hideCommentsButton.addEventListener("click", () =>
    hideComments(commentSection, showCommentsButton, hideCommentsButton)
  );

  return post;
}

function showComments(postId, commentSection, showButton, hideButton) {
  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then((response) => response.json())
    .then((comments) => {
      comments.forEach((comment) => {
        const commentContainer = createCommentElement(comment);
        commentSection.appendChild(commentContainer);
      });

      showButton.style.display = "none";
      hideButton.style.display = "inline-block";
    });
}

function createCommentElement(comment) {
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

  const addNewComment = createElement("textarea", "add-new-comment");
  const addNewCommentButton = createElement(
    "button",
    "add-new-comment-button",
    "Add Comment"
  );

  const commentContainer = createElement("div", "comment");
  commentContainer.append(
    commentAuthor,
    commentEmail,
    commentBody,
    addNewComment,
    addNewCommentButton
  );

  addNewCommentButton.addEventListener("click", () => {
    const addedComment = addNewComment.value;
    const newCommentDisplay = createElement(
      "p",
      "new-comment-display",
      addedComment
    );
    commentContainer.append(newCommentDisplay);
    addNewComment.value = "";
  });

  return commentContainer;
}

function hideComments(commentSection, showButton, hideButton) {
  commentSection.innerHTML = "";
  hideButton.style.display = "none";
  showButton.style.display = "inline-block";
}