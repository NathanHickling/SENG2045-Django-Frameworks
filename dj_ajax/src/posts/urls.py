from django.urls import path
from .views import (
    post_list_and_create,
    load_post_data_view,
    like_unlike_post,
    hello_world_view,
    post_detail,
    post_detail_data_view,


)

app_name = 'posts'

urlpatterns = [
    #path is empty in order for the defaultt page to be home
    path('', post_list_and_create, name='main-board'),
    path('like-unlike/', like_unlike_post, name='like-unlike'),
    path('data/<int:num_posts>/',  load_post_data_view, name='posts-data'),
    path('<pk>/', post_detail, name="post-detail"),
    path('<pk>/data/', post_detail_data_view, name='post=detail-data'),

    path('hello-world/', hello_world_view, name='hello-world'),
]