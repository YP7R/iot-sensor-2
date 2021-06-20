import asyncio
import websockets
import numpy as np
from datetime import datetime


class Scraper:
    def __init__(self):
        pass

    async def hello(self, ws, path):
        print(ws.origin)
        name = await ws.recv()
        greeting = f"Hello {name} !"
        print(greeting)
        '''
        await ws.send(greeting)
        '''

    async def get_sensors_values(self, sensor_id):
        sensor = {'sensor': sensor_id,
                  'battery': np.random.randint(60, 100),
                  'humidity': np.random.randint(20, 50),
                  'location': ['Garden', 'Bedroom', 'WC', 'Living Room', 'Kitchen', 'Room', 'Shower'][sensor_id],
                  'luminance': np.random.randint(100, 140),
                  'motion': np.random.choice(["True", "False"]),
                  'temperature': np.random.randint(20, 40),
                  'updateTime': datetime.now().strftime("%d.%m.%Y %H:%M:%S"),
                  'controller': np.random.randint(0, 1)}
        return sensor


scraper = Scraper()
start_server = websockets.serve(scraper.hello, "127.0.0.1", 3000)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
