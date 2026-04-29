from api._lib.db import query
import asyncio

async def run():
    res = await query("PRAGMA table_info(orders);")
    print(res)

asyncio.run(run())
