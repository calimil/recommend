# 导入Django内置的admin模块，该模块提供了后台管理系统的核心功能
from django.contrib import admin

# 从当前应用的models模块中导入Profession模型
from .models import Profession

# Register your models here.
# 将Profession模型注册到Django的admin站点，以便通过后台管理界面进行管理
admin.site.register(Profession)