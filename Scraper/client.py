import asyncio
import websockets
import string
import numpy as np

random = np.random.RandomState(10)
chars = string.digits + string.ascii_lowercase


async def hello():
    uri = 'ws://localhost:8765'
    async with websockets.connect(uri) as ws:
        name = [chars[random.randint(0, len(chars))] for i in range(10)]
        await ws.send(name)
        '''
        greeting = await ws.recv()
        print(greeting)
        '''

asyncio.get_event_loop().run_until_complete(hello())
