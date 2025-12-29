#林洋洋：新增test_all视图函数，实现所有问题在同一页面显示
from django.shortcuts import render, redirect
from user import models
from . import models as t_model


def get_personality_type(n):
    re = {'A': 0, 'C': 0, 'E': 0, 'I': 0, 'R': 0, 'S': 0}
    for i in range(1, len(n)):
        if n[i] == '1':
            if i in [2, 4, 14, 17, 21, 32, 39, 43]:
                re['A'] += 1
            if i in [1, 3, 7, 13, 29, 33, 38, 44]:
                re['C'] += 1
            if i in [5, 9, 11, 25, 28, 35, 37, 45]:
                re['E'] += 1
            if i in [6, 16, 18, 20, 30, 31, 40, 47]:
                re['I'] += 1
            if i in [10, 12, 22, 26, 34, 36, 41, 48]:
                re['R'] += 1
            if i in [8, 15, 19, 23, 24, 27, 42, 46]:
                re['S'] += 1
    re = sorted(re.items(), key=lambda d: d[1], reverse=True)
    return re[0][0]+re[1][0]+re[2][0]


def test_all(request):
    if request.session.get('is_login', None) is None:
        return redirect('/login')
    
    if request.method == 'POST':
        answers = []
        for i in range(48):
            key = f'answer_{i}'
            if key in request.POST:
                answers.append(request.POST[key])
            else:
                answers.append('')
        
        if len([a for a in answers if a]) != 48:
            questions = t_model.Question.objects.all()
            unanswered_indices = []
            question_data = []
            for i, question in enumerate(questions):
                answer = answers[i] if i < len(answers) else ''
                if not answer:
                    unanswered_indices.append(i)
                question_data.append({
                    'question': question,
                    'answer': answer,
                    'index': i
                })
            
            return render(request, 'test.html', {
                'question_data': question_data,
                'error': f'您还有 {len(unanswered_indices)} 道题未回答，请完成后再提交！',
                'unanswered_indices': unanswered_indices
            })
        
        answer_str = '*' + ''.join(answers)
        user = models.User.objects.get(username=request.session.get('username'))
        user.personality_type = get_personality_type(answer_str)
        user.save()
        return redirect('/analysis')
    
    questions = t_model.Question.objects.all()
    question_data = [{'question': q, 'answer': '', 'index': i} for i, q in enumerate(questions)]
    return render(request, 'test.html', {'question_data': question_data})


def test(request, num, answer):
    num = int(num)
    try:
        question = t_model.Question.objects.get(pk=int(num))
    except:
        user = models.User.objects.get(username=request.session.get('username'))
        p_type = 'user.personality_type'
        user.personality_type = get_personality_type(answer)
        user.save()
        return redirect('/analysis')
    num = num + 1
    answer_yes = answer + '1'
    answer_no = answer + '0'
    if num < 10:
        if num == 1:
            answer = '*'
        num = '0' + str(num)
    else:
        num = str(num)
    return render(request, 'test.html', locals())


def analysis(request):
    title = '性格分析'
    if request.session.get('is_login', None) is None:
        return redirect('/login')
    user = models.User.objects.get(username=request.session.get('username'))
    content = '分析的内容'
    p_type = user.personality_type
    if p_type == '0':
        return redirect('/test/all/')
    return render(request, 'analysis.html', locals())
