from django.shortcuts import render, redirect
from . import models
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from . import forms
from django.core import serializers
from . import views_function
from django.views.decorators.csrf import csrf_exempt    # 取消csrf
import json   #新增


@csrf_exempt
def school_list(request):
    if not request.session.get('is_login', None):
        # 没登录去登录
        return redirect("/login/")
    if request.method == 'POST':
        request.session['school_name'] = request.POST.get('school_name')
        request.session['province'] = request.POST.get('province')
        request.session['student_type'] = request.POST.get('student_type')
        request.session['epoch'] = request.POST.get('epoch')
    school_list = models.School_info.objects.filter(school_name__contains=request.session['school_name'],
                                                    student_type__contains=request.session['student_type'],
                                                    epoch__contains=request.session['epoch'],
                                                    school_province__contains=request.session['province'])
    title = '普通院校信息'
    paginator = Paginator(school_list, 10)  # 设置每一页显示几条  创建一个panginator对象
    last = paginator.num_pages
    try:
        current_num = int(request.GET.get('page', 1))  # 当你在url内输入的?page = 页码数  显示你输入的页面数目 默认为第2页
        school_list = paginator.page(current_num)

    except EmptyPage:
        current_num = last
        school_list = paginator.page(last)  # 当你输入的page是不存在的时候就会报错

    if paginator.num_pages > 11:  # 如果分页的数目大于11
        if current_num - 5 < 1:  # 你输入的值
            pageRange = range(1, 11)  # 按钮数
        elif current_num + 5 > paginator.num_pages:  # 按钮数加5大于分页数
            pageRange = range(current_num - 5, current_num + 1)  # 显示的按钮数

        else:
            pageRange = range(current_num - 5, current_num + 6)  # range求的是按钮数   如果你的按钮数小于分页数 那么就按照正常的分页数目来显示

    else:
        pageRange = range(1, last)  # 正常分配
    school_form = forms.school_form(initial={
        'school_name': request.session['school_name'], 'province': request.session['province'],
        'student_type': request.session['student_type'], 'epoch': request.session['epoch']
    })
    return render(request, 'school_list.html', locals())


@csrf_exempt
def one_school(request, school_name):
    if not request.session.get('is_login', None):
        # 没登录去登录
        return redirect("/login/")
    profession_name = ''
    if request.method == 'POST':
        one_school_from = forms.one_school_form(request.POST)
        if one_school_from.is_valid():  # 判断是否填写完成
            x = one_school_from.cleaned_data  # 清理数据
            profession_name = x['profession_name']

    title = school_name
    science_message = models.One_School.objects.filter(profession_name__contains=profession_name, school_name=school_name, student_type='理科')
    art_message = models.One_School.objects.filter(profession_name__contains=profession_name, school_name=school_name, student_type='文科')
    one_school_form = forms.one_school_form()
    province = models.School_info.objects.filter(school_name=school_name)[0].school_province
    if province != '广东':
        province = '全国'
    recommend_school_list = views_function.running(school_name, province=province)
    return render(request, 'one_school.html', locals())

#易惜：新增功能（历年录取数据对比）
@csrf_exempt
def admission_trends(request):
    if not request.session.get('is_login', None):
        return redirect("/login/")

    title = '历年录取数据趋势分析'

    if request.method == 'POST':
        request.session['trend_school_name'] = request.POST.get('school_name', '').strip()
        request.session['trend_profession_name'] = request.POST.get('profession_name', '').strip()
        request.session['start_year'] = request.POST.get('start_year')
        request.session['end_year'] = request.POST.get('end_year')

    school_name = request.session.get('trend_school_name', '')
    profession_name = request.session.get('trend_profession_name', '')
    start_year = request.session.get('start_year')
    end_year = request.session.get('end_year')

    can_draw = all([school_name, profession_name, start_year, end_year])

    chart_data_dict = {}  # 给Django模板用的字典
    chart_labels = []
    years_data = {}

    if can_draw:
        qs = models.One_School.objects.filter(
            school_name__contains=school_name,
            profession_name__contains=profession_name,
            year__range=(start_year, end_year)
        )

        qs = qs.order_by('year')

        # 表格数据
        for d in qs:
            years_data.setdefault(d.year, []).append(d)

        chart_labels = sorted(years_data.keys())

        # 按批次 + 年份统计
        epoch_year_map = {}
        for d in qs:
            epoch_year_map.setdefault(d.epoch, {}).setdefault(d.year, []).append(d)

        for epoch, year_map in epoch_year_map.items():
            top_list, avg_list, low_list = [], [], []

            for y in chart_labels:
                data = year_map.get(y, [])
                tops = [float(i.top_score) for i in data if str(i.top_score).isdigit()]
                avgs = [float(i.avg_score) for i in data if str(i.avg_score).isdigit()]
                lows = [float(i.lowest_score) for i in data if str(i.lowest_score).isdigit()]

                # 处理没数据的情况
                top_val = round(sum(tops) / len(tops), 2) if tops else None
                avg_val = round(sum(avgs) / len(avgs), 2) if avgs else None
                low_val = round(sum(lows) / len(lows), 2) if lows else None

                top_list.append(top_val)
                avg_list.append(avg_val)
                low_list.append(low_val)

            chart_data_dict[epoch] = {'top': top_list, 'avg': avg_list, 'low': low_list}

    trend_form = forms.trend_form(initial={
        'school_name': school_name,
        'profession_name': profession_name,
        'start_year': start_year,
        'end_year': end_year
    })

    # 转换为JSON字符串
    chart_data_json = json.dumps(chart_data_dict)
    chart_labels_json = json.dumps(chart_labels)

    return render(request, 'admission_trends.html', {
        'title': title,
        'trend_form': trend_form,
        'can_draw': can_draw,
        'chart_labels': chart_labels_json,  # JSON字符串
        'chart_data_dict': chart_data_dict,  # 给模板循环用的字典
        'chart_data_json': chart_data_json,  # 给JS用的JSON字符串
        'years_data': years_data,
    })