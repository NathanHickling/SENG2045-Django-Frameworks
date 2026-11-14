console.log("Hello world")

const helloWorldBox = document.getElementById('hello-world')
const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const url = window.location.href

const alertBox = document.getElementById('alert-box')

const dropzone = document.getElementById('my-dropzone')
const addBtn = document.getElementById('add-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]

const searchInput = document.getElementById('search-input')


// $.ajax({
//     type: "GET",
//     url: "/hello-world/",
//     success: function (response) {
//         console.log('success', response.text)
//         helloWorldBox.textContent = response.text
//     },
//     error: function (error) {
//         console.log('error', error)
//     }

// });

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            //does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');
const deleted = localStorage.getItem('title')
if (deleted) {
    handleAlerts('danger', `deleted "${deleted}"`)
    localStorage.clear()
}

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e => {
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type: "POST",
            url: "/like-unlike/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            success: function (response) {
                console.log(response)
                clickedBtn.textContent = `${response.liked ? 'Unlike' : 'Like'} · ${response.count} ${response.count === 1 ? 'like' : 'likes'}`
            },
            error: function (error) {
                console.log(error)
            }
        });


    }))
}


const bookmarkPosts = () => {
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn:not([data-ready])')

    bookmarkBtns.forEach(btn => {
        btn.dataset.ready = 'true'

        btn.addEventListener('click', () => {
            const pk = btn.getAttribute('data-id')

            $.ajax({
                type: 'POST',
                url: '/bookmark/',
                data: {
                    'csrfmiddlewaretoken': csrftoken,
                    'pk': pk,
                },
                success: function (response) {
                    btn.textContent = response.bookmarked ? 'Unbookmark' : 'Bookmark'
                },
                error: function (error) {
                    console.log(error)
                }
            })
        })
    })
}


let visible = 3

const getData = () => {
    $.ajax({
        type: "GET",
        url: `/data/${visible}/`,
        data: {
            search: searchInput.value
        },
        success: function (response) {
            console.log(response)
            const data = response.data
            postsBox.innerHTML = ''

            setTimeout(() => {
                spinnerBox.classList.add('not-visible')

                console.log(data)
                data.forEach(el => {
                    postsBox.innerHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-2">
                                <img src="${el.avatar}" class="rounded-circle me-2" width="40" height="40" alt="Profile picture">
                                <span>${el.author}</span>
                            </div>

                            <small class="text-muted">Created: ${new Date(el.created).toLocaleString()} </small>

                        <h5 class="card-title">${el.title}</h5>
                        <p class="card-text"> ${el.body}</p>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-2">
                                    <a href="/${el.id}" class="btn btn-primary">Details</a>
                                </div>

                                <div class="col-auto">
                                    <form class="like-unlike-forms" data-form-id="${el.id}">
                                        <button class="btn btn-primary text-nowrap" id="like-unlike-${el.id}" >${el.liked ? 'Unlike' : 'Like'} · ${el.count} ${el.count === 1 ? 'like' : 'likes'}</button>
                                    </form>

                                </div>
                                <div class="col-2">
                                    <button type="button" class="btn btn-primary bookmark-btn" data-id="${el.id}">\
                                        ${el.bookmarked ? 'Unbookmark' : 'Bookmark'}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
            `
                });
                likeUnlikePosts()
                bookmarkPosts()
            }, 100);
            console.log(response.size)
            if (response.size === 0) {
                endBox.textContent = 'No posts added yet...'
            }
            else if (response.size <= visible) {
                loadBtn.classList.add('not-visible')
                endBox.textContent = 'No more posts to load...'
            }

        },
        error: function (error) {
            console.log(error);

        }
    });
}


searchInput.addEventListener('input', () => {
    visible = 3
    postsBox.innerHTML = ''
    getData()
})

loadBtn.addEventListener('click', () => {
    spinnerBox.classList.remove('not-visible')

    visible += 3

    getData()
})


let newPostId = null
let isSubmitting = false
postForm.addEventListener('submit', e => {
    e.preventDefault()

    if (isSubmitting) return

    isSubmitting = true

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value
        }, success: function (response) {
            console.log(response)
            newPostId = response.id

            postsBox.insertAdjacentHTML('afterbegin', `
                <div class="card mb-2">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <img src="${response.avatar}" class="rounded-circle me-2"
                                width="40" height="40" alt="Profile picture">
                            <span>${response.author}</span>
                        </div>

                        <small class="text-muted">
                            Created: ${new Date(response.created).toLocaleString()}
                        </small>

                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>
                    </div>

                    <div class="card-footer">
                        <div class="row">
                            <div class="col-auto">
                                <a href="/${response.id}/" class="btn btn-primary">Details</a>
                            </div>

                            <div class="col-auto">
                                <form class="like-unlike-forms" data-form-id="${response.id}">
                                    <button class="btn btn-primary text-nowrap"
                                            id="like-unlike-${response.id}">
                                        Like · 0 likes
                                    </button>
                                </form>
                            </div>

                            <div class="col-auto">
                                <button type="button" class="btn btn-primary bookmark-btn"
                                        data-id="${response.id}">
                                    Bookmark
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `)

            likeUnlikePosts()
            bookmarkPosts()
            //$('#addPostModal').modal('hide')
            handleAlerts('success', 'New post added!')
            //postForm.reset()

        },
        error: function (error) {
            isSubmitting = false
            console.log(error)
            handleAlerts('danger', 'ups... something went wrong')
        }
    })
})



addBtn.addEventListener('click', () => {
    dropzone.classList.remove('not-visible')
})

closeBtns.forEach(btn => btn.addEventListener('click', () => {
    btn.blur()

    newPostId = null
    isSubmitting = false
    myDropzone.removeAllFiles(true)

    postForm.reset()

    if (!dropzone.classList.contains('not-visible')) {
        dropzone.classList.add('not-visible')
    }

}))


Dropzone.autoDiscover = false
const myDropzone = new Dropzone('#my-dropzone', {
    url: 'upload/',
    init: function () {
        this.on('sending', function (file, xhr, formData) {
            formData.append('csrfmiddlewaretoken', csrftoken)
            formData.append('new_post_id', newPostId)
        })
    },

    maxFiles: 5,
    maxFilesize: 4,
    acceptedFiles: '.png, .jpg, .jpeg'
})


getData()