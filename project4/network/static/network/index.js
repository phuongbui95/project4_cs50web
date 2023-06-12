// Start with first post
let counter = 1;
// Load posts 10 at a time
const quantity = 10;

document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#all-posts').addEventListener('click', () => load_view('all posts'));
    document.querySelector('#profile').addEventListener('click', () => load_view('profile'));
    document.querySelector('#following').addEventListener('click', () => load_view('following'));
    document.querySelector('#compose').addEventListener('click', compose); //Do not use () to pass a function in Javascript event handler

    ////----- By default, load all posts
    load_view('all posts');
});

// If scrolled to bottom, load the next 10 posts
window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
};

function compose() {
    console.log('create a post!');
    // Show compose view and hide other views
    document.querySelector('#content-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
  
    // Clear out composition fields
    document.querySelector('#compose-body').value = '';
    
    // Submit post
    /* event listener must be placed at where the event is triggered */
    document.querySelector('form').onsubmit = (event) => { 
      submit_post(document.querySelector('#compose-body').value);
    }
}

function load_view(viewpage) {
    console.log(`view: ${viewpage}`);
    // Show the mailbox and hide other views
    document.querySelector('#content-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    
    // Show the view name
    document.querySelector('#content-view').innerHTML = `<h3>${viewpage.charAt(0).toUpperCase() + page_view.slice(1)}</h3>`;

    // Set start and end post numbers, and update counter
    const start = counter;
    const end = start + quantity - 1;
    // counter = end + 1; // update counter here but why?
    // Get new posts and add posts
    // Fetch API: https://www.w3schools.com/js/js_api_fetch.asp
    fetch(`posts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
        data.posts.forEach(add_post);
    })

}

// Add a new post with given contents to DOM
function add_post(contents) {

    // Create new post
    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = `${contents}: Content of this post`;

    // Add post to DOM
    document.querySelector('#content-view').append(post);
};

function submit_post() {
    return;
}