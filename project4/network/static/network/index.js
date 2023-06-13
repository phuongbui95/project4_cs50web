document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#all-posts').addEventListener('click', () => load_view('all'));
    document.querySelector('#profile').addEventListener('click', () => load_view('profile'));
    document.querySelector('#following').addEventListener('click', () => load_view('following'));
    document.querySelector('#compose').addEventListener('click', compose); //Do not use () to pass a function in Javascript event handler

    ////----- By default, load all posts
    load_view('all');
});

function submit_post(contentVar) {
    fetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
            content: `${contentVar}`
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
    return;
}

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
    let text = viewpage;
    if(viewpage === "all") text = "all post";
    document.querySelector('#content-view').innerHTML = `<h3>
                                                            ${text.charAt(0).toUpperCase() + text.slice(1)}
                                                        </h3>`;
    
    // Get new posts and add posts
    // Fetch API: https://www.w3schools.com/js/js_api_fetch.asp
    show_page(viewpage);

}

// Show viewpage
function show_page(viewpage) {
    // Send a GET request to API
    fetch(`posts/${viewpage}`)
    .then(response => {
        console.log(response);
        response.json()
    })
    .then(posts => {
        console.log(posts);
        posts.forEach(post => {
            const post_div = document.createElement('div');
            post_div.className = `${mailbox} post_${post.id} posts-grid`;
            post_div.innerHTML = `<div class="gridItem-sender">${post.sender}</div>
                                <div class="gridItem-content">${post.content}</div>
                                <div class="gridItem-timestamp">${post.timestamp}</div>`;
            post_div.style.border = '1px solid black';
            document.querySelector('#content-view').append(post_div);
            
        })
    });
}
