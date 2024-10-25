from anthropic import Anthropic
import pandas as pd
from sklearn.metrics import precision_score, recall_score, accuracy_score, f1_score, confusion_matrix

client = Anthropic(api_key="")

def load_reviews(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = file.readlines()
    
    reviews = []
    for line in data:
        score, review = line.split('\t')
        reviews.append((int(score), review.strip()))
    return pd.DataFrame(reviews, columns=['score', 'review'])

def analyze_sentiment(review):
    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",  
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": f"You are a professional in sentiment analysis. Check the review data given, and find out whether the sentiment is positive or negative. you may answer with 'positive' or 'negative'. don't print anything else. : {review}"
                }
            ]
        )
        sentiment = message.content[0].text
        # print(sentiment)
        if "positive" in sentiment:
            return 1
        elif "negative" in sentiment:
            return 0
        else:
            return 0
    except Exception as e:
        print(f"Error processing review: {e}")
        return 0

def calculate_metrics(df):
    print("Calculating sentiment for reviews...")
    y_true = df['score'].apply(lambda x: 1 if x > 3 else 0)  # 1: 긍정(4~5), 0: 부정(1~2)
    y_pred = df['review'].apply(analyze_sentiment)
    
    precision = precision_score(y_true, y_pred)
    recall = recall_score(y_true, y_pred)
    accuracy = accuracy_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    
    print("\nMetrics:")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"F1-score: {f1:.4f}")
    
    return y_true, y_pred

def error_analysis(y_true, y_pred, reviews):
    cm = confusion_matrix(y_true, y_pred)
    print("\nConfusion Matrix:")
    print(cm)

    # False Positives
    false_positive = reviews[(y_true == 0) & (y_pred == 1)]
    print("\nFalse Positives (Predicted Positive, Actual Negative):")
    for review in false_positive.head(5):
        print(f"- {review}")

    # False Negatives
    false_negative = reviews[(y_true == 1) & (y_pred == 0)]
    print("\nFalse Negatives (Predicted Negative, Actual Positive):")
    for review in false_negative.head(5):
        print(f"- {review}")

if __name__ == '__main__':
    file_path = 'naver_shopping.txt'
    df = load_reviews(file_path)
    
    y_true, y_pred = calculate_metrics(df)
    error_analysis(y_true, y_pred, df['review'])