from openai import OpenAI
import pandas as pd
from sklearn.metrics import f1_score

client = OpenAI(api_key="")

def load_reviews(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = file.readlines()
    
    reviews = []
    for line in data:
        score, review = line.split('\t')
        reviews.append((int(score), review.strip()))
    return pd.DataFrame(reviews, columns=['score', 'review'])

def analyze_sentiment(review):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a professional in sentiment analysis. Check the review data given, and find out whether the sentiment is positive or negative. you may answer with positive or negative. only use these two words."},
            {
                "role": "user",
                "content": f"This is a review: '{review}' Is the sentiment of this review positive or negative?",
            }
        ]
    )
    sentiment = completion.choices[0].message.content
    # print(sentiment)
    return 1 if sentiment == "positive" else 0  # 1: Positive, 0: Negative

def calculate_f1_score(df):
    y_true = df['score'].apply(lambda x: 1 if x > 3 else 0)  # 1: 긍정(4~5), 0: 부정(1~2)
    y_pred = df['review'].apply(analyze_sentiment)
    return f1_score(y_true, y_pred)

if __name__ == '__main__':
    file_path = 'naver_shopping.txt'

    df = load_reviews(file_path)
    # print(df)
    f1 = calculate_f1_score(df)
    print(f"F1-score: {f1}")
