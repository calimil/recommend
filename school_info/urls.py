from django.urls import path, re_path
from . import views


urlpatterns = [
    path('school_info/', views.school_list, name='school_info'),
    path('school_info/<str:school_name>/', views.one_school, name='one_school'),
    #易惜：新增url
    path('admission_trends/', views.admission_trends, name='admission_trends'),
    #易惜：新增url
    path('get_school_professions/', views.get_school_professions, name='get_school_professions')  # 12.29
]