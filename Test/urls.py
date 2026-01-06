#林洋洋：新增test_all路由，用于显示所有问题
from django.urls import path, re_path
from . import views


urlpatterns = [
    path('analysis/', views.analysis, name='analysis'),
    path('test/all/', views.test_all, name='test_all'),
    path('test/<int:num>/<str:answer>/', views.test, name='test'),
]