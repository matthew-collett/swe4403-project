from mqtt_handler import build_client

def main():
    client = build_client()
    client.loop_forever()

if __name__ == '__main__':
    main()
