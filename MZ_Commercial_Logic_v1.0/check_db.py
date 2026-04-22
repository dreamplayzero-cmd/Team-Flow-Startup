# check_db.py
from data.db_manager import DatabaseManager
import logging
from utils.encoding_utils import ensure_utf8_output

ensure_utf8_output()

# Disable logging for clean output
logging.getLogger('data.db_manager').setLevel(logging.WARNING)

def check():
    db = DatabaseManager()
    tables = [
        'master_areas', 
        'population_data', 
        'store_info', 
        'blog_analysis', 
        'keyword_trends'
    ]
    
    print("\n" + "="*30)
    print("      DATABASE STATUS")
    print("="*30)
    
    total_rows = 0
    for t in tables:
        res = db.execute_query(f"SELECT COUNT(*) as c FROM {t}")
        count = res[0]['c'] if res else 0
        print(f" - {t.ljust(15)} : {count} rows")
        total_rows += count
    
    print("="*30)
    print(f" Total Records: {total_rows}")
    print("="*30 + "\n")

if __name__ == "__main__":
    check()
