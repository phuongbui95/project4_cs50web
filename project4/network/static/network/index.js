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
    // document.querySelector('form').onsubmit = (event) => { 
    document.querySelector('#compose-form').onsubmit = (event) => { 
        console.log("Clicked on submit");
        let post_content = document.querySelector('#compose-body').value;
        if (post_content === '') alert('Cannot submit empty post!');
        else submit_post(post_content);
        load_view('all'); //Redirect to all-posts view

    }
    
}

// Load customized DOM
function load_view(viewpage) {
    console.log(`view: ${viewpage}`);
    document.querySelector('#compose-view').style.display = 'block';
    // Show the view name
    let text = viewpage;
    if (viewpage === "all") text = "all post";
    document.querySelector('#content-view').innerHTML = `<h3>
                                                            ${text.charAt(0).toUpperCase() + text.slice(1)}
                                                        </h3>`;
    
    
    // View content of page
    if (viewpage === "all" || viewpage === "following") {
        show_posts(viewpage);
    } else {
        show_profile(viewpage);
    }
}

// Show profile page
function show_profile(viewpage) {
    show_follow_and_posts(viewpage); //make sure follow_div displayed First then posts_div
}

// Show Posts
function show_posts(viewpage, page=1) {
    fetch(`posts/${viewpage}`)
    .then(response => response.json())
    .then(posts => {
        let total_pages = Math.ceil(posts.length/10); 
        console.log(`${total_pages} pages`);
        console.log(`page = ${page}`);
        // Pagination
        for (let page_num = 1; page_num <= total_pages; page_num++) {
            //=== Page num level ====//
            // if page container exists, do no append
            let page_div;
            if(!document.querySelector(`#content-view #${viewpage}_page_${page_num}`)) {
                page_div = document.createElement('div');
                page_div.id = `${viewpage}_page_${page_num}`; //_${page_num}`;    
                document.querySelector('#content-view').append(page_div);    
            }
            page_div = document.querySelector(`#content-view #${viewpage}_page_${page_num}`);
            // console.log(`page_div: ${page_div}`);

            //=== Posts per page level ====//
            // content of page container
            posts_per_page = posts.slice(page_num*10-10,page_num*10);
            posts_per_page.forEach(post => {

                if(!document.querySelector(`#${viewpage}_page_${page_num} > div.post_${post.id}`)) {
                    let post_div = document.createElement('div');
                    post_div.className = `post_${post.id}`;
                    post_div.innerHTML = `
                                        <div class="sender_${post.sender}"><a href="#">@${post.sender}</a></div>
                                        <div class="content">${post.content}</div>
                                        <div class="timestamp">${post.timestamp}</div>
                                        <div class="likeNum">#Like=<span>0</span></div>
                                        <button id="like_post_${post.id}" name="like" type="submit" class="btn btn-primary">like</button>
                                        <button id="edit_post_${post.id}" name="edit" type="submit" class="btn btn-primary">edit</button>
                                        `;
                    post_div.style.border = '1px solid black';
                    
                    // Add posts to page container
                    page_div.append(post_div);
                }
                
                // Like status
                let current_user = `${document.querySelector('#profile').textContent}`;
                let like_num_div = document.querySelector(`#${viewpage}_page_${page_num} > div.post_${post.id} > div.likeNum > span`);
                let like_btn_div = document.querySelector(`#like_post_${post.id}`);
                let like_people = post.likePeople;
                like_num_div.innerHTML = like_people.length;
                if(like_people.includes(current_user)) {
                    like_btn_div.innerHTML = "liked";
                } else {
                    like_btn_div.innerHTML = "like";
                }
                

                //view profile
                document.querySelector(`#content-view > div > div.post_${post.id} > div.sender_${post.sender} > a`)
                        .addEventListener('click', () => {
                            console.log(`Clicked on ${post.sender}`);
                            load_view(`${post.sender}`);
                        })
                // Edit
                let edit_btn = document.querySelector(`#edit_post_${post.id}`);
                edit_btn.addEventListener('click', () => {
                    edit_post(post.id, post.sender, viewpage);
                })
                
                // Like:
                like_btn_div.addEventListener('click', () => {
                    like(post.id, post.sender, like_btn_div.textContent);
                    // Change button text
                    if(like_btn_div.textContent === "like") { 
                        like_btn_div.innerHTML = "liked";
                    } else {
                        like_btn_div.innerHTML = "like";
                    }
                })
                
            })

            // Display posts' container
            if(page_num === page) {
                page_div.style.display = 'block';
            } else {
                page_div.style.display = 'none';
            }
        }
        
        // Add paginator if it does not exist
        if(!document.querySelector(`#paginator`)) {
            const paginator_div = document.createElement('div');
            paginator_div.id = `paginator`;
            paginator_div.innerHTML = `
                                        <nav aria-label="Page navigation example">
                                            <ul class="pagination d-flex justify-content-center">
                                                <li class="page-item previous"><a class="page-link" href="#">Previous</a></li>
                                                <li class="page-item page-num"><a class="page-link" href="#">${page}</a></li>
                                                <li class="page-item next"><a class="page-link" href="#">Next</a></li>
                                            </ul>
                                        </nav>
                                    `;    
            document.querySelector('#content-view').append(paginator_div);
        };

        //== Button Listener ==//
        // Paginator
        let previous_btn = document.querySelector(`#paginator > nav > ul > li.page-item.previous > a`);
        let next_btn = document.querySelector(`#paginator > nav > ul > li.page-item.next > a`);
        previous_btn.addEventListener('click', () => {
                    console.log(`Clicked on Previous`);
                    paginator('previous', total_pages, viewpage);
                })
        
        next_btn.addEventListener('click', () => {
                    console.log(`Clicked on Next`);
                    paginator('next', total_pages, viewpage);
                })
        
    });
}

