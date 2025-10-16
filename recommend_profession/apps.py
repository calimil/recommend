# recommend_profession/apps.py
from django.apps import AppConfig

# 定义应用配置类，继承自Django的AppConfig基类
class RecommendProfessionConfig(AppConfig):
    # 应用的名称，必须与应用目录名一致
    name = 'recommend_profession'
