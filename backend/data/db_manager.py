# data/db_manager.py
import sqlite3
import logging
from contextlib import contextmanager
from config import settings
from data.schema import TABLE_SCHEMAS, INDEXES

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] [%(module)s] [%(funcName)s] - %(message)s',
    handlers=[
        logging.FileHandler(settings.LOG_FILE, encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class DatabaseManager:
    """SQLite 데이터베이스 관리를 위한 핵심 클래스"""
    
    def __init__(self, db_path=settings.DB_PATH):
        self.db_path = db_path
        self._initialize_db()

    @contextmanager
    def connection(self):
        """커넥션 컨텍스트 매니저 (자동 close 및 트랜잭션 관리)"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # 결과를 딕셔너리처럼 접근 가능
        conn.execute("PRAGMA foreign_keys = ON;")  # 외래 키 제약 조건 활성화
        try:
            yield conn
            conn.commit()
        except sqlite3.Error as e:
            conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            conn.close()

    def _initialize_db(self):
        """데이터베이스 및 테이블 초기화"""
        try:
            with self.connection() as conn:
                cursor = conn.cursor()
                
                # 테이블 생성
                for schema in TABLE_SCHEMAS:
                    cursor.execute(schema)
                
                # 인덱스 생성
                for index in INDEXES:
                    cursor.execute(index)
                    
                logger.info("Database initialized successfully with all schemas and indexes.")
        except Exception as e:
            logger.critical(f"Failed to initialize database: {e}")
            raise

    def execute_query(self, query, params=None):
        """단일 쿼리 실행 (SQL Injection 방지 처리)"""
        params = params or ()
        try:
            with self.connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query, params)
                return cursor.fetchall()
        except sqlite3.Error as e:
            logger.error(f"Query execution failed: {query} | Error: {e}")
            return None

    def execute_many(self, query, params_list):
        """대량 데이터 삽입/수정"""
        try:
            with self.connection() as conn:
                cursor = conn.cursor()
                cursor.executemany(query, params_list)
                logger.info(f"Successfully executed many queries. Count: {len(params_list)}")
                return True
        except sqlite3.Error as e:
            logger.error(f"Bulk execution failed: {e}")
            return False

if __name__ == "__main__":
    # 초기화 테스트
    db = DatabaseManager()
    print(f"DB initialized at: {settings.DB_PATH}")
