# 导入Django的models模块，用于定义数据模型（与数据库表对应）
from django.db import models

# 定义一个名为'Profession'的数据模型类，继承自Django的Model基类
# 该类对应数据库中的profession表，用于存储专业相关信息
class Profession(models.Model):
    # 一级分类字段：字符串类型，最大长度128
    # 用于存储专业的一级分类（如"工学"、"理学"等）
    type1 = models.CharField(max_length=128)
    # 二级分类字段：字符串类型，最大长度128
    # 用于存储专业的二级分类（如"计算机类"、"电子信息类"等）
    type2 = models.CharField(max_length=128)
    # 专业名称字段：字符串类型，最大长度256
    # 用于存储具体的专业名称（如"计算机科学与技术"、"软件工程"等）
    profession_name = models.CharField(max_length=256)
    # 专业热度字段：字符串类型，最大长度256，允许为空值和空字符串
    # 用于存储专业的热度数据（可能是数值字符串，如"985"表示热度值）
    profession_hot = models.CharField(max_length=256, blank=True, null=True)
    # 专业类型字段：字符串类型，最大长度256，允许为空值和空字符串
    # 用于存储专业的具体类型信息（可能是更细分的分类）
    profession_type = models.CharField(max_length=256, blank=True, null=True)
    # 展示信息1字段：字符串类型，最大长度2048
    # 用于存储专业的展示内容（如专业介绍、培养目标等）
    show1 = models.CharField(max_length=2048)
    # 展示信息2字段：字符串类型，最大长度2048
    # 用于存储专业的更多展示内容（如课程设置、就业方向等）
    show2 = models.CharField(max_length=2048)
    # 展示信息3字段：字符串类型，最大长度2048
    # 用于存储专业的补充展示内容（如行业前景、院校推荐等）
    show3 = models.CharField(max_length=2048)

    # 定义模型实例的字符串表示形式
    # 当打印或显示模型实例时，返回"专业名称+热度"的组合字符串
    def __str__(self):
        return self.profession_name + self.profession_hot

    # 定义模型实例的小于比较逻辑（用于排序）
    # 当比较两个实例时，将热度转为整数，返回当前实例热度大于另一个实例的结果
    # 即按热度降序排列（当前实例热度高则视为"小于"另一个实例，排序时会靠前）
    def __lt__(self, other):
        return int(self.profession_hot) > int(other.profession_hot)

# 定义模型的元数据（影响模型的行为和显示）
    class Meta:
        ordering = ["id"]   #数据库查询时的默认排序方式：按id升序排列
        verbose_name = "专业信息"   #模型的单数显示名称
        verbose_name_plural = "专业信息"    #模型的复数显示名称


