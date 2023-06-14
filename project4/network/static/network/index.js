// DOM Content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Use buttons to toggle between views
    document.querySelector('#all-posts').addEventListener('click', () => load_view('all'));
    let profile_selected = document.querySelector('#profile');
    profile_selected.addEventListener('click', () => load_view(profile_selected.textContent)); //textContent
    document.querySelector('#following').addEventListener('click', () => load_view('following'));
    document.querySelector('form').addEventListener('click', compose()); //call out result of compose() after 'submit" button is clicked
    // document.querySelector('#compose-view').addEventListener('click', compose); //Do not call out result of compose() after click on "create post" link
    
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
}

function compose() {
    let profile_selected = document.querySelector('#profile');
    if (profile_selected === null) {
        document.querySelector('#compose-view').style.display = 'none';
    } 

    // Clear out composition fields
    document.querySelector('#compose-body').value = '';
    
    // Submit post
    /* event listener must be placed at where the event is triggered */
    document.querySelector('form').onsubmit = (event) => { 
        console.log("Clicked on submit");
        let post_content = document.querySelector('#compose-body').value;
        if (post_content === '') alert('Cannot submit empty post!');
        else submit_post(post_content);
        load_view('all'); //Redirect to all-posts view

    }
    
}

function load_view(viewpage) {
    console.log(`view: ${viewpage}`);
    document.querySelector('#intro-view').style.display = 'none';

    // Show the view name
    let text = viewpage;
    if (viewpage === "all") text = "all post";
    document.querySelector('#content-view').innerHTML = `<h3>
                                                            ${text.charAt(0).toUpperCase() + text.slice(1)}
                                                        </h3>`;
    
    // View content of page
    show_content(viewpage);
}

// Show viewpage
function show_content(viewpage) {
    document.querySelector('#compose-view').style.display = 'block';
    // Profile view
    const follow_div = document.createElement('div');
    follow_div.id = `profile_${viewpage}`;
    follow_div.innerHTML = `<button class="follow-btn">Follow</button>
                            <div class="follower"><span>Followers: ###</span></div>
                            <div class="following"><span>Following: ###</span></div>
                            `;
    if (!document.querySelector(`#content-view > div#profile_${viewpage}`)) {
        document.querySelector('#content-view').append(follow_div);
    }

    let follow_btn = document.querySelector(`#profile_${viewpage} > .follow-btn`);
    follow_btn.addEventListener('click', () => {
        if(follow_btn.textContent === "Follow") {
            follow_btn.innerHTML = "Unfollow"
        } else {
            follow_btn.innerHTML = "Follow"
        }
    })

    // Display Follow div
    if (viewpage === "all" || viewpage === "following") {
        follow_div.style.display = 'none';    
    }
    // Display Follow button in profile page
    let profile_selected = document.querySelector('#profile');
    if (viewpage !== profile_selected.text) {
        follow_btn.style.display = 'none';    
    }

    // Posts view
    fetch(`posts/${viewpage}`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        posts.forEach(post => {
            const post_div = document.createElement('div');
            post_div.className = `post_${post.id}`;
            post_div.innerHTML = `<div class="sender_${post.sender}"><a href="#">${post.sender}</a></div>
                                <div class="content">${post.content}</div>
                                <div class="timestamp">${post.timestamp}</div>
                                <button name="like" type="submit" class="btn btn-primary">Like</button>`;
            post_div.style.border = '1px solid black';
            document.querySelector('#content-view').append(post_div);

            //view profile
            document.querySelector(`#content-view > div.post_${post.id} > div.sender_${post.sender} > a`)
                    .addEventListener('click', () => {
                        console.log(`Clicked on ${post.sender}`);
                        load_view(`${post.sender}`);
                    })
            
        })
    });
}
