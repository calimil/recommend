# 导入Django shortcuts模块中的render（渲染模板）和redirect（重定向）函数
from django.shortcuts import render, redirect
#导入当前应用的models模块（包含数据模型，如Profession）
from . import models
# 导入Django ORM的Max函数
from django.db.models import Max
# 从user应用的models中导入User模型
from user.models import User
# 导入pandas库，用于数据处理和分析
import pandas as pd
# 导入Django的序列化工具，用于将模型数据转为JSON格式
from django.core import serializers
# 导入CSRF豁免装饰器，用于取消当前视图的CSRF保护
from django.views.decorators.csrf import csrf_exempt  # 取消csrf

#董静编写
import matplotlib.pyplot as plt
import os
from django.conf import settings
# 新增：设置matplotlib中文字体
plt.rcParams["font.family"] = ["SimHei", "WenQuanYi Micro Hei", "Heiti TC"]
import math
from django.db.models import F
from .models import Profession
import csv
from django.http import JsonResponse

# 应用CSRF豁免装饰器，取消该视图的CSRF验证
@csrf_exempt
def recommend_profession(request):
    # 检查用户是否登录（通过session中的'is_login'标识）
    if not request.session.get('is_login', None):
        # 如果本来就未登录，也就没有信息一说，跳去登录界面
        return redirect("/login/")
    # 根据session中存储的用户名，获取当前登录用户的User对象
    user = User.objects.get(username=request.session.get('username'))
    # 页面标题设为"推荐专业"
    title = '推荐专业'
    # 查询Profession模型的所有字段值（返回元组列表）
    message = models.Profession.objects.values_list()
    # 查询所有不重复的type1（一级分类）值
    s = models.Profession.objects.values('type1').distinct()
    # 将查询结果转为pandas DataFrame，方便后续数据处理
    message = pd.DataFrame(message)
    # 提取DataFrame中第2列（索引1）的唯一值，即所有不重复的type1
    type1 = message.iloc[:, 1].unique()
    # 将所有Profession对象序列化为JSON格式，供前端使用
    pro_js = serializers.serialize("json", models.Profession.objects.all())
    # 获取用户的性格类型（用于专业推荐过滤）
    p_type = user.personality_type

    # have_done是判断用户有无完成问卷调查
    have_done = True
     # 判断用户是否完成问卷调查（若personality_type不为'0'，视为已完成）
    if user.personality_type != '0':
        print('该用户已完成问卷调查')
        have_done = None
        # 完成问卷调查的考生，过滤掉不符合其性格的专业
        # 未完成问卷调查的同学，不过滤

        # 根据用户性格类型的前3个字符，过滤匹配的专业
        # 分别匹配性格类型的第1、2、3个字符
        profession_hot1 = models.Profession.objects.filter(profession_type__contains=p_type[0])
        profession_hot2 = models.Profession.objects.filter(profession_type__contains=p_type[1])
        profession_hot3 = models.Profession.objects.filter(profession_type__contains=p_type[2])
        # 取三个结果集的并集（去重），转为列表
        profession_hot = list(set(profession_hot1) | set(profession_hot2) | set(profession_hot3))
        profession_hot.sort()  # 排序
        profession_hot = profession_hot[: 20]  # 取前20个
    else:
        print('该用户未完成问卷调查')
        # 未完成问卷则返回所有专业
        profession_hot = list(models.Profession.objects.filter())
        profession_hot.sort()  # 排序

    try:
        # 尝试获取session中存储的用户浏览历史（专业一级/二级分类）
        request.session['profession_type1']
        print('该用户有浏览历史')
        # 根据浏览历史的一级分类和二级分类，查询相关专业
        profession_hot_recommend1 = models.Profession.objects.filter(type1=request.session['profession_type1'])
        profession_hot_recommend2 = models.Profession.objects.filter(type2=request.session['profession_type2'])
        # 计算热度增加值（取当前推荐列表中第一个专业热度的一半）
        add = int(profession_hot[0].profession_hot)//2
        # 将历史相关专业合并到推荐列表中
        profession_hot = list(set(list(profession_hot) + list(profession_hot_recommend1) +
                                  list(profession_hot_recommend2)))
        # 为与浏览历史相关的专业增加热度（提升推荐优先级）
        for i, pro in enumerate(profession_hot):
            if pro.type1 == request.session['profession_type1']:
                pro.profession_hot = int(pro.profession_hot) + add
            if pro.type2 == request.session['profession_type2']:
                pro.profession_hot = int(pro.profession_hot) + add
    except:
        # 若session中无浏览历史（或其他异常），则不处理
        print('该用户没有浏览历史')
    print('排序')
    profession_hot.sort()  # 排序
    profession_hot = profession_hot[:20]    # 最终取前20个推荐结果
    # 渲染recommend_profession.html模板，并传递局部变量
    return render(request, 'recommend_profession.html', locals())

# 应用CSRF豁免装饰器，取消该视图的CSRF验证
@csrf_exempt
def profession(request, profession_name):
    """专业详情跳转视图：记录专业浏览行为（增加热度），更新浏览历史，并重定向到百度百科"""
    # 根据专业名称（截取掉最后2个字符）查询对应的Profession对象
    p = models.Profession.objects.get(profession_name=profession_name[: -2])
    # 专业热度+1（记录浏览行为对热度的影响）
    p.profession_hot = int(p.profession_hot) + 1
    p.save()    # 保存更新后的热度值到数据库
    print(profession_name, '热度+1')
    # 将当前专业的二级分类和一级分类存入session，记录浏览历史
    request.session['profession_type2'] = p.type2
    request.session['profession_type1'] = p.type1
    # 重定向到百度百科的该专业页面
    return redirect(f'https://baike.baidu.com/item/{profession_name}')

