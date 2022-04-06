import csv
import re
import os
from bs4 import BeautifulSoup
from urllib.request import urlopen
import argparse
import time
import pandas as pd

categoryMap = {
    "001": "top",
    "002": "outer",
    "003": "bottom",
    "020": "onepiece",
    "022": "skirt"
}


def parseItems(categoryNumber, page):
    parsed_items = []
    html = urlopen(
        f"https://www.musinsa.com/category/001?d_cat_cd={categoryNumber}&brand=&rate=&page_kind=search&list_kind=small&sort=pop&sub_sort=&page={page}&display_cnt=90&sale_goods=&group_sale=&kids=N&ex_soldout=&color=&price1=&price2=&exclusive_yn=&shoeSizeOption=&tags=&campaign_id=&timesale_yn=&q=&includeKeywords=&measure=")
    bsObject = BeautifulSoup(html, "html.parser")
    items = bsObject.find('div', attrs={
        'class': 'list-box box'}).findAll('li', attrs={'class': 'li_box'})

    df = pd.DataFrame(columns=['name', 'category', 'img_url', 'price'])
    for i in items:
        img_url = i.find('img')[
            'data-original'].replace('_125.jpg', '_500.jpg')
        name = i.find('a', attrs={'name': 'goods_link'})['title']
        price = i.find('p', attrs={'class': 'price'}).decode_contents()
        price = re.sub(r'\<del\>.*\<\/del\>', '', price).strip()
        parsed_items.append({

            'name': name,
            'category': categoryMap[categoryNumber],
            'img_url': img_url,
            'price': price,
        })
    df = pd.DataFrame(data=parsed_items, columns=[
                      'name', 'category', 'img_url', 'price'])
    return df


def scrape(save_dir, pages_per_category):
    df = pd.DataFrame(columns=['name', 'category', 'img_url', 'price'])
    for (categoryNumber, categoryName) in categoryMap.items():
        category_dir = f'{save_dir}/{categoryName}'
        if not os.path.isdir(category_dir):
            os.makedirs(category_dir, exist_ok=True)
        for page in range(1, pages_per_category + 1):
            fname = f'{page}.csv'
            if os.path.isfile(f'{category_dir}/{fname}'):
                continue
            df = parseItems(categoryNumber, page)
            df.to_csv(f'{category_dir}/{fname}', sep=',', header=True,
                      index=False, quoting=csv.QUOTE_ALL)
            time.sleep(1)

    return df


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--save_dir")
    parser.add_argument("--pages_per_category")
    args = parser.parse_args()
    save_dir = args.save_dir
    pages_per_category = int(args.pages_per_category)
    scrape(save_dir, pages_per_category)
