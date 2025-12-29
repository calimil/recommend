"""
WSGI config for recommend_system2 project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""
# 导入os模块：用于访问操作系统环境变量，Django需要通过环境变量定位配置文件
import os

# 从Django核心模块导入WSGI应用生成函数
# get_wsgi_application()：生成Django的WSGI应用实例，封装了项目的请求处理逻辑
from django.core.wsgi import get_wsgi_application

# 设置Django配置模块的环境变量（关键步骤）
# 作用：告诉Django项目使用哪个settings.py文件（此处指向项目根目录的recommend_system2/settings.py）
# os.environ.setdefault：若环境变量未设置则添加，已设置则不修改，确保配置稳定
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recommend_system2.settings')

# 创建WSGI应用实例
# 此对象会被Web服务器（如Nginx+Gunicorn）调用，接收并处理所有客户端请求
# 所有HTTP请求都会通过这个application对象进入Django的视图处理流程
application = get_wsgi_application()
