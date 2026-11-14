


const unbookmarkBtns = document.querySelectorAll('.unbookmark-btn')


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


unbookmarkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const pk = btn.getAttribute('data-id')

        $.ajax({
            type: 'POST',
            url: '/bookmark/',
            data: {
                'csrfmiddlewaretoken': getCookie('csrftoken'),
                'pk': pk
            },
            success: function(response) {
                if (!response.bookmarked) {
                    document.getElementById(`post-${pk}`).remove()

                    if (document.querySelectorAll('.bookmarked-post').length === 0) {
                        document.getElementById('bookmarks-box').innerHTML =
                            '<p>You haven\'t bookmarked any posts yet.</p>'
                    }
                }
            },
            error: function(error) {
                console.log(error)
            }
        })
    })
})
