fetchCreate();
addListenerOnSearchInput();

let postsData = [];

function createElement(tag, className = "", content = "", placeholder = "") {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (content) element.innerHTML = content;
  if (placeholder) element.placeholder = placeholder;
  return element;
}

function fetchCreate() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((posts) => {
      const postList = document.querySelector(".post-list");
      postsData = posts.map((post) => {
        const postElement = createPostElement(post);
        document.querySelector(".post-list").appendChild(postElement);
        return { ...post, element: postElement };
      });
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

function createPostElement(post) {
  const postItem = createElement("li", "post-list-item");
  const postTitle = createElement("h4", "post-title", post.title);
  const postContent = createElement(
    "p",
    "post-text",
    `${post.body.slice(0, 100)}...`
  );

  const sharePost = createElement(
    "button",
    "share-the-post-button",
    "Share the Post"
  );

  const showCommentsButton = createElement(
    "button",
    "show-comments",
    "Show Comments"
  );
  const hideCommentsButton = createElement(
    "button",
    "hide-comments",
    "Hide Comments"
  );
  const addCommentButton = createElement(
    "button",
    "add-new-comment-button",
    "Add Comment"
  );

  hideCommentsButton.style.display = "none";

  postItem.append(
    sharePost,
    postTitle,
    postContent,
    showCommentsButton,
    hideCommentsButton,
    addCommentButton
  );

  const commentSection = createElement("div", "comment-section");
  postItem.appendChild(commentSection);

  const shareData = {
    title: "New Post",
    text: "Check This Post",
    url: `https://jsonplaceholder.typicode.com/posts/?id=${post.id}`,
  };

  sharePost.addEventListener("click", async () => {
    await navigator.share(shareData);
  });

  showCommentsButton.addEventListener("click", () =>
    showComments(
      post.id,
      commentSection,
      showCommentsButton,
      hideCommentsButton
    )
  );

  hideCommentsButton.addEventListener("click", () =>
    hideComments(commentSection, showCommentsButton, hideCommentsButton)
  );

  addCommentButton.addEventListener("click", () =>
    createCommentForm(commentSection, addCommentButton)
  );

  postTitle.addEventListener("click", function () {
    window.location.href = `https://jsonplaceholder.typicode.com/posts/?id=${post.id}`;
  });

  return postItem;
}

function showComments(
  postId,
  commentSection,
  showCommentsButton,
  hideCommentsButton
) {
  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then((response) => response.json())
    .then((comments) => {
      comments.forEach((comment) => {
        const commentContainer = createCommentElement(comment);
        commentSection.appendChild(commentContainer);
      });

      showCommentsButton.style.display = "none";
      hideCommentsButton.style.display = "inline-block";
    })
    .catch((error) => console.error("Error fetching comments:", error));
}

function hideComments(commentSection, showCommentsButton, hideCommentsButton) {
  commentSection.innerHTML = "";
  hideCommentsButton.style.display = "none";
  showCommentsButton.style.display = "inline-block";
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

function createCommentForm(commentSection, addCommentButton) {
  const commentAuthorInput = createElement(
    "textarea",
    "comment-author-input",
    "",
    "Author Name"
  );
  const commentEmailInput = createElement(
    "textarea",
    "comment-email-input",
    "",
    "Email"
  );
  const commentBodyInput = createElement(
    "textarea",
    "comment-body-input",
    "",
    "Comment"
  );
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
  commentSection.prepend(commentFormContainer);

  addCommentButton.classList.toggle("submit-button-disabled");
  addCommentButton.disabled = true;

  submitCommentButton.addEventListener("click", (e) => {
    const newCommentData = {
      name: commentAuthorInput.value,
      email: commentEmailInput.value,
      body: commentBodyInput.value,
    };

    const newCommentElement = createCommentElement(newCommentData);

    pushTheComment();

    commentAuthorInput.value = "";
    commentEmailInput.value = "";
    commentBodyInput.value = "";
  });
}

function pushTheComment(postId, commentData) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(commentData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => console.log(response.json()))
    .then(() => {
      fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then((response) => response.json())
        .then((comments) => console.log(comments))
        .catch((error) => console.error("Error fetching comments:", error));
    })
    .catch((error) => console.error("Error posting comment:", error));
}

function addListenerOnSearchInput() {
  const search = document.getElementById("search");

  search.addEventListener("input", definePosts);
}

function definePosts(e) {
  console.log(e);

  const value = e.target.value.toLowerCase();

  if (value.length > 3) {
    postsData.forEach((post) => {
      const isVisible =
        post.title.toLowerCase().includes(value) ||
        post.body.toLowerCase().includes(value);
      post.element.classList.toggle("hide", !isVisible);
    });
  }

  if (!value) {
    const postList = document.querySelector(".post-list");
    postList.innerHTML = "";
    fetchCreate();
  }
}
