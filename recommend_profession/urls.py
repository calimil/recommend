# 导入Django的URL路径处理模块：path用于普通路径匹配，re_path用于正则表达式路径匹配
from django.urls import path, re_path
#从当前应用（.表示当前目录）导入views模块，views中包含处理URL请求的视图函数
from . import views

# 定义URL路由列表，用于将URL路径映射到对应的视图函数
urlpatterns = [
    # 定义第一个路由：匹配路径'recommend_profession/'
    # 当用户访问网站域名 + '/recommend_profession/'时，会调用views中的recommend_profession函数处理请求
    # name='recommend_profession'为该路由命名，用于模板或代码中通过名称反向生成URL（避免硬编码路径）
    path('recommend_profession/', views.recommend_profession, name='recommend_profession'),
    # 定义第二个路由：匹配路径'profession/[字符串]/'（包含动态参数）
    # <str:profession_name>表示提取URL中该位置的字符串作为参数，命名为profession_name
    # 例如访问'profession/计算机科学与技术/'时，会将'计算机科学与技术'作为profession_name参数传递给views.profession函数
    # name='profession'为该路由命名，用于反向生成带参数的URL
    path('profession/<str:profession_name>/', views.profession, name='profession'),
    path('major_popularity/', views.profession_major_chart, name='major_popularity'),
    path('api/major/chart/data/', views.get_chart_data, name='get_chart_data'),
]