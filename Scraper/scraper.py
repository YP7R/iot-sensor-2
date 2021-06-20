import asyncio
import websockets
import numpy as np
from datetime import datetime
import string
import json

random = np.random.RandomState(10)
chars = string.digits + string.ascii_lowercase

# https://github.com/aaugustin/websockets/issues/653
class Scraper:
    def __init__(self):
        self.users = set()
        self.values = [{'sensor_id':0,'id':0}]

    async def new_client(self, ws, path):
        self.users.add(ws)
        print(ws.origin)
        try:
            async for message in ws:
                msg = json.loads(message)
                print(f"{msg} from {ws.origin}")
                if msg['id'] == "new_client":
                    await ws.send(json.dumps(self.values))
                else:
                    print(f"Not supported : {msg.id}")
        finally:
            print(f"Disconnected : {ws.origin}")
            self.users.remove(ws)

    async def broadcast(self):
        while True:
            self.values = [self.get_sensors_values(i) for i in range(7)]
            for ws in self.users:
                await ws.send(json.dumps(self.values))

            await asyncio.sleep(5)

    def get_sensors_values(self, sensor_id):

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
start_server = websockets.serve(scraper.new_client, "127.0.0.1", 3000)
asyncio.get_event_loop().create_task(scraper.broadcast())
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
