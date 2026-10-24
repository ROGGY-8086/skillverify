import sys
import os
sys.path.insert(0, os.path.abspath('backend'))
from routers.stats import get_market_insights

try:
    result = get_market_insights()
    print("SUCCESS")
    print(str(result)[:200])
except Exception as e:
    import traceback
    print("ERROR")
    traceback.print_exc()