// Show Follow numbers
function show_follow_and_posts(username) {
    fetch(`profiles/${username}`)
    .then(response => response.json())
    .then(user => {
        let current_user_div = document.querySelector('#profile');
        let following_users = user.following;
        let follower_users = user.follower;
        

        let follow_btn_text = 'follow';
        if(follower_users.includes(current_user_div.textContent)) {
            follow_btn_text = 'unfollow';
        }
        const follow_div = document.createElement('div');
        follow_div.id = `profile_${username}`;
        console.log('following num: ',following_users.length);
        console.log('follower num: ',follower_users.length);
        follow_div.innerHTML = `
                            <button class="follow-btn">${follow_btn_text}</button>
                            <div class="follower"><a href="#">Followers</a>: ${follower_users.length}</div>
                            <div class="following"><a href="#">Following</a>: ${following_users.length}</div>
                            `;
        // If #content-view of profile does not exist, add it                            
        if (!document.querySelector(`#content-view > div#profile_${username}`)) {
            document.querySelector('#content-view').append(follow_div);
        }
    
        // Initialize follow_btn
        let follow_btn = document.querySelector(`#profile_${username} > .follow-btn`);
        // Hide Follow button if profile page is of current user
        if (username === current_user_div.textContent) {
            follow_btn.style.display = 'none';    
        }
        // Display and Trigger Follow/Unfollow button
        follow_btn.addEventListener('click', () => {
            console.log("Clicked on Button");
            // Trigger
            follow_btn_click(
                current_user_div.textContent, //current_user
                username, // user_followed
                follow_btn.textContent //trigger_text
            );
            // Change button text
            if(follow_btn.textContent === "follow") { 
                follow_btn.innerHTML = "unfollow";
            } else {
                follow_btn.innerHTML = "follow"
            }

            alert(`${current_user_div.textContent} ${follow_btn_text}ed ${username}. Back to home-page`);
            load_view('all');
        })

        show_posts(username);
    })
}
// Follow or Unfollow
function follow_btn_click(current_user, user_followed, trigger_text) { 
    // Send a POST request to API
    fetch('/follow', {
        method: 'POST',
        body: JSON.stringify({
            user: `${current_user}`,
            user_followed: `${user_followed}`,
            trigger_text: `${trigger_text}`
        })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(`POST: ${result}`);
    });  
}

// Hide and Show block of code
function paginator(trigger_text, total_pages, viewpage) {
    let selected_page_tag = document.querySelector(`#paginator > nav > ul > li.page-item.page-num > a`);
    let show_page = parseInt(selected_page_tag.innerHTML);
    console.log(`Show page= ${show_page}`);
    console.log(`Total pages= ${total_pages}`);
    console.log(`Before switched => page= ${show_page}`);

    // Before
    if(show_page>=1 && show_page<=total_pages) {
        if(trigger_text === 'previous') {
            show_page = show_page - 1;
        } 
    
        if(trigger_text === 'next') {
            show_page = show_page + 1;
        }
    };
    
    //After
    if(show_page>total_pages || show_page<1) {
        alert('Out of pages');
        return;
    }
    
    for (let page_num = 1; page_num <= total_pages; page_num++) {
        let page_div = document.querySelector(`#${viewpage}_page_${page_num}`);
        if(page_num === show_page) {
            page_div.style.display = 'block';
        } else {
            page_div.style.display = 'none';
        }
        
    }

    console.log(`After switched => page= ${show_page}`);
    selected_page_tag.innerHTML = show_page;
}

function edit_post(post_id, post_sender, viewpage) {
    console.log(`Clicked on Edit post ${post_id}`);
    let current_user = document.querySelector('#profile').textContent;
    // console.log(`current_user: ${current_user}`);
    // console.log(`post_sender: ${post_sender}`);

    // if not requested user, alert
    if(current_user !== post_sender) {
        alert("You cannot edit other's post");
    } else { // else, PUT method to update post's content
        console.log('Update post');
        // Hide and Show block of code
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#content-view').style.display = 'none';
        document.querySelector('#edit-view').style.display = 'block';

        // edit-view
        // Clear out composition fields
        document.querySelector('#edit-body').value = '';
        
        // Submit post
        /* event listener must be placed at where the event is triggered */
        document.querySelector('#edit-form').onsubmit = (event) => { 
            console.log("Clicked on submit (edit)");
            let post_content = document.querySelector('#edit-body').value;
            if (post_content === '') alert('Cannot submit empty post!');
            else {
                // Udpate post's content
                fetch(`posts/${post_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        content: `${post_content}`
                    })
                })
                .then(response => response.json())
                .then(result => {
                    console.log(`New content: ${result}`);
                    document.querySelector('#content-view').style.display = 'block';
                    document.querySelector('#edit-view').style.display = 'none';
                    load_view(viewpage);
                })
            };
        }
    }
    
}

function like(post_id, post_owner, trigger_text) {
    let current_user = `${document.querySelector('#profile').textContent}`;
    console.log(`post ${post_id} of ${post_owner}`);
    console.log(`current_user: ${current_user}`);
    console.log(`Before clicked: ${trigger_text}`);
    
    let like_status = "";
    if(trigger_text === "like") {
        like_status = "like";
    } else {
        like_status = "unlike";
    }

    fetch('/like', {
        method: 'POST',
        body: JSON.stringify({
            post_id: post_id,
            owner: `${post_owner}`,
            like_status: `${like_status}`
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
}