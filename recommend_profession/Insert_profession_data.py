#导入必要的库
import pandas as pd
import sqlite3
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# 读取CSV文件，连接到SQLite数据库，并插入数据
if __name__ == '__main__':
    # 读取CSV文件，假设文件名为'major_data(6).csv'，并使用GBK编码
    df = pd.read_csv('./major_data(6).csv', encoding='GBK')
    # 连接到SQLite数据库，假设数据库文件位于上级目录的'db.sqlite3'
    conn = sqlite3.connect("../db.sqlite3")
    # 创建数据库游标对象
    cursor = conn.cursor()
    # 数据归一化处理
    min_max = MinMaxScaler()
    # 选择第5列（索引4）进行归一化，并将结果重新赋值回该列
    x = np.array(df.iloc[:, 4]).reshape(-1, 1)
    min_max.fit_transform(x)
    df.iloc[:, 4] = min_max.transform(x)
    # 遍历数据框的每一行，构建并执行插入SQL语句
    for i in range(len(df)):
        a = df.iloc[i, 1]
        b = df.iloc[i, 2]
        c = df.iloc[i, 3]
        d = df.iloc[i, 4]
        e = df.iloc[i, 5]
        print(d)
        # 将归一化后的d值放大1000倍并转换为整数
        d = int(d*1000)
        # 构建插入SQL语句
        sql = "insert into recommend_profession_profession values ('%d','%s','%s', '%s', '%s', '%s')" % (i, a, b, c, d, e)
        print(sql)
        # 执行SQL语句
        x = cursor.execute(sql)
    #提交数据库事务
    conn.commit()
