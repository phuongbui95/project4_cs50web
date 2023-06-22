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
function show_posts(viewpage) {
    fetch(`posts/${viewpage}`)
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => {
            const post_div = document.createElement('div');
            post_div.className = `post_${post.id}`;
            post_div.innerHTML = `
                                <div class="sender_${post.sender}"><a href="#">@${post.sender}</a></div>
                                <div class="content">${post.content}</div>
                                <div class="timestamp">${post.timestamp}</div>
                                <button name="like" type="submit" class="btn btn-primary">Like</button>
                                `;
            post_div.style.border = '1px solid black';
            document.querySelector('#content-view').append(post_div);

            //view profile
            document.querySelector(`#content-view > div.post_${post.id} > div.sender_${post.sender} > a`)
                    .addEventListener('click', () => {
                        console.log(`Clicked on ${post.sender}`);
                        load_view(`${post.sender}`);
                    })
            
        })

        // let total_pages = Math.ceil(posts.length/10); 
        // console.log(`${total_pages} pages`);
        // let page_num = 1;
        // posts_per_page = posts.slice(page_num*10-10,page_num*10);
        // posts_per_page.forEach(post => {
        //     const post_div = document.createElement('div');
        //     post_div.className = `post_${post.id}`;
        //     post_div.innerHTML = `
        //                         <div class="sender_${post.sender}"><a href="#">@${post.sender}</a></div>
        //                         <div class="content">${post.content}</div>
        //                         <div class="timestamp">${post.timestamp}</div>
        //                         <button name="like" type="submit" class="btn btn-primary">Like</button>
        //                         `;
        //     post_div.style.border = '1px solid black';
        //     document.querySelector('#content-view').append(post_div);

        //     //view profile
        //     document.querySelector(`#content-view > div.post_${post.id} > div.sender_${post.sender} > a`)
        //             .addEventListener('click', () => {
        //                 console.log(`Clicked on ${post.sender}`);
        //                 load_view(`${post.sender}`);
        //             })
            
        // })
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

// Pagination
function show_pagination(viewpage) {
    let pagination = `
                    <nav aria-label="Page navigation example">
                        <ul class="pagination d-flex justify-content-center">
                            <li class="page-item previous"><a class="page-link" href="#">Previous</a></li>
                            <li class="page-item" id="page-num" hidden>1</li>
                            <li class="page-item next"><a class="page-link" href="#">Next</a></li>
                        </ul>
                    </nav>
                    `
    // let previous_btn = document.querySelector('body > div > nav > ul > li.page-item.previous');
    // let next_btn = document.querySelector('body > div > nav > ul > li.page-item.next');
    // // Paginator
    // previous_btn.addEventListener('click', () => {
    //             console.log(`Clicked on Previous`);
    //             paginator('previous', total_pages, viewpage);
    //         })
    
    // next_btn.addEventListener('click', () => {
    //             console.log(`Clicked on Next`);
    //             paginator('next', total_pages, viewpage);
    //         })
    
    // Check page num
    // let page_num = document.querySelector('#page-num').innerHTML;
    // console.log(`current page_num= ${page_num}`);
}

function paginator(trigger_text, total_pages, viewpage) {
    let page_num = document.querySelector('#page-num').innerHTML;    
    if(trigger_text === 'previous') {
        if(parseInt(page_num) === 1) {
            alert('No less pages');
            return page_num;
        };
        page_num = parseInt(page_num)-1;
    } else {
        if(parseInt(page_num) === total_pages) {
            alert('No more pages');
            return page_num;
        }
        page_num = parseInt(page_num)+1;
    }
    return document.querySelector('#page-num').innerHTML = page_num;
}

