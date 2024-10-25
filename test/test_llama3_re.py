import pandas as pd
from sklearn.metrics import precision_score, recall_score, accuracy_score, f1_score, confusion_matrix
import ollama

def load_reviews(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = file.readlines()
    
    reviews = []
    for line in data:
        score, review = line.split('\t')
        reviews.append((int(score), review.strip()))
    return pd.DataFrame(reviews, columns=['score', 'review'])

def analyze_sentiment(review):
    response = ollama.chat(model='llama3', messages=[
        {
            "role": "system", 
            "content": "You are a professional in sentiment analysis. Check the review data given, and find out whether the sentiment is positive or negative. You may answer with 'positive' or 'negative'. don't print anything else."
        },
        {
            "role": "user",
            "content": f"This is a review: '{review}' Is the sentiment of this review positive or negative?",
        }
    ])
    sentiment = response['message']['content']
    return 1 if sentiment == "positive" else 0  # 1: Positive, 0: Negative

# 평가 지표 및 F1-score 계산
def calculate_metrics(df):
    y_true = df['score'].apply(lambda x: 1 if x > 3 else 0)  # 1: 긍정(4~5), 0: 부정(1~2)
    y_pred = df['review'].apply(analyze_sentiment)
    
    precision = precision_score(y_true, y_pred)
    recall = recall_score(y_true, y_pred)
    accuracy = accuracy_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"F1-score: {f1:.4f}")
    
    return y_true, y_pred

def error_analysis(y_true, y_pred, reviews):
    cm = confusion_matrix(y_true, y_pred)
    print("\nConfusion Matrix:")
    print(cm)

    # False Positive
    false_positive = reviews[(y_true == 0) & (y_pred == 1)]
    print("\nFalse Positives (Predicted Positive, Actual Negative):")
    for review in false_positive.head(5):  # 일부만 출력
        print(f"- {review}")

    # False Negative
    false_negative = reviews[(y_true == 1) & (y_pred == 0)]
    print("\nFalse Negatives (Predicted Negative, Actual Positive):")
    for review in false_negative.head(5):  # 일부만 출력
        print(f"- {review}")

if __name__ == '__main__':
    file_path = 'naver_shopping.txt'
    df = load_reviews(file_path)

    y_true, y_pred = calculate_metrics(df)
    error_analysis(y_true, y_pred, df['review'])
