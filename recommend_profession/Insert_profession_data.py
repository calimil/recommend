#导入必要的库
import pandas as pd
import sqlite3
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# 读取CSV文件，连接到SQLite数据库，并插入数据
if __name__ == '__main__':
    # 读取CSV文件，假设文件名为'major_data(6).csv'，并使用GBK编码
    df = pd.read_csv('./major_data(6).csv', encoding='GBK')

# 连接到上一级目录下的SQLite数据库文件
# 创建游标对象用于执行SQL语句
    conn = sqlite3.connect("../db.sqlite3")
    # 创建数据库游标对象
    cursor = conn.cursor()

# 第4列数据归一化：将第4列数据缩放到0-1范围
# MinMaxScaler()：将数据按比例缩放到指定范围（默认0-1）
# reshape(-1, 1)：将数据转换为二维数组（sklearn要求）    
    min_max = MinMaxScaler()
    # 选择第5列（索引4）进行归一化，并将结果重新赋值回该列
    x = np.array(df.iloc[:, 4]).reshape(-1, 1)
    min_max.fit_transform(x)
    df.iloc[:, 4] = min_max.transform(x)

#数据插入数据库
    for i in range(len(df)):
        a = df.iloc[i, 1]   #第1列
        b = df.iloc[i, 2]   #第2列
        c = df.iloc[i, 3]   #第3列
        d = df.iloc[i, 4]   #第4列（已归一化）
        e = df.iloc[i, 5]   #第5列
        print(d)
        d = int(d*1000)     # 将0-1的值转换为0-1000的整数
        
        # 构建插入SQL语句
        sql = "insert into recommend_profession_profession values ('%d','%s','%s', '%s', '%s', '%s')" % (i, a, b, c, d, e)
        print(sql)
        x = cursor.execute(sql)    # 执行SQL

    conn.commit()
