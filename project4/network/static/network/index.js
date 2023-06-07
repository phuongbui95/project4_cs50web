document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#all-posts').addEventListener('click', () => load_view('All Posts'));
    document.querySelector('#profile').addEventListener('click', () => load_view('Profile'));
    document.querySelector('#following').addEventListener('click', () => load_view('Following'));
    document.querySelector('#compose').addEventListener('click', compose());
    
    let profile_name = document.querySelector('#profile');
    profile_name.addEventListener('click', () => load_view('All Posts'));
    let username = profile_name.innerText;
    profile_name.innerHTML = `Hello ${username.toUpperCase()} ^.^`;

    ////----- By default, load all posts
    // load_view('All Posts');
});

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

function load_view(page_view) {
    console.log(`view: ${page_view}`);
    // Show the mailbox and hide other views
    document.querySelector('#content-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    
     // Show the view name
     document.querySelector('#content-view').innerHTML = `<h3>${page_view.charAt(0).toUpperCase() + page_view.slice(1)}</h3>`;
    // See posts
    displayContent(page_view); // List all posts in this page_view
}

// list all expected posts in particular view
function displayContent(page_view) {
    return;
}

function submit_post() {
    return;
}