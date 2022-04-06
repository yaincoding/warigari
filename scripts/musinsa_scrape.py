from bs4 import BeautifulSoup
from urllib.request import urlopen
import re
import argparse

category_map = {
    "상의": "001",
    "아우터": "002",
    "바지": "003",
    "원피스": "020"
}

category = "001"
page = 1


def createItems(category, page):
    items = []
    html = urlopen(
        f"https://www.musinsa.com/category/001?d_cat_cd={category}&brand=&rate=&page_kind=search&list_kind=small&sort=pop&sub_sort=&page={page}&display_cnt=90&sale_goods=&group_sale=&kids=N&ex_soldout=&color=&price1=&price2=&exclusive_yn=&shoeSizeOption=&tags=&campaign_id=&timesale_yn=&q=&includeKeywords=&measure=")
    bsObject = BeautifulSoup(html, "html.parser")
    item_list = bsObject.find('div', attrs={
        'class': 'list-box box'}).findAll('li', attrs={'class': 'li_box'})
    for i in item_list:
        img_url = i.find('img')[
            'data-original'].replace('_125.jpg', '_500.jpg')
        name = i.find('a', attrs={'name': 'goods_link'})['title']
        price = i.find('p', attrs={'class': 'price'}).decode_contents()
        price = re.sub(r'\<del\>.*\<\/del\>', '', price).strip()
        price = int(re.sub(r'[원,]', '', price))
    items.append({
        'name': name,
        'category': category,
        'img_url': img_url,
        'price': price,
    })


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
