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

  return postItem;
}

document.addEventListener("DOMContentLoaded", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");

  openThePost(id);

  console.log(id);
});

function openThePost(id) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then((response) => response.json())
    .then((post) => {
      const postList = document.querySelector(".post-list");
      const postElement = createPostElement(post);
      postList.appendChild(postElement);
    })
    .catch((error) => console.error("Error fetching posts:", error));
}
