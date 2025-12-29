from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('recommend_profession', '0004_auto_20191209_1148'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfessionTrend',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profession_name', models.CharField(max_length=256, verbose_name="专业名称")),
                ('year', models.IntegerField(verbose_name="年份")),
                ('hot_degree', models.IntegerField(verbose_name="热度值")),
                ('rank', models.IntegerField(verbose_name="当年排名")),
                ('change_rate', models.FloatField(verbose_name="环比变化率")),
                ('browse_count', models.IntegerField(verbose_name="浏览量")),
            ],
            options={
                'verbose_name': "专业热度趋势",
                'verbose_name_plural': "专业热度趋势",
                'unique_together': ("profession_name", "year"),
            },
        ),
    ]