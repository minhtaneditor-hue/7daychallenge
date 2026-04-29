import sys
import re

def check_seo(text, keywords):
    words = text.split()
    word_count = len(words)
    
    results = {
        "word_count": word_count,
        "keyword_checks": []
    }
    
    for kw in keywords:
        count = len(re.findall(rf'\b{re.escape(kw)}\b', text, re.IGNORECASE))
        density = (count / word_count) * 100 if word_count > 0 else 0
        results["keyword_checks"].append({
            "keyword": kw,
            "count": count,
            "density": f"{density:.2f}%"
        })
    
    return results

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 check_seo.py 'nội dung bài viết' 'từ khóa 1, từ khóa 2'")
        sys.exit(1)
        
    content = sys.argv[1]
    kws = [k.strip() for k in sys.argv[2].split(',')]
    
    report = check_seo(content, kws)
    print("--- BÁO CÁO SEO NHANH ---")
    print(f"Tổng số từ: {report['word_count']}")
    for check in report['keyword_checks']:
        print(f"Từ khóa '{check['keyword']}': Xuất hiện {check['count']} lần (Mật độ {check['density']})")
    
    # Đưa ra đề xuất đơn giản
    if report['word_count'] < 300:
        print("⚠️ Cảnh báo: Bài viết hơi ngắn (nên > 300 từ).")
    
    density_val = float(report['keyword_checks'][0]['density'].replace('%', ''))
    if density_val > 3:
        print("⚠️ Cảnh báo: Mật độ từ khóa chính hơi cao (nên 1-3%), coi chừng bị spam.")
    elif density_val < 1:
        print("⚠️ Đề xuất: Nên chèn thêm từ khóa chính vào bài.")
