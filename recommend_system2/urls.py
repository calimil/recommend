"""recommend_system2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""
# recommend_system2 项目主URL配置文件
# 功能：定义项目的URL路由规则，将不同的URL路径映射到对应的视图（Views）
# 参考文档：https://docs.djangoproject.com/en/2.2/topics/http/urls/

# URL配置示例说明：
# 1. 函数视图（Function views）配置步骤：
#    - 导入视图：from my_app import views
#    - 添加路由：path('', views.home, name='home') （将空路径映射到views.home函数）
# 2. 类视图（Class-based views）配置步骤：
#    - 导入视图类：from other_app.views import Home
#    - 添加路由：path('', Home.as_view(), name='home') （将空路径映射到Home类的视图）
# 3. 包含其他URL配置文件（子应用路由）：
#    - 导入include函数：from django.urls import include, path
#    - 添加路由：path('blog/', include('blog.urls')) （将/blog/路径交给blog应用的urls.py处理）
"""

# 导入Django内置的admin模块（用于后台管理系统的URL配置）
from django.contrib import admin
# 导入URL路径处理函数：path用于定义单一路由，include用于包含其他URL配置文件
from django.urls import path, include


# urlpatterns：URL路由规则列表，Django会按顺序匹配URL并执行对应的视图
urlpatterns = [
    # 将空路径（网站根路径，如http://localhost:8000/）交给user应用的urls.py处理
    # 作用：user应用相关的页面（如用户登录、注册）通过该应用的路由规则匹配视图
    path('', include('user.urls')),

    # 将空路径交给Test应用的urls.py处理
    # 作用：Test应用相关的功能（可能是测试页面或临时功能）通过该应用的路由规则匹配视图
    # 注意：多个应用共享空路径时，需确保各应用的子路由不冲突（建议通过不同子路径区分）
    path('', include('Test.urls')),

    # 将空路径交给school_info应用的urls.py处理
    # 作用：学校信息相关的页面（如学校列表、详情）通过该应用的路由规则匹配视图
    path('', include('school_info.urls')),

    # 将空路径交给recommend_school应用的urls.py处理
    # 作用：学校推荐相关的功能（如推荐结果展示）通过该应用的路由规则匹配视图
    path('', include('recommend_school.urls')),

    # 将空路径交给recommend_profession应用的urls.py处理
    # 作用：专业推荐相关的功能（如推荐结果展示）通过该应用的路由规则匹配视图
    path('', include('recommend_profession.urls')),

    # 定义Django后台管理系统的URL路径：http://localhost:8000/admin/
    # admin.site.urls是Django内置的后台管理路由配置，无需手动编写
    path('admin/', admin.site.urls),
    
]