# 董静编写
# 读取CSV文件数据（适配major_data(6).csv的列结构）
def load_major_data():
    """读取CSV数据，适配GBK编码，列对应：
    - 第2列：专业大类 (index=1)
    - 第3列：专业类别 (index=2)
    - 第4列：专业名称 (index=3)
    - 第5列：人气值 (index=4)
    """
    data = []
    csv_path = os.path.join(
        settings.BASE_DIR, 
        'recommend_profession', 
        'major_data(6).csv'
    )
    try:
        # 解决编码错误：使用GBK/GB2312编码读取
        with open(csv_path, 'r', encoding='gbk') as f:
            reader = csv.reader(f)
            next(reader)  # 跳过表头
            for row in reader:
                if len(row) >= 5:
                    # 数据清洗：去除空格，处理非数字人气值
                    major_category = row[1].strip()
                    major_subcategory = row[2].strip()
                    major_name = row[3].strip()
                    # 容错处理：人气值转整数
                    try:
                        popularity = int(row[4].strip())
                    except (ValueError, TypeError):
                        popularity = 0

                    data.append({
                        'major_category': major_category,
                        'major_subcategory': major_subcategory,
                        'major_name': major_name,
                        'popularity': popularity
                    })
    except Exception as e:
        print(f"读取CSV失败：{str(e)}")
    return data


@csrf_exempt
def profession_major_chart(request):
    all_majors = load_major_data()
    
    # 获取筛选参数
    selected_category = request.GET.get('major_category', '')
    selected_subcategory = request.GET.get('major_subcategory', '')
    
    # 筛选数据
    filtered_majors = all_majors
    if selected_category:
        filtered_majors = [m for m in filtered_majors if m['major_category'] == selected_category]
    if selected_subcategory:
        filtered_majors = [m for m in filtered_majors if m['major_subcategory'] == selected_subcategory]
    
    # 按人气值降序排序
    filtered_majors = sorted(filtered_majors, key=lambda x: x['popularity'], reverse=True)
    
    # 拆分数据：每8个专业一组，生成多图表数据
    chunk_size = 8
    chart_data_list = []
    for i in range(0, len(filtered_majors), chunk_size):
        chunk = filtered_majors[i:i+chunk_size]
        chart_data_list.append({
            'labels': [m['major_name'] for m in chunk],
            'values': [m['popularity'] for m in chunk],
            'group_num': i//chunk_size + 1  # 图表组号
        })
    
    # 获取下拉菜单选项（去重+排序）
    all_categories = sorted({m['major_category'] for m in all_majors if m['major_category']})
    # 二级联动：根据选中大类过滤专业类别
    if selected_category:
        all_subcategories = sorted({
            m['major_subcategory'] for m in all_majors 
            if m['major_category'] == selected_category and m['major_subcategory']
        })
    else:
        all_subcategories = sorted({m['major_subcategory'] for m in all_majors if m['major_subcategory']})
    
    context = {
        'all_categories': all_categories,
        'all_subcategories': all_subcategories,
        'selected_category': selected_category,
        'selected_subcategory': selected_subcategory,
        'chart_data_list': chart_data_list,  # 多图表数据
        'total_majors': len(filtered_majors)  # 筛选后总专业数
    }
    return render(request, 'major_chart.html', context)

def get_chart_data(request):
    """AJAX接口：根据筛选条件返回专业人气数据"""
    # 获取前端筛选参数
    type1 = request.GET.get('type1', '').strip()
    type2 = request.GET.get('type2', '').strip()
    
    csv_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'major_data(6).csv'
    )
    
    filtered_data = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)  # 跳过表头
            
            for row in reader:
                if len(row) >= 5:
                    # 提取数据（严格匹配CSV列：第2列=一级分类，第3列=专业类别，第4列=专业名称，第5列=人气值）
                    row_type1 = row[1].strip()
                    row_type2 = row[2].strip()
                    prof_name = row[3].strip()
                    hot_value = row[4].strip()
                    
                    # 过滤空值
                    if not row_type2 or not prof_name or not hot_value:
                        continue
                    
                    # 转换人气值为整数（容错）
                    try:
                        hot_value = int(hot_value)
                    except ValueError:
                        continue
                    
                    # 筛选逻辑：匹配专业类别（核心）+ 一级分类（可选）
                    match_type2 = (not type2) or (row_type2 == type2)
                    match_type1 = (not type1) or (row_type1 == type1)
                    
                    if match_type1 and match_type2:
                        filtered_data.append({
                            'prof_name': prof_name,
                            'hot_value': hot_value
                        })
    
    except Exception as e:
        return JsonResponse({
            'error': f'读取数据失败：{str(e)}',
            'categories': [],
            'series': []
        }, status=500)
    
    # 按人气值降序排列
    sorted_data = sorted(filtered_data, key=lambda x: x['hot_value'], reverse=True)
    
    # 返回图表所需数据
    return JsonResponse({
        'categories': [item['prof_name'] for item in sorted_data],  # 专业名称
        'series': [item['hot_value'] for item in sorted_data]       # 人气值
    })